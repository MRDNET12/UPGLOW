import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from './translations';

export type View = 'language-selection' | 'project-glow-intro' | 'presentation' | 'presentation-1' | 'presentation-2' | 'onboarding' | 'challenge-selection' | 'dashboard' | 'challenge' | 'journal' | 'trackers' | 'routine' | 'vision-board' | 'my-goals' | 'goal-details' | 'bonus' | 'new-me' | 'glowee-chat' | 'glow-mirror' | 'settings' | 'boundaries' | 'habit-progress' | 'goal-setup-5' | 'goal-setup-1' | 'flow-proposition' | 'flow-description' | 'flow-challenge';
export type ChallengeType = 'mind-life' | 'beauty-body';

interface ChallengeProgress {
  completedDays: number[];
  currentDay: number;
  notes: Record<number, string>;
  startDate: string | null; // Date de début du challenge (YYYY-MM-DD)
  lastCompletedDate: string | null; // Dernière date de complétion (YYYY-MM-DD)
  completedActions: Record<number, string[]>; // Actions complétées par jour (day -> action keys)
}

interface JournalEntry {
  id: string;
  date: Date;
  mood: string;
  feelings: string;
  glow: string;
  learned: string;
  freeContent: string;
}

interface TrackerData {
  date: string;
  waterGlasses: number;
  sleepHours: number;
  mood: number;
  activityMinutes: number;
  skincareCompleted: boolean;
  habits: Record<string, boolean>;
}

interface RoutineItem {
  id: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  step5: string;
}

interface VisionBoardImage {
  id: string;
  url: string;
  caption: string;
}


// Personalized Flow System
export interface FlowAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  isMandatory: boolean;
  isCompleted?: boolean;
}

export interface FlowDay {
  day: number;
  title: string;
  mandatoryActions: FlowAction[];
  choiceActions: FlowAction[];
  completed: boolean;
  selectedChoiceId?: string;
}

export interface PersonalizedFlow {
  id: string;
  objective: string;
  objectiveDescription: string;
  category?: string;
  days: FlowDay[];
  currentDay: number;
  completedDays: number[];
  startDate: string;
  isActive: boolean;
  badges: string[];
  isFromFallback?: boolean;  // ➕ Indique si le flow vient du fallback ou de l'IA
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  unlockedAt?: string;
}


interface WeeklyBonusProgress {
  sectionId: string;
  week: number; // 1-4 (pour 4 semaines)
  completed: boolean;
  completedDate?: string;
  notes?: string;
}

// Petits succès
interface SmallWin {
  id: string;
  text: string;
  date: string;
  weekNumber: number; // Numéro de la semaine dans l'année
}

// Question du soir
interface EveningQuestion {
  id: string;
  question: string;
  answer: string;
  date: string;
}

// Limites pour la paix intérieure
interface BoundaryEntry {
  id: string;
  boundaryType: string; // Clé de la limite (ex: 'no-messages-late')
  date: string;
  weekNumber: number;
}

interface BonusProgress {
  weeklyProgress: WeeklyBonusProgress[];
  checklistsCompleted: string[]; // IDs des checklists complétées
  miniGuideStepsCompleted: number[]; // Indices des étapes du mini-guide complétées
  smallWins: SmallWin[]; // Liste des petits succès
  eveningQuestions: EveningQuestion[]; // Questions du soir
  boundaryEntries: BoundaryEntry[]; // Entrées de limites
}

// Beauty Pillars Progress (for Challenge Beauté et Corps)
export interface BeautyPillarsProgress {
  [date: string]: { // YYYY-MM-DD
    'walk-sport': boolean;
    'water': boolean;
    'self-care-choice': boolean;
    selectedChoice?: string; // ID du choix sélectionné pour 'self-care-choice'
    subtasks?: {
      [subtaskId: string]: boolean; // Pour les sous-tâches comme "lash-serum", "protective-hairstyle"
    };
  };
}

// Subscription & Trial
interface SubscriptionState {
  firstOpenDate: string | null; // Date de première ouverture de l'app (YYYY-MM-DD)
  hasRegistered: boolean; // L'utilisateur s'est-il inscrit ?
  registrationDate: string | null; // Date d'inscription (YYYY-MM-DD)
  isSubscribed: boolean; // L'utilisateur a-t-il un abonnement actif ?
  subscriptionEndDate: string | null; // Date de fin d'abonnement (YYYY-MM-DD)
  hasSeenTrialPopup: boolean; // L'utilisateur a-t-il vu le popup ?
  planType: 'none' | 'glow_start' | 'glow_plus'; // Type de plan
  freeDaysUsed: number; // Nombre de jours gratuits utilisés
}

// Type de plan pour les fonctionnalités
export type PlanType = 'none' | 'glow_start' | 'glow_plus';

interface AppState {
  // Navigation
  currentView: View;
  setCurrentView: (view: View) => void;
  currentDay: number;
  setCurrentDay: (day: number) => void;
  selectedGoalId: string | null;
  setSelectedGoalId: (goalId: string | null) => void;

  // Goal Setup (Objectives)
  objectifsInitiaux: string[];
  objectifsPrioritaires: string[];
  objectifPrincipal: string;
  setObjectifsInitiaux: (objectifs: string[]) => void;
  setObjectifsPrioritaires: (objectifs: string[]) => void;
  setObjectifPrincipal: (objectif: string) => void;
  resetGoalSetup: () => void;

  // Challenge Selection
  selectedChallenge: ChallengeType | null;
  setSelectedChallenge: (challenge: ChallengeType) => void;

  // Onboarding
  hasStarted: boolean;
  startChallenge: () => void;

