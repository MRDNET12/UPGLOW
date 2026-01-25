import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { 
  Goal, 
  EnergyLog, 
  GoalBreakdown, 
  Task, 
  AILog,
  GoalType,
  GoalStatus 
} from '@/types/goals';

// ==================== GOALS ====================

export async function createGoal(userId: string, goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const goalsRef = collection(db, 'goals');
  const docRef = await addDoc(goalsRef, {
    ...goalData,
    userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
}

export async function getActiveGoals(userId: string): Promise<Goal[]> {
  const goalsRef = collection(db, 'goals');

  // Requête simple sans orderBy pour éviter le besoin d'index composite
  const q = query(
    goalsRef,
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);

  // Filtrer les objectifs actifs et trier côté client
  const goals = snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Goal))
    .filter(goal => goal.status === 'active' || !goal.status) // Accepter aussi les goals sans status
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // Plus récent en premier
    });

  return goals;
}

export async function getGoalById(goalId: string): Promise<Goal | null> {
  const docRef = doc(db, 'goals', goalId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  
  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate(),
    updatedAt: docSnap.data().updatedAt?.toDate()
  } as Goal;
}

export async function updateGoal(goalId: string, updates: Partial<Goal>): Promise<void> {
  const docRef = doc(db, 'goals', goalId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });
}

export async function updateGoalProgress(goalId: string, progress: number): Promise<void> {
  await updateGoal(goalId, { progress });
}

export async function archiveGoal(goalId: string): Promise<void> {
  await updateGoal(goalId, { status: 'archived' as GoalStatus });
}

// Supprimer un objectif et toutes ses tâches associées
export async function deleteGoalWithTasks(goalId: string, deletionReason?: {
  reason: 'achieved' | 'difficult' | 'hard_to_follow' | 'incoherent' | 'other_goal';
  feedback?: string;
}): Promise<void> {
  if (!db) {
    console.warn('Firebase not configured');
    return;
  }

  try {
    // 1. Supprimer toutes les tâches liées à cet objectif
    const tasksRef = collection(db, 'tasks');
    const tasksQuery = query(tasksRef, where('goalId', '==', goalId));
    const tasksSnapshot = await getDocs(tasksQuery);

    const deletePromises = tasksSnapshot.docs.map(taskDoc =>
      deleteDoc(doc(db, 'tasks', taskDoc.id))
    );
    await Promise.all(deletePromises);
    console.log(`Deleted ${tasksSnapshot.docs.length} tasks for goal ${goalId}`);

    // 2. Supprimer les breakdowns liés
    const breakdownRef = collection(db, 'goal_breakdown');
    const breakdownQuery = query(breakdownRef, where('goalId', '==', goalId));
    const breakdownSnapshot = await getDocs(breakdownQuery);

    const breakdownDeletePromises = breakdownSnapshot.docs.map(breakdownDoc =>
      deleteDoc(doc(db, 'goal_breakdown', breakdownDoc.id))
    );
    await Promise.all(breakdownDeletePromises);

    // 3. Sauvegarder le feedback de suppression (optionnel, pour analytics)
    if (deletionReason) {
      const feedbackRef = collection(db, 'goal_deletion_feedback');
      await addDoc(feedbackRef, {
        goalId,
        reason: deletionReason.reason,
        feedback: deletionReason.feedback || '',
        deletedAt: Timestamp.now()
      });
    }

    // 4. Supprimer l'objectif lui-même
    const goalRef = doc(db, 'goals', goalId);
    await deleteDoc(goalRef);

    console.log(`Goal ${goalId} deleted successfully`);
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
}

// ==================== ENERGY LOGS ====================

export async function createEnergyLog(
  userId: string, 
  logData: Omit<EnergyLog, 'id' | 'timestamp'>
): Promise<string> {
  const logsRef = collection(db, 'energy_logs');
  const docRef = await addDoc(logsRef, {
    ...logData,
    userId,
    timestamp: Timestamp.now()
  });
  return docRef.id;
}

export async function getRecentEnergyLogs(userId: string, days: number = 7): Promise<EnergyLog[]> {
  const logsRef = collection(db, 'energy_logs');
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const q = query(
    logsRef,
    where('userId', '==', userId),
    where('timestamp', '>=', Timestamp.fromDate(cutoffDate)),
    orderBy('timestamp', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate()
  } as EnergyLog));
}

