'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useStore, View } from '@/lib/store';
import {
  getLocalizedChallengeDays,
  getLocalizedBonusAffirmations,
  getLocalizedChecklistsData,
  getLocalizedSoftLifeGuide,
  getLocalizedBonusSections,
  getLocalizedFiftyThingsAlone
} from '@/lib/challenge-data';
import { newMePillars, newMeGloweeMessage, specialNewMePillars } from '@/lib/new-me-data';
import { Sparkles, BookOpen, TrendingUp, Home, Heart, Target, Layers, Gift, Settings, ChevronRight, ChevronLeft, Check, Plus, X, Calendar, Moon, Sun, Droplet, Zap, Smile, Activity, Utensils, Lightbulb, Image as ImageIcon, Trash2, Download, Bell, BellOff, Star, CheckSquare, ListChecks, Award, Globe, LogIn, LogOut, User, Crown } from 'lucide-react';
import { useTranslation } from '@/lib/useTranslation';
import { Language } from '@/lib/translations';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AIChat } from '@/components/AIChat';
import { GloweeChatPopup } from '@/components/GloweeChatPopup';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import InstallPrompt from '@/components/InstallPrompt';
import AppLoader from '@/components/AppLoader';
import { BoundariesTracker } from '@/components/BoundariesTracker';
import { SmallWinsQuickAdd } from '@/components/SmallWinsQuickAdd';
import { SmallWinsCompact } from '@/components/SmallWinsCompact';
import BoundariesCompact from '@/components/BoundariesCompact';
import { EveningQuestionQuickAdd } from '@/components/EveningQuestionQuickAdd';
import { TrialExtensionPopup } from '@/components/TrialExtensionPopup';
import { SubscriptionPopup } from '@/components/SubscriptionPopup';
import { TrialBadge } from '@/components/TrialBadge';
import { MyGoals } from '@/components/goals/MyGoals';
import { GoalWorkspacePage } from '@/components/goals/GoalWorkspacePage';
import GloweePopup from '@/components/shared/GloweePopup';
import { GloweeHourlyMessage } from '@/components/GloweeHourlyMessage';
import { useVisitTracker, trackVisit, isFirstVisit, isFifthAppVisit, markWelcomeSeen, markPresentationSeen, hasPresentationBeenSeen } from '@/utils/visitTracker';
import { gloweeMessages } from '@/data/gloweeMessages';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { FAQSection } from '@/components/settings/FAQSection';

