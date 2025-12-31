import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from './translations';

export type View = 'language-selection' | 'onboarding' | 'dashboard' | 'challenge' | 'journal' | 'trackers' | 'routine' | 'vision-board' | 'bonus' | 'settings';

interface ChallengeProgress {
  completedDays: number[];
  currentDay: number;
  notes: Record<number, string>;
  startDate: string | null; // Date de début du challenge (YYYY-MM-DD)
  lastCompletedDate: string | null; // Dernière date de complétion (YYYY-MM-DD)
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

interface AppState {
  // Navigation
  currentView: View;
  setCurrentView: (view: View) => void;
  currentDay: number;
  setCurrentDay: (day: number) => void;

  // Onboarding
  hasStarted: boolean;
  startChallenge: () => void;

  // Challenge Progress
  challengeProgress: ChallengeProgress;
  toggleDayCompletion: (day: number) => void;
  updateDayNotes: (day: number, notes: string) => void;
  canAccessDay: (day: number) => boolean;
  getCurrentUnlockedDay: () => number;

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

  // 50 Things Alone
  completedThingsAlone: number[];
  toggleThingAlone: (index: number) => void;

  // Progress Calculation
  getProgressPercentage: () => number;
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
        lastCompletedDate: null
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
      setLanguage: (language) => set({ language, hasSelectedLanguage: true }),
      hasSelectedLanguage: false,

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

      // Progress Calculation
      getProgressPercentage: () => {
        const { completedDays } = get().challengeProgress;
        return Math.round((completedDays.length / 30) * 100);
      }
    }),
    {
      name: 'glow-up-storage',
      version: 1
    }
  )
);