  // Challenge Progress
  challengeProgress: ChallengeProgress;
  toggleDayCompletion: (day: number) => void;
  updateDayNotes: (day: number, notes: string) => void;
  canAccessDay: (day: number) => boolean;
  getCurrentUnlockedDay: () => number;
  toggleActionCompletion: (day: number, actionKey: string) => void;
  isActionCompleted: (day: number, actionKey: string) => boolean;

  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  updateJournalEntry: (id: string, entry: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;

  // Trackers
  trackers: TrackerData[];
  updateTracker: (date: string, tracker: Partial<TrackerData>) => void;
  getTrackerByDate: (date: string) => TrackerData | undefined;

  // Routine
  routine: RoutineItem;
  updateRoutine: (routine: Partial<RoutineItem>) => void;
  isRoutineCompleted: (date: string) => boolean;
  setRoutineCompleted: (date: string, completed: boolean) => void;
  routineCompletedDates: string[];

  // Vision Board
  visionBoardImages: VisionBoardImage[];
  addVisionBoardImage: (image: Omit<VisionBoardImage, 'id'>) => void;
  removeVisionBoardImage: (id: string) => void;

  // Settings
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  hasSelectedLanguage: boolean;
  confirmLanguageSelection: () => void;

  // 50 Things Alone
  completedThingsAlone: number[];
  toggleThingAlone: (index: number) => void;

  // Bonus Progress
  bonusProgress: BonusProgress;
  toggleWeeklyBonus: (sectionId: string, week: number) => void;
  updateWeeklyBonusNotes: (sectionId: string, week: number, notes: string) => void;
  toggleChecklistCompleted: (checklistId: string) => void;
  toggleMiniGuideStep: (stepIndex: number) => void;
  getWeeklyBonusProgress: (sectionId: string, week: number) => WeeklyBonusProgress | undefined;
  getSectionWeeklyCompletion: (sectionId: string) => number; // Retourne le nombre de semaines complétées

  // Small Wins
  addSmallWin: (text: string) => void;
  getSmallWinsThisWeek: () => SmallWin[];
  getSmallWinsHistory: () => SmallWin[];

  // Evening Questions
  addEveningQuestion: (question: string, answer: string) => void;
  getEveningQuestionsThisMonth: () => EveningQuestion[];
  getEveningQuestionsHistory: () => EveningQuestion[];
  removeEveningQuestion: (id: string) => void;

  // Boundaries
  addBoundaryEntry: (boundaryType: string) => void;
  getBoundaryEntriesThisWeek: () => BoundaryEntry[];
  getBoundaryCountThisWeek: (boundaryType: string) => number;
  getBoundaryHistory: () => BoundaryEntry[];

  // Progress Calculation
  getProgressPercentage: () => number;

  // Subscription & Trial
  subscription: SubscriptionState;
  initializeFirstOpen: () => void;
  registerUser: () => void;
  subscribe: (endDate: string) => void;
  unsubscribe: () => void;
  getRemainingFreeDays: () => number;
  isTrialExpired: () => boolean;
  canAccessApp: () => boolean;
  canAccessFeature: (feature: 'message_a_moi' | 'petites_victoires' | 'habitudes' | 'journal' | 'glow_mirror') => boolean;
  hasExceededFreeTrial: () => boolean;
  subscribeToPlan: (planType: 'glow_start' | 'glow_plus', endDate: string) => void;
  markTrialPopupSeen: () => void;

  // Beauty Pillars (Challenge Beauté et Corps)
  beautyPillarsProgress: BeautyPillarsProgress;
  beautyValidatedDates: string[];
  toggleBeautyPillar: (date: string, pillarId: string) => void;
  selectBeautyChoice: (date: string, choiceId: string) => void;
  toggleBeautySubtask: (date: string, subtaskId: string) => void;
  getBeautyProgressForDate: (date: string) => BeautyPillarsProgress[string] | undefined;
  validateBeautyDate: (date: string) => void;

  // Personalized Flow
  personalizedFlow: PersonalizedFlow | null;
  flowDescription: string;
  isGeneratingFlow: boolean;
  setPersonalizedFlow: (flow: PersonalizedFlow | null) => void;
  setFlowDescription: (description: string) => void;
  setIsGeneratingFlow: (isGenerating: boolean) => void;
  completeFlowDay: (day: number) => void;
  toggleFlowAction: (day: number, actionId: string) => void;
  selectFlowChoice: (day: number, choiceId: string) => void;
  generatePersonalizedFlow: (objective: string, description: string) => Promise<void>;
  unlockBadge: (badgeId: string) => void;

  // Flow regeneration
  regenerateFlow: () => void;
}

// Helper function to get week number
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

const defaultRoutine: RoutineItem = {
  id: 'default',
  step1: 'Nettoyage en douceur',
  step2: 'Hydratation visage',
  step3: 'Méditation 5 min',
  step4: 'Journaling',
  step5: 'Gratitude du soir'
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Navigation
      currentView: 'language-selection',
      setCurrentView: (view) => set({ currentView: view }),
      currentDay: 1,
      setCurrentDay: (day) => set({ currentDay: day }),
      selectedGoalId: null,
      setSelectedGoalId: (goalId) => set({ selectedGoalId: goalId }),

      // Goal Setup (Objectives)
      objectifsInitiaux: [],
      objectifsPrioritaires: [],
      objectifPrincipal: '',
      setObjectifsInitiaux: (objectifs) => set({ objectifsInitiaux: objectifs }),
      setObjectifsPrioritaires: (objectifs) => set({ objectifsPrioritaires: objectifs }),
      setObjectifPrincipal: (objectif) => set({ objectifPrincipal: objectif }),
      resetGoalSetup: () => set({
        objectifsInitiaux: [],
        objectifsPrioritaires: [],
        objectifPrincipal: ''
      }),

      // Challenge Selection
      selectedChallenge: null,
      setSelectedChallenge: (challenge) => set({ selectedChallenge: challenge }),

      // Onboarding
      hasStarted: false,
      startChallenge: () => {
        const today = new Date().toISOString().split('T')[0];
        set({
          hasStarted: true,
          currentView: 'dashboard',
          challengeProgress: {
            ...get().challengeProgress,
            startDate: today
          }
        });
      },

      // Challenge Progress
      challengeProgress: {
        completedDays: [],
        currentDay: 1,
        notes: {},
        startDate: null,
        lastCompletedDate: null,
        completedActions: {}
      },
      toggleDayCompletion: (day) => {
        const { completedDays, currentDay } = get().challengeProgress;
        const today = new Date().toISOString().split('T')[0];
        const isCompleted = completedDays.includes(day);
        const newCompletedDays = isCompleted
          ? completedDays.filter((d) => d !== day)
          : [...completedDays, day].sort((a, b) => a - b);

        // Update current day to next uncompleted day
        let nextDay = 1;
        for (let i = 1; i <= 30; i++) {
          if (!newCompletedDays.includes(i)) {
            nextDay = i;
            break;
          }
        }

        set({
          challengeProgress: {
            ...get().challengeProgress,
            completedDays: newCompletedDays,
            currentDay: nextDay,
            lastCompletedDate: !isCompleted ? today : get().challengeProgress.lastCompletedDate
          }
        });
      },
      updateDayNotes: (day, notes) => {
        set({
          challengeProgress: {
            ...get().challengeProgress,
            notes: { ...get().challengeProgress.notes, [day]: notes }
          }
        });
      },
      canAccessDay: (day) => {
        const { completedDays, startDate } = get().challengeProgress;

        // Si pas de date de début, on peut accéder au jour 1 seulement
        if (!startDate) return day === 1;

        // Calculer le nombre de jours depuis le début
        const start = new Date(startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);

        const daysSinceStart = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

        // On peut accéder aux jours déjà complétés
        if (completedDays.includes(day)) return true;

        // On peut accéder au jour actuel si on a complété tous les jours précédents
        if (day <= daysSinceStart + 1) {
          // Vérifier que tous les jours précédents sont complétés
          for (let i = 1; i < day; i++) {
            if (!completedDays.includes(i)) return false;
          }
          return true;
        }

        return false;
      },
      getCurrentUnlockedDay: () => {
        const { completedDays, startDate } = get().challengeProgress;

        if (!startDate) return 1;

        // Trouver le premier jour non complété
        for (let i = 1; i <= 30; i++) {
          if (!completedDays.includes(i)) {
            return i;
          }
        }

        return 30; // Tous les jours sont complétés
      },
      toggleActionCompletion: (day, actionKey) => {
        const { completedActions = {} } = get().challengeProgress;
        const dayActions = completedActions[day] || [];
        const isCompleted = dayActions.includes(actionKey);

        const newDayActions = isCompleted
          ? dayActions.filter((key) => key !== actionKey)
          : [...dayActions, actionKey];

        set({
          challengeProgress: {
            ...get().challengeProgress,
            completedActions: {
              ...completedActions,
              [day]: newDayActions
            }
          }
        });
      },
      isActionCompleted: (day, actionKey) => {
        const { completedActions } = get().challengeProgress;
        if (!completedActions) return false;
        const dayActions = completedActions[day] || [];
        return dayActions.includes(actionKey);
      },

      // Journal
      journalEntries: [],
      addJournalEntry: (entry) => {
        const newEntry: JournalEntry = {
          ...entry,
          id: crypto.randomUUID()
        };
        set({ journalEntries: [newEntry, ...get().journalEntries] });
      },
      updateJournalEntry: (id, updatedEntry) => {
        set({
          journalEntries: get().journalEntries.map((entry) =>
            entry.id === id ? { ...entry, ...updatedEntry } : entry
          )
        });
      },
      deleteJournalEntry: (id) => {
        set({
          journalEntries: get().journalEntries.filter((entry) => entry.id !== id)
        });
      },

      // Trackers
      trackers: [],
      updateTracker: (date, tracker) => {
        const { trackers } = get();
        const existingIndex = trackers.findIndex((t) => t.date === date);

        if (existingIndex >= 0) {
          const newTrackers = [...trackers];
          newTrackers[existingIndex] = {
            ...newTrackers[existingIndex],
            ...tracker
          };
          set({ trackers: newTrackers });
        } else {
          set({
            trackers: [
              {
                date,
                waterGlasses: 0,
                sleepHours: 0,
                mood: 0,
                activityMinutes: 0,
                skincareCompleted: false,
                habits: {},
                ...tracker
              },
              ...trackers
            ]
          });
        }
      },
      getTrackerByDate: (date) => {
        return get().trackers.find((t) => t.date === date);
      },

      // Routine
      routine: defaultRoutine,
      updateRoutine: (routine) => {
        set({ routine: { ...get().routine, ...routine } });
      },
      isRoutineCompleted: (date) => {
        return get().routineCompletedDates.includes(date);
      },
      setRoutineCompleted: (date, completed) => {
        const { routineCompletedDates } = get();
        const newCompletedDates = completed
          ? [...routineCompletedDates, date]
          : routineCompletedDates.filter((d) => d !== date);
        set({ routineCompletedDates: newCompletedDates });
      },
      routineCompletedDates: [],

      // Vision Board
      visionBoardImages: [],
      addVisionBoardImage: (image) => {
        const newImage: VisionBoardImage = {
          ...image,
          id: crypto.randomUUID()
        };
        set({ visionBoardImages: [...get().visionBoardImages, newImage] });
      },
      removeVisionBoardImage: (id) => {
        set({
          visionBoardImages: get().visionBoardImages.filter((img) => img.id !== id)
        });
      },

      // Settings
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      notificationsEnabled: true,
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      language: 'fr',
      setLanguage: (language) => set({ language }),
      hasSelectedLanguage: false,
      confirmLanguageSelection: () => set({ hasSelectedLanguage: true }),

      // 50 Things Alone
      completedThingsAlone: [],
      toggleThingAlone: (index) => {
        const completed = get().completedThingsAlone;
        if (completed.includes(index)) {
          set({ completedThingsAlone: completed.filter(i => i !== index) });
        } else {
          set({ completedThingsAlone: [...completed, index] });
        }
      },

      // Bonus Progress
      bonusProgress: {
        weeklyProgress: [],
        checklistsCompleted: [],
        miniGuideStepsCompleted: [],
        smallWins: [],
        eveningQuestions: [],
        boundaryEntries: []
      },
      toggleWeeklyBonus: (sectionId, week) => {
        const { weeklyProgress } = get().bonusProgress;
        const existingIndex = weeklyProgress.findIndex(
          (p) => p.sectionId === sectionId && p.week === week
        );

        const today = new Date().toISOString().split('T')[0];

        if (existingIndex >= 0) {
          // Toggle existing
          const newProgress = [...weeklyProgress];
          newProgress[existingIndex] = {
            ...newProgress[existingIndex],
            completed: !newProgress[existingIndex].completed,
            completedDate: !newProgress[existingIndex].completed ? today : undefined
          };
          set({
            bonusProgress: {
              ...get().bonusProgress,
              weeklyProgress: newProgress
            }
          });
        } else {
          // Add new
          set({
            bonusProgress: {
              ...get().bonusProgress,
              weeklyProgress: [
                ...weeklyProgress,
                {
                  sectionId,
                  week,
                  completed: true,
                  completedDate: today
                }
              ]
            }
          });
        }
      },
      updateWeeklyBonusNotes: (sectionId, week, notes) => {
        const { weeklyProgress } = get().bonusProgress;
        const existingIndex = weeklyProgress.findIndex(
          (p) => p.sectionId === sectionId && p.week === week
        );

        if (existingIndex >= 0) {
          const newProgress = [...weeklyProgress];
          newProgress[existingIndex] = {
            ...newProgress[existingIndex],
            notes
          };
          set({
            bonusProgress: {
              ...get().bonusProgress,
              weeklyProgress: newProgress
            }
          });
        } else {
          set({
            bonusProgress: {
              ...get().bonusProgress,
              weeklyProgress: [
                ...weeklyProgress,
                {
                  sectionId,
                  week,
                  completed: false,
                  notes
                }
              ]
            }
          });
        }
      },
      toggleChecklistCompleted: (checklistId) => {
        const { checklistsCompleted } = get().bonusProgress;
        const newCompleted = checklistsCompleted.includes(checklistId)
          ? checklistsCompleted.filter((id) => id !== checklistId)
          : [...checklistsCompleted, checklistId];
        set({
          bonusProgress: {
            ...get().bonusProgress,
            checklistsCompleted: newCompleted
          }
        });
      },
      toggleMiniGuideStep: (stepIndex) => {
        const { miniGuideStepsCompleted } = get().bonusProgress;
        const newCompleted = miniGuideStepsCompleted.includes(stepIndex)
          ? miniGuideStepsCompleted.filter((i) => i !== stepIndex)
          : [...miniGuideStepsCompleted, stepIndex];
        set({
          bonusProgress: {
            ...get().bonusProgress,
            miniGuideStepsCompleted: newCompleted
          }
        });
      },
      getWeeklyBonusProgress: (sectionId, week) => {
        return get().bonusProgress.weeklyProgress.find(
          (p) => p.sectionId === sectionId && p.week === week
        );
      },
      getSectionWeeklyCompletion: (sectionId) => {
        return get().bonusProgress.weeklyProgress.filter(
          (p) => p.sectionId === sectionId && p.completed
        ).length;
      },

      // Small Wins
      addSmallWin: (text) => {
        const today = new Date();
        const weekNumber = getWeekNumber(today);
        const newWin: SmallWin = {
          id: crypto.randomUUID(),
          text,
          date: today.toISOString().split('T')[0],
          weekNumber
        };
        set({
          bonusProgress: {
            ...get().bonusProgress,
            smallWins: [newWin, ...get().bonusProgress.smallWins]
          }
        });
      },
      getSmallWinsThisWeek: () => {
        const currentWeek = getWeekNumber(new Date());
        return get().bonusProgress.smallWins.filter(
          (win) => win.weekNumber === currentWeek
        );
      },
      getSmallWinsHistory: () => {
        return get().bonusProgress.smallWins;
      },

      // Evening Questions
      addEveningQuestion: (question, answer) => {
        const newQuestion: EveningQuestion = {
          id: crypto.randomUUID(),
          question,
          answer,
          date: new Date().toISOString().split('T')[0]
        };
        set({
          bonusProgress: {
            ...get().bonusProgress,
            eveningQuestions: [newQuestion, ...get().bonusProgress.eveningQuestions]
          }
        });
      },
      getEveningQuestionsThisMonth: () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        return get().bonusProgress.eveningQuestions.filter((q) => {
          const qDate = new Date(q.date);
          return qDate.getMonth() === currentMonth && qDate.getFullYear() === currentYear;
        });
      },
      getEveningQuestionsHistory: () => {
        return get().bonusProgress.eveningQuestions;
      },
      removeEveningQuestion: (id) => {
        set({
          bonusProgress: {
            ...get().bonusProgress,
            eveningQuestions: get().bonusProgress.eveningQuestions.filter((q) => q.id !== id)
          }
        });
      },

      // Boundaries
      addBoundaryEntry: (boundaryType) => {
        const today = new Date();
        const weekNumber = getWeekNumber(today);
        const newEntry: BoundaryEntry = {
          id: crypto.randomUUID(),
          boundaryType,
          date: today.toISOString().split('T')[0],
          weekNumber
        };
        set({
          bonusProgress: {
            ...get().bonusProgress,
            boundaryEntries: [newEntry, ...get().bonusProgress.boundaryEntries]
          }
        });
      },
      getBoundaryEntriesThisWeek: () => {
        const currentWeek = getWeekNumber(new Date());
        return get().bonusProgress.boundaryEntries.filter(
          (entry) => entry.weekNumber === currentWeek
        );
      },
      getBoundaryCountThisWeek: (boundaryType) => {
        const currentWeek = getWeekNumber(new Date());
        return get().bonusProgress.boundaryEntries.filter(
          (entry) => entry.boundaryType === boundaryType && entry.weekNumber === currentWeek
        ).length;
      },
      getBoundaryHistory: () => {
        return get().bonusProgress.boundaryEntries;
      },

      // Progress Calculation
      getProgressPercentage: () => {
        const { completedDays } = get().challengeProgress;
        return Math.round((completedDays.length / 30) * 100);
      },