export default function GlowUpChallengeApp() {
  const [isHydrated, setIsHydrated] = useState(false);
  const { user, userData, signOut } = useAuth();

  const {
    currentView,
    setCurrentView,
    currentDay,
    setCurrentDay,
    selectedGoalId,
    setSelectedGoalId,
    selectedChallenge,
    setSelectedChallenge,
    hasStarted,
    startChallenge,
    challengeProgress,
    toggleDayCompletion,
    updateDayNotes,
    toggleActionCompletion,
    isActionCompleted,
    journalEntries,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    trackers,
    updateTracker,
    getTrackerByDate,
    routine,
    updateRoutine,
    routineCompletedDates,
    setRoutineCompleted,
    visionBoardImages,
    addVisionBoardImage,
    removeVisionBoardImage,
    theme,
    setTheme,
    notificationsEnabled,
    setNotificationsEnabled,
    getProgressPercentage,
    completedThingsAlone,
    toggleThingAlone,
    language,
    setLanguage,
    hasSelectedLanguage,
    canAccessDay,
    getCurrentUnlockedDay,
    bonusProgress,
    toggleWeeklyBonus,
    updateWeeklyBonusNotes,
    toggleChecklistCompleted,
    toggleMiniGuideStep,
    getWeeklyBonusProgress,
    getSectionWeeklyCompletion,
    // Subscription & Trial
    subscription,
    initializeFirstOpen,
    getRemainingFreeDays,
    isTrialExpired,
    canAccessApp
  } = useStore();

  const { t } = useTranslation();

  // Données localisées selon la langue
  const challengeDays = useMemo(() => getLocalizedChallengeDays(language), [language]);
  const bonusAffirmations = useMemo(() => getLocalizedBonusAffirmations(language), [language]);
  const checklistsData = useMemo(() => getLocalizedChecklistsData(language), [language]);
  const softLifeGuide = useMemo(() => getLocalizedSoftLifeGuide(language), [language]);
  const bonusSections = useMemo(() => getLocalizedBonusSections(language), [language]);
  const fiftyThingsAlone = useMemo(() => getLocalizedFiftyThingsAlone(language), [language]);

  // État pour le dialog de félicitations
  const [showCongratulations, setShowCongratulations] = useState(false);

  // État pour le popup Glowee Chat
  const [showGloweeChat, setShowGloweeChat] = useState(false);

  // États pour les popups de paywall
  const [showTrialExtension, setShowTrialExtension] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [shouldReopenSubscription, setShouldReopenSubscription] = useState(false);

  // États pour les popups Glowee
  const [showGloweeWelcome, setShowGloweeWelcome] = useState(false);
  const [showGloweeFifthVisit, setShowGloweeFifthVisit] = useState(false);
  const [showGloweePlanningWelcome, setShowGloweePlanningWelcome] = useState(false);
  const [showGloweeJournalWelcome, setShowGloweeJournalWelcome] = useState(false);

  // État pour le dialogue d'authentification
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // État pour les objectifs
  const [goals, setGoals] = useState<any[]>([]);

  // Charger les objectifs depuis localStorage
  useEffect(() => {
    if (isHydrated) {
      const savedGoals = localStorage.getItem('myGoals');
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
    }
  }, [isHydrated]);

  // Écouter les changements dans localStorage pour mettre à jour les objectifs
  useEffect(() => {
    if (!isHydrated) return;

    const handleStorageChange = () => {
      const savedGoals = localStorage.getItem('myGoals');
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
    };

    // Écouter les changements de localStorage
    window.addEventListener('storage', handleStorageChange);

    // Vérifier périodiquement les changements (pour les changements dans le même onglet)
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isHydrated]);

  const [todayDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newJournalEntry, setNewJournalEntry] = useState({
    mood: '',
    feelings: '',
    glow: '',
    learned: '',
    freeContent: '',
    gratitude: '',
    intention: ''
  });

  // États pour les modals
  const [selectedChecklist, setSelectedChecklist] = useState<ReturnType<typeof getLocalizedChecklistsData>[0] | null>(null);
  const [showSoftLifeGuide, setShowSoftLifeGuide] = useState(false);
  const [selectedGuideStep, setSelectedGuideStep] = useState<number | null>(null);
  const [selectedBonusSection, setSelectedBonusSection] = useState<ReturnType<typeof getLocalizedBonusSections>[0] | null>(null);

  // États pour New Me
  const [selectedHabit, setSelectedHabit] = useState<typeof newMePillars[0] | null>(null);
  const [newMeDailyHabits, setNewMeDailyHabits] = useState<Record<string, boolean>>({});
  const [newMeFeeling, setNewMeFeeling] = useState('');
  const [newMeActiveTab, setNewMeActiveTab] = useState<'daily' | 'progress' | 'badges'>('daily');

  // État pour le scroll horizontal des quick adds
  const [quickAddScrollIndex, setQuickAddScrollIndex] = useState(0);
  const quickAddScrollRef = useRef<HTMLDivElement>(null);
  const [newMeProgress, setNewMeProgress] = useState<Record<number, Record<string, boolean>>>({});
  const [newMeCurrentDay, setNewMeCurrentDay] = useState(1);
  const [newMeStartDate, setNewMeStartDate] = useState<string | null>(null);

  // État pour les pages d'onboarding avec Glowee
  const [onboardingPage, setOnboardingPage] = useState(1);

  // État pour le drawer de switch de challenge
  const [showChallengeDrawer, setShowChallengeDrawer] = useState(false);

  // États pour Tracker
  const [trackerCurrentDay, setTrackerCurrentDay] = useState(1);
  const [trackerStartDate, setTrackerStartDate] = useState<string | null>(null);
  const [customHabits, setCustomHabits] = useState<Array<{id: string, label: string, type: 'good' | 'bad'}>>([]);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitLabel, setNewHabitLabel] = useState('');
  const [newHabitType, setNewHabitType] = useState<'good' | 'bad'>('good');

  // États pour Planning
  const [planningTab, setPlanningTab] = useState<'my-tasks' | 'glowee-tasks'>('my-tasks');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Mes tâches (manuelles)
  const [myWeekPriorities, setMyWeekPriorities] = useState<Array<{id: string, text: string, completed: boolean}>>([]);
  const [myWeeklyTasks, setMyWeeklyTasks] = useState<Record<string, Array<{id: string, text: string, completed: boolean}>>>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  });

  // Glowee tâches (suggestions)
  const [gloweeWeekPriorities, setGloweeWeekPriorities] = useState<Array<{id: string, text: string, completed: boolean}>>([]);
  const [gloweeWeeklyTasks, setGloweeWeeklyTasks] = useState<Record<string, Array<{id: string, text: string, completed: boolean}>>>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  });

  // Tâches avec dates spécifiques (nouvelle structure)
  const [tasksWithDates, setTasksWithDates] = useState<Array<{
    id: string;
    text: string;
    date: string; // Format YYYY-MM-DD
    completed: boolean;
    type: 'glowee' | 'user';
    priority?: string;
    category?: string;
    goalId?: string; // ID de l'objectif associé
    goalName?: string; // Nom de l'objectif
    goalColor?: string; // Couleur de l'objectif
  }>>([]);

  // Navigation par semaine
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0 = semaine actuelle, 1 = semaine prochaine, etc.

  // Objectifs avec leurs priorités
  const [goalsWithPriorities, setGoalsWithPriorities] = useState<Array<{
    id: string;
    name: string;
    color: string;
    weeklyPriorities: Array<{id: string, text: string, completed: boolean}>;
  }>>([]);
  const [selectedGoalForPriorities, setSelectedGoalForPriorities] = useState<string | null>(null);

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDestination, setNewTaskDestination] = useState<'priority' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>('priority');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDeleteTaskConfirm, setShowDeleteTaskConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{id: string, day: string, type: 'priority' | 'task'} | null>(null);
  const [showSwipeHintPopup, setShowSwipeHintPopup] = useState(false);
  const [hasSeenSwipeHint, setHasSeenSwipeHint] = useState(false);

  // Hydratation du store - évite les problèmes d'hydratation SSR/CSR
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Initialiser la première ouverture de l'app et gérer le paywall
  useEffect(() => {
    if (isHydrated) {
      // Initialiser la date de première ouverture
      initializeFirstOpen();

      // Vérifier si on doit afficher le popup d'extension de trial (jour 4)
      const remainingDays = getRemainingFreeDays();
      const hasExpired = isTrialExpired();

      // Si c'est le 4ème jour (remainingDays === 0 pour les 3 premiers jours)
      // et que l'utilisateur n'est pas inscrit et n'a pas vu le popup
      if (remainingDays === 0 && !subscription.hasRegistered && !subscription.hasSeenTrialPopup) {
        setShowTrialExtension(true);
      }

      // Si la période d'essai est expirée et pas d'abonnement
      if (hasExpired && !subscription.isSubscribed) {
        setShowSubscription(true);
      }
    }
  }, [isHydrated, initializeFirstOpen, getRemainingFreeDays, isTrialExpired, subscription]);

  // Rouvrir le popup d'abonnement après l'inscription si nécessaire
  useEffect(() => {
    if (user && shouldReopenSubscription) {
      // L'utilisateur vient de se connecter et on doit rouvrir le popup
      setShouldReopenSubscription(false);
      setShowSubscription(true);
    }
  }, [user, shouldReopenSubscription]);

  // Tracker les visites et afficher les popups Glowee
  // DÉSACTIVÉ TEMPORAIREMENT - Les popups s'affichent trop souvent
  /*
  useEffect(() => {
    if (isHydrated && hasStarted) {
      // Tracker la visite de l'app
      trackVisit('app');

      // Vérifier si c'est la 1ère visite du dashboard
      if (currentView === 'dashboard' && isFirstVisit('home')) {
        setTimeout(() => setShowGloweeWelcome(true), 1000);
      }

      // Vérifier si c'est la 5ème visite de l'app
      if (isFifthAppVisit()) {
        setTimeout(() => setShowGloweeFifthVisit(true), 1500);
      }

      // Vérifier si c'est la 1ère visite du planning
      if (currentView === 'routine' && isFirstVisit('planning')) {
        setTimeout(() => setShowGloweePlanningWelcome(true), 1000);
      }

      // Vérifier si c'est la 1ère visite du journal
      if (currentView === 'journal' && isFirstVisit('journal')) {
        setTimeout(() => setShowGloweeJournalWelcome(true), 1000);
      }
    }
  }, [isHydrated, hasStarted, currentView]);
  */

  // Initialiser la date de début et calculer le jour actuel pour New Me
  useEffect(() => {
    if (isHydrated) {
      const storedStartDate = localStorage.getItem('newMeStartDate');
      if (!storedStartDate) {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('newMeStartDate', today);
        setNewMeStartDate(today);
        setNewMeCurrentDay(1);
      } else {
        setNewMeStartDate(storedStartDate);
        // Calculer le jour actuel basé sur la date de début
        const start = new Date(storedStartDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const calculatedDay = Math.min(diffDays, 30); // Max 30 jours
        setNewMeCurrentDay(calculatedDay);
      }
    }
  }, [isHydrated]);

  // Initialiser la date de début et calculer le jour actuel pour Tracker
  useEffect(() => {
    if (isHydrated) {
      const storedStartDate = localStorage.getItem('trackerStartDate');
      const storedHabits = localStorage.getItem('customHabits');

      if (!storedStartDate) {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('trackerStartDate', today);
        setTrackerStartDate(today);
        setTrackerCurrentDay(1);
      } else {
        setTrackerStartDate(storedStartDate);
        const start = new Date(storedStartDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const calculatedDay = Math.min(diffDays, 30);
        setTrackerCurrentDay(calculatedDay);
      }

      if (storedHabits) {
        setCustomHabits(JSON.parse(storedHabits));
      }
    }
  }, [isHydrated]);

  // Sauvegarder les habitudes personnalisées
  useEffect(() => {
    if (isHydrated && customHabits.length > 0) {
      localStorage.setItem('customHabits', JSON.stringify(customHabits));
    }
  }, [customHabits, isHydrated]);

  // Charger et sauvegarder les données du planning
  useEffect(() => {
    if (isHydrated) {
      const storedMyPriorities = localStorage.getItem('myWeekPriorities');
      const storedMyTasks = localStorage.getItem('myWeeklyTasks');
      const storedGloweePriorities = localStorage.getItem('gloweeWeekPriorities');
      const storedGloweeTasks = localStorage.getItem('gloweeWeeklyTasks');

      if (storedMyPriorities) {
        setMyWeekPriorities(JSON.parse(storedMyPriorities));
      }
      if (storedMyTasks) {
        setMyWeeklyTasks(JSON.parse(storedMyTasks));
      }
      if (storedGloweePriorities) {
        setGloweeWeekPriorities(JSON.parse(storedGloweePriorities));
      }
      if (storedGloweeTasks) {
        setGloweeWeeklyTasks(JSON.parse(storedGloweeTasks));
      }
    }
  }, [isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('myWeekPriorities', JSON.stringify(myWeekPriorities));
    }
  }, [myWeekPriorities, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('myWeeklyTasks', JSON.stringify(myWeeklyTasks));
    }
  }, [myWeeklyTasks, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('gloweeWeekPriorities', JSON.stringify(gloweeWeekPriorities));
    }
  }, [gloweeWeekPriorities, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('gloweeWeeklyTasks', JSON.stringify(gloweeWeeklyTasks));
    }
  }, [gloweeWeeklyTasks, isHydrated]);

  // Charger et sauvegarder les tâches avec dates
  useEffect(() => {
    if (isHydrated) {
      const savedTasksWithDates = localStorage.getItem('tasksWithDates');
      if (savedTasksWithDates) {
        setTasksWithDates(JSON.parse(savedTasksWithDates));
      }
    }
  }, [isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('tasksWithDates', JSON.stringify(tasksWithDates));
    }
  }, [tasksWithDates, isHydrated]);

  // Charger et sauvegarder les objectifs avec priorités
  useEffect(() => {
    if (isHydrated) {
      const savedGoalsWithPriorities = localStorage.getItem('goalsWithPriorities');
      if (savedGoalsWithPriorities) {
        setGoalsWithPriorities(JSON.parse(savedGoalsWithPriorities));
      }
      const savedSelectedGoal = localStorage.getItem('selectedGoalForPriorities');
      if (savedSelectedGoal) {
        setSelectedGoalForPriorities(savedSelectedGoal);
      }
    }
  }, [isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('goalsWithPriorities', JSON.stringify(goalsWithPriorities));
    }
  }, [goalsWithPriorities, isHydrated]);

  useEffect(() => {
    if (isHydrated && selectedGoalForPriorities) {
      localStorage.setItem('selectedGoalForPriorities', selectedGoalForPriorities);
    }
  }, [selectedGoalForPriorities, isHydrated]);

  useEffect(() => {
    if (hasStarted && isHydrated) {
      setCurrentView('dashboard');
    }
  }, [hasStarted, setCurrentView, isHydrated]);

  // Scroll to top quand on accède à la page Glow Up (bonus)
  useEffect(() => {
    if (currentView === 'bonus') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentView]);

  // Fonctions utilitaires pour les dates
  const getWeekDates = (offset: number = 0): string[] => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1) + (offset * 7));

    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const getTasksForDate = (date: string, type: 'glowee' | 'user') => {
    return tasksWithDates.filter(task => task.date === date && task.type === type);
  };

  const formatWeekRange = (offset: number = 0) => {
    const dates = getWeekDates(offset);
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[6]);

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const start = startDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', options);
    const end = endDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', options);

    return `${start} - ${end}`;
  };

  // Obtenir les objectifs actifs (avec tâches) pour la semaine actuelle
  const getActiveGoals = () => {
    const weekDates = getWeekDates(currentWeekOffset);
    const goalsMap = new Map<string, { id: string; name: string; color: string }>();

    tasksWithDates.forEach(task => {
      if (task.type === 'glowee' && task.goalId && task.goalName && task.goalColor && weekDates.includes(task.date)) {
        if (!goalsMap.has(task.goalId)) {
          goalsMap.set(task.goalId, {
            id: task.goalId,
            name: task.goalName,
            color: task.goalColor
          });
        }
      }
    });

    return Array.from(goalsMap.values());
  };

  // Variables dynamiques basées sur l'onglet actif
  const weekPriorities = planningTab === 'my-tasks' ? myWeekPriorities : gloweeWeekPriorities;
  const setWeekPriorities = planningTab === 'my-tasks' ? setMyWeekPriorities : setGloweeWeekPriorities;
  const weeklyTasks = planningTab === 'my-tasks' ? myWeeklyTasks : gloweeWeeklyTasks;
  const setWeeklyTasks = planningTab === 'my-tasks' ? setMyWeeklyTasks : setGloweeWeeklyTasks;

  // Register service worker for PWA
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered:', registration);

            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'activated') {
                    console.log('New service worker activated');
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  // Afficher le loader pendant l'hydratation
  if (!isHydrated) {
    return <AppLoader />;
  }

  const getCurrentDayData = () => challengeDays.find((d) => d.day === currentDay);

  const handleCompleteDay = () => {
    const wasCompleted = challengeProgress.completedDays.includes(currentDay);
    toggleDayCompletion(currentDay);

    // Afficher les félicitations seulement si on vient de compléter (pas de décompléter)
    if (!wasCompleted) {
      setShowCongratulations(true);
    }
  };

  const handleSaveJournalEntry = () => {
    addJournalEntry({
      date: new Date(),
      ...newJournalEntry
    });
    setNewJournalEntry({ mood: '', feelings: '', glow: '', learned: '', freeContent: '', gratitude: '', intention: '' });
  };

  const handleAddVisionImage = (url: string, caption: string) => {
    addVisionBoardImage({ url, caption });
  };

  const getTodayTracker = () => {
    return getTrackerByDate(todayDate) || {
      date: todayDate,
      waterGlasses: 0,
      sleepHours: 0,
      mood: 0,
      activityMinutes: 0,
      skincareCompleted: false,
      habits: {}
    };
  };

  const updateTodayTracker = (updates: Partial<typeof getTodayTracker>) => {
    updateTracker(todayDate, updates);
  };

  const progressPercentage = getProgressPercentage();

  // Bloquer l'accès si l'essai est expiré et pas d'abonnement
  // Cette vérification s'applique à toutes les vues sauf language-selection
  const shouldBlockAccess = hasSelectedLanguage && !canAccessApp() && !subscription.isSubscribed;

  // Language Selection Screen
  if (!hasSelectedLanguage) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${theme === 'dark' ? 'bg-stone-950 text-stone-100' : 'bg-amber-50 text-stone-900'}`}>
        <div className="max-w-md w-full text-center space-y-8">
          {/* Logo */}
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-rose-200 via-pink-200 to-orange-100 dark:from-rose-900 dark:via-pink-900 dark:to-orange-900 shadow-lg">
              <Globe className="w-12 h-12 text-rose-500 dark:text-rose-300" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              {t.languageSelection.title}
            </h1>
            <p className="text-xl text-stone-600 dark:text-stone-400 font-light">
              {t.languageSelection.subtitle}
            </p>
          </div>

          {/* Language Options */}
          <div className="space-y-3">
            {[
              { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
              { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
              { code: 'es' as Language, name: 'Español', flag: '🇪🇸' }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  language === lang.code
                    ? 'border-rose-400 bg-rose-50 dark:bg-rose-900/20'
                    : theme === 'dark'
                      ? 'border-stone-800 bg-stone-900 hover:border-stone-700'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{lang.flag}</span>
                    <span className="text-lg font-semibold">{lang.name}</span>
                  </div>
                  {language === lang.code && (
                    <Check className="w-6 h-6 text-rose-500" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Continue Button */}
          <Button
            onClick={() => setCurrentView('presentation')}
            className="w-full h-14 text-lg bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white font-semibold rounded-full shadow-lg shadow-rose-200 dark:shadow-rose-900/30"
          >
            {t.languageSelection.continue}
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  // Si l'accès est bloqué, afficher uniquement le popup de subscription
  if (shouldBlockAccess) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-stone-950' : 'bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50'}`}>
        <SubscriptionPopup
          isOpen={true}
          onClose={() => {}} // Fonction vide - impossible de fermer
          theme={theme}
          onOpenAuthDialog={() => setShowAuthDialog(true)}
        />
        <AuthDialog
          isOpen={showAuthDialog}
          onClose={() => setShowAuthDialog(false)}
          theme={theme}
          onSuccess={() => {
            setShowAuthDialog(false);
            setShouldReopenSubscription(true);
          }}
        />
      </div>
    );
  }

  // Presentation Screen - Ne s'affiche qu'une seule fois
  if (currentView === 'presentation') {
    // Si la présentation a déjà été vue, passer directement à l'onboarding
    if (hasPresentationBeenSeen()) {
      setCurrentView('onboarding');
      return null;
    }

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
        <div className="flex-1 overflow-y-auto p-6 pb-24">
          <div className="max-w-md mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-4 pt-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-gradient-to-br from-pink-300 to-pink-400 shadow-2xl shadow-pink-200/50">
                <Sparkles className="w-12 h-12 text-white drop-shadow-lg" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                {t.presentation.title}
              </h1>
              <p className="text-base md:text-lg text-gray-600 italic font-medium">
                "{t.presentation.quote}"
              </p>
            </div>

            {/* Subtitle */}
            <Card className="border-none shadow-xl shadow-pink-100/50 bg-white/80 backdrop-blur-md rounded-[2rem]">
              <CardContent className="p-6 text-center">
                <p className="text-lg font-bold text-gray-800">
                  {t.presentation.description}
                </p>
              </CardContent>
            </Card>

            {/* Triangle de transformation */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-center flex items-center justify-center gap-3 text-gray-800">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-300 to-purple-400 flex items-center justify-center shadow-lg shadow-purple-200/50">
                  <Target className="w-6 h-6 text-white" />
                </div>
                {t.presentation.triangleTitle}
              </h2>

              {/* Pilier 1 */}
              <Card className="border-none shadow-xl shadow-pink-100/50 bg-gradient-to-br from-pink-100 via-rose-50 to-white rounded-[1.5rem]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-gray-800 text-base">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center shadow-lg shadow-pink-200/50">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    {t.presentation.pillar1Title}
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Pilier 2 */}
              <Card className="border-none shadow-xl shadow-purple-100/50 bg-gradient-to-br from-purple-100 via-pink-50 to-white rounded-[1.5rem]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-gray-800 text-base">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-300 to-purple-400 flex items-center justify-center shadow-lg shadow-purple-200/50">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    {t.presentation.pillar2Title}
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Pilier 3 */}
              <Card className="border-none shadow-xl shadow-orange-100/50 bg-gradient-to-br from-orange-100 via-pink-50 to-white rounded-[1.5rem]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-gray-800 text-base">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-300 to-orange-400 flex items-center justify-center shadow-lg shadow-orange-200/50">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    {t.presentation.pillar3Title}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Règles du Challenge */}
            <Card className="border-none shadow-xl shadow-pink-100/50 bg-white/80 backdrop-blur-md rounded-[2rem]">
              <CardHeader className="pb-3">
                <CardTitle className="text-center text-lg flex items-center justify-center gap-3 text-gray-800">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center shadow-lg shadow-pink-200/50">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  {t.presentation.rulesTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  t.presentation.rule1,
                  t.presentation.rule5
                ].map((rule, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-white shadow-lg shadow-pink-100/30"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-pink-200/50">
                      {index === 0 ? '1' : '5'}
                    </div>
                    <p className={`flex-1 leading-relaxed text-sm text-gray-700 ${index === 1 ? 'font-bold' : 'font-medium'}`}>
                      {rule}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* CTA Button */}
            <Button
              onClick={() => {
                markPresentationSeen();
                setCurrentView('onboarding');
              }}
              className="w-full h-14 text-lg bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-bold rounded-[1.5rem] shadow-xl shadow-pink-200/50 hover:shadow-2xl transition-all"
            >
              {t.presentation.startChallenge}
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Challenge Selection Screen
  if (currentView === 'challenge-selection') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
        <div className="max-w-md w-full space-y-8">
          {/* Glowee Image */}
          <div className="flex justify-center animate-in zoom-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 rounded-[2rem] blur-xl opacity-40"></div>
              <img
                src="/Glowee/glowee-acceuillante.webp"
                alt="Glowee"
                className="w-52 h-52 object-contain drop-shadow-2xl relative z-10"
              />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-3 animate-in slide-in-from-bottom duration-700">
            <h1 className="text-3xl font-bold text-gray-800">
              {t.challengeSelection.title}
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              {t.challengeSelection.subtitle}
            </p>
          </div>

          {/* Challenge Options */}
          <div className="space-y-5 animate-in slide-in-from-bottom duration-700 delay-200">
            {/* Option 1: Mind & Life */}
            <button
              onClick={() => {
                setSelectedChallenge('mind-life');
                startChallenge();
              }}
              className="w-full p-6 rounded-[2rem] border-none shadow-2xl shadow-purple-200/50 transition-all hover:scale-[1.02] bg-gradient-to-br from-purple-100 via-pink-50 to-white"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-300 to-purple-400 flex items-center justify-center text-4xl shadow-lg shadow-purple-200/50">
                  {t.challengeSelection.mindLifeEmoji}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    {t.challengeSelection.mindLifeTitle}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">
                    {t.challengeSelection.mindLifeDesc}
                  </p>
                </div>
              </div>
            </button>

            {/* Option 2: Beauty & Body */}
            <button
              onClick={() => {
                setSelectedChallenge('beauty-body');
                startChallenge();
              }}
              className="w-full p-6 rounded-[2rem] border-none shadow-2xl shadow-pink-200/50 transition-all hover:scale-[1.02] bg-gradient-to-br from-pink-100 via-rose-50 to-white"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center text-4xl shadow-lg shadow-pink-200/50">
                  {t.challengeSelection.beautyBodyEmoji}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    {t.challengeSelection.beautyBodyTitle}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">
                    {t.challengeSelection.beautyBodyDesc}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Onboarding Screen - Page 1: Glowee se présente
  if (!hasStarted && onboardingPage === 1) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${theme === 'dark' ? 'bg-stone-950 text-stone-100' : 'bg-amber-50 text-stone-900'}`}>
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in duration-700">
          {/* Glowee Image */}
          <div className="flex justify-center animate-in zoom-in duration-500">
            <img
              src="/Glowee/glowee-acceuillante.webp"
              alt="Glowee"
              className="w-64 h-64 object-contain"
            />
          </div>

          {/* Greeting */}
          <div className="space-y-4 animate-in slide-in-from-bottom duration-700 delay-300">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              {t.onboarding.gloweeGreeting}
            </h1>
            <p className="text-xl text-stone-700 dark:text-stone-300 font-light whitespace-pre-line leading-relaxed">
              {t.onboarding.gloweeIntro}
            </p>
          </div>

          {/* Next Button */}
          <Button
            onClick={() => setOnboardingPage(2)}
            className="w-full h-14 text-lg bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white font-semibold rounded-full shadow-lg shadow-rose-200 dark:shadow-rose-900/30 animate-in slide-in-from-bottom duration-700 delay-500"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  // Onboarding Screen - Page 2: Message de Glowee
  if (!hasStarted && onboardingPage === 2) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${theme === 'dark' ? 'bg-stone-950 text-stone-100' : 'bg-amber-50 text-stone-900'}`}>
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in duration-700">
          {/* Glowee Image */}
          <div className="flex justify-center animate-in zoom-in duration-500">
            <img
              src="/Glowee/glowee-acceuillante.webp"
              alt="Glowee"
              className="w-64 h-64 object-contain"
            />
          </div>

          {/* Message */}
          <div className="space-y-6 animate-in slide-in-from-bottom duration-700 delay-300">
            <p className="text-2xl text-stone-700 dark:text-stone-300 font-light whitespace-pre-line leading-relaxed">
              {t.onboarding.gloweeMessage}
            </p>
          </div>

          {/* Start Button */}
          <Button
            onClick={() => setCurrentView('challenge-selection')}
            className="w-full h-14 text-lg bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white font-semibold rounded-full shadow-lg shadow-rose-200 dark:shadow-rose-900/30 animate-in slide-in-from-bottom duration-700 delay-500"
          >
            {t.onboarding.gloweeButton}
            <Sparkles className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-navy-900 text-stone-100' : 'bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 text-stone-900'}`}>
      {/* Main Content */}
      <main className="flex-1 pb-28 overflow-y-auto">
        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="p-5 space-y-5 max-w-md mx-auto">
            {/* Header avec avatar et notification */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-200/50">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-xs text-pink-400 font-medium">Hello,</p>
                  <p className="font-bold text-base text-gray-800">{user?.email?.split('@')[0] || 'User'}</p>
                </div>
              </div>
              <button className="w-11 h-11 rounded-full bg-white shadow-lg shadow-pink-100/50 flex items-center justify-center hover:shadow-xl transition-shadow">
                <Bell className="w-5 h-5 text-pink-400" />
              </button>
            </div>

            {/* Message Glowee - Style glassmorphism - Hauteur réduite 60% + Glowee débordante */}
            <Card className="border-none shadow-xl shadow-pink-100/50 bg-white/80 backdrop-blur-md rounded-3xl overflow-visible relative">
              <CardContent className="p-0">
                <div className="flex items-center gap-2 p-2 pr-3 relative">
                  {/* Image Glowee agrandie et débordante en bas */}
                  <div className="relative w-16 h-20 flex-shrink-0 -mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 rounded-2xl blur-md opacity-40"></div>
                    <Image
                      src="/Glowee/glowee.webp"
                      alt="Glowee"
                      width={64}
                      height={80}
                      className="object-contain relative z-10 drop-shadow-2xl"
                    />
                  </div>

                  {/* Message avec rotation */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-pink-400">Glowee</p>
                    <p className="text-[11px] text-gray-700 leading-snug font-medium">
                      {(() => {
                        const hour = new Date().getHours();
                        const messages = {
                          fr: [
                            'Continue comme ça, tu es sur la bonne voie ! ✨',
                            'Chaque petit pas compte, ma belle ! 💫',
                            'Tu fais déjà tellement de progrès ! 🌸',
                            'Je suis fière de toi ! Continue ! 💖',
                            'Tu rayonnes de plus en plus ! ✨',
                            'Avance à ton rythme, c\'est parfait ! 🌟'
                          ],
                          en: [
                            'Keep it up, you\'re on the right track! ✨',
                            'Every little step counts, beautiful! 💫',
                            'You\'re already making so much progress! 🌸',
                            'I\'m proud of you! Keep going! 💖',
                            'You\'re shining more and more! ✨',
                            'Go at your own pace, it\'s perfect! 🌟'
                          ],
                          es: [
                            '¡Sigue así, vas por buen camino! ✨',
                            '¡Cada pequeño paso cuenta, hermosa! 💫',
                            '¡Ya estás haciendo tanto progreso! 🌸',
                            '¡Estoy orgullosa de ti! ¡Continúa! 💖',
                            '¡Brillas cada vez más! ✨',
                            '¡Ve a tu ritmo, es perfecto! 🌟'
                          ]
                        };
                        const langMessages = messages[language] || messages.fr;
                        return langMessages[hour % langMessages.length];
                      })()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trial Badge, Plan Pro Button et Challenge Switch Button */}
            <div className="flex items-center justify-center gap-2">
              <TrialBadge theme={theme} />
              <button
                onClick={() => setShowSubscription(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-lg shadow-pink-200/50 hover:shadow-xl hover:scale-105 transition-all"
              >
                <Crown className="w-4 h-4" />
                <span>Plan Pro</span>
              </button>
              <button
                onClick={() => setShowChallengeDrawer(true)}
                className="p-2.5 rounded-full bg-white shadow-lg shadow-pink-100/50 hover:shadow-xl transition-all"
              >
                <ChevronRight className="w-5 h-5 rotate-180 text-pink-400" />
              </button>
            </div>

            {/* Grande carte Challenge Mind & Life - Style glassmorphism */}
            {selectedChallenge === 'mind-life' && (
              <Card
                className="border-none shadow-2xl shadow-purple-200/50 cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-purple-100 via-pink-50 to-white rounded-[2rem] overflow-hidden relative"
                onClick={() => {
                  setCurrentDay(challengeProgress.currentDay);
                  setCurrentView('challenge');
                }}
              >
                <CardContent className="p-6 relative z-10">
                  {/* Illustration décorative 3D */}
                  <div className="absolute -top-2 -right-2 text-6xl opacity-10 drop-shadow-lg">
                    🎯
                  </div>

                  <div className="mb-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm mb-2">
                      <span className="text-xs font-bold text-purple-500">
                        {language === 'fr' ? 'Jour' : language === 'en' ? 'Day' : 'Día'} {challengeProgress.currentDay}/30
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 mb-2 pr-16 line-clamp-2">
                      {getCurrentDayData()?.title || (language === 'fr' ? 'Challenge du jour' : language === 'en' ? 'Challenge of the day' : 'Desafío del día')}
                    </h2>
                    <Badge className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xs px-3 py-1 rounded-full border-0 shadow-lg shadow-purple-200/50">
                      {language === 'fr' ? 'Esprit & Vie' : language === 'en' ? 'Mind & Life' : 'Mente & Vida'}
                    </Badge>
                  </div>

                  {/* Barre de progression avec style glassmorphism */}
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="font-medium">{language === 'fr' ? 'Progression' : language === 'en' ? 'Progress' : 'Progreso'}</span>
                      <span className="font-bold text-purple-500">{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="h-2 bg-white/60 backdrop-blur-sm rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500 shadow-lg"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Grande carte Beauty & Body - Style glassmorphism */}
            {selectedChallenge === 'beauty-body' && (
              <Card
                className="border-none shadow-2xl shadow-pink-200/50 cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-pink-100 via-rose-50 to-white rounded-[2rem] overflow-hidden relative"
                onClick={() => setCurrentView('new-me')}
              >
                <CardContent className="p-6 relative z-10">
                  <div className="absolute -top-2 -right-2 text-6xl opacity-10 drop-shadow-lg">
                    ✨
                  </div>

                  <div className="mb-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm mb-2">
                      <span className="text-xs font-bold text-pink-500">
                        {language === 'fr' ? 'Jour' : language === 'en' ? 'Day' : 'Día'} {newMeCurrentDay}/30
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 mb-2 pr-16 line-clamp-2">
                      {t.newMe.subtitle}
                    </h2>
                    <Badge className="bg-gradient-to-r from-pink-400 to-rose-400 text-white text-xs px-3 py-1 rounded-full border-0 shadow-lg shadow-pink-200/50">
                      {language === 'fr' ? 'Beauté & Corps' : language === 'en' ? 'Beauty & Body' : 'Belleza & Cuerpo'}
                    </Badge>
                  </div>

                  {/* Barre de progression avec style glassmorphism */}
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="font-medium">{language === 'fr' ? 'Progression' : language === 'en' ? 'Progress' : 'Progreso'}</span>
                      <span className="font-bold text-pink-500">{Math.round((newMeCurrentDay / 30) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-white/60 backdrop-blur-sm rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full transition-all duration-500 shadow-lg"
                        style={{ width: `${(newMeCurrentDay / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Petits Succès Compact */}
            <SmallWinsCompact theme={theme} />

            {/* Grille de cartes - 2 colonnes */}
            <div className="grid grid-cols-2 gap-3">
              {/* Carte Mes Habitudes */}
              <Card
                className="border-none shadow-xl shadow-orange-100/50 bg-gradient-to-br from-orange-50 via-pink-50 to-white rounded-[1.5rem] cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                onClick={() => setCurrentView('trackers')}
              >
                <CardContent className="p-4 relative overflow-hidden">
                  <div className="absolute -top-1 -right-1 text-4xl opacity-10 drop-shadow-lg">
                    📚
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-sm font-bold text-gray-800 mb-3">
                      {language === 'fr' ? 'Mes Habitudes' : language === 'en' ? 'My Habits' : 'Mis Hábitos'}
                    </h3>
                    <div className="space-y-2">
                      <button className="w-full px-3 py-1.5 bg-gradient-to-r from-pink-400 to-rose-400 text-white text-xs font-bold rounded-full shadow-lg shadow-pink-200/50">
                        {language === 'fr' ? 'Voir tout' : language === 'en' ? 'View all' : 'Ver todo'}
                      </button>
                      <div className="px-3 py-1.5 bg-white/60 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full text-center">
                        {(() => {
                          const todayTracker = getTodayTracker();
                          const completedHabits = Object.values(todayTracker.habits).filter(Boolean).length;
                          const totalHabits = 5 + customHabits.length;
                          return `${completedHabits}/${totalHabits} ${language === 'fr' ? 'complétés' : language === 'en' ? 'completed' : 'completados'}`;
                        })()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mon Journal */}
              <Card
                className="border-none shadow-xl shadow-purple-100/50 bg-gradient-to-br from-purple-50 via-pink-50 to-white rounded-[1.5rem] cursor-pointer transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
                onClick={() => setCurrentView('journal')}
              >
                <CardContent className="p-4 relative overflow-hidden">
                  <div className="absolute -top-1 -right-1 text-4xl opacity-10 drop-shadow-lg">
                    📖
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-lg">
                        <BookOpen className="w-5 h-5 text-purple-400" />
                      </div>
                      <h3 className="font-bold text-sm text-gray-800">{t.journal.title}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ma semaine */}
              <Card
                className="border-none shadow-xl shadow-pink-100/50 bg-gradient-to-br from-pink-50 via-rose-50 to-white rounded-[1.5rem] cursor-pointer transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
                onClick={() => setCurrentView('routine')}
              >
                <CardContent className="p-4 relative overflow-hidden">
                  {/* Emoji chef en bas, prenant 60% de la hauteur */}
                  <div className="absolute bottom-0 right-2 text-[4.5rem] opacity-20 drop-shadow-lg" style={{ lineHeight: '1' }}>
                    👩‍🍳
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Calendar className="w-5 h-5 text-pink-400" />
                      </div>
                      <h3 className="font-bold text-sm text-gray-800">
                        {language === 'fr' ? 'Ma semaine' : language === 'en' ? 'My week' : 'Mi semana'}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Carte Objectifs */}
              <Card
                className="border-none shadow-xl shadow-gray-200/50 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 rounded-[1.5rem] cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                onClick={() => setCurrentView('my-goals')}
              >
                <CardContent className="p-4 relative overflow-hidden">
                  <div className="absolute -top-1 -right-1 text-4xl opacity-20 drop-shadow-lg">
                    🎯
                  </div>
                  <div className="relative z-10">
                    <p className="text-xs text-white/70 mb-1 font-medium">
                      {language === 'fr' ? 'Mes Objectifs' : language === 'en' ? 'My Goals' : 'Mis Objetivos'}
                    </p>
                    <h3 className="text-sm font-bold text-white mb-3">
                      {language === 'fr' ? 'Atteindre mes rêves' : language === 'en' ? 'Achieve my dreams' : 'Alcanzar mis sueños'}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-300 to-purple-400 border-2 border-white shadow-lg" />
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-300 to-pink-400 border-2 border-white shadow-lg" />
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-300 to-orange-400 border-2 border-white shadow-lg" />
                      </div>
                      <span className="text-xs text-white/90 font-bold">+{goals.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Carte Glow Up (Bonus) */}
              <Card
                className="border-none shadow-xl shadow-pink-100/50 bg-gradient-to-br from-pink-100 via-purple-50 to-orange-50 rounded-[1.5rem] cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                onClick={() => setCurrentView('bonus')}
              >
                <CardContent className="p-4 relative overflow-hidden">
                  <div className="absolute -top-2 -right-2 text-5xl opacity-10 drop-shadow-lg">
                    ✨
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <Gift className="w-5 h-5 text-pink-400" />
                      </div>
                      <h3 className="font-bold text-xl text-gray-800">{t.bonus.title}</h3>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">
                      {language === 'fr' ? 'Routine & Guides' : language === 'en' ? 'Routine & Guides' : 'Rutina & Guías'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Carte 8 Limites */}
            <Card
              className="border-none shadow-xl shadow-pink-100/50 bg-white/80 backdrop-blur-md rounded-3xl cursor-pointer transition-all duration-300 hover:scale-[1.01]"
              onClick={() => setCurrentView('boundaries')}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center shadow-lg">
                    <span className="text-2xl drop-shadow-sm">🛡️</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base text-gray-800">
                      {language === 'fr' ? '8 Limites' : language === 'en' ? '8 Boundaries' : '8 Límites'}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      {language === 'fr' ? 'Pour ta paix intérieure' : language === 'en' ? 'For your inner peace' : 'Para tu paz interior'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-pink-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Challenge View - Glassmorphism */}
        {currentView === 'challenge' && (
          <div className="pb-20 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 min-h-screen">
            <div className="p-5 space-y-5 max-w-3xl mx-auto">
              {/* Header glassmorphism */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentView('dashboard')}
                  className="rounded-full w-10 h-10 bg-white/80 backdrop-blur-md shadow-lg shadow-pink-100/50 hover:bg-white"
                >
                  <X className="w-5 h-5 text-gray-800" />
                </Button>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-800">{t.challenge.title}</h1>
                  <p className="text-sm text-gray-600 font-medium">{t.challenge.day} {currentDay} / 30</p>
                </div>
              </div>

              {/* Day Selector - Glassmorphism */}
              <ScrollArea className="h-24 w-full">
                <div className="flex gap-2 pb-4">
                  {challengeDays.map((day) => {
                    const isLocked = !canAccessDay(day.day);
                    const isCompleted = challengeProgress.completedDays.includes(day.day);

                    return (
                      <Button
                        key={day.day}
                        variant={currentDay === day.day ? 'default' : 'outline'}
                        size="sm"
                        disabled={isLocked}
                        className={`min-w-12 relative rounded-xl font-semibold ${
                          currentDay === day.day
                            ? 'bg-gradient-to-br from-pink-400 to-rose-400 text-white shadow-lg shadow-pink-200/50'
                            : isCompleted
                              ? 'bg-gradient-to-br from-green-100 to-green-200 border-green-300 text-green-700'
                              : isLocked
                                ? 'opacity-40 bg-white/60 backdrop-blur-sm'
                                : 'bg-white/80 backdrop-blur-sm border-pink-200 hover:bg-pink-50'
                        }`}
                        onClick={() => !isLocked && setCurrentDay(day.day)}
                      >
                        {isCompleted && <Check className="w-3 h-3 absolute top-0 right-0 text-green-600" />}
                        {isLocked && <span className="text-xs">🔒</span>}
                        {!isLocked && !isCompleted && day.day}
                        {!isLocked && isCompleted && day.day}
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Day Content - Glassmorphism */}
              {getCurrentDayData() && (
                <Card className="border-none shadow-xl shadow-pink-100/50 bg-white/80 backdrop-blur-md rounded-[2rem]">
                  {!canAccessDay(currentDay) ? (
                    // Jour verrouillé
                    <CardContent className="p-12 text-center space-y-5">
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full blur-xl opacity-40"></div>
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center relative z-10 shadow-lg">
                          <span className="text-5xl drop-shadow-lg">🔒</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">{t.challenge.lockedDay}</h3>
                      <p className="text-gray-600 font-medium">
                        {t.challenge.completeCurrentDay}
                      </p>
                      <Button
                        onClick={() => setCurrentDay(getCurrentUnlockedDay())}
                        className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white rounded-[1.5rem] shadow-xl shadow-pink-200/50 h-12 px-6"
                      >
                        {t.challenge.viewDay} {getCurrentUnlockedDay()}
                      </Button>
                    </CardContent>
                  ) : (
                    // Jour accessible
                    <>
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-xs font-semibold text-pink-500 bg-pink-50 px-3 py-1 rounded-full">Challenge New Me</p>
                              <div
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                                  challengeProgress.completedDays.includes(currentDay)
                                    ? 'bg-gradient-to-br from-green-100 to-green-200'
                                    : 'bg-gradient-to-br from-pink-100 to-rose-100'
                                }`}
                              >
                                {challengeProgress.completedDays.includes(currentDay) ? (
                                  <Check className="w-7 h-7 text-green-600 drop-shadow-lg" />
                                ) : (
                                  <span className="text-2xl font-bold text-pink-600">{currentDay}</span>
                                )}
                              </div>
                            </div>
                            <Badge className="bg-gradient-to-r from-pink-400 to-rose-400 mb-3 text-white shadow-lg">{t.challenge.week} {getCurrentDayData()?.week}</Badge>
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-2xl text-gray-800">{getCurrentDayData()?.title}</CardTitle>
                              <Badge className="bg-gradient-to-r from-orange-400 to-amber-400 text-white text-xs px-2 py-1 shadow-md">
                                New me
                              </Badge>
                            </div>
                            <CardDescription className="text-sm text-gray-600 font-medium">{getCurrentDayData()?.weekObjective}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        {/* Description glassmorphism */}
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-50 to-white shadow-md">
                          <p className="text-base leading-relaxed text-gray-700 font-medium">{getCurrentDayData()?.content}</p>
                        </div>

                        {/* Affirmation glassmorphism */}
                        <div className="p-5 rounded-2xl border-l-4 border-pink-400 bg-gradient-to-br from-pink-50 to-rose-50 shadow-md">
                          <p className="italic text-gray-700 font-serif text-base">"{getCurrentDayData()?.affirmation}"</p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4">
                          <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                            <Sparkles className="w-6 h-6 text-pink-500 drop-shadow-lg" />
                            {t.challenge.yourDailyActions}
                          </h3>

                          <div className="grid gap-3">
                            {[
                              { key: 'beauty', label: t.challenge.beauty, icon: '💄', value: getCurrentDayData()?.actions.beauty },
                              getCurrentDayData()?.actions.mental && { key: 'mental', label: t.challenge.mental, icon: '🧠', value: getCurrentDayData()?.actions.mental },
                              { key: 'lifestyle', label: t.challenge.lifestyle, icon: '✨', value: getCurrentDayData()?.actions.lifestyle },
                              getCurrentDayData()?.actions.personnalite && { key: 'personnalite', label: 'Personnalité', icon: '🎭', value: getCurrentDayData()?.actions.personnalite },
                              getCurrentDayData()?.actions.butDeVie && { key: 'butDeVie', label: 'But de vie', icon: '🎯', value: getCurrentDayData()?.actions.butDeVie },
                              getCurrentDayData()?.actions.physique && { key: 'physique', label: 'Physique', icon: '💪', value: getCurrentDayData()?.actions.physique },
                              getCurrentDayData()?.actions.glowUp && { key: 'glowUp', label: 'Glow Up', icon: '✨', value: getCurrentDayData()?.actions.glowUp },
                              getCurrentDayData()?.actions.argent && { key: 'argent', label: 'Argent', icon: '💰', value: getCurrentDayData()?.actions.argent },
                              getCurrentDayData()?.actions.dieu && { key: 'dieu', label: 'Dieu', icon: '🙏', value: getCurrentDayData()?.actions.dieu },
                              getCurrentDayData()?.actions.apparence && { key: 'apparence', label: 'Apparence', icon: '👗', value: getCurrentDayData()?.actions.apparence },
                              getCurrentDayData()?.actions.vision && { key: 'vision', label: 'Vision', icon: '🔮', value: getCurrentDayData()?.actions.vision }
                            ].filter(Boolean).map((action, index) => {
                              const isCompleted = isActionCompleted(currentDay, action.key);

                              // Cas spécial pour l'action "vision" avec lien cliquable
                              if (action.key === 'vision' && (action.value === 'OBJECTIF_LINK' || action.value === 'OBJECTIF_LINK_DAY2')) {
                                return (
                                  <div
                                    key={index}
                                    className={`p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] bg-gradient-to-br from-white to-pink-50 shadow-md hover:shadow-lg ${isCompleted ? 'opacity-60' : ''}`}
                                    onClick={() => toggleActionCompletion(currentDay, action.key)}
                                  >
                                    <div className="flex items-start gap-3">
                                      <span className="text-3xl drop-shadow-lg">{action.icon}</span>
                                      <div className="flex-1">
                                        <h4 className={`font-bold text-sm mb-1 text-gray-800 ${isCompleted ? 'line-through' : ''}`}>{action.label}</h4>
                                        <p className={`text-sm ${isCompleted ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                                          {action.value === 'OBJECTIF_LINK' ? (
                                            <>
                                              {language === 'fr' ? 'Rends-toi dans la section ' : language === 'en' ? 'Go to the section ' : 'Ve a la sección '}
                                              <span
                                                className="font-bold text-pink-500 hover:text-pink-600 underline cursor-pointer"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setCurrentView('my-goals');
                                                }}
                                              >
                                                {language === 'fr' ? 'Atteindre mes rêves' : language === 'en' ? 'Achieve my dreams' : 'Alcanzar mis sueños'}
                                              </span>
                                              {language === 'fr' ? ' et crée ton premier objectif !' : language === 'en' ? ' and create your first goal!' : ' y crea tu primer objetivo!'}
                                            </>
                                          ) : (
                                            <>
                                              {language === 'fr' ? 'Pour avancer dans ton ' : language === 'en' ? 'To progress on your ' : 'Para avanzar en tu '}
                                              <span
                                                className="font-bold text-pink-500 hover:text-pink-600 underline cursor-pointer"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setCurrentView('my-goals');
                                                }}
                                              >
                                                {language === 'fr' ? 'objectif' : language === 'en' ? 'goal' : 'objetivo'}
                                              </span>
                                              {language === 'fr' ? ', rends-toi sur la page Objectifs.' : language === 'en' ? ', go to the Goals page.' : ', ve a la página de Objetivos.'}
                                            </>
                                          )}
                                        </p>
                                      </div>
                                      {isCompleted && <Check className="w-6 h-6 text-green-500 flex-shrink-0 drop-shadow-lg" />}
                                    </div>
                                  </div>
                                );
                              }

                              // Rendu normal pour les autres actions
                              return (
                                <div
                                  key={index}
                                  className={`p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] bg-gradient-to-br from-white to-pink-50 shadow-md hover:shadow-lg ${isCompleted ? 'opacity-60' : ''}`}
                                  onClick={() => toggleActionCompletion(currentDay, action.key)}
                                >
                                  <div className="flex items-start gap-3">
                                    <span className="text-3xl drop-shadow-lg">{action.icon}</span>
                                    <div className="flex-1">
                                      <h4 className={`font-bold text-sm mb-1 text-gray-800 ${isCompleted ? 'line-through' : ''}`}>{action.label}</h4>
                                      <p className={`text-sm ${isCompleted ? 'line-through text-gray-400' : 'text-gray-600'}`}>{action.value}</p>
                                    </div>
                                    {isCompleted && <Check className="w-6 h-6 text-green-500 flex-shrink-0 drop-shadow-lg" />}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Notes glassmorphism */}
                        <div className="space-y-3">
                          <label className="font-bold text-sm text-gray-800 flex items-center gap-2">
                            <span>📝</span>
                            {t.challenge.notes}
                          </label>
                          <Textarea
                            placeholder={t.challenge.notesPlaceholder}
                            value={challengeProgress.notes[currentDay] || ''}
                            onChange={(e) => updateDayNotes(currentDay, e.target.value)}
                            rows={4}
                            className="bg-white/60 backdrop-blur-sm border-pink-200 rounded-2xl text-sm focus:ring-2 focus:ring-pink-300 focus:border-transparent shadow-sm resize-none"
                          />
                        </div>

                        {/* Complete Button glassmorphism */}
                        <Button
                          onClick={handleCompleteDay}
                          className={`w-full h-14 text-base font-bold rounded-[1.5rem] shadow-xl ${
                            challengeProgress.completedDays.includes(currentDay)
                              ? 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 shadow-green-200/50'
                              : 'bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 shadow-pink-200/50'
                          } text-white`}
                        >
                          {challengeProgress.completedDays.includes(currentDay) ? (
                            <>
                              <Check className="mr-2 w-6 h-6" />
                              {t.challenge.completedButton}
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 w-6 h-6" />
                              {t.challenge.completeButton}
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </>
                  )}
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Journal View - Design Féminin Magnifique */}
        {currentView === 'journal' && (
          <div className="pb-20 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 min-h-screen">
            {/* Header élégant */}
            <div className="flex items-center gap-3 p-5 pb-3 max-w-3xl mx-auto">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-10 h-10 bg-white/80 backdrop-blur-md shadow-lg shadow-pink-100/50 hover:bg-white"
                onClick={() => setCurrentView('dashboard')}
              >
                <X className="w-5 h-5 text-gray-800" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">{t.journal.title}</h1>
                <p className="text-xs text-gray-600 font-medium">{t.journal.expressYourself}</p>
              </div>
            </div>

            {/* Formulaire nouvelle entrée - Design Féminin */}
            <div className="px-5 space-y-5 max-w-3xl mx-auto">
              <Card className="border-none shadow-2xl shadow-pink-200/50 bg-white/90 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
                {/* Header avec gradient */}
                <div className="bg-gradient-to-r from-pink-100 via-rose-100 to-pink-100 p-6 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center shadow-lg">
                      <span className="text-2xl">✨</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{t.journal.newEntry}</h2>
                      <p className="text-xs text-gray-600 font-medium">{new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    </div>
                  </div>
                </div>

                <CardContent className="space-y-6 p-6">
                  {/* Question 1: Comment te sens-tu aujourd'hui ? - Emojis élégants */}
                  <div className="space-y-3 p-5 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200/50">
                    <label className="text-base font-bold text-gray-800 flex items-center gap-2">
                      <span className="text-2xl">💭</span>
                      {t.journal.howFeelToday}
                    </label>
                    <div className="flex gap-3 justify-center py-2">
                      {['😔', '😐', '🙂', '😄', '😌'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => setNewJournalEntry({ ...newJournalEntry, mood: emoji })}
                          className={`w-16 h-16 rounded-2xl text-4xl transition-all ${
                            newJournalEntry.mood === emoji
                              ? 'bg-gradient-to-br from-pink-300 to-rose-300 scale-110 shadow-xl shadow-pink-300/50 ring-4 ring-pink-200'
                              : 'bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-105 shadow-lg'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question 2: Qu'est-ce qui t'a apporté du glow ? */}
                  <div className="space-y-3 p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/50">
                    <label className="text-base font-bold text-gray-800 flex items-center gap-2">
                      <span className="text-2xl">✨</span>
                      {t.journal.whatBroughtGlow}
                    </label>
                    <Textarea
                      placeholder={t.journal.momentsOfJoy}
                      value={newJournalEntry.glow}
                      onChange={(e) => setNewJournalEntry({ ...newJournalEntry, glow: e.target.value })}
                      rows={3}
                      className="bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-2xl text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-300 shadow-sm resize-none font-medium"
                    />
                  </div>

                  {/* Grid 2 colonnes pour questions courtes */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Question 3: Gratitude */}
                    <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50">
                      <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-xl">🙏</span>
                        {language === 'fr' ? 'Gratitude' : language === 'en' ? 'Gratitude' : 'Gratitud'}
                      </label>
                      <Textarea
                        placeholder={language === 'fr' ? 'Je suis reconnaissante pour...' : language === 'en' ? 'I\'m grateful for...' : 'Estoy agradecida por...'}
                        value={newJournalEntry.gratitude}
                        onChange={(e) => setNewJournalEntry({ ...newJournalEntry, gratitude: e.target.value })}
                        rows={3}
                        className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-300 shadow-sm resize-none font-medium"
                      />
                    </div>

                    {/* Question 4: Intention du jour */}
                    <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/50">
                      <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-xl">🎯</span>
                        {language === 'fr' ? 'Intention' : language === 'en' ? 'Intention' : 'Intención'}
                      </label>
                      <Textarea
                        placeholder={language === 'fr' ? 'Aujourd\'hui, je veux...' : language === 'en' ? 'Today, I want to...' : 'Hoy, quiero...'}
                        value={newJournalEntry.intention}
                        onChange={(e) => setNewJournalEntry({ ...newJournalEntry, intention: e.target.value })}
                        rows={3}
                        className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm resize-none font-medium"
                      />
                    </div>
                  </div>

                  {/* Question 5: Qu'est-ce que j'ai appris ? */}
                  <div className="space-y-3 p-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50">
                    <label className="text-base font-bold text-gray-800 flex items-center gap-2">
                      <span className="text-2xl">📚</span>
                      {t.journal.whatLearned}
                    </label>
                    <Textarea
                      placeholder={t.journal.discoveriesLearnings}
                      value={newJournalEntry.learned}
                      onChange={(e) => setNewJournalEntry({ ...newJournalEntry, learned: e.target.value })}
                      rows={3}
                      className="bg-white/80 backdrop-blur-sm border-2 border-green-200 rounded-2xl text-sm focus:ring-2 focus:ring-green-300 focus:border-green-300 shadow-sm resize-none font-medium"
                    />
                  </div>

                  {/* Question 6: Journal libre */}
                  <div className="space-y-3 p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200/50">
                    <label className="text-base font-bold text-gray-800 flex items-center gap-2">
                      <span className="text-2xl">💌</span>
                      {t.journal.freeContent}
                    </label>
                    <Textarea
                      placeholder={language === 'fr' ? 'Écris librement ce qui te passe par la tête...' : language === 'en' ? 'Write freely what\'s on your mind...' : 'Escribe libremente lo que piensas...'}
                      value={newJournalEntry.freeContent}
                      onChange={(e) => setNewJournalEntry({ ...newJournalEntry, freeContent: e.target.value })}
                      rows={4}
                      className="bg-white/80 backdrop-blur-sm border-2 border-rose-200 rounded-2xl text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-300 shadow-sm resize-none font-medium"
                    />
                  </div>

                  {/* Bouton de sauvegarde magnifique */}
                  <Button
                    onClick={handleSaveJournalEntry}
                    className="w-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-500 hover:via-rose-500 hover:to-pink-600 text-white rounded-2xl shadow-2xl shadow-pink-300/50 h-14 font-bold text-base hover:scale-[1.02] transition-all"
                  >
                    <span className="text-xl mr-2">✨</span>
                    {language === 'fr' ? 'Sauvegarder mon journal' : language === 'en' ? 'Save my journal' : 'Guardar mi diario'}
                  </Button>
                </CardContent>
              </Card>

              {/* Historique du Journal */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-pink-400" />
                  {t.journal.history}
                </h2>
                {journalEntries.length === 0 ? (
                  <div className="text-center p-10 rounded-[2rem] bg-white/80 backdrop-blur-md shadow-xl shadow-pink-100/50">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-pink-300 drop-shadow-lg" />
                    <p className="text-gray-600 font-medium">{t.journal.noEntries}</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {journalEntries.map((entry) => (
                      <Card key={entry.id} className="border-none shadow-xl shadow-pink-100/50 bg-white/80 backdrop-blur-md rounded-[2rem] hover:scale-[1.01] transition-transform">
                        <CardContent className="p-5 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {entry.mood && <span className="text-3xl drop-shadow-lg">{entry.mood}</span>}
                              <span className="text-xs font-semibold text-pink-500 bg-pink-50 px-3 py-1 rounded-full">
                                {new Date(entry.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                              onClick={() => deleteJournalEntry(entry.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Glow */}
                          {entry.glow && (
                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200/50">
                              <p className="text-xs font-bold text-orange-600 mb-2 flex items-center gap-1">
                                <span className="text-lg">✨</span>
                                {t.journal.glowOfDay}
                              </p>
                              <p className="text-sm text-gray-800 font-medium">{entry.glow}</p>
                            </div>
                          )}

                          {/* Grid 2 colonnes pour gratitude et intention */}
                          <div className="grid md:grid-cols-2 gap-3">
                            {entry.gratitude && (
                              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-200/50">
                                <p className="text-xs font-bold text-purple-600 mb-1 flex items-center gap-1">
                                  <span>🙏</span>
                                  {language === 'fr' ? 'Gratitude' : language === 'en' ? 'Gratitude' : 'Gratitud'}
                                </p>
                                <p className="text-sm text-gray-800 font-medium">{entry.gratitude}</p>
                              </div>
                            )}
                            {entry.intention && (
                              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-200/50">
                                <p className="text-xs font-bold text-blue-600 mb-1 flex items-center gap-1">
                                  <span>🎯</span>
                                  {language === 'fr' ? 'Intention' : language === 'en' ? 'Intention' : 'Intención'}
                                </p>
                                <p className="text-sm text-gray-800 font-medium">{entry.intention}</p>
                              </div>
                            )}
                          </div>

                          {/* Apprentissage */}
                          {entry.learned && (
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200/50">
                              <p className="text-xs font-bold text-green-600 mb-2 flex items-center gap-1">
                                <span className="text-lg">📚</span>
                                {language === 'fr' ? 'Appris' : language === 'en' ? 'Learned' : 'Aprendido'}
                              </p>
                              <p className="text-sm text-gray-800 font-medium">{entry.learned}</p>
                            </div>
                          )}

                          {/* Journal libre */}
                          {entry.freeContent && (
                            <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-4 rounded-xl border border-rose-200/50">
                              <p className="text-xs font-bold text-rose-600 mb-2 flex items-center gap-1">
                                <span className="text-lg">💌</span>
                                {language === 'fr' ? 'Libre' : language === 'en' ? 'Free' : 'Libre'}
                              </p>
                              <p className="text-sm text-gray-800 font-medium">{entry.freeContent}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Glowee Chat View */}
        {currentView === 'glowee-chat' && (
          <div className="h-screen flex flex-col pb-16">
            <AIChat
              theme={theme}
              systemPrompt="Tu es Glowee, une assistante IA bienveillante et encourageante. Tu aides les utilisateurs dans leur parcours de développement personnel avec empathie et positivité. Tu réponds toujours dans la langue de l'utilisateur."
              placeholder="Parle-moi de ce qui te préoccupe..."
              maxHeight="calc(100vh - 200px)"
              onClose={() => setCurrentView('dashboard')}
            />
          </div>
        )}

        {/* Trackers View - Design Educational Moderne */}
        {currentView === 'trackers' && (
          <div className="pb-20 bg-cream-100 min-h-screen">
            {/* Header avec bouton retour */}
            <div className="flex items-center gap-3 p-5 pb-3 max-w-lg mx-auto">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-10 h-10 bg-white shadow-soft"
                onClick={() => setCurrentView('dashboard')}
              >
                <X className="w-5 h-5 text-navy-900" />
              </Button>
              <h1 className="text-xl font-bold text-navy-900">{t.trackers.title}</h1>
            </div>

            {/* Sélecteur de jours - Design moderne */}
            <div className="overflow-x-auto scrollbar-hide px-5 py-3">
              <div className="flex gap-2 min-w-max">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                  const dayData = trackers.find(t => {
                    if (!trackerStartDate) return false;
                    const trackerDate = new Date(trackerStartDate);
                    trackerDate.setDate(trackerDate.getDate() + (day - 1));
                    return t.date === trackerDate.toISOString().split('T')[0];
                  });
                  const isCompleted = dayData?.completed || false;
                  const completionPercentage = dayData ? Math.round(
                    ((dayData.waterGlasses > 0 ? 1 : 0) +
                    (dayData.sleepHours > 0 ? 1 : 0) +
                    (dayData.mood > 0 ? 1 : 0) +
                    (dayData.activityMinutes > 0 ? 1 : 0) +
                    (dayData.skincareCompleted ? 1 : 0) +
                    Object.values(dayData.habits).filter(Boolean).length) /
                    (5 + Object.keys(dayData.habits).length) * 100
                  ) : 0;

                  return (
                    <button
                      key={day}
                      onClick={() => setTrackerCurrentDay(day)}
                      className={`flex-shrink-0 w-12 h-12 rounded-2xl font-semibold text-sm transition-all relative shadow-soft ${
                        trackerCurrentDay === day
                          ? 'bg-gradient-to-br from-soft-purple-300 to-soft-purple-500 text-white scale-105'
                          : 'bg-white text-navy-900 hover:bg-soft-purple-100'
                      }`}
                    >
                      {day}
                      {isCompleted && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-soft-orange-400 to-soft-orange-500 rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      {!isCompleted && completionPercentage > 0 && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-soft-purple-500">
                          {completionPercentage}%
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Carte de progression */}
            <div className="mx-5 p-4 rounded-3xl shadow-soft-lg bg-gradient-to-br from-soft-purple-100 to-soft-purple-200 relative overflow-hidden">
              {/* Emoji décoratif */}
              <div className="absolute top-2 right-2 text-6xl opacity-10">
                🎯
              </div>

              <div className="space-y-3 relative z-10">
                <h2 className="text-lg font-bold text-navy-900">
                  {language === 'fr' ? `Jour ${trackerCurrentDay} !` :
                   language === 'en' ? `Day ${trackerCurrentDay}!` :
                   `¡Día ${trackerCurrentDay}!`}
                </h2>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-soft-purple-500">
                    {language === 'fr' ? 'Jour' : language === 'en' ? 'Day' : 'Día'} {trackerCurrentDay} / 30
                  </span>
                  <span className="text-navy-800">
                    {(() => {
                      const dayData = trackers.find(t => {
                        if (!trackerStartDate) return false;
                        const trackerDate = new Date(trackerStartDate);
                        trackerDate.setDate(trackerDate.getDate() + (trackerCurrentDay - 1));
                        return t.date === trackerDate.toISOString().split('T')[0];
                      });
                      const completed = dayData ?
                        (dayData.waterGlasses > 0 ? 1 : 0) +
                        (dayData.sleepHours > 0 ? 1 : 0) +
                        (dayData.mood > 0 ? 1 : 0) +
                        (dayData.activityMinutes > 0 ? 1 : 0) +
                        (dayData.skincareCompleted ? 1 : 0) +
                        Object.values(dayData.habits).filter(Boolean).length : 0;
                      const total = 5 + (dayData ? Object.keys(dayData.habits).length : 6) + customHabits.length;
                      return `${completed} / ${total} ${language === 'fr' ? 'habitudes' : language === 'en' ? 'habits' : 'hábitos'}`;
                    })()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-navy-900">
                      {language === 'fr' ? 'Progression' : language === 'en' ? 'Progress' : 'Progreso'}
                    </span>
                    <span className="text-xl font-bold text-soft-purple-500">
                      {(() => {
                        const dayData = trackers.find(t => {
                          if (!trackerStartDate) return false;
                          const trackerDate = new Date(trackerStartDate);
                          trackerDate.setDate(trackerDate.getDate() + (trackerCurrentDay - 1));
                          return t.date === trackerDate.toISOString().split('T')[0];
                        });
                        if (!dayData) return '0%';
                        const completed =
                          (dayData.waterGlasses > 0 ? 1 : 0) +
                          (dayData.sleepHours > 0 ? 1 : 0) +
                          (dayData.mood > 0 ? 1 : 0) +
                          (dayData.activityMinutes > 0 ? 1 : 0) +
                          (dayData.skincareCompleted ? 1 : 0) +
                          Object.values(dayData.habits).filter(Boolean).length;
                        const total = 5 + Object.keys(dayData.habits).length;
                        return Math.round((completed / total) * 100) + '%';
                      })()}
                    </span>
                  </div>
                  <div className="h-2 bg-white/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-navy-900 transition-all duration-500 rounded-full"
                      style={{
                        width: (() => {
                          const dayData = trackers.find(t => {
                            if (!trackerStartDate) return false;
                            const trackerDate = new Date(trackerStartDate);
                            trackerDate.setDate(trackerDate.getDate() + (trackerCurrentDay - 1));
                            return t.date === trackerDate.toISOString().split('T')[0];
                          });
                          if (!dayData) return '0%';
                          const completed =
                            (dayData.waterGlasses > 0 ? 1 : 0) +
                            (dayData.sleepHours > 0 ? 1 : 0) +
                            (dayData.mood > 0 ? 1 : 0) +
                            (dayData.activityMinutes > 0 ? 1 : 0) +
                            (dayData.skincareCompleted ? 1 : 0) +
                            Object.values(dayData.habits).filter(Boolean).length;
                          const total = 5 + Object.keys(dayData.habits).length;
                          return Math.round((completed / total) * 100) + '%';
                        })()
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu des trackers */}
            <div className="p-5 space-y-4 max-w-lg mx-auto">
              {/* Jour et Date - Design moderne */}
              <div className="text-center pb-3">
                <h2 className="text-lg font-bold text-navy-900 capitalize">
                  {new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', { weekday: 'long' })}
                </h2>
                <p className="text-xs text-stone-600 mt-0.5">
                  {new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              {/* Hydration - Design moderne */}
              <div className="bg-white rounded-2xl p-4 shadow-soft">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-soft-purple-100 flex items-center justify-center">
                    <Droplet className="w-4 h-4 text-soft-purple-500" />
                  </div>
                  <h3 className="font-semibold text-sm text-navy-900">{t.trackers.hydration}</h3>
                  <span className="ml-auto text-xs text-navy-800 font-medium">{getTodayTracker().waterGlasses} / 8</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {[...Array(8)].map((_, i) => (
                    <Button
                      key={i}
                      variant={i < getTodayTracker().waterGlasses ? 'default' : 'outline'}
                      size="icon"
                      className={`w-9 h-9 rounded-xl text-base ${i < getTodayTracker().waterGlasses ? 'bg-soft-purple-400 hover:bg-soft-purple-500 border-none' : 'border-soft-purple-200 hover:bg-soft-purple-100'}`}
                      onClick={() => updateTodayTracker({ waterGlasses: i < getTodayTracker().waterGlasses ? i : i + 1 })}
                    >
                      💧
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sleep - Design moderne */}
              <div className="bg-white rounded-2xl p-4 shadow-soft">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-peach-100 flex items-center justify-center">
                    <Moon className="w-4 h-4 text-peach-500" />
                  </div>
                  <h3 className="font-semibold text-sm text-navy-900">{t.trackers.sleep}</h3>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 rounded-xl border-peach-200 hover:bg-peach-100"
                    onClick={() => updateTodayTracker({ sleepHours: Math.max(0, (getTodayTracker().sleepHours || 0) - 0.5) })}
                  >
                    -
                  </Button>
                  <div className="text-3xl font-bold min-w-[70px] text-center text-navy-900">
                    {getTodayTracker().sleepHours || 0}<span className="text-xl">h</span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 rounded-xl border-peach-200 hover:bg-peach-100"
                    onClick={() => updateTodayTracker({ sleepHours: Math.min(12, (getTodayTracker().sleepHours || 0) + 0.5) })}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Mood - Design moderne */}
              <div className="bg-white rounded-2xl p-4 shadow-soft">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-soft-orange-100 flex items-center justify-center">
                    <Smile className="w-4 h-4 text-soft-orange-500" />
                  </div>
                  <h3 className="font-semibold text-sm text-navy-900">{t.trackers.mood}</h3>
                </div>
                <div className="flex gap-2 justify-between">
                  {['😢', '😕', '😐', '🙂', '😄'].map((emoji, i) => (
                    <Button
                      key={i}
                      variant={getTodayTracker().mood === i + 1 ? 'default' : 'outline'}
                      size="icon"
                      className={`w-11 h-11 rounded-xl text-xl ${getTodayTracker().mood === i + 1 ? 'bg-soft-orange-400 hover:bg-soft-orange-500 border-none' : 'border-soft-orange-200 hover:bg-soft-orange-100'}`}
                      onClick={() => updateTodayTracker({ mood: i + 1 })}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Skincare - Design moderne */}
              <button
                onClick={() => updateTodayTracker({ skincareCompleted: !getTodayTracker().skincareCompleted })}
                className="w-full flex items-center justify-between p-4 rounded-2xl transition-all bg-gradient-to-br from-peach-100 to-peach-200 shadow-soft hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/60 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-peach-500" />
                  </div>
                  <div className="text-left">
                    <h3 className={`font-semibold text-sm text-navy-900 ${getTodayTracker().skincareCompleted ? 'line-through' : ''}`}>
                      {t.trackers.skincareCompleted}
                    </h3>
                    <p className="text-xs text-navy-800">
                      {t.trackers.todaysRoutine}
                    </p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  getTodayTracker().skincareCompleted
                    ? 'bg-peach-500 border-peach-500'
                    : 'border-peach-300'
                }`}>
                  {getTodayTracker().skincareCompleted && <Check className="w-4 h-4 text-white" />}
                </div>
              </button>

              {/* Habits */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-green-400" />
                  {t.trackers.dailyHabits}
                </h3>
                <div className="space-y-2">
                  {/* Médite sur dieu - pleine largeur */}
                  {(() => {
                    const habit = { key: 'meditation', label: t.trackers.meditation5min };
                    const isCompleted = getTodayTracker().habits[habit.key] || false;
                    return (
                      <button
                        key={habit.key}
                        onClick={() =>
                          updateTodayTracker({
                            habits: { ...getTodayTracker().habits, [habit.key]: !isCompleted }
                          })
                        }
                        className="flex items-center justify-between p-3 rounded-lg w-full transition-all bg-stone-50 dark:bg-stone-800"
                      >
                        <span className="text-sm">{habit.label}</span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isCompleted
                            ? 'bg-green-600 border-green-600'
                            : 'border-stone-300 dark:border-stone-600'
                        }`}>
                          {isCompleted && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </button>
                    );
                  })()}

                  {/* Journaling, Gratitude, Exercice, Lecture - Cases à cocher sur la même ligne */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'journaling', label: t.trackers.journaling },
                      { key: 'gratitude', label: t.trackers.gratitude },
                      { key: 'exercise', label: t.trackers.exercise },
                      { key: 'reading', label: t.trackers.reading }
                    ].map((habit) => {
                      const isCompleted = getTodayTracker().habits[habit.key] || false;
                      return (
                        <button
                          key={habit.key}
                          onClick={() =>
                            updateTodayTracker({
                              habits: { ...getTodayTracker().habits, [habit.key]: !isCompleted }
                            })
                          }
                          className="flex items-center justify-between p-2.5 rounded-lg transition-all bg-stone-50 dark:bg-stone-800"
                        >
                          <span className="text-xs flex-1 text-left">{habit.label}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isCompleted
                              ? 'bg-green-600 border-green-600'
                              : 'border-stone-300 dark:border-stone-600'
                          }`}>
                            {isCompleted && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Pas de scroll - pleine largeur */}
                  {(() => {
                    const habit = { key: 'noScroll', label: t.trackers.noScrollBeforeSleep };
                    const isCompleted = getTodayTracker().habits[habit.key] || false;
                    return (
                      <button
                        key={habit.key}
                        onClick={() =>
                          updateTodayTracker({
                            habits: { ...getTodayTracker().habits, [habit.key]: !isCompleted }
                          })
                        }
                        className="flex items-center justify-between p-3 rounded-lg w-full transition-all bg-stone-50 dark:bg-stone-800"
                      >
                        <span className="text-sm">{habit.label}</span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isCompleted
                            ? 'bg-green-600 border-green-600'
                            : 'border-stone-300 dark:border-stone-600'
                        }`}>
                          {isCompleted && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </button>
                    );
                  })()}

                  {/* Habitudes personnalisées */}
                  {customHabits.map((habit) => {
                    const isCompleted = getTodayTracker().habits[habit.id] || false;
                    return (
                      <div key={habit.id} className={`flex items-center justify-between p-3 rounded-lg ${
                        habit.type === 'good'
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                      }`}>
                        <div className="flex items-center gap-2 flex-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => setCustomHabits(customHabits.filter(h => h.id !== habit.id))}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <button
                            onClick={() =>
                              updateTodayTracker({
                                habits: { ...getTodayTracker().habits, [habit.id]: !isCompleted }
                              })
                            }
                            className="flex items-center gap-2 flex-1"
                          >
                            <span className="text-sm">{habit.label}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-stone-800">
                              {habit.type === 'good' ? '✨' : '⚠️'}
                            </span>
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            updateTodayTracker({
                              habits: { ...getTodayTracker().habits, [habit.id]: !isCompleted }
                            })
                          }
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isCompleted
                              ? 'bg-green-600 border-green-600'
                              : 'border-stone-300 dark:border-stone-600'
                          }`}
                        >
                          {isCompleted && <Check className="w-4 h-4 text-white" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bouton ajouter une habitude */}
              {!showAddHabit ? (
                <Button
                  variant="outline"
                  className="w-full border-dashed border-2 bg-rose-500 hover:bg-rose-600 text-white border-rose-400"
                  onClick={() => setShowAddHabit(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {language === 'fr' ? 'Ajouter une habitude' : language === 'en' ? 'Add a habit' : 'Agregar un hábito'}
                </Button>
              ) : (
                <div className={`p-4 rounded-xl border-2 border-dashed ${theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'}`}>
                  <div className="space-y-3">
                    <Input
                      placeholder={language === 'fr' ? 'Nom de l\'habitude' : language === 'en' ? 'Habit name' : 'Nombre del hábito'}
                      value={newHabitLabel}
                      onChange={(e) => setNewHabitLabel(e.target.value)}
                      className={theme === 'dark' ? 'bg-stone-900 border-stone-700' : 'bg-white'}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className={`flex-1 ${newHabitType === 'good' ? 'border-2 border-stone-900 dark:border-stone-100' : 'border-stone-300 dark:border-stone-700'}`}
                        onClick={() => setNewHabitType('good')}
                      >
                        ✨ {language === 'fr' ? 'Bonne' : language === 'en' ? 'Good' : 'Buena'}
                      </Button>
                      <Button
                        variant="outline"
                        className={`flex-1 ${newHabitType === 'bad' ? 'border-2 border-stone-900 dark:border-stone-100' : 'border-stone-300 dark:border-stone-700'}`}
                        onClick={() => setNewHabitType('bad')}
                      >
                        ⚠️ {language === 'fr' ? 'Mauvaise' : language === 'en' ? 'Bad' : 'Mala'}
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        className="flex-1 bg-rose-500 hover:bg-rose-600 text-white border-0"
                        onClick={() => {
                          if (newHabitLabel.trim()) {
                            setCustomHabits([...customHabits, {
                              id: `custom_${Date.now()}`,
                              label: newHabitLabel,
                              type: newHabitType
                            }]);
                            setNewHabitLabel('');
                            setShowAddHabit(false);
                          }
                        }}
                      >
                        {language === 'fr' ? 'Ajouter' : language === 'en' ? 'Add' : 'Agregar'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowAddHabit(false);
                          setNewHabitLabel('');
                        }}
                      >
                        {language === 'fr' ? 'Annuler' : language === 'en' ? 'Cancel' : 'Cancelar'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Planning View - Mon Planning */}
        {currentView === 'routine' && (
          <div className="pb-24 relative z-0">
            {/* Header */}
            <div className="p-6 pb-0">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentView('dashboard')}
                >
                  <X className="w-5 h-5" />
                </Button>
                <h1 className="text-2xl font-bold">
                  {language === 'fr' ? 'Mon Planning' : language === 'en' ? 'My Planning' : 'Mi Planificación'}
                </h1>
              </div>
            </div>

            {/* Navigation Tabs - Mes tâches & Glowee tâches */}
            <div className="px-6 pb-4">
              <div className="flex gap-2 max-w-lg mx-auto">
                <button
                  onClick={() => setPlanningTab('my-tasks')}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    planningTab === 'my-tasks'
                      ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-white shadow-lg'
                      : theme === 'dark'
                        ? 'bg-stone-800/50 text-stone-400 hover:bg-stone-800 hover:text-stone-300'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  }`}
                >
                  {language === 'fr' ? 'Mes tâches' : language === 'en' ? 'My tasks' : 'Mis tareas'}
                </button>
                <button
                  onClick={() => setPlanningTab('glowee-tasks')}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    planningTab === 'glowee-tasks'
                      ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-white shadow-lg'
                      : theme === 'dark'
                        ? 'bg-stone-800/50 text-stone-400 hover:bg-stone-800 hover:text-stone-300'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  }`}
                >
                  {language === 'fr' ? 'Glowee tâches' : language === 'en' ? 'Glowee tasks' : 'Tareas Glowee'}
                </button>
              </div>
            </div>

            {/* Navigation par semaine */}
            <div className="px-6 pb-4">
              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} shadow-sm`}>
                <div className="flex items-center justify-between gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentWeekOffset(prev => prev - 1)}
                    className="flex-shrink-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="flex-1 text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-rose-400" />
                      <p className="text-sm font-semibold">
                        {currentWeekOffset === 0
                          ? (language === 'fr' ? 'Cette semaine' : language === 'en' ? 'This week' : 'Esta semana')
                          : currentWeekOffset === 1
                          ? (language === 'fr' ? 'Semaine prochaine' : language === 'en' ? 'Next week' : 'Próxima semana')
                          : currentWeekOffset === -1
                          ? (language === 'fr' ? 'Semaine dernière' : language === 'en' ? 'Last week' : 'Semana pasada')
                          : formatWeekRange(currentWeekOffset)
                        }
                      </p>
                    </div>
                    <p className={`text-xs ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                      {formatWeekRange(currentWeekOffset)}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentWeekOffset(prev => prev + 1)}
                    className="flex-shrink-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {currentWeekOffset !== 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentWeekOffset(0)}
                    className="w-full mt-3 text-xs"
                  >
                    {language === 'fr' ? 'Retour à cette semaine' : language === 'en' ? 'Back to this week' : 'Volver a esta semana'}
                  </Button>
                )}
              </div>
            </div>

            {/* Contenu du planning */}
            <div className="px-6 space-y-4 max-w-lg mx-auto">
              {/* Légende des objectifs (seulement pour Glowee tâches et s'il y a 2+ objectifs) */}
              {planningTab === 'glowee-tasks' && (() => {
                const activeGoals = getActiveGoals();
                if (activeGoals.length >= 2) {
                  return (
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} shadow-lg`}>
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-rose-400" />
                        {language === 'fr' ? 'Objectifs en cours' : language === 'en' ? 'Active goals' : 'Objetivos activos'}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {activeGoals.map((goal) => (
                          <div
                            key={goal.id}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                              theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50'
                            }`}
                          >
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: goal.color }}
                            />
                            <span className="text-xs font-medium truncate max-w-[150px]">
                              {goal.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Mes 3 priorités de la semaine */}
              <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} shadow-lg`}>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-rose-400" />
                  {language === 'fr' ? 'Mes 3 priorités de la semaine' : language === 'en' ? 'My 3 weekly priorities' : 'Mis 3 prioridades semanales'}
                </h2>

                {/* Sélecteur d'objectif (seulement pour Glowee tâches) */}
                {planningTab === 'glowee-tasks' && goalsWithPriorities.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">
                      {language === 'fr' ? 'Afficher les priorités de :' : language === 'en' ? 'Show priorities for:' : 'Mostrar prioridades de:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {goalsWithPriorities.map((goal) => (
                        <button
                          key={goal.id}
                          onClick={() => setSelectedGoalForPriorities(goal.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            selectedGoalForPriorities === goal.id
                              ? theme === 'dark' ? 'bg-stone-700 ring-2 ring-offset-2 ring-offset-stone-900' : 'bg-stone-200 ring-2 ring-offset-2 ring-offset-white'
                              : theme === 'dark' ? 'bg-stone-800 hover:bg-stone-700' : 'bg-stone-50 hover:bg-stone-100'
                          }`}
                          style={selectedGoalForPriorities === goal.id ? { ringColor: goal.color } : {}}
                        >
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: goal.color }}
                          />
                          <span className="truncate max-w-[120px]">{goal.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {(() => {
                    // Déterminer quelles priorités afficher
                    let prioritiesToShow = weekPriorities;

                    if (planningTab === 'glowee-tasks' && selectedGoalForPriorities) {
                      const selectedGoal = goalsWithPriorities.find(g => g.id === selectedGoalForPriorities);
                      if (selectedGoal) {
                        prioritiesToShow = selectedGoal.weeklyPriorities;
                      }
                    }

                    if (prioritiesToShow.length === 0) {
                      return (
                        <p className="text-sm text-stone-500 dark:text-stone-400 text-center py-4">
                          {language === 'fr' ? 'Aucune priorité définie' : language === 'en' ? 'No priorities set' : 'Sin prioridades definidas'}
                        </p>
                      );
                    }

                    return prioritiesToShow.map((priority) => (
                      <div
                        key={priority.id}
                        className={`flex items-center gap-3 p-3 rounded-xl ${
                          theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50'
                        }`}
                      >
                        {/* Indicateur de couleur pour les priorités Glowee */}
                        {planningTab === 'glowee-tasks' && selectedGoalForPriorities && (() => {
                          const selectedGoal = goalsWithPriorities.find(g => g.id === selectedGoalForPriorities);
                          return selectedGoal ? (
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: selectedGoal.color }}
                            />
                          ) : null;
                        })()}
                        <span className={`flex-1 ${priority.completed ? 'line-through text-stone-500' : ''}`}>
                          {priority.text}
                        </span>
                        <button
                          onClick={() => {
                            if (planningTab === 'glowee-tasks' && selectedGoalForPriorities) {
                              // Supprimer de l'objectif sélectionné
                              setGoalsWithPriorities(prev => prev.map(g =>
                                g.id === selectedGoalForPriorities
                                  ? { ...g, weeklyPriorities: g.weeklyPriorities.filter(p => p.id !== priority.id) }
                                  : g
                              ));
                            } else {
                              // Supprimer des priorités manuelles
                              setWeekPriorities(weekPriorities.filter(p => p.id !== priority.id));
                            }
                          }}
                          className="text-stone-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Jours de la semaine - 2 par ligne */}
              <div className="grid grid-cols-2 gap-3 items-start">
                {(() => {
                  const today = new Date();
                  const todayStr = today.toISOString().split('T')[0];
                  const weekDates = getWeekDates(currentWeekOffset);

                  return [
                    { key: 'monday', label: language === 'fr' ? 'Lundi' : language === 'en' ? 'Monday' : 'Lunes', index: 0 },
                    { key: 'tuesday', label: language === 'fr' ? 'Mardi' : language === 'en' ? 'Tuesday' : 'Martes', index: 1 },
                    { key: 'wednesday', label: language === 'fr' ? 'Mercredi' : language === 'en' ? 'Wednesday' : 'Miércoles', index: 2 },
                    { key: 'thursday', label: language === 'fr' ? 'Jeudi' : language === 'en' ? 'Thursday' : 'Jueves', index: 3 },
                    { key: 'friday', label: language === 'fr' ? 'Vendredi' : language === 'en' ? 'Friday' : 'Viernes', index: 4 },
                    { key: 'saturday', label: language === 'fr' ? 'Samedi' : language === 'en' ? 'Saturday' : 'Sábado', index: 5 },
                    { key: 'sunday', label: language === 'fr' ? 'Dimanche' : language === 'en' ? 'Sunday' : 'Domingo', index: 6 }
                  ].map((day) => {
                    const dateStr = weekDates[day.index];
                    const isToday = dateStr === todayStr;
                    const dayDate = new Date(dateStr);
                    const formattedDate = `${dayDate.getDate().toString().padStart(2, '0')}/${(dayDate.getMonth() + 1).toString().padStart(2, '0')}`;

                    // Récupérer les tâches pour cette date
                    const dayTasks = planningTab === 'glowee-tasks'
                      ? getTasksForDate(dateStr, 'glowee')
                      : getTasksForDate(dateStr, 'user');

                    return (
                      <div
                        key={day.key}
                        className={`rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} relative overflow-hidden`}
                      >
                        {/* Bordure grise en haut pour le jour actuel */}
                        {isToday && (
                          <div className="absolute top-0 left-[20%] right-[20%] h-1.5 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 rounded-b-full" />
                        )}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-sm">{day.label}</h3>
                            <span className="text-xs text-stone-400">{formattedDate}</span>
                          </div>
                          <div className="space-y-2">
                      {dayTasks.length === 0 ? (
                        <p className="text-xs text-stone-400 text-center py-2">
                          {language === 'fr' ? 'Aucune tâche' : language === 'en' ? 'No tasks' : 'Sin tareas'}
                        </p>
                      ) : (
                        dayTasks.map((task) => (
                          <div
                            key={task.id}
                            className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
                              theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50'
                            }`}
                          >
                            {/* Indicateur de couleur pour les tâches Glowee avec objectif */}
                            {task.type === 'glowee' && task.goalColor && getActiveGoals().length >= 2 && (
                              <div
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: task.goalColor }}
                                title={task.goalName}
                              />
                            )}
                            <span
                              onClick={() => {
                                setTasksWithDates(prev => prev.map(t =>
                                  t.id === task.id ? { ...t, completed: !t.completed } : t
                                ));
                              }}
                              className={`flex-1 cursor-pointer ${task.completed ? 'line-through text-stone-500' : ''}`}
                            >
                              {task.text}
                            </span>
                            <button
                              onClick={() => {
                                setTasksWithDates(prev => prev.filter(t => t.id !== task.id));
                              }}
                              className="text-stone-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      )}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Bouton Ajouter une tâche */}
            <div className="px-6 pb-6 pt-5 max-w-lg mx-auto">
              <Button
                size="sm"
                className="bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
                onClick={() => setShowAddTask(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                {language === 'fr' ? 'Ajouter une tâche' : language === 'en' ? 'Add a task' : 'Agregar una tarea'}
              </Button>
            </div>
          </div>
        )}

        {/* My Goals View */}
        {currentView === 'my-goals' && (
          <div className="p-6 space-y-6 max-w-lg mx-auto">
            <MyGoals
              onAddGloweeTasks={(
                tasks: Array<{day: string, date?: string, task: string, priority: string, category: string, goalId?: string, goalName?: string, goalColor?: string}>,
                goalData: {id: string, name: string, color: string, weeklyPriorities: Array<{id: string, text: string, completed: boolean}>}
              ) => {
                // Convertir les tâches de l'API en format du Planning avec dates
                const newTasksWithDates = tasks.map(task => ({
                  id: `glowee_${Date.now()}_${Math.random()}`,
                  text: task.task,
                  date: task.date || '', // La date est déjà fournie par MyGoals
                  completed: false,
                  type: 'glowee' as const,
                  priority: task.priority,
                  category: task.category,
                  goalId: task.goalId,
                  goalName: task.goalName,
                  goalColor: task.goalColor
                }));

                setTasksWithDates(prev => [...prev, ...newTasksWithDates]);

                // Ajouter l'objectif avec ses priorités
                setGoalsWithPriorities(prev => {
                  // Vérifier si l'objectif existe déjà
                  const existingIndex = prev.findIndex(g => g.id === goalData.id);
                  if (existingIndex >= 0) {
                    // Mettre à jour l'objectif existant
                    const updated = [...prev];
                    updated[existingIndex] = goalData;
                    return updated;
                  } else {
                    // Ajouter le nouvel objectif
                    return [...prev, goalData];
                  }
                });

                // Sélectionner automatiquement ce nouvel objectif pour les priorités
                setSelectedGoalForPriorities(goalData.id);

                // Rediriger vers Planning
                setCurrentView('routine');
                setPlanningTab('glowee-tasks');
              }}
              onNavigateToPlanning={(goalId: string) => {
                // Rediriger vers la page Planning avec l'onglet Glowee tâches
                setCurrentView('routine');
                setPlanningTab('glowee-tasks');
              }}
              onShowGoalDetails={(goalId: string) => {
                setSelectedGoalId(goalId);
                setCurrentView('goal-details');
              }}
            />
          </div>
        )}

        {/* Goal Workspace View */}
        {currentView === 'goal-details' && selectedGoalId && (
          <GoalWorkspacePage
            goal={goals.find(g => g.id === selectedGoalId) || null}
            onBack={() => {
              setCurrentView('my-goals');
              setSelectedGoalId(null);
            }}
            theme={theme}
            language={language}
          />
        )}

        {/* Vision Board View */}
        {currentView === 'vision-board' && (
          <div className="p-6 space-y-6 max-w-lg mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentView('dashboard')}
              >
                <X className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold">{t.visionBoard.title}</h1>
            </div>

            {/* Add Image Form */}
            <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle>{t.visionBoard.addImage}</CardTitle>
                <CardDescription>{t.visionBoard.uploadInspire}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.visionBoard.imageUrl}</label>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    id="vision-image-url"
                    className={theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50'}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.visionBoard.caption} ({t.visionBoard.optional})</label>
                  <Input
                    placeholder={t.visionBoard.descriptionPlaceholder}
                    id="vision-image-caption"
                    className={theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50'}
                  />
                </div>
                <Button
                  onClick={() => {
                    const urlInput = document.getElementById('vision-image-url') as HTMLInputElement;
                    const captionInput = document.getElementById('vision-image-caption') as HTMLInputElement;
                    if (urlInput.value) {
                      addVisionBoardImage(urlInput.value, captionInput.value);
                      urlInput.value = '';
                      captionInput.value = '';
                    }
                  }}
                  className="w-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-white"
                >
                  <Plus className="mr-2 w-4 h-4" />
                  {t.visionBoard.addToVisionBoard}
                </Button>
              </CardContent>
            </Card>

            {/* Affirmations Section */}
            <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-gradient-to-br from-rose-900/30 to-pink-900/30' : 'bg-gradient-to-br from-rose-50 to-pink-50'}`}>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-rose-400" />
                  {t.bonus.affirmationOfDay}
                </h3>
                <p className="text-lg italic text-stone-700 dark:text-stone-300 font-serif">
                  "{bonusAffirmations[Math.floor(Math.random() * bonusAffirmations.length)]}"
                </p>
              </CardContent>
            </Card>

            {/* Images Grid */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">{t.visionBoard.myImages}</h2>
              {visionBoardImages.length === 0 ? (
                <div className={`text-center p-8 rounded-xl ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 text-stone-400" />
                  <p className="text-stone-500 dark:text-stone-500">{t.visionBoard.noImages}</p>
                  <p className="text-xs text-stone-400 dark:text-stone-600 mt-1">{t.visionBoard.addImagesInspire}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {visionBoardImages.map((image) => (
                    <div key={image.id} className={`relative rounded-xl overflow-hidden shadow-md ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
                      <img
                        src={image.url}
                        alt={image.caption || 'Vision board image'}
                        className="w-full aspect-square object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                          <p className="text-xs text-white font-medium">{image.caption}</p>
                        </div>
                      )}
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 w-8 h-8"
                        onClick={() => removeVisionBoardImage(image.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* New Me View */}
        {currentView === 'new-me' && (
          <div className="pb-24">
            {/* Header */}
            <div className="p-4 pb-0">
              <div className="flex items-center gap-3 mb-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => setCurrentView('dashboard')}
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="flex-1">
                  <h1 className="text-lg font-bold flex items-center gap-2">
                    <div className="relative w-6 h-6">
                      <Image src="/Glowee/glowee.webp" alt="Glowee" fill className="object-contain" />
                    </div>
                    {t.newMe.title}
                  </h1>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    {t.newMe.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Sélecteur de jours - Scrollable horizontal sans barre */}
            <div className="overflow-x-auto scrollbar-hide px-4 py-2">
              <div className="flex gap-1.5 min-w-max">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                  const isCompleted = newMeProgress[day] && Object.values(newMeProgress[day]).filter(Boolean).length === 13;
                  const completionPercentage = newMeProgress[day]
                    ? Math.round((Object.values(newMeProgress[day]).filter(Boolean).length / 13) * 100)
                    : 0;

                  return (
                    <button
                      key={day}
                      onClick={() => setNewMeCurrentDay(day)}
                      className={`flex-shrink-0 w-11 h-11 rounded-lg text-sm font-semibold transition-all relative ${
                        newMeCurrentDay === day
                          ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-white shadow-lg scale-105'
                          : theme === 'dark'
                            ? 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {day}
                      {isCompleted && (
                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      {!isCompleted && completionPercentage > 0 && (
                        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-rose-400">
                          {completionPercentage}%
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Tabs - Scrollable Design with Yellow */}
            <div className="p-4 pb-0 pt-2">
              <div className="flex gap-1.5 max-w-lg mx-auto">
                <button
                  onClick={() => setNewMeActiveTab('daily')}
                  className={`flex-1 px-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                    newMeActiveTab === 'daily'
                      ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-white shadow-lg'
                      : theme === 'dark'
                        ? 'bg-stone-800/50 text-stone-400 hover:bg-stone-800 hover:text-stone-300'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-1 justify-center">
                    <CheckSquare className="w-3 h-3" />
                    <span className="hidden sm:inline">{t.newMe.dailyTracking}</span>
                    <span className="sm:hidden">{t.newMe.trackingShort}</span>
                  </div>
                </button>
                <button
                  onClick={() => setNewMeActiveTab('progress')}
                  className={`flex-1 px-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                    newMeActiveTab === 'progress'
                      ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-white shadow-lg'
                      : theme === 'dark'
                        ? 'bg-stone-800/50 text-stone-400 hover:bg-stone-800 hover:text-stone-300'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-1 justify-center">
                    <TrendingUp className="w-3 h-3" />
                    <span className="hidden sm:inline">{t.newMe.progressOn30Days}</span>
                    <span className="sm:hidden">{t.newMe.progressShort}</span>
                  </div>
                </button>
                <button
                  onClick={() => setNewMeActiveTab('badges')}
                  className={`flex-1 px-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                    newMeActiveTab === 'badges'
                      ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-white shadow-lg'
                      : theme === 'dark'
                        ? 'bg-stone-800/50 text-stone-400 hover:bg-stone-800 hover:text-stone-300'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-1 justify-center">
                    <Award className="w-3 h-3" />
                    {t.newMe.badges}
                  </div>
                </button>
              </div>
            </div>

            {/* Content based on active tab */}
            <div className="p-6 space-y-6 max-w-lg mx-auto">
              {/* Tab 1: Suivi journalier */}
              {newMeActiveTab === 'daily' && (
                <>
                  {/* Barre de progression en haut */}
                  <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
                    <CardContent className="p-4 space-y-3">
                      {/* Message de bienvenue */}
                      <p className="text-base font-semibold text-rose-400">
                        {t.newMe.helloReady} {newMeCurrentDay} !
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          {t.newMe.day} {newMeCurrentDay} / 30
                        </span>
                        <span className="font-medium">
                          {Object.values(newMeProgress[newMeCurrentDay] || {}).filter(Boolean).length} / 13 {t.newMe.habits}
                        </span>
                      </div>

                      {/* Progression */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{t.newMe.dayProgress}</span>
                          <span className="text-lg font-bold text-rose-400">
                            {Math.round((Object.values(newMeProgress[newMeCurrentDay] || {}).filter(Boolean).length / 13) * 100)}%
                          </span>
                        </div>
                        <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 transition-all duration-500 rounded-full"
                            style={{ width: `${(Object.values(newMeProgress[newMeCurrentDay] || {}).filter(Boolean).length / 13) * 100}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Liste des 13 habitudes pour le jour sélectionné */}
                  <div className="space-y-3">
                    <h2 className="text-lg font-bold">
                      {t.newMe.the13Pillars}
                    </h2>
                    {(() => {
                      // Combiner les piliers normaux avec le pilier spécial si applicable
                      const allPillars = [...newMePillars];
                      if (specialNewMePillars[newMeCurrentDay]) {
                        allPillars.push(specialNewMePillars[newMeCurrentDay]);
                      }

                      return allPillars.map((habit) => {
                        const isChecked = newMeProgress[newMeCurrentDay]?.[habit.id.toString()] || false;
                        const isSpecialPillar = habit.shortDescription[language] === 'OBJECTIF_LINK_DAY1' || habit.shortDescription[language] === 'OBJECTIF_LINK_DAY2';

                        return (
                          <div
                            key={habit.id}
                            className={`p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] bg-gradient-to-br from-white to-pink-50 shadow-md hover:shadow-lg ${isChecked ? 'opacity-60' : ''}`}
                            onClick={() => {
                              if (isSpecialPillar) return; // Ne pas cocher automatiquement les piliers spéciaux
                              // Clic sur la carte = valider l'habitude
                              setNewMeProgress(prev => ({
                                ...prev,
                                [newMeCurrentDay]: {
                                  ...(prev[newMeCurrentDay] || {}),
                                  [habit.id.toString()]: !isChecked
                                }
                              }));
                            }}
                          >
                            {isSpecialPillar ? (
                              // Affichage spécial pour les piliers avec lien
                              <div className="flex items-start gap-3">
                                <span className="text-3xl drop-shadow-lg">{habit.icon}</span>
                                <div className="flex-1">
                                  <h4 className="font-bold text-sm mb-1 text-gray-800">{habit.title[language]}</h4>
                                  <p className="text-sm text-gray-600">
                                    {habit.shortDescription[language] === 'OBJECTIF_LINK_DAY1' ? (
                                      <>
                                        {language === 'fr' ? 'Rends-toi dans la section ' : language === 'en' ? 'Go to the section ' : 'Ve a la sección '}
                                        <span
                                          className="font-bold text-pink-500 hover:text-pink-600 underline cursor-pointer"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentView('my-goals');
                                          }}
                                        >
                                          {language === 'fr' ? 'Atteindre mes rêves' : language === 'en' ? 'Achieve my dreams' : 'Alcanzar mis sueños'}
                                        </span>
                                        {language === 'fr' ? ' et crée ton premier objectif !' : language === 'en' ? ' and create your first goal!' : ' y crea tu primer objetivo!'}
                                      </>
                                    ) : (
                                      <>
                                        {language === 'fr' ? 'Pour avancer dans ton ' : language === 'en' ? 'To progress on your ' : 'Para avanzar en tu '}
                                        <span
                                          className="font-bold text-pink-500 hover:text-pink-600 underline cursor-pointer"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentView('my-goals');
                                          }}
                                        >
                                          {language === 'fr' ? 'objectif' : language === 'en' ? 'goal' : 'objetivo'}
                                        </span>
                                        {language === 'fr' ? ', rends-toi sur la page Objectifs.' : language === 'en' ? ', go to the Goals page.' : ', ve a la página de Objetivos.'}
                                      </>
                                    )}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              // Affichage normal pour les piliers réguliers - Style glassmorphism comme Challenge Esprit
                              <div className="flex items-start gap-3">
                                <span className="text-3xl drop-shadow-lg">{habit.icon}</span>
                                <div className="flex-1">
                                  <h4 className={`font-bold text-sm mb-1 text-gray-800 ${isChecked ? 'line-through' : ''}`}>{habit.title[language]}</h4>
                                  <p className={`text-sm ${isChecked ? 'line-through text-gray-400' : 'text-gray-600'}`}>{habit.shortDescription[language]}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {isChecked && <Check className="w-6 h-6 text-green-500 drop-shadow-lg" />}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedHabit(habit);
                                    }}
                                    className="p-1.5 rounded-full transition-colors hover:bg-pink-100"
                                  >
                                    <ChevronRight className="w-5 h-5 text-pink-400" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>

                  {/* Bouton "J'ai complété ce jour" */}
                  <div className="pt-4 pb-6">
                    <Button
                      className={`w-full font-semibold py-6 text-base shadow-lg ${
                        Object.values(newMeProgress[newMeCurrentDay] || {}).filter(Boolean).length === 13
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white'
                      }`}
                      onClick={() => {
                        const allCompleted = Object.values(newMeProgress[newMeCurrentDay] || {}).filter(Boolean).length === 13;
                        if (allCompleted) {
                          // Si déjà complété, on peut décocher
                          setNewMeProgress(prev => ({
                            ...prev,
                            [newMeCurrentDay]: {}
                          }));
                        } else {
                          // Sinon, on coche tout (seulement les piliers normaux, pas les spéciaux)
                          const allHabits: Record<string, boolean> = {};
                          newMePillars.forEach(habit => {
                            allHabits[habit.id.toString()] = true;
                          });
                          setNewMeProgress(prev => ({
                            ...prev,
                            [newMeCurrentDay]: allHabits
                          }));
                        }
                      }}
                    >
                      {Object.values(newMeProgress[newMeCurrentDay] || {}).filter(Boolean).length === 13 ? (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          {t.newMe.completedDay.replace('{day}', newMeCurrentDay.toString())}
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          {t.newMe.completeThisDay}
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}

              {/* Tab 2: Progression sur 30 jours */}
              {newMeActiveTab === 'progress' && (
                <>
                  <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-rose-400" />
                        {t.newMe.progressOn30Days}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Calendrier des 30 jours */}
                      <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 30 }, (_, i) => {
                          const day = i + 1;
                          const dayProgress = newMeProgress[day] || {};
                          const completedCount = Object.values(dayProgress).filter(Boolean).length;
                          const isFullyCompleted = completedCount === 13;
                          const isToday = day === newMeCurrentDay;

                          return (
                            <div
                              key={day}
                              onClick={() => {
                                setNewMeCurrentDay(day);
                                setNewMeActiveTab('daily');
                              }}
                              className={`
                                aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all
                                ${isToday ? 'ring-2 ring-rose-400' : ''}
                                ${isFullyCompleted
                                  ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-white'
                                  : completedCount > 0
                                    ? theme === 'dark'
                                      ? 'bg-rose-400/30 text-rose-400'
                                      : 'bg-rose-400/20 text-rose-400'
                                    : theme === 'dark'
                                      ? 'bg-stone-800 text-stone-400'
                                      : 'bg-stone-100 text-stone-600'
                                }
                                hover:scale-110
                              `}
                            >
                              <span className="text-xs font-semibold">{day}</span>
                              {completedCount > 0 && (
                                <span className="text-[8px] mt-0.5">{completedCount}/13</span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Stats globales */}
                      <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {Object.keys(newMeProgress).filter(day => {
                              const dayProgress = newMeProgress[parseInt(day)];
                              return dayProgress && Object.values(dayProgress).filter(Boolean).length === 13;
                            }).length} / 30 {t.newMe.daysCompleted}
                          </span>
                          <span className="text-2xl font-bold text-rose-400">
                            {Math.round((Object.keys(newMeProgress).filter(day => {
                              const dayProgress = newMeProgress[parseInt(day)];
                              return dayProgress && Object.values(dayProgress).filter(Boolean).length === 13;
                            }).length / 30) * 100)}%
                          </span>
                        </div>
                        <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 transition-all duration-500 rounded-full"
                            style={{ width: `${(Object.keys(newMeProgress).filter(day => {
                              const dayProgress = newMeProgress[parseInt(day)];
                              return dayProgress && Object.values(dayProgress).filter(Boolean).length === 13;
                            }).length / 30) * 100}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Tab 3: Badges & Encouragements */}
              {newMeActiveTab === 'badges' && (
                <>
                  <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-rose-400" />
                        {t.newMe.badges}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {(() => {
                        const completedDays = Object.keys(newMeProgress).filter(day => {
                          const dayProgress = newMeProgress[parseInt(day)];
                          return dayProgress && Object.values(dayProgress).filter(Boolean).length === 13;
                        }).length;

                        // Calcul des jours avec habitude spécifique complétée
                        const waterDays = Object.keys(newMeProgress).filter(day => {
                          const dayProgress = newMeProgress[parseInt(day)];
                          return dayProgress && dayProgress['1']; // ID 1 = Eau 2L
                        }).length;

                        const walkingDays = Object.keys(newMeProgress).filter(day => {
                          const dayProgress = newMeProgress[parseInt(day)];
                          return dayProgress && dayProgress['3']; // ID 3 = Marche 30 min
                        }).length;

                        const skincareDays = Object.keys(newMeProgress).filter(day => {
                          const dayProgress = newMeProgress[parseInt(day)];
                          return dayProgress && dayProgress['6']; // ID 6 = Skincare
                        }).length;

                        const anyDayStarted = Object.keys(newMeProgress).some(day => {
                          const dayProgress = newMeProgress[parseInt(day)];
                          return dayProgress && Object.values(dayProgress).some(Boolean);
                        });

                        const hasPerfectDay = Object.keys(newMeProgress).some(day => {
                          const dayProgress = newMeProgress[parseInt(day)];
                          return dayProgress && Object.values(dayProgress).filter(Boolean).length === 13;
                        });

                        const badges = [
                          { condition: anyDayStarted, icon: '🌱', title: t.newMe.badgeFirstDay, desc: t.newMe.badgeFirstDayDesc },
                          { condition: completedDays >= 7, icon: '🌿', title: t.newMe.badgeFirstWeek, desc: t.newMe.badgeFirstWeekDesc },
                          { condition: hasPerfectDay, icon: '✨', title: t.newMe.badgePerfectDay, desc: t.newMe.badgePerfectDayDesc },
                          { condition: waterDays >= 7, icon: '💧', title: t.newMe.badgeWaterMaster, desc: t.newMe.badgeWaterMasterDesc },
                          { condition: walkingDays >= 7, icon: '🚶‍♀️', title: t.newMe.badgeWalkingStar, desc: t.newMe.badgeWalkingStarDesc },
                          { condition: skincareDays >= 7, icon: '👑', title: t.newMe.badgeSkincareQueen, desc: t.newMe.badgeSkincareQueenDesc },
                          { condition: completedDays >= 14, icon: '🌸', title: t.newMe.badgeTwoWeeks, desc: t.newMe.badgeTwoWeeksDesc },
                          { condition: completedDays >= 30, icon: '✨', title: t.newMe.badgeComplete, desc: t.newMe.badgeCompleteDesc },
                        ];

                        return badges.map((badge, index) => {
                          const isUnlocked = badge.condition;
                          return (
                            <div
                              key={index}
                              className={`p-4 rounded-lg transition-all ${
                                isUnlocked
                                  ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 shadow-lg'
                                  : theme === 'dark'
                                    ? 'bg-stone-800/50 opacity-40'
                                    : 'bg-stone-100 opacity-40'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`text-4xl ${!isUnlocked && 'grayscale'}`}>{badge.icon}</div>
                                <div className="flex-1">
                                  <h4 className={`font-semibold text-base ${isUnlocked ? 'text-white' : ''}`}>{badge.title}</h4>
                                  <p className={`text-xs mt-1 ${isUnlocked ? 'text-white/90' : 'text-stone-600 dark:text-stone-400'}`}>{badge.desc}</p>
                                </div>
                                {isUnlocked && <Check className="w-6 h-6 text-white" />}
                              </div>
                            </div>
                          );
                        });
                      })()}

                      {/* Message d'encouragement de Glowee */}
                      <div className={`p-4 rounded-lg mt-4 ${theme === 'dark' ? 'bg-gradient-to-br from-purple-900/20 to-pink-900/20' : 'bg-gradient-to-br from-purple-50 to-pink-50'}`}>
                        <div className="flex items-start gap-3">
                          <div className="relative w-10 h-10 flex-shrink-0">
                            <Image src="/Glowee/glowee.webp" alt="Glowee" fill className="object-contain" />
                          </div>
                          <p className="text-sm italic text-stone-700 dark:text-stone-300">
                            {(() => {
                              const completedDays = Object.keys(newMeProgress).filter(day => {
                                const dayProgress = newMeProgress[parseInt(day)];
                                return dayProgress && Object.values(dayProgress).filter(Boolean).length === 13;
                              }).length;

                              if (completedDays >= 20) return t.newMe.encouragement4;
                              if (completedDays >= 10) return t.newMe.encouragement3;
                              if (completedDays >= 5) return t.newMe.encouragement2;
                              return t.newMe.encouragement1;
                            })()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        )}

        {/* Bonus View - Refonte Glassmorphism */}
        {currentView === 'bonus' && (
          <div className="pb-24 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 min-h-screen">
            {/* Header élégant */}
            <div className="flex items-center gap-3 p-5 pb-4 max-w-3xl mx-auto">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-10 h-10 bg-white/80 backdrop-blur-md shadow-lg shadow-pink-100/50 hover:bg-white"
                onClick={() => setCurrentView('dashboard')}
              >
                <X className="w-5 h-5 text-gray-800" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 bg-clip-text text-transparent">{t.bonus.title}</h1>
                <p className="text-xs text-gray-600 font-medium">{language === 'fr' ? 'Ton espace de développement' : language === 'en' ? 'Your development space' : 'Tu espacio de desarrollo'}</p>
              </div>
            </div>

            <div className="px-5 space-y-5 max-w-3xl mx-auto">

              {/* Sections Bonus Principales */}
              <div className="space-y-4">
              {bonusSections
                .filter((section) => section.id !== 'petits-succes' && section.id !== 'question-soir' && section.id !== 'limites-paix' && section.id !== '50-choses-seule')
                .map((section) => {
                const weeklyCompletion = getSectionWeeklyCompletion(section.id);
                return (
                  <Card
                    key={section.id}
                    onClick={() => setSelectedBonusSection(section)}
                    className={`border-none shadow-xl shadow-pink-200/30 cursor-pointer hover:scale-[1.02] transition-all bg-white/80 backdrop-blur-md rounded-[1.5rem] overflow-hidden`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center text-3xl shadow-lg flex-shrink-0`}>
                          {section.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-base text-gray-800">{section.title}</h3>
                            {weeklyCompletion > 0 && (
                              <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-pink-50 text-pink-600 border-pink-200 font-semibold">
                                {weeklyCompletion}/4
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 font-medium">{section.description}</p>
                          <p className="text-xs text-gray-500 mt-1 italic">{section.duration}</p>
                          {weeklyCompletion > 0 && (
                            <div className="mt-2">
                              <Progress value={(weeklyCompletion / 4) * 100} className="h-2 bg-pink-100" />
                            </div>
                          )}
                        </div>
                        <ChevronRight className={`w-5 h-5 text-pink-400 flex-shrink-0`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              </div>

              {/* Checklists - Glassmorphism */}
              <Card className="border-none shadow-xl shadow-pink-200/30 bg-white/80 backdrop-blur-md rounded-[1.5rem]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg">
                      <ListChecks className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-gray-800">{t.bonus.checklists}</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 font-medium ml-13">{t.bonus.practicalGuides}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {checklistsData.map((checklist) => {
                    const isCompleted = bonusProgress.checklistsCompleted.includes(checklist.id);
                    return (
                      <div
                        key={checklist.id}
                        onClick={() => setSelectedChecklist(checklist)}
                        className={`flex items-center justify-between p-4 rounded-xl cursor-pointer hover:scale-[1.02] transition-all shadow-md ${
                          isCompleted
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400'
                            : 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-sm ${
                            isCompleted ? 'bg-gradient-to-br from-green-400 to-emerald-400' : 'bg-gradient-to-br from-blue-400 to-cyan-400'
                          }`}>
                            {checklist.icon}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-800">{checklist.title}</p>
                            <p className="text-xs text-gray-600 font-medium">{checklist.items.length} {t.bonus.steps}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleChecklistCompleted(checklist.id);
                            }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-sm ${
                              isCompleted
                                ? 'bg-green-500 text-white'
                                : 'bg-white border-2 border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            {isCompleted && <Check className="w-4 h-4" />}
                          </div>
                          <ChevronRight className={`w-5 h-5 ${isCompleted ? 'text-green-400' : 'text-blue-400'}`} />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Mini-Guide Soft Life - Glassmorphism */}
              <Card
                onClick={() => setShowSoftLifeGuide(true)}
                className="border-none shadow-xl shadow-pink-200/30 cursor-pointer hover:scale-[1.02] transition-all bg-white/80 backdrop-blur-md rounded-[1.5rem]"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg">
                      <Sun className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-gray-800">{t.bonus.miniGuide}</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 font-medium ml-13">{t.bonus.softLifeSteps}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 font-medium">
                      {t.bonus.discoverSoftLife}
                    </p>
                    <ChevronRight className="w-5 h-5 text-amber-400" />
                  </div>
                </CardContent>
              </Card>

              {/* 50 choses à faire seule - Glassmorphism */}
              <Card
                onClick={() => {
                  const fiftyThingsSection = bonusSections.find(s => s.id === '50-choses-seule');
                  if (fiftyThingsSection) setSelectedBonusSection(fiftyThingsSection);
                }}
                className="border-none shadow-xl shadow-pink-200/30 cursor-pointer hover:scale-[1.02] transition-all bg-white/80 backdrop-blur-md rounded-[1.5rem]"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
                      <span className="text-xl">💫</span>
                    </div>
                    <span className="font-bold text-gray-800">{t.bonus.fiftyThingsAlone}</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 font-medium ml-13">
                    {completedThingsAlone.length} / {fiftyThingsAlone.length} {t.bonus.completedItems}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 font-medium">
                      {language === 'fr' ? 'Profite de moments précieux avec toi-même' : language === 'en' ? 'Enjoy precious moments with yourself' : 'Disfruta momentos preciosos contigo misma'}
                    </p>
                    <ChevronRight className="w-5 h-5 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Settings View */}
        {currentView === 'settings' && (
          <div className="pb-20 bg-cream-100 min-h-screen">
            <div className="max-w-lg mx-auto p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentView('dashboard')}
                    className="rounded-full bg-white shadow-soft hover:bg-stone-50"
                  >
                    <X className="w-5 h-5 text-navy-900" />
                  </Button>
                  <h1 className="text-2xl font-bold text-navy-900">{t.settings.title}</h1>
                </div>

                {/* Auth Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-white shadow-soft hover:bg-stone-50"
                  onClick={() => {
                    if (user) {
                      // Si connecté, demander confirmation avant de se déconnecter
                      if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
                        signOut();
                      }
                    } else {
                      // Si non connecté, ouvrir le dialogue d'authentification
                      setShowAuthDialog(true);
                    }
                  }}
                >
                  {user ? (
                    <LogOut className="w-5 h-5 text-peach-500" />
                  ) : (
                    <LogIn className="w-5 h-5 text-peach-500" />
                  )}
                </Button>
              </div>

              {/* Progress Overview */}
              <Card className="border-none shadow-soft bg-gradient-to-br from-peach-100 to-soft-orange-100 rounded-2xl">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm text-navy-900">
                    <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-peach-500" />
                    </div>
                    {t.dashboard.progress}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center bg-white/60 rounded-xl p-3">
                      <p className="text-xs text-stone-600 mb-1 font-medium">{t.dashboard.daysCompleted}</p>
                      <p className="font-bold text-lg text-navy-900">{challengeProgress.completedDays.length}/30</p>
                    </div>
                    <div className="text-center bg-white/60 rounded-xl p-3">
                      <p className="text-xs text-stone-600 mb-1 font-medium">{t.settings.percentage}</p>
                      <p className="font-bold text-lg text-peach-600">{progressPercentage}%</p>
                    </div>
                    <div className="text-center bg-white/60 rounded-xl p-3">
                      <p className="text-xs text-stone-600 mb-1 font-medium">{t.journal.title}</p>
                      <p className="font-bold text-lg text-navy-900">{journalEntries.length}</p>
                    </div>
                    <div className="text-center bg-white/60 rounded-xl p-3">
                      <p className="text-xs text-stone-600 mb-1 font-medium">{t.visionBoard.title}</p>
                      <p className="font-bold text-lg text-navy-900">{visionBoardImages.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Theme Toggle */}
              <Card className="border-none shadow-soft bg-white rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-navy-900 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-soft-purple-100 to-soft-purple-200 flex items-center justify-center">
                      {theme === 'light' ? (
                        <Sun className="w-4 h-4 text-soft-purple-500" />
                      ) : (
                        <Moon className="w-4 h-4 text-soft-purple-500" />
                      )}
                    </div>
                    {t.settings.theme}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-cream-100">
                    <div className="flex items-center gap-3">
                      {theme === 'light' ? (
                        <Sun className="w-5 h-5 text-amber-500" />
                      ) : (
                        <Moon className="w-5 h-5 text-soft-purple-500" />
                      )}
                      <div>
                        <p className="font-semibold text-sm text-navy-900">
                          {theme === 'light' ? t.settings.light : t.settings.dark}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={theme === 'dark'}
                      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Language Selection */}
              <Card className="border-none shadow-soft bg-white rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-navy-900 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-peach-100 to-soft-orange-100 flex items-center justify-center">
                      <span className="text-lg">🌍</span>
                    </div>
                    {t.settings.language}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
                    { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
                    { code: 'es' as Language, name: 'Español', flag: '🇪🇸' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`w-full p-3 rounded-xl border-2 transition-all ${
                        language === lang.code
                          ? 'border-peach-400 bg-gradient-to-br from-peach-50 to-soft-orange-50 shadow-soft'
                          : 'border-stone-200 bg-cream-100 hover:border-peach-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{lang.flag}</span>
                          <span className="font-semibold text-sm text-navy-900">{lang.name}</span>
                        </div>
                        {language === lang.code && (
                          <Check className="w-4 h-4 text-peach-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* FAQ */}
              <FAQSection theme={theme} />

              {/* Account / Connexion */}
              <Card className="border-none shadow-soft bg-white rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-navy-900 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-peach-100 to-soft-orange-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-peach-500" />
                    </div>
                    {language === 'fr' ? 'Compte' : language === 'en' ? 'Account' : 'Cuenta'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user ? (
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-cream-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-peach-400 to-soft-orange-400 flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-xs truncate text-navy-900">{user.email}</p>
                            {userData && (
                              <Badge className="bg-gradient-to-r from-peach-400 to-soft-orange-400 text-white text-xs mt-1">
                                ✨ Premium
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 border-stone-200 rounded-xl"
                        onClick={async () => {
                          if (confirm(language === 'fr' ? 'Êtes-vous sûr de vouloir vous déconnecter ?' : language === 'en' ? 'Are you sure you want to sign out?' : '¿Estás seguro de que quieres cerrar sesión?')) {
                            await signOut();
                          }
                        }}
                      >
                        <LogOut className="mr-2 w-4 h-4" />
                        <span className="text-sm">{language === 'fr' ? 'Se déconnecter' : language === 'en' ? 'Sign out' : 'Cerrar sesión'}</span>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-peach-400 to-soft-orange-400 hover:from-peach-500 hover:to-soft-orange-500 text-white rounded-2xl py-6 shadow-soft-lg font-semibold"
                      onClick={() => setShowAuthDialog(true)}
                    >
                      <LogIn className="mr-2 w-4 h-4" />
                      <span className="text-sm">{language === 'fr' ? 'Se connecter' : language === 'en' ? 'Sign in' : 'Iniciar sesión'}</span>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation - Glassmorphism Rose Pastel */}
      {currentView !== 'goal-details' && (
        <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md z-50">
          <div className="bg-white/80 backdrop-blur-md rounded-[2rem] shadow-2xl shadow-pink-200/50 px-3 py-3 border border-pink-100/50">
            <div className="flex items-center justify-around">
              <Button
                variant="ghost"
                className={`flex-1 h-14 flex-col gap-1 rounded-xl transition-all duration-200 ${
                  currentView === 'dashboard'
                    ? 'bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600'
                    : 'text-gray-500 hover:text-pink-500 hover:bg-pink-50/50'
                }`}
                onClick={() => setCurrentView('dashboard')}
              >
                <Home className="w-5 h-5" />
                <span className="text-[10px] font-semibold">{t.nav.home}</span>
              </Button>

              <Button
                variant="ghost"
                className={`flex-1 h-14 flex-col gap-1 rounded-xl transition-all duration-200 ${
                  currentView === 'routine'
                    ? 'bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600'
                    : 'text-gray-500 hover:text-pink-500 hover:bg-pink-50/50'
                }`}
                onClick={() => setCurrentView('routine')}
              >
                <Layers className="w-5 h-5" />
                <span className="text-[10px] font-semibold">
                  {language === 'fr' ? 'Planning' : language === 'en' ? 'Planning' : 'Plan'}
                </span>
              </Button>

              <Button
                variant="ghost"
                className={`flex-1 h-14 flex items-center justify-center rounded-xl transition-all duration-200 ${
                  showGloweeChat
                    ? 'bg-gradient-to-br from-pink-100 to-rose-100'
                    : 'hover:bg-pink-50/50'
                }`}
                onClick={() => setShowGloweeChat(!showGloweeChat)}
              >
                <img
                  src="/Glowee/glowee-nav-bar.webp"
                  alt="Glowee"
                  className="w-13 h-13 object-contain drop-shadow-lg"
                />
              </Button>

              <Button
                variant="ghost"
                className={`flex-1 h-14 flex-col gap-1 rounded-xl transition-all duration-200 ${
                  currentView === 'trackers'
                    ? 'bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600'
                    : 'text-gray-500 hover:text-pink-500 hover:bg-pink-50/50'
                }`}
                onClick={() => setCurrentView('trackers')}
              >
                <Target className="w-5 h-5" />
                <span className="text-[10px] font-semibold">{t.nav.trackers}</span>
              </Button>

              <Button
                variant="ghost"
                className={`flex-1 h-14 flex-col gap-1 rounded-xl transition-all duration-200 ${
                  currentView === 'settings'
                    ? 'bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600'
                    : 'text-gray-500 hover:text-pink-500 hover:bg-pink-50/50'
                }`}
                onClick={() => setCurrentView('settings')}
              >
                <Settings className="w-5 h-5" />
                <span className="text-[10px] font-semibold">{t.nav.settings}</span>
              </Button>
            </div>
          </div>
        </nav>
      )}

      {/* Drawer Checklist - Animation coulissante du bas */}
      <Drawer open={!!selectedChecklist} onOpenChange={(open) => !open && setSelectedChecklist(null)}>
        <DrawerContent className="max-w-lg mx-auto">
          <DrawerHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{selectedChecklist?.icon}</div>
              <div className="flex-1 text-left">
                <DrawerTitle className="text-xl">{selectedChecklist?.title}</DrawerTitle>
                <DrawerDescription>{selectedChecklist?.description}</DrawerDescription>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-3">
              {selectedChecklist?.items.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${theme === 'dark' ? 'bg-stone-800 hover:bg-stone-700' : 'bg-stone-50 hover:bg-stone-100'}`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${theme === 'dark' ? 'border-blue-400' : 'border-blue-500'}`}>
                      <CheckSquare className="w-4 h-4 text-blue-500 dark:text-blue-400 opacity-30" />
                    </div>
                  </div>
                  <p className="text-sm flex-1">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Drawer New Me Habit Details - Style Glassmorphism */}
      <Drawer open={!!selectedHabit} onOpenChange={(open) => !open && setSelectedHabit(null)}>
        <DrawerContent className="max-w-lg mx-auto bg-white/95 backdrop-blur-xl border-none shadow-2xl shadow-pink-200/50">
          <DrawerHeader className="border-b border-pink-100 bg-gradient-to-br from-pink-50 to-rose-50 rounded-t-3xl">
            <div className="flex items-center gap-4">
              <div className="text-5xl drop-shadow-2xl">{selectedHabit?.icon}</div>
              <div className="flex-1 text-left">
                <DrawerTitle className="text-xl font-bold text-gray-800">{selectedHabit?.title[language]}</DrawerTitle>
                <DrawerDescription className="text-sm text-gray-600 font-medium">{selectedHabit?.shortDescription[language]}</DrawerDescription>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-100 transition-colors">
                  <X className="w-5 h-5 text-gray-600" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="p-6 overflow-y-auto max-h-[60vh] space-y-5">
            {/* Detailed Explanation - Glassmorphism */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-white to-pink-50 shadow-lg border border-pink-100/50">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-gray-800">
                <Sparkles className="w-5 h-5 text-pink-500 drop-shadow-lg" />
                {language === 'fr' ? 'Pourquoi c\'est important' : language === 'en' ? 'Why it\'s important' : 'Por qué es importante'}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {selectedHabit?.detailedExplanation[language]}
              </p>
            </div>

            {/* Benefits - Glassmorphism */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 shadow-lg border border-pink-100/50">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800">
                <Star className="w-5 h-5 text-pink-500 drop-shadow-lg" />
                {language === 'fr' ? 'Les bénéfices' : language === 'en' ? 'The benefits' : 'Los beneficios'}
              </h3>
              <div className="space-y-3">
                {selectedHabit?.benefits[language].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm shadow-sm">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0 drop-shadow-lg" />
                    <span className="text-sm text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Glowee Message - Glassmorphism */}
            {selectedHabit?.gloweeMessage && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 shadow-lg border-l-4 border-pink-400">
                <div className="flex items-start gap-4">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 rounded-2xl blur-md opacity-50"></div>
                    <Image src="/Glowee/glowee.webp" alt="Glowee" width={48} height={48} className="object-contain relative z-10 drop-shadow-2xl" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm italic text-gray-800 font-medium leading-relaxed">
                      {selectedHabit.gloweeMessage[language]}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Toggle Completion */}
            <Button
              className="w-full"
              variant={newMeProgress[newMeCurrentDay]?.[selectedHabit?.id.toString() || ''] ? 'default' : 'outline'}
              onClick={() => {
                if (selectedHabit) {
                  const isChecked = newMeProgress[newMeCurrentDay]?.[selectedHabit.id.toString()] || false;
                  setNewMeProgress(prev => ({
                    ...prev,
                    [newMeCurrentDay]: {
                      ...(prev[newMeCurrentDay] || {}),
                      [selectedHabit.id.toString()]: !isChecked
                    }
                  }));
                }
              }}
            >
              {newMeProgress[newMeCurrentDay]?.[selectedHabit?.id.toString() || ''] ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Habitude complétée pour le {t.newMe.day} {newMeCurrentDay}
                </>
              ) : (
                <>
                  Marquer comme fait pour le {t.newMe.day} {newMeCurrentDay}
                </>
              )}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Drawer Mini-Guide Soft Life - Animation coulissante du bas */}
      <Drawer open={showSoftLifeGuide} onOpenChange={(open) => {
        setShowSoftLifeGuide(open);
        if (!open) setSelectedGuideStep(null);
      }}>
        <DrawerContent className="max-w-lg mx-auto">
          <DrawerHeader className={`border-b ${theme === 'dark' ? 'bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-stone-800' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-stone-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex-1 text-left">
                <DrawerTitle className="text-xl flex items-center gap-2">
                  <Sun className="w-6 h-6 text-amber-400" />
                  {softLifeGuide.title}
                </DrawerTitle>
                <DrawerDescription className="mt-1">{softLifeGuide.subtitle}</DrawerDescription>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-4">
              {softLifeGuide.steps.map((step) => {
                const isCompleted = bonusProgress.miniGuideStepsCompleted.includes(step.number);
                return (
                  <Card
                    key={step.number}
                    onClick={() => setSelectedGuideStep(selectedGuideStep === step.number ? null : step.number)}
                    className={`border-none shadow-md cursor-pointer transition-all hover:scale-[1.02] ${
                      isCompleted
                        ? theme === 'dark' ? 'bg-green-900/20 border-2 border-green-500' : 'bg-green-50 border-2 border-green-500'
                        : theme === 'dark' ? 'bg-stone-800' : 'bg-white'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{step.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">Étape {step.number}</Badge>
                            {isCompleted && (
                              <Badge className="text-xs bg-green-500 text-white">
                                <Check className="w-3 h-3 mr-1" />
                                Complété
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg mt-1">{step.title}</CardTitle>
                          <CardDescription className="text-xs mt-1">{step.description}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMiniGuideStep(step.number);
                            }}
                            className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                              isCompleted
                                ? 'bg-green-500 text-white'
                                : 'bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600'
                            }`}
                          >
                            {isCompleted && <Check className="w-4 h-4" />}
                          </div>
                          <ChevronRight className={`w-5 h-5 ${isCompleted ? 'text-green-400' : 'text-amber-400'} transition-transform ${selectedGuideStep === step.number ? 'rotate-90' : ''}`} />
                        </div>
                      </div>
                    </CardHeader>

                    {selectedGuideStep === step.number && (
                      <CardContent className="pt-0 space-y-4">
                        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-stone-900' : 'bg-amber-50'}`}>
                          <p className="text-sm leading-relaxed">{step.content}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            Conseils pratiques
                          </h4>
                          <div className="space-y-2">
                            {step.tips.map((tip, index) => (
                              <div
                                key={index}
                                className={`flex items-start gap-2 p-3 rounded-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}
                              >
                                <span className="text-amber-400 text-sm mt-0.5">✨</span>
                                <p className="text-sm flex-1">{tip}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Drawer Sections Bonus - Animation coulissante du bas */}
      <Drawer open={!!selectedBonusSection} onOpenChange={(open) => !open && setSelectedBonusSection(null)}>
        <DrawerContent className="max-w-lg mx-auto">
          <DrawerHeader className={`border-b bg-gradient-to-r ${selectedBonusSection?.color}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className={`text-3xl ${selectedBonusSection?.iconColor}`}>
                  {selectedBonusSection?.icon}
                </div>
                <div className="flex-1 text-left">
                  <DrawerTitle className="text-xl">{selectedBonusSection?.title}</DrawerTitle>
                  <DrawerDescription>{selectedBonusSection?.duration}</DrawerDescription>
                </div>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="p-6 overflow-y-auto max-h-[65vh]">
            {selectedBonusSection && (
              <div className="space-y-6">
                {/* Intro */}
                {selectedBonusSection.content.intro && (
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50'}`}>
                    <p className="text-base font-semibold text-center">
                      {selectedBonusSection.content.intro}
                    </p>
                  </div>
                )}

                {/* Subtitle (pour la question du soir) */}
                {selectedBonusSection.content.subtitle && (
                  <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                    {selectedBonusSection.content.subtitle}
                  </p>
                )}

                {/* Steps - Pour les sections normales */}
                {selectedBonusSection.id !== '50-choses-seule' && selectedBonusSection.content.steps.length > 0 && (
                  <div className="space-y-3">
                    {selectedBonusSection.content.steps.map((step, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-4 rounded-xl ${theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50'}`}
                      >
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${theme === 'dark' ? 'bg-stone-700 text-stone-300' : 'bg-white text-stone-600'}`}>
                          {selectedBonusSection.id === 'limites-paix' ? '•' : index + 1}
                        </div>
                        <p className="text-sm flex-1 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* 50 choses à faire seule - Liste avec fonction de rayer */}
                {selectedBonusSection.id === '50-choses-seule' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-stone-600 dark:text-stone-400">
                        {completedThingsAlone.length} / {fiftyThingsAlone.length} {t.bonus.completedItems}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {Math.round((completedThingsAlone.length / fiftyThingsAlone.length) * 100)}%
                      </Badge>
                    </div>
                    {fiftyThingsAlone.map((thing, index) => (
                      <div
                        key={index}
                        onClick={() => toggleThingAlone(index)}
                        className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                          completedThingsAlone.includes(index)
                            ? theme === 'dark'
                              ? 'bg-cyan-900/20 hover:bg-cyan-900/30'
                              : 'bg-cyan-50 hover:bg-cyan-100'
                            : theme === 'dark'
                              ? 'bg-stone-800 hover:bg-stone-700'
                              : 'bg-stone-50 hover:bg-stone-100'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          completedThingsAlone.includes(index)
                            ? 'bg-cyan-500 text-white'
                            : theme === 'dark'
                              ? 'bg-stone-700 text-stone-300'
                              : 'bg-white text-stone-600'
                        }`}>
                          {completedThingsAlone.includes(index) ? '✓' : index + 1}
                        </div>
                        <p className={`text-sm flex-1 leading-relaxed transition-all ${
                          completedThingsAlone.includes(index)
                            ? 'line-through opacity-60'
                            : ''
                        }`}>
                          {thing}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Examples (pour la question du soir) */}
                {selectedBonusSection.content.examples && selectedBonusSection.content.examples.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      Exemples
                    </h4>
                    {selectedBonusSection.content.examples.map((example, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50'}`}
                      >
                        <p className="text-sm font-medium mb-1">« {example.question} »</p>
                        <p className="text-sm text-purple-600 dark:text-purple-400">→ {example.answer}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Why it works */}
                {selectedBonusSection.content.why && (
                  <div className={`p-4 rounded-xl border-l-4 ${selectedBonusSection.id === 'petits-succes' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : selectedBonusSection.id === 'question-soir' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'}`}>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      {selectedBonusSection.id === 'question-soir' ? 'Résultat' : 'Pourquoi ça marche ?'}
                    </h4>
                    <p className="text-sm leading-relaxed">{selectedBonusSection.content.why}</p>
                  </div>
                )}

                {/* Séparateur avant le suivi */}
                {selectedBonusSection.id === 'limites-paix' && (
                  <div className="border-t-2 border-dashed border-stone-300 dark:border-stone-700 my-6"></div>
                )}

                {/* Composant de suivi pour la section limites */}
                {selectedBonusSection.id === 'limites-paix' && <BoundariesTracker />}
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Drawer Ajouter une tâche */}
      <Drawer open={showAddTask} onOpenChange={setShowAddTask}>
        <DrawerContent className="max-w-lg mx-auto max-h-[90vh] flex flex-col">
          <DrawerHeader className="border-b flex-shrink-0">
            <DrawerTitle className="text-xl">
              {language === 'fr' ? 'Ajouter une tâche' : language === 'en' ? 'Add a task' : 'Agregar una tarea'}
            </DrawerTitle>
            <DrawerDescription>
              {language === 'fr' ? 'Planifiez votre semaine efficacement' : language === 'en' ? 'Plan your week efficiently' : 'Planifica tu semana eficientemente'}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Champ de texte pour la tâche */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">
                {language === 'fr' ? 'Tâche' : language === 'en' ? 'Task' : 'Tarea'}
              </label>
              <Input
                placeholder={language === 'fr' ? 'Entrez votre tâche...' : language === 'en' ? 'Enter your task...' : 'Ingresa tu tarea...'}
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className={theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50'}
              />
            </div>

            {/* Sélection de la destination */}
            <div className="space-y-3">
              <label className="text-sm font-semibold">
                {language === 'fr' ? 'Destination' : language === 'en' ? 'Destination' : 'Destino'}
              </label>

              {/* Priorité de la semaine */}
              <button
                onClick={() => setNewTaskDestination('priority')}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  newTaskDestination === 'priority'
                    ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-white shadow-lg'
                    : theme === 'dark'
                      ? 'bg-stone-800 hover:bg-stone-700'
                      : 'bg-stone-100 hover:bg-stone-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    newTaskDestination === 'priority'
                      ? 'border-white bg-white'
                      : 'border-stone-400'
                  }`}>
                    {newTaskDestination === 'priority' && <Check className="w-3 h-3 text-rose-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      {language === 'fr' ? 'Priorité de la semaine' : language === 'en' ? 'Weekly priority' : 'Prioridad semanal'}
                    </p>
                    <p className={`text-xs ${newTaskDestination === 'priority' ? 'opacity-90' : 'opacity-70'}`}>
                      {language === 'fr' ? 'Ajoutez à vos 3 priorités' : language === 'en' ? 'Add to your 3 priorities' : 'Agregar a tus 3 prioridades'}
                    </p>
                  </div>
                </div>
              </button>

              {/* Jours de la semaine avec dates */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  {language === 'fr' ? 'Prochains jours' : language === 'en' ? 'Next days' : 'Próximos días'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(() => {
                    const today = new Date();
                    const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
                    const nextDays: Array<{
                      key: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
                      dayLabel: string;
                      dateLabel: string;
                      isToday: boolean;
                    }> = [];
                    for (let i = 0; i < 7; i++) {
                      const date = new Date(today);
                      date.setDate(today.getDate() + i);
                      const dayIndex = date.getDay();
                      const dayKey = dayKeys[dayIndex];
                      const dayLabel = date.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', { weekday: 'long' });
                      const dateLabel = date.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', { day: 'numeric', month: 'short' });
                      const isToday = i === 0;
                      nextDays.push({ key: dayKey, dayLabel, dateLabel, isToday });
                    }
                    return nextDays.map((day) => (
                      <button
                        key={day.key}
                        onClick={() => setNewTaskDestination(day.key as any)}
                        className={`p-2.5 rounded-xl text-xs font-semibold transition-all ${
                          newTaskDestination === day.key
                            ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-white shadow-lg'
                            : theme === 'dark'
                              ? 'bg-stone-800 hover:bg-stone-700'
                              : 'bg-stone-100 hover:bg-stone-200'
                        }`}
                      >
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              newTaskDestination === day.key
                                ? 'border-white bg-white'
                                : 'border-stone-400'
                            }`}>
                              {newTaskDestination === day.key && <Check className="w-2 h-2 text-rose-400" />}
                            </div>
                            <span className="capitalize text-left flex-1">{day.dayLabel}</span>
                          </div>
                          <div className="flex items-center justify-between pl-5">
                            <span className={`text-[10px] ${newTaskDestination === day.key ? 'opacity-90' : 'opacity-70'}`}>
                              {day.dateLabel}
                            </span>
                            {day.isToday && (
                              <Badge variant="outline" className={`text-[9px] px-1 py-0 ${
                                newTaskDestination === day.key ? 'border-white text-white' : 'border-rose-400 text-rose-400'
                              }`}>
                                {language === 'fr' ? "Auj." : language === 'en' ? 'Today' : 'Hoy'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    ));
                  })()}
                </div>
              </div>

              {/* Option pour choisir un autre jour */}
              <button
                onClick={() => {
                  setShowAddTask(false);
                  setShowCalendar(true);
                }}
                className={`w-full p-3 rounded-xl text-sm font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{language === 'fr' ? 'Choisir un autre jour' : language === 'en' ? 'Choose another day' : 'Elegir otro día'}</span>
                </div>
              </button>
            </div>

            {/* Bouton Planifier */}
            <Button
              className="w-full h-12 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white font-semibold"
              onClick={() => {
                if (newTaskText.trim()) {
                  const newTask = {
                    id: `task_${Date.now()}`,
                    text: newTaskText,
                    completed: false
                  };

                  if (newTaskDestination === 'priority') {
                    if (weekPriorities.length < 3) {
                      setWeekPriorities([...weekPriorities, newTask]);
                    } else {
                      alert(language === 'fr' ? 'Vous avez déjà 3 priorités!' : language === 'en' ? 'You already have 3 priorities!' : '¡Ya tienes 3 prioridades!');
                      return;
                    }
                  } else {
                    setWeeklyTasks({
                      ...weeklyTasks,
                      [newTaskDestination]: [...weeklyTasks[newTaskDestination as keyof typeof weeklyTasks], newTask]
                    });
                  }

                  setNewTaskText('');
                  setNewTaskDestination('priority');
                  setShowAddTask(false);

                  // Afficher le popup de hint swipe si c'est la première fois
                  if (!hasSeenSwipeHint) {
                    setTimeout(() => setShowSwipeHintPopup(true), 500);
                    setHasSeenSwipeHint(true);
                  }
                }
              }}
            >
              {language === 'fr' ? 'Planifier' : language === 'en' ? 'Schedule' : 'Planificar'}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Dialog de Félicitations */}
      <Dialog open={showCongratulations} onOpenChange={setShowCongratulations}>
        <DialogContent className={`max-w-sm ${theme === 'dark' ? 'bg-stone-900 border-stone-800' : 'bg-white'}`}>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              {t.challenge.congratulations}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Glowee félicitations */}
            <div className="flex justify-center">
              <img
                src="/Glowee/glowee-felicite.webp"
                alt="Glowee félicitations"
                className="w-32 h-32 object-contain"
              />
            </div>

            {/* Message */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold">{t.challenge.dayCompletedTitle}</h3>
              <p className="text-stone-600 dark:text-stone-400">
                {t.challenge.dayCompletedMessage}
              </p>
              <p className="text-lg font-semibold text-rose-500">
                {t.challenge.seeYouTomorrow}
              </p>
            </div>

            {/* Progression */}
            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50'}`}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold">{t.challenge.progression}</span>
                <span className="text-rose-500 font-bold">
                  {challengeProgress.completedDays.length}/30 {t.challenge.days}
                </span>
              </div>
              <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(challengeProgress.completedDays.length / 30) * 100}%` }}
                />
              </div>
            </div>

            {/* Bouton */}
            <Button
              onClick={() => setShowCongratulations(false)}
              className="w-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
            >
              {t.challenge.keepGoing}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Calendrier - Sélection de date */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className={`max-w-md ${theme === 'dark' ? 'bg-stone-900 border-stone-800' : 'bg-white'}`}>
          <DialogHeader>
            <DialogTitle className="text-center">
              {language === 'fr' ? 'Sélectionner une date' : language === 'en' ? 'Select a date' : 'Seleccionar una fecha'}
            </DialogTitle>
            <DialogDescription className="text-center">
              {language === 'fr' ? 'Les jours avec une croix verte ont des tâches planifiées' : language === 'en' ? 'Days with a green check have scheduled tasks' : 'Los días con un check verde tienen tareas programadas'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <CalendarComponent
              mode="single"
              selected={new Date(selectedDate)}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date.toISOString().split('T')[0]);
                  setShowCalendar(false);
                }
              }}
              captionLayout="dropdown-months"
              className="mx-auto"
              modifiers={{
                hasTask: (date) => {
                  // Obtenir la semaine actuelle (du lundi au dimanche)
                  const today = new Date();
                  const currentDayOfWeek = today.getDay(); // 0 = dimanche, 1 = lundi, etc.

                  // Calculer le lundi de la semaine actuelle
                  const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
                  const monday = new Date(today);
                  monday.setDate(today.getDate() + mondayOffset);
                  monday.setHours(0, 0, 0, 0);

                  // Calculer le dimanche de la semaine actuelle
                  const sunday = new Date(monday);
                  sunday.setDate(monday.getDate() + 6);
                  sunday.setHours(23, 59, 59, 999);

                  // Vérifier si la date est dans la semaine actuelle
                  const dateToCheck = new Date(date);
                  dateToCheck.setHours(0, 0, 0, 0);
                  const isInCurrentWeek = dateToCheck >= monday && dateToCheck <= sunday;

                  // Si la date n'est pas dans la semaine actuelle, ne pas afficher de croix
                  if (!isInCurrentWeek) return false;

                  // Sinon, vérifier si ce jour de la semaine a des tâches
                  const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
                  const dayIndex = date.getDay();
                  const dayOfWeek = dayKeys[dayIndex];
                  return weeklyTasks[dayOfWeek]?.length > 0;
                }
              }}
              modifiersClassNames={{
                hasTask: 'relative after:content-["✓"] after:absolute after:top-1 after:right-1 after:text-[10px] after:text-green-500 after:font-bold'
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Popup de confirmation de suppression de tâche */}
      <Dialog open={showDeleteTaskConfirm} onOpenChange={setShowDeleteTaskConfirm}>
        <DialogContent className={`max-w-md ${theme === 'dark' ? 'bg-stone-900 border-stone-800' : 'bg-white'}`}>
          <div className="flex flex-col items-center gap-4 py-4">
            <img
              src="/Glowee/glowee-happy.webp"
              alt="Glowee"
              className="w-32 h-32 object-contain"
            />
            <DialogHeader className="text-center">
              <DialogTitle className="text-xl">
                {language === 'fr' ? 'Supprimer cette tâche ?' : language === 'en' ? 'Delete this task?' : '¿Eliminar esta tarea?'}
              </DialogTitle>
              <DialogDescription className="text-center pt-2">
                {language === 'fr'
                  ? 'Es-tu sûr(e) de vouloir supprimer cette tâche ? Cette action est irréversible.'
                  : language === 'en'
                    ? 'Are you sure you want to delete this task? This action is irreversible.'
                    : '¿Estás seguro de que quieres eliminar esta tarea? Esta acción es irreversible.'}
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 w-full pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteTaskConfirm(false)}
              >
                {language === 'fr' ? 'Annuler' : language === 'en' ? 'Cancel' : 'Cancelar'}
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                onClick={() => {
                  if (taskToDelete) {
                    if (taskToDelete.type === 'priority') {
                      setWeekPriorities(weekPriorities.filter(p => p.id !== taskToDelete.id));
                    } else {
                      setWeeklyTasks({
                        ...weeklyTasks,
                        [taskToDelete.day]: weeklyTasks[taskToDelete.day as keyof typeof weeklyTasks].filter(t => t.id !== taskToDelete.id)
                      });
                    }
                  }
                  setShowDeleteTaskConfirm(false);
                  setTaskToDelete(null);
                }}
              >
                {language === 'fr' ? 'Supprimer' : language === 'en' ? 'Delete' : 'Eliminar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .safe-area-pb {
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
      `}</style>

      {/* PWA Install Prompt */}
      <InstallPrompt />

      {/* Glowee Chat Popup */}
      <GloweeChatPopup
        isOpen={showGloweeChat}
        onClose={() => setShowGloweeChat(false)}
        theme={theme}
        language={language}
      />

      {/* Trial Extension Popup - 3 jours supplémentaires */}
      <TrialExtensionPopup
        isOpen={showTrialExtension}
        onClose={() => setShowTrialExtension(false)}
        theme={theme}
      />

      {/* Subscription Popup - Abonnement 6.99€/mois */}
      <SubscriptionPopup
        isOpen={showSubscription}
        onClose={() => setShowSubscription(false)}
        theme={theme}
        onOpenAuthDialog={() => {
          setShouldReopenSubscription(true);
          setShowAuthDialog(true);
        }}
      />

      {/* Glowee Welcome Popup - 1ère visite Dashboard */}
      <GloweePopup
        isOpen={showGloweeWelcome}
        onClose={() => {
          setShowGloweeWelcome(false);
          markWelcomeSeen('home');
        }}
        gloweeImage={gloweeMessages.home.firstVisit.image}
        userName={gloweeMessages.home.firstVisit.userName}
        title={gloweeMessages.home.firstVisit.title}
        message={gloweeMessages.home.firstVisit.message}
        position="top"
        language={language}
      />

      {/* Glowee 5th Visit Popup */}
      <GloweePopup
        isOpen={showGloweeFifthVisit}
        onClose={() => {
          setShowGloweeFifthVisit(false);
          markWelcomeSeen('app');
        }}
        gloweeImage={gloweeMessages.home.fifthVisit.image}
        userName={gloweeMessages.home.fifthVisit.userName}
        title={gloweeMessages.home.fifthVisit.title}
        message={gloweeMessages.home.fifthVisit.message}
        position="top"
        language={language}
      />

      {/* Glowee Planning Welcome Popup */}
      <GloweePopup
        isOpen={showGloweePlanningWelcome}
        onClose={() => {
          setShowGloweePlanningWelcome(false);
          markWelcomeSeen('planning');
        }}
        gloweeImage={gloweeMessages.planning.firstVisit.image}
        userName={gloweeMessages.planning.firstVisit.userName}
        title={gloweeMessages.planning.firstVisit.title}
        message={gloweeMessages.planning.firstVisit.message}
        position="top"
        language={language}
      />

      {/* Glowee Journal Welcome Popup */}
      <GloweePopup
        isOpen={showGloweeJournalWelcome}
        onClose={() => {
          setShowGloweeJournalWelcome(false);
          markWelcomeSeen('journal');
        }}
        gloweeImage={gloweeMessages.journal.firstVisit.image}
        userName={gloweeMessages.journal.firstVisit.userName}
        title={gloweeMessages.journal.firstVisit.title}
        message={gloweeMessages.journal.firstVisit.message}
        position="top"
        language={language}
      />

      {/* Glowee Swipe Hint Popup - Planning */}
      <GloweePopup
        isOpen={showSwipeHintPopup}
        onClose={() => setShowSwipeHintPopup(false)}
        gloweeImage="glowee-acceuillante.webp"
        userName={language === 'fr' ? 'Ma belle' : language === 'en' ? 'My dear' : 'Mi bella'}
        title={language === 'fr' ? 'Astuce pour supprimer une tâche 💡' : language === 'en' ? 'Tip to delete a task 💡' : 'Consejo para eliminar una tarea 💡'}
        message={language === 'fr'
          ? 'Pour supprimer une tâche, il te suffit de la balayer vers la gauche ! Une croix de suppression apparaîtra. Simple et rapide ! ✨'
          : language === 'en'
            ? 'To delete a task, just swipe it to the left! A delete cross will appear. Simple and fast! ✨'
            : '¡Para eliminar una tarea, simplemente deslízala hacia la izquierda! Aparecerá una cruz de eliminación. ¡Simple y rápido! ✨'}
        position="top"
        language={language}
      />

      {/* Challenge Switch Drawer - Design moderne */}
      <Drawer open={showChallengeDrawer} onOpenChange={setShowChallengeDrawer}>
        <DrawerContent className="max-w-lg mx-auto bg-cream-100 border-none rounded-t-3xl">
          <DrawerHeader className="border-b border-stone-200 pb-4">
            <DrawerTitle className="text-center text-xl font-bold text-navy-900">
              {language === 'fr' ? 'Choisir un challenge' : language === 'en' ? 'Choose a challenge' : 'Elegir un desafío'}
            </DrawerTitle>
            <DrawerDescription className="text-center text-sm text-stone-600">
              {language === 'fr' ? 'Sélectionne le challenge que tu veux suivre' : language === 'en' ? 'Select the challenge you want to follow' : 'Selecciona el desafío que quieres seguir'}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-5 space-y-3">
            {/* Mind & Life Option */}
            <button
              onClick={() => {
                setSelectedChallenge('mind-life');
                setShowChallengeDrawer(false);
              }}
              className={`w-full p-4 rounded-2xl border-none shadow-soft transition-all hover:scale-[1.02] relative overflow-hidden ${
                selectedChallenge === 'mind-life'
                  ? 'bg-gradient-to-br from-soft-purple-200 to-soft-purple-400'
                  : 'bg-gradient-to-br from-soft-purple-100 to-soft-purple-200'
              }`}
            >
              {/* Emoji décoratif */}
              <div className="absolute top-2 right-2 text-5xl opacity-20">
                🎯
              </div>

              <div className="flex items-start gap-3 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🌱</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold mb-1 text-navy-900">
                    {t.challengeSelection.mindLifeTitle}
                  </h3>
                  <p className="text-xs text-navy-800 leading-relaxed">
                    {t.challengeSelection.mindLifeDesc}
                  </p>
                  {selectedChallenge === 'mind-life' && (
                    <div className="mt-2 flex items-center gap-1.5 text-soft-purple-500">
                      <Check className="w-4 h-4" />
                      <span className="text-xs font-semibold">
                        {language === 'fr' ? 'Challenge actif' : language === 'en' ? 'Active challenge' : 'Desafío activo'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>

            {/* Beauty & Body Option */}
            <button
              onClick={() => {
                setSelectedChallenge('beauty-body');
                setShowChallengeDrawer(false);
              }}
              className={`w-full p-4 rounded-2xl border-none shadow-soft transition-all hover:scale-[1.02] relative overflow-hidden ${
                selectedChallenge === 'beauty-body'
                  ? 'bg-gradient-to-br from-peach-200 to-peach-400'
                  : 'bg-gradient-to-br from-peach-100 to-peach-200'
              }`}
            >
              {/* Emoji décoratif */}
              <div className="absolute top-2 right-2 text-5xl opacity-20">
                ✨
              </div>

              <div className="flex items-start gap-3 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💄</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold mb-1 text-navy-900">
                    {t.challengeSelection.beautyBodyTitle}
                  </h3>
                  <p className="text-xs text-navy-800 leading-relaxed">
                    {t.challengeSelection.beautyBodyDesc}
                  </p>
                  {selectedChallenge === 'beauty-body' && (
                    <div className="mt-2 flex items-center gap-1.5 text-peach-500">
                      <Check className="w-4 h-4" />
                      <span className="text-xs font-semibold">
                        {language === 'fr' ? 'Challenge actif' : language === 'en' ? 'Active challenge' : 'Desafío activo'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Auth Dialog */}
      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        defaultMode={user ? 'signin' : 'signup'}
      />
    </div>
  );
}
