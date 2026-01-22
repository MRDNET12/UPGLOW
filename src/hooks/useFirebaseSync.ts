import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveUserData, getUserData, saveTask, getUserTasks, deleteTask as deleteTaskFromFirebase, updateTaskCompletion } from '@/lib/firebase/user-data-sync';
import { getActiveGoals } from '@/lib/firebase/goals-service';
import type { Goal } from '@/types/goals';

/**
 * Hook pour synchroniser automatiquement les données avec Firebase
 */
export function useFirebaseSync(store: any) {
  const { user } = useAuth();
  const isInitialLoad = useRef(true);
  const lastSyncedData = useRef<string>('');

  // Charger les données depuis Firebase au montage
  useEffect(() => {
    if (!user || !isInitialLoad.current) return;

    const loadDataFromFirebase = async () => {
      try {
        console.log('Loading data from Firebase for user:', user.uid);
        
        // Charger les tâches du planning
        const tasks = await getUserTasks(user.uid);
        if (tasks.length > 0) {
          console.log('Loaded tasks from Firebase:', tasks.length);
          // Mettre à jour le store avec les tâches Firebase
          // Note: On ne remplace pas les tâches locales, on les merge
          const currentTasks = store.getState().tasksWithDates || [];
          const localTaskIds = new Set(currentTasks.map((t: any) => t.id));
          const newTasks = tasks.filter(t => !localTaskIds.has(t.id));
          
          if (newTasks.length > 0) {
            store.setState({
              tasksWithDates: [...currentTasks, ...newTasks]
            });
          }
        }

        // Charger les autres données utilisateur
        const userData = await getUserData(user.uid);
        if (userData) {
          console.log('Loaded user data from Firebase');
          // Merge avec les données locales
          const currentState = store.getState();
          
          // Ne pas écraser les données locales si elles sont plus récentes
          if (userData.journalEntries && (!currentState.journalEntries || currentState.journalEntries.length === 0)) {
            store.setState({ journalEntries: userData.journalEntries });
          }
          
          if (userData.trackers && (!currentState.trackers || currentState.trackers.length === 0)) {
            store.setState({ trackers: userData.trackers });
          }
          
          if (userData.bonusProgress) {
            store.setState({ bonusProgress: { ...currentState.bonusProgress, ...userData.bonusProgress } });
          }
        }

        isInitialLoad.current = false;
      } catch (error) {
        console.error('Error loading data from Firebase:', error);
        isInitialLoad.current = false;
      }
    };

    loadDataFromFirebase();
  }, [user, store]);

  // Sauvegarder les données dans Firebase quand elles changent
  useEffect(() => {
    if (!user || isInitialLoad.current) return;

    const saveDataToFirebase = async () => {
      try {
        const state = store.getState();
        const dataToSync = {
          journalEntries: state.journalEntries,
          trackers: state.trackers,
          bonusProgress: state.bonusProgress,
          routine: state.routine,
          visionBoardImages: state.visionBoardImages,
          completedThingsAlone: state.completedThingsAlone,
          challengeProgress: state.challengeProgress
        };

        // Convertir en JSON pour comparer
        const currentDataJson = JSON.stringify(dataToSync);
        
        // Ne sauvegarder que si les données ont changé
        if (currentDataJson !== lastSyncedData.current) {
          console.log('Syncing data to Firebase...');
          await saveUserData(user.uid, dataToSync);
          lastSyncedData.current = currentDataJson;
          console.log('Data synced to Firebase successfully');
        }
      } catch (error) {
        console.error('Error syncing data to Firebase:', error);
      }
    };

    // Debounce: attendre 2 secondes après le dernier changement
    const timeoutId = setTimeout(saveDataToFirebase, 2000);

    return () => clearTimeout(timeoutId);
  }, [user, store, store.getState()]);

  return {
    isLoading: isInitialLoad.current,
    user
  };
}

/**
 * Hook pour synchroniser les tâches du planning avec Firebase
 */