      // Subscription & Trial
      subscription: {
        firstOpenDate: null,
        hasRegistered: false,
        registrationDate: null,
        isSubscribed: false,
        subscriptionEndDate: null,
        hasSeenTrialPopup: false,
        planType: 'none',
        freeDaysUsed: 0
      },

      initializeFirstOpen: () => {
        const { subscription } = get();
        if (!subscription.firstOpenDate) {
          const today = new Date().toISOString().split('T')[0];
          set({
            subscription: {
              ...subscription,
              firstOpenDate: today
            }
          });
        }
      },

      registerUser: () => {
        const { subscription } = get();
        const today = new Date().toISOString().split('T')[0];
        set({
          subscription: {
            ...subscription,
            hasRegistered: true,
            registrationDate: today
          }
        });
      },

      subscribe: (endDate: string) => {
        const { subscription } = get();
        set({
          subscription: {
            ...subscription,
            isSubscribed: true,
            subscriptionEndDate: endDate
          }
        });
      },

      unsubscribe: () => {
        const { subscription } = get();
        set({
          subscription: {
            ...subscription,
            isSubscribed: false,
            subscriptionEndDate: null
          }
        });
      },

      getRemainingFreeDays: () => {
        const { subscription } = get();
        const today = new Date();

        if (subscription.isSubscribed) {
          return Infinity; // Abonné = accès illimité
        }

        if (!subscription.firstOpenDate) {
          return 3; // Pas encore ouvert l'app
        }

        const firstOpen = new Date(subscription.firstOpenDate);
        const daysSinceFirstOpen = Math.floor((today.getTime() - firstOpen.getTime()) / (1000 * 60 * 60 * 24));

        // 3 jours gratuits initiaux
        let remainingDays = 3 - daysSinceFirstOpen;

        // Si inscrit, ajouter 3 jours supplémentaires
        if (subscription.hasRegistered && subscription.registrationDate) {
          const registration = new Date(subscription.registrationDate);
          const daysSinceRegistration = Math.floor((today.getTime() - registration.getTime()) / (1000 * 60 * 60 * 24));
          remainingDays = Math.max(remainingDays, 3 - daysSinceRegistration);

          // Si on est dans les 3 premiers jours ET inscrit, on a 6 jours au total
          if (daysSinceFirstOpen < 3) {
            remainingDays = 6 - daysSinceFirstOpen;
          } else {
            remainingDays = 3 - daysSinceRegistration;
          }
        }

        return Math.max(0, remainingDays);
      },

      isTrialExpired: () => {
        return get().getRemainingFreeDays() === 0;
      },

      canAccessApp: () => {
        // L'app est accessible à tous (Flow et Ma Semaine sont gratuits)
        return true;
      },

      // Vérifier l'accès aux fonctionnalités payantes
      canAccessFeature: (feature: 'message_a_moi' | 'petites_victoires' | 'habitudes' | 'journal' | 'glow_mirror') => {
        const { subscription } = get();

        // Si abonné Glow Plus, tout est accessible
        if (subscription.planType === 'glow_plus') return true;

        // Si abonné Glow Start, accès aux features sauf Glow Mirror
        if (subscription.planType === 'glow_start') {
          return feature !== 'glow_mirror';
        }

        // Si pas abonné, vérifier les jours gratuits
        const remainingDays = get().getRemainingFreeDays();
        if (remainingDays > 0) return true;

        // Essai terminé, pas d'accès
        return false;
      },

      // Vérifier si l'utilisateur a dépassé les 3 jours gratuits
      hasExceededFreeTrial: () => {
        const { subscription } = get();
        return !subscription.isSubscribed && get().getRemainingFreeDays() === 0;
      },

      // Souscrire à un plan
      subscribeToPlan: (planType: 'glow_start' | 'glow_plus', endDate: string) => {
        const { subscription } = get();
        set({
          subscription: {
            ...subscription,
            isSubscribed: true,
            planType,
            subscriptionEndDate: endDate
          }
        });
      },

      markTrialPopupSeen: () => {
        const { subscription } = get();
        set({
          subscription: {
            ...subscription,
            hasSeenTrialPopup: true
          }
        });
      },

      // Beauty Pillars (Challenge Beauté et Corps)
      beautyPillarsProgress: {},
      beautyValidatedDates: [],

      // Personalized Flow
      personalizedFlow: null,
      flowDescription: "",
      isGeneratingFlow: false,

      validateBeautyDate: (date) => {
        const { beautyValidatedDates } = get();
        if (!beautyValidatedDates.includes(date)) {
          set({
            beautyValidatedDates: [...beautyValidatedDates, date]
          });
        }
      },

      toggleBeautyPillar: (date, pillarId) => {
        const { beautyPillarsProgress } = get();
        const dayProgress = beautyPillarsProgress[date] || {
          'walk-sport': false,
          'water': false,
          'self-care-choice': false
        };

        set({
          beautyPillarsProgress: {
            ...beautyPillarsProgress,
            [date]: {
              ...dayProgress,
              [pillarId]: !dayProgress[pillarId as keyof typeof dayProgress]
            }
          }
        });
      },

      selectBeautyChoice: (date, choiceId) => {
        const { beautyPillarsProgress } = get();
        const dayProgress = beautyPillarsProgress[date] || {
          'walk-sport': false,
          'water': false,
          'self-care-choice': false
        };

        set({
          beautyPillarsProgress: {
            ...beautyPillarsProgress,
            [date]: {
              ...dayProgress,
              'self-care-choice': true, // Auto-complete when selecting a choice
              selectedChoice: choiceId
            }
          }
        });
      },

      toggleBeautySubtask: (date, subtaskId) => {
        const { beautyPillarsProgress } = get();
        const dayProgress = beautyPillarsProgress[date] || {
          'walk-sport': false,
          'water': false,
          'self-care-choice': false
        };
        const subtasks = dayProgress.subtasks || {};

        set({
          beautyPillarsProgress: {
            ...beautyPillarsProgress,
            [date]: {
              ...dayProgress,
              subtasks: {
                ...subtasks,
                [subtaskId]: !subtasks[subtaskId]
              }
            }
          }
        });
      },

      getBeautyProgressForDate: (date) => {
        return get().beautyPillarsProgress[date];
      },

      // Personalized Flow Functions
      setPersonalizedFlow: (flow) => set({ personalizedFlow: flow }),
      setFlowDescription: (description) => set({ flowDescription: description }),
      setIsGeneratingFlow: (isGenerating) => set({ isGeneratingFlow: isGenerating }),

      completeFlowDay: (day) => {
        const { personalizedFlow } = get();
        if (!personalizedFlow) return;

        const today = new Date().toISOString().split('T')[0];
        const updatedDays = personalizedFlow.days.map((d) =>
          d.day === day ? { ...d, completed: true } : d
        );
        const newCompletedDays = [...personalizedFlow.completedDays, day].sort((a, b) => a - b);
        const nextDay = updatedDays.find((d) => !d.completed)?.day || day;

        set({
          personalizedFlow: {
            ...personalizedFlow,
            days: updatedDays,
            currentDay: nextDay,
            completedDays: newCompletedDays
          }
        });
      },

      toggleFlowAction: (day, actionId) => {
        const { personalizedFlow } = get();
        if (!personalizedFlow) return;

        const updatedDays = personalizedFlow.days.map((d) => {
          if (d.day !== day) return d;

          const updateActions = (actions: FlowAction[]) =>
            actions.map((a) =>
              a.id === actionId ? { ...a, isCompleted: !a.isCompleted } : a
            );

          return {
            ...d,
            mandatoryActions: updateActions(d.mandatoryActions),
            choiceActions: updateActions(d.choiceActions)
          };
        });

        set({
          personalizedFlow: {
            ...personalizedFlow,
            days: updatedDays
          }
        });
      },

      selectFlowChoice: (day, choiceId) => {
        const { personalizedFlow } = get();
        if (!personalizedFlow) return;

        const updatedDays = personalizedFlow.days.map((d) =>
          d.day === day ? { ...d, selectedChoiceId: choiceId } : d
        );

        set({
          personalizedFlow: {
            ...personalizedFlow,
            days: updatedDays
          }
        });
      },

