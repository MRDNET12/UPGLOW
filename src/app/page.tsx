'use client';

import { useEffect, useState, useMemo } from 'react';
import { useStore, View } from '@/lib/store';
import {
  getLocalizedChallengeDays,
  getLocalizedBonusAffirmations,
  getLocalizedChecklistsData,
  getLocalizedSoftLifeGuide,
  getLocalizedBonusSections,
  getLocalizedFiftyThingsAlone
} from '@/lib/challenge-data';
import { newMePillars, newMeGloweeMessage } from '@/lib/new-me-data';
import { Sparkles, BookOpen, TrendingUp, Home, Heart, Target, Layers, Gift, Settings, ChevronRight, Check, Plus, X, Calendar, Moon, Sun, Droplet, Zap, Smile, Activity, Utensils, Lightbulb, Image as ImageIcon, Trash2, Download, Bell, BellOff, Star, CheckSquare, ListChecks, Award, Globe } from 'lucide-react';
import { useTranslation } from '@/lib/useTranslation';
import { Language } from '@/lib/translations';
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
import { AIChat } from '@/components/AIChat';
import { GloweeChatPopup } from '@/components/GloweeChatPopup';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import InstallPrompt from '@/components/InstallPrompt';
import AppLoader from '@/components/AppLoader';
import { SmallWins } from '@/components/SmallWins';
import { EveningQuestion } from '@/components/EveningQuestion';
import { BoundariesTracker } from '@/components/BoundariesTracker';
import { TrialExtensionPopup } from '@/components/TrialExtensionPopup';
import { SubscriptionPopup } from '@/components/SubscriptionPopup';
import { TrialBadge } from '@/components/TrialBadge';
import { MyGoals } from '@/components/goals/MyGoals';
import GloweePopup from '@/components/shared/GloweePopup';
import { useVisitTracker, trackVisit, isFirstVisit, isFifthAppVisit, markWelcomeSeen, markPresentationSeen, hasPresentationBeenSeen } from '@/utils/visitTracker';
import { gloweeMessages } from '@/data/gloweeMessages';