export async function getLastEnergyLog(userId: string): Promise<EnergyLog | null> {
  const logsRef = collection(db, 'energy_logs');
  const q = query(
    logsRef,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(1)
  );
  
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate()
  } as EnergyLog;
}

export async function getAverageEnergy(userId: string, days: number = 7): Promise<number> {
  const logs = await getRecentEnergyLogs(userId, days);
  if (logs.length === 0) return 50; // Valeur par défaut
  
  const sum = logs.reduce((acc, log) => acc + log.energyLevel, 0);
  return Math.round(sum / logs.length);
}

// ==================== GOAL BREAKDOWN ====================

export async function createBreakdown(breakdownData: Omit<GoalBreakdown, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const breakdownRef = collection(db, 'goal_breakdown');
  const docRef = await addDoc(breakdownRef, {
    ...breakdownData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
}

export async function getGoalBreakdown(goalId: string): Promise<GoalBreakdown[]> {
  const breakdownRef = collection(db, 'goal_breakdown');
  const q = query(
    breakdownRef,
    where('goalId', '==', goalId),
    orderBy('period', 'asc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate()
  } as GoalBreakdown));
}

// ==================== TASKS ====================

export async function createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const tasksRef = collection(db, 'tasks');
  const docRef = await addDoc(tasksRef, {
    ...taskData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
}

export async function getTasksByGoal(goalId: string): Promise<Task[]> {
  const tasksRef = collection(db, 'tasks');
  const q = query(
    tasksRef,
    where('goalId', '==', goalId),
    orderBy('date', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
    completedAt: doc.data().completedAt?.toDate()
  } as Task));
}

export async function getTasksByDate(userId: string, date: string): Promise<Task[]> {
  const tasksRef = collection(db, 'tasks');
  const q = query(
    tasksRef,
    where('userId', '==', userId),
    where('date', '==', date),
    orderBy('plannedTime', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
    completedAt: doc.data().completedAt?.toDate()
  } as Task));
}

export async function completeTask(taskId: string): Promise<void> {
  const docRef = doc(db, 'tasks', taskId);
  await updateDoc(docRef, {
    completed: true,
    completedAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
  const docRef = doc(db, 'tasks', taskId);
  await updateDoc(docRef, {
    ...updates,
    modifiedByUser: true,
    updatedAt: Timestamp.now()
  });
}

export async function deleteTask(taskId: string): Promise<void> {
  const docRef = doc(db, 'tasks', taskId);
  await deleteDoc(docRef);
}

// ==================== AI LOGS ====================

export async function createAILog(logData: Omit<AILog, 'id' | 'timestamp'>): Promise<string> {
  const logsRef = collection(db, 'ai_logs');
  const docRef = await addDoc(logsRef, {
    ...logData,
    timestamp: Timestamp.now()
  });
  return docRef.id;
}

export async function getAILogs(userId: string, limit_count: number = 50): Promise<AILog[]> {
  const logsRef = collection(db, 'ai_logs');
  const q = query(
    logsRef,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(limit_count)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate()
  } as AILog));
}

// ==================== ANALYTICS ====================

export async function getGoalStats(goalId: string): Promise<{
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  averageEnergy: number;
}> {
  const tasks = await getTasksByGoal(goalId);
  const completedTasks = tasks.filter(t => t.completed).length;

  return {
    totalTasks: tasks.length,
    completedTasks,
    completionRate: tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0,
    averageEnergy: 0 // À calculer avec les energy_logs
  };
}