export function usePlanningSync(tasksWithDates: any[], setTasksWithDates: (tasks: any[]) => void) {
  const { user } = useAuth();
  const lastSyncedTasks = useRef<string>('');
  const isInitialLoad = useRef(true);

  // Charger les tâches depuis Firebase au montage
  useEffect(() => {
    if (!user || !isInitialLoad.current) return;

    const loadTasksFromFirebase = async () => {
      try {
        console.log('Loading planning tasks from Firebase for user:', user.uid);
        const firebaseTasks = await getUserTasks(user.uid);

        if (firebaseTasks.length > 0) {
          console.log('Loaded planning tasks from Firebase:', firebaseTasks.length);
          setTasksWithDates(firebaseTasks);
          // Sauvegarder aussi dans localStorage pour backup
          localStorage.setItem('tasksWithDates', JSON.stringify(firebaseTasks));
          lastSyncedTasks.current = JSON.stringify(firebaseTasks);
        } else {
          // Si pas de tâches Firebase, charger depuis localStorage
          const savedTasks = localStorage.getItem('tasksWithDates');
          if (savedTasks) {
            const localTasks = JSON.parse(savedTasks);
            setTasksWithDates(localTasks);
            console.log('Loaded planning tasks from localStorage:', localTasks.length);
          }
        }

        isInitialLoad.current = false;
      } catch (error) {
        console.error('Error loading planning tasks from Firebase:', error);
        // Fallback vers localStorage en cas d'erreur
        const savedTasks = localStorage.getItem('tasksWithDates');
        if (savedTasks) {
          setTasksWithDates(JSON.parse(savedTasks));
        }
        isInitialLoad.current = false;
      }
    };

    loadTasksFromFirebase();
  }, [user, setTasksWithDates]);

  // Synchroniser les changements vers Firebase
  useEffect(() => {
    if (!user || !tasksWithDates || isInitialLoad.current) return;

    const syncTasks = async () => {
      try {
        const tasksJson = JSON.stringify(tasksWithDates);

        // Ne synchroniser que si les tâches ont changé
        if (tasksJson !== lastSyncedTasks.current) {
          console.log('Syncing tasks to Firebase...');

          // Sauvegarder chaque tâche
          for (const task of tasksWithDates) {
            // Ne sauvegarder que les tâches qui ne sont pas déjà dans Firebase
            if (!task.id.startsWith('firebase_')) {
              const firebaseId = await saveTask(user.uid, task);
              // Mettre à jour l'ID local avec l'ID Firebase
              task.id = firebaseId;
            } else {
              // Mettre à jour la tâche existante
              await saveTask(user.uid, task);
            }
          }

          lastSyncedTasks.current = tasksJson;
          console.log('Tasks synced to Firebase successfully');

          // Sauvegarder aussi dans localStorage pour backup
          localStorage.setItem('tasksWithDates', JSON.stringify(tasksWithDates));
        }
      } catch (error) {
        console.error('Error syncing tasks to Firebase:', error);
      }
    };

    // Debounce: attendre 2 secondes après le dernier changement
    const timeoutId = setTimeout(syncTasks, 2000);

    return () => clearTimeout(timeoutId);
  }, [user, tasksWithDates, setTasksWithDates]);
}

/**
 * Hook pour synchroniser les objectifs avec Firebase
 * Charge les objectifs au montage et permet de rafraîchir manuellement
 */
export function useGoalsSync() {
  const { user } = useAuth();
  const isInitialLoad = useRef(true);

  const loadGoals = async (): Promise<Goal[]> => {
    if (!user) return [];

    try {
      console.log('Loading goals from Firebase for user:', user.uid);
      const firebaseGoals = await getActiveGoals(user.uid);
      console.log('Loaded goals from Firebase:', firebaseGoals.length);
      return firebaseGoals;
    } catch (error) {
      console.error('Error loading goals from Firebase:', error);
      return [];
    }
  };

  return {
    loadGoals,
    userId: user?.uid
  };
}

