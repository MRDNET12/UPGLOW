// Types pour la section "Mes Objectifs"

export type GoalType = 'financial' | 'project' | 'personal';

export type GoalStatus = 'active' | 'completed' | 'archived';

export type MentalState = 'calm' | 'stressed' | 'motivated' | 'tired';

export type PhysicalState = 'fit' | 'tired' | 'sick' | 'energetic';

export type BreakdownLevel = 'year' | 'quarter' | 'month' | 'week' | 'day';

export type AIAction = 
  | 'task_completed' 
  | 'task_skipped' 
  | 'task_modified' 
  | 'energy_low'
  | 'goal_created'
  | 'breakdown_generated';

// Goal (Objectif)
export interface Goal {
  id: string;
  userId: string;
  type: GoalType;
  name: string;
  
  // Questions spécifiques selon le type
  targetAmount?: number; // Pour type: financial
  targetDate: string; // YYYY-MM-DD
  timeframe?: number; // En mois
  competencies?: string[]; // Pour type: project
  
  why: string; // Pourquoi cet objectif
  desiredFeeling: string; // Ressenti recherché
  
  status: GoalStatus;
  progress: number; // 0-100
  
  createdAt: Date;
  updatedAt: Date;
}

// Energy Log (Check-in Énergie)
export interface EnergyLog {
  id: string;
  userId: string;
  energyLevel: number; // 0-100
  mentalState: MentalState;
  physicalState: PhysicalState;
  timestamp: Date;
  skipped: boolean;
}

// Goal Breakdown (Découpage par l'IA)
export interface GoalBreakdown {
  id: string;
  goalId: string;
  userId: string;
  level: BreakdownLevel;
  period: string; // "2026", "2026-Q1", "2026-01", "2026-W01", "2026-01-15"
  title: string;
  description: string;
  tasks: string[]; // Liste de tâches pour cette période
  milestones?: string[]; // Jalons importants
  
  generatedByAI: boolean;
  modifiedByUser: boolean;
  aiExplanation?: string; // Explication de la logique de découpage
  
  createdAt: Date;
  updatedAt: Date;
}

// Task (Tâche quotidienne)
export interface Task {
  id: string;
  goalId: string;
  userId: string;
  
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  
  completed: boolean;
  completedAt?: Date;
  
  generatedByAI: boolean;
  modifiedByUser: boolean;
  
  // Pour intégration avec Mon Planning
  plannedTime?: string; // HH:mm
  estimatedDuration?: number; // minutes
  
  // Adaptation selon énergie
  energyRequired?: 'low' | 'medium' | 'high';
  
  createdAt: Date;
  updatedAt: Date;
}

// AI Log (Apprentissage de l'IA)
export interface AILog {
  id: string;
  userId: string;
  goalId?: string;
  taskId?: string;
  
  action: AIAction;
  context: {
    energyLevel?: number;
    tasksCompleted?: number;
    tasksSkipped?: number;
    userModifications?: string[];
    [key: string]: any;
  };
  
  aiResponse?: string;
  aiModel: 'glowee' | 'glowee-work'; // Quelle IA a agi
  
  timestamp: Date;
}

// Questions adaptées selon le type d'objectif
export interface GoalQuestions {
  financial: {
    targetAmount: string; // "Quel chiffre d'affaires vises-tu ?"
    timeframe: string; // "En combien de temps ? (mois/années)"
    currentLevel: string; // "Où en es-tu aujourd'hui ?"
  };
  project: {
    projectName: string; // "Quel est ton projet ?"
    deadline: string; // "Quelle est ta deadline ?"
    competencies: string; // "Quelles compétences dois-tu acquérir ?"
    currentProgress: string; // "Où en es-tu dans ce projet ?"
  };
  personal: {
    goal: string; // "Quel est ton objectif personnel ?"
    deadline: string; // "Quand veux-tu l'atteindre ?"
    obstacles: string; // "Quels sont les obstacles potentiels ?"
  };
}

// Réponse de l'IA pour le découpage
export interface AIBreakdownResponse {
  goalId: string;
  breakdown: {
    year: GoalBreakdown;
    quarters: GoalBreakdown[];
    months: GoalBreakdown[];
    weeks: GoalBreakdown[];
    days: GoalBreakdown[];
  };
  explanation: string;
  phases: {
    learning?: { duration: string; focus: string[] };
    launch?: { duration: string; focus: string[] };
    optimization?: { duration: string; focus: string[] };
    scale?: { duration: string; focus: string[] };
  };
  dailyTasksLimit: number; // Max tâches par jour recommandé
}

