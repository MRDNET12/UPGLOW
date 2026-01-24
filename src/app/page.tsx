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
import { Sparkles, BookOpen, TrendingUp, Home, Heart, Target, Layers, Gift, Settings, ChevronRight, ChevronLeft, ChevronDown, Check, Plus, X, Minus, Calendar, Moon, Sun, Droplet, Zap, Smile, Activity, Utensils, Lightbulb, Image as ImageIcon, Trash2, Download, Bell, BellOff, Star, CheckSquare, ListChecks, Award, Globe, LogIn, LogOut, User, Crown } from 'lucide-react';
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
import { MyGoals } from '@/components/goals/MyGoals';
import { GoalWorkspacePage } from '@/components/goals/GoalWorkspacePage';
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
  const [subscriptionSource, setSubscriptionSource] = useState<'button' | 'trial_expired'>('trial_expired');

  // États pour les popups Glowee
  const [showGloweeWelcome, setShowGloweeWelcome] = useState(false);
  const [showGloweeFifthVisit, setShowGloweeFifthVisit] = useState(false);
  const [showGloweePlanningWelcome, setShowGloweePlanningWelcome] = useState(false);
  const [showGloweeJournalWelcome, setShowGloweeJournalWelcome] = useState(false);

  // États pour le message Glowee avec effet typing et rotation toutes les 10 minutes
  const [gloweeMessageIndex, setGloweeMessageIndex] = useState(0);
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [hasShownFirstMessage, setHasShownFirstMessage] = useState(false);

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

  // Bloc par défaut unique et non-modifiable
  const getDefaultHabitBlocks = () => [
    {
      id: 'essential-today',
      name: language === 'fr' ? 'Ce qui compte aujourd\'hui.' : language === 'en' ? 'What matters today.' : 'Lo que importa hoy.',
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
  const [planningTab, setPlanningTab] = useState<'my-tasks' | 'glowee-tasks'>('my-tasks');
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
  const [selectedGoalForPriorities, setSelectedGoalForPriorities] = useState<string | null>(null);

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDestination, setNewTaskDestination] = useState<'priority' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>('priority');
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

      // Vérifier si c'est la 1ère visite du journal
      if (currentView === 'journal' && isFirstVisit('journal')) {
        setTimeout(() => setShowGloweeJournalWelcome(true), 1000);
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

  // Note: Le chargement et la sauvegarde des tâches avec dates sont maintenant gérés par usePlanningSync
  // qui charge depuis Firebase au montage et synchronise automatiquement les changements

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

            {/* Message Glowee - Style glassmorphism - Hauteur réduite 50% + Glowee débordante en bas */}
            <div className="relative">
              <Card className="border-none shadow-xl shadow-pink-100/50 bg-white/80 backdrop-blur-md rounded-3xl overflow-visible">
                <CardContent className="p-0">
                  <div className="flex items-center gap-1.5 py-1 px-2.5 pl-16 min-h-[32px]">
                    {/* Message avec rotation et effet typing - sans mention Glowee */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-gray-700 leading-snug font-medium">
                        {displayedMessage}
                        {isTyping && <span className="animate-pulse">|</span>}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Image Glowee débordante en bas - positionnée à l'extérieur de la carte */}
              <div className="absolute left-1 top-1/2 -translate-y-1/4 w-14 h-16 z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 rounded-xl blur-md opacity-40"></div>
                <Image
                  src="/Glowee/glowee.webp"
                  alt="Glowee"
                  width={56}
                  height={64}
                  className="object-contain relative z-10 drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Trial Badge, Plan Pro Button, Message à moi et Challenge Switch Button */}
            <div className="flex items-center justify-center gap-2 relative">
              {/* Container avec animation de switch */}
              <div className="relative flex-1 flex justify-center items-center">
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

              {/* Bouton Challenge Switch - toujours visible */}
              <button
                onClick={() => setShowChallengeDrawer(true)}
                className="p-2.5 rounded-full bg-white shadow-lg shadow-pink-100/50 hover:shadow-xl transition-all flex-shrink-0"
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

            {/* Grille de cartes - 3 colonnes pour les 3 premières cartes */}
            <div className="grid grid-cols-3 gap-3">
              {/* Carte Mes Habitudes */}
              <Card
                className="border-none shadow-xl shadow-orange-100/50 bg-gradient-to-br from-orange-50 via-pink-50 to-white rounded-[1.5rem] cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                onClick={() => setCurrentView('trackers')}
              >
                <CardContent className="p-3 relative overflow-hidden">
                  <div className="absolute -top-1 -right-1 text-3xl opacity-10 drop-shadow-lg">
                    📚
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xs font-bold text-gray-800 mb-2">
                      {language === 'fr' ? 'Mes Habitudes' : language === 'en' ? 'My Habits' : 'Mis Hábitos'}
                    </h3>
                    <div className="px-2 py-1.5 bg-white/60 backdrop-blur-sm text-gray-700 text-[10px] font-medium rounded-full text-center">
                      {(() => {
                        const todayTracker = getTodayTracker();
                        const completedHabits = Object.values(todayTracker.habits).filter(Boolean).length;
                        const totalHabits = 5 + customHabits.length;
                        return `${completedHabits}/${totalHabits}`;
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mon Journal */}
              <Card
                className="border-none shadow-xl shadow-purple-100/50 bg-gradient-to-br from-purple-50 via-pink-50 to-white rounded-[1.5rem] cursor-pointer transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
                onClick={() => setCurrentView('journal')}
              >
                <CardContent className="p-3 relative overflow-hidden">
                  <div className="absolute -top-1 -right-1 text-3xl opacity-10 drop-shadow-lg">
                    📖
                  </div>
                  <div className="relative z-10">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-8 h-8 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-lg">
                        <BookOpen className="w-4 h-4 text-purple-400" />
                      </div>
                      <h3 className="font-bold text-xs text-gray-800 text-center">{t.journal.title}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ma semaine */}
              <Card
                className="border-none shadow-xl shadow-pink-100/50 bg-gradient-to-br from-pink-50 via-rose-50 to-white rounded-[1.5rem] cursor-pointer transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
                onClick={() => setCurrentView('routine')}
              >
                <CardContent className="p-3 relative overflow-hidden">
                  {/* Emoji chef en bas touchant la bordure */}
                  <div className="absolute -bottom-1 -right-1 text-3xl opacity-10 drop-shadow-lg">
                    👩‍🍳
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xs font-bold text-gray-800 mb-2 text-center">
                      {language === 'fr' ? 'Ma semaine' : language === 'en' ? 'My week' : 'Mi semana'}
                    </h3>
                    <div className="px-2 py-1.5 bg-white/60 backdrop-blur-sm text-gray-700 text-[10px] font-medium rounded-full text-center">
                      {(() => {
                        // Calculer les dates de la semaine en cours (lundi à dimanche)
                        const today = new Date();
                        const dayOfWeek = today.getDay();
                        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                        const monday = new Date(today);
                        monday.setDate(today.getDate() + diffToMonday);
                        const sunday = new Date(monday);
                        sunday.setDate(monday.getDate() + 6);

                        // Filtrer les tâches utilisateur de la semaine
                        const userTasksThisWeek = tasksWithDates.filter(task => {
                          if (task.type !== 'user') return false;
                          const taskDate = new Date(task.date);
                          return taskDate >= monday && taskDate <= sunday;
                        });

                        const completedUserTasks = userTasksThisWeek.filter(task => task.completed).length;
                        const totalUserTasks = userTasksThisWeek.length;

                        return `${completedUserTasks}/${totalUserTasks}`;
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Grille de cartes - 2 colonnes pour Objectifs et autres */}
            <div className="grid grid-cols-2 gap-3">

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

              {/* Carte Glow Up (Bonus) - hauteur adaptée à Objectifs */}
              <Card
                className="border-none shadow-xl shadow-pink-100/50 bg-gradient-to-br from-pink-100 via-purple-50 to-orange-50 rounded-[1.5rem] cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                onClick={() => setCurrentView('bonus')}
              >
                <CardContent className="p-4 relative overflow-hidden">
                  <div className="absolute -top-2 -right-2 text-5xl opacity-10 drop-shadow-lg">
                    ✨
                  </div>
                  <div className="relative z-10">
                    <p className="text-xs text-gray-500 mb-1 font-medium">
                      {language === 'fr' ? 'Routine & Guides' : language === 'en' ? 'Routine & Guides' : 'Rutina & Guías'}
                    </p>
                    <h3 className="text-sm font-bold text-gray-800 mb-3">{t.bonus.title}</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <Gift className="w-5 h-5 text-pink-400" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Carte 8 Limites */}
            <Card
              className="border-none shadow-xl shadow-pink-100/50 bg-white/80 backdrop-blur-md rounded-3xl cursor-pointer transition-all duration-300 hover:scale-[1.01]"
              onClick={() => setCurrentView('boundaries')}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center shadow-lg">
                    <span className="text-xl drop-shadow-sm">🛡️</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-gray-800">
                      {language === 'fr' ? '8 Limites' : language === 'en' ? '8 Boundaries' : '8 Límites'}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-medium">
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
                            ].filter(Boolean)
                            // Trier: tâches non complétées en haut, complétées en bas
                            .sort((a, b) => {
                              const aCompleted = isActionCompleted(currentDay, a.key);
                              const bCompleted = isActionCompleted(currentDay, b.key);
                              if (aCompleted === bCompleted) return 0;
                              return aCompleted ? 1 : -1;
                            })
                            .map((action, index) => {
                              const isCompleted = isActionCompleted(currentDay, action.key);

                              // Cas spécial pour l'action "vision" avec lien cliquable
                              if (action.key === 'vision' && (action.value === 'OBJECTIF_LINK' || action.value === 'OBJECTIF_LINK_DAY2')) {
                                return (
                                  <div
                                    key={index}
                                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-500 ease-in-out hover:scale-[1.02] bg-gradient-to-br from-white to-pink-50 shadow-md hover:shadow-lg ${isCompleted ? 'opacity-60' : ''}`}
                                    onClick={() => toggleActionCompletion(currentDay, action.key)}
                                    style={{
                                      transform: isCompleted ? 'translateY(0)' : 'translateY(0)',
                                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                  >
                                    <div className="flex items-start gap-3">
                                      <span className="text-3xl drop-shadow-lg">{action.icon}</span>
                                      <div className="flex-1">
                                        <h4 className={`font-bold text-sm mb-1 text-gray-800 transition-all duration-300 ${isCompleted ? 'line-through' : ''}`}>{action.label}</h4>
                                        <p className={`text-sm transition-all duration-300 ${isCompleted ? 'line-through text-gray-400' : 'text-gray-600'}`}>
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
                                      {isCompleted && <Check className="w-6 h-6 text-green-500 flex-shrink-0 drop-shadow-lg animate-in fade-in duration-300" />}
                                    </div>
                                  </div>
                                );
                              }

                              // Rendu normal pour les autres actions
                              return (
                                <div
                                  key={index}
                                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-500 ease-in-out hover:scale-[1.02] bg-gradient-to-br from-white to-pink-50 shadow-md hover:shadow-lg ${isCompleted ? 'opacity-60' : ''}`}
                                  onClick={() => toggleActionCompletion(currentDay, action.key)}
                                  style={{
                                    transform: isCompleted ? 'translateY(0)' : 'translateY(0)',
                                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
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

        {/* Trackers View - Life Hub Design */}
        {currentView === 'trackers' && (
          <div className="pb-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
            {/* Header moderne avec météo et profil */}
            <div className="p-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                {/* Météo widget */}
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
                  <div className="text-4xl">☀️</div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">22°C</div>
                    <div className="text-xs text-gray-600">
                      {new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', { weekday: 'short' })}
                    </div>
                  </div>
                </div>

                {/* Profil */}
                <button className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {user?.email?.[0].toUpperCase() || 'U'}
                </button>
              </div>

              {/* Titre principal */}
              <h1 className="text-5xl font-black text-center text-gray-900 mb-6">
                Life Hub
              </h1>

              {/* Navigation par onglets - Sans Goals */}
              <div className="flex gap-6 justify-center mb-8">
                <button
                  onClick={() => setHabitTab('tasks')}
                  className={`text-lg font-semibold transition-all ${
                    habitTab === 'tasks'
                      ? 'text-gray-900 border-b-2 border-gray-900'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {language === 'fr' ? 'Tâches' : language === 'en' ? 'Tasks' : 'Tareas'}
                </button>
                <button
                  onClick={() => setHabitTab('growth')}
                  className={`text-lg font-semibold transition-all ${
                    habitTab === 'growth'
                      ? 'text-gray-900 border-b-2 border-gray-900'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {language === 'fr' ? 'Croissance' : language === 'en' ? 'Growth' : 'Crecimiento'}
                </button>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="px-4 max-w-2xl mx-auto space-y-3">
              {/* Onglet Tasks - Blocs d'habitudes */}
              {habitTab === 'tasks' && (
                <div className="space-y-3">
                  {/* Section Intention du jour - Tout en haut */}
                  <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-4 shadow-lg">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">
                      {language === 'fr' ? 'Aujourd\'hui, je suis quelqu\'un qui…' : language === 'en' ? 'Today, I am someone who…' : 'Hoy, soy alguien que…'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { fr: 'se respecte', en: 'respects themselves', es: 'se respeta' },
                        { fr: 'avance même lentement', en: 'moves forward even slowly', es: 'avanza aunque sea lentamente' },
                        { fr: 'prend soin de son énergie', en: 'takes care of their energy', es: 'cuida su energía' },
                        { fr: 'tient parole', en: 'keeps their word', es: 'cumple su palabra' }
                      ].map((intention) => {
                        const label = language === 'fr' ? intention.fr : language === 'en' ? intention.en : intention.es;
                        const isSelected = dailyIntention === label;
                        return (
                          <button
                            key={label}
                            onClick={() => {
                              if (!dailyIntention) {
                                setDailyIntention(label);
                                const messages = [
                                  language === 'fr' ? 'C\'est noté.' : language === 'en' ? 'Noted.' : 'Anotado.',
                                  language === 'fr' ? 'Tu t\'engages envers toi.' : language === 'en' ? 'You commit to yourself.' : 'Te comprometes contigo.',
                                  language === 'fr' ? 'Tu honores cette intention.' : language === 'en' ? 'You honor this intention.' : 'Honras esta intención.',
                                  language === 'fr' ? 'Alignement confirmé.' : language === 'en' ? 'Alignment confirmed.' : 'Alineación confirmada.',
                                  language === 'fr' ? 'C\'est assumé.' : language === 'en' ? 'It\'s owned.' : 'Está asumido.',
                                  language === 'fr' ? 'Tu avances avec ça.' : language === 'en' ? 'You move forward with this.' : 'Avanzas con esto.'
                                ];
                                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                                setIntentionFeedbackMessage(randomMessage);
                                setShowIntentionFeedback(true);
                                setTimeout(() => setShowIntentionFeedback(false), 3000);
                              }
                            }}
                            disabled={!!dailyIntention}
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                              isSelected
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                                : dailyIntention
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    {showIntentionFeedback && (
                      <p className="mt-3 text-xs font-medium text-purple-600 italic animate-pulse">
                        {intentionFeedbackMessage}
                      </p>
                    )}
                  </div>

                  {/* Section Comment je me sens ? */}
                  <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-2xl p-4 shadow-lg">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">
                      {language === 'fr' ? 'Comment je me sens ?' : language === 'en' ? 'How do I feel?' : '¿Cómo me siento?'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { fr: 'Calme', en: 'Calm', es: 'Tranquilo', emoji: '😌' },
                        { fr: 'Fatigué', en: 'Tired', es: 'Cansado', emoji: '😴' },
                        { fr: 'Fier', en: 'Proud', es: 'Orgulloso', emoji: '😊' },
                        { fr: 'Triste', en: 'Sad', es: 'Triste', emoji: '😔' },
                        { fr: 'Neutre', en: 'Neutral', es: 'Neutral', emoji: '😐' }
                      ].map((feeling) => {
                        const label = language === 'fr' ? feeling.fr : language === 'en' ? feeling.en : feeling.es;
                        const isSelected = dailyFeeling === label;
                        return (
                          <button
                            key={label}
                            onClick={() => setDailyFeeling(label)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                              isSelected
                                ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                            }`}
                          >
                            {feeling.emoji} {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Blocs d'habitudes thématiques - Mode liste fixe */}
                  <div className="space-y-3">
                    {habitBlocks.map((block) => (
                      <div
                        key={block.id}
                        className={`relative bg-gradient-to-br ${block.color} rounded-2xl pl-4 pr-2 shadow-lg break-inside-avoid mb-3 ${block.isDefault ? 'py-4 pt-9' : 'py-4'}`}
                      >
                        {/* Badge "Adopte des nouvelles habitudes pour Glow Up" en superposition sur la bordure haut - Seulement pour le bloc par défaut */}
                        {block.isDefault && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <div className="px-3 py-1 bg-gradient-to-r from-white via-gray-100 to-gray-200 rounded-full shadow-md border border-gray-200">
                              <span className="text-[10px] font-bold text-gray-700 whitespace-nowrap">
                                {language === 'fr' ? 'Adopte des nouvelles habitudes pour Glow Up' : language === 'en' ? 'Adopt new habits for Glow Up' : 'Adopta nuevos hábitos para Glow Up'}
                              </span>
                            </div>
                          </div>
                        )}
                        {/* Bouton supprimer en superposition - Seulement si ce n'est pas le bloc par défaut */}
                        {!block.isDefault && (
                          <div className="absolute -top-2 right-2">
                            <button
                              onClick={() => {
                                setHabitBlocks(habitBlocks.filter(b => b.id !== block.id));
                              }}
                              className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 shadow-md hover:shadow-lg flex items-center justify-center border border-gray-200"
                            >
                              <X className="w-4 h-4 text-gray-900" />
                            </button>
                          </div>
                        )}

                        {/* Header du bloc */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-2xl">{block.icon}</div>
                            <h3 className="text-lg font-bold text-gray-900">{block.name}</h3>
                          </div>
                          {block.description && (
                            <p className="text-xs text-gray-600 italic ml-8">{block.description}</p>
                          )}
                        </div>

                      {/* Liste des habitudes - Avec bouton - à gauche seulement si ce n'est pas le bloc par défaut */}
                      {!block.collapsed && (
                        <div className="space-y-1">
                          {/* Trier les habitudes : non complétées en haut, complétées en bas */}
                          {[...block.habits].sort((a, b) => {
                            if (a.completed === b.completed) return 0;
                            return a.completed ? 1 : -1;
                          }).map((habit) => (
                            <div
                              key={habit.id}
                              className={`flex items-center gap-1 transition-all duration-500 ease-in-out ${
                                habit.completed ? 'opacity-0 animate-fade-out' : 'opacity-100'
                              }`}
                              style={{
                                animation: habit.completed ? 'fadeOut 2s ease-in-out forwards' : 'none'
                              }}
                            >
                              {!block.isDefault && (
                                <button
                                  onClick={() => {
                                    setHabitBlocks(habitBlocks.map(b =>
                                      b.id === block.id
                                        ? { ...b, habits: b.habits.filter(h => h.id !== habit.id) }
                                        : b
                                    ));
                                  }}
                                  className="w-4 h-4 flex items-center justify-center text-gray-600 hover:text-gray-900 flex-shrink-0"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setHabitBlocks(habitBlocks.map(b =>
                                    b.id === block.id
                                      ? {
                                          ...b,
                                          habits: b.habits.map(h =>
                                            h.id === habit.id ? { ...h, completed: !h.completed } : h
                                          )
                                        }
                                      : b
                                  ));
                                }}
                                className="flex-1 text-left"
                              >
                                <div className={`text-sm font-medium text-gray-900 transition-all duration-500 ${habit.completed ? 'line-through opacity-50' : ''}`}>
                                  {habit.label}
                                </div>
                              </button>
                            </div>
                          ))}

                          {/* Formulaire d'ajout d'habitude */}
                          {addingHabitToBlock === block.id ? (
                            <div className="mt-2 flex gap-1">
                              <Input
                                value={newBlockHabitLabel}
                                onChange={(e) => setNewBlockHabitLabel(e.target.value)}
                                placeholder={language === 'fr' ? 'Nom de l\'habitude' : language === 'en' ? 'Habit name' : 'Nombre del hábito'}
                                className="h-7 text-xs flex-1"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && newBlockHabitLabel.trim()) {
                                    const newHabit = {
                                      id: `habit_${Date.now()}`,
                                      label: newBlockHabitLabel.trim(),
                                      completed: false
                                    };
                                    setHabitBlocks(habitBlocks.map(b =>
                                      b.id === block.id
                                        ? { ...b, habits: [...b.habits, newHabit] }
                                        : b
                                    ));
                                    setNewBlockHabitLabel('');
                                    setAddingHabitToBlock(null);
                                  } else if (e.key === 'Escape') {
                                    setNewBlockHabitLabel('');
                                    setAddingHabitToBlock(null);
                                  }
                                }}
                              />
                              <button
                                onClick={() => {
                                  if (newBlockHabitLabel.trim()) {
                                    const newHabit = {
                                      id: `habit_${Date.now()}`,
                                      label: newBlockHabitLabel.trim(),
                                      completed: false
                                    };
                                    setHabitBlocks(habitBlocks.map(b =>
                                      b.id === block.id
                                        ? { ...b, habits: [...b.habits, newHabit] }
                                        : b
                                    ));
                                    setNewBlockHabitLabel('');
                                    setAddingHabitToBlock(null);
                                  }
                                }}
                                className="w-7 h-7 rounded bg-green-500 hover:bg-green-600 flex items-center justify-center text-white"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setNewBlockHabitLabel('');
                                  setAddingHabitToBlock(null);
                                }}
                                className="w-7 h-7 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            !block.isDefault && (
                              <button
                                onClick={() => {
                                  setAddingHabitToBlock(block.id);
                                  setNewBlockHabitLabel('');
                                }}
                                className="w-full flex items-center gap-1 mt-2 text-xs text-gray-600 hover:text-gray-900"
                              >
                                <Plus className="w-3 h-3" />
                                <span>{language === 'fr' ? 'Ajouter' : language === 'en' ? 'Add' : 'Agregar'}</span>
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  </div>

                  {/* Bouton créer un nouveau bloc - Réduit de 40% */}
                  {!showCreateBlock ? (
                    <div className="flex justify-center">
                      <button
                        onClick={() => setShowCreateBlock(true)}
                        className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border-2 border-dashed border-gray-300 hover:bg-white transition-all shadow-lg"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-semibold text-gray-700">
                          {language === 'fr' ? 'Créer un nouveau bloc' : language === 'en' ? 'Create new block' : 'Crear nuevo bloque'}
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl p-6 shadow-xl space-y-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {language === 'fr' ? 'Nouveau bloc d\'habitudes' : language === 'en' ? 'New habit block' : 'Nuevo bloque de hábitos'}
                      </h3>

                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            {language === 'fr' ? 'Nom du bloc' : language === 'en' ? 'Block name' : 'Nombre del bloque'}
                          </label>
                          <Input
                            value={newBlockName}
                            onChange={(e) => setNewBlockName(e.target.value)}
                            placeholder={language === 'fr' ? 'Ex: Routine du soir' : language === 'en' ? 'Ex: Evening routine' : 'Ej: Rutina nocturna'}
                            className="h-12"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            {language === 'fr' ? 'Icône' : language === 'en' ? 'Icon' : 'Icono'}
                          </label>
                          <div className="flex gap-2 flex-wrap">
                            {['📝', '🌙', '💪', '🧘', '📚', '🎯', '💡', '🌟'].map((icon) => (
                              <button
                                key={icon}
                                onClick={() => setNewBlockIcon(icon)}
                                className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                                  newBlockIcon === icon
                                    ? 'bg-blue-500 scale-110'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                              >
                                {icon}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            {language === 'fr' ? 'Couleur' : language === 'en' ? 'Color' : 'Color'}
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { name: 'Blue', value: 'from-blue-100 to-indigo-100' },
                              { name: 'Pink', value: 'from-pink-100 to-rose-100' },
                              { name: 'Green', value: 'from-green-100 to-emerald-100' },
                              { name: 'Purple', value: 'from-purple-100 to-violet-100' },
                              { name: 'Orange', value: 'from-orange-100 to-yellow-100' },
                              { name: 'Teal', value: 'from-teal-100 to-cyan-100' },
                              { name: 'White', value: 'from-white to-gray-50' },
                              { name: 'Black', value: 'from-gray-800 to-gray-900' }
                            ].map((color) => (
                              <button
                                key={color.value}
                                onClick={() => setNewBlockColor(color.value)}
                                className={`h-12 rounded-xl bg-gradient-to-br ${color.value} border-2 transition-all ${
                                  newBlockColor === color.value
                                    ? 'border-gray-900 scale-105'
                                    : color.name === 'White' ? 'border-gray-300' : 'border-transparent'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => {
                            if (newBlockName.trim()) {
                              setHabitBlocks([
                                ...habitBlocks,
                                {
                                  id: `block_${Date.now()}`,
                                  name: newBlockName,
                                  icon: newBlockIcon,
                                  color: newBlockColor,
                                  habits: [],
                                  collapsed: false
                                }
                              ]);
                              setNewBlockName('');
                              setNewBlockIcon('📝');
                              setNewBlockColor('from-blue-100 to-indigo-100');
                              setShowCreateBlock(false);
                            }
                          }}
                          className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold"
                        >
                          {language === 'fr' ? 'Créer' : language === 'en' ? 'Create' : 'Crear'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowCreateBlock(false);
                            setNewBlockName('');
                          }}
                          className="flex-1 h-12"
                        >
                          {language === 'fr' ? 'Annuler' : language === 'en' ? 'Cancel' : 'Cancelar'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Onglet Growth */}
              {habitTab === 'growth' && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📈</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {language === 'fr' ? 'Croissance' : language === 'en' ? 'Growth' : 'Crecimiento'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'fr' ? 'Suivez votre progression' : language === 'en' ? 'Track your progress' : 'Sigue tu progreso'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Planning View - Mon Planning */}
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

            {/* Navigation Tabs - Mes tâches & Glowee tâches */}
            <div className="px-4 pb-2">
              <div className="flex gap-2 max-w-lg mx-auto">
                <button
                  onClick={() => setPlanningTab('my-tasks')}
                  className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
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
                  className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
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
                    <p className={`text-[10px] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                      {formatWeekRange(currentWeekOffset)}
                    </p>
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

                {currentWeekOffset !== 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentWeekOffset(0)}
                    className="w-full mt-2 text-xs h-7"
                  >
                    {language === 'fr' ? 'Retour à cette semaine' : language === 'en' ? 'Back to this week' : 'Volver a esta semana'}
                  </Button>
                )}
              </div>
            </div>

            {/* Contenu du planning */}
            <div className="px-4 space-y-2.5 max-w-lg mx-auto">
              {/* Légende des objectifs (seulement pour Glowee tâches et s'il y a 2+ objectifs) */}
              {planningTab === 'glowee-tasks' && (() => {
                const activeGoals = getActiveGoals();
                if (activeGoals.length >= 2) {
                  return (
                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} shadow-lg`}>
                      <h3 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-rose-400" />
                        {language === 'fr' ? 'Objectifs en cours' : language === 'en' ? 'Active goals' : 'Objetivos activos'}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {activeGoals.map((goal) => (
                          <div
                            key={goal.id}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${
                              theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50'
                            }`}
                          >
                            <div
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: goal.color }}
                            />
                            <span className="text-[10px] font-medium truncate max-w-[120px]">
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
              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} shadow-lg`}>
                <h2 className="text-sm font-bold mb-2.5 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-rose-400" />
                  {language === 'fr' ? 'Mes 3 priorités de la semaine' : language === 'en' ? 'My 3 weekly priorities' : 'Mis 3 prioridades semanales'}
                </h2>

                {/* Sélecteur d'objectif (seulement pour Glowee tâches) */}
                {planningTab === 'glowee-tasks' && goalsWithPriorities.length > 0 && (
                  <div className="mb-2.5">
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 mb-1.5">
                      {language === 'fr' ? 'Afficher les priorités de :' : language === 'en' ? 'Show priorities for:' : 'Mostrar prioridades de:'}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {goalsWithPriorities.map((goal) => (
                        <button
                          key={goal.id}
                          onClick={() => setSelectedGoalForPriorities(goal.id)}
                          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                            selectedGoalForPriorities === goal.id
                              ? theme === 'dark' ? 'bg-stone-700 ring-2 ring-offset-1 ring-offset-stone-900' : 'bg-stone-200 ring-2 ring-offset-1 ring-offset-white'
                              : theme === 'dark' ? 'bg-stone-800 hover:bg-stone-700' : 'bg-stone-50 hover:bg-stone-100'
                          }`}
                          style={selectedGoalForPriorities === goal.id ? { ringColor: goal.color } : {}}
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: goal.color }}
                          />
                          <span className="truncate max-w-[100px]">{goal.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
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
                        className={`flex items-center gap-2 p-2 rounded-lg ${
                          theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50'
                        }`}
                      >
                        {/* Indicateur de couleur pour les priorités Glowee */}
                        {planningTab === 'glowee-tasks' && selectedGoalForPriorities && (() => {
                          const selectedGoal = goalsWithPriorities.find(g => g.id === selectedGoalForPriorities);
                          return selectedGoal ? (
                            <div
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: selectedGoal.color }}
                            />
                          ) : null;
                        })()}
                        <span className={`flex-1 text-xs ${priority.completed ? 'line-through text-stone-500' : ''}`}>
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
                    const dayTasks = planningTab === 'glowee-tasks'
                      ? getTasksForDate(dateStr, 'glowee')
                      : getTasksForDate(dateStr, 'user');

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
                            className={`relative p-1.5 pr-5 rounded-md text-[10px] ${
                              task.type === 'glowee' && taskGradient
                                ? `bg-gradient-to-r ${taskGradient}`
                                : theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50'
                            }`}
                          >
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
                              className={`cursor-pointer block leading-tight ${task.completed ? 'line-through text-stone-500' : ''}`}
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

                // Sauvegarder les tâches Glowee dans Firebase si l'utilisateur est connecté
                if (user) {
                  (async () => {
                    try {
                      for (const task of newTasksWithDates) {
                        const firebaseId = await saveTask(user.uid, task);
                        // Mettre à jour l'ID local avec l'ID Firebase
                        setTasksWithDates(prev => prev.map(t =>
                          t.id === task.id ? { ...t, id: firebaseId } : t
                        ));
                      }
                    } catch (error) {
                      console.error('Error saving Glowee tasks to Firebase:', error);
                    }
                  })();
                }

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
              onShowGoalDetails={(goalId: string, goal: any) => {
                setSelectedGoalId(goalId);
                // Mettre à jour l'état goals avec le goal actuel si nécessaire
                setGoals(prev => {
                  const existingIndex = prev.findIndex(g => g.id === goalId);
                  if (existingIndex >= 0) {
                    return prev;
                  } else {
                    return [...prev, goal];
                  }
                });
                setCurrentView('goal-details');
              }}
              onGoalsChange={(updatedGoals: any[]) => {
                setGoals(updatedGoals);
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

                      // Trier: tâches non complétées en haut, complétées en bas
                      const sortedPillars = allPillars.sort((a, b) => {
                        const aChecked = newMeProgress[newMeCurrentDay]?.[a.id.toString()] || false;
                        const bChecked = newMeProgress[newMeCurrentDay]?.[b.id.toString()] || false;

                        // Les non cochées d'abord (false < true)
                        if (aChecked === bChecked) return 0;
                        return aChecked ? 1 : -1;
                      });

                      return sortedPillars.map((habit) => {
                        const isChecked = newMeProgress[newMeCurrentDay]?.[habit.id.toString()] || false;
                        const isSpecialPillar = habit.shortDescription[language] === 'OBJECTIF_LINK_DAY1' || habit.shortDescription[language] === 'OBJECTIF_LINK_DAY2';

                        return (
                          <div
                            key={habit.id}
                            className={`p-4 rounded-2xl cursor-pointer bg-gradient-to-br from-white to-pink-50 shadow-md hover:shadow-lg ${isChecked ? 'opacity-60' : ''}`}
                            style={{
                              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
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
            <div className="max-w-lg mx-auto p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentView('dashboard')}
                    className="rounded-full w-8 h-8 bg-white shadow-soft hover:bg-stone-50"
                  >
                    <X className="w-4 h-4 text-navy-900" />
                  </Button>
                  <h1 className="text-lg font-bold text-navy-900">{t.settings.title}</h1>
                </div>

                {/* Auth Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-8 h-8 bg-white shadow-soft hover:bg-stone-50"
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
                    <LogOut className="w-4 h-4 text-peach-500" />
                  ) : (
                    <LogIn className="w-4 h-4 text-peach-500" />
                  )}
                </Button>
              </div>

              {/* Progress Overview */}
              <Card className="border-none shadow-soft bg-gradient-to-br from-peach-100 to-soft-orange-100 rounded-xl">
                <CardContent className="p-3">
                  <h3 className="font-semibold mb-2 flex items-center gap-1.5 text-xs text-navy-900">
                    <div className="w-6 h-6 rounded-full bg-white/60 flex items-center justify-center">
                      <TrendingUp className="w-3 h-3 text-peach-500" />
                    </div>
                    {t.dashboard.progress}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center bg-white/60 rounded-lg p-2">
                      <p className="text-[10px] text-stone-600 font-medium">{t.dashboard.daysCompleted}</p>
                      <p className="font-bold text-sm text-navy-900">{challengeProgress.completedDays.length}/30</p>
                    </div>
                    <div className="text-center bg-white/60 rounded-lg p-2">
                      <p className="text-[10px] text-stone-600 font-medium">{t.settings.percentage}</p>
                      <p className="font-bold text-sm text-peach-600">{progressPercentage}%</p>
                    </div>
                    <div className="text-center bg-white/60 rounded-lg p-2">
                      <p className="text-[10px] text-stone-600 font-medium">{t.journal.title}</p>
                      <p className="font-bold text-sm text-navy-900">{journalEntries.length}</p>
                    </div>
                    <div className="text-center bg-white/60 rounded-lg p-2">
                      <p className="text-[10px] text-stone-600 font-medium">{t.visionBoard.title}</p>
                      <p className="font-bold text-sm text-navy-900">{visionBoardImages.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Theme Toggle */}
              <Card className="border-none shadow-soft bg-white rounded-xl">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-xs text-navy-900 flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-soft-purple-100 to-soft-purple-200 flex items-center justify-center">
                      {theme === 'light' ? (
                        <Sun className="w-3 h-3 text-soft-purple-500" />
                      ) : (
                        <Moon className="w-3 h-3 text-soft-purple-500" />
                      )}
                    </div>
                    {t.settings.theme}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-cream-100">
                    <div className="flex items-center gap-2">
                      {theme === 'light' ? (
                        <Sun className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Moon className="w-4 h-4 text-soft-purple-500" />
                      )}
                      <p className="font-semibold text-xs text-navy-900">
                        {theme === 'light' ? t.settings.light : t.settings.dark}
                      </p>
                    </div>
                    <Switch
                      checked={theme === 'dark'}
                      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Language Selection */}
              <Card className="border-none shadow-soft bg-white rounded-xl">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-xs text-navy-900 flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-peach-100 to-soft-orange-100 flex items-center justify-center">
                      <span className="text-sm">🌍</span>
                    </div>
                    {t.settings.language}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-1.5">
                  {[
                    { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
                    { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
                    { code: 'es' as Language, name: 'Español', flag: '🇪🇸' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`w-full p-2 rounded-lg border-2 transition-all ${
                        language === lang.code
                          ? 'border-peach-400 bg-gradient-to-br from-peach-50 to-soft-orange-50 shadow-soft'
                          : 'border-stone-200 bg-cream-100 hover:border-peach-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{lang.flag}</span>
                          <span className="font-semibold text-xs text-navy-900">{lang.name}</span>
                        </div>
                        {language === lang.code && (
                          <Check className="w-3.5 h-3.5 text-peach-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* FAQ */}
              <FAQSection theme={theme} />

              {/* Account / Connexion */}
              <Card className="border-none shadow-soft bg-white rounded-xl">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-xs text-navy-900 flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-peach-100 to-soft-orange-100 flex items-center justify-center">
                      <User className="w-3 h-3 text-peach-500" />
                    </div>
                    {language === 'fr' ? 'Compte' : language === 'en' ? 'Account' : 'Cuenta'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  {user ? (
                    <div className="space-y-1.5">
                      <div className="p-2 rounded-lg bg-cream-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-peach-400 to-soft-orange-400 flex items-center justify-center">
                            <User className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[10px] truncate text-navy-900">{user.email}</p>
                            {userData && (
                              <Badge className="bg-gradient-to-r from-peach-400 to-soft-orange-400 text-white text-[10px] mt-0.5">
                                ✨ Premium
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 border-stone-200 rounded-lg h-7 text-xs"
                        onClick={async () => {
                          if (confirm(language === 'fr' ? 'Êtes-vous sûr de vouloir vous déconnecter ?' : language === 'en' ? 'Are you sure you want to sign out?' : '¿Estás seguro de que quieres cerrar sesión?')) {
                            await signOut();
                          }
                        }}
                      >
                        <LogOut className="mr-1.5 w-3.5 h-3.5" />
                        <span className="text-xs">{language === 'fr' ? 'Se déconnecter' : language === 'en' ? 'Sign out' : 'Cerrar sesión'}</span>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-peach-400 to-soft-orange-400 hover:from-peach-500 hover:to-soft-orange-500 text-white rounded-xl py-3 shadow-soft-lg font-semibold h-9 text-xs"
                      onClick={() => setShowAuthDialog(true)}
                    >
                      <LogIn className="mr-1.5 w-3.5 h-3.5" />
                      <span>{language === 'fr' ? 'Se connecter' : language === 'en' ? 'Sign in' : 'Iniciar sesión'}</span>
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
                      type: 'user' as const
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
