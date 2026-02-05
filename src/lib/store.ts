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
  category?: string;
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
        
        const generateWithAI = async (): Promise<PersonalizedFlow | null> => {
          try {
            // Détecter la langue de l'objectif
            const detectLanguage = (text: string): string => {
              if (/[àâäéèêëïîôöùûüç]+/i.test(text)) return 'fr';
              if (/[áéíóúüñ¿¡]+/i.test(text)) return 'es';
              return 'en';
            };
            
            const lang = detectLanguage(objective + ' ' + description);
            
            const systemPrompt = `Tu es Glow Flow, un coach expert qui crée des programmes de transformation personnalisés.

RÈGLE D'OR : La DESCRIPTION/CONTEXTE est plus importante que l'objectif. Base-toi PRINCIPALEMENT sur la description pour créer des actions pertinentes.

TA MISSION :
Analyse la description en profondeur et crée 30 jours d'actions qui correspondent exactement à la situation décrite.`;

            const userPrompt = `DONNÉES DE L'UTILISATEUR :

📋 DESCRIPTION/CONTEXTE (À ANALYSER EN PRIORITÉ) :
"${description}"

🎯 OBJECTIF PRINCIPAL (RÉFÉRENCE SECONDaire) :
"${objective}"

🌍 LANGUE : ${lang === 'fr' ? 'Français' : lang === 'es' ? 'Espagnol' : 'Anglais'}

⚠️ INSTRUCTIONS CRITIQUES :
1. La DESCRIPTION/CONTEXTE est ta source principale - elle décrit la situation réelle
2. L'objectif est juste le titre - la vraie substance est dans la description
3. Crée des actions qui répondent EXACTEMENT à ce qui est décrit dans la description
4. 30 jours avec des actions variées et cohérentes

STRUCTURE OBLIGATOIRE PAR JOUR :
- 2 actions obligatoires (mandatory1 et mandatory2)
- 1 action au choix parmi 3 options (optionA, optionB, optionC)

FORMAT JSON :
{
  "category": "catégorie",
  "days": [
    {
      "day": 1,
      "title": "Titre du jour",
      "mandatory1": {
        "icon": "emoji",
        "title": "Nom de l'action",
        "description": "Description détaillée"
      },
      "mandatory2": {
        "icon": "emoji",
        "title": "Nom de l'action",
        "description": "Description détaillée"
      },
      "choiceOptions": {
        "optionA": {
          "icon": "emoji",
          "title": "Option A",
          "description": "Description"
        },
        "optionB": {
          "icon": "emoji",
          "title": "Option B",
          "description": "Description"
        },
        "optionC": {
          "icon": "emoji",
          "title": "Option C",
          "description": "Description"
        }
      }
    }
  ]
}

GÉNÈRE LE JSON COMPLET MAINtenant :`;

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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',
                'HTTP-Referer': 'https://upglow.app',
                'X-Title': 'UPGLOW Flow Generator'
              },
              body: JSON.stringify({
                model: 'tngtech/deepseek-r1t2-chimera:free',
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
            
            console.log('[AI Response] Content received:', content.substring(0, 500));
            
            // Extract JSON from response - try to find JSON block
            let jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
            if (!jsonMatch) {
              jsonMatch = content.match(/\{[\s\S]*\}/);
            }
            if (!jsonMatch) {
              console.error('[AI Response] No JSON found in:', content);
              throw new Error('No JSON found in response');
            }
            
            const jsonContent = jsonMatch[1] || jsonMatch[0];
            console.log('[AI Response] JSON extracted:', jsonContent.substring(0, 500));
            
            let parsed;
            try {
              parsed = JSON.parse(jsonContent);
            } catch (parseError) {
              console.error('[AI Response] JSON parse error:', parseError);
              console.error('[AI Response] Content was:', jsonContent);
              throw new Error('Invalid JSON format');
            }
            
            if (!parsed.days || !Array.isArray(parsed.days) || parsed.days.length < 1) {
              console.error('[AI Response] Invalid days data:', parsed);
              throw new Error('Invalid days data');
            }
            
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
            
            console.log('[AI Response] Successfully parsed', parsed.days.length, 'days');

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
                    title: `${day.mandatory1?.icon || '✨'} ${day.mandatory1?.title || 'Action 1'}`,
                    description: day.mandatory1?.description || '',
                    icon: day.mandatory1?.icon || '✨',
                    isMandatory: true,
                    isCompleted: false
                  },
                  {
                    id: 'mandatory-2',
                    title: `${day.mandatory2?.icon || '🎯'} ${day.mandatory2?.title || 'Action 2'}`,
                    description: day.mandatory2?.description || '',
                    icon: day.mandatory2?.icon || '🎯',
                    isMandatory: true,
                    isCompleted: false
                  }
                ],
                choiceActions: [
                  {
                    id: 'choice-a',
                    title: `${day.choiceOptions?.optionA?.icon || '🔸'} ${day.choiceOptions?.optionA?.title || 'Option A'}`,
                    description: day.choiceOptions?.optionA?.description || '',
                    icon: day.choiceOptions?.optionA?.icon || '🔸',
                    isMandatory: false,
                    isCompleted: false
                  },
                  {
                    id: 'choice-b',
                    title: `${day.choiceOptions?.optionB?.icon || '🔹'} ${day.choiceOptions?.optionB?.title || 'Option B'}`,
                    description: day.choiceOptions?.optionB?.description || '',
                    icon: day.choiceOptions?.optionB?.icon || '🔹',
                    isMandatory: false,
                    isCompleted: false
                  },
                  {
                    id: 'choice-c',
                    title: `${day.choiceOptions?.optionC?.icon || '🔺'} ${day.choiceOptions?.optionC?.title || 'Option C'}`,
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
              badges: []
            };
          } catch (error) {
            console.error('Kimi API Error:', error);
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
            
            // Actions par catégorie pour le fallback
            const actionsByCategory = {
              finance: {
                m1: ['💰 Analyser une opportunité business', '📊 Faire un bilan financier', '💼 Contacter 3 prospects', '📈 Étudier un cas de succès', '💡 Brainstormer des idées revenus'],
                m2: ['📚 Lire 20 min sur l\'entrepreneuriat', '🎧 Podcast business', '📺 Regarder une vidéo formation', '📝 Prendre des notes stratégiques', '🧮 Calculer ses projections'],
                c1: ['📧 Envoyer un email pro', '🤝 Faire du networking', '📱 Poster sur LinkedIn'],
                c2: ['⏰ Se lever 1h plus tôt', '🧘 Méditation pour la créativité', '📝 Tenir un journal de bord'],
                c3: ['🎁 S\'offrir un petit luxe', '🍰 Célébrer une micro-victoire', '🎵 Écouter de la musique motivante']
              },
              developpement: {
                m1: ['🎯 Défi de confiance du jour', '🗣️ Parler à un inconnu', '💪 Action qui fait peur', '🌟 Se mettre en avant', '✨ Sortir de sa zone'],
                m2: ['📝 Affirmations positives', '🌅 Visualisation du succès', '📔 Journaling introspectif', '🧘 Méditation guidée', '💭 Réflexion sur ses forces'],
                c1: ['📱 Appeler un proche', '🤗 Câlin ou affection', '💌 Écrire une lettre de gratitude'],
                c2: ['🎨 Activité créative', '🎵 Chant ou expression', '📖 Lecture inspirante'],
                c3: ['🛁 Bain relaxant', '🍵 Thé et moment de calme', '🎬 Film inspirant']
              },
              sante: {
                m1: ['🏃‍♀️ 30 min cardio ou sport', '💪 Séance musculation', '🧘 Yoga ou étirements', '🚴 Vélo ou natation', '🏊 45 min d\'activité'],
                m2: ['💧 Boire 2L d\'eau', '🥗 Manger 5 fruits/légumes', '😴 Dormir 8h ce soir', '🚫 Pas de sucre raffiné', '🍎 Smoothie healthy'],
                c1: ['🛁 Bain de récupération', '🧖‍♀️ Spa ou sauna', '💆 Massage auto'],
                c2: ['📱 Appel vidéo avec un proche', '🎵 Playlist motivation', '📺 Documentaire santé'],
                c3: ['🛒 Courses alimentaires', '🍳 Cuisiner un nouveau plat', '📝 Planifier ses repas']
              },
              competences: {
                m1: ['📚 30 min de pratique active', '💻 Projet concret', '🎯 Exercices pratiques', '📝 Écrire ou créer', '🎨 Application créative'],
                m2: ['📖 Théorie ou veille', '🎧 Podcast éducatif', '📺 Tutoriel vidéo', '🗒️ Revue de notes', '🧠 Anki ou flashcards'],
                c1: ['👥 Rejoindre une communauté', '🤝 Trouver un partenaire', '💬 Partager son progrès'],
                c2: ['🎵 Musique de concentration', '🧘 Méditation focus', '📱 Bloquer distractions'],
                c3: ['🏆 Se récompenser', '🎁 Petit cadeau à soi', '🎉 Célébrer l\'effort']
              },
              relations: {
                m1: ['💬 Initier une conversation', '📱 Envoyer un message', '🤝 Sortir de sa zone sociale', '🎯 Action sociale proactive', '🌟 Complimenter quelqu\'un'],
                m2: ['📝 Gratitude relations', '🧘 Visualisation connexion', '📔 Journal émotionnel', '💭 Réflexion sur ses besoins', '🌱 Travail intérieur'],
                c1: ['📞 Appeler un ami', '🍕 Sortir avec quelqu\'un', '💌 Écrire une lettre'],
                c2: ['🎨 Activité créative solo', '📖 Lecture feel-good', '🎵 Musique joyeuse'],
                c3: ['🛁 Spa day', '🍰 Gourmandise', '🎬 Comédie romantique']
              },
              'bien-etre': {
                m1: ['🚶‍♀️ 30 min marche ou sport', '🏃‍♀️ Activité physique', '🧘 Yoga ou stretching', '💃 Danse cardio', '🏊 Nage ou aquagym'],
                m2: ['💆‍♀️ Rituel beauté', '🧴 Soin visage', '🛁 Bain relaxant', '🌸 Aromathérapie', '🧘 Méditation'],
                c1: ['🧽 Brossage à sec', '🦵 Gommage corps', '🧖‍♀️ Exfoliation'],
                c2: ['🧴 Crème hydratante', '🌺 Huile corporelle', '💅 Manucure'],
                c3: ['✨ Masque cheveux', '💇 Soin capillaire', '🎀 Coiffure soignée']
              }
            };
            
            const actions = actionsByCategory[category] || actionsByCategory['bien-etre'];
            
            newFlow = {
              id: crypto.randomUUID(),
              objective,
              objectiveDescription: description,
              category,
              days: Array.from({ length: 30 }, (_, i) => ({
                day: i + 1,
                title: `${['✨ Jour', '🌟 Jour', '💫 Jour', '🎯 Jour', '🔥 Jour', '⚡ Jour', '🌈 Jour', '💪 Jour', '🚀 Jour', '⭐ Jour'][i % 10]} ${i + 1}`,
                mandatoryActions: [
                  {
                    id: 'mandatory-1',
                    title: actions.m1[i % actions.m1.length],
                    description: 'Action essentielle pour progresser vers ton objectif',
                    icon: '🔥',
                    isMandatory: true,
                    isCompleted: false
                  },
                  {
                    id: 'mandatory-2',
                    title: actions.m2[i % actions.m2.length],
                    description: 'Renforce tes bases et ta motivation quotidienne',
                    icon: '💎',
                    isMandatory: true,
                    isCompleted: false
                  }
                ],
                choiceActions: [
                  {
                    id: 'choice-a',
                    title: actions.c1[i % actions.c1.length],
                    description: 'Option qui enrichit ton parcours',
                    icon: '🌟',
                    isMandatory: false,
                    isCompleted: false
                  },
                  {
                    id: 'choice-b',
                    title: actions.c2[i % actions.c2.length],
                    description: 'Une approche complémentaire',
                    icon: '💫',
                    isMandatory: false,
                    isCompleted: false
                  },
                  {
                    id: 'choice-c',
                    title: actions.c3[i % actions.c3.length],
                    description: 'Pour te récompenser et avancer sereinement',
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
