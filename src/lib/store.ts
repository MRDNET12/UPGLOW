import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from './translations';

export type View = 'language-selection' | 'presentation' | 'presentation-1' | 'presentation-2' | 'onboarding' | 'challenge-selection' | 'dashboard' | 'challenge' | 'journal' | 'trackers' | 'routine' | 'vision-board' | 'my-goals' | 'goal-details' | 'bonus' | 'new-me' | 'glowee-chat' | 'glow-mirror' | 'settings' | 'boundaries' | 'habit-progress' | 'goal-setup-5' | 'goal-setup-3' | 'goal-setup-1' | 'flow-proposition' | 'flow-description' | 'flow-challenge';
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
  days: FlowDay[];
  currentDay: number;
  completedDays: number[];
  startDate: string;
  isActive: boolean;
  badges: string[];
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
  hasRegistered: boolean; // L'utilisateur s'est-il inscrit pour les 3 jours bonus ?
  registrationDate: string | null; // Date d'inscription (YYYY-MM-DD)
  isSubscribed: boolean; // L'utilisateur a-t-il un abonnement actif ?
  subscriptionEndDate: string | null; // Date de fin d'abonnement (YYYY-MM-DD)
  hasSeenTrialPopup: boolean; // L'utilisateur a-t-il vu le popup des 3 jours bonus ?
}

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
        hasSeenTrialPopup: false
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
        const { subscription } = get();
        // L'utilisateur peut accéder si :
        // 1. Il est abonné (isSubscribed)
        // 2. Il a des jours gratuits restants
        // Note: Le statut hasPaid de Firebase sera vérifié par le composant ProtectedRoute
        return subscription.isSubscribed || get().getRemainingFreeDays() > 0;
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
        
        const generateWithKimi = async (): Promise<PersonalizedFlow | null> => {
          try {
            const systemPrompt = `Tu es Glow Flow, un coach bien-être expert spécialisé dans les programmes de transformation de 30 jours.
Tu crées des programmes personnalisés qui combinent :
- Activité physique douce (marche ou sport)
- Soins du visage
- Rituels beauté corporelle

Chaque jour doit être unique, progressif et motivant. Les descriptions doivent être encourageantes et spécifiques à l'objectif de l'utilisateur.`;

            const userPrompt = `Crée un programme de 30 jours personnalisé pour cet objectif :

OBJECTIF PRINCIPAL : "${objective}"
DESCRIPTION : "${description}"

STRUCTURE STRICTE POUR CHAQUE JOUR (respecte exactement ce format) :

1. MARCHE 30 MIN OU SPORT (obligatoire)
   - Alterne entre : marche rapide, yoga, fitness léger, étirements actifs, natation, vélo
   - Donne des suggestions différentes selon les jours
   - Adapte à l'objectif (perte de poids = cardio, bien-être = yoga/étirements, etc.)

2. MASSAGE VISAGE (obligatoire)
   - Varie les techniques : drainage lymphatique, acupression, massage tonifiant, gua sha, roller
   - Mentionne les bienfaits spécifiques
   - Durée : 3-5 minutes

3. GESTE POUR SOI AU CHOIX (l'utilisateur doit en choisir un)
   Option A : BROSSAGE À SEC - Exfolie et stimule la circulation
   Option B : CRÈME CORPS - Hydrate et nourrit la peau
   Option C : SOIN CHEVEUX - Masque ou huile pour nourrir

RÉPONDS UNIQUEMENT AU FORMAT JSON SUIVANT (30 jours complets) :
{
  "days": [
    {
      "day": 1,
      "title": "Titre inspirant du jour",
      "walkOrSport": "Description détaillée de l'activité avec type et durée",
      "faceMassage": "Technique de massage spécifique et bienfaits",
      "selfCareOptions": {
        "dryBrushing": "Description et bienfaits du brossage à sec",
        "bodyCream": "Description et bienfaits de la crème corps", 
        "hairCare": "Description et bienfaits du soin cheveux"
      }
    }
  ]
}`;

            const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-kimi-wQWfSCmBauIFhz4h4K3WsFNTHbzhxvd2ieRqRfDNnZKdn1zwtYQwTvgTD8Bgwgiq'
              },
              body: JSON.stringify({
                model: 'kimi-latest',
                messages: [
                  { role: 'system', content: systemPrompt },
                  { role: 'user', content: userPrompt }
                ],
                temperature: 0.8,
                max_tokens: 4000
              })
            });

            if (!response.ok) {
              throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || '';
            
            // Extract JSON from response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
              throw new Error('No JSON found in response');
            }
            
            const parsed = JSON.parse(jsonMatch[0]);
            
            if (!parsed.days || parsed.days.length !== 30) {
              throw new Error('Invalid days data');
            }

            const today = new Date().toISOString().split('T')[0];
            
            return {
              id: crypto.randomUUID(),
              objective,
              objectiveDescription: description,
              days: parsed.days.map((day: any) => ({
                day: day.day,
                title: day.title,
                mandatoryActions: [
                  {
                    id: 'walk-sport',
                    title: '🚶‍♀️ Marcher 30 min OU sport',
                    description: day.walkOrSport,
                    icon: '🚶‍♀️',
                    isMandatory: true,
                    isCompleted: false
                  },
                  {
                    id: 'face-massage',
                    title: '💆‍♀️ Massage visage',
                    description: day.faceMassage,
                    icon: '💆‍♀️',
                    isMandatory: true,
                    isCompleted: false
                  }
                ],
                choiceActions: [
                  {
                    id: 'dry-brushing',
                    title: '🧽 Brossage à sec',
                    description: day.selfCareOptions?.dryBrushing || 'Exfoliation naturelle qui stimule la circulation',
                    icon: '🧽',
                    isMandatory: false,
                    isCompleted: false
                  },
                  {
                    id: 'body-cream',
                    title: '🧴 Crème corps',
                    description: day.selfCareOptions?.bodyCream || 'Hydratation profonde pour une peau douce',
                    icon: '🧴',
                    isMandatory: false,
                    isCompleted: false
                  },
                  {
                    id: 'hair-care',
                    title: '✨ Soin cheveux',
                    description: day.selfCareOptions?.hairCare || 'Masque nourrissant pour des cheveux brillants',
                    icon: '✨',
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
              badges: []
            };
          } catch (error) {
            console.error('Kimi API Error:', error);
            return null;
          }
        };

        try {
          // Try to generate with Kimi API
          let newFlow = await generateWithKimi();
          
          // Fallback: generate default content if API fails
          if (!newFlow) {
            console.log('Using fallback flow generation');
            const today = new Date().toISOString().split('T')[0];
            
            // Generate diverse content for 30 days
            const walkOptions = [
              'Marche rapide en plein air - 30 min de cardio doux',
              'Yoga flow matinal - 30 min pour éveiller le corps',
              'Fitness léger à la maison - 30 min sans matériel',
              'Natation ou aquagym - 30 min sans impact',
              'Vélo ou elliptique - 30 min à allure modérée',
              'Étirements actifs - 30 min de mobilité',
              'Danse fitness - 30 min de fun et cardio',
              'Marche en côte - 30 min pour renforcer',
              'Pilates débutant - 30 min de renforcement doux',
              'Marche méditative - 30 min en conscience'
            ];
            
            const massageOptions = [
              'Drainage lymphatique : mouvements doux vers les ganglions pour décongestionner',
              'Acupression : appuyez sur les points de tension du front et des tempes',
              'Massage tonifiant : tapotements légers pour réveiller la peau',
              'Gua Sha : mouvements vers l\'extérieur pour sculpturer le visage',
              'Roller jade : mouvements ascendants pour détendre les muscles',
              'Massage des sinus : cercles autour des yeux pour décongestionner',
              'Auto-massage lifting : pétrissages doux pour tonifier',
              'Massage du cou : étirements pour relâcher les tensions',
              'Tapotements énergisants : pour stimuler la microcirculation',
              'Massage relaxant : mouvements lents pour détendre'
            ];
            
            const dryBrushOptions = [
              'Brossage vers le cœur pour activer la circulation',
              'Brossage avant la douche pour exfolier en profondeur',
              'Technique douce sur peau sèche pour stimuler',
              'Brossage circulaire sur les zones sensibles',
              'Rituel énergisant le matin pour réveiller le corps'
            ];
            
            const creamOptions = [
              'Application après la douche sur peau humide',
              'Massage long pour faire pénétrer la crème',
              'Hydratation des zones sensibles (genoux, coudes)',
              'Crème enrichie pour les jours froids',
              'Rituel du soir pour une peau réparée'
            ];
            
            const hairOptions = [
              'Huile de coco ou ricin sur longueurs et pointes',
              'Masque hydratant avant shampooing',
              'Sérum nourrissant sur cuir chevelu',
              'Bain d\'huile chaud pour réparation profonde',
              'Soin express 10 min pour cheveux brillants'
            ];
            
            newFlow = {
              id: crypto.randomUUID(),
              objective,
              objectiveDescription: description,
              days: Array.from({ length: 30 }, (_, i) => ({
                day: i + 1,
                title: `Jour ${i + 1} : ${['Ton nouveau départ', 'En route vers le changement', 'C\'est déjà une habitude', 'Tu es sur la bonne voie', 'Continue comme ça', 'Petit à petit', 'L\'effet boule', 'Transformation en cours', 'Tu brilles déjà', 'Jamais sans mon Flow'][i % 10]}`,
                mandatoryActions: [
                  {
                    id: 'walk-sport',
                    title: '🚶‍♀️ Marcher 30 min OU sport',
                    description: walkOptions[i % walkOptions.length],
                    icon: '🚶‍♀️',
                    isMandatory: true,
                    isCompleted: false
                  },
                  {
                    id: 'face-massage',
                    title: '💆‍♀️ Massage visage',
                    description: massageOptions[i % massageOptions.length],
                    icon: '💆‍♀️',
                    isMandatory: true,
                    isCompleted: false
                  }
                ],
                choiceActions: [
                  {
                    id: 'dry-brushing',
                    title: '🧽 Brossage à sec',
                    description: dryBrushOptions[i % dryBrushOptions.length],
                    icon: '🧽',
                    isMandatory: false,
                    isCompleted: false
                  },
                  {
                    id: 'body-cream',
                    title: '🧴 Crème corps',
                    description: creamOptions[i % creamOptions.length],
                    icon: '🧴',
                    isMandatory: false,
                    isCompleted: false
                  },
                  {
                    id: 'hair-care',
                    title: '✨ Soin cheveux',
                    description: hairOptions[i % hairOptions.length],
                    icon: '✨',
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
              badges: []
            };
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