export default function GlowUpChallengeApp() {
  const [isHydrated, setIsHydrated] = useState(false);

  const {
    currentView,
    setCurrentView,
    currentDay,
    setCurrentDay,
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

  // États pour les popups Glowee
  const [showGloweeWelcome, setShowGloweeWelcome] = useState(false);
  const [showGloweeFifthVisit, setShowGloweeFifthVisit] = useState(false);
  const [showGloweePlanningWelcome, setShowGloweePlanningWelcome] = useState(false);
  const [showGloweeJournalWelcome, setShowGloweeJournalWelcome] = useState(false);

  const [todayDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newJournalEntry, setNewJournalEntry] = useState({
    mood: '',
    feelings: '',
    glow: '',
    learned: '',
    freeContent: ''
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

  // Tracker les visites et afficher les popups Glowee
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

  useEffect(() => {
    if (hasStarted && isHydrated) {
      setCurrentView('dashboard');
    }
  }, [hasStarted, setCurrentView, isHydrated]);

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
    if (newJournalEntry.mood || newJournalEntry.feelings) {
      addJournalEntry({
        date: new Date(),
        ...newJournalEntry
      });
      setNewJournalEntry({ mood: '', feelings: '', glow: '', learned: '', freeContent: '' });
    }
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

  // Presentation Screen - Ne s'affiche qu'une seule fois
  if (currentView === 'presentation') {
    // Si la présentation a déjà été vue, passer directement à l'onboarding
    if (hasPresentationBeenSeen()) {
      setCurrentView('onboarding');
      return null;
    }

    return (
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-stone-950 text-stone-100' : 'bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 text-stone-900'}`}>
        <div className="flex-1 overflow-y-auto p-6 pb-24">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-3 pt-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 via-pink-400 to-orange-300 shadow-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                {t.presentation.title}
              </h1>
              <p className="text-base md:text-lg text-stone-600 dark:text-stone-400 italic">
                "{t.presentation.quote}"
              </p>
            </div>

            {/* Subtitle */}
            <Card className={`border-none shadow-xl ${theme === 'dark' ? 'bg-gradient-to-br from-stone-900 to-stone-800' : 'bg-white'}`}>
              <CardContent className="p-4 text-center">
                <p className="text-xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                  {t.presentation.description}
                </p>
              </CardContent>
            </Card>

            {/* Triangle de transformation - Version condensée */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-center flex items-center justify-center gap-2">
                <Target className="w-5 h-5 text-rose-500" />
                {t.presentation.triangleTitle}
              </h2>

              {/* Pilier 1 */}
              <Card className={`border-l-4 border-rose-500 shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-rose-500 text-base">
                    <Sparkles className="w-4 h-4" />
                    {t.presentation.pillar1Title}
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Pilier 2 */}
              <Card className={`border-l-4 border-pink-500 shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-pink-500 text-base">
                    <Heart className="w-4 h-4" />
                    {t.presentation.pillar2Title}
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Pilier 3 */}
              <Card className={`border-l-4 border-orange-500 shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-orange-500 text-base">
                    <TrendingUp className="w-4 h-4" />
                    {t.presentation.pillar3Title}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Règles du Challenge - Version condensée */}
            <Card className={`border-none shadow-xl ${theme === 'dark' ? 'bg-gradient-to-br from-rose-900/30 to-orange-900/30' : 'bg-gradient-to-br from-rose-50 to-orange-50'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-lg flex items-center justify-center gap-2">
                  <Award className="w-5 h-5 text-rose-500" />
                  {t.presentation.rulesTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  t.presentation.rule1,
                  t.presentation.rule5
                ].map((rule, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-xl ${theme === 'dark' ? 'bg-stone-800/50' : 'bg-white/80'}`}
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white font-bold text-xs">
                      {index === 0 ? '1' : '5'}
                    </div>
                    <p className={`flex-1 leading-relaxed text-sm ${index === 1 ? 'font-bold text-rose-500' : ''}`}>
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
              className="w-full h-14 text-lg bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white font-bold rounded-full shadow-2xl shadow-rose-300 dark:shadow-rose-900/50"
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
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${theme === 'dark' ? 'bg-stone-950 text-stone-100' : 'bg-amber-50 text-stone-900'}`}>
        <div className="max-w-md w-full space-y-8">
          {/* Glowee Image */}
          <div className="flex justify-center animate-in zoom-in duration-500">
            <img
              src="/Glowee/glowee-acceuillante.webp"
              alt="Glowee"
              className="w-48 h-48 object-contain"
            />
          </div>

          {/* Title */}
          <div className="text-center space-y-3 animate-in slide-in-from-bottom duration-700">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              {t.challengeSelection.title}
            </h1>
            <p className="text-xl text-stone-700 dark:text-stone-300 font-light">
              {t.challengeSelection.subtitle}
            </p>
          </div>

          {/* Challenge Options */}
          <div className="space-y-4 animate-in slide-in-from-bottom duration-700 delay-200">
            {/* Option 1: Mind & Life */}
            <button
              onClick={() => {
                setSelectedChallenge('mind-life');
                startChallenge();
              }}
              className={`w-full p-6 rounded-2xl border-2 transition-all hover:scale-[1.02] ${
                theme === 'dark'
                  ? 'border-stone-800 bg-gradient-to-br from-green-900/20 to-emerald-900/20 hover:border-green-700'
                  : 'border-stone-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:border-green-400'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-5xl">{t.challengeSelection.mindLifeEmoji}</span>
                <div className="flex-1 text-left">
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {t.challengeSelection.mindLifeTitle}
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
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
              className={`w-full p-6 rounded-2xl border-2 transition-all hover:scale-[1.02] ${
                theme === 'dark'
                  ? 'border-stone-800 bg-gradient-to-br from-pink-900/20 to-purple-900/20 hover:border-pink-700'
                  : 'border-stone-200 bg-gradient-to-br from-pink-50 to-purple-50 hover:border-pink-400'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-5xl">{t.challengeSelection.beautyBodyEmoji}</span>
                <div className="flex-1 text-left">
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    {t.challengeSelection.beautyBodyTitle}
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
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
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-stone-950 text-stone-100' : 'bg-amber-50 text-stone-900'}`}>
      {/* Main Content */}
      <main className="flex-1 pb-24 overflow-y-auto">
        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="p-6 space-y-6 max-w-lg mx-auto">
            {/* Header */}
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                {t.dashboard.welcome} ✨
              </h1>
              <p className={`text-stone-600 dark:text-stone-400 ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                {t.dashboard.continueYourChallenge}
              </p>
              {/* Trial Badge and Challenge Switch Button */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <TrialBadge theme={theme} />
                <button
                  onClick={() => setShowChallengeDrawer(true)}
                  className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-stone-800 hover:bg-stone-700' : 'bg-stone-200 hover:bg-stone-300'}`}
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
              </div>
            </div>

            {/* Today's Challenge with Progress - Only show if Mind & Life is selected */}
            {selectedChallenge === 'mind-life' && (
              <Card
                className={`border-none shadow-lg cursor-pointer transition-all hover:scale-105 ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}
                onClick={() => {
                  setCurrentDay(challengeProgress.currentDay);
                  setCurrentView('challenge');
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-rose-500 hover:bg-rose-600">{t.challenge.day} {challengeProgress.currentDay}</Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-rose-500">{progressPercentage}%</span>
                      <ChevronRight className="w-5 h-5 text-rose-500" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{getCurrentDayData()?.title}</h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mb-3">{getCurrentDayData()?.content}</p>
                  <div className="space-y-1">
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-500">
                      <span>{t.dashboard.week} {Math.ceil(currentDay / 7)}/4</span>
                      <span>{challengeProgress.completedDays.length}/30 {t.dashboard.daysCompleted}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* New Me Card - Only show if Beauty & Body is selected */}
            {selectedChallenge === 'beauty-body' && (
              <Card
                className={`border-none shadow-lg cursor-pointer transition-all hover:scale-105 ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}
                onClick={() => setCurrentView('new-me')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-purple-500" />
                      <Badge className="bg-purple-500 hover:bg-purple-600">{t.newMe.title}</Badge>
                    </div>
                    <ChevronRight className="w-5 h-5 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t.newMe.subtitle}</h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2">
                    13 {t.newMe.habits} pour te transformer en 30 jours avec Glowee
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Card
                className={`border-none shadow-md cursor-pointer transition-all hover:scale-105 ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}
                onClick={() => setCurrentView('journal')}
              >
                <CardContent className="p-3 text-center">
                  <BookOpen className={`w-6 h-6 mx-auto mb-1.5 ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`} />
                  <h3 className="font-semibold text-sm">{t.journal.title}</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-500">{journalEntries.length} {t.journal.entries}</p>
                </CardContent>
              </Card>

              <Card
                className={`border-none shadow-md cursor-pointer transition-all hover:scale-105 ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}
                onClick={() => setCurrentView('trackers')}
              >
                <CardContent className="p-3 text-center">
                  <Activity className={`w-6 h-6 mx-auto mb-1.5 ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`} />
                  <h3 className="font-semibold text-sm">{t.trackers.title}</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-500">{t.trackers.today}</p>
                </CardContent>
              </Card>

              <Card
                className={`border-none shadow-md cursor-pointer transition-all hover:scale-105 ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}
                onClick={() => setCurrentView('routine')}
              >
                <CardContent className="p-3 text-center">
                  <Calendar className={`w-6 h-6 mx-auto mb-1.5 ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`} />
                  <h3 className="font-semibold text-sm">
                    {language === 'fr' ? 'Mon Planning' : language === 'en' ? 'My Planning' : 'Mi Planificación'}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-500">
                    {language === 'fr' ? 'Organisez votre semaine' : language === 'en' ? 'Organize your week' : 'Organiza tu semana'}
                  </p>
                </CardContent>
              </Card>

              <Card
                className={`border-none shadow-md cursor-pointer transition-all hover:scale-105 ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}
                onClick={() => setCurrentView('my-goals')}
              >
                <CardContent className="p-3 text-center">
                  <Target className={`w-6 h-6 mx-auto mb-1.5 ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`} />
                  <h3 className="font-semibold text-sm">
                    {language === 'fr' ? 'Mes Objectifs' : language === 'en' ? 'My Goals' : 'Mis Objetivos'}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-500">
                    {language === 'fr' ? 'Atteins tes rêves' : language === 'en' ? 'Achieve your dreams' : 'Alcanza tus sueños'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Bonus Section */}
            <Card
              className={`border-none shadow-lg cursor-pointer transition-all hover:scale-105 ${theme === 'dark' ? 'bg-gradient-to-br from-amber-900/30 to-orange-900/30' : 'bg-gradient-to-br from-amber-50 to-orange-50'}`}
              onClick={() => setCurrentView('bonus')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-gradient-to-br from-amber-200 to-orange-200 dark:from-amber-800 dark:to-orange-800">
                    <Gift className="w-6 h-6 text-amber-600 dark:text-amber-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{t.bonus.title}</h3>
                    <p className="text-xs text-stone-500 dark:text-stone-500">{t.bonus.affirmations} & {t.bonus.guides}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Challenge View */}
        {currentView === 'challenge' && (
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
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{t.challenge.title}</h1>
                <p className="text-sm text-stone-500 dark:text-stone-500">{t.challenge.day} {currentDay} / 30</p>
              </div>
            </div>

            {/* Day Selector */}
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
                      className={`min-w-12 relative ${
                        currentDay === day.day
                          ? 'bg-rose-500 hover:bg-rose-600'
                          : isCompleted
                            ? 'bg-green-100 dark:bg-green-900 border-green-400'
                            : isLocked
                              ? 'opacity-40'
                              : ''
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

            {/* Day Content */}
            {getCurrentDayData() && (
              <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
                {!canAccessDay(currentDay) ? (
                  // Jour verrouillé
                  <CardContent className="p-12 text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                      <span className="text-4xl">🔒</span>
                    </div>
                    <h3 className="text-xl font-bold">{t.challenge.lockedDay}</h3>
                    <p className="text-stone-600 dark:text-stone-400">
                      {t.challenge.completeCurrentDay}
                    </p>
                    <Button
                      onClick={() => setCurrentDay(getCurrentUnlockedDay())}
                      className="bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
                    >
                      {t.challenge.viewDay} {getCurrentUnlockedDay()}
                    </Button>
                  </CardContent>
                ) : (
                  // Jour accessible
                  <>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge className="bg-gradient-to-r from-rose-400 to-pink-400 mb-2">{t.challenge.week} {getCurrentDayData()?.week}</Badge>
                          <CardTitle className="text-2xl mb-2">{getCurrentDayData()?.title}</CardTitle>
                          <CardDescription className="text-sm">{getCurrentDayData()?.weekObjective}</CardDescription>
                        </div>
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            challengeProgress.completedDays.includes(currentDay)
                              ? 'bg-green-100 dark:bg-green-900'
                              : 'bg-stone-100 dark:bg-stone-800'
                          }`}
                        >
                          {challengeProgress.completedDays.includes(currentDay) ? (
                            <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                          ) : (
                            <span className="text-2xl">{currentDay}</span>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                  {/* Description */}
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50'}`}>
                    <p className="text-lg leading-relaxed">{getCurrentDayData()?.content}</p>
                  </div>

                  {/* Affirmation */}
                  <div className={`p-4 rounded-xl border-l-4 border-rose-400 ${theme === 'dark' ? 'bg-stone-800' : 'bg-rose-50'}`}>
                    <p className="italic text-stone-700 dark:text-stone-300 font-serif">"{getCurrentDayData()?.affirmation}"</p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-rose-400" />
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
                        return (
                          <div
                            key={index}
                            className={`p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02] ${theme === 'dark' ? 'bg-stone-800 hover:bg-stone-700' : 'bg-stone-50 hover:bg-stone-100'} ${isCompleted ? 'opacity-60' : ''}`}
                            onClick={() => toggleActionCompletion(currentDay, action.key)}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">{action.icon}</span>
                              <div className="flex-1">
                                <h4 className={`font-semibold text-sm mb-1 ${isCompleted ? 'line-through' : ''}`}>{action.label}</h4>
                                <p className={`text-sm ${isCompleted ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-600 dark:text-stone-400'}`}>{action.value}</p>
                              </div>
                              {isCompleted && <Check className="w-5 h-5 text-green-500 flex-shrink-0" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="font-semibold text-sm">{t.challenge.notes}</label>
                    <Textarea
                      placeholder={t.challenge.notesPlaceholder}
                      value={challengeProgress.notes[currentDay] || ''}
                      onChange={(e) => updateDayNotes(currentDay, e.target.value)}
                      rows={4}
                      className={theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50'}
                    />
                  </div>

                  {/* Complete Button */}
                  <Button
                    onClick={handleCompleteDay}
                    className={`w-full h-14 text-base font-semibold ${
                      challengeProgress.completedDays.includes(currentDay)
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400'
                    } text-white`}
                  >
                    {challengeProgress.completedDays.includes(currentDay) ? (
                      <>
                        <Check className="mr-2 w-5 h-5" />
                        {t.challenge.completedButton}
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 w-5 h-5" />
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
        )}

        {/* Journal View */}
        {currentView === 'journal' && (
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
              <h1 className="text-2xl font-bold">{t.journal.title}</h1>
            </div>

            {/* New Entry Form */}
            <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle>{t.journal.newEntry}</CardTitle>
                <CardDescription>{t.journal.expressYourself}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.journal.howFeelToday}</label>
                  <Textarea
                    placeholder={t.journal.yourMood}
                    value={newJournalEntry.mood}
                    onChange={(e) => setNewJournalEntry({ ...newJournalEntry, mood: e.target.value })}
                    rows={2}
                    className={theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.journal.whatBroughtGlow}</label>
                  <Textarea
                    placeholder={t.journal.momentsOfJoy}
                    value={newJournalEntry.glow}
                    onChange={(e) => setNewJournalEntry({ ...newJournalEntry, glow: e.target.value })}
                    rows={2}
                    className={theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.journal.whatLearned}</label>
                  <Textarea
                    placeholder={t.journal.discoveriesLearnings}
                    value={newJournalEntry.learned}
                    onChange={(e) => setNewJournalEntry({ ...newJournalEntry, learned: e.target.value })}
                    rows={2}
                    className={theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.journal.freeContent}</label>
                  <Textarea
                    placeholder={t.challenge.notesPlaceholder}
                    value={newJournalEntry.freeContent}
                    onChange={(e) => setNewJournalEntry({ ...newJournalEntry, freeContent: e.target.value })}
                    rows={3}
                    className={theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50'}
                  />
                </div>

                <Button onClick={handleSaveJournalEntry} className="w-full bg-rose-500 hover:bg-rose-600 text-white">
                  <Plus className="mr-2 w-4 h-4" />
                  {t.journal.addToJournal}
                </Button>
              </CardContent>
            </Card>

            {/* Journal History */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">{t.journal.history}</h2>
              {journalEntries.length === 0 ? (
                <div className={`text-center p-8 rounded-xl ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-stone-400" />
                  <p className="text-stone-500 dark:text-stone-500">{t.journal.noEntries}</p>
                </div>
              ) : (
                journalEntries.map((entry) => (
                  <Card key={entry.id} className={`border-none shadow-md ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-stone-500 dark:text-stone-500">
                          {new Date(entry.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => deleteJournalEntry(entry.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {entry.mood && (
                        <div>
                          <p className="text-xs text-stone-500 dark:text-stone-500 mb-1">Humeur</p>
                          <p className="text-sm">{entry.mood}</p>
                        </div>
                      )}
                      {entry.glow && (
                        <div>
                          <p className="text-xs text-stone-500 dark:text-stone-500 mb-1">{t.journal.glowOfDay}</p>
                          <p className="text-sm">{entry.glow}</p>
                        </div>
                      )}
                      {entry.learned && (
                        <div>
                          <p className="text-xs text-stone-500 dark:text-stone-500 mb-1">Appris</p>
                          <p className="text-sm">{entry.learned}</p>
                        </div>
                      )}
                      {entry.freeContent && (
                        <div>
                          <p className="text-xs text-stone-500 dark:text-stone-500 mb-1">Libre</p>
                          <p className="text-sm">{entry.freeContent}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
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

        {/* Trackers View */}
        {currentView === 'trackers' && (
          <div className="pb-20">
            {/* Header avec bouton retour */}
            <div className="flex items-center gap-4 p-6 pb-0 max-w-lg mx-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentView('dashboard')}
              >
                <X className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold">{t.trackers.title} Glow Up</h1>
            </div>

            {/* Sélecteur de jours - Scrollable horizontal sans barre */}
            <div className="overflow-x-auto scrollbar-hide px-6 py-4">
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
                      className={`flex-shrink-0 w-14 h-14 rounded-xl font-semibold transition-all relative ${
                        trackerCurrentDay === day
                          ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-white shadow-lg scale-110'
                          : theme === 'dark'
                            ? 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {day}
                      {isCompleted && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {!isCompleted && completionPercentage > 0 && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-rose-400">
                          {completionPercentage}%
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Barre de progression */}
            <div className={`mx-6 p-6 rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
              <div className="space-y-4">
                <h2 className="text-xl font-bold">
                  {language === 'fr' ? `Bonjour, prête pour ton jour ${trackerCurrentDay} !` :
                   language === 'en' ? `Hello, ready for day ${trackerCurrentDay}!` :
                   `¡Hola, lista para el día ${trackerCurrentDay}!`}
                </h2>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">
                    {language === 'fr' ? 'Jour' : language === 'en' ? 'Day' : 'Día'} {trackerCurrentDay} / 30
                  </span>
                  <span className="text-stone-500">
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
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {language === 'fr' ? 'Progression du jour' : language === 'en' ? 'Day progress' : 'Progreso del día'}
                    </span>
                    <span className="text-2xl font-bold text-rose-400">
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
                  <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 transition-all duration-500 rounded-full"
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
            <div className="p-6 space-y-6 max-w-lg mx-auto">
              {/* Jour et Date */}
              <div className="text-center pb-4 border-b border-stone-200 dark:border-stone-800">
                <h2 className="text-2xl font-bold text-rose-400">
                  {new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', { weekday: 'long' })}
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                  {new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              {/* Hydration */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold">{t.trackers.hydration}</h3>
                  <span className="ml-auto text-sm text-stone-500 dark:text-stone-500">{getTodayTracker().waterGlasses} / 8 {t.trackers.glasses}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[...Array(8)].map((_, i) => (
                    <Button
                      key={i}
                      variant={i < getTodayTracker().waterGlasses ? 'default' : 'outline'}
                      size="icon"
                      className={`w-10 h-10 ${i < getTodayTracker().waterGlasses ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
                      onClick={() => updateTodayTracker({ waterGlasses: i < getTodayTracker().waterGlasses ? i : i + 1 })}
                    >
                      💧
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sleep - Nouveau design avec - 8 + ✓ */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-purple-400" />
                  <h3 className="font-semibold">{t.trackers.sleep}</h3>
                </div>
                <div className="flex items-center gap-4 justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-12 h-12 rounded-full"
                    onClick={() => updateTodayTracker({ sleepHours: Math.max(0, (getTodayTracker().sleepHours || 0) - 0.5) })}
                  >
                    -
                  </Button>
                  <div className="text-4xl font-bold min-w-[80px] text-center">
                    {getTodayTracker().sleepHours || 0}<span className="text-2xl">h</span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-12 h-12 rounded-full"
                    onClick={() => updateTodayTracker({ sleepHours: Math.min(12, (getTodayTracker().sleepHours || 0) + 0.5) })}
                  >
                    +
                  </Button>
                  <Button
                    variant="default"
                    size="icon"
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white border-0"
                  >
                    ✓
                  </Button>
                </div>
              </div>

              {/* Mood - Avec traduction correcte */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Smile className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-semibold">{t.trackers.mood}</h3>
                </div>
                <div className="flex gap-2 justify-between">
                  {['😢', '😕', '😐', '🙂', '😄'].map((emoji, i) => (
                    <Button
                      key={i}
                      variant={getTodayTracker().mood === i + 1 ? 'default' : 'outline'}
                      size="icon"
                      className={`w-12 h-12 text-2xl ${getTodayTracker().mood === i + 1 ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
                      onClick={() => updateTodayTracker({ mood: i + 1 })}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Skincare */}
              <button
                onClick={() => updateTodayTracker({ skincareCompleted: !getTodayTracker().skincareCompleted })}
                className={`flex items-center justify-between p-4 rounded-xl transition-all bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30`}
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-rose-500" />
                  <div className="text-left">
                    <h3 className={`font-semibold ${getTodayTracker().skincareCompleted ? 'line-through' : ''}`}>
                      {t.trackers.skincareCompleted}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      {t.trackers.todaysRoutine}
                    </p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  getTodayTracker().skincareCompleted
                    ? 'bg-rose-400 border-rose-400'
                    : 'border-rose-300 dark:border-rose-700'
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
                        <span className={`text-sm ${isCompleted ? 'line-through' : ''}`}>{habit.label}</span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isCompleted
                            ? 'bg-rose-400 border-rose-400'
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
                          <span className={`text-xs flex-1 text-left ${isCompleted ? 'line-through' : ''}`}>{habit.label}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isCompleted
                              ? 'bg-green-500 border-green-500'
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
                        <span className={`text-sm ${isCompleted ? 'line-through' : ''}`}>{habit.label}</span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isCompleted
                            ? 'bg-rose-400 border-rose-400'
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
                        <button
                          onClick={() =>
                            updateTodayTracker({
                              habits: { ...getTodayTracker().habits, [habit.id]: !isCompleted }
                            })
                          }
                          className="flex items-center gap-2 flex-1"
                        >
                          <span className={`text-sm ${isCompleted ? 'line-through' : ''}`}>{habit.label}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-stone-800">
                            {habit.type === 'good' ? '✨' : '⚠️'}
                          </span>
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateTodayTracker({
                                habits: { ...getTodayTracker().habits, [habit.id]: !isCompleted }
                              })
                            }
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isCompleted
                                ? 'bg-green-500 border-green-500'
                                : 'border-stone-300 dark:border-stone-600'
                            }`}
                          >
                            {isCompleted && <Check className="w-4 h-4 text-white" />}
                          </button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => setCustomHabits(customHabits.filter(h => h.id !== habit.id))}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bouton ajouter une habitude */}
              {!showAddHabit ? (
                <Button
                  variant="outline"
                  className="w-full border-dashed border-2"
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
                        className="flex-1 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white border-0"
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

            {/* Date actuelle - Cliquable pour ouvrir le calendrier */}
            <div className="px-6 pb-4">
              <button
                onClick={() => setShowCalendar(true)}
                className={`w-full p-4 rounded-xl text-center transition-all ${
                  theme === 'dark'
                    ? 'bg-stone-900 hover:bg-stone-800'
                    : 'bg-white hover:bg-stone-50'
                } shadow-sm`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4 text-rose-400" />
                  <p className="text-sm font-medium">
                    {new Date(selectedDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </button>
            </div>

            {/* Contenu du planning */}
            <div className="px-6 space-y-4 max-w-lg mx-auto">
              {/* Mes 3 priorités de la semaine */}
              <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} shadow-lg`}>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-rose-400" />
                  {language === 'fr' ? 'Mes 3 priorités de la semaine' : language === 'en' ? 'My 3 weekly priorities' : 'Mis 3 prioridades semanales'}
                </h2>
                <div className="space-y-3">
                  {weekPriorities.length === 0 ? (
                    <p className="text-sm text-stone-500 dark:text-stone-400 text-center py-4">
                      {language === 'fr' ? 'Aucune priorité définie' : language === 'en' ? 'No priorities set' : 'Sin prioridades definidas'}
                    </p>
                  ) : (
                    weekPriorities.map((priority) => (
                      <div
                        key={priority.id}
                        className={`flex items-center gap-3 p-3 rounded-xl ${
                          priority.completed
                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                            : theme === 'dark'
                              ? 'bg-stone-800'
                              : 'bg-stone-50'
                        }`}
                      >
                        <button
                          onClick={() => {
                            setWeekPriorities(weekPriorities.map(p =>
                              p.id === priority.id ? { ...p, completed: !p.completed } : p
                            ));
                          }}
                          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            priority.completed
                              ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 border-transparent'
                              : 'border-stone-300 dark:border-stone-600'
                          }`}
                        >
                          {priority.completed && <Check className="w-4 h-4 text-white" />}
                        </button>
                        <span className={`flex-1 ${priority.completed ? 'line-through text-stone-500' : ''}`}>
                          {priority.text}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Jours de la semaine - 2 par ligne */}
              <div className="grid grid-cols-2 gap-3 items-start">
                {(() => {
                  const today = new Date();
                  const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                  const currentDayKey = dayKeys[today.getDay()];

                  return [
                    { key: 'monday', label: language === 'fr' ? 'Lundi' : language === 'en' ? 'Monday' : 'Lunes' },
                    { key: 'tuesday', label: language === 'fr' ? 'Mardi' : language === 'en' ? 'Tuesday' : 'Martes' },
                    { key: 'wednesday', label: language === 'fr' ? 'Mercredi' : language === 'en' ? 'Wednesday' : 'Miércoles' },
                    { key: 'thursday', label: language === 'fr' ? 'Jeudi' : language === 'en' ? 'Thursday' : 'Jueves' },
                    { key: 'friday', label: language === 'fr' ? 'Vendredi' : language === 'en' ? 'Friday' : 'Viernes' },
                    { key: 'saturday', label: language === 'fr' ? 'Samedi' : language === 'en' ? 'Saturday' : 'Sábado' },
                    { key: 'sunday', label: language === 'fr' ? 'Dimanche' : language === 'en' ? 'Sunday' : 'Domingo' }
                  ].map((day) => {
                    const isToday = day.key === currentDayKey;
                    return (
                      <div
                        key={day.key}
                        className={`rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} relative`}
                      >
                        {/* Bordure grise en haut pour le jour actuel */}
                        {isToday && (
                          <div className="absolute top-0 left-0 right-0 h-1 bg-stone-400 rounded-t-2xl" />
                        )}
                        <div className="p-4">
                          <h3 className="font-bold text-sm mb-3">{day.label}</h3>
                          <div className="space-y-2">
                      {weeklyTasks[day.key as keyof typeof weeklyTasks]?.length === 0 ? (
                        <p className="text-xs text-stone-400 text-center py-2">
                          {language === 'fr' ? 'Aucune tâche' : language === 'en' ? 'No tasks' : 'Sin tareas'}
                        </p>
                      ) : (
                        weeklyTasks[day.key as keyof typeof weeklyTasks]?.map((task) => (
                          <div
                            key={task.id}
                            className={`flex items-start gap-2 p-2 rounded-lg text-xs ${
                              theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50'
                            }`}
                          >
                            <button
                              onClick={() => {
                                setWeeklyTasks({
                                  ...weeklyTasks,
                                  [day.key]: weeklyTasks[day.key as keyof typeof weeklyTasks].map(t =>
                                    t.id === task.id ? { ...t, completed: !t.completed } : t
                                  )
                                });
                              }}
                              className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center mt-0.5 transition-all ${
                                task.completed
                                  ? 'bg-black border-transparent'
                                  : 'border-stone-300 dark:border-stone-600'
                              }`}
                            >
                              {task.completed && <Check className="w-3 h-3 text-white" />}
                            </button>
                            <span className={`flex-1 ${task.completed ? 'line-through text-stone-500' : ''}`}>
                              {task.text}
                            </span>
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
              onAddGloweeTasks={(tasks: Array<{day: string, task: string, priority: string, category: string}>) => {
                // Convertir les tâches de l'API en format du Planning
                const updatedTasks = { ...gloweeWeeklyTasks };

                tasks.forEach(task => {
                  const newTask = {
                    id: `glowee_${Date.now()}_${Math.random()}`,
                    text: task.task,
                    completed: false
                  };

                  if (updatedTasks[task.day as keyof typeof updatedTasks]) {
                    updatedTasks[task.day as keyof typeof updatedTasks] = [
                      ...updatedTasks[task.day as keyof typeof updatedTasks],
                      newTask
                    ];
                  }
                });

                setGloweeWeeklyTasks(updatedTasks);

                // Afficher un message de confirmation
                alert(language === 'fr'
                  ? `${tasks.length} tâches ajoutées dans Glowee tâches ! 🎉`
                  : language === 'en'
                  ? `${tasks.length} tasks added to Glowee tasks! 🎉`
                  : `¡${tasks.length} tareas añadidas a Tareas Glowee! 🎉`
                );

                // Rediriger vers Planning
                setCurrentView('routine');
                setPlanningTab('glowee-tasks');
              }}
            />
          </div>
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
                    <span className="text-xl">🦋</span>
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
                    {newMePillars.map((habit) => {
                      const isChecked = newMeProgress[newMeCurrentDay]?.[habit.id.toString()] || false;

                      return (
                        <Card
                          key={habit.id}
                          className={`border-none shadow-md cursor-pointer transition-all hover:scale-105 ${
                            theme === 'dark' ? 'bg-stone-900' : 'bg-white'
                          }`}
                          onClick={() => {
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
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                                {isChecked ? (
                                  <div className="w-6 h-6 rounded-full bg-rose-400 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-full border-2 border-stone-300 dark:border-stone-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{habit.icon}</span>
                                  <h3 className={`font-semibold text-sm ${isChecked ? 'line-through' : ''}`}>{habit.title[language]}</h3>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedHabit(habit);
                                }}
                                className="flex-shrink-0 p-1.5 rounded-full transition-colors hover:bg-stone-200 dark:hover:bg-stone-700"
                              >
                                <ChevronRight className="w-4 h-4 text-stone-400" />
                              </button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
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
                          // Sinon, on coche tout
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
                          { condition: completedDays >= 30, icon: '🦋', title: t.newMe.badgeComplete, desc: t.newMe.badgeCompleteDesc },
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
                          <div className="text-3xl">🦋</div>
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

        {/* Bonus View */}
        {currentView === 'bonus' && (
          <div className="p-6 space-y-6 max-w-lg mx-auto pb-24">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentView('dashboard')}
              >
                <X className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold">{t.bonus.title}</h1>
            </div>

            {/* Indicateur de progression global */}
            <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
              <CardContent className="p-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Award className="w-4 h-4 text-purple-500" />
                      {t.bonus.globalProgress}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {(() => {
                        const totalWeeks = bonusSections.length * 4; // 3 sections × 4 semaines
                        const completedWeeks = bonusSections.reduce((acc, section) =>
                          acc + getSectionWeeklyCompletion(section.id), 0
                        );
                        const checklistsTotal = checklistsData.length;
                        const checklistsCompleted = bonusProgress.checklistsCompleted.length;
                        const guideTotal = softLifeGuide.steps.length;
                        const guideCompleted = bonusProgress.miniGuideStepsCompleted.length;
                        const total = totalWeeks + checklistsTotal + guideTotal;
                        const completed = completedWeeks + checklistsCompleted + guideCompleted;
                        return `${completed} / ${total}`;
                      })()}
                    </Badge>
                  </div>
                  <Progress
                    value={(() => {
                      const totalWeeks = bonusSections.length * 4;
                      const completedWeeks = bonusSections.reduce((acc, section) =>
                        acc + getSectionWeeklyCompletion(section.id), 0
                      );
                      const checklistsTotal = checklistsData.length;
                      const checklistsCompleted = bonusProgress.checklistsCompleted.length;
                      const guideTotal = softLifeGuide.steps.length;
                      const guideCompleted = bonusProgress.miniGuideStepsCompleted.length;
                      const total = totalWeeks + checklistsTotal + guideTotal;
                      const completed = completedWeeks + checklistsCompleted + guideCompleted;
                      return (completed / total) * 100;
                    })()}
                    className="h-3"
                  />
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className={`p-2 rounded-lg text-center ${theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50'}`}>
                      <p className="font-semibold text-green-500">
                        {bonusSections.reduce((acc, section) => acc + getSectionWeeklyCompletion(section.id), 0)} / {bonusSections.length * 4}
                      </p>
                      <p className="text-stone-500 dark:text-stone-400">
                        {t.bonus.weeks}
                      </p>
                    </div>
                    <div className={`p-2 rounded-lg text-center ${theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50'}`}>
                      <p className="font-semibold text-blue-500">
                        {bonusProgress.checklistsCompleted.length} / {checklistsData.length}
                      </p>
                      <p className="text-stone-500 dark:text-stone-400">{t.bonus.checklists}</p>
                    </div>
                    <div className={`p-2 rounded-lg text-center ${theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50'}`}>
                      <p className="font-semibold text-amber-500">
                        {bonusProgress.miniGuideStepsCompleted.length} / {softLifeGuide.steps.length}
                      </p>
                      <p className="text-stone-500 dark:text-stone-400">
                        {t.bonus.guide}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sections Bonus Principales */}
            <div className="space-y-3">
              {bonusSections.map((section) => {
                const weeklyCompletion = getSectionWeeklyCompletion(section.id);
                return (
                  <Card
                    key={section.id}
                    onClick={() => setSelectedBonusSection(section)}
                    className={`border-none shadow-lg cursor-pointer hover:scale-[1.02] transition-transform bg-gradient-to-r ${section.color}`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        <div className={`text-3xl ${section.iconColor} flex-shrink-0`}>
                          {section.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-base">{section.title}</h3>
                            {weeklyCompletion > 0 && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {weeklyCompletion}/4
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-stone-600 dark:text-stone-400">{section.description}</p>
                          <p className="text-xs text-stone-500 dark:text-stone-500 mt-1 italic">{section.duration}</p>
                          {weeklyCompletion > 0 && (
                            <div className="mt-2">
                              <Progress value={(weeklyCompletion / 4) * 100} className="h-1.5" />
                            </div>
                          )}
                        </div>
                        <ChevronRight className={`w-5 h-5 ${section.iconColor} flex-shrink-0`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Affirmations Écrites */}
            <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  {t.bonus.affirmations}
                </CardTitle>
                <CardDescription>{t.bonus.arsenalPositive}</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {bonusAffirmations.map((affirmation, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50'}`}
                      >
                        <p className="text-sm">✨ {affirmation}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Checklists */}
            <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-blue-400" />
                  {t.bonus.checklists}
                </CardTitle>
                <CardDescription>{t.bonus.practicalGuides}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {checklistsData.map((checklist) => {
                  const isCompleted = bonusProgress.checklistsCompleted.includes(checklist.id);
                  return (
                    <div
                      key={checklist.id}
                      className="space-y-2"
                    >
                      <div
                        onClick={() => setSelectedChecklist(checklist)}
                        className={`flex items-center justify-between p-4 rounded-xl cursor-pointer hover:scale-105 transition-transform ${
                          isCompleted
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500'
                            : 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                            isCompleted ? 'bg-green-100 dark:bg-green-800' : 'bg-blue-100 dark:bg-blue-800'
                          }`}>
                            {checklist.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{checklist.title}</p>
                            <p className="text-xs text-stone-500 dark:text-stone-500">{checklist.items.length} {t.bonus.steps}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleChecklistCompleted(checklist.id);
                            }}
                            className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                              isCompleted
                                ? 'bg-green-500 text-white'
                                : 'bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600'
                            }`}
                          >
                            {isCompleted && <Check className="w-4 h-4" />}
                          </div>
                          <ChevronRight className={`w-5 h-5 ${isCompleted ? 'text-green-400' : 'text-blue-400'}`} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Mini-Guide Soft Life */}
            <Card
              onClick={() => setShowSoftLifeGuide(true)}
              className={`border-none shadow-lg cursor-pointer hover:scale-105 transition-transform ${theme === 'dark' ? 'bg-gradient-to-br from-amber-900/30 to-orange-900/30' : 'bg-gradient-to-br from-amber-50 to-orange-50'}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-amber-400" />
                  {t.bonus.miniGuide}
                </CardTitle>
                <CardDescription>{t.bonus.softLifeSteps}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    {t.bonus.discoverSoftLife}
                  </p>
                  <ChevronRight className="w-5 h-5 text-amber-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings View */}
        {currentView === 'settings' && (
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
              <h1 className="text-2xl font-bold">{t.settings.title}</h1>
            </div>

            {/* Progress Overview */}
            <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-gradient-to-br from-rose-900/30 to-pink-900/30' : 'bg-gradient-to-br from-rose-50 to-pink-50'}`}>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-rose-400" />
                  {t.dashboard.progress}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600 dark:text-stone-400">{t.dashboard.daysCompleted}</span>
                    <span className="font-semibold">{challengeProgress.completedDays.length} / 30</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600 dark:text-stone-400">
                      {t.settings.percentage}
                    </span>
                    <span className="font-semibold text-rose-500">{progressPercentage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600 dark:text-stone-400">{t.journal.title}</span>
                    <span className="font-semibold">
                      {journalEntries.length} {t.journal.entries}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600 dark:text-stone-400">{t.visionBoard.title}</span>
                    <span className="font-semibold">
                      {visionBoardImages.length} {t.visionBoard.images}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Theme Toggle */}
            <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle>{t.settings.theme}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl bg-stone-50 dark:bg-stone-800">
                  <div className="flex items-center gap-3">
                    {theme === 'light' ? (
                      <Sun className="w-6 h-6 text-amber-400" />
                    ) : (
                      <Moon className="w-6 h-6 text-purple-400" />
                    )}
                    <div>
                      <p className="font-semibold">
                        {theme === 'light' ? t.settings.light : t.settings.dark}
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-500">
                        {t.settings.changeAppearance}
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

            {/* Notifications */}
            <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle>{t.settings.notifications}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl bg-stone-50 dark:bg-stone-800">
                  <div className="flex items-center gap-3">
                    {notificationsEnabled ? (
                      <Bell className="w-6 h-6 text-rose-400" />
                    ) : (
                      <BellOff className="w-6 h-6 text-stone-400" />
                    )}
                    <div>
                      <p className="font-semibold">{t.settings.notifications}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-500">
                        {notificationsEnabled ? t.settings.enabled : t.settings.disabled}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Language Selection */}
            <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle>{t.settings.language}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
                          ? 'border-stone-800 bg-stone-800 hover:border-stone-700'
                          : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="font-semibold">{lang.name}</span>
                      </div>
                      {language === lang.code && (
                        <Check className="w-5 h-5 text-rose-500" />
                      )}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Export Data */}
            <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle>{t.settings.export}</CardTitle>
                <CardDescription>{t.settings.downloadData}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    const data = {
                      journal: journalEntries,
                      trackers,
                      routine,
                      visionBoardImages,
                      challengeProgress
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `glow-up-export-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                  }}
                >
                  <Download className="mr-2 w-4 h-4" />
                  Exporter toutes les données
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 ${theme === 'dark' ? 'bg-stone-900/95 border-t border-stone-800' : 'bg-white/95 border-t border-stone-200'} backdrop-blur-sm safe-area-pb`}>
        <div className="flex items-center justify-around max-w-lg mx-auto">
          <Button
            variant="ghost"
            className={`flex-1 h-16 flex-col gap-1 rounded-none ${currentView === 'dashboard' ? 'text-rose-500' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">{t.nav.home}</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 h-16 flex-col gap-1 rounded-none ${currentView === 'routine' ? 'text-rose-500' : ''}`}
            onClick={() => setCurrentView('routine')}
          >
            <Layers className="w-6 h-6" />
            <span className="text-xs">
              {language === 'fr' ? 'Planning' : language === 'en' ? 'Planning' : 'Planificación'}
            </span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 h-16 flex-col gap-1 rounded-none ${showGloweeChat ? 'text-rose-500' : ''}`}
            onClick={() => setShowGloweeChat(true)}
          >
            <img
              src="/Glowee/glowee-nav-bar.webp"
              alt="Glowee"
              className="w-8 h-8 object-contain"
            />
            <span className="text-xs">{t.nav.glowee}</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 h-16 flex-col gap-1 rounded-none ${currentView === 'trackers' ? 'text-rose-500' : ''}`}
            onClick={() => setCurrentView('trackers')}
          >
            <Target className="w-6 h-6" />
            <span className="text-xs">{t.nav.trackers}</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 h-16 flex-col gap-1 rounded-none ${currentView === 'settings' ? 'text-rose-500' : ''}`}
            onClick={() => setCurrentView('settings')}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs">{t.nav.settings}</span>
          </Button>
        </div>
      </nav>

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

      {/* Drawer New Me Habit Details */}
      <Drawer open={!!selectedHabit} onOpenChange={(open) => !open && setSelectedHabit(null)}>
        <DrawerContent className="max-w-lg mx-auto">
          <DrawerHeader className={`border-b ${theme === 'dark' ? 'bg-rose-400/20 border-stone-800' : 'bg-rose-400/10 border-stone-200'}`}>
            <div className="flex items-center gap-3">
              <div className="text-4xl">{selectedHabit?.icon}</div>
              <div className="flex-1 text-left">
                <DrawerTitle className="text-lg">{selectedHabit?.title[language]}</DrawerTitle>
                <DrawerDescription className="text-xs">{selectedHabit?.shortDescription[language]}</DrawerDescription>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
            {/* Detailed Explanation */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                {language === 'fr' ? 'Pourquoi c\'est important' : language === 'en' ? 'Why it\'s important' : 'Por qué es importante'}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                {selectedHabit?.detailedExplanation[language]}
              </p>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-rose-400" />
                {language === 'fr' ? 'Les bénéfices' : language === 'en' ? 'The benefits' : 'Los beneficios'}
              </h3>
              <div className="space-y-2">
                {selectedHabit?.benefits[language].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-stone-600 dark:text-stone-400">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Glowee Message */}
            {selectedHabit?.gloweeMessage && (
              <Card className={`border-none ${theme === 'dark' ? 'bg-rose-400/20' : 'bg-rose-400/10'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🦋</div>
                    <div>
                      <p className="text-xs font-semibold text-rose-400 mb-1">
                        {language === 'fr' ? 'Message de Glowee' : language === 'en' ? 'Message from Glowee' : 'Mensaje de Glowee'}
                      </p>
                      <p className="text-sm italic text-stone-700 dark:text-stone-300">
                        {selectedHabit.gloweeMessage[language]}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                {(selectedBonusSection.id === 'petits-succes' || selectedBonusSection.id === 'question-soir' || selectedBonusSection.id === 'limites-paix') && (
                  <div className="border-t-2 border-dashed border-stone-300 dark:border-stone-700 my-6"></div>
                )}

                {/* Composants de suivi pour les 3 sections spécifiques */}
                {selectedBonusSection.id === 'petits-succes' && <SmallWins />}
                {selectedBonusSection.id === 'question-soir' && <EveningQuestion />}
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

      {/* Challenge Switch Drawer */}
      <Drawer open={showChallengeDrawer} onOpenChange={setShowChallengeDrawer}>
        <DrawerContent className={`max-w-lg mx-auto ${theme === 'dark' ? 'bg-stone-900 border-stone-800' : 'bg-white'}`}>
          <DrawerHeader className="border-b">
            <DrawerTitle className="text-center text-xl">
              {language === 'fr' ? 'Choisir un challenge' : language === 'en' ? 'Choose a challenge' : 'Elegir un desafío'}
            </DrawerTitle>
            <DrawerDescription className="text-center">
              {language === 'fr' ? 'Sélectionne le challenge que tu veux suivre' : language === 'en' ? 'Select the challenge you want to follow' : 'Selecciona el desafío que quieres seguir'}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-6 space-y-4">
            {/* Mind & Life Option */}
            <button
              onClick={() => {
                setSelectedChallenge('mind-life');
                setShowChallengeDrawer(false);
              }}
              className={`w-full p-6 rounded-2xl border-2 transition-all hover:scale-[1.02] ${
                selectedChallenge === 'mind-life'
                  ? theme === 'dark'
                    ? 'border-green-700 bg-gradient-to-br from-green-900/30 to-emerald-900/30'
                    : 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50'
                  : theme === 'dark'
                    ? 'border-stone-800 bg-gradient-to-br from-green-900/10 to-emerald-900/10 hover:border-green-700'
                    : 'border-stone-200 bg-gradient-to-br from-green-50/50 to-emerald-50/50 hover:border-green-400'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-5xl">🌱</span>
                <div className="flex-1 text-left">
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {t.challengeSelection.mindLifeTitle}
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    {t.challengeSelection.mindLifeDesc}
                  </p>
                  {selectedChallenge === 'mind-life' && (
                    <div className="mt-3 flex items-center gap-2 text-green-600 dark:text-green-400">
                      <Check className="w-5 h-5" />
                      <span className="text-sm font-semibold">
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
              className={`w-full p-6 rounded-2xl border-2 transition-all hover:scale-[1.02] ${
                selectedChallenge === 'beauty-body'
                  ? theme === 'dark'
                    ? 'border-pink-700 bg-gradient-to-br from-pink-900/30 to-purple-900/30'
                    : 'border-pink-400 bg-gradient-to-br from-pink-50 to-purple-50'
                  : theme === 'dark'
                    ? 'border-stone-800 bg-gradient-to-br from-pink-900/10 to-purple-900/10 hover:border-pink-700'
                    : 'border-stone-200 bg-gradient-to-br from-pink-50/50 to-purple-50/50 hover:border-pink-400'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-5xl">💄</span>
                <div className="flex-1 text-left">
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    {t.challengeSelection.beautyBodyTitle}
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    {t.challengeSelection.beautyBodyDesc}
                  </p>
                  {selectedChallenge === 'beauty-body' && (
                    <div className="mt-3 flex items-center gap-2 text-pink-600 dark:text-pink-400">
                      <Check className="w-5 h-5" />
                      <span className="text-sm font-semibold">
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
    </div>
  );
}