      generatePersonalizedFlow: async (objective, description) => {
        set({ isGeneratingFlow: true });

        // Fonction de validation de la qualité du flow
        const validateFlowQuality = (parsedFlow: any, objective: string): { valid: boolean; reason?: string } => {
          // 1. Vérifier que les actions ne sont pas trop répétitives
          const allActions = parsedFlow.days.flatMap((day: any) => [
            day.mandatory1?.title,
            day.mandatory2?.title
          ]).filter(Boolean);

          const uniqueActions = new Set(allActions);
          if (uniqueActions.size < allActions.length * 0.6) {
            return { valid: false, reason: 'Actions trop répétitives (moins de 60% d\'actions uniques)' };
          }

          // 2. Vérifier que les descriptions sont suffisamment détaillées
          const hasDetailedDescriptions = parsedFlow.days.every((day: any) =>
            day.mandatory1?.description?.length > 15 &&
            day.mandatory2?.description?.length > 15
          );

          if (!hasDetailedDescriptions) {
            return { valid: false, reason: 'Descriptions trop courtes (minimum 15 caractères requis)' };
          }

          // 3. Vérifier la pertinence par rapport à l'objectif
          const objectiveKeywords = objective.toLowerCase().split(' ').filter(w => w.length > 3);
          const flowText = JSON.stringify(parsedFlow).toLowerCase();
          const relevanceScore = objectiveKeywords.filter(kw => flowText.includes(kw)).length;

          if (relevanceScore < Math.max(1, objectiveKeywords.length * 0.2)) {
            return { valid: false, reason: 'Flow pas assez pertinent par rapport à l\'objectif' };
          }

          console.log('[Flow Validation] ✓ Quality checks passed');
          return { valid: true };
        };

        const generateWithAI = async (): Promise<PersonalizedFlow | null> => {
          try {
            // Détecter la langue de l'objectif
            const detectLanguage = (text: string): string => {
              if (/[àâäéèêëïîôöùûüç]+/i.test(text)) return 'fr';
              if (/[áéíóúüñ¿¡]+/i.test(text)) return 'es';
              return 'en';
            };

            const lang = detectLanguage(objective + ' ' + description);

            const systemPrompt = `Tu es Glow Flow, un coach expert en transformation personnelle qui crée des programmes sur mesure.

🎯 TA MISSION : Créer un programme de 30 jours ULTRA-PERSONNALISÉ qui mène à de VRAIS RÉSULTATS.

⚠️ RÈGLE ABSOLUE : Tu DOIS OBLIGATOIREMENT utiliser ta fonction de raisonnement <think> AVANT de générer quoi que ce soit.

📋 CRITÈRES DE QUALITÉ OBLIGATOIRES :

1. ACTIONS CONCRÈTES ET ACTIONNABLES
   ❌ Mauvais : "Réfléchir à ta confiance"
   ✅ Bon : "Écrire 3 situations où tu t'es senti(e) confiant(e) cette semaine"

2. PROGRESSION CLAIRE SUR 30 JOURS
   - Structure adaptée selon l'objectif et le contexte de l'utilisateur
   - Progression logique et cohérente du jour 1 au jour 30
   - Chaque phase doit avoir un objectif clair et des actions pertinentes

3. ACTIONS DIRECTEMENT LIÉES À L'OBJECTIF
   - Chaque action doit clairement contribuer à l'objectif
   - Les descriptions doivent expliquer POURQUOI cette action aide

4. VARIÉTÉ ET UNICITÉ
   - Éviter les répétitions : chaque jour doit être unique
   - Varier les types d'actions (physique, mental, social, créatif)

5. ACTIONS SMART
   - Spécifiques : pas de généralités
   - Mesurables : l'utilisateur peut vérifier s'il l'a fait
   - Atteignables : réalisable en 10-30 minutes
   - Réalistes : adaptées au contexte décrit
   - Temporelles : à faire dans la journée

💡 EXEMPLES DE BONNES ACTIONS :
- "Tenir 1 minute de planche + 10 squats (timer)"
- "Écrire 5 choses que tu aimes chez toi dans un carnet"
- "Appeler un ami et lui dire pourquoi tu l'apprécies"
- "Préparer un smoothie vert avec épinards, banane, lait d'amande"

❌ EXEMPLES DE MAUVAISES ACTIONS :
- "Penser positif" (trop vague)
- "Faire du sport" (pas assez spécifique)
- "Être plus confiant" (pas actionnable)`;

            const userPrompt = `CONTEXTE COMPLET DE L'UTILISATEUR :

📋 DESCRIPTION DÉTAILLÉE (SOURCE PRINCIPALE - LIS ATTENTIVEMENT) :
"${description}"

🎯 OBJECTIF PRINCIPAL :
"${objective}"

🌍 LANGUE DE RÉPONSE : ${lang === 'fr' ? 'Français' : lang === 'es' ? 'Espagnol' : 'Anglais'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ PROCESSUS OBLIGATOIRE EN 3 ÉTAPES :

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ÉTAPE 1 - RAISONNEMENT APPROFONDI (OBLIGATOIRE - MINIMUM 200 CARACTÈRES)

Tu DOIS fournir ton analyse complète entre balises <think> :

<think>
1. ANALYSE DE LA SITUATION :
   - Que comprends-tu du contexte de cette personne ?
   - Quels sont ses défis principaux ?
   - Quelles sont ses ressources et forces ?

2. BESOINS IDENTIFIÉS :
   - Quels besoins spécifiques cette personne a-t-elle ?
   - Quels blocages doit-elle surmonter ?
   - Quel type de soutien lui serait le plus utile ?

3. STRATÉGIE GLOBALE :
   - Quelle approche vas-tu adopter pour ces 30 jours ?
   - Comment vas-tu structurer la progression ?
   - Quels types d'actions seront les plus efficaces ?

4. PLAN DE PROGRESSION :
   - Définis ta propre structure de phases adaptée à l'objectif
   - Nombre de phases et durée de chaque phase selon ce qui est pertinent
   - Chaque phase doit avoir un objectif clair et des actions cohérentes
</think>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ÉTAPE 2 - PLAN DÉTAILLÉ DES PHASES

Décris brièvement chaque phase selon ta structure personnalisée :
- Phase X (Jours X-Y) : [Thème, objectif, types d'actions]
- Adapte le nombre de phases et leur durée selon l'objectif

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ÉTAPE 3 - GÉNÉRATION DU FLOW (FORMAT JSON)

Génère maintenant les 30 jours au format JSON suivant :

{
  "category": "catégorie pertinente",
  "analysis": "Résumé de ton analyse en 1-2 phrases",
  "days": [
    {
      "day": 1,
      "title": "Titre inspirant du jour",
      "mandatory1": {
        "icon": "emoji pertinent",
        "title": "Action concrète et spécifique",
        "description": "Explication détaillée : quoi faire exactement et pourquoi ça aide l'objectif"
      },
      "mandatory2": {
        "icon": "emoji pertinent",
        "title": "Action concrète et spécifique",
        "description": "Explication détaillée : quoi faire exactement et pourquoi ça aide l'objectif"
      },
      "choiceOptions": {
        "optionA": {
          "icon": "emoji",
          "title": "Option A concrète",
          "description": "Pourquoi cette option est bénéfique"
        },
        "optionB": {
          "icon": "emoji",
          "title": "Option B concrète",
          "description": "Pourquoi cette option est bénéfique"
        },
        "optionC": {
          "icon": "emoji",
          "title": "Option C concrète",
          "description": "Pourquoi cette option est bénéfique"
        }
      }
    }
    // ... répéter pour les 30 jours avec PROGRESSION VISIBLE
  ]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 RAPPELS CRITIQUES :
1. Le raisonnement <think> est OBLIGATOIRE - sans lui, ta réponse sera rejetée
2. Chaque action doit être CONCRÈTE et UNIQUE
3. La progression doit être VISIBLE du jour 1 au jour 30
4. Les descriptions doivent expliquer le LIEN avec l'objectif "${objective}"
5. FORMAT JSON STRICT OBLIGATOIRE : Utilise UNIQUEMENT des guillemets doubles pour toutes les proprietes et valeurs

GÉNÈRE MAINTENANT TA RÉPONSE COMPLÈTE :`;


            // Liste des modèles à essayer par ordre de préférence
            const models = [
              'tngtech/deepseek-r1t2-chimera:free',           // Premier choix
              'arcee-ai/trinity-large-preview:free'          // Fallback si deepseek ne fonctionne pas
            ];

            let response;
            let usedModel;
            let lastError;

            // Essayer les modèles séquentiellement
            for (const model of models) {
              try {
                console.log(`[Flow Generation] Trying model: ${model}`);
                usedModel = model;

                response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
                    'HTTP-Referer': 'https://upglow.app',
                    'X-Title': 'UPGLOW Flow Generator'
                  },
                  body: JSON.stringify({
                    model: model,
                    messages: [
                      { role: 'system', content: systemPrompt },
                      { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.6,
                    max_tokens: 10000,
                    top_p: 0.9,
                    frequency_penalty: 0.3
                  })
                });

                if (response.ok) {
                  break; // Succès !
                }

                // Si erreur 404 (modèle introuvable) ou 5xx (serveur), on continue
                const errorBody = await response.text();
                console.warn(`[API Error] Model ${model} failed: ${response.status} - ${errorBody}`);
                lastError = `API Error: ${response.status} - ${errorBody}`;

                // Si c'est une 401 (Auth), pas la peine de réessayer
                if (response.status === 401) {
                  throw new Error('Invalid API Key');
                }
              } catch (e) {
                console.warn(`[Flow Generation] Error with model ${model}:`, e);
                lastError = e instanceof Error ? e.message : String(e);
              }
            }

            if (!response || !response.ok) {
              console.error('[API Error] All models failed. Last error:', lastError);
              throw new Error(lastError || 'All models failed');
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || '';

            console.log('[AI Response] Full content length:', content.length);

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // VALIDATION DU RAISONNEMENT (OPTIONNELLE)
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

            const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/);
            let reasoning = '';

            if (thinkMatch) {
              reasoning = thinkMatch[1].trim();
              console.log('[AI Response] ✅ Reasoning found, length:', reasoning.length);

              // Vérifier que le raisonnement contient les éléments clés (optionnel)
              const hasAnalysis = /analyse|situation|contexte/i.test(reasoning);
              const hasNeeds = /besoin|blocage|défi|challenge/i.test(reasoning);
              const hasStrategy = /stratégie|approche|plan|progression/i.test(reasoning);

              if (reasoning.length >= 200 && hasAnalysis && hasNeeds && hasStrategy) {
                console.log('[AI Response] ✅ Valid reasoning detected');
                console.log('[AI Response] Reasoning preview:', reasoning.substring(0, 300) + '...');
              } else {
                console.warn('[AI Response] ⚠️ Reasoning incomplete but accepting anyway');
              }
            } else {
              console.warn('[AI Response] ⚠️ No <think> reasoning found, but will try to extract JSON anyway');
            }

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // EXTRACTION DU JSON (PRIORITAIRE)
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

            // Extract JSON from response - try to find JSON block
            let jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
            if (!jsonMatch) {
              // Chercher le JSON après le bloc <think>
              const afterThink = content.split(/<\/think>/).pop() || content;
              jsonMatch = afterThink.match(/\{[\s\S]*\}/);
            }
            if (!jsonMatch) {
              console.error('[AI Response] ❌ No JSON found in response');
              console.error('[AI Response] Content after think:', content.split(/<\/think>/).pop()?.substring(0, 500));
              throw new Error('No JSON found in response - using fallback');
            }

            let jsonContent = jsonMatch[1] || jsonMatch[0];
            console.log('[AI Response] JSON extracted, length:', jsonContent.length);

            // Nettoyer le JSON avant parsing
            const cleanJson = (json: string): string => {
              // 1. Remove comments if any (simple approach)
              let cleaned = json.replace(/\/\/.*$/gm, '');

              // 2. Fix unquoted property names (e.g. key: "value" -> "key": "value")
              // Be careful not to match inside strings
              // This is a heuristic and might not cover all cases, but better than before
              cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');

              // 3. Remove trailing commas
              cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');

              // 4. Try to fix single quotes ONLY for keys or if clearly wrapping a value, 
              // BUT NEVER blindly replace all single quotes as it breaks French text (l'objectif)
              // We'll skip the single quote replacement for values to avoid breaking text

              return cleaned;
            };

            let parsed;
            try {
              parsed = JSON.parse(jsonContent);
            } catch (parseError) {
              console.warn('[AI Response] ⚠️ Initial JSON parse failed, attempting cleanup...');
              try {
                const cleanedContent = cleanJson(jsonContent);
                parsed = JSON.parse(cleanedContent);
                console.log('[AI Response] ✅ JSON parsed successfully after cleanup');
              } catch (cleanupError) {
                console.error('[AI Response] ❌ JSON parse error even after cleanup:', cleanupError);
                console.error('[AI Response] JSON content preview:', jsonContent.substring(0, 500));
                throw new Error('Invalid JSON format - using fallback');
              }
            }

            if (!parsed.days || !Array.isArray(parsed.days) || parsed.days.length < 1) {
              console.error('[AI Response] ❌ Invalid days data:', parsed);
              throw new Error('Invalid days data - using fallback');
            }

            console.log('[AI Response] ✅ Successfully parsed', parsed.days.length, 'days');

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // VALIDATION DE LA QUALITÉ DU FLOW
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

            const qualityCheck = validateFlowQuality(parsed, objective);
            if (!qualityCheck.valid) {
              console.error('[Flow Validation] ❌ Quality check failed:', qualityCheck.reason);
              throw new Error(`Flow quality validation failed: ${qualityCheck.reason} - using fallback`);
            }

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // PADDING À 30 JOURS SI NÉCESSAIRE
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

            // Ensure we have 30 days
            if (parsed.days.length < 30) {
              console.warn(`[AI Response] Only ${parsed.days.length} days received, padding to 30`);
              while (parsed.days.length < 30) {
                const lastDay = parsed.days[parsed.days.length - 1];
                parsed.days.push({
                  ...lastDay,
                  day: parsed.days.length + 1,
                  title: lastDay.title + ' (suite)'
                });
              }
            }

            console.log('[AI Response] ✅ Flow generation successful with', parsed.days.length, 'days');

            const today = new Date().toISOString().split('T')[0];

            return {
              id: crypto.randomUUID(),
              objective,
              objectiveDescription: description,
              category: parsed.category || 'general',
              days: parsed.days.map((day: any) => ({
                day: day.day,
                title: day.title,
                mandatoryActions: [
                  {
                    id: 'mandatory-1',
                    title: day.mandatory1?.title || 'Action 1',
                    description: day.mandatory1?.description || '',
                    icon: day.mandatory1?.icon || '✨',
                    isMandatory: true,
                    isCompleted: false
                  },
                  {
                    id: 'mandatory-2',
                    title: day.mandatory2?.title || 'Action 2',
                    description: day.mandatory2?.description || '',
                    icon: day.mandatory2?.icon || '🎯',
                    isMandatory: true,
                    isCompleted: false
                  }
                ],
                choiceActions: [
                  {
                    id: 'choice-a',
                    title: day.choiceOptions?.optionA?.title || 'Option A',
                    description: day.choiceOptions?.optionA?.description || '',
                    icon: day.choiceOptions?.optionA?.icon || '🔸',
                    isMandatory: false,
                    isCompleted: false
                  },
                  {
                    id: 'choice-b',
                    title: day.choiceOptions?.optionB?.title || 'Option B',
                    description: day.choiceOptions?.optionB?.description || '',
                    icon: day.choiceOptions?.optionB?.icon || '🔹',
                    isMandatory: false,
                    isCompleted: false
                  },
                  {
                    id: 'choice-c',
                    title: day.choiceOptions?.optionC?.title || 'Option C',
                    description: day.choiceOptions?.optionC?.description || '',
                    icon: day.choiceOptions?.optionC?.icon || '🔺',
                    isMandatory: false,
                    isCompleted: false
                  }
                ],
                completed: false
              })),
              currentDay: 1,
              completedDays: [],
              startDate: today,
              isActive: true,
              badges: [],
              isFromFallback: false  // ➕ Flow généré par l'IA avec raisonnement validé
            };
          } catch (error) {
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('[Flow Generation] ❌ AI generation failed');
            console.error('[Flow Generation] Error:', error);
            console.error('[Flow Generation] Objective:', objective);
            console.error('[Flow Generation] Description length:', description.length);
            console.error('[Flow Generation] Timestamp:', new Date().toISOString());
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            return null;
          }
        };

