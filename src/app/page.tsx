'use client';

import { useEffect, useState, useMemo } from 'react';
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
import { beautyPillars, beautyChoices, gloweeMessages as beautyGloweeMessages } from '@/lib/beauty-pillars';
import { Sparkles, BookOpen, TrendingUp, Home, Heart, Target, Layers, Gift, Settings, ChevronRight, ChevronLeft, ChevronDown, Check, Plus, X, Minus, Calendar, Moon, Sun, Droplet, Zap, Smile, Activity, Utensils, Lightbulb, Image as ImageIcon, Trash2, Download, Bell, BellOff, Star, CheckSquare, ListChecks, Award, Globe, LogIn, LogOut, User, Crown, Shield, Frown, Meh } from 'lucide-react';
import { useTranslation } from '@/lib/useTranslation';
import { Language } from '@/lib/translations';
import { useAuth } from '@/contexts/AuthContext';
import '@/lib/firebase/admin-utils'; // Import admin utilities for console access
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
import GloweePopup from '@/components/shared/GloweePopup';
import { GloweeHourlyMessage } from '@/components/GloweeHourlyMessage';
import { markWelcomeSeen, markPresentationSeen, hasPresentationBeenSeen } from '@/utils/visitTracker';
import { gloweeMessages } from '@/data/gloweeMessages';
import { TimeCapsule } from '@/components/TimeCapsule';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { FAQSection } from '@/components/settings/FAQSection';
import { usePlanningSync } from '@/hooks/useFirebaseSync';
import { saveTask, deleteTask as deleteTaskFromFirebase, updateTaskCompletion } from '@/lib/firebase/user-data-sync';

