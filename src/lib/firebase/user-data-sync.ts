import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ==================== USER DATA SYNC ====================

/**
 * Sauvegarde les données utilisateur dans Firestore
 */
export async function saveUserData(userId: string, data: any): Promise<void> {
  if (!db) {
    console.warn('Firebase not configured, skipping save');
    return;
  }

  try {
    const userDocRef = doc(db, 'user_data', userId);
    await setDoc(userDocRef, {
      ...data,
      updatedAt: Timestamp.now()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
}

/**
 * Récupère les données utilisateur depuis Firestore
 */
export async function getUserData(userId: string): Promise<any | null> {
  if (!db) {
    console.warn('Firebase not configured, skipping fetch');
    return null;
  }

  try {
    const userDocRef = doc(db, 'user_data', userId);
    const docSnap = await getDoc(userDocRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

// ==================== PLANNING TASKS ====================

export interface TaskWithDate {
  id: string;
  text: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  type: 'glowee' | 'user';
  priority?: string;
  category?: string;
  goalId?: string;
  goalName?: string;
  goalColor?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Sauvegarde une tâche dans Firestore
 */
export async function saveTask(userId: string, task: TaskWithDate): Promise<string> {
  if (!db) {
    console.warn('Firebase not configured, skipping save');
    return task.id;
  }

  try {
    const tasksRef = collection(db, 'planning_tasks');
    
    // Si la tâche a déjà un ID Firebase, on update
    if (task.id.startsWith('firebase_')) {
      const taskId = task.id.replace('firebase_', '');
      const taskDocRef = doc(db, 'planning_tasks', taskId);
      await updateDoc(taskDocRef, {
        ...task,
        userId,
        updatedAt: Timestamp.now()
      });
      return task.id;
    }
    
    // Sinon, on crée une nouvelle tâche
    const docRef = await addDoc(tasksRef, {
      ...task,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    return `firebase_${docRef.id}`;
  } catch (error) {
    console.error('Error saving task:', error);
    throw error;
  }
}

/**
 * Récupère toutes les tâches d'un utilisateur
 */
export async function getUserTasks(userId: string): Promise<TaskWithDate[]> {
  if (!db) {
    console.warn('Firebase not configured, skipping fetch');
    return [];
  }

  try {
    const tasksRef = collection(db, 'planning_tasks');
    const q = query(tasksRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: `firebase_${doc.id}`,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as TaskWithDate));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

/**
 * Supprime une tâche de Firestore
 */
export async function deleteTask(taskId: string): Promise<void> {
  if (!db) {
    console.warn('Firebase not configured, skipping delete');
    return;
  }

  try {
    if (taskId.startsWith('firebase_')) {
      const firebaseId = taskId.replace('firebase_', '');
      const taskDocRef = doc(db, 'planning_tasks', firebaseId);
      await deleteDoc(taskDocRef);
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}

/**
 * Met à jour le statut de complétion d'une tâche
 */
export async function updateTaskCompletion(taskId: string, completed: boolean): Promise<void> {
  if (!db) {
    console.warn('Firebase not configured, skipping update');
    return;
  }

  try {
    if (taskId.startsWith('firebase_')) {
      const firebaseId = taskId.replace('firebase_', '');
      const taskDocRef = doc(db, 'planning_tasks', firebaseId);
      await updateDoc(taskDocRef, {
        completed,
        updatedAt: Timestamp.now()
      });
    }
  } catch (error) {
    console.error('Error updating task completion:', error);
    throw error;
  }
}