        try {
          // Try to generate with Kimi API
          let newFlow = await generateWithAI();

          // Fallback: generate default content if API fails
          if (!newFlow) {
            console.log('Using fallback flow generation');
            const today = new Date().toISOString().split('T')[0];

            // Détecter la catégorie de l'objectif pour le fallback
            const objectiveLower = objective.toLowerCase();
            let category = 'bien-etre';

            if (objectiveLower.includes('argent') || objectiveLower.includes('€') || objectiveLower.includes('business') || objectiveLower.includes('entreprise') || objectiveLower.includes('revenu') || objectiveLower.includes('salaire')) {
              category = 'finance';
            } else if (objectiveLower.includes('confiance') || objectiveLower.includes('estime') || objectiveLower.includes('anxieux') || objectiveLower.includes('peur') || objectiveLower.includes('stress')) {
              category = 'developpement';
            } else if (objectiveLower.includes('poids') || objectiveLower.includes('muscle') || objectiveLower.includes('sport') || objectiveLower.includes('fitness') || objectiveLower.includes('maigrir')) {
              category = 'sante';
            } else if (objectiveLower.includes('langue') || objectiveLower.includes('apprendre') || objectiveLower.includes('cours') || objectiveLower.includes('étudier') || objectiveLower.includes('compétence')) {
              category = 'competences';
            } else if (objectiveLower.includes('relation') || objectiveLower.includes('amour') || objectiveLower.includes('ami') || objectiveLower.includes('social') || objectiveLower.includes('rencontrer')) {
              category = 'relations';
            }

            // Actions améliorées et variées par catégorie pour le fallback
            const getActionsByCategory = (objective: string, description: string) => {
              const objectiveLower = objective.toLowerCase();
              const descLower = description.toLowerCase();

              // Détection fine de la catégorie
              let category = 'bien-etre';

              if (objectiveLower.includes('argent') || objectiveLower.includes('€') || objectiveLower.includes('business') || objectiveLower.includes('entreprise') || objectiveLower.includes('revenu') || objectiveLower.includes('salaire') || objectiveLower.includes('finance') || objectiveLower.includes('investir') || descLower.includes('entreprendre') || descLower.includes('startup')) {
                category = 'finance';
              } else if (objectiveLower.includes('confiance') || objectiveLower.includes('estime') || objectiveLower.includes('anxieux') || objectiveLower.includes('peur') || objectiveLower.includes('stress') || objectiveLower.includes('timidité') || objectiveLower.includes('introverti') || objectiveLower.includes('anxiété') || descLower.includes('confiance en soi')) {
                category = 'developpement';
              } else if (objectiveLower.includes('poids') || objectiveLower.includes('muscle') || objectiveLower.includes('sport') || objectiveLower.includes('fitness') || objectiveLower.includes('maigrir') || objectiveLower.includes('course') || objectiveLower.includes('gym') || descLower.includes('perdre du poids') || descLower.includes('muscle')) {
                category = 'sante';
              } else if (objectiveLower.includes('langue') || objectiveLower.includes('apprendre') || objectiveLower.includes('cours') || objectiveLower.includes('étudier') || objectiveLower.includes('compétence') || objectiveLower.includes('diplôme') || objectiveLower.includes('certification') || descLower.includes('formation') || descLower.includes('apprendre')) {
                category = 'competences';
              } else if (objectiveLower.includes('relation') || objectiveLower.includes('amour') || objectiveLower.includes('ami') || objectiveLower.includes('social') || objectiveLower.includes('rencontrer') || objectiveLower.includes('couple') || objectiveLower.includes('famille') || descLower.includes('relation') || descLower.includes('social')) {
                category = 'relations';
              } else if (objectiveLower.includes('sommeil') || objectiveLower.includes('dormir') || objectiveLower.includes('insomnie') || objectiveLower.includes('fatigue')) {
                category = 'sommeil';
              } else if (objectiveLower.includes('créativité') || objectiveLower.includes('art') || objectiveLower.includes('dessin') || objectiveLower.includes('musique') || objectiveLower.includes('écriture') || objectiveLower.includes('photo') || descLower.includes('créer') || descLower.includes('artistique')) {
                category = 'creativite';
              } else if (objectiveLower.includes('carrière') || objectiveLower.includes('travail') || objectiveLower.includes('job') || objectiveLower.includes('promotion') || objectiveLower.includes('boss') || objectiveLower.includes('projet pro')) {
                category = 'carriere';
              } else if (objectiveLower.includes('productivité') || objectiveLower.includes('organisation') || objectiveLower.includes('focus') || objectiveLower.includes('concentration') || objectiveLower.includes('procrastination') || objectiveLower.includes('planning')) {
                category = 'productivite';
              } else if (objectiveLower.includes('alimentation') || objectiveLower.includes('manger') || objectiveLower.includes('régime') || objectiveLower.includes('nutrition') || objectiveLower.includes('repas') || objectiveLower.includes('cuisiner') || descLower.includes('manger') || descLower.includes('alimentation')) {
                category = 'alimentation';
              }

              // Fonction de mélange aléatoire avec graine
              const seededRandom = (seed: number) => {
                const x = Math.sin(seed) * 10000;
                return x - Math.floor(x);
              };

              // Fonction pour mélanger un tableau avec graine
              const seededShuffle = (array: string[], seed: number) => {
                const shuffled = [...array];
                for (let i = shuffled.length - 1; i > 0; i--) {
                  const j = Math.floor(seededRandom(seed + i) * (i + 1));
                  [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                return shuffled;
              };

              // Données contextuelles pour personnaliser les descriptions
              const getContextualAction = (day: number, phase: number) => {
                const contexts = {
                  finance: {
                    m1: [
                      { action: '💰 Analyser une opportunité business', desc: 'Trouve 1 idée de revenu complémentaire et analyse sa faisabilité' },
                      { action: '📊 Faire un bilan financier mensuel', desc: 'Calcule tes revenus et dépenses du mois passé' },
                      { action: '💼 Contacter 3 prospects potentiels', desc: 'Envoie des messages personnalisés à 3 contacts pro' },
                      { action: '📈 Étudier un cas de succès entrepreneurial', desc: 'Lis l\'histoire d\'un entrepreneur qui a réussi dans ton domaine' },
                      { action: '💡 Brainstormer 10 idées de revenus', desc: 'Note toutes les idées, même les plus folles' },
                      { action: '🎯 Définir ton offre de services', desc: 'Clarifie ce que tu proposes et à qui' },
                      { action: '📧 Préparer ton pitch de vente', desc: 'Rédige un pitch de 30 secondes pour présenter ton offre' },
                      { action: '🏢 Analyser tes concurrents', desc: 'Étudie 3 concurrents et identifie ce qui les différencie' }
                    ],
                    m2: [
                      { action: '📚 Lire 20 min sur l\'entrepreneuriat', desc: 'Absorbe les connaissances des experts' },
                      { action: '🎧 Écouter un podcast business', desc: 'Inspire-toi des conversations entrepreneuriales' },
                      { action: '📺 Regarder une vidéo formation', desc: 'Apprends une nouvelle compétence business' },
                      { action: '📝 Noter 3 leçons apprises', desc: 'Capitalise sur tes erreurs et succès' },
                      { action: '🧮 Calculer tes projections financières', desc: 'Évalue ton potentiel de revenus à 3/6/12 mois' },
                      { action: '📊 Créer un tableau de bord KPI', desc: 'Identifie 3 indicateurs à suivre chaque semaine' },
                      { action: '💭 Visualiser ton succès financier', desc: 'Imagine ton compte bancaire avec tes objectifs atteints' },
                      { action: '🎯 Prioriser tes tâches business', desc: 'Identifie les 3 actions qui génèrent le plus d\'impact' }
                    ],
                    c1: [
                      { action: '📧 Envoyer un email professionnel', desc: 'Prends contact avec un potentiel client/partenaire' },
                      { action: '🤝 Faire du networking en ligne', desc: 'Interagis avec 5 posts de personnes dans ton domaine' },
                      { action: '📱 Poster du contenu LinkedIn', desc: 'Partage ta vision ou une expertise' },
                      { action: '🗣️ Pitcher ton projet à quelqu\'un', desc: 'Entraîne-toi à présenter ton business' }
                    ],
                    c2: [
                      { action: '⏰ Se lever 30 min plus tôt', desc: 'Gagne du temps pour ton projet business' },
                      { action: '🧘 Méditation pour la créativité', desc: 'Laisse venir les idées innovantes' },
                      { action: '📝 Tenir un journal de bord business', desc: 'Note tes idées et apprentissages quotidiens' },
                      { action: '🌟 Faire une veille concurrentielle', desc: 'Surveille ce qui se passe dans ton marché' }
                    ],
                    c3: [
                      { action: '🎁 S\'offrir un petit luxe', desc: 'Récompense-toi pour tes efforts' },
                      { action: '🍰 Célébrer une micro-victoire', desc: 'Reconnais un pas de plus vers tes objectifs' },
                      { action: '🎵 Écouter de la musique motivante', desc: 'Booste ton énergie pour continuer' },
                      { action: '🛁 Bain relaxant', desc: 'Accorde-toi un moment de détente mérité' }
                    ]
                  },
                  developpement: {
                    m1: [
                      { action: '🎯 Défi de confiance du jour', desc: 'Fais une action qui te met légèrement mal à l\'aise' },
                      { action: '🗣️ Parler à un inconnu', desc: 'Initie une conversation avec quelqu\'un d\'inconnu' },
                      { action: '💪 Faire une action qui fait peur', desc: 'Affronte une peur modérée aujourd\'hui' },
                      { action: '🌟 Te mettre en avant', desc: 'Partage un de tes succès ou compétences' },
                      { action: '✨ Sortir de ta zone de confort', desc: 'Essaye quelque chose de nouveau aujourd\'hui' },
                      { action: '💪 Tenir un power pose 2 min', desc: 'Adopte une posture confiante devant le miroir' },
                      { action: '📢 T\'exprimer clairement', desc: 'Affirme tes besoins dans une conversation' },
                      { action: '🎤 Enregistrer une vidéo de toi', desc: 'Parle devant la caméra pendant 1 minute' }
                    ],
                    m2: [
                      { action: '📝 Répéter tes affirmations positives', desc: 'Dis-toi 5 choses positives devant le miroir' },
                      { action: '🌅 Visualiser ton succès', desc: 'Imagine ta vie idéale dans 1 an en détail' },
                      { action: '📔 Journaling introspectif', desc: 'Écris tes pensées et émotions' },
                      { action: '🧘 Méditation de pleine conscience', desc: '10 min pour te reconnecter à toi-même' },
                      { action: '💭 Réfléchir à tes forces', desc: 'Liste 3 qualités qui te définissent' },
                      { action: '📚 Lire un chapitre de développement perso', desc: 'Inspire-toi des experts en confiance' },
                      { action: '🎧 Écouter un podcast motivation', desc: 'Absorbe l\'énergie positive' },
                      { action: '🌟 Célébrer un petit succès', desc: 'Reconnais quelque chose que tu as bien fait aujourd\'hui' }
                    ],
                    c1: [
                      { action: '📱 Appeler un proche aimant', desc: 'Recharge tes batteries affectives' },
                      { action: '🤗 Se faire un câlin ou demander un contact', desc: 'Le toucher réduit l\'anxiété' },
                      { action: '💌 Écrire une lettre de gratitude', desc: 'Remercie quelqu\'un qui compte pour toi' },
                      { action: '🗣️ Partager tes émotions', desc: 'Exprime ce que tu ressens à quelqu\'un de confiance' }
                    ],
                    c2: [
                      { action: '🎨 Activité créative', desc: 'Exprime-toi à travers l\'art' },
                      { action: '🎵 Chanter ou s\'exprimer', desc: 'Libère tes émotions par la voix' },
                      { action: '📖 Lire un passage inspirant', desc: 'Trouve du réconfort dans les mots' },
                      { action: '🌱 Sortir dans la nature', desc: 'Reconnecte-toi au monde naturel' }
                    ],
                    c3: [
                      { action: '🛁 Bain relaxant', desc: 'Détends ton corps et ton esprit' },
                      { action: '🍵 Pause thé et calme', desc: 'Prends 10 min rien que pour toi' },
                      { action: '🎬 Regarder un film inspirant', desc: 'Inspire-toi d\'histoires de résilience' },
                      { action: '💆 Massage auto', desc: 'Soulage les tensions physiques' }
                    ]
                  },
                  sante: {
                    m1: [
                      { action: '🏃‍♀️ 30 min de cardio ou sport', desc: 'Elève ton rythme cardiaque et transpire' },
                      { action: '💪 Séance de musculation', desc: 'Renforce tes muscles avec exercices ciblés' },
                      { action: '🧘 Yoga ou étirements profonds', desc: 'Gagne en souplesse et détends-toi' },
                      { action: '🚴 Vélo ou natation', desc: 'Activité cardiovasculaire modérée' },
                      { action: '🏊 45 min d\'activité physique', desc: 'Bouge ton corps pendant au moins 45 min' },
                      { action: '💃 Danse cardio 20 min', desc: 'Danse sur tes musiques préférées' },
                      { action: '🏃‍♂️ Course à pied ou marche rapide', desc: 'Sort pour une séance en plein air' },
                      { action: '⚽ Sport collectif ou combat', desc: 'Joue avec d\'autres ou pratique un art martial' }
                    ],
                    m2: [
                      { action: '💧 Boire 2L d\'eau', desc: 'Hydrate-toi tout au long de la journée' },
                      { action: '🥗 Manger 5 fruits et légumes', desc: 'Assure ta dose de vitamines' },
                      { action: '😴 Préparer un sommeil de 8h', desc: 'Commence ta routine du coucher tôt' },
                      { action: '🚫 Éviter le sucre raffiné aujourd\'hui', desc: 'Choisis des aliments non transformés' },
                      { action: '🍎 Préparer un smoothie healthy', desc: 'Mixe fruits, légumes verts et protéines' },
                      { action: '🥦 Intégrer des protéines végétales', desc: 'Légumineuses, tofu ou tempeh au menu' },
                      { action: '🥗 Salade composée maison', desc: 'Prépare un repas équilibré toi-même' },
                      { action: '🍵 Infusion détox', desc: 'Green tea ou tisane bienfaisante' }
                    ],
                    c1: [
                      { action: '🛁 Bain de récupération', desc: 'Eau chaude avec sels de bain' },
                      { action: '🧖‍♀️ Spa ou sauna', desc: 'Chaleur pour détendre les muscles' },
                      { action: '💆 Massage auto', desc: 'Rouleau ou automassage' },
                      { action: '🧘 Stretching profond', desc: '20 min d\'étirements complets' }
                    ],
                    c2: [
                      { action: '📱 Appel vidéo avec un proche', desc: 'Connecte-toi affectivement' },
                      { action: '🎵 Playlist motivation sport', desc: 'Crée ta playlist d\'entraînement' },
                      { action: '📺 Documentaire santé', desc: 'Inspire-toi d\'histoires de transformation' },
                      { action: '📚 Lire un chapitre sur la nutrition', desc: 'Apprends à mieux manger' }
                    ],
                    c3: [
                      { action: '🛒 Courses alimentaires planifiées', desc: 'Liste équilibrée et sans impulsion' },
                      { action: '🍳 Cuisiner un nouveau plat healthy', desc: 'Découvre une recette nutritive' },
                      { action: '📝 Planifier ses repas de la semaine', desc: 'Préparation pour manger équilibré' },
                      { action: '🥗 Batch cooking', desc: 'Prépare tes repas pour les 3 prochains jours' }
                    ]
                  },
                  competences: {
                    m1: [
                      { action: '📚 30 min de pratique active', desc: 'Exerce-toi concrètement sur ta compétence' },
                      { action: '💻 Avancer sur un projet concret', desc: 'Applique ce que tu apprends à un cas réel' },
                      { action: '🎯 Faire des exercices pratiques', desc: 'Répète pour intégrer' },
                      { action: '📝 Écrire ou créer quelque chose', desc: 'Produis un output tangible' },
                      { action: '🎨 Application créative', desc: 'Utilise ta compétence de façon créative' },
                      { action: '🎤 T\'entraîner à l\'oral', desc: 'Présente ce que tu as appris' },
                      { action: '🧪 Expérimenter librement', desc: 'Teste sans pression de résultat' },
                      { action: '🎯 Fixer un mini-objectif d\'apprentissage', desc: 'Ce que tu veux maîtriser aujourd\'hui' }
                    ],
                    m2: [
                      { action: '📖 Lire de la théorie', desc: 'Concepts fondamentaux de ta discipline' },
                      { action: '🎧 Podcast éducatif', desc: 'Apprends en faisant autre chose' },
                      { action: '📺 Tutoriel vidéo', desc: 'Visualise la technique' },
                      { action: '🗒️ Relire et organiser tes notes', desc: 'Structure tes connaissances' },
                      { action: '🧠 Utiliser Anki ou flashcards', desc: 'Mémorisation active' },
                      { action: '💭 Faire un mind map', desc: 'Connecte les concepts entre eux' },
                      { action: '📝 Résumer ce que tu as appris', desc: 'Explique avec tes mots' },
                      { action: '🎯 Identifier tes lacunes', desc: 'Note ce qu\'il te reste à maîtriser' }
                    ],
                    c1: [
                      { action: '👥 Rejoindre une communauté', desc: 'Discord, forum ou groupe d\'entraide' },
                      { action: '🤝 Trouver un partenaire d\'apprentissage', desc: 'Apprenez ensemble' },
                      { action: '💬 Partager ton progrès', desc: 'Montre ton travail en ligne' },
                      { action: '🎓 Demander du feedback', desc: 'Fais-toi coacher par un expert' }
                    ],
                    c2: [
                      { action: '🎵 Musique de concentration', desc: 'Playlist focus ou lo-fi' },
                      { action: '🧘 Méditation avant apprentissage', desc: 'Prépare ton cerveau' },
                      { action: '📱 Bloquer les distractions', desc: 'Mode avion ou app blocage' },
                      { action: '⏱️ Technique Pomodoro', desc: '25 min focus, 5 min pause' }
                    ],
                    c3: [
                      { action: '🏆 Te récompenser', desc: 'Accorde-toi un plaisir mérité' },
                      { action: '🎁 Petit cadeau à toi-même', desc: 'Livre, sortie, ou achat' },
                      { action: '🎉 Célébrer l\'effort', desc: 'Reconnais ton travail' },
                      { action: '🌟 Partager ta victoire', desc: 'Dis au monde ce que tu as accompli' }
                    ]
                  },
                  relations: {
                    m1: [
                      { action: '💬 Initier une conversation', desc: 'Prends la première initiative sociale' },
                      { action: '📱 Envoyer un message bienveillant', desc: 'Contacte quelqu\'un avec un message positif' },
                      { action: '🤝 Sortir de ta zone sociale', desc: 'Vas vers des gens que tu ne connais pas' },
                      { action: '🎯 Action sociale proactive', desc: 'Organise quelque chose avec d\'autres' },
                      { action: '🌟 Complimenter quelqu\'un sincèrement', desc: 'Dis quelque chose de gentil et authentique' },
                      { action: '🎧 Écoute active', desc: 'Écoute pour comprendre, pas pour répondre' },
                      { action: '🤗 Offrir ton aide', desc: 'Propose ton soutien à quelqu\'un' },
                      { action: '💌 Écrire à quelqu\'un que tu apprécies', desc: 'Lettre ou long message' }
                    ],
                    m2: [
                      { action: '📝 Gratitude relations', desc: 'Note 3 personnes qui enrichissent ta vie' },
                      { action: '🧘 Visualisation de connexion', desc: 'Imagine des relations positives' },
                      { action: '📔 Journal émotionnel relationnel', desc: 'Explore tes patterns relationnels' },
                      { action: '💭 Réflexion sur tes besoins', desc: 'Qu\'attends-tu de tes relations ?' },
                      { action: '🌱 Travail intérieur', desc: 'Quelles croyances limitantes affects tes relations ?' },
                      { action: '📚 Lire sur la communication', desc: 'Apprends à mieux te faire comprendre' },
                      { action: '🎧 Podcast relations', desc: 'Inspire-toi d\'experts en communication' },
                      { action: '🎯 Définir tes limites', desc: 'Identifie ce que tu acceptes ou non' }
                    ],
                    c1: [
                      { action: '📞 Appeler un ami proche', desc: 'Conversation de qualité' },
                      { action: '🍕 Sortir manger avec quelqu\'un', desc: 'Partage un moment convivial' },
                      { action: '💌 Écrire une lettre de reconnaissance', desc: 'Exprime ta gratitude' },
                      { action: '🎁 Faire une surprise', desc: 'Petit geste pour quelqu\'un' }
                    ],
                    c2: [
                      { action: '🎨 Activité créative solo', desc: 'Cultive ton individualité' },
                      { action: '📖 Lecture feel-good', desc: 'Roman ou livre qui fait du bien' },
                      { action: '🎵 Musique joyeuse', desc: 'Playlist qui met de bonne humeur' },
                      { action: '🌳 Sortie en plein air', desc: 'Prends l\'air seul(e)' }
                    ],
                    c3: [
                      { action: '🛁 Spa day maison', desc: 'Soin pour toi' },
                      { action: '🍰 Gourmandise', desc: 'Traite-toi bien' },
                      { action: '🎬 Comédie romantique', desc: 'Film léger et feel-good' },
                      { action: '🎭 Sortie culturelle', desc: 'Expo, théâtre ou ciné' }
                    ]
                  },
                  sommeil: {
                    m1: [
                      { action: '😴 Routine du coucher stricte', desc: 'Même heure, même rituel' },
                      { action: '📵 Pas d\'écrans 1h avant le lit', desc: 'Blue light = mauvais sommeil' },
                      { action: '🧘 Méditation pour s\'endormir', desc: 'Body scan ou visualisation' },
                      { action: '📓 Journaling avant le coucher', desc: 'Vide ton esprit sur le papier' },
                      { action: '🌙 Créer un environnement propice', desc: 'Obscurité, fraîcheur, silence' },
                      { action: '⏰ Fixer une heure de réveil fixe', desc: 'Même le week-end' },
                      { action: '🚫 Pas de caféine après 14h', desc: 'Protège ton sommeil' },
                      { action: '🏃‍♀️ Sport le matin ou après-midi', desc: 'Pas dans les 3h avant le coucher' }
                    ],
                    m2: [
                      { action: '📖 Lire un livre papier', desc: 'Pas d\'écran, juste une lecture calme' },
                      { action: '🎧 Sons de la nature', desc: 'Pluie, forêt ou océan pour relaxer' },
                      { action: '🌿 Tisane relaxante', desc: 'Camomille, tilleul ou valériane' },
                      { action: '🛁 Bain chaud avant le lit', desc: 'Baisse la température corporelle' },
                      { action: '💨 Aromathérapie', desc: 'Lavande ou autre huile relaxante' },
                      { action: '🧘 Respiration 4-7-8', desc: 'Inspire 4s, retiens 7s, expire 8s' },
                      { action: '🌅 Exposition lumière du jour', desc: 'Régule ton horloge biologique' },
                      { action: '✍️ Liste des soucis', desc: 'Note-les pour ne plus y penser' }
                    ],
                    c1: [
                      { action: '📱 Application de sommeil', desc: 'Suivi et analyse de tes cycles' },
                      { action: '🎵 White noise ou bruit rose', desc: 'Pour masquer les bruits' },
                      { action: '🧘 Yoga nidra', desc: 'Relaxation profonde guidée' },
                      { action: '📖 Lecture audio', desc: 'Histoire calme pour s\'endormir' }
                    ],
                    c2: [
                      { action: '🏠 Optimiser ta chambre', desc: 'Rideaux occultants, bon matelas' },
                      { action: '🌡️ Température idéale', desc: '18-20°C recommandé' },
                      { action: '🧴 Rituel soin du visage', desc: 'Douce routine relaxante' },
                      { action: '📵 Mode avion sur téléphone', desc: 'Pas de notifications' }
                    ],
                    c3: [
                      { action: '🎬 Film relaxant', desc: 'Pas d\'action ou de violence' },
                      { action: '💆 Massage des tempes', desc: 'Soulage les tensions' },
                      { action: '🍵 Lait chaud au miel', desc: 'Boisson réconfortante' },
                      { action: '📓 Gratitude du soir', desc: 'Note 3 choses positives de la journée' }
                    ]
                  },
                  creativite: {
                    m1: [
                      { action: '🎨 Créer sans jugement', desc: 'Dessine, peins ou écris librement' },
                      { action: '🎵 Composer ou jouer de la musique', desc: 'Exprime-toi par les sons' },
                      { action: '✍️ Écrire 500 mots', desc: 'Stream of consciousness' },
                      { action: '📸 Photographier 10 sujets', desc: 'Capture la beauté autour de toi' },
                      { action: '🎭 Improviser', desc: 'Danse, théâtre ou parole sans préparation' },
                      { action: '💡 Brainstormer 20 idées', desc: 'Même les plus folles' },
                      { action: '🎨 Essayer une nouvelle technique', desc: 'Étape hors de ta zone de confort artistique' },
                      { action: '🎬 Créer un court métrage', desc: 'Même de 30 secondes' }
                    ],
                    m2: [
                      { action: '📚 Lire un livre sur la créativité', desc: 'Inspire-toi des grands créateurs' },
                      { action: '🎧 Podcast d\'artistes', desc: 'Processus créatifs des autres' },
                      { action: '📺 Tutoriel artistique', desc: 'Apprends une nouvelle technique' },
                      { action: '🎭 Aller voir une exposition', desc: 'Exposition, concert ou spectacle' },
                      { action: '🌟 Collectionner l\'inspiration', desc: 'Crée un moodboard' },
                      { action: '📝 Noter tes idées créatives', desc: 'Capture chaque étincelle' },
                      { action: '🎵 Écouter un nouveau genre musical', desc: 'Ouvre ton horizon artistique' },
                      { action: '📖 Étudier un artiste inspirant', desc: 'Comprends son processus' }
                    ],
                    c1: [
                      { action: '👥 Partager ta création', desc: 'Montre ton travail, même imparfait' },
                      { action: '🤝 Collaborer avec quelqu\'un', desc: 'Créez ensemble' },
                      { action: '💬 Discuter avec un artiste', desc: 'Échange sur la création' },
                      { action: '🎓 Prendre un cours', desc: 'Atelier ou cours particulier' }
                    ],
                    c2: [
                      { action: '🎵 Playlist créative', desc: 'Musique qui stimule l\'imagination' },
                      { action: '🧘 Méditation pour la créativité', desc: 'Laisse venir les idées' },
                      { action: '📱 Éteindre les notifications', desc: 'Mode création sans interruption' },
                      { action: '🌳 Changer d\'environnement', desc: 'Crée ailleurs pour voir différemment' }
                    ],
                    c3: [
                      { action: '🎁 Matériel artistique', desc: 'Nouveau crayon, pinceau ou carnet' },
                      { action: '🌟 Se féliciter', desc: 'Créer est déjà une victoire' },
                      { action: '🎉 Célébrer une œuvre terminée', desc: 'Partage ou expose' },
                      { action: '📸 Photographier son espace créatif', desc: 'Documente ton environnement' }
                    ]
                  },
                  carriere: {
                    m1: [
                      { action: '💼 Avancer un projet important', desc: 'La tâche qui a le plus d\'impact' },
                      { action: '📧 Répondre aux emails en retard', desc: 'Nettoie ta boîte de réception' },
                      { action: '🎯 Fixer 3 priorités du jour', desc: 'Concentre-toi sur l\'essentiel' },
                      { action: '📊 Analyser tes performances', desc: 'Qu\'est-ce qui fonctionne ?' },
                      { action: '💪 Développer une compétence clé', desc: 'Ce qui te fera progresser' },
                      { action: '📈 Proposer une idée', desc: 'Amélioration ou innovation' },
                      { action: '🤝 Aider un collègue', desc: 'Renforce les liens pro' },
                      { action: '📋 Mettre à jour ton CV/LinkedIn', desc: 'Documente tes nouvelles compétences' }
                    ],
                    m2: [
                      { action: '📚 Lire sur le leadership', desc: 'Développe tes skills de manager' },
                      { action: '🎧 Podcast management', desc: 'Inspire-toi des leaders' },
                      { action: '📝 Réfléchir à ta vision pro', desc: 'Où veux-tu être dans 5 ans ?' },
                      { action: '🎯 Identifier un mentor', desc: 'Quelqu\'un à qui tu veux ressembler' },
                      { action: '💭 Feedback 360°', desc: 'Demande du feedback à plusieurs' },
                      { action: '📖 Étudier un cas d\'entreprise', desc: 'Apprends des succès et échecs' },
                      { action: '🧘 Visualiser ton succès pro', desc: 'Conférence, promotion ou projet' },
                      { action: '📊 Créer un plan de carrière', desc: 'Étape par étape' }
                    ],
                    c1: [
                      { action: '🤝 Networking professionnel', desc: 'Déjeuner ou café avec un contact' },
                      { action: '📱 Poster sur LinkedIn', desc: 'Partage ton expertise' },
                      { action: '💬 Demander conseil à un senior', desc: 'Apprends de l\'expérience' },
                      { action: '🎓 Participer à un événement', desc: 'Conférence ou meetup' }
                    ],
                    c2: [
                      { action: '⏰ Se lever tôt pour bosser', desc: 'Travaille sur ton projet perso' },
                      { action: '🧘 Méditation avant travail', desc: 'Commence la journée focus' },
                      { action: '📱 Bloquer les distractions', desc: 'Mode deep work' },
                      { action: '🌟 Organiser ton espace de travail', desc: 'Environnement propice' }
                    ],
                    c3: [
                      { action: '🎁 Se récompenser', desc: 'Pour une semaine bien travaillée' },
                      { action: '🏆 Célébrer une victoire', desc: 'Petit ou grand succès' },
                      { action: '🎬 Film sur le succès', desc: 'Inspiration entrepreneuriale' },
                      { action: '🌟 Jour de congé mérité', desc: 'Accorde-toi une pause' }
                    ]
                  },
                  productivite: {
                    m1: [
                      { action: '🎯 Technique Pomodoro 4 cycles', desc: '25 min focus, 5 min pause x 4' },
                      { action: '📋 Manger la grenouille', desc: 'Commence par la tâche la plus difficile' },
                      { action: '✅ Liste de 3 tâches prioritaires', desc: 'Pas plus, pas moins' },
                      { action: '📧 Traiter les emails en batch', desc: '2-3 fois max par jour' },
                      { action: '📊 Mesurer son temps', desc: 'Note où passe ton temps' },
                      { action: '🚫 Désactiver toutes les notifications', desc: 'Mode focus total' },
                      { action: '🏃‍♀️ Session de deep work', desc: '2h sans interruption' },
                      { action: '📈 Revoir ses objectifs', desc: 'Aligne tes actions sur tes buts' }
                    ],
                    m2: [
                      { action: '📚 Lire un chapitre sur la productivité', desc: 'Apprends de nouvelles techniques' },
                      { action: '🎧 Podcast organisation', desc: 'Systèmes et méthodes' },
                      { action: '📝 Réviser ses routines', desc: 'Optimise tes habitudes' },
                      { action: '🎯 Créer un système de capture', desc: 'Où notes-tu tes idées ?' },
                      { action: '💭 Analyser ses pics d\'énergie', desc: 'Quand es-tu le plus productif ?' },
                      { action: '📊 Dashboard de productivité', desc: 'Visualise tes métriques' },
                      { action: '🧘 Mindfulness pour focus', desc: 'Entraîne ton attention' },
                      { action: '🌟 Déclutter son espace', desc: 'Moins d\'objets = plus de clarté' }
                    ],
                    c1: [
                      { action: '🤝 Session de co-working', desc: 'Travaille avec d\'autres' },
                      { action: '👥 Trouver un accountability partner', desc: 'Qui te motive à tenir tes objectifs' },
                      { action: '💬 Partager tes objectifs', desc: 'Dit-le à quelqu\'un' },
                      { action: '🎓 Formation productivité', desc: 'Cours sur une méthode spécifique' }
                    ],
                    c2: [
                      { action: '🎵 Playlist concentration', desc: 'Musique sans parole' },
                      { action: '🧘 Méditation avant travail', desc: 'Prépare ton esprit' },
                      { action: '📱 App de blocage', desc: 'Bloque les sites distrayants' },
                      { action: '⏰ Timer visible', desc: 'Conscience du temps qui passe' }
                    ],
                    c3: [
                      { action: '🏆 Récompense après session', desc: 'Motivation positive' },
                      { action: '🎉 Célébrer une journée productive', desc: 'Reconnais ton travail' },
                      { action: '🎬 Documentaire sur le succès', desc: 'Inspiration haut niveau' },
                      { action: '🌟 Journée de repos planifiée', desc: 'Recharge tes batteries' }
                    ]
                  },
                  alimentation: {
                    m1: [
                      { action: '🥗 Préparer 3 repas équilibrés', desc: 'Protéines, légumes, glucides' },
                      { action: '💧 Boire 2,5L d\'eau', desc: 'Hydratation tout au long de la journée' },
                      { action: '🚫 Pas de sucre ajouté', desc: 'Évite les aliments transformés' },
                      { action: '🥦 Intégrer 5 portions de légumes', desc: 'Variété de couleurs' },
                      { action: '🍎 Snacks healthy', desc: 'Fruits secs, noix ou fruits frais' },
                      { action: '🍳 Cuisiner un nouveau plat', desc: 'Découvre une recette saine' },
                      { action: '📝 Tenir un food journal', desc: 'Note ce que tu manges' },
                      { action: '⚖️ Contrôler les portions', desc: 'Mange à faim, pas plus' }
                    ],
                    m2: [
                      { action: '📚 Lire sur la nutrition', desc: 'Comprends ce que tu manges' },
                      { action: '🎧 Podcast alimentation', desc: 'Santé et nutrition' },
                      { action: '📺 Documentaire food', desc: 'Inspire-toi de cultures saines' },
                      { action: '🛒 Courses planifiées', desc: 'Liste basée sur des repas prévus' },
                      { action: '📝 Apprendre 3 nouvelles recettes', desc: 'Élargis ton répertoire' },
                      { action: '🧘 Manger en pleine conscience', desc: 'Pas devant un écran' },
                      { action: '🌿 Découvrir un nouveau superfood', desc: 'Graines, légumineuses...' },
                      { action: '💭 Réfléchir à ses habitudes', desc: 'Quand manges-tu émotionnellement ?' }
                    ],
                    c1: [
                      { action: '👥 Cuisiner avec quelqu\'un', desc: 'Partage un moment convivial' },
                      { action: '🍽️ Essayer un nouveau restaurant healthy', desc: 'Inspiration culinaire' },
                      { action: '📱 Partager sa préparation', desc: 'Inspire les autres en ligne' },
                      { action: '🎓 Cours de cuisine', desc: 'Apprends des techniques' }
                    ],
                    c2: [
                      { action: '🎵 Musique pendant la cuisine', desc: 'Moment agréable' },
                      { action: '🧘 Méditation avant repas', desc: 'Apprécie ton aliment' },
                      { action: '📱 Appli de recettes', desc: 'Découvre de nouvelles idées' },
                      { action: '🍽️ Dresser joliment son assiette', desc: 'Mange avec les yeux' }
                    ],
                    c3: [
                      { action: '🎁 Nouveau livre de recettes', desc: 'Inspiration garantie' },
                      { action: '🍰 Gourmandise occasionnelle', desc: '80/20 rule - sans culpabilité' },
                      { action: '🎉 Célébrer une semaine équilibrée', desc: 'Reconnais tes efforts' },
                      { action: '📸 Photographier ses plats', desc: 'Documente tes créations' }
                    ]
                  },
                  'bien-etre': {
                    m1: [
                      { action: '🚶‍♀️ 30 min de marche active', desc: 'Bouge en plein air' },
                      { action: '🏃‍♀️ Activité physique 20 min', desc: 'Cardio ou renforcement' },
                      { action: '🧘 Yoga ou stretching 15 min', desc: 'Soulage les tensions' },
                      { action: '💃 Danse libre 10 min', desc: 'Bouge sans jugement' },
                      { action: '🏊 Nage ou aquagym', desc: 'Sport doux et complet' },
                      { action: '🚴 Vélo ou randonnée', desc: 'Découvre tout en bougeant' },
                      { action: '💪 Routine express 10 min', desc: 'Squats, pompes, abdos' },
                      { action: '🤸 Étirements du réveil', desc: 'Réveille ton corps en douceur' }
                    ],
                    m2: [
                      { action: '💆‍♀️ Rituel beauté complet', desc: 'Nettoyage, soin, hydratation' },
                      { action: '🧴 Soin visage détaillé', desc: 'Gommage, masque, crème' },
                      { action: '🛁 Bain relaxant 20 min', desc: 'Sels et bougies' },
                      { action: '🌸 Aromathérapie', desc: 'Huiles essentielles relaxantes' },
                      { action: '🧘 Méditation guidée 10 min', desc: 'Apaisement mental' },
                      { action: '📖 Journaling positif', desc: 'Note 3 moments de joie' },
                      { action: '🎵 Musique relaxante', desc: 'Playlist bien-être' },
                      { action: '🌿 Tisane détente', desc: 'Camomille, tilleul, lavande' }
                    ],
                    c1: [
                      { action: '🧽 Brossage à sec', desc: 'Stimule la circulation' },
                      { action: '🦵 Gommage corps maison', desc: 'Sucre + huile végétale' },
                      { action: '🧖‍♀️ Exfoliation douce', desc: 'Renouvelle ta peau' },
                      { action: '🧴 Huile corporelle', desc: 'Massage hydratant' }
                    ],
                    c2: [
                      { action: '🧴 Crème hydratante', desc: 'Après la douche' },
                      { action: '🌺 Huile pour le corps', desc: 'Massage relaxant' },
                      { action: '💅 Manucure soignée', desc: 'Ongles propres et lustrés' },
                      { action: '🦶 Soin des pieds', desc: 'Pédicure maison' }
                    ],
                    c3: [
                      { action: '✨ Masque cheveux nourrissant', desc: 'Huile de coco ou karité' },
                      { action: '💇 Soin capillaire', desc: 'Masque ou sérum' },
                      { action: '🎀 Coiffure soignée', desc: 'Chignon, tresses ou brushing' },
                      { action: '👁️ Sourcils et cils', desc: 'Brosse et hydratation' }
                    ]
                  }
                };

                const catActions = contexts[category as keyof typeof contexts] || contexts['bien-etre'];

                // Mélanger les actions pour chaque phase avec une graine différente
                const seed = day * 1000 + (objective.length % 100);
                const shuffledM1 = seededShuffle(catActions.m1.map(a => a.action), seed);
                const shuffledM2 = seededShuffle(catActions.m2.map(a => a.action), seed + 1);
                const shuffledC1 = seededShuffle(catActions.c1.map(a => a.action), seed + 2);
                const shuffledC2 = seededShuffle(catActions.c2.map(a => a.action), seed + 3);
                const shuffledC3 = seededShuffle(catActions.c3.map(a => a.action), seed + 4);

                // Obtenir la description contextuelle
                const getDesc = (actionList: typeof catActions.m1, action: string) => {
                  const found = actionList.find(a => a.action === action);
                  return found?.desc || 'Action pour progresser vers ton objectif';
                };

                return {
                  category,
                  m1: { action: shuffledM1[day % shuffledM1.length], desc: getDesc(catActions.m1, shuffledM1[day % shuffledM1.length]) },
                  m2: { action: shuffledM2[day % shuffledM2.length], desc: getDesc(catActions.m2, shuffledM2[day % shuffledM2.length]) },
                  c1: { action: shuffledC1[day % shuffledC1.length], desc: getDesc(catActions.c1, shuffledC1[day % shuffledC1.length]) },
                  c2: { action: shuffledC2[day % shuffledC2.length], desc: getDesc(catActions.c2, shuffledC2[day % shuffledC2.length]) },
                  c3: { action: shuffledC3[day % shuffledC3.length], desc: getDesc(catActions.c3, shuffledC3[day % shuffledC3.length]) }
                };
              };

              return getContextualAction;
            };

            const getActionForDay = getActionsByCategory(objective, description);

            newFlow = {
              id: crypto.randomUUID(),
              objective,
              objectiveDescription: description,
              category: getActionForDay(1, 1).category,
              days: Array.from({ length: 30 }, (_, i) => {
                const day = i + 1;
                const phase = Math.floor(day / 8) + 1; // Phase 1-4
                const actions = getActionForDay(day, phase);

                // Titres progressifs selon la phase
                const phaseEmojis = [
                  ['🌱', '💧', '🌿', '🌸', '🌺', '🌻', '🌷', '🌹'], // Phase 1: Découverte
                  ['🔥', '⚡', '💪', '🎯', '🚀', '⭐', '💫', '✨'], // Phase 2: Intensification
                  ['👑', '🏆', '🎖️', '🥇', '💎', '🔮', '🌟', '⚜️'], // Phase 3: Maîtrise
                  ['🦋', '🌈', '💐', '🎊', '🎉', '🌺', '✨', '👑']  // Phase 4: Transformation
                ];

                const phaseTitles = [
                  'Fondation', 'Exploration', 'Éveil', 'Prise de conscience',
                  'Pratique', 'Expérimentation', 'Action', 'Défi',
                  'Consolidation', 'Perfectionnement', 'Excellence', 'Maîtrise',
                  'Intensification', 'Push', 'Transformation', 'Métamorphose',
                  'Autonomie', 'Leadership', 'Rayonnement', 'Accomplissement',
                  'Résilience', 'Persévérance', 'Dépassement', 'Victoire',
                  'Célébration', 'Gratitude', 'Intégration', 'Vision'
                ];

                const phaseIndex = Math.min(phase - 1, 3);
                const emoji = phaseEmojis[phaseIndex][i % 8];
                const titlePrefix = phaseTitles[i % phaseTitles.length];

                return {
                  day,
                  title: `${emoji} ${titlePrefix} - Jour ${day}`,
                  mandatoryActions: [
                    {
                      id: 'mandatory-1',
                      title: actions.m1.action.replace(/^[\u{1F300}-\u{1F9FF}]\s*/u, ''),
                      description: actions.m1.desc,
                      icon: actions.m1.action.match(/^[\u{1F300}-\u{1F9FF}]/u)?.[0] || '🔥',
                      isMandatory: true,
                      isCompleted: false
                    },
                    {
                      id: 'mandatory-2',
                      title: actions.m2.action.replace(/^[\u{1F300}-\u{1F9FF}]\s*/u, ''),
                      description: actions.m2.desc,
                      icon: actions.m2.action.match(/^[\u{1F300}-\u{1F9FF}]/u)?.[0] || '💎',
                      isMandatory: true,
                      isCompleted: false
                    }
                  ],
                  choiceActions: [
                    {
                      id: 'choice-a',
                      title: actions.c1.action.replace(/^[\u{1F300}-\u{1F9FF}]\s*/u, ''),
                      description: actions.c1.desc,
                      icon: actions.c1.action.match(/^[\u{1F300}-\u{1F9FF}]/u)?.[0] || '🌟',
                      isMandatory: false,
                      isCompleted: false
                    },
                    {
                      id: 'choice-b',
                      title: actions.c2.action.replace(/^[\u{1F300}-\u{1F9FF}]\s*/u, ''),
                      description: actions.c2.desc,
                      icon: actions.c2.action.match(/^[\u{1F300}-\u{1F9FF}]/u)?.[0] || '💫',
                      isMandatory: false,
                      isCompleted: false
                    },
                    {
                      id: 'choice-c',
                      title: actions.c3.action.replace(/^[\u{1F300}-\u{1F9FF}]\s*/u, ''),
                      description: actions.c3.desc,
                      icon: actions.c3.action.match(/^[\u{1F300}-\u{1F9FF}]/u)?.[0] || '✨',
                      isMandatory: false,
                      isCompleted: false
                    }
                  ],
                  completed: false
                };
              }),
              currentDay: 1,
              completedDays: [],
              startDate: today,
              isActive: true,
              badges: [],
              isFromFallback: true  // ⚠️ Flow généré par le fallback (IA n'a pas pu générer)
            };

            console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.warn('[Fallback] ⚠️ Using fallback flow generation');
            console.warn('[Fallback] Category detected:', category);
            console.warn('[Fallback] Objective:', objective);
            console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          }

          set({
            personalizedFlow: newFlow,
            flowDescription: description,
            isGeneratingFlow: false
          });
        } catch (error) {
          console.error('Error generating flow:', error);
          set({ isGeneratingFlow: false });
          throw error;
        }
      },

      unlockBadge: (badgeId) => {
        const { personalizedFlow } = get();
        if (!personalizedFlow) return;

        if (!personalizedFlow.badges.includes(badgeId)) {
          set({
            personalizedFlow: {
              ...personalizedFlow,
              badges: [...personalizedFlow.badges, badgeId]
            }
          });
        }
      },

      regenerateFlow: () => {
        set({
          personalizedFlow: null,
          flowDescription: '',
          isGeneratingFlow: false,
          currentView: 'flow-description'
        });
      }
    }),
    {
      name: 'glow-up-storage',
      version: 3,
      migrate: (persistedState: any, version: number) => {
        // Migration from version 1 to 2: add completedActions if missing
        if (version < 2) {
          if (persistedState.challengeProgress && !persistedState.challengeProgress.completedActions) {
            persistedState.challengeProgress.completedActions = {};
          }
          if (persistedState.bonusProgress && !persistedState.bonusProgress.smallWins) {
            persistedState.bonusProgress.smallWins = [];
            persistedState.bonusProgress.eveningQuestions = [];
            persistedState.bonusProgress.boundaryEntries = [];
          }
        }
        // Migration from version 2 to 3: add subscription state
        if (version < 3) {
          if (!persistedState.subscription) {
            persistedState.subscription = {
              firstOpenDate: null,
              hasRegistered: false,
              registrationDate: null,
              isSubscribed: false,
              subscriptionEndDate: null,
              hasSeenTrialPopup: false
            };
          }
        }
        return persistedState;
      }
    }
  )
);