// Fonction utilitaire pour formater une date en YYYY-MM-DD sans problème de timezone
const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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
    canAccessApp,
    // Beauty Pillars
    beautyPillarsProgress,
    beautyValidatedDates,
    toggleBeautyPillar,
    selectBeautyChoice,
    toggleBeautySubtask,
    getBeautyProgressForDate,
    validateBeautyDate,
    // Trackers
    trackers,
    updateTracker,
    getTrackerByDate
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
  const [subscriptionSource, setSubscriptionSource] = useState<'button' | 'trial_expired'>('trial_expired');

  // États pour les popups Glowee
  const [showGloweeWelcome, setShowGloweeWelcome] = useState(false);
  const [showGloweeFifthVisit, setShowGloweeFifthVisit] = useState(false);
  const [showGloweePlanningWelcome, setShowGloweePlanningWelcome] = useState(false);

  // États pour le message Glowee avec effet typing et rotation toutes les 10 minutes
  const [gloweeMessageIndex, setGloweeMessageIndex] = useState(0);
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [hasShownFirstMessage, setHasShownFirstMessage] = useState(false);

  // État pour le dialogue d'authentification
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // État pour les actions en cours de disparition (effet avant tri)
  const [fadingActions, setFadingActions] = useState<Set<string>>(new Set());

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

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'myGoals' && e.newValue) {
        setGoals(JSON.parse(e.newValue));
      }
    };

    // Écouter les changements de localStorage (entre onglets uniquement)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isHydrated]);

  const [todayDate] = useState(() => getLocalDateString());

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

  // États pour Beauty Pillars (Challenge Beauté et Corps)
  const [beautySelectedDate, setBeautySelectedDate] = useState<string>(getLocalDateString(new Date()));
  const [beautyChoiceExpanded, setBeautyChoiceExpanded] = useState(false);
  const [beautyGloweeMessageIndex, setBeautyGloweeMessageIndex] = useState(0);
  const [beautyGloweeDisplayedMessage, setBeautyGloweeDisplayedMessage] = useState('');
  const [beautyGloweeIsTyping, setBeautyGloweeIsTyping] = useState(true);
  const [beautyHasShownFirstMessage, setBeautyHasShownFirstMessage] = useState(false);
  const [showBeautyStreakPopup, setShowBeautyStreakPopup] = useState(false);
  const [showBeautyIncompletePopup, setShowBeautyIncompletePopup] = useState(false);

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

  // New Me habits - 9 predefined habits with completion tracking
  const [newMeHabits, setNewMeHabits] = useState<Array<{
    id: string;
    icon: string;
    label: string;
    completed: boolean;
  }>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`newMeHabits_${getLocalDateString()}`);
      if (saved) return JSON.parse(saved);
    }
    return [
      { id: 'water', icon: '💧', label: 'Boire 1,5–2 L d\'eau', completed: false },
      { id: 'move', icon: '🏃', label: 'Bouger 20–30 min', completed: false },
      { id: 'positive', icon: '✍️', label: 'Écrire une pensée positive', completed: false },
      { id: 'win', icon: '🏆', label: 'Noter une petite victoire', completed: false },
      { id: 'tidy', icon: '🧹', label: 'Ranger mon espace 5 min', completed: false },
      { id: 'future', icon: '🚀', label: 'Faire une action pour mon futur', completed: false },
      { id: 'priority', icon: '🎯', label: 'Définir une priorité du jour', completed: false },
      { id: 'imperfect', icon: '✓', label: 'Accomplir une tâche imparfaite', completed: false },
      { id: 'bed', icon: '🌙', label: 'Me coucher en me disant : « J\'ai avancé. »', completed: false }
    ];
  });

  // Save New Me habits to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`newMeHabits_${getLocalDateString()}`, JSON.stringify(newMeHabits));
    }
  }, [newMeHabits]);

  // Bloc par défaut unique et non-modifiable
  const getDefaultHabitBlocks = () => [
    {
      id: 'essential-today',
      name: language === 'fr' ? 'Habitudes - Glow Up' : language === 'en' ? 'Habits - Glow Up' : 'Hábitos - Glow Up',
      icon: '✨',
      color: 'from-white to-gray-50',
      description: '',
      habits: [
        { id: 'water', label: language === 'fr' ? 'Boire 1,5–2 L d\'eau' : language === 'en' ? 'Drink 1.5–2 L of water' : 'Beber 1,5–2 L de agua', completed: false },
        { id: 'move', label: language === 'fr' ? 'Bouger 20–30 min (marche, sport, étirements)' : language === 'en' ? 'Move 20–30 min (walk, sport, stretching)' : 'Moverse 20–30 min (caminar, deporte, estiramientos)', completed: false },
        { id: 'positive-thought', label: language === 'fr' ? 'Écrire une pensée positive sur moi' : language === 'en' ? 'Write a positive thought about myself' : 'Escribir un pensamiento positivo sobre mí', completed: false },
        { id: 'daily-win', label: language === 'fr' ? 'Noter une petite victoire' : language === 'en' ? 'Note a small win' : 'Anotar una pequeña victoria', completed: false },
        { id: 'clean-space', label: language === 'fr' ? 'Ranger mon espace 5 minutes' : language === 'en' ? 'Tidy my space 5 minutes' : 'Ordenar mi espacio 5 minutos', completed: false },
        { id: 'future-action', label: language === 'fr' ? 'Faire une action utile pour mon futur' : language === 'en' ? 'Do a useful action for my future' : 'Hacer una acción útil para mi futuro', completed: false },
        { id: 'daily-priority', label: language === 'fr' ? 'Définir une priorité du jour' : language === 'en' ? 'Define a priority of the day' : 'Definir una prioridad del día', completed: false },
        { id: 'imperfect-task', label: language === 'fr' ? 'Accomplir une tâche même imparfaite' : language === 'en' ? 'Complete a task even if imperfect' : 'Completar una tarea aunque sea imperfecta', completed: false },
        { id: 'progress-check', label: language === 'fr' ? 'Me coucher en me disant : « J\'ai avancé. »' : language === 'en' ? 'Go to bed saying: "I made progress."' : 'Acostarme diciéndome: "Avancé."', completed: false }
      ],
      collapsed: false,
      isDefault: true // Marquer comme bloc par défaut non-supprimable
    }
  ];

  const [habitBlocks, setHabitBlocks] = useState<Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
    description?: string;
    habits: Array<{id: string, label: string, completed: boolean}>;
    collapsed: boolean;
    isDefault?: boolean; // Marquer les blocs non-supprimables
  }>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('habitBlocks');
      return saved ? JSON.parse(saved) : getDefaultHabitBlocks();
    }
    return getDefaultHabitBlocks();
  });

  const [showCreateBlock, setShowCreateBlock] = useState(false);
  const [newBlockName, setNewBlockName] = useState('');
  const [newBlockIcon, setNewBlockIcon] = useState('📝');
  const [newBlockColor, setNewBlockColor] = useState('from-blue-100 to-indigo-100');
  const [habitTab, setHabitTab] = useState<'tasks' | 'growth'>('tasks');
  // Mode liste fixe pour le bloc par défaut (non modifiable)
  const habitGridMode = 'list' as const;

  // États pour l'ajout de nouvelles habitudes dans les blocs
  const [addingHabitToBlock, setAddingHabitToBlock] = useState<string | null>(null);
  const [newBlockHabitLabel, setNewBlockHabitLabel] = useState('');

  // Fonction pour calculer le suivi quotidien d'un bloc
  const getBlockProgress = (block: typeof habitBlocks[0]) => {
    if (block.habits.length === 0) return 0;
    const completed = block.habits.filter(h => h.completed).length;
    return Math.round((completed / block.habits.length) * 100);
  };

  // Données pour les intentions et humeurs
  const INTENTIONS_DATA = [
    { id: 'respect', fr: 'se respecte', en: 'respects themselves', es: 'se respeta' },
    { id: 'advance', fr: 'avance même lentement', en: 'moves forward slowly', es: 'avanza aunque sea lentamente' },
    { id: 'energy', fr: 'prend soin de son énergie', en: 'takes care of energy', es: 'cuida su energía' },
    { id: 'word', fr: 'tient parole', en: 'keeps their word', es: 'cumple su palabra' },
  ];

  const INTENTION_MESSAGES = [
    'Tu t\'engages envers toi.',
    'Tu honores cette intention.',
    'Alignement confirmé.',
    'C\'est assumé.',
    'Tu avances avec ça.',
  ];

  const MOODS_DATA = [
    { id: 'calm', fr: 'Calme', en: 'Calm', es: 'Tranquilo', icon: Sun, color: '#0ea5e9', bgColor: 'bg-sky-100', textColor: 'text-sky-700' },
    { id: 'tired', fr: 'Fatigué', en: 'Tired', es: 'Cansado', icon: Moon, color: '#6b7280', bgColor: 'bg-gray-100', textColor: 'text-gray-700' },
    { id: 'proud', fr: 'Fier', en: 'Proud', es: 'Orgulloso', icon: Sparkles, color: '#f59e0b', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
    { id: 'sad', fr: 'Triste', en: 'Sad', es: 'Triste', icon: Frown, color: '#6366f1', bgColor: 'bg-indigo-100', textColor: 'text-indigo-700' },
    { id: 'neutral', fr: 'Neutre', en: 'Neutral', es: 'Neutral', icon: Meh, color: '#14b8a6', bgColor: 'bg-teal-100', textColor: 'text-teal-700' },
  ];

  // États pour "Comment je me sens ?" et "Intention du jour"
  const [dailyFeeling, setDailyFeeling] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`dailyFeeling_${getLocalDateString()}`);
      return saved || null;
    }
    return null;
  });

  const [dailyIntention, setDailyIntention] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`dailyIntention_${getLocalDateString()}`);
      return saved || null;
    }
    return null;
  });

  const [showIntentionFeedback, setShowIntentionFeedback] = useState(false);
  const [intentionFeedbackMessage, setIntentionFeedbackMessage] = useState('');

  // Sauvegarder habitBlocks dans localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('habitBlocks', JSON.stringify(habitBlocks));
    }
  }, [habitBlocks]);

  // Sauvegarder dailyFeeling dans localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && dailyFeeling) {
      localStorage.setItem(`dailyFeeling_${getLocalDateString()}`, dailyFeeling);
    }
  }, [dailyFeeling]);

  // Sauvegarder dailyIntention dans localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && dailyIntention) {
      localStorage.setItem(`dailyIntention_${getLocalDateString()}`, dailyIntention);
    }
  }, [dailyIntention]);

  // États pour Planning
  // Planning tab is now simplified to only 'my-tasks'
  const planningTab = 'my-tasks';
  const [selectedDate, setSelectedDate] = useState<string>(getLocalDateString());

  // États pour TimeCapsule (Message à moi)
  const [showTimeCapsuleCard, setShowTimeCapsuleCard] = useState(false);
  const [timeCapsuleExpanded, setTimeCapsuleExpanded] = useState(false);

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

  // Synchronisation Firebase pour les tâches du planning
  usePlanningSync(tasksWithDates, setTasksWithDates);

  // Navigation par semaine
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0 = semaine actuelle, 1 = semaine prochaine, etc.

  // Objectifs avec leurs priorités
  const [goalsWithPriorities, setGoalsWithPriorities] = useState<Array<{
    id: string;
    name: string;
    color: string;
    weeklyPriorities: Array<{id: string, text: string, completed: boolean}>;
  }>>([]);

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDestination, setNewTaskDestination] = useState<'priority' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>('priority');
  const [newTaskColor, setNewTaskColor] = useState<string | null>(null); // Couleur associée à un objectif
  const [newTaskGoalId, setNewTaskGoalId] = useState<string | null>(null); // ID de l'objectif associé
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDeleteTaskConfirm, setShowDeleteTaskConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{id: string, day: string, type: 'priority' | 'task'} | null>(null);

  // États pour l'installation PWA (Android uniquement)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  // Hydratation du store - évite les problèmes d'hydratation SSR/CSR
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Gestion de l'installation PWA pour Android
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Détecter si l'utilisateur est sur Android
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroidDevice = userAgent.includes('android');
    setIsAndroid(isAndroidDevice);

    // Vérifier si l'app est déjà installée (mode standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true;

    if (isStandalone) {
      setShowInstallButton(false);
      return;
    }

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Afficher le bouton uniquement sur Android
      if (isAndroidDevice) {
        setShowInstallButton(true);
      }
    };

    // Écouter quand l'app est installée
    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
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
        setSubscriptionSource('trial_expired');
        setShowSubscription(true);
      }
    }
  }, [isHydrated, initializeFirstOpen, getRemainingFreeDays, isTrialExpired, subscription]);

  // Rouvrir le popup d'abonnement après l'inscription si nécessaire
  useEffect(() => {
    if (user && shouldReopenSubscription) {
      // L'utilisateur vient de se connecter et on doit rouvrir le popup
      setShouldReopenSubscription(false);
      setSubscriptionSource('trial_expired');
      setShowSubscription(true);
    }
  }, [user, shouldReopenSubscription]);

  // Animation de switch pour TimeCapsule (Message à moi)
  // 3s cartes normales, 20s Message à moi - s'arrête si premium ou si expanded
  useEffect(() => {
    if (subscription.isSubscribed) {
      // Si premium, afficher toujours la carte Message à moi (statique)
      setShowTimeCapsuleCard(true);
      return;
    }

    // Si le slide est ouvert, ne pas faire de switch
    if (timeCapsuleExpanded) {
      return;
    }

    // Animation de switch pour les non-premium
    let timeoutId: NodeJS.Timeout;

    const runAnimation = () => {
      // Afficher les cartes normales pendant 3s
      setShowTimeCapsuleCard(false);
      timeoutId = setTimeout(() => {
        // Afficher Message à moi pendant 20s (10s de plus qu'avant)
        setShowTimeCapsuleCard(true);
        timeoutId = setTimeout(() => {
          // Recommencer le cycle seulement si pas expanded
          if (!timeCapsuleExpanded) {
            runAnimation();
          }
        }, 20000);
      }, 3000);
    };

    runAnimation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [subscription.isSubscribed, timeCapsuleExpanded]);

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
    }
  }, [isHydrated, hasStarted, currentView]);
  */

  // Messages Glowee avec effet typing et rotation toutes les 10 minutes
  const gloweeHomepageMessages = {
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

  // Effet typing pour le premier message
  useEffect(() => {
    if (!isHydrated) return;

    const langMessages = gloweeHomepageMessages[language] || gloweeHomepageMessages.fr;
    const currentMessage = langMessages[gloweeMessageIndex % langMessages.length];

    // Vérifier si c'est la première apparition
    const hasShownTyping = localStorage.getItem('gloweeTypingShown');

    if (!hasShownTyping && !hasShownFirstMessage) {
      // Effet typing pour la première fois
      setIsTyping(true);
      let charIndex = 0;
      setDisplayedMessage('');

      const typingInterval = setInterval(() => {
        if (charIndex < currentMessage.length) {
          setDisplayedMessage(currentMessage.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          setHasShownFirstMessage(true);
          localStorage.setItem('gloweeTypingShown', 'true');
        }
      }, 30);

      return () => clearInterval(typingInterval);
    } else {
      // Pas d'effet typing pour les messages suivants
      setDisplayedMessage(currentMessage);
      setIsTyping(false);
    }
  }, [isHydrated, gloweeMessageIndex, language, hasShownFirstMessage]);

  // Rotation des messages toutes les 10 minutes
  useEffect(() => {
    if (!isHydrated) return;

    const interval = setInterval(() => {
      setGloweeMessageIndex(prev => prev + 1);
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [isHydrated]);

  // Effet typing pour la Glowee du challenge beauté
  useEffect(() => {
    if (!isHydrated) return;

    const langMessages = beautyGloweeMessages[language] || beautyGloweeMessages.fr;
    const currentMessage = langMessages[beautyGloweeMessageIndex % langMessages.length];

    const hasShownTyping = localStorage.getItem('beautyGloweeTypingShown');

    if (!hasShownTyping && !beautyHasShownFirstMessage) {
      setBeautyGloweeIsTyping(true);
      let charIndex = 0;
      setBeautyGloweeDisplayedMessage('');

      const typingInterval = setInterval(() => {
        if (charIndex < currentMessage.length) {
          setBeautyGloweeDisplayedMessage(currentMessage.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setBeautyGloweeIsTyping(false);
          setBeautyHasShownFirstMessage(true);
          localStorage.setItem('beautyGloweeTypingShown', 'true');
        }
      }, 30);

      return () => clearInterval(typingInterval);
    } else {
      setBeautyGloweeDisplayedMessage(currentMessage);
      setBeautyGloweeIsTyping(false);
    }
  }, [isHydrated, beautyGloweeMessageIndex, language, beautyHasShownFirstMessage]);

  // Auto-fermer la popup de série après 5 secondes
  useEffect(() => {
    if (showBeautyStreakPopup) {
      const timer = setTimeout(() => {
        setShowBeautyStreakPopup(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showBeautyStreakPopup]);

  // Initialiser la date de début et calculer le jour actuel pour New Me
  useEffect(() => {
    if (isHydrated) {
      const storedStartDate = localStorage.getItem('newMeStartDate');
      if (!storedStartDate) {
        const today = getLocalDateString();
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
        const today = getLocalDateString();
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

      if (storedMyPriorities) {
        setMyWeekPriorities(JSON.parse(storedMyPriorities));
      }
      if (storedMyTasks) {
        setMyWeeklyTasks(JSON.parse(storedMyTasks));
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

  // Note: Le chargement et la sauvegarde des tâches avec dates sont maintenant gérés par usePlanningSync
  // qui charge depuis Firebase au montage et synchronise automatiquement les changements

  // Charger et sauvegarder les objectifs avec priorités
  useEffect(() => {
    if (isHydrated) {
      const savedGoalsWithPriorities = localStorage.getItem('goalsWithPriorities');
      if (savedGoalsWithPriorities) {
        setGoalsWithPriorities(JSON.parse(savedGoalsWithPriorities));
      }
    }
  }, [isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('goalsWithPriorities', JSON.stringify(goalsWithPriorities));
    }
  }, [goalsWithPriorities, isHydrated]);


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
      // Utiliser getLocalDateString pour éviter les problèmes de timezone avec toISOString()
      dates.push(getLocalDateString(date));
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

  // Variables pour les priorités et tâches de la semaine
  const weekPriorities = myWeekPriorities;
  const setWeekPriorities = setMyWeekPriorities;
  const weeklyTasks = myWeeklyTasks;
  const setWeeklyTasks = setMyWeeklyTasks;

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
  // Cette vérification s'applique à toutes les vues sauf language-selection et challenge
  // Les challenges (Beauté et Corps, Esprit et Vie) sont toujours accessibles
  const isChallengeView = currentView === 'challenge-selection' || currentView === 'dashboard' || currentView === 'challenge';
  const shouldBlockAccess = hasSelectedLanguage && !canAccessApp() && !subscription.isSubscribed && !isChallengeView;

  // Language Selection Screen - Glassmorphism Rose Pastel
  if (!hasSelectedLanguage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Logo avec Glowee */}
          <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full blur-2xl opacity-40"></div>
                <img
                  src="/Glowee/glowee-acceuillante.webp"
                  alt="Glowee"
                  className="w-40 h-40 object-contain relative z-10 drop-shadow-2xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
                {t.languageSelection.title}
              </h1>
              <p className="text-xl text-gray-700 font-medium">
                {t.languageSelection.subtitle}
              </p>
            </div>
          </div>

          {/* Language Options - Glassmorphism Cards */}
          <div className="space-y-3 animate-in slide-in-from-bottom duration-700 delay-200">
            {[
              { code: 'fr' as Language, name: 'Français', flag: '🇫🇷', gradient: 'from-pink-100 to-rose-100' },
              { code: 'en' as Language, name: 'English', flag: '🇬🇧', gradient: 'from-rose-100 to-orange-100' },
              { code: 'es' as Language, name: 'Español', flag: '🇪🇸', gradient: 'from-orange-100 to-pink-100' }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`w-full p-5 rounded-[1.5rem] transition-all duration-300 ${
                  language === lang.code
                    ? 'bg-white/90 backdrop-blur-xl border-2 border-pink-300 shadow-2xl shadow-pink-200/50 scale-105'
                    : `bg-white/60 backdrop-blur-md border border-pink-100/50 shadow-lg shadow-pink-100/30 hover:bg-white/80 hover:scale-102 hover:shadow-xl`
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${lang.gradient} flex items-center justify-center shadow-lg`}>
                      <span className="text-3xl drop-shadow-lg">{lang.flag}</span>
                    </div>
                    <span className="text-xl font-bold text-gray-800">{lang.name}</span>
                  </div>
                  {language === lang.code && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center shadow-lg">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Continue Button */}
          <Button
            onClick={() => setCurrentView('presentation')}
            className="w-full h-16 text-xl bg-gradient-to-r from-pink-400 via-rose-400 to-orange-300 hover:from-pink-500 hover:via-rose-500 hover:to-orange-400 text-white font-bold rounded-[1.5rem] shadow-2xl shadow-pink-200/50 hover:shadow-pink-300/50 hover:scale-105 transition-all animate-in slide-in-from-bottom duration-700 delay-400"
          >
            {t.languageSelection.continue}
            <ChevronRight className="ml-2 w-6 h-6" />
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
          source="trial_expired"
          onOpenAuthDialog={() => setShowAuthDialog(true)}
        />
        <AuthDialog
          isOpen={showAuthDialog}
          onClose={() => setShowAuthDialog(false)}
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

  // Onboarding Screen - Page 1: Glowee se présente - Glassmorphism
  if (!hasStarted && onboardingPage === 1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100">
        <div className="max-w-md w-full text-center space-y-10 animate-in fade-in duration-700">
          {/* Glowee Image avec effet glow */}
          <div className="flex justify-center animate-in zoom-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-rose-300 to-orange-300 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <img
                src="/Glowee/glowee-acceuillante.webp"
                alt="Glowee"
                className="w-72 h-72 object-contain relative z-10 drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Greeting Card */}
          <div className="space-y-6 animate-in slide-in-from-bottom duration-700 delay-300">
            <div className="p-8 rounded-[2rem] bg-white/80 backdrop-blur-xl border border-pink-100/50 shadow-2xl shadow-pink-200/50">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 bg-clip-text text-transparent mb-6 drop-shadow-lg">
                {t.onboarding.gloweeGreeting}
              </h1>
              <p className="text-2xl text-gray-800 font-semibold whitespace-pre-line leading-relaxed">
                {t.onboarding.gloweeIntro}
              </p>
            </div>
          </div>

          {/* Next Button */}
          <Button
            onClick={() => setOnboardingPage(2)}
            className="w-full h-16 text-xl bg-gradient-to-r from-pink-400 via-rose-400 to-orange-300 hover:from-pink-500 hover:via-rose-500 hover:to-orange-400 text-white font-bold rounded-[1.5rem] shadow-2xl shadow-pink-200/50 hover:shadow-pink-300/50 hover:scale-105 transition-all animate-in slide-in-from-bottom duration-700 delay-500"
          >
            <ChevronRight className="w-7 h-7" />
          </Button>
        </div>
      </div>
    );
  }

  // Onboarding Screen - Page 2: Message de Glowee - Glassmorphism
  if (!hasStarted && onboardingPage === 2) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100">
        <div className="max-w-md w-full text-center space-y-10 animate-in fade-in duration-700">
          {/* Glowee Image avec effet glow */}
          <div className="flex justify-center animate-in zoom-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-rose-300 to-orange-300 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <img
                src="/Glowee/glowee-acceuillante.webp"
                alt="Glowee"
                className="w-72 h-72 object-contain relative z-10 drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Message Card */}
          <div className="space-y-6 animate-in slide-in-from-bottom duration-700 delay-300">
            <div className="p-8 rounded-[2rem] bg-white/80 backdrop-blur-xl border border-pink-100/50 shadow-2xl shadow-pink-200/50">
              <p className="text-2xl md:text-3xl text-gray-800 font-semibold whitespace-pre-line leading-relaxed">
                {t.onboarding.gloweeMessage}
              </p>
            </div>
          </div>

          {/* Start Button */}
          <Button
            onClick={() => setCurrentView('challenge-selection')}
            className="w-full h-16 text-xl bg-gradient-to-r from-pink-400 via-rose-400 to-orange-300 hover:from-pink-500 hover:via-rose-500 hover:to-orange-400 text-white font-bold rounded-[1.5rem] shadow-2xl shadow-pink-200/50 hover:shadow-pink-300/50 hover:scale-105 transition-all animate-in slide-in-from-bottom duration-700 delay-500"
          >
            {t.onboarding.gloweeButton}
            <Sparkles className="ml-2 w-6 h-6" />
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
              <div className="flex items-center gap-2">
                {/* Bouton d'installation PWA - Android uniquement */}
                {showInstallButton && isAndroid && (
                  <button
                    onClick={async () => {
                      if (deferredPrompt) {
                        deferredPrompt.prompt();
                        const { outcome } = await deferredPrompt.userChoice;
                        if (outcome === 'accepted') {
                          setShowInstallButton(false);
                        }
                        setDeferredPrompt(null);
                      }
                    }}
                    className="px-3 py-2 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white text-xs font-bold shadow-lg shadow-pink-200/50 flex items-center gap-1.5 hover:shadow-xl transition-shadow"
                  >
                    <Download className="w-4 h-4" />
                    {language === 'fr' ? 'Installer' : language === 'en' ? 'Install' : 'Instalar'}
                  </button>
                )}
                <button className="w-11 h-11 rounded-full bg-white shadow-lg shadow-pink-100/50 flex items-center justify-center hover:shadow-xl transition-shadow">
                  <Bell className="w-5 h-5 text-pink-400" />
                </button>
              </div>
            </div>

            {/* Message Glowee - Style glassmorphism - Taille réduite + Glowee agrandie */}
            <div className="relative">
              <Card className="border-none shadow-xl shadow-pink-100/50 bg-white/80 backdrop-blur-md rounded-3xl overflow-visible">
                <CardContent className="p-0">
                  <div className="flex items-center gap-1.5 py-0.5 px-2 pl-20 min-h-[2px]">
                    {/* Message avec rotation et effet typing - sans mention Glowee */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-gray-700 leading-tight font-medium">
                        {displayedMessage}
                        {isTyping && <span className="animate-pulse">|</span>}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Image Glowee agrandie de 40px - positionnée à l'extérieur de la carte */}
              <div className="absolute left-0 top-1/2 -translate-y-1/3 w-[96px] h-[104px] z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 rounded-xl blur-md opacity-40"></div>
                <Image
                  src="/Glowee/glowee.webp"
                  alt="Glowee"
                  width={96}
                  height={104}
                  className="object-contain relative z-10 drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Trial Badge, Plan Pro Button, Message à moi et Challenge Switch Button */}
            <div className="relative flex items-center justify-center">
              {/* Container avec animation de switch - Centré */}
              <div className="w-full flex justify-center items-center">
                {/* Cartes normales (Trial + Plan Pro) */}
                <div
                  className={`flex items-center gap-2 transition-all duration-500 ease-in-out ${
                    showTimeCapsuleCard
                      ? 'opacity-0 -translate-y-full absolute'
                      : 'opacity-100 translate-y-0'
                  }`}
                >
                  <TrialBadge theme={theme} />
                  <button
                    onClick={() => {
                      setSubscriptionSource('button');
                      setShowSubscription(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-lg shadow-pink-200/50 hover:shadow-xl hover:scale-105 transition-all"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Plan Pro</span>
                  </button>
                </div>

                {/* Carte Message à moi - Centré */}
                <div
                  className={`w-full flex justify-center transition-all duration-500 ease-in-out ${
                    showTimeCapsuleCard
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-full absolute'
                  }`}
                >
                  <TimeCapsule
                    theme={theme}
                    isExpanded={timeCapsuleExpanded}
                    onToggle={() => setTimeCapsuleExpanded(!timeCapsuleExpanded)}
                  />
                </div>
              </div>

              {/* Bouton Challenge Switch - Position absolue fixe à droite */}
              <button
                onClick={() => setShowChallengeDrawer(true)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white shadow-lg shadow-pink-100/50 hover:shadow-xl transition-all"
              >
                <ChevronRight className="w-5 h-5 rotate-180 text-pink-400" />
              </button>
            </div>

            {/* Grande carte Challenge Mind & Life - Style glassmorphism */}
            {selectedChallenge === 'mind-life' && (
              <Card
                className="border-none shadow-2xl shadow-purple-300/60 cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-purple-200 via-pink-100 to-purple-50 rounded-[2rem] overflow-hidden relative"
                onClick={() => {
                  setCurrentDay(challengeProgress.currentDay);
                  setCurrentView('challenge');
                }}
              >
                <CardContent className="p-3 relative z-10">
                  {/* Illustration décorative 3D */}
                  <div className="absolute -top-2 -right-2 text-5xl opacity-10 drop-shadow-lg">
                    🎯
                  </div>

                  <div className="mb-1">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/60 backdrop-blur-sm mb-1.5">
                      <span className="text-xs font-bold text-purple-600">
                        {language === 'fr' ? 'Jour' : language === 'en' ? 'Day' : 'Día'} {challengeProgress.currentDay}/30
                      </span>
                    </div>
                    <h2 className="text-sm font-bold text-gray-800 mb-1.5 pr-14 line-clamp-2">
                      {getCurrentDayData()?.title || (language === 'fr' ? 'Challenge du jour' : language === 'en' ? 'Challenge of the day' : 'Desafío del día')}
                    </h2>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] px-2.5 py-0.5 rounded-full border-0 shadow-lg shadow-purple-300/50">
                      {language === 'fr' ? 'Esprit & Vie' : language === 'en' ? 'Mind & Life' : 'Mente & Vida'}
                    </Badge>
                  </div>

                  {/* Barre de progression avec style glassmorphism */}
                  <div className="space-y-1.5 mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-700">
                      <span className="font-medium">{language === 'fr' ? 'Progression' : language === 'en' ? 'Progress' : 'Progreso'}</span>
                      <span className="font-bold text-purple-600">{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/60 backdrop-blur-sm rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-lg"
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
                className="border-none shadow-2xl shadow-pink-300/60 cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-pink-200 via-rose-100 to-pink-50 rounded-[2rem] overflow-hidden relative"
                onClick={() => setCurrentView('new-me')}
              >
                <CardContent className="p-3 relative z-10">
                  <div className="absolute -top-2 -right-2 text-5xl opacity-10 drop-shadow-lg">
                    ✨
                  </div>

                  <div className="mb-1">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/60 backdrop-blur-sm mb-1.5">
                      <span className="text-xs font-bold text-pink-600">
                        {language === 'fr' ? 'Jour' : language === 'en' ? 'Day' : 'Día'} {newMeCurrentDay}/30
                      </span>
                    </div>
                    <h2 className="text-sm font-bold text-gray-800 mb-1.5 pr-14 line-clamp-2">
                      {t.newMe.subtitle}
                    </h2>
                    <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] px-2.5 py-0.5 rounded-full border-0 shadow-lg shadow-pink-300/50">
                      {language === 'fr' ? 'Beauté & Corps' : language === 'en' ? 'Beauty & Body' : 'Belleza & Cuerpo'}
                    </Badge>
                  </div>

                  {/* Barre de progression avec style glassmorphism */}
                  <div className="space-y-1.5 mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-700">
                      <span className="font-medium">{language === 'fr' ? 'Progression' : language === 'en' ? 'Progress' : 'Progreso'}</span>
                      <span className="font-bold text-pink-600">{Math.round((newMeCurrentDay / 30) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/60 backdrop-blur-sm rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500 shadow-lg"
                        style={{ width: `${(newMeCurrentDay / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Petits Succès Compact */}
            <SmallWinsCompact theme={theme} />

            {/* Grille de cartes - 2 colonnes pour Mes Habitudes et Ma semaine */}
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
                  <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-2xl">📝</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 text-center">
                      {language === 'fr' ? 'Mes Habitudes' : language === 'en' ? 'My Habits' : 'Mis Hábitos'}
                    </h3>
                  </div>
                </CardContent>
              </Card>

              {/* Ma semaine */}
              <Card
                className="border-none shadow-xl shadow-pink-100/50 bg-gradient-to-br from-pink-50 via-rose-50 to-white rounded-[1.5rem] cursor-pointer transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
                onClick={() => setCurrentView('routine')}
              >
                <CardContent className="p-4 relative overflow-hidden">
                  <div className="absolute -bottom-1 -right-1 text-4xl opacity-10 drop-shadow-lg">
                    👩‍🍳
                  </div>
                  <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Calendar className="w-6 h-6 text-pink-400" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 text-center">
                      {language === 'fr' ? 'Ma semaine' : language === 'en' ? 'My week' : 'Mi semana'}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Carte Glow Up (Bonus) - MASQUÉE */}
            {/* <Card
              className="border-none shadow-xl shadow-pink-100/50 bg-gradient-to-br from-pink-100 via-purple-50 to-orange-50 rounded-[1.5rem] cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              onClick={() => setCurrentView('bonus')}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <Gift className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-gray-800">{t.bonus.title}</h3>
                    <p className="text-[10px] text-gray-500 font-medium">
                      {language === 'fr' ? 'Routine & Guides' : language === 'en' ? 'Routine & Guides' : 'Rutina & Guías'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-pink-400" />
                </div>
              </CardContent>
            </Card> */}

            {/* Carte 8 Limites - Réduite de 40% */}
            <Card
              className="border-none shadow-lg shadow-purple-100/50 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              onClick={() => setCurrentView('boundaries')}
            >
              <CardContent className="p-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-md">
                    <Shield className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xs text-gray-800 truncate">
                      {language === 'fr' ? '8 Limites' : language === 'en' ? '8 Boundaries' : '8 Límites'}
                    </h3>
                    <p className="text-[9px] text-gray-500 font-medium truncate">
                      {language === 'fr' ? 'Pour ta paix' : language === 'en' ? 'For your peace' : 'Para tu paz'}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-purple-400 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            {/* Carte 50 choses à faire seule - MASQUÉE */}
            {/* <Card
              onClick={() => {
                const fiftyThingsSection = bonusSections.find(s => s.id === '50-choses-seule');
                if (fiftyThingsSection) {
                  setSelectedBonusSection(fiftyThingsSection);
                  setCurrentView('bonus');
                }
              }}
              className="border-none shadow-xl shadow-purple-100/50 bg-white/80 backdrop-blur-md rounded-3xl cursor-pointer transition-all duration-300 hover:scale-[1.01]"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
                    <span className="text-xl">💫</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-gray-800">{t.bonus.fiftyThingsAlone}</h3>
                    <p className="text-[10px] text-gray-500 font-medium">
                      {completedThingsAlone.length} / {fiftyThingsAlone.length} {t.bonus.completedItems}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-purple-400" />
                </div>
              </CardContent>
            </Card> */}
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
                            ].filter(Boolean)
                            // Trier: tâches non complétées en haut, complétées en bas (sauf celles en cours de disparition)
                            .sort((a, b) => {
                              const aCompleted = isActionCompleted(currentDay, a.key);
                              const bCompleted = isActionCompleted(currentDay, b.key);
                              const aFading = fadingActions.has(`${currentDay}-${a.key}`);
                              const bFading = fadingActions.has(`${currentDay}-${b.key}`);
                              // Les actions en cours de disparition restent à leur place
                              if (aFading || bFading) return 0;
                              if (aCompleted === bCompleted) return 0;
                              return aCompleted ? 1 : -1;
                            })
                            .map((action, index) => {
                              const isCompleted = isActionCompleted(currentDay, action.key);
                              const actionKey = `${currentDay}-${action.key}`;
                              const isFading = fadingActions.has(actionKey);

                              // Fonction pour gérer le clic avec effet de disparition
                              const handleActionClick = () => {
                                const wasCompleted = isActionCompleted(currentDay, action.key);

                                // Si on coche (pas encore complété), ajouter l'effet de disparition
                                if (!wasCompleted) {
                                  // Marquer comme complété immédiatement
                                  toggleActionCompletion(currentDay, action.key);

                                  // Ajouter à la liste des actions en cours de disparition
                                  setFadingActions(prev => new Set(prev).add(actionKey));

                                  // Après 2 secondes, retirer de la liste pour permettre le tri
                                  setTimeout(() => {
                                    setFadingActions(prev => {
                                      const newSet = new Set(prev);
                                      newSet.delete(actionKey);
                                      return newSet;
                                    });
                                  }, 2000);
                                } else {
                                  // Si on décoche, pas d'effet spécial
                                  toggleActionCompletion(currentDay, action.key);
                                }
                              };

                              // Cas spécial pour l'action "vision" avec lien cliquable
                              if (action.key === 'vision' && (action.value === 'OBJECTIF_LINK' || action.value === 'OBJECTIF_LINK_DAY2')) {
                                return (
                                  <div
                                    key={action.key}
                                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-500 ease-in-out hover:scale-[1.02] bg-gradient-to-br from-white to-pink-50 shadow-md hover:shadow-lg ${isCompleted ? 'opacity-60' : ''} ${isFading ? 'animate-pulse scale-[0.98]' : ''}`}
                                    onClick={handleActionClick}
                                    style={{
                                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease-in-out'
                                    }}
                                  >
                                    <div className="flex items-start gap-3">
                                      <span className="text-3xl drop-shadow-lg">{action.icon}</span>
                                      <div className="flex-1">
                                        <h4 className={`font-bold text-sm mb-1 text-gray-800 transition-all duration-300 ${isCompleted ? 'line-through' : ''}`}>{action.label}</h4>
                                        <p className={`text-sm transition-all duration-300 ${isCompleted ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                                          {action.value === 'OBJECTIF_LINK' ? (
                                            <>
                                              {language === 'fr' ? 'Vision : Rends-toi à la section ' : language === 'en' ? 'Vision: Go to the section ' : 'Visión: Ve a la sección '}
                                              <span
                                                className="font-bold text-pink-500 hover:text-pink-600 underline cursor-pointer"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setCurrentView('dashboard');
                                                  // Scroll to TimeCapsule section after a short delay
                                                  setTimeout(() => {
                                                    const timeCapsuleElement = document.getElementById('time-capsule-section');
                                                    if (timeCapsuleElement) {
                                                      timeCapsuleElement.scrollIntoView({ behavior: 'smooth' });
                                                    }
                                                  }, 100);
                                                }}
                                              >
                                                {language === 'fr' ? 'message à moi' : language === 'en' ? 'message to myself' : 'mensaje a mí misma'}
                                              </span>
                                              {language === 'fr' ? ' et envoie-toi ton premier message !' : language === 'en' ? ' and send your first message!' : ' ¡y envía tu primer mensaje!'}
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
                                      {isCompleted && <Check className="w-6 h-6 text-green-500 flex-shrink-0 drop-shadow-lg animate-in fade-in duration-300" />}
                                    </div>
                                  </div>
                                );
                              }

                              // Rendu normal pour les autres actions
                              return (
                                <div
                                  key={action.key}
                                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-500 ease-in-out hover:scale-[1.02] bg-gradient-to-br from-white to-pink-50 shadow-md hover:shadow-lg ${isCompleted ? 'opacity-60' : ''} ${isFading ? 'animate-pulse scale-[0.98]' : ''}`}
                                  onClick={handleActionClick}
                                  style={{
                                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease-in-out'
                                  }}
                                >
                                  <div className="flex items-start gap-3">
                                    <span className="text-3xl drop-shadow-lg">{action.icon}</span>
                                    <div className="flex-1">
                                      <h4 className={`font-bold text-sm mb-1 text-gray-800 transition-all duration-300 ${isCompleted ? 'line-through' : ''}`}>{action.label}</h4>
                                      <p className={`text-sm transition-all duration-300 ${isCompleted ? 'line-through text-gray-400' : 'text-gray-600'}`}>{action.value}</p>
                                    </div>
                                    {isCompleted && <Check className="w-6 h-6 text-green-500 flex-shrink-0 drop-shadow-lg animate-in fade-in duration-300" />}
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

        {/* Trackers View - Project Glow Design System */}
        {currentView === 'trackers' && (
          <div className="pb-24 min-h-screen" style={{ background: 'linear-gradient(180deg, #ecfdf5 0%, #f0fdfa 50%, #ecfeff 100%)' }}>
            {/* Header */}
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all duration-200 hover:scale-102 active:scale-98"
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-800" />
                  </button>
                  <div>
                    <h1 className="text-lg font-bold text-gray-800">
                      {language === 'fr' ? 'Habitudes' : language === 'en' ? 'Habits' : 'Hábitos'}
                    </h1>
                    {(() => {
                      const completedNewMe = newMeHabits.filter(h => h.completed).length;
                      const completedCustom = customHabits.filter(h => {
                        const today = getLocalDateString();
                        const tracker = trackers.find(t => t.date === today);
                        return tracker?.habits?.[h.id] || false;
                      }).length;
                      const completedCount = completedNewMe + completedCustom;
                      const totalCount = newMeHabits.length + customHabits.length;
                      return (
                        <p className="text-xs font-medium text-gray-500">
                          {completedCount}/{totalCount} {language === 'fr' ? 'aujourd\'hui' : language === 'en' ? 'today' : 'hoy'}
                        </p>
                      );
                    })()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setHabitTab('growth')}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all duration-200 hover:scale-102 active:scale-98"
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                  >
                    <span className="text-lg">📊</span>
                  </button>
                  <button
                    onClick={() => setShowAddHabit(true)}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-102 active:scale-98"
                    style={{ background: 'linear-gradient(135deg, #34d399, #10b981)' }}
                  >
                    <Plus className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="px-4 space-y-3">
              {/* Barre de progression */}
              {(() => {
                const completedNewMe = newMeHabits.filter(h => h.completed).length;
                const completedCustom = customHabits.filter(h => {
                  const today = getLocalDateString();
                  const tracker = trackers.find(t => t.date === today);
                  return tracker?.habits?.[h.id] || false;
                }).length;
                const completedCount = completedNewMe + completedCustom;
                const totalCount = newMeHabits.length + customHabits.length;
                const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                
                return (
                  <div className="bg-white rounded-2xl p-3" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500">Progression du jour</span>
                      <span className="text-xs font-bold" style={{ color: '#10b981' }}>{progressPercent}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${progressPercent}%`,
                          background: 'linear-gradient(90deg, #34d399, #14b8a6)'
                        }}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* SECTION INTENTION */}
              <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span>🎯</span>
                  {language === 'fr' ? 'Aujourd\'hui, je suis quelqu\'un qui…' : language === 'en' ? 'Today, I am someone who…' : 'Hoy, soy alguien que…'}
                </h3>
                
                {dailyIntention ? (
                  <div className="bg-violet-50 rounded-xl p-3">
                    <p className="text-sm font-semibold text-violet-700">
                      {dailyIntention}
                    </p>
                    {showIntentionFeedback && (
                      <p className="text-xs text-violet-500 mt-1">
                        {intentionFeedbackMessage}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {INTENTIONS_DATA.map((intention) => {
                      const label = language === 'fr' ? intention.fr : language === 'en' ? intention.en : intention.es;
                      return (
                        <button
                          key={intention.id}
                          onClick={() => {
                            setDailyIntention(label);
                            const msg = INTENTION_MESSAGES[Math.floor(Math.random() * INTENTION_MESSAGES.length)];
                            setIntentionFeedbackMessage(msg);
                            setShowIntentionFeedback(true);
                            setTimeout(() => setShowIntentionFeedback(false), 3000);
                          }}
                          className="px-3 py-2 rounded-xl text-xs font-medium bg-gray-100 text-gray-600 hover:bg-violet-100 hover:text-violet-600 active:scale-95 transition-all"
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SECTION HUMEUR - Icônes grises quand non sélectionnées, couleur quand sélectionnées */}
              <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span>😊</span>
                  {language === 'fr' ? 'Comment je me sens ?' : language === 'en' ? 'How do I feel?' : '¿Cómo me siento?'}
                </h3>
                <div className="flex gap-2">
                  {MOODS_DATA.map((mood) => {
                    const label = language === 'fr' ? mood.fr : language === 'en' ? mood.en : mood.es;
                    const isSelected = dailyFeeling === label;
                    return (
                      <button
                        key={mood.id}
                        onClick={() => setDailyFeeling(label)}
                        className={`flex-1 py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all active:scale-95 ${
                          isSelected ? `${mood.bgColor} shadow-sm` : 'bg-gray-50'
                        }`}
                      >
                        <mood.icon 
                          className="w-5 h-5 transition-all duration-200"
                          style={{ 
                            filter: isSelected ? 'none' : 'grayscale(100%) brightness(1.2)',
                            opacity: isSelected ? 1 : 0.6,
                          }}
                        />
                        <span className={`text-[10px] font-medium ${isSelected ? mood.textColor : 'text-gray-500'}`}>
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* New Me Habits */}
              <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <span style={{ color: '#fb7185' }}>✨</span>
                      New Me
                    </h3>
                    <span className="text-xs font-bold text-gray-600">
                      {newMeHabits.filter(h => h.completed).length}/{newMeHabits.length}
                    </span>
                  </div>
                </div>
                <div className="h-px bg-gray-200 mx-4" />
                <div className="p-4 space-y-1">
                  {newMeHabits.map((habit) => (
                    <button
                      key={habit.id}
                      onClick={() => {
                        setNewMeHabits(newMeHabits.map(h =>
                          h.id === habit.id ? { ...h, completed: !h.completed } : h
                        ));
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        // TODO: Ouvrir la vue détail 30 jours
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                        habit.completed
                          ? 'bg-emerald-50'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-xl">{habit.icon}</span>
                        <span className={`text-sm font-medium flex-1 text-left ${
                          habit.completed ? 'text-emerald-700 line-through' : 'text-gray-700'
                        }`}>
                          {habit.label}
                        </span>
                      </div>
                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                          habit.completed 
                            ? 'bg-emerald-400' 
                            : 'bg-gray-200'
                        }`}
                      >
                        {habit.completed ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <Check className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 pb-4 text-center">
                  {language === 'fr' ? '(Appuie longtemps pour le suivi)' : language === 'en' ? '(Long press for tracking)' : '(Mantén presionado para seguimiento)'}
                </p>
              </div>

              {/* Custom Habits */}
              <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-800">
                      {language === 'fr' ? 'Mes habitudes' : language === 'en' ? 'My habits' : 'Mis hábitos'}
                    </h3>
                    <span className="text-xs font-bold text-gray-600">
                      {customHabits.filter(h => {
                        const today = getLocalDateString();
                        const tracker = trackers.find(t => t.date === today);
                        return tracker?.habits?.[h.id] || false;
                      }).length}/{customHabits.length}
                    </span>
                  </div>
                </div>
                <div className="h-px bg-gray-200 mx-4" />
                
                {customHabits.length === 0 ? (
                  <div className="p-4">
                    <button
                      onClick={() => setShowAddHabit(true)}
                      className="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-emerald-400 hover:text-emerald-600 transition-all duration-200 active:scale-98 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="text-sm font-bold">
                        {language === 'fr' ? 'Créer ma première habitude' : language === 'en' ? 'Create my first habit' : 'Crear mi primer hábito'}
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 space-y-1">
                    {customHabits.map((habit) => {
                      const today = getLocalDateString();
                      const tracker = trackers.find(t => t.date === today);
                      const isCompleted = tracker?.habits?.[habit.id] || false;
                      
                      return (
                        <div
                          key={habit.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <button
                              onClick={() => {
                                const today = getLocalDateString();
                                const existingTracker = trackers.find(t => t.date === today);
                                if (existingTracker) {
                                  updateTracker(today, {
                                    habits: {
                                      ...existingTracker.habits,
                                      [habit.id]: !isCompleted
                                    }
                                  });
                                } else {
                                  updateTracker(today, {
                                    habits: { [habit.id]: true }
                                  });
                                }
                              }}
                              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                                isCompleted
                                  ? 'text-white'
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              }`}
                              style={isCompleted ? { background: 'linear-gradient(135deg, #34d399, #14b8a6)' } : {}}
                            >
                              {isCompleted && <Check className="w-5 h-5" />}
                            </button>
                            <div className="flex flex-col flex-1">
                              <span className={`text-sm font-bold ${
                                isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'
                              }`}>
                                {habit.label}
                              </span>
                              <span className="text-xs text-gray-400">
                                {isCompleted 
                                  ? (language === 'fr' ? 'Aujourd\'hui ✓' : language === 'en' ? 'Today ✓' : 'Hoy ✓')
                                  : (language === 'fr' ? 'À faire' : language === 'en' ? 'To do' : 'Por hacer')
                                }
                              </span>
                            </div>
                          </div>
                          <button className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-all">
                            <span className="text-lg leading-none">⋯</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bouton créer - si des habitudes existent */}
              {customHabits.length > 0 && (
                <button
                  onClick={() => setShowAddHabit(true)}
                  className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-102 active:scale-98"
                  style={{ background: 'linear-gradient(135deg, #34d399, #14b8a6)', boxShadow: '0 2px 8px rgba(52, 211, 153, 0.3)' }}
                >
                  <Plus className="w-5 h-5" />
                  {language === 'fr' ? 'Créer une habitude' : language === 'en' ? 'Create a habit' : 'Crear un hábito'}
                </button>
              )}
            </div>

            {/* Modal Ajouter une habitude */}
            {showAddHabit && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-6 w-full max-w-sm" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                  <h3 className="text-base font-bold text-gray-800 mb-4">
                    {language === 'fr' ? 'Nouvelle habitude' : language === 'en' ? 'New habit' : 'Nuevo hábito'}
                  </h3>
                  <Input
                    value={newHabitLabel}
                    onChange={(e) => setNewHabitLabel(e.target.value)}
                    placeholder={language === 'fr' ? 'Nom de l\'habitude' : language === 'en' ? 'Habit name' : 'Nombre del hábito'}
                    className="mb-4 rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        if (newHabitLabel.trim()) {
                          setCustomHabits([...customHabits, {
                            id: `habit_${Date.now()}`,
                            label: newHabitLabel.trim(),
                            type: 'good'
                          }]);
                          setNewHabitLabel('');
                          setShowAddHabit(false);
                        }
                      }}
                      className="flex-1 rounded-xl text-white font-semibold py-3"
                      style={{ background: 'linear-gradient(135deg, #34d399, #14b8a6)' }}
                    >
                      {language === 'fr' ? 'Créer' : language === 'en' ? 'Create' : 'Crear'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setNewHabitLabel('');
                        setShowAddHabit(false);
                      }}
                      className="flex-1 rounded-xl py-3"
                    >
                      {language === 'fr' ? 'Annuler' : language === 'en' ? 'Cancel' : 'Cancelar'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Planning View - Ma Semaine */}
        {currentView === 'routine' && (
          <div className="pb-24 relative z-0">
            {/* Header */}
            <div className="p-4 pb-0">
              <div className="flex items-center gap-3 mb-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentView('dashboard')}
                >
                  <X className="w-5 h-5" />
                </Button>
                <h1 className="text-xl font-bold">
                  {language === 'fr' ? 'Mon Planning' : language === 'en' ? 'My Planning' : 'Mi Planificación'}
                </h1>
              </div>
            </div>



            {/* Navigation par semaine */}
            <div className="px-4 pb-2">
              <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} shadow-sm`}>
                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentWeekOffset(prev => prev - 1)}
                    className="flex-shrink-0 h-8 w-8 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="flex-1 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-rose-400" />
                      <p className="text-xs font-semibold">
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
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentWeekOffset(prev => prev + 1)}
                    className="flex-shrink-0 h-8 w-8 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="px-4 space-y-3 max-w-lg mx-auto">
              {/* Mes 3 priorités de la semaine */}
              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} shadow-lg`}>
                <h2 className="text-sm font-bold mb-2.5 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-rose-400" />
                  {language === 'fr' ? 'Mes 3 priorités de la semaine' : language === 'en' ? 'My 3 weekly priorities' : 'Mis 3 prioridades semanales'}
                </h2>


                <div className="space-y-2">
                  {(() => {
                    // Déterminer quelles priorités afficher
                    let prioritiesToShow = weekPriorities;


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
                        className={`flex items-center gap-2 p-2 rounded-lg ${
                          theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50'
                        }`}
                      >
                        <span className={`flex-1 text-xs ${priority.completed ? 'line-through text-stone-500' : ''}`}>
                          {priority.text}
                        </span>
                        <button
                          onClick={() => {
                            setWeekPriorities(weekPriorities.filter(p => p.id !== priority.id));
                          }}
                          className="text-stone-400 hover:text-red-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Jours de la semaine - 2 par ligne */}
              <div className="grid grid-cols-2 gap-2 items-start">
                {(() => {
                  const today = new Date();
                  const todayStr = getLocalDateString(today);
                  const weekDates = getWeekDates(currentWeekOffset);

                  return [
                    { key: 'monday', label: language === 'fr' ? 'Lun' : language === 'en' ? 'Mon' : 'Lun', index: 0 },
                    { key: 'tuesday', label: language === 'fr' ? 'Mar' : language === 'en' ? 'Tue' : 'Mar', index: 1 },
                    { key: 'wednesday', label: language === 'fr' ? 'Mer' : language === 'en' ? 'Wed' : 'Mié', index: 2 },
                    { key: 'thursday', label: language === 'fr' ? 'Jeu' : language === 'en' ? 'Thu' : 'Jue', index: 3 },
                    { key: 'friday', label: language === 'fr' ? 'Ven' : language === 'en' ? 'Fri' : 'Vie', index: 4 },
                    { key: 'saturday', label: language === 'fr' ? 'Sam' : language === 'en' ? 'Sat' : 'Sáb', index: 5 },
                    { key: 'sunday', label: language === 'fr' ? 'Dim' : language === 'en' ? 'Sun' : 'Dom', index: 6 }
                  ].map((day) => {
                    const dateStr = weekDates[day.index];
                    const isToday = dateStr === todayStr;
                    const dayDate = new Date(dateStr);
                    const formattedDate = `${dayDate.getDate().toString().padStart(2, '0')}/${(dayDate.getMonth() + 1).toString().padStart(2, '0')}`;

                    // Récupérer les tâches pour cette date
                    const dayTasks = getTasksForDate(dateStr, "user");

                    return (
                      <div
                        key={day.key}
                        className={`rounded-xl shadow-md ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} relative overflow-hidden`}
                      >
                        {/* Bordure en haut pour le jour actuel */}
                        {isToday && (
                          <div className="absolute top-0 left-[20%] right-[20%] h-1 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 rounded-b-full" />
                        )}
                        <div className="p-2.5">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-xs">{day.label}</h3>
                            <span className="text-[10px] text-stone-400">{formattedDate}</span>
                          </div>
                          <div className="space-y-1.5">
                            {dayTasks.length === 0 ? (
                              <p className="text-[10px] text-stone-400 text-center py-1">
                                {language === 'fr' ? 'Aucune tâche' : language === 'en' ? 'No tasks' : 'Sin tareas'}
                              </p>
                            ) : (
                              dayTasks.map((task) => {
                                // Obtenir l'index de l'objectif pour déterminer la couleur du dégradé (3 couleurs max)
                                const getGradientForGoal = () => {
                                  if (task.type !== 'glowee' || !task.goalId) return null;
                                  const activeGoals = getActiveGoals();
                                  const goalIndex = activeGoals.findIndex(g => g.id === task.goalId);
                                  if (goalIndex === -1) return null;
                                  // 3 dégradés distincts pour les 3 objectifs possibles
                                  const gradients = [
                                    'from-rose-200/60 via-pink-200/60 to-rose-100/60', // Objectif 1 - Rose
                                    'from-violet-200/60 via-purple-200/60 to-violet-100/60', // Objectif 2 - Violet
                                    'from-amber-200/60 via-orange-200/60 to-amber-100/60' // Objectif 3 - Orange
                                  ];
                                  return gradients[goalIndex % 3];
                                };
                                const taskGradient = getGradientForGoal();

                                return (
                                  <div
                                    key={task.id}
                                    className={`relative p-1.5 pr-5 rounded-md text-[10px] flex items-start gap-1.5 ${
                                      task.type === 'glowee' && taskGradient
                                        ? `bg-gradient-to-r ${taskGradient}`
                                        : theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50'
                                    }`}
                                  >
                                    {/* Indicateur de couleur de l'objectif */}
                                    {task.goalColor && (
                                      <div
                                        className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5"
                                        style={{ backgroundColor: task.goalColor }}
                                        title={task.goalName || ''}
                                      />
                                    )}
                                    {/* Bouton supprimer - coin supérieur droit */}
                                    <button
                                      onClick={async () => {
                                        setTasksWithDates(prev => prev.filter(t => t.id !== task.id));
                                        if (user && task.id.startsWith('firebase_')) {
                                          try {
                                            await deleteTaskFromFirebase(task.id);
                                          } catch (error) {
                                            console.error('Error deleting task from Firebase:', error);
                                          }
                                        }
                                      }}
                                      className="absolute top-0.5 right-0.5 text-stone-400 hover:text-red-500 transition-colors p-0.5"
                                    >
                                      <X className="w-2.5 h-2.5" />
                                    </button>
                                    <span
                                      onClick={async () => {
                                        const newCompleted = !task.completed;
                                        setTasksWithDates(prev => prev.map(t =>
                                          t.id === task.id ? { ...t, completed: newCompleted } : t
                                        ));
                                        if (user && task.id.startsWith('firebase_')) {
                                          try {
                                            await updateTaskCompletion(task.id, newCompleted);
                                          } catch (error) {
                                            console.error('Error updating task completion in Firebase:', error);
                                          }
                                        }
                                      }}
                                      className={`cursor-pointer block leading-tight flex-1 ${task.completed ? 'line-through text-stone-500' : ''}`}
                                    >
                                      {task.text}
                                    </span>
                                  </div>
                                );
                              })
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
            <div className="px-4 pb-4 pt-3 max-w-lg mx-auto">
              <Button
                size="sm"
                className="bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white h-8 text-xs"
                onClick={() => setShowAddTask(true)}
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                {language === 'fr' ? 'Ajouter une tâche' : language === 'en' ? 'Add a task' : 'Agregar una tarea'}
              </Button>
            </div>
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

            {/* Sélecteur de dates - Exact copy from Mes Habitudes */}
            <div className="px-4 py-2">
              <div className="flex justify-between items-center px-2">
                {(() => {
                  const today = new Date();
                  const dates: Date[] = [];
                  // Générer 9 jours (4 avant, aujourd'hui, 4 après)
                  for (let i = -4; i <= 4; i++) {
                    const date = new Date(today);
                    date.setDate(today.getDate() + i);
                    dates.push(date);
                  }
                  return dates.map((date, index) => {
                    const isToday = index === 4;
                    const dateString = getLocalDateString(date);
                    const isSelected = dateString === beautySelectedDate;
                    const isValidated = beautyValidatedDates.includes(dateString);
                    const dayName = date.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', { weekday: 'short' }).slice(0, 3);
                    const dayNumber = date.getDate();
                    return (
                      <div
                        key={index}
                        className={`relative flex flex-col items-center cursor-pointer transition-all ${isSelected ? 'scale-110' : ''}`}
                        onClick={() => setBeautySelectedDate(dateString)}
                      >
                        <span className={`text-[10px] uppercase ${isSelected || isToday ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                          {dayName}
                        </span>
                        <span className={`text-lg font-bold ${isSelected || isToday ? 'text-gray-900' : 'text-gray-400'}`}>
                          {dayNumber}
                        </span>
                        {/* Croix de validation */}
                        {isValidated && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow-lg animate-in zoom-in duration-500">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
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
                  {/* Carte Glowee avec message et progression */}
                  <div className="relative mb-6">
                    <Card className="border-none shadow-xl shadow-pink-100/50 bg-white/80 backdrop-blur-md rounded-3xl overflow-visible">
                      <CardContent className="p-4 pl-20">
                        <p className="text-xs text-gray-700 leading-relaxed font-medium mb-3">
                          {language === 'fr' ? '30 jours. 3 gestes par jour. Pour un vrai glow up.' :
                           language === 'en' ? '30 days. 3 gestures per day. For a real glow up.' :
                           '30 días. 3 gestos al día. Para un verdadero glow up.'}
                        </p>
                        {/* Barre de progression en bas à droite */}
                        <div className="flex items-center gap-2 justify-end">
                          <div className="flex-1 max-w-[150px]">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 transition-all duration-500"
                                style={{
                                  width: `${(() => {
                                    const dayProgress = getBeautyProgressForDate(beautySelectedDate);
                                    const completedCount = dayProgress ?
                                      [dayProgress['walk-sport'], dayProgress['water'], dayProgress['self-care-choice']].filter(Boolean).length : 0;
                                    return (completedCount / 3) * 100;
                                  })()}%`
                                }}
                              />
                            </div>
                          </div>
                          <span className="text-xs font-bold text-gray-600">
                            {(() => {
                              const dayProgress = getBeautyProgressForDate(beautySelectedDate);
                              const completedCount = dayProgress ?
                                [dayProgress['walk-sport'], dayProgress['water'], dayProgress['self-care-choice']].filter(Boolean).length : 0;
                              return `${completedCount}/3`;
                            })()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Image Glowee */}
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-[60px] h-[64px] z-10">
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 rounded-lg blur-md opacity-8"></div>
                      <Image
                        src="/Glowee/glowee.webp"
                        alt="Glowee"
                        width={60}
                        height={64}
                        className="object-contain relative z-10 drop-shadow-2xl"
                      />
                    </div>
                  </div>

                  {/* Liste des 3 piliers beauté */}
                  <div className="space-y-4">
                    {beautyPillars.map((pillar) => {
                      const dayProgress = getBeautyProgressForDate(beautySelectedDate);
                      const isCompleted = dayProgress?.[pillar.id as keyof typeof dayProgress] || false;
                      const isChoicePillar = pillar.type === 'choice';

                      return (
                        <div key={pillar.id}>
                          {/* Pillar Card */}
                          <div
                            className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01] bg-gradient-to-br from-white to-pink-50 shadow-md hover:shadow-lg ${
                              isCompleted ? 'opacity-60' : ''
                            }`}
                            onClick={() => {
                              if (isChoicePillar) {
                                setBeautyChoiceExpanded(!beautyChoiceExpanded);
                              } else {
                                toggleBeautyPillar(beautySelectedDate, pillar.id);
                              }
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-3xl drop-shadow-lg">{pillar.icon}</span>
                              <div className="flex-1">
                                <h4 className={`font-bold text-sm mb-1 text-gray-800 ${isCompleted && !isChoicePillar ? 'line-through' : ''}`}>
                                  {pillar.title[language]}
                                </h4>
                                <p className={`text-sm ${isCompleted && !isChoicePillar ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                                  {pillar.description[language]}
                                </p>
                              </div>
                              {isCompleted && !isChoicePillar && (
                                <Check className="w-6 h-6 text-green-500 flex-shrink-0 drop-shadow-lg" />
                              )}
                              {isChoicePillar && (
                                <ChevronDown className={`w-5 h-5 text-pink-400 flex-shrink-0 transition-transform duration-300 ${beautyChoiceExpanded ? 'rotate-180' : ''}`} />
                              )}
                            </div>
                          </div>

                          {/* Slide content for choice pillar */}
                          {isChoicePillar && (
                            <div
                              className={`overflow-hidden transition-all duration-300 ease-out ${
                                beautyChoiceExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                              }`}
                            >
                                <div className="space-y-3">
                                 {/* Message Glowee - With typing effect */}
                                 <div className="relative">
                                   <Card className="border-none shadow-xl shadow-pink-100/50 bg-white/80 backdrop-blur-md rounded-3xl overflow-visible">
                                     <CardContent className="p-0">
                                       <div className="flex items-center gap-1.5 py-0.5 px-2 pl-20 min-h-[2px]">
                                         <div className="flex-1 min-w-0">
                                           <p className="text-[10px] text-gray-700 leading-tight font-medium">
                                             {beautyGloweeDisplayedMessage}
                                             {beautyGloweeIsTyping && <span className="animate-pulse">|</span>}
                                           </p>
                                         </div>
                                       </div>
                                     </CardContent>
                                   </Card>

                                   {/* Image Glowee agrandie de 40px - positionnée à l'extérieur de la carte */}
                                   <div className="absolute left-0 top-1/2 -translate-y-1/3 w-[96px] h-[104px] z-10">
                                     <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 rounded-lg blur-md opacity-8"></div>
                                     <Image
                                       src="/Glowee/glowee.webp"
                                       alt="Glowee"
                                       width={96}
                                       height={104}
                                       className="object-contain relative z-10 drop-shadow-2xl"
                                     />
                                   </div>
                                 </div>

                                {/* Barre verticale */}
                                <div className="flex justify-center">
                                  <div className="w-0.5 h-8 bg-gradient-to-b from-pink-300 to-transparent"></div>
                                </div>

                                {/* Beauty Choices */}
                                {beautyChoices.map((choice) => {
                                  const isSelected = dayProgress?.selectedChoice === choice.id;
                                  const hasSubtasks = choice.subtasks && choice.subtasks.length > 0;

                                  return (
                                    <div key={choice.id}>
                                      <div
                                        className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01] ${
                                          isSelected
                                            ? 'bg-gradient-to-br from-green-100 to-green-200 shadow-lg'
                                            : 'bg-white shadow-md hover:shadow-lg'
                                        }`}
                                        onClick={() => selectBeautyChoice(beautySelectedDate, choice.id)}
                                      >
                                        <div className="flex items-center gap-3">
                                          <span className="text-2xl">{choice.icon}</span>
                                          <div className="flex-1">
                                            <h5 className="font-bold text-sm text-gray-800">{choice.title[language]}</h5>
                                            {choice.description && (
                                              <p className="text-xs text-gray-600">{choice.description[language]}</p>
                                            )}
                                          </div>
                                          {isSelected && <Check className="w-5 h-5 text-green-600 flex-shrink-0" />}
                                        </div>
                                      </div>

                                      {/* Subtasks for this choice */}
                                      {hasSubtasks && isSelected && (
                                        <div className="ml-8 mt-2 space-y-2">
                                          {choice.subtasks!.map((subtask) => {
                                            const isSubtaskCompleted = dayProgress?.subtasks?.[subtask.id] || false;

                                            return (
                                              <div
                                                key={subtask.id}
                                                className={`p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                                                  isSubtaskCompleted
                                                    ? 'bg-green-50 opacity-60'
                                                    : 'bg-pink-50 hover:bg-pink-100'
                                                }`}
                                                onClick={() => toggleBeautySubtask(beautySelectedDate, subtask.id)}
                                              >
                                                <div className="flex items-center gap-2">
                                                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                                    isSubtaskCompleted ? 'bg-green-500 border-green-500' : 'border-pink-300'
                                                  }`}>
                                                    {isSubtaskCompleted && <Check className="w-3 h-3 text-white" />}
                                                  </div>
                                                  <span className={`text-xs font-medium ${isSubtaskCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                                    {subtask.title[language]}
                                                  </span>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Bouton Valider */}
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => {
                        const dayProgress = getBeautyProgressForDate(beautySelectedDate);
                        const completedCount = dayProgress ?
                          [dayProgress['walk-sport'], dayProgress['water'], dayProgress['self-care-choice']].filter(Boolean).length : 0;
                        
                        if (completedCount === 3) {
                          setShowBeautyStreakPopup(true);
                          validateBeautyDate(beautySelectedDate);
                        } else {
                          setShowBeautyIncompletePopup(true);
                        }
                      }}
                      className="px-8 py-3 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      {language === 'fr' ? 'Valider' : language === 'en' ? 'Validate' : 'Validar'}
                    </button>
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
                        {language === 'fr' ? 'Progression sur 30 jours' : language === 'en' ? 'Progress over 30 days' : 'Progreso en 30 días'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Statistiques globales */}
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-pink-50 to-rose-50">
                          <div className="text-2xl font-bold text-rose-500">
                            {(() => {
                              const allDates = Object.keys(beautyPillarsProgress);
                              return allDates.filter(date => {
                                const dayProgress = beautyPillarsProgress[date];
                                return dayProgress && dayProgress['walk-sport'] && dayProgress['water'] && dayProgress['self-care-choice'];
                              }).length;
                            })()}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {language === 'fr' ? 'Jours parfaits' : language === 'en' ? 'Perfect days' : 'Días perfectos'}
                          </div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-orange-50 to-pink-50">
                          <div className="text-2xl font-bold text-orange-500">
                            {(() => {
                              const validatedDates = beautyValidatedDates;
                              return validatedDates.length;
                            })()}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {language === 'fr' ? 'Jours validés' : language === 'en' ? 'Validated days' : 'Días validados'}
                          </div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
                          <div className="text-2xl font-bold text-purple-500">
                            {(() => {
                              const validatedDates = Array.from(beautyValidatedDates).sort();
                              let maxStreak = 0;
                              let currentStreak = 0;
                              
                              for (let i = 0; i < validatedDates.length; i++) {
                                if (i === 0) {
                                  currentStreak = 1;
                                } else {
                                  const prevDate = new Date(validatedDates[i - 1]);
                                  const currDate = new Date(validatedDates[i]);
                                  const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
                                  
                                  if (diffDays === 1) {
                                    currentStreak++;
                                  } else {
                                    maxStreak = Math.max(maxStreak, currentStreak);
                                    currentStreak = 1;
                                  }
                                }
                              }
                              return Math.max(maxStreak, currentStreak);
                            })()}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {language === 'fr' ? 'Meilleure série' : language === 'en' ? 'Best streak' : 'Mejor racha'}
                          </div>
                        </div>
                      </div>
                      {/* Calendrier des 30 jours */}
                      <div className="space-y-2 mb-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                          {language === 'fr' ? 'Calendrier de validation' : language === 'en' ? 'Validation calendar' : 'Calendario de validación'}
                        </h3>
                        <div className="grid grid-cols-7 gap-2">
                          {Array.from({ length: 30 }, (_, i) => {
                            const dayIndex = i + 1;
                            // Créer une date fictive pour chaque jour
                            const today = new Date();
                            const startDate = new Date(today);
                            startDate.setDate(today.getDate() - 15); // Commencer 15 jours avant aujourd'hui
                            const thisDate = new Date(startDate);
                            thisDate.setDate(startDate.getDate() + dayIndex - 1);
                            const dateString = getLocalDateString(thisDate);
                            
                            const isValidated = beautyValidatedDates.includes(dateString);
                            const dayProgress = beautyPillarsProgress[dateString];
                            const hasProgress = dayProgress && (dayProgress['walk-sport'] || dayProgress['water'] || dayProgress['self-care-choice']);
                            const isToday = getLocalDateString(new Date()) === dateString;

                            return (
                              <div
                                key={dayIndex}
                                className={`
                                  aspect-square rounded-lg flex items-center justify-center cursor-pointer transition-all text-xs font-semibold
                                  ${isToday ? 'ring-2 ring-rose-400' : ''}
                                  ${isValidated
                                    ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-white shadow-md'
                                    : hasProgress
                                      ? 'bg-rose-100 text-rose-500'
                                      : 'bg-gray-100 text-gray-400'
                                  }
                                  hover:scale-110
                                `}
                              >
                                {isValidated && <Check className="w-4 h-4" />}
                                {!isValidated && dayIndex}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Détail par pilier */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-700">
                          {language === 'fr' ? 'Détail par pilier' : language === 'en' ? 'Details by pillar' : 'Detalles por pilar'}
                        </h3>
                        
                        {beautyPillars.map(pillar => {
                          const completedDays = Object.keys(beautyPillarsProgress).filter(date => {
                            const dayProgress = beautyPillarsProgress[date];
                            return dayProgress && dayProgress[pillar.id];
                          }).length;
                          
                          return (
                            <div key={pillar.id} className="p-3 rounded-lg bg-gradient-to-r from-pink-50 to-rose-50">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">{pillar.icon}</span>
                                <div className="flex-1">
                                  <h4 className="text-sm font-semibold text-gray-800">{pillar.title[language]}</h4>
                                  <p className="text-xs text-gray-600">{completedDays} / 30 {language === 'fr' ? 'jours' : language === 'en' ? 'days' : 'días'}</p>
                                </div>
                              </div>
                              <div className="h-2 bg-white rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 transition-all duration-500"
                                  style={{ width: `${(completedDays / 30) * 100}%` }}
                                />
                              </div>
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
                        {language === 'fr' ? 'Badges' : language === 'en' ? 'Badges' : 'Insignias'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {(() => {
                        // Calculs pour le challenge beauté
                        const validatedDays = beautyValidatedDates.length;
                        const allDates = Object.keys(beautyPillarsProgress);
                        
                        const perfectDays = allDates.filter(date => {
                          const dayProgress = beautyPillarsProgress[date];
                          return dayProgress && dayProgress['walk-sport'] && dayProgress['water'] && dayProgress['self-care-choice'];
                        }).length;

                        const walkSportDays = allDates.filter(date => {
                          const dayProgress = beautyPillarsProgress[date];
                          return dayProgress && dayProgress['walk-sport'];
                        }).length;

                        const waterDays = allDates.filter(date => {
                          const dayProgress = beautyPillarsProgress[date];
                          return dayProgress && dayProgress['water'];
                        }).length;

                        const selfCareDays = allDates.filter(date => {
                          const dayProgress = beautyPillarsProgress[date];
                          return dayProgress && dayProgress['self-care-choice'];
                        }).length;

                        // Calcul de la série actuelle
                        const sortedDates = beautyValidatedDates.sort();
                        let currentStreak = 0;
                        const today = getLocalDateString(new Date());
                        
                        for (let i = 0; i >= -29; i--) {
                          const checkDate = new Date();
                          checkDate.setDate(checkDate.getDate() + i);
                          const checkDateString = getLocalDateString(checkDate);
                          
                          if (beautyValidatedDates.includes(checkDateString)) {
                            currentStreak++;
                          } else {
                            break;
                          }
                        }

                        const hasStarted = allDates.length > 0;

                        // Calcul des jours avec choix spécifiques de beauté
                        const skincareDays = allDates.filter(date => {
                          const dayProgress = beautyPillarsProgress[date];
                          return dayProgress && dayProgress.selectedChoice === 'skincare';
                        }).length;

                        const faceMassageDays = allDates.filter(date => {
                          const dayProgress = beautyPillarsProgress[date];
                          return dayProgress && dayProgress.selectedChoice === 'face-massage';
                        }).length;

                        const bodyCreamDays = allDates.filter(date => {
                          const dayProgress = beautyPillarsProgress[date];
                          return dayProgress && dayProgress.selectedChoice === 'body-cream';
                        }).length;

                        const lashesHairDays = allDates.filter(date => {
                          const dayProgress = beautyPillarsProgress[date];
                          return dayProgress && dayProgress.selectedChoice === 'lashes-hair';
                        }).length;

                        const dryBrushingDays = allDates.filter(date => {
                          const dayProgress = beautyPillarsProgress[date];
                          return dayProgress && dayProgress.selectedChoice === 'dry-brushing';
                        }).length;

                        const badges = [
                          {
                            condition: hasStarted,
                            icon: '🌱',
                            title: language === 'fr' ? 'Premier Pas' : language === 'en' ? 'First Step' : 'Primer Paso',
                            desc: language === 'fr' ? 'Tu as commencé ton glow up !' : language === 'en' ? 'You started your glow up!' : '¡Comenzaste tu glow up!'
                          },
                          {
                            condition: perfectDays >= 1,
                            icon: '✨',
                            title: language === 'fr' ? 'Journée Parfaite' : language === 'en' ? 'Perfect Day' : 'Día Perfecto',
                            desc: language === 'fr' ? '3 piliers complétés en un jour' : language === 'en' ? '3 pillars completed in one day' : '3 pilares completados en un día'
                          },
                          {
                            condition: currentStreak >= 3,
                            icon: '🔥',
                            title: language === 'fr' ? 'Série de 3' : language === 'en' ? 'Streak of 3' : 'Racha de 3',
                            desc: language === 'fr' ? '3 jours consécutifs validés' : language === 'en' ? '3 consecutive days validated' : '3 días consecutivos validados'
                          },
                          {
                            condition: waterDays >= 7,
                            icon: '💧',
                            title: language === 'fr' ? 'Hydratation Pro' : language === 'en' ? 'Hydration Pro' : 'Hidratación Pro',
                            desc: language === 'fr' ? '7 jours d\'hydratation parfaite' : language === 'en' ? '7 days of perfect hydration' : '7 días de hidratación perfecta'
                          },
                          {
                            condition: walkSportDays >= 7,
                            icon: '🚶‍♀️',
                            title: language === 'fr' ? 'Active Queen' : language === 'en' ? 'Active Queen' : 'Reina Activa',
                            desc: language === 'fr' ? '7 jours de sport ou marche' : language === 'en' ? '7 days of sport or walk' : '7 días de deporte o caminata'
                          },
                          {
                            condition: selfCareDays >= 7,
                            icon: '💆‍♀️',
                            title: language === 'fr' ? 'Self-Care Star' : language === 'en' ? 'Self-Care Star' : 'Estrella del Autocuidado',
                            desc: language === 'fr' ? '7 gestes beauté pour toi' : language === 'en' ? '7 beauty gestures for you' : '7 gestos de belleza para ti'
                          },
                          {
                            condition: currentStreak >= 7,
                            icon: '🌟',
                            title: language === 'fr' ? 'Semaine d\'Or' : language === 'en' ? 'Golden Week' : 'Semana de Oro',
                            desc: language === 'fr' ? '7 jours consécutifs validés' : language === 'en' ? '7 consecutive days validated' : '7 días consecutivos validados'
                          },
                          {
                            condition: perfectDays >= 14,
                            icon: '🌸',
                            title: language === 'fr' ? 'Glow Up en Vue' : language === 'en' ? 'Glow Up in Sight' : 'Glow Up a la Vista',
                            desc: language === 'fr' ? '14 journées parfaites' : language === 'en' ? '14 perfect days' : '14 días perfectos'
                          },
                          {
                            condition: currentStreak >= 14,
                            icon: '💎',
                            title: language === 'fr' ? 'Détermination Diamant' : language === 'en' ? 'Diamond Determination' : 'Determinación Diamante',
                            desc: language === 'fr' ? '14 jours consécutifs validés' : language === 'en' ? '14 consecutive days validated' : '14 días consecutivos validados'
                          },
                          {
                            condition: validatedDays >= 21,
                            icon: '👑',
                            title: language === 'fr' ? 'Reine du Glow Up' : language === 'en' ? 'Glow Up Queen' : 'Reina del Glow Up',
                            desc: language === 'fr' ? '21 jours validés - nouvelle habitude !' : language === 'en' ? '21 days validated - new habit!' : '21 días validados - ¡nuevo hábito!'
                          },
                          {
                            condition: currentStreak >= 30,
                            icon: '🏆',
                            title: language === 'fr' ? 'Légende' : language === 'en' ? 'Legend' : 'Leyenda',
                            desc: language === 'fr' ? '30 jours consécutifs - transformation complète !' : language === 'en' ? '30 consecutive days - complete transformation!' : '30 días consecutivos - ¡transformación completa!'
                          },
                          {
                            condition: perfectDays >= 30,
                            icon: '✨',
                            title: language === 'fr' ? 'Perfection Absolue' : language === 'en' ? 'Absolute Perfection' : 'Perfección Absoluta',
                            desc: language === 'fr' ? '30 journées parfaites - tu es incroyable !' : language === 'en' ? '30 perfect days - you\'re incredible!' : '30 días perfectos - ¡eres increíble!'
                          },
                          {
                            condition: skincareDays >= 8,
                            icon: '🧼',
                            title: language === 'fr' ? 'Expert Skincare' : language === 'en' ? 'Skincare Expert' : 'Experta en Skincare',
                            desc: language === 'fr' ? '8 jours de routine skincare parfaite' : language === 'en' ? '8 days of perfect skincare routine' : '8 días de rutina skincare perfecta'
                          },
                          {
                            condition: faceMassageDays >= 5,
                            icon: '💆‍♀️',
                            title: language === 'fr' ? 'Massage Pro' : language === 'en' ? 'Massage Pro' : 'Pro del Masaje',
                            desc: language === 'fr' ? '5 jours de massage visage' : language === 'en' ? '5 days of face massage' : '5 días de masaje facial'
                          },
                          {
                            condition: bodyCreamDays >= 5,
                            icon: '🧴',
                            title: language === 'fr' ? 'Peau Douce' : language === 'en' ? 'Soft Skin' : 'Piel Suave',
                            desc: language === 'fr' ? '5 jours de crème corps' : language === 'en' ? '5 days of body cream' : '5 días de crema corporal'
                          },
                          {
                            condition: lashesHairDays >= 4,
                            icon: '👁️',
                            title: language === 'fr' ? 'Cils & Cheveux Parfaits' : language === 'en' ? 'Perfect Lashes & Hair' : 'Pestañas y Cabello Perfectos',
                            desc: language === 'fr' ? '4 jours de soins cils/cheveux' : language === 'en' ? '4 days of lashes/hair care' : '4 días de cuidado pestañas/cabello'
                          },
                          {
                            condition: dryBrushingDays >= 3,
                            icon: '🪥',
                            title: language === 'fr' ? 'Brossage Expert' : language === 'en' ? 'Brushing Expert' : 'Experta en Cepillado',
                            desc: language === 'fr' ? '3 jours de brossage à sec' : language === 'en' ? '3 days of dry brushing' : '3 días de cepillado en seco'
                          }
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
                          <div className="relative w-12 h-12 flex-shrink-0">
                            <Image src="/Glowee/glowee-felicite.webp" alt="Glowee" fill className="object-contain" />
                          </div>
                          <p className="text-sm italic text-gray-700 dark:text-stone-300">
                            {(() => {
                              const allDatesForMessage = Object.keys(beautyPillarsProgress);
                              const perfectDaysCount = allDatesForMessage.filter(date => {
                                const dayProgress = beautyPillarsProgress[date];
                                return dayProgress && dayProgress['walk-sport'] && dayProgress['water'] && dayProgress['self-care-choice'];
                              }).length;
                              
                              if (perfectDaysCount >= 20) {
                                return language === 'fr' 
                                  ? "Tu es une vraie inspiration ! Continue ce rythme incroyable ✨" 
                                  : language === 'en'
                                  ? "You're a real inspiration! Keep up this incredible pace ✨"
                                  : "¡Eres una verdadera inspiración! Mantén este ritmo increíble ✨";
                              }
                              if (perfectDaysCount >= 10) {
                                return language === 'fr'
                                  ? "Wow ! Tu brilles déjà tellement plus 🌟"
                                  : language === 'en'
                                  ? "Wow! You're already shining so much brighter 🌟"
                                  : "¡Wow! Ya brillas mucho más 🌟";
                              }
                              if (perfectDaysCount >= 3) {
                                return language === 'fr'
                                  ? "Je suis fière de toi ! Chaque jour compte 💖"
                                  : language === 'en'
                                  ? "I'm proud of you! Every day counts 💖"
                                  : "¡Estoy orgullosa de ti! Cada día cuenta 💖";
                              }
                              return language === 'fr'
                                ? "Tu es au début d'un parcours magnifique. Je suis là pour toi ! 🌸"
                                : language === 'en'
                                ? "You're at the start of a beautiful journey. I'm here for you! 🌸"
                                : "Estás al comienzo de un hermoso viaje. ¡Estoy aquí para ti! 🌸";
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
            </div>
          </div>
        )}

        {/* Boundaries View - 8 Limites */}
        {currentView === 'boundaries' && (
          <div className="pb-24 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 min-h-screen">
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
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-purple-400 bg-clip-text text-transparent">
                  {language === 'fr' ? '8 Limites' : language === 'en' ? '8 Boundaries' : '8 Límites'}
                </h1>
                <p className="text-xs text-gray-600 font-medium">
                  {language === 'fr' ? 'Pour ta paix intérieure' : language === 'en' ? 'For your inner peace' : 'Para tu paz interior'}
                </p>
              </div>
            </div>

            <div className="px-5 space-y-5 max-w-3xl mx-auto">
              <BoundariesTracker />
            </div>
          </div>
        )}

        {/* Settings/Profil View - Design Moderne UX */}
        {currentView === 'settings' && (
          <div className="pb-24 min-h-screen" style={{ background: 'linear-gradient(180deg, #faf5f0 0%, #fdf8f3 100%)' }}>
            <div className="max-w-lg mx-auto">
              {/* Header avec profil */}
              <div className="px-4 pt-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <h1 className="text-lg font-bold text-gray-800">
                    {language === 'fr' ? 'Mon Profil' : language === 'en' ? 'My Profile' : 'Mi Perfil'}
                  </h1>
                  <button
                    onClick={() => {
                      if (user) {
                        if (confirm(language === 'fr' ? 'Voulez-vous vous déconnecter ?' : language === 'en' ? 'Sign out?' : '¿Cerrar sesión?')) {
                          signOut();
                        }
                      } else {
                        setShowAuthDialog(true);
                      }
                    }}
                    className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
                  >
                    {user ? (
                      <LogOut className="w-5 h-5 text-rose-500" />
                    ) : (
                      <LogIn className="w-5 h-5 text-emerald-500" />
                    )}
                  </button>
                </div>

                {/* Carte profil utilisateur */}
                <div className="bg-white rounded-3xl p-6 shadow-sm mb-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-300 via-pink-300 to-orange-300 flex items-center justify-center shadow-lg">
                        {user ? (
                          <span className="text-3xl">👩</span>
                        ) : (
                          <User className="w-10 h-10 text-white" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-800">
                        {user ? (user.email?.split('@')[0] || 'Utilisateur') : 
                          (language === 'fr' ? 'Invité' : language === 'en' ? 'Guest' : 'Invitado')}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {user ? user.email : 
                          (language === 'fr' ? 'Connectez-vous pour synchroniser' : 
                           language === 'en' ? 'Sign in to sync' : 
                           'Inicia sesión para sincronizar')}
                      </p>
                      {user && (
                        <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100">
                          <Crown className="w-3 h-3 text-amber-600" />
                          <span className="text-xs font-semibold text-amber-700">
                            {language === 'fr' ? 'Membre Premium' : language === 'en' ? 'Premium Member' : 'Miembro Premium'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats rapides */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-white rounded-2xl p-4 shadow-sm text-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mx-auto mb-2">
                      <Check className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{challengeProgress.completedDays.length}</p>
                    <p className="text-xs text-gray-500">
                      {language === 'fr' ? 'Jours' : language === 'en' ? 'Days' : 'Días'}
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm text-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-5 h-5 text-rose-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{progressPercentage}%</p>
                    <p className="text-xs text-gray-500">
                      {language === 'fr' ? 'Progression' : language === 'en' ? 'Progress' : 'Progreso'}
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm text-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mx-auto mb-2">
                      <ImageIcon className="w-5 h-5 text-violet-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{visionBoardImages.length}</p>
                    <p className="text-xs text-gray-500">
                      {language === 'fr' ? 'Visions' : language === 'en' ? 'Visions' : 'Visiones'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu des options */}
              <div className="px-4 space-y-3">
                {/* Section Apparence */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                      {language === 'fr' ? 'Apparence' : language === 'en' ? 'Appearance' : 'Apariencia'}
                    </h3>
                  </div>
                  
                  {/* Thème */}
                  <button 
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                        {theme === 'light' ? (
                          <Sun className="w-5 h-5 text-amber-600" />
                        ) : (
                          <Moon className="w-5 h-5 text-indigo-600" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {language === 'fr' ? 'Thème' : language === 'en' ? 'Theme' : 'Tema'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {theme === 'light' 
                          ? (language === 'fr' ? 'Clair' : language === 'en' ? 'Light' : 'Claro')
                          : (language === 'fr' ? 'Sombre' : language === 'en' ? 'Dark' : 'Oscuro')
                        }
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>

                  {/* Langue */}
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {language === 'fr' ? 'Langue' : language === 'en' ? 'Language' : 'Idioma'}
                      </span>
                    </div>
                    <div className="flex gap-2 ml-13">
                      {[
                        { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
                        { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
                        { code: 'es' as Language, name: 'Español', flag: '🇪🇸' }
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setLanguage(lang.code)}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                            language === lang.code
                              ? 'bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-md'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <span className="mr-1">{lang.flag}</span>
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section Notifications */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                      {language === 'fr' ? 'Notifications' : language === 'en' ? 'Notifications' : 'Notificaciones'}
                    </h3>
                  </div>
                  
                  <button 
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                        {notificationsEnabled ? (
                          <Bell className="w-5 h-5 text-rose-600" />
                        ) : (
                          <BellOff className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-medium text-gray-700 block">
                          {language === 'fr' ? 'Rappels quotidiens' : language === 'en' ? 'Daily reminders' : 'Recordatorios diarios'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {notificationsEnabled 
                            ? (language === 'fr' ? 'Activés' : language === 'en' ? 'Enabled' : 'Activados')
                            : (language === 'fr' ? 'Désactivés' : language === 'en' ? 'Disabled' : 'Desactivados')
                          }
                        </span>
                      </div>
                    </div>
                    <Switch
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </button>
                </div>

                {/* Section Support */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                      {language === 'fr' ? 'Support' : language === 'en' ? 'Support' : 'Soporte'}
                    </h3>
                  </div>
                  
                  <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                        <HelpCircle className="w-5 h-5 text-violet-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {language === 'fr' ? 'FAQ & Aide' : language === 'en' ? 'FAQ & Help' : 'FAQ y Ayuda'}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                        <Star className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {language === 'fr' ? 'Noter l\'application' : language === 'en' ? 'Rate the app' : 'Calificar la app'}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Section Compte */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                      {language === 'fr' ? 'Compte' : language === 'en' ? 'Account' : 'Cuenta'}
                    </h3>
                  </div>
                  
                  {user ? (
                    <>
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-rose-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-gray-700 block truncate">{user.email}</span>
                            <span className="text-xs text-emerald-600 font-medium">
                              {language === 'fr' ? 'Connecté' : language === 'en' ? 'Connected' : 'Conectado'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (confirm(language === 'fr' ? 'Voulez-vous vous déconnecter ?' : language === 'en' ? 'Sign out?' : '¿Cerrar sesión?')) {
                            signOut();
                          }
                        }}
                        className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors text-red-600"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                            <LogOut className="w-5 h-5 text-red-600" />
                          </div>
                          <span className="text-sm font-medium">
                            {language === 'fr' ? 'Se déconnecter' : language === 'en' ? 'Sign out' : 'Cerrar sesión'}
                          </span>
                        </div>
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setShowAuthDialog(true)}
                      className="w-full flex items-center justify-between p-4 hover:bg-emerald-50 transition-colors text-emerald-600"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <LogIn className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium">
                          {language === 'fr' ? 'Se connecter' : language === 'en' ? 'Sign in' : 'Iniciar sesión'}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Version app */}
                <div className="text-center py-4">
                  <p className="text-xs text-gray-400">
                    Glow Up Challenge v2.0
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    © 2026 Glowee ✨
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation - Glassmorphism Rose Pastel - Taille réduite */}
      {currentView !== 'goal-details' && (
        <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md z-50">
          <div className="bg-white/80 backdrop-blur-md rounded-[1.5rem] shadow-2xl shadow-pink-200/50 px-2 py-1.5 border border-pink-100/50">
            <div className="flex items-center justify-around">
              <Button
                variant="ghost"
                className={`flex-1 h-9 flex-col gap-0.5 rounded-lg transition-all duration-200 ${
                  currentView === 'dashboard'
                    ? 'bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600'
                    : 'text-gray-500 hover:text-pink-500 hover:bg-pink-50/50'
                }`}
                onClick={() => setCurrentView('dashboard')}
              >
                <Home className="w-4 h-4" />
                <span className="text-[9px] font-semibold">{t.nav.home}</span>
              </Button>

              <Button
                variant="ghost"
                className={`flex-1 h-9 flex-col gap-0.5 rounded-lg transition-all duration-200 ${
                  currentView === 'routine'
                    ? 'bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600'
                    : 'text-gray-500 hover:text-pink-500 hover:bg-pink-50/50'
                }`}
                onClick={() => setCurrentView('routine')}
              >
                <Calendar className="w-4 h-4" />
                <span className="text-[9px] font-semibold">
                  {language === 'fr' ? 'Ma Semaine' : language === 'en' ? 'My Week' : 'Mi Semana'}
                </span>
              </Button>

              <Button
                variant="ghost"
                className={`flex-1 h-9 flex-col gap-0.5 rounded-lg transition-all duration-200 ${
                  currentView === 'trackers'
                    ? 'bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600'
                    : 'text-gray-500 hover:text-pink-500 hover:bg-pink-50/50'
                }`}
                onClick={() => setCurrentView('trackers')}
              >
                <Target className="w-4 h-4" />
                <span className="text-[9px] font-semibold">{t.nav.trackers}</span>
              </Button>

              <Button
                variant="ghost"
                className={`flex-1 h-9 flex-col gap-0.5 rounded-lg transition-all duration-200 ${
                  currentView === 'settings'
                    ? 'bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600'
                    : 'text-gray-500 hover:text-pink-500 hover:bg-pink-50/50'
                }`}
                onClick={() => setCurrentView('settings')}
              >
                <Settings className="w-4 h-4" />
                <span className="text-[9px] font-semibold">{t.nav.settings}</span>
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

            {/* Sélection de la couleur (lié à un objectif) */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">
                {language === 'fr' ? 'Couleur (objectif associé)' : language === 'en' ? 'Color (linked goal)' : 'Color (objetivo asociado)'}
              </label>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {language === 'fr' ? 'Sélectionnez une couleur pour identifier cette tâche dans votre planning' : language === 'en' ? 'Select a color to identify this task in your planning' : 'Selecciona un color para identificar esta tarea en tu planificación'}
              </p>
              <div className="flex gap-3 justify-center py-2">
                {([
                  { value: '#f43f5e', label: language === 'fr' ? '🌹 Rose' : language === 'en' ? '🌹 Rose' : '🌹 Rosa', ring: 'ring-rose-400' },
                  { value: '#3b82f6', label: language === 'fr' ? '💙 Bleu' : language === 'en' ? '💙 Blue' : '💙 Azul', ring: 'ring-blue-400' },
                  { value: '#10b981', label: language === 'fr' ? '💚 Vert' : language === 'en' ? '💚 Green' : '💚 Verde', ring: 'ring-emerald-400' },
                ] as const).map((colorOpt) => {
                  // Trouver l'objectif associé à cette couleur
                  const associatedGoal = goalsWithPriorities.find(g => g.color === colorOpt.value);
                  return (
                    <button
                      key={colorOpt.value}
                      onClick={() => {
                        if (newTaskColor === colorOpt.value) {
                          setNewTaskColor(null);
                          setNewTaskGoalId(null);
                        } else {
                          setNewTaskColor(colorOpt.value);
                          setNewTaskGoalId(associatedGoal?.id || null);
                        }
                      }}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                        newTaskColor === colorOpt.value
                          ? `ring-2 ${colorOpt.ring} ring-offset-2 bg-white dark:bg-stone-800`
                          : 'hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full transition-transform ${
                          newTaskColor === colorOpt.value ? 'scale-110' : ''
                        }`}
                        style={{ backgroundColor: colorOpt.value }}
                      />
                      <span className="text-xs font-medium">{colorOpt.label}</span>
                      {associatedGoal && (
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 max-w-[80px] truncate">
                          {associatedGoal.name}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {!newTaskColor && (
                <p className="text-xs text-amber-600 dark:text-amber-400 text-center italic">
                  {language === 'fr' ? '⚠️ Choisissez une couleur pour lier à un objectif' : language === 'en' ? '⚠️ Choose a color to link to a goal' : '⚠️ Elige un color para vincular a un objetivo'}
                </p>
              )}
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
              onClick={async () => {
                if (newTaskText.trim()) {
                  if (newTaskDestination === 'priority') {
                    // Ajouter aux priorités de la semaine
                    if (weekPriorities.length < 3) {
                      const newTask = {
                        id: `task_${Date.now()}`,
                        text: newTaskText,
                        completed: false
                      };
                      setWeekPriorities([...weekPriorities, newTask]);
                    } else {
                      alert(language === 'fr' ? 'Vous avez déjà 3 priorités!' : language === 'en' ? 'You already have 3 priorities!' : '¡Ya tienes 3 prioridades!');
                      return;
                    }
                  } else {
                    // Ajouter aux tâches avec dates (nouveau système)
                    const today = new Date();
                    const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

                    // Trouver la date correspondant au jour sélectionné
                    let targetDate = '';
                    for (let i = 0; i < 7; i++) {
                      const date = new Date(today);
                      date.setDate(today.getDate() + i);
                      const dayIndex = date.getDay();
                      const dayKey = dayKeys[dayIndex];
                      if (dayKey === newTaskDestination) {
                        targetDate = getLocalDateString(date);
                        break;
                      }
                    }

                    const newTaskWithDate = {
                      id: `user_${Date.now()}_${Math.random()}`,
                      text: newTaskText,
                      date: targetDate,
                      completed: false,
                      type: 'user' as const,
                      goalColor: newTaskColor || undefined,
                      goalId: newTaskGoalId || undefined
                    };

                    setTasksWithDates(prev => [...prev, newTaskWithDate]);

                    // Sauvegarder dans Firebase si l'utilisateur est connecté
                    if (user) {
                      try {
                        const firebaseId = await saveTask(user.uid, newTaskWithDate);
                        // Mettre à jour l'ID local avec l'ID Firebase
                        setTasksWithDates(prev => prev.map(t =>
                          t.id === newTaskWithDate.id ? { ...t, id: firebaseId } : t
                        ));
                      } catch (error) {
                        console.error('Error saving task to Firebase:', error);
                      }
                    }
                  }

                  setNewTaskText('');
                  setNewTaskDestination('priority');
                  setNewTaskColor(null);
                  setNewTaskGoalId(null);
                  setShowAddTask(false);
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
                  setSelectedDate(getLocalDateString(date));
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
        source={subscriptionSource}
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

      {/* Popup de série - Beauty Challenge */}
      {showBeautyStreakPopup && (
        <div className="fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top duration-500">
          <div className="max-w-md mx-auto mt-4 px-4">
            <Card className="border-none shadow-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-3xl overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {/* Icône flamme */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 via-pink-400 to-orange-300 flex items-center justify-center shadow-lg">
                      <span className="text-3xl">🔥</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg font-bold shadow-md animate-in zoom-in duration-700">
                      1
                    </div>
                  </div>

                  {/* Texte et jours de la semaine */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {language === 'fr' ? 'Votre série' : language === 'en' ? 'Your streak' : 'Tu serie'}
                    </h3>
                    <div className="flex gap-1.5">
                      {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => {
                        const isToday = index === 0; // Premier jour pour la démonstration
                        return (
                          <div
                            key={day}
                            className={`flex flex-col items-center ${isToday ? 'animate-in zoom-in duration-700' : ''}`}
                          >
                            <span className="text-[9px] text-gray-500 mb-1">{day.slice(0, 3)}</span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isToday 
                                ? 'bg-gradient-to-br from-purple-400 to-pink-400 shadow-lg' 
                                : 'bg-gray-200'
                            }`}>
                              {isToday && <Check className="w-4 h-4 text-white animate-in zoom-in duration-1000" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bouton fermer */}
                  <button
                    onClick={() => setShowBeautyStreakPopup(false)}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Popup Glowee déçu - Journée incomplète */}
      {showBeautyIncompletePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="border-none shadow-2xl bg-white rounded-3xl max-w-md w-full overflow-hidden animate-in zoom-in duration-300">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                {/* Glowee déçu */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full blur-xl opacity-40"></div>
                    <Image
                      src="/Glowee/glowee-decu.webp"
                      alt="Glowee déçu"
                      width={120}
                      height={130}
                      className="object-contain relative z-10 drop-shadow-2xl"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-800">
                    {language === 'fr' ? 'Hmm...' : language === 'en' ? 'Hmm...' : 'Hmm...'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'fr' 
                      ? 'Es-tu sûr·e de vouloir valider cette journée incomplète ?' 
                      : language === 'en' 
                      ? 'Are you sure you want to validate this incomplete day?' 
                      : '¿Estás seguro de que quieres validar este día incompleto?'}
                  </p>
                </div>

                {/* Boutons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowBeautyIncompletePopup(false)}
                    className="flex-1 px-3 py-2 text-sm bg-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-300 transition-all"
                  >
                    {language === 'fr' ? 'Annuler' : language === 'en' ? 'Cancel' : 'Cancelar'}
                  </button>
                  <button
                    onClick={() => {
                      setShowBeautyIncompletePopup(false);
                      // Pas d'ajout de croix ni de popup de série
                    }}
                    className="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    {language === 'fr' ? 'Valider quand même' : language === 'en' ? 'Validate anyway' : 'Validar de todos modos'}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Animation CSS pour fade out des habitudes complétées */}
      <style jsx global>{`
        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
