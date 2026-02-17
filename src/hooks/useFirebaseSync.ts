import { useEffect, useRef, useCallback } from 'react';
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
/**
 * Hook pour synchroniser les tâches du planning avec Firebase
 * Assure aussi la persistance locale via LocalStorage
 */
export function usePlanningSync(tasksWithDates: any[], setTasksWithDates: (tasks: any[]) => void) {
  const { user } = useAuth();
  const lastSyncedTasks = useRef<string>('');
  const isInitialLoad = useRef(true);

  // Charger les tâches au démarrage (LocalStorage + Firebase)
  useEffect(() => {
    if (!isInitialLoad.current) return;

    const loadTasks = async () => {
      // 1. D'abord charger depuis LocalStorage (instantané et marche offline)
      const savedTasks = localStorage.getItem('tasksWithDates');
      let localTasks: any[] = [];

      if (savedTasks) {
        try {
          localTasks = JSON.parse(savedTasks);
          setTasksWithDates(localTasks);
          console.log('[usePlanningSync] Loaded tasks from LocalStorage:', localTasks.length);
        } catch (e) {
          console.error('[usePlanningSync] Error parsing LocalStorage:', e);
        }
      }

      // 2. Si connecté, charger depuis Firebase et merger/écraser
      if (user) {
        try {
          console.log('[usePlanningSync] Loading from Firebase for user:', user.uid);
          const firebaseTasks = await getUserTasks(user.uid);

          if (firebaseTasks.length > 0) {
            console.log('[usePlanningSync] Loaded from Firebase:', firebaseTasks.length);
            setTasksWithDates(firebaseTasks);

            // Mettre à jour le backup LocalStorage
            localStorage.setItem('tasksWithDates', JSON.stringify(firebaseTasks));
            lastSyncedTasks.current = JSON.stringify(firebaseTasks);
          } else if (localTasks.length > 0) {
            console.log('[usePlanningSync] No Firebase data found, keeping local data');
          }
        } catch (error) {
          console.error('[usePlanningSync] Error loading from Firebase:', error);
        }
      }

      isInitialLoad.current = false;
    };

    loadTasks();
  }, [user, setTasksWithDates]);

  // Sauvegarder dans LocalStorage à chaque changement (Persistance locale garantie)
  useEffect(() => {
    if (isInitialLoad.current) return;
    localStorage.setItem('tasksWithDates', JSON.stringify(tasksWithDates));
  }, [tasksWithDates]);

  // Synchroniser les changements vers Firebase quand connecté
  useEffect(() => {
    if (!user || isInitialLoad.current) return;

    const syncTasks = async () => {
      try {
        const tasksJson = JSON.stringify(tasksWithDates);

        // Ne synchroniser que si les tâches ont changé
        if (tasksJson !== lastSyncedTasks.current) {
          console.log('[usePlanningSync] Syncing changes to Firebase...');

          // Sauvegarder chaque tâche
          for (const task of tasksWithDates) {
            // Note: saveTask gère la création ou la mise à jour
            const firebaseId = await saveTask(user.uid, task);

            // Si c'est une nouvelle tâche, on met à jour son ID localement (mutation)
            // pour qu'elle soit liée à l'ID Firebase lors des prochaines syncs
            if (firebaseId && task.id !== firebaseId) {
              task.id = firebaseId;
            }
          }

          lastSyncedTasks.current = tasksJson;
          console.log('[usePlanningSync] Synced to Firebase successfully');

          // Mettre à jour localStorage avec les nouveaux IDs si nécessaire
          localStorage.setItem('tasksWithDates', JSON.stringify(tasksWithDates));
        }
      } catch (error) {
        console.error('[usePlanningSync] Error syncing to Firebase:', error);
      }
    };

    // Debounce: attendre 2 secondes après le dernier changement
    const timeoutId = setTimeout(syncTasks, 2000);

    return () => clearTimeout(timeoutId);
  }, [user, tasksWithDates]);
}

/**
 * Hook pour synchroniser les objectifs avec Firebase
 * Charge les objectifs au montage et permet de rafraîchir manuellement
 */
export function useGoalsSync() {
  const { user } = useAuth();

  // useCallback pour éviter les re-renders infinis
  const loadGoals = useCallback(async (): Promise<Goal[]> => {
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
  }, [user]);

  return {
    loadGoals,
    userId: user?.uid
  };
}

