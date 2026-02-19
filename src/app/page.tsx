'use client';

import { useEffect, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
import { boundaries } from '@/lib/boundaries-data';
import { Sparkles, BookOpen, TrendingUp, Home, Heart, Target, Layers, Gift, Settings, ChevronRight, ChevronLeft, ChevronDown, Check, Plus, X, Minus, Calendar, Moon, Sun, Droplet, Zap, Smile, Activity, Utensils, Lightbulb, Wand2, Image as ImageIcon, Trash2, Download, Bell, BellOff, Star, CheckSquare, ListChecks, Award, Globe, LogIn, LogOut, User, Crown, Shield, Frown, Meh, HelpCircle, MoreHorizontal, Mail, Share2, ArrowRight, Eye, EyeOff, Flame, LayoutGrid, Palette, Trophy } from 'lucide-react';
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
import { GoalSetup5 } from '@/components/GoalSetup5';
import { GoalSetup1 } from '@/components/GoalSetup1';
import { FlowDescriptionPage } from '@/components/FlowDescriptionPage';
import { FlowChallengePage } from '@/components/FlowChallengePage';
import { TrialExtensionPopup } from '@/components/TrialExtensionPopup';
import { SubscriptionPopup } from '@/components/SubscriptionPopup';
import { PlanSelectionPopup } from '@/components/PlanSelectionPopup';
import { TrialBadge } from '@/components/TrialBadge';
import GloweePopup from '@/components/shared/GloweePopup';
import { GloweeHourlyMessage } from '@/components/GloweeHourlyMessage';
import { markWelcomeSeen, markPresentationSeen, hasPresentationBeenSeen } from '@/utils/visitTracker';
import { gloweeMessages } from '@/data/gloweeMessages';
import { TimeCapsule } from '@/components/TimeCapsule';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { FAQSection } from '@/components/settings/FAQSection';
import { usePlanningSync } from '@/hooks/useFirebaseSync';
import { ProfilePage } from '@/components/ProfilePage';

import { saveTask, deleteTask as deleteTaskFromFirebase, updateTaskCompletion } from '@/lib/firebase/user-data-sync';
import { JournalEntryModal, JournalEntry } from '@/components/journal';
import { useInstallTracking } from '@/hooks/useInstallTracking';
import { useTrafficTracking, linkTrackingToUser, trackSubscription } from '@/hooks/useTrafficTracking';

// Fonction utilitaire pour formater une date en YYYY-MM-DD sans problème de timezone
const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function GlowUpChallengeApp() {
  const router = useRouter();
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
    confirmLanguageSelection,
    canAccessDay,
    getCurrentUnlockedDay,
    bonusProgress,
    addSmallWin,
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
    hasExceededFreeTrial,
    canAccessFeature,
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
    getTrackerByDate,
    // Goal Setup
    objectifsInitiaux,
    objectifsPrioritaires,
    objectifPrincipal,
    setObjectifsInitiaux,
    setObjectifsPrioritaires,
    setObjectifPrincipal,
    // Personalized Flow
    personalizedFlow,
    setPersonalizedFlow,
    setFlowDescription,
    setIsGeneratingFlow,
    completeFlowDay,
    toggleFlowAction,
    selectFlowChoice,
    generatePersonalizedFlow,
    generateFlowInBackground,
    isGeneratingFlowBackground,
    regenerateFlow,
    unlockBadge,
    continueFlow,
    checkNeedsContinuation,
    checkAndUnlockNextDay,
    isGeneratingFlow,
    // Visibility toggles
    showChallengeCard,
    showFlowCard,
    toggleChallengeCard,
    toggleFlowCard
  } = useStore();

  // Gestion du Thème
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove('dark', 'theme-yellow', 'theme-blue');

      if (theme === 'dark') root.classList.add('dark');
      if (theme === 'yellow') root.classList.add('theme-yellow');
      if (theme === 'blue') root.classList.add('theme-blue');
    }
  }, [theme]);

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
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<'glow_start' | 'glow_plus' | null>(null);
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

  // Helper function to check feature access and show paywall if needed
  const checkFeatureAccess = (
    feature: 'message_a_moi' | 'petites_victoires' | 'habitudes' | 'journal' | 'glow_mirror',
    onAccessGranted: () => void
  ) => {
    if (canAccessFeature(feature)) {
      onAccessGranted();
    } else {
      setSubscriptionSource('trial_expired');
      setShowPlanSelection(true);
    }
  };

  // Tracker les installations
  useInstallTracking();

  // Tracker la source de trafic
  useTrafficTracking();

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

  // Vérifier l'accès aux vues payantes et rediriger si nécessaire
  useEffect(() => {
    if (!isHydrated) return;

    const paidViews = [
      { view: 'journal', feature: 'journal' as const },
      { view: 'glow-mirror', feature: 'glow_mirror' as const },
      { view: 'trackers', feature: 'habitudes' as const }
    ];

    const currentPaidView = paidViews.find(v => v.view === currentView);
    if (currentPaidView && !canAccessFeature(currentPaidView.feature)) {
      setSubscriptionSource('trial_expired');
      setShowPlanSelection(true);
      setCurrentView('dashboard');
    }
  }, [currentView, isHydrated, canAccessFeature]);

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
  const [showNewMeSection, setShowNewMeSection] = useState(true);

  const [newMeProgress, setNewMeProgress] = useState<Record<number, Record<string, boolean>>>({});
  const [newMeCurrentDay, setNewMeCurrentDay] = useState(1);
  const [newMeStartDate, setNewMeStartDate] = useState<string | null>(null);

  // États pour Beauty Pillars (Challenge Beauté et Corps)
  const [beautySelectedDate, setBeautySelectedDate] = useState<string>(getLocalDateString(new Date()));
  const [beautyChoiceExpanded, setBeautyChoiceExpanded] = useState(false);
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null); // Pour gérer l'ouverture des détails des piliers
  const [beautyGloweeMessageIndex, setBeautyGloweeMessageIndex] = useState(0);
  const [beautyGloweeDisplayedMessage, setBeautyGloweeDisplayedMessage] = useState('');
  const [beautyGloweeIsTyping, setBeautyGloweeIsTyping] = useState(true);
  const [beautyHasShownFirstMessage, setBeautyHasShownFirstMessage] = useState(false);
  const [showBeautyStreakPopup, setShowBeautyStreakPopup] = useState(false);
  const [showBeautyIncompletePopup, setShowBeautyIncompletePopup] = useState(false);

  // État pour le Journal
  const [journalEntries, setJournalEntries] = useState<Array<{
    id: string;
    date: string;
    time: string;
    mood: string;
    moodColor: string;
    tags: string[];
    text: string;
    images?: string[];
  }>>([]);
  const [showJournalEntryModal, setShowJournalEntryModal] = useState(false);
  const [journalCurrentMonth, setJournalCurrentMonth] = useState(new Date());
  const [editingEntry, setEditingEntry] = useState<typeof journalEntries[0] | null>(null);

  // État pour l'animation du Flow en arrière-plan
  const [flowGenerationStep, setFlowGenerationStep] = useState(0);
  const [openMenuEntryId, setOpenMenuEntryId] = useState<string | null>(null);

  // État pour Glow Mirror
  const [showGlowMirror, setShowGlowMirror] = useState(false);
  const [glowMirrorMessage, setGlowMirrorMessage] = useState('');
  const [glowMirrorLoading, setGlowMirrorLoading] = useState(false);
  const [glowMirrorDeepMode, setGlowMirrorDeepMode] = useState(false);
  const [glowMirrorRetryCount, setGlowMirrorRetryCount] = useState(0);
  const [glowMirrorQAMessages, setGlowMirrorQAMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [glowMirrorQAInput, setGlowMirrorQAInput] = useState('');
  const [glowMirrorQALoading, setGlowMirrorQALoading] = useState(false);
  const [glowMirrorHistory, setGlowMirrorHistory] = useState<Array<{ date: string, message: string }>>([]);
  const [showGlowMirrorNotification, setShowGlowMirrorNotification] = useState(false);
  const [lastGlowMirrorView, setLastGlowMirrorView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lastGlowMirrorView') || '';
    }
    return '';
  });
  const [canViewGlowMirror, setCanViewGlowMirror] = useState(false);
  const [glowMirrorWeeklyTrends, setGlowMirrorWeeklyTrends] = useState<any>(null);
  const [glowMirrorConsecutiveHabits, setGlowMirrorConsecutiveHabits] = useState<Array<{ habit: string, streak: number }>>([]);
  const [glowMirrorHasBeenRead, setGlowMirrorHasBeenRead] = useState(false);
  const [showGlowMirrorAlert, setShowGlowMirrorAlert] = useState(false);

  // État pour le menu Ajouter (+)
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showPersonalHabits, setShowPersonalHabits] = useState(false);
  const [showTimeCapsuleDrawer, setShowTimeCapsuleDrawer] = useState(false);
  const [newWinText, setNewWinText] = useState('');

  // Date de première utilisation de l'app (pour Glow Mirror)
  const [firstAppUseDate, setFirstAppUseDate] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('firstAppUseDate');
      if (saved) return saved;
      // Si pas de date sauvegardée, c'est la première utilisation
      const today = new Date().toISOString();
      localStorage.setItem('firstAppUseDate', today);
      return today;
    }
    return '';
  });
  const [daysSinceFirstUse, setDaysSinceFirstUse] = useState(0);
  const [isGlowMirrorReady, setIsGlowMirrorReady] = useState(false);

  // État pour la vue Planning (Semaine vs Jour)
  const [isDayView, setIsDayView] = useState(false);
  const [selectedDayViewDate, setSelectedDayViewDate] = useState(new Date());
  const [showSmallWinsHelp, setShowSmallWinsHelp] = useState(false);

  // Design du carnet de fierté
  type PrideJournalDesign = 'gallery' | 'starlight' | 'summit' | 'memory';
  const [prideJournalDesign, setPrideJournalDesign] = useState<PrideJournalDesign>('gallery');
  const [showPrideDesignPicker, setShowPrideDesignPicker] = useState(false);

  // Charger les entrées du journal depuis localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('journalEntries');
      if (saved) {
        setJournalEntries(JSON.parse(saved));
      }
    }
  }, []);

  // Sauvegarder les entrées du journal dans localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
    }
  }, [journalEntries]);

  // Fonction pour sauvegarder une entrée (ajout ou modification)
  const handleSaveJournalEntry = (entryData: Omit<typeof journalEntries[0], 'id'>) => {
    if (editingEntry) {
      setJournalEntries(prev => prev.map(e =>
        e.id === editingEntry.id ? { ...entryData, id: editingEntry.id } : e
      ));
      setEditingEntry(null);
    } else {
      const newEntry = {
        ...entryData,
        id: Date.now().toString()
      };
      setJournalEntries(prev => [newEntry, ...prev]);
    }
    setShowJournalEntryModal(false);
  };

  // Fonction pour supprimer une entrée
  const deleteJournalEntry = (id: string) => {
    if (confirm(language === 'fr' ? 'Supprimer cette entrée ?' : language === 'en' ? 'Delete this entry?' : '¿Eliminar esta entrada?')) {
      setJournalEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  // Fonction pour éditer une entrée
  const editJournalEntry = (entry: typeof journalEntries[0]) => {
    setEditingEntry(entry);
    setShowJournalEntryModal(true);
  };

  // Fonction pour changer de mois
  const changeJournalMonth = (direction: 'prev' | 'next') => {
    setJournalCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Filtrer les entrées par mois
  const getFilteredJournalEntries = () => {
    return journalEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === journalCurrentMonth.getMonth() &&
        entryDate.getFullYear() === journalCurrentMonth.getFullYear();
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Vérifier si on peut voir le Glow Mirror (1x par semaine) + 7 jours minimum d'utilisation
  useEffect(() => {
    const checkGlowMirrorAvailability = () => {
      const now = new Date();

      // Vérifier si l'utilisateur a utilisé l'app pendant au moins 7 jours
      const firstUse = new Date(firstAppUseDate);
      const daysSinceFirst = Math.floor((now.getTime() - firstUse.getTime()) / (1000 * 60 * 60 * 24));
      setDaysSinceFirstUse(daysSinceFirst);
      const hasMinimumUsage = daysSinceFirst >= 7;
      setIsGlowMirrorReady(hasMinimumUsage);

      // Si moins de 7 jours, pas disponible
      if (!hasMinimumUsage) {
        setCanViewGlowMirror(false);
        setShowGlowMirrorNotification(false);
        return;
      }

      // Si jamais vu, disponible après 7 jours
      if (!lastGlowMirrorView) {
        setCanViewGlowMirror(true);
        setShowGlowMirrorNotification(true);
        return;
      }

      // Vérifier 7 jours depuis la dernière vue
      const lastView = new Date(lastGlowMirrorView);
      const daysSinceLastView = Math.floor((now.getTime() - lastView.getTime()) / (1000 * 60 * 60 * 24));
      const isAvailable = daysSinceLastView >= 7;

      setCanViewGlowMirror(isAvailable);
      setShowGlowMirrorNotification(isAvailable);
    };

    checkGlowMirrorAvailability();

    // Vérifier toutes les heures
    const interval = setInterval(checkGlowMirrorAvailability, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [lastGlowMirrorView, firstAppUseDate]);

  // Animation du Flow en arrière-plan
  useEffect(() => {
    if (isGeneratingFlowBackground) {
      const interval = setInterval(() => {
        setFlowGenerationStep((prev) => (prev + 1) % 4);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isGeneratingFlowBackground]);

  // Helper: Calculer les jours consécutifs d'une habitude
  const calculateHabitConsecutiveDays = (habitHistory: Array<{ date: string, completed: boolean }>) => {
    if (!habitHistory || habitHistory.length === 0) return 0;

    const sorted = [...habitHistory].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let consecutive = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const lastEntry = sorted[0];
    if (lastEntry?.completed && (lastEntry.date === today || lastEntry.date === yesterday)) {
      consecutive = 1;

      for (let i = 1; i < sorted.length; i++) {
        const current = new Date(sorted[i].date);
        const previous = new Date(sorted[i - 1].date);
        const diffDays = Math.floor((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1 && sorted[i].completed) {
          consecutive++;
        } else {
          break;
        }
      }
    }

    return consecutive;
  };

  // Helper: Calculer les tendances hebdomadaires
  const calculateWeeklyTrends = (now: Date) => {
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const getDataForPeriod = (startDate: Date, endDate: Date) => {
      const smallWins = bonusProgress?.smallWins || [];
      const journalEntriesData = JSON.parse(localStorage.getItem('journalEntries') || '[]');
      const weekTasks = JSON.parse(localStorage.getItem('weekTasks') || '[]');
      const newMeHabits = JSON.parse(localStorage.getItem('newMeHabits') || '[]');
      const boundaries = JSON.parse(localStorage.getItem('boundaries') || '[]');

      const filterByDate = (items: any[], dateField: string = 'date') => {
        return items.filter(item => {
          const itemDate = new Date(item[dateField] || item.date);
          return itemDate >= startDate && itemDate < endDate;
        });
      };

      return {
        smallWins: filterByDate(smallWins).length,
        journalEntries: filterByDate(journalEntriesData).length,
        completedTasks: filterByDate(weekTasks.filter((t: any) => t.completed)).length,
        totalTasks: filterByDate(weekTasks).length,
        completedHabits: newMeHabits.filter((h: any) => h.completed).length,
        completedBoundaries: boundaries.filter((b: any) => b.completed).length
      };
    };

    const currentWeek = getDataForPeriod(oneWeekAgo, now);
    const previousWeek = getDataForPeriod(twoWeeksAgo, oneWeekAgo);

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return {
      currentWeek,
      previousWeek,
      changes: {
        smallWins: calculateChange(currentWeek.smallWins, previousWeek.smallWins),
        journalEntries: calculateChange(currentWeek.journalEntries, previousWeek.journalEntries),
        tasks: calculateChange(currentWeek.completedTasks, previousWeek.completedTasks),
        habits: calculateChange(currentWeek.completedHabits, previousWeek.completedHabits),
        boundaries: calculateChange(currentWeek.completedBoundaries, previousWeek.completedBoundaries)
      },
      globalTrend: calculateChange(
        currentWeek.smallWins + currentWeek.journalEntries + currentWeek.completedTasks + currentWeek.completedHabits,
        previousWeek.smallWins + previousWeek.journalEntries + previousWeek.completedTasks + previousWeek.completedHabits
      )
    };
  };

  // Helper: Retry avec exponential backoff
  const fetchWithRetry = async (url: string, options: RequestInit, maxRetries = 3) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);
        if (response.ok) return response;
        throw new Error(`HTTP Error: ${response.status}`);
      } catch (error) {
        if (attempt === maxRetries - 1) throw error;
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries reached');
  };

  // Générer le message Glow Mirror avec Kimi AI
  const generateGlowMirror = async (forceRetry = false) => {
    if (!forceRetry) {
      setGlowMirrorRetryCount(0);
      setGlowMirrorQAMessages([]);
      setGlowMirrorHasBeenRead(false);
    }

    const now = new Date();

    // Collecter toutes les données
    const smallWins = bonusProgress?.smallWins || [];
    const recentWins = smallWins.filter((win: any) => {
      const winDate = new Date(win.date);
      const daysDiff = Math.floor((now.getTime() - winDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    });

    const newMeHabits = JSON.parse(localStorage.getItem('newMeHabits') || '[]');
    const completedHabits = newMeHabits.filter((habit: any) => habit.completed);

    // Calculer les jours consécutifs pour chaque habitude
    const habitConsecutiveData = newMeHabits.map((habit: any) => ({
      name: habit.label || habit.name || 'Habit',
      streak: calculateHabitConsecutiveDays(habit.history || []),
      totalCompleted: habit.totalCompletions || 0
    })).filter((h: any) => h.streak > 0).sort((a: any, b: any) => b.streak - a.streak);

    const recentEntries = journalEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const daysDiff = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    });

    const boundariesData = JSON.parse(localStorage.getItem('boundaries') || '[]');
    const completedBoundaries = boundariesData.filter((b: any) => b.completed);

    const weekTasks = JSON.parse(localStorage.getItem('weekTasks') || '[]');
    const completedTasks = weekTasks.filter((task: any) => task.completed);

    const challengeProgress = JSON.parse(localStorage.getItem('challengeProgress') || '{}');
    const completedDays = Object.values(challengeProgress).filter((p: any) => p.completed).length;

    // Calculer des statistiques avancées
    const habitCompletionRate = newMeHabits.length > 0 ? Math.round((completedHabits.length / newMeHabits.length) * 100) : 0;
    const taskCompletionRate = weekTasks.length > 0 ? Math.round((completedTasks.length / weekTasks.length) * 100) : 0;
    const boundaryCompletionRate = boundariesData.length > 0 ? Math.round((completedBoundaries.length / boundariesData.length) * 100) : 0;

    // Analyser l'humeur dominante
    const moodCounts: Record<string, number> = {};
    recentEntries.forEach((e: any) => {
      if (e.mood) moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
    });
    const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    const dominantMoodPercentage = recentEntries.length > 0 && dominantMood
      ? Math.round((moodCounts[dominantMood] / recentEntries.length) * 100)
      : 0;

    // Analyser les tags les plus utilisés
    const allTags = recentEntries.flatMap((e: any) => e.tags || []);
    const tagCounts: Record<string, number> = {};
    allTags.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    // Calculer la régularité (streak)
    let currentStreak = 0;
    const sortedEntries = [...journalEntries].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    if (sortedEntries.length > 0) {
      const today = now.toISOString().split('T')[0];
      const yesterday = new Date(now.getTime() - 86400000).toISOString().split('T')[0];
      const hasEntryToday = sortedEntries.some(e => e.date === today);
      const hasEntryYesterday = sortedEntries.some(e => e.date === yesterday);

      if (hasEntryToday || hasEntryYesterday) {
        currentStreak = 1;
        let checkDate = new Date(hasEntryToday ? today : yesterday);
        for (let i = 1; i < sortedEntries.length; i++) {
          checkDate.setDate(checkDate.getDate() - 1);
          const checkDateStr = checkDate.toISOString().split('T')[0];
          if (sortedEntries.some(e => e.date === checkDateStr)) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    // Calculer les tendances hebdomadaires
    const weeklyTrends = calculateWeeklyTrends(now);

    // Construire le prompt enrichi pour Kimi
    const promptData = {
      language: language,
      timeRange: 'last 7 days',
      userProfile: {
        currentStreak: currentStreak,
        totalJournalEntries: journalEntries.length,
        weeklyActivityScore: Math.min(100, (recentEntries.length * 10) + (completedHabits.length * 5) + (completedTasks.length * 3) + (recentWins.length * 2))
      },
      analytics: {
        smallWins: {
          count: recentWins.length,
          items: recentWins.slice(0, 5).map((w: any) => w.text || w.title || 'Win')
        },
        habits: {
          completed: completedHabits.length,
          total: newMeHabits.length,
          completionRate: habitCompletionRate,
          items: completedHabits.slice(0, 5).map((h: any) => h.label || h.name || 'Habit'),
          missed: newMeHabits.length - completedHabits.length,
          consecutiveStreaks: habitConsecutiveData.slice(0, 3)
        },
        journal: {
          entriesCount: recentEntries.length,
          totalEntries: journalEntries.length,
          dominantMood: {
            mood: dominantMood,
            percentage: dominantMoodPercentage
          },
          allMoods: moodCounts,
          topTags: topTags,
          streak: currentStreak
        },
        boundaries: {
          completed: completedBoundaries.length,
          total: boundariesData.length,
          completionRate: boundaryCompletionRate
        },
        tasks: {
          completed: completedTasks.length,
          total: weekTasks.length,
          completionRate: taskCompletionRate,
          pending: weekTasks.length - completedTasks.length
        },
        challenges: {
          completedDays: completedDays
        },
        userProfile: {
          mainObjective: objectifPrincipal || 'Non défini',
          flowActive: personalizedFlow?.isActive || false,
          flowProgress: personalizedFlow ? {
            currentDay: personalizedFlow.currentDay,
            totalDays: 30,
            completedDays: personalizedFlow.completedDays.length,
            completionRate: Math.round((personalizedFlow.completedDays.length / 30) * 100),
            category: personalizedFlow.category || 'general',
            // ➕ Ajouter les actions complétées des 7 derniers jours du flow
            recentCompletedActions: personalizedFlow.completedDays.slice(-7).map(dayNum => {
              const day = personalizedFlow.days.find(d => d.day === dayNum);
              return {
                day: dayNum,
                title: day?.title || `Jour ${dayNum}`,
                mandatoryActions: day?.mandatoryActions.filter(a => a.isCompleted).map(a => a.title) || [],
                choiceAction: day?.choiceActions.find(a => a.id === day.selectedChoiceId)?.title || null
              };
            })
          } : null,
          flowObjective: personalizedFlow?.objective || null,
          flowDescription: personalizedFlow?.objectiveDescription || null
        }
      },
      trends: weeklyTrends,
      insights: {
        strengthAreas: [] as string[],
        improvementAreas: [] as string[]
      }
    };

    // Identifier les forces et axes d'amélioration
    const strengthAreas: string[] = [];
    const improvementAreas: string[] = [];

    if (habitCompletionRate >= 70) strengthAreas.push('consistency_habits');
    if (taskCompletionRate >= 70) strengthAreas.push('productivity');
    if (recentEntries.length >= 3) strengthAreas.push('self_reflection');
    if (recentWins.length >= 2) strengthAreas.push('celebration');
    if (boundaryCompletionRate >= 70) strengthAreas.push('self_care');
    if (habitConsecutiveData.some((h: any) => h.streak >= 7)) strengthAreas.push('long_term_consistency');

    if (habitCompletionRate < 50) improvementAreas.push('habit_consistency');
    if (taskCompletionRate < 50) improvementAreas.push('task_completion');
    if (recentEntries.length < 2) improvementAreas.push('journaling_frequency');
    if (recentWins.length === 0) improvementAreas.push('celebration_mindset');
    if (weeklyTrends.globalTrend < 0) improvementAreas.push('weekly_momentum');

    promptData.insights.strengthAreas = strengthAreas;
    promptData.insights.improvementAreas = improvementAreas;

    // System prompt avec support du mode profond et raisonnement obligatoire
    const getSystemPrompt = () => {
      const basePrompt = language === 'fr'
        ? `Tu es Glow Mirror, un miroir identitaire intelligent et bienveillant.

RÈGLE ABSOLUE : AVANT de générer quoi que ce soit, tu DOIS utiliser ta capacité de raisonnement.

PROCESSUS OBLIGATOIRE :
1. ACTIVE ton raisonnement (<think>)
2. ANALYSE en profondeur TOUTES les données : objectifs, flow, habitudes, journal, etc.
3. CONNECTE les patterns entre son objectif principal et ses actions quotidiennes
4. GÉNÈRE ensuite le Glow Mirror personnalisé`
        : language === 'en'
          ? `You are Glow Mirror, an intelligent and caring identity mirror.

ABSOLUTE RULE: BEFORE generating anything, you MUST use your reasoning capability.

MANDATORY PROCESS:
1. ACTIVATE your reasoning (<think>)
2. DEEPLY ANALYZE ALL data: objectives, flow, habits, journal, etc.
3. CONNECT patterns between their main objective and daily actions
4. THEN generate the personalized Glow Mirror`
          : `Eres Glow Mirror, un espejo de identidad inteligente y cariñoso.

REGLA ABSOLUTA: ANTES de generar nada, DEBES usar tu capacidad de razonamiento.

PROCESO OBLIGATORIO:
1. ACTIVA tu razonamiento (<think>)
2. ANALIZA en profundidad TODOS los datos: objetivos, flow, hábitos, diario, etc.
3. CONECTA patrones entre su objetivo principal y acciones diarias
4. GENERA después el Glow Mirror personalizado`;

      const rules = language === 'fr'
        ? `RÈGLES:
- Écris à la 2ème personne (tu/vous)
- Ton humain, chaleureux mais professionnel
- Structure: 1) Analyse profonde de qui elle est, 2) Tendances remarquables avec comparaisons, 3) Conseil d'amélioration ultra-personnalisé
- Sois précis: cite des chiffres, des patterns, des exemples concrets
- Analyse les tendances sur 2 semaines (comparaison semaine actuelle vs précédente)
- Mentionne ses streaks de consécutivité comme preuve de sa discipline
- Le conseil doit être actionnable et adapté à son profil
- Si elle manque de régularité, suggère un micro-habit facile
- Si elle est très active, suggère comment optimiser ou équilibrer
- Si la tendance est négative, encourage-la avec bienveillance
- IMPORTANT : Relie TOUJOURS l'analyse à son objectif principal et son Flow`
        : language === 'en'
          ? `RULES:
- Write in 2nd person (you)
- Human, warm but professional tone
- Structure: 1) Deep analysis of who they are, 2) Notable trends with comparisons, 3) Ultra-personalized improvement advice
- Be specific: cite numbers, patterns, concrete examples
- Analyze trends over 2 weeks (current vs previous week comparison)
- Mention their consecutive streaks as proof of discipline
- The advice must be actionable and adapted to their profile
- If they lack consistency, suggest an easy micro-habit
- If they are very active, suggest how to optimize or balance
- If trend is negative, encourage them with kindness
- IMPORTANT: ALWAYS connect the analysis to their main objective and Flow`
          : `REGLAS:
- Escribe en 2ª persona (tú)
- Tono humano, cálido pero profesional
- Estructura: 1) Análisis profundo de quién es, 2) Tendencias notables con comparaciones, 3) Consejo de mejora ultra-personalizado
- Sé específico: cita números, patrones, ejemplos concretos
- Analiza tendencias durante 2 semanas (comparación semana actual vs anterior)
- Menciona sus rachas consecutivas como prueba de disciplina
- El consejo debe ser accionable y adaptado a su perfil
- Si le falta regularidad, sugiere un micro-hábito fácil
- Si es muy activa, sugiere cómo optimizar o equilibrar
- Si la tendencia es negativa, anímala con amabilidad
- IMPORTANTE: CONECTA SIEMPRE el análisis a su objetivo principal y Flow`;

      const length = glowMirrorDeepMode
        ? (language === 'fr' ? 'Message de 15-25 lignes pour une analyse profonde' : language === 'en' ? 'Message of 15-25 lines for deep analysis' : 'Mensaje de 15-25 líneas para análisis profundo')
        : (language === 'fr' ? 'Message de 8-15 lignes' : language === 'en' ? 'Message of 8-15 lines' : 'Mensaje de 8-15 líneas');

      return `${basePrompt}\n\n${rules}\n\n${length}`;
    };

    const systemPrompt = getSystemPrompt();

    const userPrompt = language === 'fr'
      ? `DONNÉES COMPLÈTES DE L'UTILISATRICE (7 derniers jours):\n\n${JSON.stringify(promptData, null, 2)}\n\n⚠️ PROCESSUS OBLIGATOIRE - ÉTAPE 1: RAISONNEMENT\nAvant de générer le Glow Mirror, tu DOIS fournir ton analyse entre balises <think> :\n<think>\n- Objectif principal de l'utilisatrice: ${objectifPrincipal || 'Non défini'}\n- Flow actif: ${personalizedFlow?.isActive ? 'OUI' : 'NON'}\n- Si Flow actif: Jour ${personalizedFlow?.currentDay}/30, ${personalizedFlow?.completedDays.length || 0} jours complétés\n- Analyse de la cohérence: Ses actions quotidiennes soutiennent-elles son objectif principal?\n- Patterns identifiés: Quels liens entre ses habitudes et son objectif?\n- Forces et blocages liés à son objectif\n- Recommandations préliminaires\n</think>\n\nÉTAPE 2: GLOW MIRROR\nGénère maintenant:\n1. UN MIROIR PROFOND: Qui est-elle vraiment? Ses patterns? Forces cachées? Mentionne ses streaks comme preuves de discipline.\n2. TENDANCES: Compare cette semaine à la précédente. Progression ou régression?\n3. CONSEIL ACTIONNABLE: Ultra-personnalisé, connecté à son objectif principal "${objectifPrincipal || 'sa vision'}" et son Flow de 30 jours.\n\n${glowMirrorDeepMode ? 'Mode Profond: 15-25 lignes.' : '8-15 lignes.'}`
      : language === 'en'
        ? `COMPLETE USER DATA (last 7 days):\n\n${JSON.stringify(promptData, null, 2)}\n\n⚠️ MANDATORY PROCESS - STEP 1: REASONING\nBefore generating the Glow Mirror, you MUST provide your analysis between <think> tags:\n<think>\n- User's main objective: ${objectifPrincipal || 'Not defined'}\n- Flow active: ${personalizedFlow?.isActive ? 'YES' : 'NO'}\n- If Flow active: Day ${personalizedFlow?.currentDay}/30, ${personalizedFlow?.completedDays.length || 0} days completed\n- Coherence analysis: Do her daily actions support her main objective?\n- Patterns identified: What links between her habits and objective?\n- Strengths and blocks related to her objective\n- Preliminary recommendations\n</think>\n\nSTEP 2: GLOW MIRROR\nNow generate:\n1. A DEEP MIRROR: Who is she really? Her patterns? Hidden strengths? Mention her streaks as proof of discipline.\n2. TRENDS: Compare this week to previous. Progress or regression?\n3. ACTIONABLE ADVICE: Ultra-personalized, connected to her main objective "${objectifPrincipal || 'her vision'}" and her 30-day Flow.\n\n${glowMirrorDeepMode ? 'Deep Mode: 15-25 lines.' : '8-15 lines.'}`
        : `DATOS COMPLETOS DE LA USUARIA (últimos 7 días):\n\n${JSON.stringify(promptData, null, 2)}\n\n⚠️ PROCESO OBLIGATORIO - PASO 1: RAZONAMIENTO\nAntes de generar el Glow Mirror, DEBES proporcionar tu análisis entre etiquetas <think> :\n<think>\n- Objetivo principal de la usuaria: ${objectifPrincipal || 'No definido'}\n- Flow activo: ${personalizedFlow?.isActive ? 'SÍ' : 'NO'}\n- Si Flow activo: Día ${personalizedFlow?.currentDay}/30, ${personalizedFlow?.completedDays.length || 0} días completados\n- Análisis de coherencia: ¿Sus acciones diarias apoyan su objetivo principal?\n- Patrones identificados: ¿Qué vínculos entre sus hábitos y objetivo?\n- Fortalezas y bloqueos relacionados con su objetivo\n- Recomendaciones preliminares\n</think>\n\nPASO 2: GLOW MIRROR\nGenera ahora:\n1. ESPEJO PROFUNDO: ¿Quién es realmente? ¿Sus patrones? ¿Fortalezas ocultas? Menciona sus rachas como prueba de disciplina.\n2. TENDENCIAS: Compara esta semana con la anterior. ¿Progreso o regresión?\n3. CONSEJO ACCIONABLE: Ultra-personalizado, conectado a su objetivo principal "${objectifPrincipal || 'su visión'}" y su Flow de 30 días.\n\n${glowMirrorDeepMode ? 'Modo Profundo: 15-25 líneas.' : '8-15 líneas.'}`;

    setGlowMirrorLoading(true);
    setGlowMirrorRetryCount(forceRetry ? glowMirrorRetryCount + 1 : 0);

    try {
      // Liste des modèles
      const models = [
        'openrouter/pony-alpha',
        'deepseek/deepseek-r1-0528:free',
        'arcee-ai/trinity-large-preview:free'
      ];

      let response;
      let lastError;

      for (const model of models) {
        try {
          console.log(`[Glow Mirror] Trying model: ${model}`);

          response = await fetchWithRetry('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
              'HTTP-Referer': 'https://upglow.app',
              'X-Title': 'UPGLOW Glow Mirror'
            },
            body: JSON.stringify({
              model: model,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
              ],
              temperature: 0.4,
              max_tokens: 3000,
              top_p: 0.9,
              frequency_penalty: 0.3
            })
          }, 3);

          if (response.ok) break;
        } catch (e) {
          console.warn(`[Glow Mirror] Model ${model} failed:`, e);
          lastError = e;
        }
      }

      if (!response || !response.ok) {
        throw lastError || new Error('All models failed');
      }

      const data = await response.json();
      let aiMessage = data.choices?.[0]?.message?.content || '';

      console.log('[Glow Mirror] Response length:', aiMessage.length);

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // VALIDATION STRICTE DU RAISONNEMENT (BLOQUANTE)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      const thinkMatch = aiMessage.match(/<think>([\s\S]*?)<\/think>/);

      if (!thinkMatch) {
        console.error('[Glow Mirror] ❌ REJECTED: No <think> reasoning found!');
        console.error('[Glow Mirror] Content preview:', aiMessage.substring(0, 500));
        throw new Error('AI did not provide reasoning for Glow Mirror');
      }

      const reasoning = thinkMatch[1].trim();

      if (reasoning.length < 150) {
        console.error('[Glow Mirror] ❌ REJECTED: Reasoning too short!');
        console.error('[Glow Mirror] Reasoning length:', reasoning.length);
        throw new Error('AI reasoning insufficient (< 150 chars)');
      }

      // Vérifier que le raisonnement contient les éléments clés
      const hasAnalysis = /cohérence|pattern|tendance|trend|coherence|patrón/i.test(reasoning);

      if (!hasAnalysis) {
        console.error('[Glow Mirror] ❌ REJECTED: Reasoning missing analysis!');
        throw new Error('AI reasoning incomplete - missing analysis');
      }

      console.log('[Glow Mirror] ✅ Valid reasoning detected');
      console.log('[Glow Mirror] Reasoning preview:', reasoning.substring(0, 200) + '...');

      // Extraire uniquement le contenu après </think> pour l'affichage
      const afterThink = aiMessage.split(/<\/think>/).pop() || aiMessage;
      aiMessage = afterThink.trim();

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // VALIDATION DE LA QUALITÉ DU MESSAGE
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      const minLength = glowMirrorDeepMode ? 400 : 200;
      if (aiMessage.length < minLength) {
        console.warn('[Glow Mirror] ⚠️ Message shorter than expected:', aiMessage.length, 'chars');
      }

      // Vérifier que le message mentionne l'objectif (si défini)
      if (objectifPrincipal && !aiMessage.toLowerCase().includes(objectifPrincipal.toLowerCase().substring(0, 10))) {
        console.warn('[Glow Mirror] ⚠️ Message does not mention main objective');
      }

      // Vérifier que le message mentionne le Flow (si actif)
      if (personalizedFlow?.isActive && !/flow|jour|day|día/i.test(aiMessage)) {
        console.warn('[Glow Mirror] ⚠️ Message does not mention Flow');
      }

      console.log('[Glow Mirror] ✅ Message quality validated');

      setGlowMirrorMessage(aiMessage);
      setGlowMirrorQAMessages([{ role: 'assistant', content: aiMessage }]);

      // Sauvegarder dans l'historique
      const newHistory = [{ date: now.toISOString(), message: aiMessage }, ...glowMirrorHistory].slice(0, 10);
      setGlowMirrorHistory(newHistory);
      localStorage.setItem('glowMirrorHistory', JSON.stringify(newHistory));

      // Déclencher le confetti après 2 secondes
      setTimeout(() => {
        setGlowMirrorHasBeenRead(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
        });
      }, 2000);

    } catch (error) {
      console.error('Glow Mirror AI Error:', error);

      if (glowMirrorRetryCount < 2) {
        // Retry automatique
        setTimeout(() => generateGlowMirror(true), 1000);
        return;
      }

      // Message de fallback après les retries
      const fallbackMessages = {
        fr: "Tu es en train de construire quelque chose de beau. Chaque petit pas compte. Prends un moment pour célébrer qui tu es aujourd'hui.",
        en: "You are building something beautiful. Every small step counts. Take a moment to celebrate who you are today.",
        es: "Estás construyendo algo hermoso. Cada pequeño paso cuenta. Tómate un momento para celebrar quién eres hoy."
      };
      setGlowMirrorMessage(fallbackMessages[language]);
      setGlowMirrorQAMessages([{ role: 'assistant', content: fallbackMessages[language] }]);
    } finally {
      setGlowMirrorLoading(false);
    }

    setShowGlowMirror(true);
    setShowGlowMirrorNotification(false);

    // Sauvegarder la date de visualisation
    const today = new Date().toISOString();
    setLastGlowMirrorView(today);
    localStorage.setItem('lastGlowMirrorView', today);
    setCanViewGlowMirror(false);
  };

  // Q&A avec l'IA (max 3 questions)
  const askGlowMirrorQuestion = async () => {
    if (!glowMirrorQAInput.trim() || glowMirrorQAMessages.filter(m => m.role === 'user').length >= 3) return;

    const userQuestion = glowMirrorQAInput.trim();
    setGlowMirrorQAInput('');
    setGlowMirrorQALoading(true);

    const updatedMessages = [...glowMirrorQAMessages, { role: 'user' as const, content: userQuestion }];
    setGlowMirrorQAMessages(updatedMessages);

    const qaSystemPrompt = language === 'fr'
      ? "Tu es Glow Mirror. Réponds à la question de l'utilisatrice de façon concise (3-5 lignes max), bienveillante et personnalisée. Base-toi sur le contexte précédent."
      : language === 'en'
        ? "You are Glow Mirror. Answer the user's question concisely (3-5 lines max), kindly and personally. Base yourself on the previous context."
        : "Eres Glow Mirror. Responde a la pregunta de la usuaria de forma concisa (3-5 líneas máx), amable y personalizada. Basándote en el contexto anterior.";

    try {
      const models = [
        'openrouter/pony-alpha',
        'deepseek/deepseek-r1-0528:free',
        'arcee-ai/trinity-large-preview:free'
      ];

      let response;

      for (const model of models) {
        try {
          response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
              'HTTP-Referer': 'https://upglow.app',
              'X-Title': 'UPGLOW Glow Mirror'
            },
            body: JSON.stringify({
              model: model,
              messages: [
                { role: 'system', content: qaSystemPrompt },
                ...updatedMessages.map(m => ({ role: m.role, content: m.content }))
              ],
              temperature: 0.7,
              max_tokens: 300
            })
          });

          if (response.ok) break;
        } catch (e) {
          console.warn(`[Glow Mirror Q&A] Model ${model} failed`);
        }
      }

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || '';

      setGlowMirrorQAMessages([...updatedMessages, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Q&A Error:', error);
      const fallback = language === 'fr'
        ? "Je ne peux pas répondre pour le moment. Continue ton beau travail !"
        : language === 'en'
          ? "I can't answer right now. Keep up your great work!"
          : "No puedo responder ahora. ¡Sigue con tu gran trabajo!";
      setGlowMirrorQAMessages([...updatedMessages, { role: 'assistant', content: fallback }]);
    } finally {
      setGlowMirrorQALoading(false);
    }
  };

  // Fermer le menu quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuEntryId(null);
    };

    if (openMenuEntryId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuEntryId]);

  // État pour les pages d'onboarding avec Glowee
  const [onboardingPage, setOnboardingPage] = useState(1);

  // État pour le drawer de switch de challenge
  const [showChallengeDrawer, setShowChallengeDrawer] = useState(false);

  // États pour Tracker
  const [trackerCurrentDay, setTrackerCurrentDay] = useState(1);
  const [trackerStartDate, setTrackerStartDate] = useState<string | null>(null);
  const [customHabits, setCustomHabits] = useState<Array<{ id: string, label: string, type: 'good' | 'bad' }>>([]);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitLabel, setNewHabitLabel] = useState('');
  const [newHabitType, setNewHabitType] = useState<'good' | 'bad'>('good');

  // New Me habits - 9 predefined habits with completion tracking
  // Données des habitudes New Me avec traductions
  const newMeHabitsData = {
    water: {
      icon: '💧',
      label: {
        fr: 'Boire 1,5–2 L d\'eau',
        en: 'Drink 1.5–2 L of water',
        es: 'Beber 1,5–2 L de agua'
      }
    },
    move: {
      icon: '🏃',
      label: {
        fr: 'Bouger 20–30 min',
        en: 'Move 20–30 min',
        es: 'Moverse 20–30 min'
      }
    },
    positive: {
      icon: '✍️',
      label: {
        fr: 'Écrire une pensée positive',
        en: 'Write a positive thought',
        es: 'Escribir un pensamiento positivo'
      }
    },
    win: {
      icon: '🏆',
      label: {
        fr: 'Noter une petite victoire',
        en: 'Note a small win',
        es: 'Anotar una pequeña victoria'
      }
    },
    tidy: {
      icon: '🧹',
      label: {
        fr: 'Ranger mon espace 5 min',
        en: 'Tidy my space 5 min',
        es: 'Ordenar mi espacio 5 min'
      }
    },
    future: {
      icon: '🚀',
      label: {
        fr: 'Faire une action pour mon futur',
        en: 'Do an action for my future',
        es: 'Hacer una acción para mi futuro'
      }
    },
    priority: {
      icon: '🎯',
      label: {
        fr: 'Définir une priorité du jour',
        en: 'Define today\'s priority',
        es: 'Definir una prioridad del día'
      }
    },
    bed: {
      icon: '🌙',
      label: {
        fr: 'Me coucher en me disant : « J\'ai avancé. »',
        en: 'Go to bed saying: "I made progress."',
        es: 'Acostarme diciendo: "He avanzado."'
      }
    }
  };

  // Fonction pour obtenir les habitudes traduites selon la langue
  const getTranslatedNewMeHabits = () => {
    return Object.entries(newMeHabitsData).map(([id, data]) => ({
      id,
      icon: data.icon,
      label: data.label[language],
      completed: false
    }));
  };

  const [newMeHabits, setNewMeHabits] = useState<Array<{
    id: string;
    icon: string;
    label: string;
    completed: boolean;
  }>>(() => {
    // Lire depuis le format individuel newme_${id}_${date} (utilisé par la page Progression)
    const today = getLocalDateString();
    const translatedHabits = getTranslatedNewMeHabits();
    return translatedHabits.map(habit => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(`newme_${habit.id}_${today}`);
        return { ...habit, completed: saved === 'true' };
      }
      return habit;
    });
  });

  // Save New Me habits to localStorage au format individuel
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const today = getLocalDateString();
      newMeHabits.forEach(habit => {
        const storageKey = `newme_${habit.id}_${today}`;
        if (habit.completed) {
          localStorage.setItem(storageKey, 'true');
        } else {
          localStorage.removeItem(storageKey);
        }
      });
    }
  }, [newMeHabits]);

  // Mettre à jour les labels des habitudes quand la langue change
  useEffect(() => {
    setNewMeHabits(prevHabits => {
      return prevHabits.map(habit => ({
        ...habit,
        label: newMeHabitsData[habit.id as keyof typeof newMeHabitsData].label[language]
      }));
    });
  }, [language]);

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
    habits: Array<{ id: string, label: string, completed: boolean }>;
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
    { id: 'calm', fr: 'Calme', en: 'Calm', es: 'Tranquilo', icon: Sun, color: '#0ea5e9', bgColor: 'bg-sky-100', textColor: 'text-sky-700', gradient: 'from-sky-400 to-cyan-400', iconColor: '#0ea5e9' },
    { id: 'tired', fr: 'Fatigué', en: 'Tired', es: 'Cansado', icon: Moon, color: '#6b7280', bgColor: 'bg-gray-100', textColor: 'text-gray-700', gradient: 'from-gray-400 to-gray-500', iconColor: '#6b7280' },
    { id: 'proud', fr: 'Fier', en: 'Proud', es: 'Orgulloso', icon: Sparkles, color: '#f59e0b', bgColor: 'bg-amber-100', textColor: 'text-amber-700', gradient: 'from-amber-400 to-orange-400', iconColor: '#f59e0b' },
    { id: 'sad', fr: 'Triste', en: 'Sad', es: 'Triste', icon: Frown, color: '#6366f1', bgColor: 'bg-indigo-100', textColor: 'text-indigo-700', gradient: 'from-indigo-400 to-purple-400', iconColor: '#6366f1' },
    { id: 'neutral', fr: 'Neutre', en: 'Neutral', es: 'Neutral', icon: Meh, color: '#14b8a6', bgColor: 'bg-teal-100', textColor: 'text-teal-700', gradient: 'from-teal-400 to-emerald-400', iconColor: '#14b8a6' },
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
  const [myWeekPriorities, setMyWeekPriorities] = useState<Array<{ id: string, text: string, completed: boolean }>>([]);
  const [myWeeklyTasks, setMyWeeklyTasks] = useState<Record<string, Array<{ id: string, text: string, completed: boolean }>>>({
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
    weeklyPriorities: Array<{ id: string, text: string, completed: boolean }>;
  }>>([]);

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDestination, setNewTaskDestination] = useState<'priority' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>('priority');

  // États pour les onglets de la popup "Construire ma victoire"
  const [addTaskTab, setAddTaskTab] = useState<'manuel' | 'glowee'>('manuel');
  const [gloweeVictoryText, setGloweeVictoryText] = useState('');
  const [gloweeProposedTasks, setGloweeProposedTasks] = useState<Array<{ text: string; dayIndex: number }> | null>(null);
  const [isGloweeLoading, setIsGloweeLoading] = useState(false);
  const [gloweeDayCount, setGloweeDayCount] = useState(7);

  const [showCalendar, setShowCalendar] = useState(false);
  const [showDeleteTaskConfirm, setShowDeleteTaskConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{ id: string, day: string, type: 'priority' | 'task' } | null>(null);

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
  // Désactivé : Toujours afficher Message à moi
  useEffect(() => {
    setShowTimeCapsuleCard(true);
  }, []);

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
  // Cette vérification s'applique à toutes les vues sauf language-selection, challenge et les pages d'onboarding
  // Les challenges (Beauté et Corps, Esprit et Vie) sont toujours accessibles
  // Les pages de présentation et de configuration des objectifs sont aussi accessibles
  const isChallengeView = currentView === 'challenge-selection' || currentView === 'dashboard' || currentView === 'challenge';
  const isOnboardingView = currentView === 'presentation-1' || currentView === 'presentation-2' || currentView === 'goal-setup-5' || currentView === 'goal-setup-1';
  const shouldBlockAccess = hasSelectedLanguage && !canAccessApp() && !subscription.isSubscribed && !isChallengeView && !isOnboardingView;

  // Language Selection Screen - Clean White Design
  if (!hasSelectedLanguage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
        <div className="max-w-md w-full text-center space-y-4">
          {/* Logo avec Glowee */}
          <div className="space-y-3 animate-in fade-in duration-700">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-2xl opacity-40" style={{ background: 'linear-gradient(135deg, #f472b6, #e11d48)' }}></div>
                <img
                  src="/Glowee/glowee-acceuillante.webp"
                  alt="Glowee"
                  className="w-28 h-28 object-contain relative z-10"
                  style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                {t.languageSelection.title}
              </h1>
              <p className="text-base text-gray-600 font-medium">
                {t.languageSelection.subtitle}
              </p>
            </div>
          </div>

          {/* Language Options - Clean White Cards */}
          <div className="space-y-2 animate-in slide-in-from-bottom duration-700 delay-200">
            {[
              { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
              { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
              { code: 'es' as Language, name: 'Español', flag: '🇪🇸' }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`w-full p-3 rounded-2xl transition-all duration-300 bg-white ${language === lang.code
                  ? 'ring-2 ring-pink-400 shadow-lg'
                  : 'shadow-sm hover:shadow-md'
                  }`}
                style={language === lang.code ? { boxShadow: '0 4px 12px rgba(244, 114, 182, 0.15)' } : { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)' }}>
                      <span className="text-2xl">{lang.flag}</span>
                    </div>
                    <span className="text-base font-bold text-gray-800">{lang.name}</span>
                  </div>
                  {language === lang.code && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f472b6, #e11d48)' }}>
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Continue Button */}
          <Button
            onClick={() => {
              console.log('[DEBUG] Continue button clicked, confirming language and navigating to presentation-1');
              confirmLanguageSelection();
              setCurrentView('project-glow-intro');
            }}
            className="w-full h-12 text-lg text-white font-bold rounded-2xl transition-all animate-in slide-in-from-bottom duration-700 delay-400 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #f472b6, #e11d48)', boxShadow: '0 4px 12px rgba(244, 114, 182, 0.25)' }}
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
          onClose={() => { }} // Fonction vide - impossible de fermer
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
              className="w-full p-6 rounded-[2rem] border-none shadow-2xl shadow-gray-200/50 transition-all hover:scale-[1.02] bg-gradient-to-br from-pink-100 via-rose-50 to-white"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center text-4xl shadow-lg shadow-gray-200/50">
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

  // Page d'introduction Project Glow - Page 1: Salut, je suis Glowee
  if (currentView === 'project-glow-intro') {
    const continueText = language === 'fr' ? 'Chaque pas compte' : language === 'en' ? 'Every step counts' : 'Cada paso cuenta';

    return (
      <div className="min-h-screen flex flex-col bg-white">
        {/* Image Glowee en haut */}
        <div className="flex-1 flex items-center justify-center pt-8 pb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 rounded-[2rem] blur-xl opacity-40"></div>
            <img
              src="/Glowee/glowee-acceuillante.webp"
              alt="Glowee"
              className="w-64 h-64 object-contain drop-shadow-2xl relative z-10"
            />
          </div>
        </div>

        {/* Contenu en bas */}
        <div className="px-6 pb-12 space-y-8">
          {/* Texte */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
              {language === 'fr' ? 'Salut. Je suis Glowee.' : language === 'en' ? 'Hi. I\'m Glowee.' : 'Hola. Soy Glowee.'}
            </h1>
            <p className="text-lg text-gray-600">
              {language === 'fr' ? 'Le miroir qui reflète tes efforts.' : language === 'en' ? 'The mirror that reflects your efforts.' : 'El espejo que refleja tus esfuerzos.'}
            </p>
            <p className="text-xl font-medium bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
              {language === 'fr' ? 'Ravie de faire ta rencontre !' : language === 'en' ? 'Nice to meet you!' : '¡Encantada de conocerte!'}
            </p>
          </div>

          {/* Bouton */}
          <Button
            onClick={() => setCurrentView('presentation-1')}
            className="w-full h-14 text-lg bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-gray-200/50 hover:shadow-xl transition-all"
          >
            {continueText}
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  // Page 2: Tu avances
  if (currentView === 'presentation-1') {
    const continueText = language === 'fr' ? 'Continuer' : language === 'en' ? 'Continue' : 'Continuar';
    const tags = ['#Progression', '#PetitesVictoires', '#FiertéSaine'];

    return (
      <div className="min-h-screen flex flex-col p-6 bg-white">
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-8">
          {/* Titre */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              {language === 'fr' ? 'Tu avances.' : language === 'en' ? 'You\'re moving forward.' : 'Avanzas.'}
            </h1>
            <p className="text-2xl text-pink-500 font-medium">
              {language === 'fr' ? 'Et ça compte.' : language === 'en' ? 'And it counts.' : 'Y eso cuenta.'}
            </p>
          </div>

          {/* Texte explicatif */}
          <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
            <p className="text-lg text-gray-600 leading-relaxed text-center">
              {language === 'fr'
                ? 'Célèbre tes victoires quotidiennes. Même minuscule, un pas reste un pas.'
                : language === 'en'
                  ? 'Celebrate your daily victories. Even tiny, a step is still a step.'
                  : 'Celebra tus victorias diarias. Incluso minúsculo, un paso sigue siendo un paso.'}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-center">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full bg-pink-100 text-pink-700 text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bouton Continuer */}
          <Button
            onClick={() => setCurrentView('presentation-2')}
            className="w-full h-14 text-lg bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-gray-200/50 hover:shadow-xl transition-all"
          >
            {continueText}
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  // Page 3: Reconnais tes efforts
  if (currentView === 'presentation-2') {
    const continueText = language === 'fr' ? 'Continuer' : language === 'en' ? 'Continue' : 'Continuar';
    const examples = language === 'fr'
      ? ['J\'ai commencé…', 'Je n\'ai pas abandonné…', 'J\'ai essayé…', 'J\'ai réussi…']
      : language === 'en'
        ? ['I started…', 'I didn\'t give up…', 'I tried…', 'I succeeded…']
        : ['Empecé…', 'No me rendí…', 'Intenté…', 'Lo logré…'];
    const tags = ['#Action', '#Constance', '#Élan'];

    return (
      <div className="min-h-screen flex flex-col p-6 bg-white">
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-8">
          {/* Titre */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
              {language === 'fr' ? 'Reconnais tes efforts.' : language === 'en' ? 'Recognize your efforts.' : 'Reconoce tus esfuerzos.'}
            </h1>
          </div>

          {/* Exemples */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-4 text-center">
              {language === 'fr' ? 'Écris :' : language === 'en' ? 'Write:' : 'Escribe:'}
            </p>
            <div className="space-y-3">
              {examples.map((example, index) => (
                <p key={index} className="text-lg text-gray-700 text-center font-medium">
                  « {example} »
                </p>
              ))}
            </div>
          </div>

          {/* Texte */}
          <p className="text-lg text-gray-600 text-center leading-relaxed">
            {language === 'fr'
              ? 'Valide tes progrès. Bâtis ta fierté.'
              : language === 'en'
                ? 'Validate your progress. Build your pride.'
                : 'Valida tu progreso. Construye tu orgullo.'}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-center">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full bg-pink-100 text-pink-700 text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bouton Continuer */}
          <Button
            onClick={() => setCurrentView('presentation-3')}
            className="w-full h-14 text-lg bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-gray-200/50 hover:shadow-xl transition-all"
          >
            {continueText}
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  // Page 4: Pourquoi ça marche ?
  if (currentView === 'presentation-3') {
    const startText = language === 'fr' ? 'Commencer' : language === 'en' ? 'Start' : 'Comenzar';
    const tags = ['#Confiance', '#Clarté', '#Momentum'];

    return (
      <div className="min-h-screen flex flex-col p-6 bg-white">
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-8">
          {/* Titre */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
              {language === 'fr' ? 'Pourquoi ça marche ?' : language === 'en' ? 'Why does it work?' : '¿Por qué funciona?'}
            </h1>
          </div>

          {/* Liste des avantages */}
          <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                <p className="text-lg text-gray-700">
                  {language === 'fr'
                    ? 'L\'auto-valorisation renforce la confiance.'
                    : language === 'en'
                      ? 'Self-validation strengthens confidence.'
                      : 'La auto-validación fortalece la confianza.'}
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                <p className="text-lg text-gray-700">
                  {language === 'fr'
                    ? 'Elle réduit le sentiment d\'échec.'
                    : language === 'en'
                      ? 'It reduces the feeling of failure.'
                      : 'Reduce la sensación de fracaso.'}
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                <p className="text-lg text-gray-700">
                  {language === 'fr'
                    ? 'Elle crée du momentum.'
                    : language === 'en'
                      ? 'It creates momentum.'
                      : 'Crea momentum.'}
                </p>
              </li>
            </ul>
          </div>

          {/* Conclusion */}
          <p className="text-xl text-center font-medium bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
            {language === 'fr'
              ? 'Une victoire par jour suffit.'
              : language === 'en'
                ? 'One victory per week is enough.'
                : 'Una victoria por semana es suficiente.'}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-center">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full bg-pink-100 text-pink-700 text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bouton Commencer */}
          <Button
            onClick={() => startChallenge()}
            className="w-full h-14 text-lg bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-gray-200/50 hover:shadow-xl transition-all"
          >
            {startText}
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  // Pages d'onboarding masquées: goal-setup-5 (Si Dieu te donnait tout), goal-setup-1 (Choisis l'objectif), flow-proposition (Un pas de plus vers ton objectif)
  // Ces pages sont sautées - l'utilisateur va directement au dashboard après presentation-2

  // Page de description du Flow - Page A (saisie de l'objectif)
  if (currentView === 'flow-description') {
    return (
      <FlowDescriptionPage
        language={language}
        objectifPrincipal={objectifPrincipal}
        onBack={() => setCurrentView('flow-proposition')}
        onCreate={(description) => {
          setFlowDescription(description);
          // Lancer la génération en arrière-plan
          generateFlowInBackground(objectifPrincipal, description);
          // Attendre 5 secondes avec animation puis rediriger vers l'accueil
          setTimeout(() => {
            setCurrentView('dashboard');
          }, 5000);
        }}
      />
    );
  }

  // Page du Flow Challenge - Suivi jour après jour
  if (currentView === 'flow-challenge') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <FlowChallengePage
          language={language}
          personalizedFlow={personalizedFlow}
          objectifPrincipal={objectifPrincipal}
          onBack={() => setCurrentView('dashboard')}
          onToggleAction={toggleFlowAction}
          onSelectChoice={selectFlowChoice}
          onCompleteDay={completeFlowDay}
          onRegenerateFlow={() => {
            regenerateFlow();
            setCurrentView('flow-description');
          }}
          onContinueFlow={continueFlow}
          needsContinuation={checkNeedsContinuation()}
          isGeneratingFlow={isGeneratingFlow}
          checkAndUnlockNextDay={checkAndUnlockNextDay}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-navy-900 text-stone-100' : 'bg-gradient-to-br from-white via-gray-50 to-gray-100 text-stone-900'}`}>
      {/* Main Content */}
      <main className="flex-1 pb-28 overflow-y-auto">
        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="p-5 space-y-5 max-w-md mx-auto relative z-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header avec avatar et notification */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center text-white font-bold shadow-lg shadow-gray-200/50">
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
                    className="px-3 py-2 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white text-xs font-bold shadow-lg shadow-gray-200/50 flex items-center gap-1.5 hover:shadow-xl transition-shadow"
                  >
                    <Download className="w-4 h-4" />
                    {language === 'fr' ? 'Installer' : language === 'en' ? 'Install' : 'Instalar'}
                  </button>
                )}
                <button className="w-11 h-11 rounded-full bg-white shadow-lg shadow-gray-200/50 flex items-center justify-center hover:shadow-xl transition-shadow">
                  <Bell className="w-5 h-5 text-pink-400" />
                </button>
              </div>
            </div>

            {/* Message Glowee - Style glassmorphism - Taille réduite + Glowee agrandie */}
            <div className="relative">
              <Card className="border-none shadow-xl shadow-gray-200/50 bg-white/80 backdrop-blur-md rounded-3xl overflow-visible">
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
                  className={`flex items-center gap-2 transition-all duration-500 ease-in-out ${showTimeCapsuleCard
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
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-lg shadow-gray-200/50 hover:shadow-xl hover:scale-105 transition-all"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Plan Pro</span>
                  </button>
                </div>

                {/* Carte Message à moi - Centré avec animation slide fluide */}
                <div
                  className={`w-full flex justify-center transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${showTimeCapsuleCard
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
                    }`}
                >
                  <div
                    className="w-full cursor-pointer transform transition-transform duration-300 hover:scale-[1.02]"
                    onClick={() => checkFeatureAccess('message_a_moi', () => setShowTimeCapsuleDrawer(true))}
                  >
                    <TimeCapsule
                      theme={theme}
                      isExpanded={false}
                      onToggle={() => setShowTimeCapsuleDrawer(true)}
                    />
                  </div>
                </div>
              </div>

              {/* Bouton Challenge Switch - Position absolue fixe à droite */}
              <button
                onClick={() => setShowSmallWinsHelp(true)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white shadow-lg shadow-gray-200/50 hover:shadow-xl transition-all"
              >
                <ChevronRight className="w-5 h-5 rotate-180 text-pink-400" />
              </button>
            </div>

            {/* Popup Explications Petites Victoires */}
            <Dialog open={showSmallWinsHelp} onOpenChange={setShowSmallWinsHelp}>
              <DialogContent className="max-w-[340px] w-[90%] rounded-[2rem] p-0 overflow-hidden bg-white border-none shadow-2xl">
                <div className="absolute top-3 right-3 z-20">
                  <Button variant="ghost" size="icon" onClick={() => setShowSmallWinsHelp(false)} className="rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/80 h-8 w-8">
                    <X className="w-4 h-4 text-gray-500" />
                  </Button>
                </div>

                <div className="overflow-x-auto flex snap-x snap-mandatory scrollbar-hide">
                  {/* Slide 1 */}
                  <div className="min-w-full snap-center p-8 pt-12 flex flex-col items-center text-center space-y-6 bg-gradient-to-br from-pink-50 to-white">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-800 leading-tight">
                        Tu avances.<br />
                        <span className="text-pink-500">Et ça compte.</span>
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm font-medium text-gray-600 leading-relaxed">
                        Célèbre tes victoires quotidiennes.
                        Même minuscule, un pas reste un pas.
                      </p>
                    </div>

                    <div className="pt-4 flex flex-wrap justify-center gap-2">
                      {['#Progression', '#PetitesVictoires', '#FiertéSaine'].map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-[10px] font-bold tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Slide 2 */}
                  <div className="min-w-full snap-center p-8 pt-12 flex flex-col items-center text-center space-y-6 bg-gradient-to-br from-purple-50 to-white">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-800 leading-tight">
                        Reconnais<br />
                        <span className="text-purple-500">tes efforts.</span>
                      </h3>
                    </div>

                    <div className="space-y-3 bg-white/60 p-4 rounded-2xl backdrop-blur-sm w-full shadow-sm border border-purple-100">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Écris :</p>
                      <ul className="space-y-2 text-sm font-medium text-gray-700 text-left pl-2">
                        <li className="flex items-center gap-2"><span className="text-purple-400">•</span> « J’ai commencé… »</li>
                        <li className="flex items-center gap-2"><span className="text-purple-400">•</span> « Je n’ai pas abandonné… »</li>
                        <li className="flex items-center gap-2"><span className="text-purple-400">•</span> « J’ai essayé… »</li>
                        <li className="flex items-center gap-2"><span className="text-purple-400">•</span> « J’ai réussi… »</li>
                      </ul>
                    </div>

                    <p className="text-sm font-bold text-gray-800">
                      Valide tes progrès. Bâtis ta fierté.
                    </p>

                    <div className="flex flex-wrap justify-center gap-2">
                      {['#Action', '#Constance', '#Élan'].map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-[10px] font-bold tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Slide 3 */}
                  <div className="min-w-full snap-center p-8 pt-12 flex flex-col items-center text-center space-y-6 bg-gradient-to-br from-amber-50 to-white">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-800 leading-tight">
                        Pourquoi<br />
                        <span className="text-amber-500">ça marche ?</span>
                      </h3>
                    </div>

                    <div className="space-y-4 text-sm font-medium text-gray-600 leading-relaxed max-w-[240px]">
                      <p>L’auto-valorisation renforce la confiance.</p>
                      <p>Elle réduit le sentiment d’échec.</p>
                      <p>Elle crée du momentum.</p>
                    </div>

                    <div className="px-4 py-2 bg-amber-100 rounded-xl text-amber-700 font-bold text-sm">
                      Une victoire par jour suffit.
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                      {['#Confiance', '#Clarté', '#Momentum'].map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-amber-100 text-amber-600 text-[10px] font-bold tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Indicateur de swipe */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 pb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Carte Ma Semaine - MASQUÉE */}
            {/* <Card
              className="border-none shadow-lg bg-[#facc15] text-amber-950 rounded-[2rem] overflow-hidden relative min-h-[220px] cursor-pointer transition-all duration-300 hover:scale-[1.01]"
              onClick={() => setCurrentView('routine')}
            >
              <div className="absolute bottom-0 left-0 right-0 h-32 opacity-40 pointer-events-none">
                <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
                  <path fill="#ca8a04" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,160C960,139,1056,149,1152,160C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
              </div>

              <CardContent className="p-6 h-full flex flex-col justify-between relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-black/10 rounded-full">
                    <Calendar className="w-5 h-5 text-amber-900" />
                  </div>
                  <h3 className="text-base font-bold text-amber-900">
                    {language === 'fr' ? 'Ma Semaine' : language === 'en' ? 'My Week' : 'Mi Semana'}
                  </h3>
                </div>

                <div className="flex-1 flex items-center">
                  <div>
                    <p className="text-5xl font-bold text-amber-950">
                      {(() => {
                        const weekDates = getWeekDates(0);
                        return tasksWithDates.filter(t => !t.completed && weekDates.includes(t.date)).length;
                      })()}
                      <span className="text-lg ml-2 text-amber-900/60 font-medium">
                        {language === 'fr' ? 'tâches' : language === 'en' ? 'tasks' : 'tareas'}
                      </span>
                    </p>
                    <p className="text-sm text-amber-800/70 mt-2">
                      {language === 'fr' ? 'Cette semaine' : language === 'en' ? 'This week' : 'Esta semana'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-amber-900/60">
                    {language === 'fr' ? 'Clique pour voir' : language === 'en' ? 'Click to view' : 'Clic para ver'}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-amber-900/10 flex items-center justify-center">
                    <ChevronRight className="w-5 h-5 text-amber-900" />
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Grande carte Challenge Mind & Life - Style glassmorphism */}
            {selectedChallenge === 'mind-life' && showChallengeCard && (
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
            {selectedChallenge === 'beauty-body' && showChallengeCard && (
              <Card
                className="border-none shadow-2xl shadow-gray-200/60 cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-pink-200 via-rose-100 to-pink-50 rounded-[2rem] overflow-hidden relative"
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
                    <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] px-2.5 py-0.5 rounded-full border-0 shadow-lg shadow-gray-300/50">
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

            {/* Carte Série - Tracking des victoires consécutives */}
            <Card className="border-none shadow-lg bg-white rounded-2xl overflow-hidden mb-2">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500 flex items-center justify-center shadow-lg animate-pulse">
                        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C10.5 2 9.5 3 9.5 4.5C9.5 6 10.5 7 12 7C13.5 7 14.5 6 14.5 4.5C14.5 3 13.5 2 12 2ZM12 22C16 22 19 19 19 15C19 11 16 8 12 8C8 8 5 11 5 15C5 19 8 22 12 22ZM12 20C9 20 7 18 7 15C7 12 9 10 12 10C15 10 17 12 17 15C17 18 15 20 12 20Z" />
                        </svg>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-pink-400 flex items-center justify-center text-sm font-bold text-pink-600">
                        {(() => {
                          const today = new Date().toISOString().split('T')[0];
                          const wins = bonusProgress?.smallWins || [];
                          let streak = 0;
                          let checkDate = new Date();
                          while (true) {
                            const dateStr = checkDate.toISOString().split('T')[0];
                            const hasWin = wins.some((w: any) => w.date === dateStr);
                            if (hasWin) {
                              streak++;
                              checkDate.setDate(checkDate.getDate() - 1);
                            } else if (dateStr === today && wins.some((w: any) => w.date === today)) {
                              streak++;
                              checkDate.setDate(checkDate.getDate() - 1);
                            } else {
                              break;
                            }
                          }
                          return streak;
                        })()}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-800">{language === 'fr' ? 'Votre série de fierté' : language === 'en' ? 'Your pride streak' : 'Tu serie de orgullo'}</h3>
                      <p className="text-xs text-gray-500">{language === 'fr' ? 'Garde le rythme !' : language === 'en' ? 'Keep it up!' : '¡Sigue así!'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Share2 className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Jours de la semaine */}
                <div className="flex items-center justify-between">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => {
                    const today = new Date();
                    const currentDay = today.getDay() === 0 ? 6 : today.getDay() - 1; // 0 = Lundi
                    const dayIndex = index;
                    const diff = dayIndex - currentDay;
                    const checkDate = new Date(today);
                    checkDate.setDate(today.getDate() + diff);
                    const dateStr = checkDate.toISOString().split('T')[0];
                    const dayNumber = checkDate.getDate();
                    const wins = bonusProgress?.smallWins || [];
                    const hasWin = wins.some((w: any) => w.date === dateStr);
                    const isToday = diff === 0;

                    return (
                      <div key={day} className="flex flex-col items-center gap-1">
                        <span className={`text-[10px] ${isToday ? 'font-bold text-pink-600' : 'text-gray-400'}`}>
                          {language === 'fr' ? day : language === 'en' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index] : ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][index]}
                        </span>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${hasWin
                            ? 'bg-gradient-to-br from-pink-400 to-purple-500 shadow-md scale-110'
                            : isToday
                              ? 'bg-pink-100 border-2 border-pink-300'
                              : 'bg-gray-100'
                            }`}
                        >
                          {hasWin ? (
                            <Check className={`w-5 h-5 text-white animate-in zoom-in duration-300 ${isToday ? 'animate-bounce' : ''}`} />
                          ) : (
                            <span className={`text-xs font-semibold ${isToday ? 'text-pink-600' : 'text-gray-400'}`}>
                              {dayNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Petits Succès Compact */}
            <div
              className="cursor-pointer"
              onClick={() => checkFeatureAccess('petites_victoires', () => { })}
            >
              <SmallWinsCompact theme={theme} />
            </div>

            {/* Section Carnet de fierté */}
            <div className="px-2.5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-900 font-semibold text-base font-sans">
                  {language === 'fr' ? 'Carnet de fierté' : language === 'en' ? 'Pride Journal' : 'Diario de orgullo'}
                </h3>
                {/* Icône de sélection du design */}
                <button
                  onClick={() => setShowPrideDesignPicker(true)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-pink-100 transition-all"
                  title={language === 'fr' ? 'Changer le design' : language === 'en' ? 'Change design' : 'Cambiar diseño'}
                >
                  <Palette className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {bonusProgress?.smallWins && bonusProgress.smallWins.length > 0 ? (
                <>
                  {/* DESIGN 1: Gallery - Grille masonry élaborée */}
                  {prideJournalDesign === 'gallery' && (
                    <div className="space-y-4">
                      {/* Grille masonry 2 colonnes */}
                      <div className="grid grid-cols-2 gap-3">
                        {bonusProgress.smallWins.slice(0, 15).map((win, index) => {
                          const isLarge = index === 0 || index === 3 || index === 7 || index === 12;
                          const gradients = [
                            'from-pink-500 via-rose-400 to-pink-300',
                            'from-violet-500 via-purple-400 to-violet-300',
                            'from-amber-500 via-orange-400 to-amber-300',
                            'from-cyan-500 via-sky-400 to-cyan-300',
                            'from-emerald-500 via-teal-400 to-emerald-300'
                          ];
                          const gradient = gradients[index % gradients.length];
                          const emojis = ['✨', '🌟', '💫', '🎯', '🏆', '🎉', '💪', '⭐', '🔥', '💎', '🌈', '🦋', '⚡', '🎊', '🌺'];

                          return (
                            <div
                              key={win.id || index}
                              className={`relative rounded-2xl overflow-hidden ${isLarge ? 'col-span-2 min-h-[160px]' : 'min-h-[120px]'
                                }`}
                            >
                              <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                              <div className="absolute inset-0 opacity-20" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                              }} />

                              <div className="relative p-4 h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                  <span className="text-4xl filter drop-shadow-lg">{emojis[index % emojis.length]}</span>
                                  <span className="text-[10px] font-black text-white/90 bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">
                                    #{String(index + 1).padStart(2, '0')}
                                  </span>
                                </div>
                                <div>
                                  <p className={`font-bold text-white leading-tight drop-shadow-md ${isLarge ? 'text-lg' : 'text-sm'}`}>
                                    {win.text.length > (isLarge ? 80 : 40) ? win.text.substring(0, isLarge ? 80 : 40) + '...' : win.text}
                                  </p>
                                  <p className="text-[11px] text-white/80 mt-2 font-medium">
                                    {new Date(win.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', {
                                      weekday: 'short',
                                      day: 'numeric',
                                      month: 'short'
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {bonusProgress.smallWins.length >= 15 && (
                        <button
                          onClick={() => router.push('/small-wins')}
                          className="w-full py-4 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white rounded-2xl font-bold text-sm hover:shadow-2xl transition-all flex items-center justify-center gap-3"
                        >
                          <Sparkles className="w-5 h-5" />
                          <span>
                            {language === 'fr'
                              ? `Découvrir ${bonusProgress.smallWins.length - 15} autres succès`
                              : language === 'en'
                                ? `Discover ${bonusProgress.smallWins.length - 15} more wins`
                                : `Descubrir ${bonusProgress.smallWins.length - 15} éxitos más`}
                          </span>
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* DESIGN 2: Starlight - Constellation de victoires */}
                  {prideJournalDesign === 'starlight' && (
                    <div className="space-y-5">
                      {/* Header cosmos avec compteur */}
                      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 p-6">
                        {/* Étoiles brillantes */}
                        <div className="absolute inset-0 overflow-hidden">
                          <div className="absolute top-4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse" />
                          <div className="absolute top-8 right-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-75" />
                          <div className="absolute bottom-6 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-150" />
                          <div className="absolute top-1/2 right-8 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-300" />
                          <div className="absolute bottom-10 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-500" />
                        </div>
                        
                        <div className="relative text-center">
                          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-200 via-amber-300 to-orange-400 mb-3 shadow-2xl shadow-yellow-500/50">
                            <span className="text-4xl">✨</span>
                          </div>
                          <h4 className="text-xl font-bold text-white mb-1">
                            {language === 'fr' ? 'Ta Constellation' : language === 'en' ? 'Your Constellation' : 'Tu Constelación'}
                          </h4>
                          <p className="text-sm text-purple-200">
                            {bonusProgress.smallWins.length} {language === 'fr' ? 'étoiles brillantes' : language === 'en' ? 'bright stars' : 'estrellas brillantes'}
                          </p>
                        </div>
                      </div>

                      {/* Grille d'étoiles */}
                      <div className="grid grid-cols-3 gap-3">
                        {bonusProgress.smallWins.slice(0, 15).map((win, index) => {
                          const starColors = [
                            'from-yellow-300 via-amber-400 to-orange-500',
                            'from-cyan-300 via-blue-400 to-indigo-500',
                            'from-pink-300 via-rose-400 to-purple-500',
                            'from-emerald-300 via-teal-400 to-cyan-500',
                            'from-violet-300 via-purple-400 to-fuchsia-500'
                          ];
                          const starSizes = index < 3 ? 'col-span-2 row-span-2' : index < 7 ? 'col-span-1 row-span-2' : '';
                          const starGlow = index < 3 ? 'shadow-2xl shadow-yellow-500/50' : index < 7 ? 'shadow-xl shadow-blue-500/40' : 'shadow-lg shadow-purple-500/30';
                          
                          return (
                            <div
                              key={win.id || index}
                              className={`relative rounded-2xl overflow-hidden ${starSizes} ${starGlow} transform hover:scale-105 transition-transform`}
                            >
                              <div className={`absolute inset-0 bg-gradient-to-br ${starColors[index % starColors.length]}`} />
                              <div className="absolute inset-0 bg-black/20" />
                              
                              {/* Étoile brillante */}
                              <div className="absolute top-2 right-2 text-lg animate-pulse">
                                {index < 3 ? '⭐' : index < 7 ? '✦' : '✧'}
                              </div>
                              
                              <div className="relative p-4 h-full flex flex-col justify-between min-h-[100px]">
                                <p className={`font-bold text-white leading-tight drop-shadow-lg ${index < 3 ? 'text-lg' : 'text-sm'}`}>
                                  {win.text.length > (index < 3 ? 60 : 30) ? win.text.substring(0, index < 3 ? 60 : 30) + '...' : win.text}
                                </p>
                                <p className="text-[10px] text-white/80 mt-2">
                                  #{String(index + 1).padStart(2, '0')}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {bonusProgress.smallWins.length >= 15 && (
                        <button
                          onClick={() => router.push('/small-wins')}
                          className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                          <span>🌌</span>
                          <span>
                            {language === 'fr'
                              ? `Découvrir ${bonusProgress.smallWins.length - 15} étoiles cachées`
                              : language === 'en'
                                ? `Discover ${bonusProgress.smallWins.length - 15} hidden stars`
                                : `Descubrir ${bonusProgress.smallWins.length - 15} estrellas ocultas`}
                          </span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* DESIGN 3: Summit - Ascension vers le sommet */}
                  {prideJournalDesign === 'summit' && (
                    <div className="space-y-4">
                      {/* Vue d'ensemble de la montagne */}
                      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 p-6">
                        {/* Montagnes en arrière-plan */}
                        <div className="absolute bottom-0 left-0 right-0 h-32">
                          <svg viewBox="0 0 400 120" className="w-full h-full" preserveAspectRatio="none">
                            <path d="M0,120 L100,40 L200,80 L300,20 L400,60 L400,120 Z" fill="rgba(16, 185, 129, 0.3)" />
                            <path d="M0,120 L80,60 L180,90 L280,35 L400,70 L400,120 Z" fill="rgba(5, 150, 105, 0.4)" />
                            <path d="M0,120 L120,50 L220,85 L320,25 L400,50 L400,120 Z" fill="rgba(4, 120, 87, 0.5)" />
                          </svg>
                        </div>
                        
                        {/* Sommet avec drapeau */}
                        <div className="relative text-center">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 mb-2 shadow-xl">
                            <span className="text-3xl">🏔️</span>
                          </div>
                          <h4 className="text-lg font-bold text-emerald-900">
                            {language === 'fr' ? 'Ton Ascension' : language === 'en' ? 'Your Ascent' : 'Tu Ascensión'}
                          </h4>
                          <p className="text-sm text-emerald-700">
                            {bonusProgress.smallWins.length} {language === 'fr' ? 'sommets atteints' : language === 'en' ? 'peaks reached' : 'cumbres alcanzadas'}
                          </p>
                        </div>
                      </div>

                      {/* Étapes de progression */}
                      <div className="space-y-2">
                        {bonusProgress.smallWins.slice(0, 15).map((win, index) => {
                          const altitudeColors = [
                            'from-emerald-400 to-teal-500',
                            'from-teal-400 to-cyan-500',
                            'from-cyan-400 to-sky-500',
                            'from-sky-400 to-blue-500',
                            'from-blue-400 to-indigo-500'
                          ];
                          const isPeak = index % 5 === 4;
                          
                          return (
                            <div
                              key={win.id || index}
                              className="flex items-center gap-3"
                            >
                              {/* Marqueur d'altitude */}
                              <div className="flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${altitudeColors[index % altitudeColors.length]} flex items-center justify-center shadow-lg ${isPeak ? 'ring-4 ring-amber-300' : ''}`}>
                                  <span className="text-lg">{isPeak ? '🏆' : '🥾'}</span>
                                </div>
                                {index < bonusProgress.smallWins.slice(0, 15).length - 1 && (
                                  <div className="w-0.5 h-6 bg-gradient-to-b from-emerald-300 to-transparent" />
                                )}
                              </div>
                              
                              {/* Carte de victoire */}
                              <div className="flex-1 bg-white rounded-xl p-3 shadow-sm border border-emerald-100">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-semibold text-gray-800 flex-1">{win.text}</p>
                                  {isPeak && (
                                    <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full ml-2">
                                      {language === 'fr' ? 'SOMMET' : language === 'en' ? 'PEAK' : 'CUMBRE'}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">
                                  {new Date(win.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', {
                                    day: 'numeric',
                                    month: 'short'
                                  })}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {bonusProgress.smallWins.length >= 15 && (
                        <button
                          onClick={() => router.push('/small-wins')}
                          className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                          <span>🧗</span>
                          <span>
                            {language === 'fr'
                              ? `Continuer l'ascension (${bonusProgress.smallWins.length - 15} étapes)`
                              : language === 'en'
                                ? `Continue ascent (${bonusProgress.smallWins.length - 15} steps)`
                                : `Continuar ascensión (${bonusProgress.smallWins.length - 15} pasos)`}
                          </span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* DESIGN 4: Memory - Mur de souvenirs Polaroid */}
                  {prideJournalDesign === 'memory' && (
                    <div className="space-y-5">
                      {/* Header style album photo */}
                      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6 border-2 border-amber-200">
                        {/* Polaroids décoratifs en arrière-plan */}
                        <div className="absolute top-2 right-4 w-16 h-20 bg-white rounded-lg shadow-md transform rotate-12 opacity-60" />
                        <div className="absolute bottom-4 left-4 w-14 h-18 bg-white rounded-lg shadow-md transform -rotate-6 opacity-40" />
                        
                        <div className="relative text-center">
                          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-orange-400 to-pink-400 mb-3 shadow-xl">
                            <span className="text-4xl">📸</span>
                          </div>
                          <h4 className="text-xl font-bold text-amber-900 mb-1">
                            {language === 'fr' ? 'Mur de Souvenirs' : language === 'en' ? 'Memory Wall' : 'Muro de Recuerdos'}
                          </h4>
                          <p className="text-sm text-amber-700">
                            {bonusProgress.smallWins.length} {language === 'fr' ? 'moments capturés' : language === 'en' ? 'captured moments' : 'momentos capturados'}
                          </p>
                        </div>
                      </div>

                      {/* Mur de Polaroids */}
                      <div className="grid grid-cols-2 gap-4">
                        {bonusProgress.smallWins.slice(0, 15).map((win, index) => {
                          const rotations = [-3, 2, -2, 4, -4, 3, -1, 2, -3, 1, -2, 3, -1, 2, -3];
                          const tapeColors = ['bg-pink-300', 'bg-blue-300', 'bg-yellow-300', 'bg-green-300', 'bg-purple-300'];
                          
                          return (
                            <div
                              key={win.id || index}
                              className="relative group"
                              style={{ transform: `rotate(${rotations[index % rotations.length]}deg)` }}
                            >
                              {/* Scotch tape */}
                              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 ${tapeColors[index % tapeColors.length]} opacity-60 rounded-sm transform -rotate-1`} />
                              
                              {/* Polaroid frame */}
                              <div className="bg-white rounded-lg p-3 pb-12 shadow-lg hover:shadow-2xl transition-all hover:scale-105 hover:rotate-0 hover:z-10">
                                {/* Photo area avec emoji */}
                                <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded flex items-center justify-center mb-3">
                                  <span className="text-5xl">
                                    {['✨', '🌟', '💫', '🎯', '🏆', '🎉', '💪', '⭐', '🔥', '💎', '🌈', '🦋', '⚡', '🎊', '🌺'][index % 15]}
                                  </span>
                                </div>
                                
                                {/* Caption */}
                                <p className="text-xs font-bold text-gray-800 leading-tight line-clamp-2">
                                  {win.text}
                                </p>
                                <p className="text-[9px] text-gray-400 mt-1">
                                  {new Date(win.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', {
                                    day: 'numeric',
                                    month: 'short'
                                  })}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {bonusProgress.smallWins.length >= 15 && (
                        <button
                          onClick={() => router.push('/small-wins')}
                          className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                          <span>📷</span>
                          <span>
                            {language === 'fr'
                              ? `Voir ${bonusProgress.smallWins.length - 15} photos supplémentaires`
                              : language === 'en'
                                ? `See ${bonusProgress.smallWins.length - 15} more photos`
                                : `Ver ${bonusProgress.smallWins.length - 15} fotos adicionales`}
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  {language === 'fr' ? 'Aucun succès enregistré' : language === 'en' ? 'No wins recorded' : 'Ningún éxito registrado'}
                </p>
              )}
            </div>

            {/* Drawer de sélection du design pour le carnet de fierté */}
            <Drawer open={showPrideDesignPicker} onOpenChange={setShowPrideDesignPicker}>
              <DrawerContent className="bg-white">
                <DrawerHeader className="text-left">
                  <DrawerTitle className="text-lg font-bold text-gray-900">
                    {language === 'fr' ? 'Choisir un design' : language === 'en' ? 'Choose a design' : 'Elegir un diseño'}
                  </DrawerTitle>
                </DrawerHeader>
                <div className="px-5 pb-6">
                  <div className="grid grid-cols-4 gap-3">
                    {/* Design Gallery */}
                    <button
                      onClick={() => {
                        setPrideJournalDesign('gallery');
                        setShowPrideDesignPicker(false);
                      }}
                      className={`aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all ${prideJournalDesign === 'gallery'
                        ? 'bg-pink-100 border-2 border-pink-500 shadow-md'
                        : 'bg-gray-50 border-2 border-gray-200 hover:border-pink-300'
                        }`}
                    >
                      🖼️
                    </button>

                    {/* Design Starlight */}
                    <button
                      onClick={() => {
                        setPrideJournalDesign('starlight');
                        setShowPrideDesignPicker(false);
                      }}
                      className={`aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all ${prideJournalDesign === 'starlight'
                        ? 'bg-indigo-100 border-2 border-indigo-500 shadow-md'
                        : 'bg-gray-50 border-2 border-gray-200 hover:border-indigo-300'
                        }`}
                    >
                      ✨
                    </button>

                    {/* Design Summit */}
                    <button
                      onClick={() => {
                        setPrideJournalDesign('summit');
                        setShowPrideDesignPicker(false);
                      }}
                      className={`aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all ${prideJournalDesign === 'summit'
                        ? 'bg-emerald-100 border-2 border-emerald-500 shadow-md'
                        : 'bg-gray-50 border-2 border-gray-200 hover:border-emerald-300'
                        }`}
                    >
                      🏔️
                    </button>

                    {/* Design Memory */}
                    <button
                      onClick={() => {
                        setPrideJournalDesign('memory');
                        setShowPrideDesignPicker(false);
                      }}
                      className={`aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all ${prideJournalDesign === 'memory'
                        ? 'bg-amber-100 border-2 border-amber-500 shadow-md'
                        : 'bg-gray-50 border-2 border-gray-200 hover:border-amber-300'
                        }`}
                    >
                      📸
                    </button>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>

            {/* Grille de cartes - Layout moderne compact - Carte Mes Habitudes MASQUÉE */}
            {/* <div className="grid grid-cols-5 gap-3">
              <Card
                className="col-span-3 border-none shadow-lg bg-[#3b82f6] text-white rounded-3xl cursor-pointer transition-all duration-300 hover:scale-[1.01] overflow-hidden relative h-48"
                onClick={() => checkFeatureAccess('habitudes', () => setCurrentView('trackers'))}
              >
                <CardContent className="p-5 h-full flex flex-col justify-between relative z-10">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-0.5">
                        {language === 'fr' ? 'Mes Habitudes' : language === 'en' ? 'My Habits' : 'Mis Hábitos'}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2 h-16 mt-4 items-end px-2 w-full">
                    {[65, 45, 75, 55, 85, 60, 90].map((h, i) => (
                      <div key={i} className="w-full bg-black/10 rounded-full h-full relative overflow-hidden">
                        <div
                          className="absolute bottom-0 left-0 w-full bg-white rounded-full transition-all duration-1000"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">
                        {(() => {
                          const completedNewMe = newMeHabits.filter(h => h.completed).length;
                          const completedCustom = customHabits.filter(h => {
                            const today = getLocalDateString();
                            const tracker = trackers.find(t => t.date === today);
                            return tracker?.habits?.[h.id] || false;
                          }).length;
                          const totalCount = newMeHabits.length + customHabits.length;
                          return totalCount > 0 ? Math.round(((completedNewMe + completedCustom) / totalCount) * 100) : 0;
                        })()}
                        <span className="text-xl">%</span>
                      </span>
                    </div>
                    <p className="text-[10px] text-blue-100 opacity-80 font-medium">
                      {language === 'fr' ? 'Complété' : language === 'en' ? 'Completed' : 'Completado'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div> */}

            {/* Carte Glow Up (Bonus) - MASQUÉE */}
            {/* <Card
              className="border-none shadow-xl shadow-gray-200/50 bg-gradient-to-br from-pink-100 via-purple-50 to-orange-50 rounded-[1.5rem] cursor-pointer transition-all duration-300 hover:scale-[1.02]"
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


            {/* Carte Mon Journal - DÉPLACÉE dans la popup + */}
            {/* <div
              onClick={() => checkFeatureAccess('journal', () => setCurrentView('journal'))}
              className="bg-[#E9D8FD] rounded-[2.5rem] p-6 relative h-[180px] overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-98 shadow-sm group"
            >
              <h3 className="text-xl font-bold text-[#2D2a2e] max-w-[65%] leading-snug relative z-10">
                {language === 'fr' ? 'Raconte ta journée et libère ton esprit' : language === 'en' ? 'Tell your day and free your mind' : 'Cuéntanos tu día y libera tu mente'}
              </h3>

              <div className="absolute bottom-[-20px] left-[-10px] transform rotate-[-5deg] transition-transform group-hover:rotate-0 duration-500">
                <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30 80 C 20 40, 60 20, 80 30 C 110 40, 130 70, 120 100 C 110 130, 60 140, 40 130 C 10 120, 20 100, 30 80 Z" fill="#F0ABFC" />
                  <circle cx="65" cy="85" r="3.5" fill="#000" />
                  <circle cx="95" cy="85" r="3.5" fill="#000" />
                  <path d="M68 100 Q 80 115 92 100" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M50 45 Q 40 25 60 30" stroke="#000" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                  <path d="M55 40 Q 50 20 65 25" stroke="#000" strokeWidth="3.5" strokeLinecap="round" fill="none" transform="translate(10, -5) rotate(20)" />
                  <circle cx="58" cy="92" r="5" fill="#FAA2C1" opacity="0.6" />
                  <circle cx="102" cy="92" r="5" fill="#FAA2C1" opacity="0.6" />
                </svg>
              </div>

              <div className="absolute bottom-6 right-6">
                <div className="bg-black text-white text-xs font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-2 group-hover:scale-105 transition-transform">
                  {language === 'fr' ? 'Écrire' : language === 'en' ? 'Write' : 'Escribir'}
                </div>
              </div>
            </div> */}

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

            {/* Glow Mirror Button - MASQUÉ */}
            {/* <div className="mt-6 mb-4">
              <button
                onClick={() => checkFeatureAccess('glow_mirror', () => setCurrentView('glow-mirror'))}
                className="w-full py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>
                  {language === 'fr' ? 'Glow Mirror' : language === 'en' ? 'Glow Mirror' : 'Glow Mirror'}
                </span>
              </button>
            </div> */}
          </div>
        )}

        {/* Glow Mirror Alert Modal */}
        {showGlowMirrorAlert && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-lg font-bold text-center text-gray-800 mb-2">
                  Glow Mirror
                </h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  ✨ Utilisez Project Glow pendant 7 jours, puis revenez découvrir qui vous êtes en train de devenir !
                </p>
                <button
                  onClick={() => setShowGlowMirrorAlert(false)}
                  className="mt-6 w-full py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-medium hover:from-violet-600 hover:to-purple-600 transition-all"
                >
                  {language === 'fr' ? 'Compris' : language === 'en' ? 'Got it' : 'Entendido'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Glow Mirror Modal */}
        {showGlowMirror && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              {/* Header */}
              <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Glow Mirror</h2>
                      <p className="text-sm text-white/80">
                        {language === 'fr' ? 'Qui tu es en train de devenir' : language === 'en' ? 'Who you are becoming' : 'Quién estás llegando a ser'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowGlowMirror(false)}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                    {glowMirrorMessage}
                  </p>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-400 mb-4">
                    {language === 'fr'
                      ? 'Prochain Glow Mirror disponible dans 7 jours'
                      : language === 'en'
                        ? 'Next Glow Mirror available in 7 days'
                        : 'Próximo Glow Mirror disponible en 7 días'}
                  </p>
                  <button
                    onClick={() => setShowGlowMirror(false)}
                    className="px-8 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                  >
                    {language === 'fr' ? 'Continuer mon voyage' : language === 'en' ? 'Continue my journey' : 'Continuar mi viaje'}
                  </button>
                </div>
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

        {/* Trackers View - Project Glow Design System */}
        {currentView === 'trackers' && (
          <div className="pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-[#F7F8FA]">
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
                    onClick={() => setCurrentView('habit-progress')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                  >
                    <TrendingUp className="w-4 h-4 text-gray-600" />
                    <span className="text-xs font-medium text-gray-700">
                      {language === 'fr' ? 'Progression' : language === 'en' ? 'Progress' : 'Progreso'}
                    </span>
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
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2 font-sans">
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
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2 font-sans">
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
                        className={`flex-1 py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all active:scale-95 ${isSelected ? `bg-gradient-to-br ${mood.gradient} shadow-sm` : 'bg-gray-50'
                          }`}
                      >
                        <mood.icon
                          className={`w-5 h-5 transition-all duration-200 ${isSelected ? "text-white drop-shadow-sm" : ""}`}
                          style={{
                            filter: isSelected ? "none" : "grayscale(100%) brightness(1.3)",
                            opacity: isSelected ? 1 : 0.5,
                            transform: isSelected ? "scale(1.1)" : "scale(1)",
                          }}
                        />
                        <span className={`text-[10px] font-medium ${isSelected ? 'text-white' : 'text-gray-500'}`}>
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
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 font-sans">
                        <span style={{ color: '#fb7185' }}>✨</span>
                        {language === 'fr' ? 'Nouveau Moi' : language === 'en' ? 'New Me' : 'Nuevo Yo'}
                      </h3>
                      <button
                        onClick={() => setShowNewMeSection(!showNewMeSection)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        {showNewMeSection ? (
                          <Eye className="w-4 h-4 text-gray-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <span className="text-xs font-bold text-gray-600">
                      {newMeHabits.filter(h => h.completed).length}/{newMeHabits.length}
                    </span>
                  </div>
                </div>
                {showNewMeSection && (
                  <>
                    <div className="h-px bg-gray-200 mx-4" />
                    <div className="p-4 space-y-1">
                      {newMeHabits.map((habit) => (
                        <button
                          key={habit.id}
                          onClick={() => {
                            const newCompletedState = !habit.completed;

                            // Mettre à jour le state
                            setNewMeHabits(newMeHabits.map(h =>
                              h.id === habit.id ? { ...h, completed: newCompletedState } : h
                            ));

                            // Enregistrer dans localStorage pour la page de progression
                            const today = getLocalDateString();
                            const storageKey = `newme_${habit.id}_${today}`;
                            if (newCompletedState) {
                              localStorage.setItem(storageKey, 'true');
                            } else {
                              localStorage.removeItem(storageKey);
                            }
                          }}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            // TODO: Ouvrir la vue détail 30 jours
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl transition-all duration-200 ${habit.completed
                            ? ''
                            : 'hover:bg-gray-50'
                            }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-xl">{habit.icon}</span>
                            <span className={`text-sm font-medium flex-1 text-left ${habit.completed ? 'text-gray-700 line-through' : 'text-gray-700'
                              }`}>
                              {habit.label}
                            </span>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${habit.completed
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
                  </>
                )}

              </div>
            </div>
          </div>
        )}

        {/* Habit Progress View */}
        {currentView === 'habit-progress' && (
          <div className="pb-24 bg-[#F7F8FA]">
            {/* Header */}
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentView('trackers')}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all duration-200 hover:scale-102 active:scale-98"
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-800" />
                  </button>
                  <h1 className="text-lg font-bold text-gray-800">
                    Progression
                  </h1>
                </div>
                {/* Bouton Perso */}
                <button
                  onClick={() => setShowPersonalHabits(!showPersonalHabits)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${showPersonalHabits
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                >
                  {language === 'fr' ? 'Perso' : language === 'en' ? 'Custom' : 'Perso'}
                </button>
              </div>
            </div>

            <div className="px-4 pb-8 space-y-4">
              {/* All Habits - 30 Day Checklist depuis firstOpenDate */}
              <div className="space-y-4">
                {/* Combine newMeHabits and customHabits, filtre selon bouton Perso */}
                {(() => {
                  const allHabits = showPersonalHabits
                    ? customHabits.map(h => ({ ...h, source: 'custom' as const }))
                    : [
                      ...newMeHabits.map(h => ({ ...h, source: 'newme' as const })),
                      ...customHabits.map(h => ({ ...h, source: 'custom' as const }))
                    ];

                  // Récupérer firstOpenDate
                  const firstOpenStr = typeof window !== 'undefined'
                    ? localStorage.getItem('firstOpenDate')
                    : null;
                  const firstOpenDate = firstOpenStr ? new Date(firstOpenStr) : new Date();

                  return allHabits.map((habit) => {
                    // Generate 30 days of completion data depuis firstOpenDate
                    const daysData = [];

                    for (let i = 0; i < 30; i++) {
                      const date = new Date(firstOpenDate);
                      date.setDate(firstOpenDate.getDate() + i);
                      const dateStr = getLocalDateString(date);
                      const dayNumber = i + 1; // 1-30

                      let wasCompleted = false;

                      if (habit.source === 'newme') {
                        // For New Me habits: check localStorage
                        const saved = localStorage.getItem(`newme_${habit.id}_${dateStr}`);
                        wasCompleted = saved === 'true';
                      } else {
                        // For custom habits: check trackers
                        const tracker = trackers.find(t => t.date === dateStr);
                        wasCompleted = tracker?.habits?.[habit.id] || false;
                      }

                      daysData.push({ dayNumber, wasCompleted, dateStr });
                    }

                    // Split into two rows: days 1-15 and days 16-30
                    const firstRow = daysData.slice(0, 15);
                    const secondRow = daysData.slice(15, 30);

                    return (
                      <div key={`${habit.source}-${habit.id}`} className="bg-white rounded-2xl p-4 shadow-sm">
                        {/* Habit Header */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm flex-shrink-0
                            ${habit.source === 'newme' ? 'bg-gradient-to-br from-purple-100 to-pink-100' :
                              habit.type === 'good' ? 'bg-emerald-100' : 'bg-rose-100'}
                          `}>
                            {habit.source === 'newme' ? (
                              <span>{habit.icon}</span>
                            ) : habit.type === 'good' ? (
                              <Check className="w-6 h-6 text-emerald-600" />
                            ) : (
                              <Minus className="w-6 h-6 text-rose-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-gray-800 truncate">
                              {habit.label}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {(() => {
                                const completedCount = daysData.filter(d => d.wasCompleted).length;
                                const percentage = Math.round((completedCount / 30) * 100);
                                return `${completedCount}/30 jours (${percentage}%)`;
                              })()}
                            </p>
                          </div>
                        </div>

                        {/* 30 Days Grid - 2 rows of 15 */}
                        <div className="space-y-2">
                          {/* First row: days 1-15 */}
                          <div className="grid" style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))', gap: '4px' }}>
                            {firstRow.map((day) => (
                              <div
                                key={day.dayNumber}
                                className={`
                                  aspect-square rounded
                                  ${day.wasCompleted
                                    ? 'bg-emerald-500 shadow-sm'
                                    : 'bg-gray-100 border border-gray-200'}
                                `}
                                title={`Jour ${day.dayNumber}: ${day.wasCompleted ? 'Complété' : 'Non complété'}`}
                              />
                            ))}
                          </div>

                          {/* Second row: days 16-30 */}
                          <div className="grid" style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))', gap: '4px' }}>
                            {secondRow.map((day) => (
                              <div
                                key={day.dayNumber}
                                className={`
                                  aspect-square rounded
                                  ${day.wasCompleted
                                    ? 'bg-emerald-500 shadow-sm'
                                    : 'bg-gray-100 border border-gray-200'}
                                `}
                                title={`Jour ${day.dayNumber}: ${day.wasCompleted ? 'Complété' : 'Non complété'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Empty state if no habits at all */}
              {(showPersonalHabits ? customHabits.length === 0 : newMeHabits.length === 0 && customHabits.length === 0) && (
                <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                  <Target className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium mb-1">
                    {showPersonalHabits
                      ? (language === 'fr' ? 'Aucune habitude personnalisée' : language === 'en' ? 'No custom habits' : 'Ningún hábito personalizado')
                      : (language === 'fr' ? 'Aucune habitude' : language === 'en' ? 'No habits' : 'Ningún hábito')}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {showPersonalHabits
                      ? (language === 'fr' ? 'Ajoutez des habitudes personnalisées dans la page Habitudes' : language === 'en' ? 'Add custom habits in the Habits page' : 'Añada hábitos personalizados en la página de Hábitos')
                      : (language === 'fr' ? 'Ajoutez des habitudes pour commencer à suivre votre progression' : language === 'en' ? 'Add habits to start tracking your progress' : 'Añada hábitos para comenzar a seguir su progreso')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Planning View - Ma Semaine */}
        {currentView === 'routine' && (
          <div className="pb-24 relative z-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="p-4 pb-0 flex items-center justify-between">
              <div className="flex items-center gap-3 mb-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentView('dashboard')}
                >
                  <X className="w-5 h-5" />
                </Button>
                <h1 className="text-xl font-bold">
                  {language === 'fr' ? 'Ma semaine' : language === 'en' ? 'My week' : 'Mi semana'}
                </h1>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDayView(!isDayView)}
                className="rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                {isDayView ? <LayoutGrid className="w-5 h-5 text-stone-500" /> : <Eye className="w-5 h-5 text-stone-500" />}
              </Button>
            </div>

            {!isDayView ? (
              <>
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
                            className={`rounded-xl shadow-md ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} relative overflow-hidden min-h-[160px] cursor-pointer hover:shadow-lg transition-shadow`}
                            onClick={() => {
                              setSelectedDayViewDate(dayDate);
                              setIsDayView(true);
                            }}
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
                                        className={`p-1.5 rounded-lg text-[10px] relative overflow-hidden group ${taskGradient
                                          ? `bg-gradient-to-r ${taskGradient} text-gray-800`
                                          : theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50 text-stone-600'
                                          }`}
                                      >
                                        <div className="flex items-start gap-1.5 relative z-10">
                                          <div className={`mt-0.5 w-2.5 h-2.5 rounded border flex items-center justify-center flex-shrink-0 ${task.completed
                                            ? 'bg-emerald-500 border-emerald-500'
                                            : 'border-stone-300 bg-white/50'
                                            }`}>
                                            {task.completed && <Check className="w-2 h-2 text-white" />}
                                          </div>
                                          <span className={`leading-tight line-clamp-2 ${task.completed ? 'line-through opacity-50' : ''}`}>
                                            {task.text}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    })()}
                  </div>
                </div>
              </>
            ) : (
              /* VUE JOUR TYPE APPLE CALENDAR */
              <div className="px-4 py-2 space-y-6 animate-in slide-in-from-right-4 duration-300">
                {/* Gros Header Date & Nav Mois */}
                <div className="flex items-end justify-between mb-4">
                  <div className="flex items-start gap-1">
                    <h2 className="text-4xl font-bold text-gray-900 leading-none">
                      {selectedDayViewDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', { weekday: 'short' }).slice(0, 3)}
                    </h2>
                    <div className="w-2 h-2 rounded-full bg-rose-500 mt-2 shadow-sm shadow-rose-200"></div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl text-stone-400 font-light leading-tight capitalize">
                      {selectedDayViewDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', { month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-lg text-stone-300 font-light leading-tight">
                      {selectedDayViewDate.getFullYear()}
                    </p>
                  </div>
                </div>

                {/* Bandeau des jours (Strip) */}
                <div className="flex justify-between items-center overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide select-none touch-pan-x">
                  {[-3, -2, -1, 0, 1, 2, 3].map(offset => {
                    const d = new Date(selectedDayViewDate);
                    d.setDate(d.getDate() + offset);
                    const isSelected = offset === 0;
                    const isToday = getLocalDateString(d) === getLocalDateString(new Date());

                    return (
                      <button
                        key={offset}
                        onClick={() => setSelectedDayViewDate(d)}
                        className={`flex flex-col items-center justify-center min-w-[48px] h-[64px] rounded-2xl transition-all duration-300 flex-shrink-0 mx-1 ${isSelected ? 'bg-white shadow-md scale-105 ring-1 ring-black/5' : 'text-stone-400 hover:text-stone-600 hover:bg-white/50'}`}
                      >
                        <span className="text-[10px] font-medium uppercase tracking-wide opacity-80 mb-0.5">
                          {d.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', { weekday: 'short' }).slice(0, 3)}
                        </span>
                        <span className={`text-xl font-bold ${isSelected ? 'text-gray-900' : 'text-stone-400'}`}>
                          {d.getDate()}
                        </span>
                        {isToday && !isSelected && <span className="block w-1 h-1 bg-rose-400 rounded-full mt-1 opacity-50"></span>}
                        {isSelected && <span className="block w-1 h-1 bg-gray-900 rounded-full mt-1"></span>}
                      </button>
                    );
                  })}
                </div>

                {/* Liste des tâches */}
                <div className="space-y-0 min-h-[300px]">
                  {(() => {
                    const dateString = getLocalDateString(selectedDayViewDate);
                    const tasks = getTasksForDate(dateString, "user");

                    if (tasks.length === 0) {
                      return (
                        <div className="py-20 text-center flex flex-col items-center justify-center gap-4 opacity-50">
                          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-stone-400 stroke-1" />
                          </div>
                          <p className="text-sm font-light text-stone-500">
                            {language === 'fr' ? 'Rien de prévu pour ce jour' : language === 'en' ? 'Nothing planned for today' : 'Nada planeado para hoy'}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAddTask(true)}
                            className="mt-2 rounded-full border-dashed"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            {language === 'fr' ? 'Ajouter' : 'Add'}
                          </Button>
                        </div>
                      );
                    }

                    return tasks.map((task, i) => (
                      <div key={task.id} className="group flex items-start gap-4 py-4 border-b border-gray-100 border-dashed last:border-0 hover:bg-stone-50/50 -mx-2 px-4 rounded-lg transition-colors cursor-pointer"
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
                      >
                        {/* Left Icon - Checkbox style but bigger */}
                        <div className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${task.completed
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-stone-200 bg-white group-hover:border-rose-300'
                          }`}>
                          {task.completed && <Check className="w-4 h-4 text-white" />}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <p className={`text-base font-medium leading-normal break-words ${task.completed ? 'line-through text-stone-400' : 'text-gray-900'}`}>
                            {task.text}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {task.goalId && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 font-medium">
                                Objectif
                              </span>
                            )}
                            {task.generated && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 font-medium flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                IA
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            const confirmed = window.confirm(
                              language === 'fr' 
                                ? 'Supprimer cette tâche ?' 
                                : language === 'en' 
                                  ? 'Delete this task?' 
                                  : '¿Eliminar esta tarea?'
                            );
                            if (confirmed) {
                              setTasksWithDates(prev => prev.filter(t => t.id !== task.id));
                              if (user && task.id.startsWith('firebase_')) {
                                try {
                                  await deleteTaskFromFirebase(task.id);
                                } catch (error) {
                                  console.error('Error deleting task from Firebase:', error);
                                }
                              }
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg"
                          title={language === 'fr' ? 'Supprimer' : language === 'en' ? 'Delete' : 'Eliminar'}
                        >
                          <X className="w-4 h-4 text-stone-400 hover:text-red-500 transition-colors" />
                        </button>
                      </div>
                    ));
                  })()}
                </div>


              </div>
            )}

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
          <div className="pb-24 bg-white">
            {/* Header */}
            <div className="p-4 pb-0 bg-white">
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

            {/* Sélecteur de dates - Oval pill design */}
            <div className="px-4 py-2">
              <div className="flex justify-between items-center gap-1">
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
                      <button
                        key={index}
                        className={`relative flex flex-col items-center cursor-pointer transition-all px-3 py-2 rounded-full ${isSelected
                          ? 'bg-gray-900 text-white scale-105'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        onClick={() => setBeautySelectedDate(dateString)}
                      >
                        <span className={`text-[10px] uppercase font-bold ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                          {dayName}
                        </span>
                        <span className={`text-base font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                          {dayNumber}
                        </span>
                        {/* Croix de validation */}
                        {isValidated && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow-lg animate-in zoom-in duration-500">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
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
                  className={`flex-1 px-2 py-2 rounded-lg text-xs font-semibold transition-all ${newMeActiveTab === 'daily'
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
                  className={`flex-1 px-2 py-2 rounded-lg text-xs font-semibold transition-all ${newMeActiveTab === 'progress'
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
                  className={`flex-1 px-2 py-2 rounded-lg text-xs font-semibold transition-all ${newMeActiveTab === 'badges'
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
                    <Card className="border-none shadow-xl shadow-gray-200/50 bg-white/80 backdrop-blur-md rounded-3xl overflow-visible">
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

                      const isExpanded = expandedPillar === pillar.id;

                      return (
                        <div key={pillar.id}>
                          {/* Pillar Card */}
                          <div
                            className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01] bg-gradient-to-br from-white to-pink-50 shadow-md hover:shadow-lg ${isCompleted ? 'opacity-60' : ''
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
                              {/* Flèche d'ouverture pour tous les piliers */}
                              <div
                                className="flex-shrink-0 p-1 rounded-full hover:bg-pink-100 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation(); // Empêcher la propagation pour ne pas cocher la tâche
                                  setExpandedPillar(isExpanded ? null : pillar.id);
                                }}
                              >
                                <ChevronDown
                                  className={`w-5 h-5 text-pink-400 transition-transform duration-300 ${(isChoicePillar && beautyChoiceExpanded) || (!isChoicePillar && isExpanded) ? 'rotate-180' : ''
                                    }`}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Section dépliable avec explications pour tous les piliers */}
                          {!isChoicePillar && (
                            <div
                              className={`overflow-hidden transition-all duration-300 ease-out ${isExpanded ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0'
                                }`}
                            >
                              <div className="bg-pink-50/50 rounded-xl p-4 mx-2">
                                <h5 className="font-semibold text-sm text-pink-700 mb-2">
                                  {language === 'fr' ? 'Conseils & Explications' : language === 'en' ? 'Tips & Explanations' : 'Consejos y Explicaciones'}
                                </h5>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                  {pillar.id === 'walk-sport' && (language === 'fr'
                                    ? 'La marche rapide ou le sport quotidien améliorent la circulation sanguine, boostent l\'énergie et favorisent un sommeil réparateur. 30 minutes suffisent pour activer le métabolisme et libérer des endorphines.'
                                    : language === 'en'
                                      ? 'Brisk walking or daily sport improve blood circulation, boost energy and promote restorative sleep. 30 minutes is enough to activate metabolism and release endorphins.'
                                      : 'Caminar rápido o hacer deporte diariamente mejora la circulación sanguínea, aumenta la energía y favorece un sueño reparador. 30 minutos son suficientes para activar el metabolismo y liberar endorfinas.'
                                  )}
                                  {pillar.id === 'water' && (language === 'fr'
                                    ? 'Boire 2 litres d\'eau par jour hydrate la peau de l\'intérieur, réduit les cernes et améliore l\'élasticité de la peau. L\'hydratation optimale favorise aussi l\'élimination des toxines et la brillance des cheveux.'
                                    : language === 'en'
                                      ? 'Drinking 2 liters of water per day hydrates skin from within, reduces dark circles and improves skin elasticity. Optimal hydration also promotes toxin elimination and hair shine.'
                                      : 'Beber 2 litros de agua al día hidrata la piel desde el interior, reduce las ojeras y mejora la elasticidad de la piel. La hidratación óptima también favorece la eliminación de toxinas y el brillo del cabello.'
                                  )}
                                </p>
                                <div className="mt-3 flex items-center justify-between">
                                  <span className="text-xs text-pink-500 font-medium">
                                    {isCompleted ? '✓ ' : ''}{language === 'fr' ? 'Pilier' : language === 'en' ? 'Pillar' : 'Pilar'} {isCompleted ? (language === 'fr' ? 'complété' : language === 'en' ? 'completed' : 'completado') : (language === 'fr' ? 'à faire' : language === 'en' ? 'to do' : 'por hacer')}
                                  </span>
                                  <button
                                    onClick={() => toggleBeautyPillar(beautySelectedDate, pillar.id)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${isCompleted
                                      ? 'bg-gray-200 text-gray-600'
                                      : 'bg-pink-500 text-white hover:bg-pink-600'
                                      }`}
                                  >
                                    {isCompleted
                                      ? (language === 'fr' ? 'Annuler' : language === 'en' ? 'Undo' : 'Deshacer')
                                      : (language === 'fr' ? 'Valider' : language === 'en' ? 'Complete' : 'Completar')
                                    }
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Slide content for choice pillar */}
                          {isChoicePillar && (
                            <div
                              className={`overflow-hidden transition-all duration-300 ease-out ${beautyChoiceExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                                }`}
                            >
                              <div className="space-y-3">
                                {/* Message Glowee - With typing effect */}
                                <div className="relative">
                                  <Card className="border-none shadow-xl shadow-gray-200/50 bg-white/80 backdrop-blur-md rounded-3xl overflow-visible">
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
                                  const hasDetailedExplanation = choice.detailedExplanation && choice.detailedExplanation[language];

                                  return (
                                    <div key={choice.id}>
                                      <div
                                        className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01] ${isSelected
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

                                      {/* Explications détaillées avec flèche */}
                                      {hasDetailedExplanation && (
                                        <div className="mt-2">
                                          <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem value={`explanation-${choice.id}`} className="border-none">
                                              <AccordionTrigger className="py-2 px-4 text-xs font-medium text-pink-600 hover:text-pink-700 hover:no-underline bg-pink-50 rounded-xl">
                                                {language === 'fr' ? 'En savoir plus' : language === 'en' ? 'Learn more' : 'Saber más'}
                                              </AccordionTrigger>
                                              <AccordionContent className="pt-2">
                                                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 space-y-4">
                                                  {/* Explication détaillée */}
                                                  <p className="text-sm text-gray-700 leading-relaxed">
                                                    {choice.detailedExplanation![language]}
                                                  </p>

                                                  {/* Résultats promis */}
                                                  {choice.promisedResults && choice.promisedResults[language] && (
                                                    <div className="space-y-2">
                                                      <p className="text-xs font-bold text-pink-600 uppercase tracking-wide">
                                                        {language === 'fr' ? 'Résultats promis :' : language === 'en' ? 'Promised results:' : 'Resultados prometidos:'}
                                                      </p>
                                                      <ul className="space-y-1">
                                                        {choice.promisedResults[language].map((result, idx) => (
                                                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                            <span className="text-pink-400 mt-1">✦</span>
                                                            {result}
                                                          </li>
                                                        ))}
                                                      </ul>
                                                    </div>
                                                  )}

                                                  {/* Message Glowee */}
                                                  {choice.gloweeMessage && choice.gloweeMessage[language] && (
                                                    <div className="bg-white rounded-xl p-3 shadow-sm">
                                                      <p className="text-xs text-pink-500 font-medium italic">
                                                        Glowee : "{choice.gloweeMessage[language]}"
                                                      </p>
                                                    </div>
                                                  )}
                                                </div>
                                              </AccordionContent>
                                            </AccordionItem>
                                          </Accordion>
                                        </div>
                                      )}

                                      {/* Subtasks for this choice */}
                                      {hasSubtasks && isSelected && (
                                        <div className="ml-8 mt-2 space-y-2">
                                          {choice.subtasks!.map((subtask) => {
                                            const isSubtaskCompleted = dayProgress?.subtasks?.[subtask.id] || false;

                                            return (
                                              <div
                                                key={subtask.id}
                                                className={`p-3 rounded-xl cursor-pointer transition-all duration-300 ${isSubtaskCompleted
                                                  ? 'bg-green-50 opacity-60'
                                                  : 'bg-pink-50 hover:bg-pink-100'
                                                  }`}
                                                onClick={() => toggleBeautySubtask(beautySelectedDate, subtask.id)}
                                              >
                                                <div className="flex items-center gap-2">
                                                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isSubtaskCompleted ? 'bg-green-500 border-green-500' : 'border-pink-300'
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
                            style={{
                              width: `${(Object.keys(newMeProgress).filter(day => {
                                const dayProgress = newMeProgress[parseInt(day)];
                                return dayProgress && Object.values(dayProgress).filter(Boolean).length === 13;
                              }).length / 30) * 100}%`
                            }}
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
                              className={`p-4 rounded-lg transition-all ${isUnlocked
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
          <div className="pb-24 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
            {/* Header élégant */}
            <div className="flex items-center gap-3 p-5 pb-4 max-w-3xl mx-auto">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-10 h-10 bg-white/80 backdrop-blur-md shadow-lg shadow-gray-200/50 hover:bg-white"
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
                        className={`border-none shadow-xl shadow-gray-200/30 cursor-pointer hover:scale-[1.02] transition-all bg-white/80 backdrop-blur-md rounded-[1.5rem] overflow-hidden`}
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
              <Card className="border-none shadow-xl shadow-gray-200/30 bg-white/80 backdrop-blur-md rounded-[1.5rem]">
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
                        className={`flex items-center justify-between p-4 rounded-xl cursor-pointer hover:scale-[1.02] transition-all shadow-md ${isCompleted
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400'
                          : 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-sm ${isCompleted ? 'bg-gradient-to-br from-green-400 to-emerald-400' : 'bg-gradient-to-br from-blue-400 to-cyan-400'
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
                            className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-sm ${isCompleted
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
                className="border-none shadow-xl shadow-gray-200/30 cursor-pointer hover:scale-[1.02] transition-all bg-white/80 backdrop-blur-md rounded-[1.5rem]"
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

        {/* Settings/Profil View - Design Moderne UX */}
        {currentView === 'settings' && (
          <ProfilePage
            setShowAuthDialog={setShowAuthDialog}
            setShowPlanSelection={setShowPlanSelection}
          />
        )}
      </main>

      {/* Bottom Navigation - Design moderne épuré */}
      {currentView !== 'goal-details' && (
        <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[92%] max-w-lg z-50">
          <div className="flex items-center gap-2">
            {/* Nav items container */}
            <div className="flex-1 bg-white rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.08)] px-2 py-2 border border-gray-100/80">
              <div className="flex items-center justify-around">
                {/* Aujourd'hui */}
                <button
                  className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-300 ${currentView === 'dashboard'
                    ? 'text-gray-900'
                    : 'text-gray-400 hover:text-gray-600'
                    }`}
                  onClick={() => setCurrentView('dashboard')}
                >
                  <Home className="w-[22px] h-[22px]" strokeWidth={currentView === 'dashboard' ? 2.5 : 1.8} />
                  <span className={`text-[10px] leading-tight ${currentView === 'dashboard' ? 'font-semibold' : 'font-medium'}`}>
                    {language === 'fr' ? "Aujourd'hui" : language === 'en' ? 'Today' : 'Hoy'}
                  </span>
                </button>

                {/* Habitudes */}
                <button
                  className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-300 ${currentView === 'trackers'
                    ? 'text-gray-900'
                    : 'text-gray-400 hover:text-gray-600'
                    }`}
                  onClick={() => checkFeatureAccess('habitudes', () => setCurrentView('trackers'))}
                >
                  <Target className="w-[22px] h-[22px]" strokeWidth={currentView === 'trackers' ? 2.5 : 1.8} />
                  <span className={`text-[10px] leading-tight ${currentView === 'trackers' ? 'font-semibold' : 'font-medium'}`}>
                    {language === 'fr' ? 'Habitudes' : language === 'en' ? 'Habits' : 'Hábitos'}
                  </span>
                </button>

                {/* Ma Semaine */}
                <button
                  className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-300 ${currentView === 'routine'
                    ? 'text-gray-900'
                    : 'text-gray-400 hover:text-gray-600'
                    }`}
                  onClick={() => setCurrentView('routine')}
                >
                  <Calendar className="w-[22px] h-[22px]" strokeWidth={currentView === 'routine' ? 2.5 : 1.8} />
                  <span className={`text-[10px] leading-tight ${currentView === 'routine' ? 'font-semibold' : 'font-medium'}`}>
                    {language === 'fr' ? 'Semaine' : language === 'en' ? 'Week' : 'Semana'}
                  </span>
                </button>

                {/* Profil */}
                <button
                  className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-300 ${currentView === 'settings'
                    ? 'text-gray-900'
                    : 'text-gray-400 hover:text-gray-600'
                    }`}
                  onClick={() => setCurrentView('settings')}
                >
                  <Settings className="w-[22px] h-[22px]" strokeWidth={currentView === 'settings' ? 2.5 : 1.8} />
                  <span className={`text-[10px] leading-tight ${currentView === 'settings' ? 'font-semibold' : 'font-medium'}`}>
                    {language === 'fr' ? 'Profil' : language === 'en' ? 'Profile' : 'Perfil'}
                  </span>
                </button>
              </div>
            </div>

            {/* Bouton + noir */}
            <button
              onClick={() => {
                if (currentView === 'journal') {
                  setShowJournalEntryModal(true);
                } else if (currentView === 'routine') {
                  setShowAddTask(true);
                } else {
                  setShowAddMenu(true);
                }
              }}
              className="flex-shrink-0 w-14 h-14 rounded-[1.75rem] flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.35)] hover:scale-105 active:scale-95 transition-all duration-200"
              style={{
                background: 'linear-gradient(160deg, #1a1a1a 0%, #333 40%, #1a1a1a 100%)',
              }}
            >
              <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
            </button>
          </div>
        </nav>
      )}

      {/* Drawer Message à moi */}
      <Drawer open={showTimeCapsuleDrawer} onOpenChange={setShowTimeCapsuleDrawer}>
        <DrawerContent className="max-w-lg mx-auto bg-white">
          <DrawerHeader className="border-b px-4 py-3">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-lg font-bold flex items-center gap-2 text-gray-900">
                <Mail className="w-5 h-5 text-purple-600" />
                {language === 'fr' ? 'Message à moi' : language === 'en' ? 'Message to me' : 'Mensaje a mí'}
              </DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-gray-100">
                  <X className="w-4 h-4 text-gray-500" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto max-h-[80vh]">
            <TimeCapsule theme={theme} isExpanded={true} standalone={true} />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Drawer Menu Ajouter (+) - Slide du bas vers le haut */}
      <Drawer open={showAddMenu} onOpenChange={setShowAddMenu}>
        <DrawerContent className="max-w-lg mx-auto bg-white">
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-xl">
                {language === 'fr' ? 'Que veux-tu ajouter ?' : language === 'en' ? 'What do you want to add?' : '¿Qué quieres añadir?'}
              </DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="p-6 space-y-6">
            {/* Section Célèbre tes petits succès */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-800 text-lg">
                {language === 'fr' ? "Ma fierté du jour !" : language === 'en' ? "My pride of the day!" : '¡Mi orgullo del día!'}
              </h3>

              {/* Champ de saisie avec bouton + */}
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newWinText}
                    onChange={(e) => setNewWinText(e.target.value)}
                    placeholder={language === 'fr' ? 'Décris ton petit succès...' : language === 'en' ? 'Describe your small win...' : 'Describe tu pequeño éxito...'}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none text-gray-700 placeholder-gray-400 bg-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newWinText.trim()) {
                        checkFeatureAccess('petites_victoires', () => {
                          addSmallWin(newWinText.trim());
                          setNewWinText('');
                          setShowAddMenu(false);
                        });
                      }
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    if (newWinText.trim()) {
                      checkFeatureAccess('petites_victoires', () => {
                        addSmallWin(newWinText.trim());
                        setNewWinText('');
                        setShowAddMenu(false);
                      });
                    }
                  }}
                  disabled={!newWinText.trim()}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Plus className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Carte Mon Journal */}
            <div
              onClick={() => {
                setShowAddMenu(false);
                checkFeatureAccess('journal', () => setCurrentView('journal'));
              }}
              className="w-full bg-[#E9D8FD] rounded-[2rem] p-5 relative h-[160px] overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-98 shadow-sm group"
            >
              <h3 className="text-lg font-bold text-[#2D2a2e] max-w-[60%] leading-snug relative z-10">
                {language === 'fr' ? 'Raconte ta journée et libère ton esprit' : language === 'en' ? 'Tell your day and free your mind' : 'Cuéntanos tu día y libera tu mente'}
              </h3>

              <div className="absolute bottom-[-15px] left-[-5px] transform rotate-[-5deg] transition-transform group-hover:rotate-0 duration-500">
                <svg width="120" height="120" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30 80 C 20 40, 60 20, 80 30 C 110 40, 130 70, 120 100 C 110 130, 60 140, 40 130 C 10 120, 20 100, 30 80 Z" fill="#F0ABFC" />
                  <circle cx="65" cy="85" r="3.5" fill="#000" />
                  <circle cx="95" cy="85" r="3.5" fill="#000" />
                  <path d="M68 100 Q 80 115 92 100" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M50 45 Q 40 25 60 30" stroke="#000" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                  <path d="M55 40 Q 50 20 65 25" stroke="#000" strokeWidth="3.5" strokeLinecap="round" fill="none" transform="translate(10, -5) rotate(20)" />
                  <circle cx="58" cy="92" r="5" fill="#FAA2C1" opacity="0.6" />
                  <circle cx="102" cy="92" r="5" fill="#FAA2C1" opacity="0.6" />
                </svg>
              </div>

              <div className="absolute bottom-4 right-4">
                <div className="bg-black text-white text-xs font-bold py-2 px-4 rounded-full shadow-lg flex items-center gap-2 group-hover:scale-105 transition-transform">
                  {language === 'fr' ? 'Écrire' : language === 'en' ? 'Write' : 'Escribir'}
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

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
        <DrawerContent className="max-w-lg mx-auto bg-white/95 backdrop-blur-xl border-none shadow-2xl shadow-gray-200/50">
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
                    className={`border-none shadow-md cursor-pointer transition-all hover:scale-[1.02] ${isCompleted
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
                            className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all ${isCompleted
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
                        className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${completedThingsAlone.includes(index)
                          ? theme === 'dark'
                            ? 'bg-cyan-900/20 hover:bg-cyan-900/30'
                            : 'bg-cyan-50 hover:bg-cyan-100'
                          : theme === 'dark'
                            ? 'bg-stone-800 hover:bg-stone-700'
                            : 'bg-stone-50 hover:bg-stone-100'
                          }`}
                      >
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${completedThingsAlone.includes(index)
                          ? 'bg-cyan-500 text-white'
                          : theme === 'dark'
                            ? 'bg-stone-700 text-stone-300'
                            : 'bg-white text-stone-600'
                          }`}>
                          {completedThingsAlone.includes(index) ? '✓' : index + 1}
                        </div>
                        <p className={`text-sm flex-1 leading-relaxed transition-all ${completedThingsAlone.includes(index)
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

      {/* Drawer Construire ma victoire */}
      <Drawer open={showAddTask} onOpenChange={(open) => {
        setShowAddTask(open);
        if (!open) {
          // Reset states when closing
          setAddTaskTab('manuel');
          setGloweeVictoryText('');
          setGloweeProposedTasks(null);
          setNewTaskText('');
          setNewTaskDestination('priority');
        }
      }}>
        <DrawerContent className="max-w-lg mx-auto max-h-[90vh] flex flex-col bg-white">
          <DrawerHeader className="border-b flex-shrink-0">
            <DrawerTitle className="text-xl">
              {language === 'fr' ? 'Construire ma victoire' : language === 'en' ? 'Build my victory' : 'Construir mi victoria'}
            </DrawerTitle>
            <DrawerDescription>
              {language === 'fr' ? 'Planifiez votre semaine efficacement' : language === 'en' ? 'Plan your week efficiently' : 'Planifica tu semana eficientemente'}
            </DrawerDescription>
          </DrawerHeader>

          {/* Onglets */}
          <div className="flex border-b">
            <button
              onClick={() => setAddTaskTab('manuel')}
              className={`flex-1 py-3 text-sm font-semibold transition-all ${addTaskTab === 'manuel'
                ? 'text-rose-500 border-b-2 border-rose-500'
                : 'text-stone-400 hover:text-stone-600'
                }`}
            >
              {language === 'fr' ? 'Manuel' : language === 'en' ? 'Manual' : 'Manual'}
            </button>
            <button
              onClick={() => setAddTaskTab('glowee')}
              className={`flex-1 py-3 text-sm font-semibold transition-all ${addTaskTab === 'glowee'
                ? 'text-rose-500 border-b-2 border-rose-500'
                : 'text-stone-400 hover:text-stone-600'
                }`}
            >
              Glowee
            </button>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* ONGLET MANUEL */}
            {addTaskTab === 'manuel' && (
              <>
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
                            className={`p-2.5 rounded-xl text-xs font-semibold transition-all ${newTaskDestination === day.key
                              ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-white shadow-lg'
                              : theme === 'dark'
                                ? 'bg-stone-800 hover:bg-stone-700'
                                : 'bg-stone-100 hover:bg-stone-200'
                              }`}
                          >
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-1.5">
                                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${newTaskDestination === day.key
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
                                  <Badge variant="outline" className={`text-[9px] px-1 py-0 ${newTaskDestination === day.key ? 'border-white text-white' : 'border-rose-400 text-rose-400'
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
              </>
            )}

            {/* ONGLET GLOWEE */}
            {addTaskTab === 'glowee' && (
              <>
                {!gloweeProposedTasks ? (
                  /* Étape 1: Saisie de la victoire */
                  <div className="space-y-6">
                    {/* Image et message de Glowee */}
                    <div className="flex items-start gap-3">
                      <div className="w-[20%] flex-shrink-0">
                        <img
                          src="/Glowee/glowee.webp"
                          alt="Glowee"
                          className="w-full h-auto object-contain"
                        />
                      </div>
                      <div className="flex-1 space-y-2 pt-2">
                        <p className="text-sm text-stone-600 italic">
                          {language === 'fr'
                            ? "On veut tous accumuler de petits succès qui nous font grandir. Mais parfois, on ne sait pas quoi faire."
                            : language === 'en'
                              ? "We all want to accumulate small successes that make us grow. But sometimes, we don't know what to do."
                              : "Todos queremos acumular pequeños éxitos que nos hagan crecer. Pero a veces, no sabemos qué hacer."}
                        </p>
                        <p className="text-lg font-semibold text-gray-800">
                          {language === 'fr'
                            ? "Quelle sera ta prochaine petite victoire ?"
                            : language === 'en'
                              ? "What will be your next small victory?"
                              : "¿Cuál será tu próxima pequeña victoria?"}
                        </p>
                      </div>
                    </div>

                    {/* Nombre de jours */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">
                        {language === 'fr' ? 'Sur combien de jours ?' : language === 'en' ? 'Over how many days?' : '¿En cuántos días?'}
                      </label>
                      <div className="flex gap-2">
                        {[3, 5, 7].map((days) => (
                          <button
                            key={days}
                            onClick={() => setGloweeDayCount(days)}
                            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${gloweeDayCount === days
                              ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-white shadow-lg'
                              : theme === 'dark'
                                ? 'bg-stone-800 hover:bg-stone-700'
                                : 'bg-stone-100 hover:bg-stone-200'
                              }`}
                          >
                            {days} {language === 'fr' ? 'jours' : language === 'en' ? 'days' : 'días'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Champ de saisie */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">
                        {language === 'fr' ? 'Décris ta victoire' : language === 'en' ? 'Describe your victory' : 'Describe tu victoria'}
                      </label>
                      <textarea
                        placeholder={language === 'fr'
                          ? "Ex: Je veux courir 5km, Je veux lire un livre, Je veux apprendre une nouvelle recette..."
                          : language === 'en'
                            ? "Ex: I want to run 5km, I want to read a book, I want to learn a new recipe..."
                            : "Ej: Quiero correr 5km, Quiero leer un libro, Quiero aprender una nueva receta..."}
                        value={gloweeVictoryText}
                        onChange={(e) => setGloweeVictoryText(e.target.value)}
                        className={`w-full p-4 rounded-xl resize-none h-24 ${theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-200'} border focus:outline-none focus:ring-2 focus:ring-rose-400`}
                      />
                    </div>

                    {/* Bouton J'y vais */}
                    <Button
                      className="w-full h-12 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white font-semibold"
                      onClick={async () => {
                        if (!gloweeVictoryText.trim()) return;

                        setIsGloweeLoading(true);

                        try {
                          // Appel à l'API OpenRouter
                          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
                              'HTTP-Referer': window.location.origin,
                            },
                            body: JSON.stringify({
                              model: 'openrouter/aurora-alpha',
                              messages: [
                                {
                                  role: 'system',
                                  content: `Tu es un assistant spécialisé dans la décomposition d'objectifs en petites tâches actionnables. Tu dois créer un plan de ${gloweeDayCount} jours maximum pour aider l'utilisateur à atteindre sa victoire. Chaque jour doit avoir 1-2 tâches concrètes et réalisables. Réponds uniquement au format JSON avec cette structure: {"tasks": [{"text": "description de la tâche", "dayIndex": 0}, ...]}. Le dayIndex commence à 0 pour le premier jour.`
                                },
                                {
                                  role: 'user',
                                  content: `Mon objectif: ${gloweeVictoryText}. Crée-moi un plan sur ${gloweeDayCount} jours maximum.`
                                }
                              ],
                              temperature: 0.7,
                            }),
                          });

                          if (!response.ok) {
                            throw new Error('API request failed');
                          }

                          const data = await response.json();
                          const content = data.choices[0]?.message?.content;

                          // Parse la réponse JSON
                          let parsedTasks;
                          try {
                            // Essayer de parser directement
                            parsedTasks = JSON.parse(content);
                          } catch {
                            // Sinon extraire le JSON de la réponse texte
                            const jsonMatch = content.match(/\{[\s\S]*\}/);
                            if (jsonMatch) {
                              parsedTasks = JSON.parse(jsonMatch[0]);
                            }
                          }

                          if (parsedTasks?.tasks && Array.isArray(parsedTasks.tasks)) {
                            setGloweeProposedTasks(parsedTasks.tasks);
                          } else {
                            throw new Error('Invalid response format');
                          }
                        } catch (error) {
                          console.error('Error generating tasks:', error);
                          // Fallback: générer des tâches par défaut
                          const fallbackTasks = [];
                          for (let i = 0; i < Math.min(3, gloweeDayCount); i++) {
                            fallbackTasks.push({
                              text: language === 'fr'
                                ? `Étape ${i + 1}: Commencer à travailler sur "${gloweeVictoryText}"`
                                : language === 'en'
                                  ? `Step ${i + 1}: Start working on "${gloweeVictoryText}"`
                                  : `Paso ${i + 1}: Empezar a trabajar en "${gloweeVictoryText}"`,
                              dayIndex: i
                            });
                          }
                          setGloweeProposedTasks(fallbackTasks);
                        } finally {
                          setIsGloweeLoading(false);
                        }
                      }}
                      disabled={!gloweeVictoryText.trim() || isGloweeLoading}
                    >
                      {isGloweeLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {language === 'fr' ? 'Génération...' : language === 'en' ? 'Generating...' : 'Generando...'}
                        </div>
                      ) : (
                        language === 'fr' ? "J'y vais" : language === 'en' ? "Let's go" : "Vamos"
                      )}
                    </Button>
                  </div>
                ) : (
                  /* Étape 2: Validation des tâches proposées */
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {language === 'fr' ? 'Voici ton plan !' : language === 'en' ? 'Here is your plan!' : '¡Aquí está tu plan!'}
                      </h3>
                      <p className="text-sm text-stone-500 mt-1">
                        {language === 'fr'
                          ? 'Valide ces tâches pour les ajouter à ton planning'
                          : language === 'en'
                            ? 'Validate these tasks to add them to your schedule'
                            : 'Valida estas tareas para agregarlas a tu calendario'}
                      </p>
                    </div>

                    {/* Liste des tâches proposées */}
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {gloweeProposedTasks.map((task, index) => {
                        const today = new Date();
                        const targetDate = new Date(today);
                        targetDate.setDate(today.getDate() + task.dayIndex);
                        const dateLabel = targetDate.toLocaleDateString(
                          language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES',
                          { weekday: 'long', day: 'numeric', month: 'short' }
                        );

                        return (
                          <div
                            key={index}
                            className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50'} border-l-4 border-rose-400`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {task.dayIndex + 1}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">{task.text}</p>
                                <p className="text-xs text-stone-400 mt-1 capitalize">{dateLabel}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 h-12"
                        onClick={() => {
                          setGloweeProposedTasks(null);
                          setGloweeVictoryText('');
                        }}
                      >
                        {language === 'fr' ? 'Recommencer' : language === 'en' ? 'Start over' : 'Recomenzar'}
                      </Button>
                      <Button
                        className="flex-1 h-12 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white font-semibold"
                        onClick={async () => {
                          const today = new Date();

                          for (const task of gloweeProposedTasks) {
                            const targetDate = new Date(today);
                            targetDate.setDate(today.getDate() + task.dayIndex);

                            const newTaskWithDate = {
                              id: `glowee_${Date.now()}_${Math.random()}`,
                              text: task.text,
                              date: getLocalDateString(targetDate),
                              completed: false,
                              type: 'user' as const
                            };

                            setTasksWithDates(prev => [...prev, newTaskWithDate]);

                            // Sauvegarder dans Firebase si l'utilisateur est connecté
                            if (user) {
                              try {
                                const firebaseId = await saveTask(user.uid, newTaskWithDate);
                                setTasksWithDates(prev => prev.map(t =>
                                  t.id === newTaskWithDate.id ? { ...t, id: firebaseId } : t
                                ));
                              } catch (error) {
                                console.error('Error saving task to Firebase:', error);
                              }
                            }
                          }

                          // Reset et fermer
                          setGloweeProposedTasks(null);
                          setGloweeVictoryText('');
                          setShowAddTask(false);
                          setAddTaskTab('manuel');
                        }}
                      >
                        {language === 'fr' ? 'Valider et ajouter' : language === 'en' ? 'Validate and add' : 'Validar y agregar'}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
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

      {/* Subscription Popup - Legacy */}
      <SubscriptionPopup
        isOpen={showSubscription}
        onClose={() => setShowSubscription(false)}
        source={subscriptionSource}
        onOpenAuthDialog={() => {
          setShouldReopenSubscription(true);
          setShowAuthDialog(true);
        }}
      />

      {/* Plan Selection Popup - New pricing */}
      <PlanSelectionPopup
        isOpen={showPlanSelection}
        onClose={() => {
          setShowPlanSelection(false);
          setPendingPlan(null);
        }}
        onSelectPlan={(plan) => {
          if (!user) {
            // Sauvegarder le plan sélectionné et ouvrir l'authentification
            setPendingPlan(plan);
            setShowPlanSelection(false);
            setShowAuthDialog(true);
          } else {
            // Rediriger vers Stripe avec l'email
            if (plan) {
              const stripeLinks = {
                glow_start: 'https://buy.stripe.com/8x26oH178evq3KLgqNf3a03',
                glow_plus: 'https://buy.stripe.com/9B69AT178gDybddgqNf3a02'
              };
              const stripeUrl = `${stripeLinks[plan]}?prefilled_email=${encodeURIComponent(user.email)}`;
              window.location.href = stripeUrl;
            }
          }
        }}
        language={language}
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
              {language === 'fr' ? 'Challenge Beauté & Corps' : language === 'en' ? 'Beauty & Body Challenge' : 'Desafío Belleza & Cuerpo'}
            </DrawerTitle>
            <DrawerDescription className="text-center text-sm text-stone-600">
              {language === 'fr' ? '30 jours pour un glow up complet' : language === 'en' ? '30 days for a complete glow up' : '30 días para un glow up completo'}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-5 space-y-3">
            {/* Beauty & Body Option - Seul challenge disponible */}
            <button
              onClick={() => {
                setSelectedChallenge('beauty-body');
                setShowChallengeDrawer(false);
              }}
              className={`w-full p-4 rounded-2xl border-none shadow-soft transition-all hover:scale-[1.02] relative overflow-hidden ${selectedChallenge === 'beauty-body'
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

            {/* Section Visibilité des cartes */}
            <div className="border-t border-stone-200 pt-4 mt-4">
              <h4 className="text-sm font-semibold text-stone-700 mb-3">
                {language === 'fr' ? 'Visibilité des cartes' : language === 'en' ? 'Card visibility' : 'Visibilidad de tarjetas'}
              </h4>

              {/* Toggle Challenge Card */}
              <button
                onClick={() => toggleChallengeCard()}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/60 hover:bg-white/80 transition-all mb-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-peach-200 to-peach-300 flex items-center justify-center">
                    <span className="text-lg">💄</span>
                  </div>
                  <span className="text-sm font-medium text-stone-700">
                    {language === 'fr' ? 'Carte Challenge' : language === 'en' ? 'Challenge Card' : 'Tarjeta Desafío'}
                  </span>
                </div>
                <div className="w-10 h-6 rounded-full bg-stone-200 relative transition-colors" style={{ backgroundColor: showChallengeCard ? '#f472b6' : '#e5e7eb' }}>
                  <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all" style={{ left: showChallengeCard ? 'calc(100% - 1.25rem)' : '0.25rem' }}>
                    {showChallengeCard ? <Eye className="w-3 h-3 text-pink-400 absolute top-0.5 left-0.5" /> : <EyeOff className="w-3 h-3 text-gray-400 absolute top-0.5 left-0.5" />}
                  </div>
                </div>
              </button>

              {/* Toggle Flow Card */}
              <button
                onClick={() => toggleFlowCard()}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/60 hover:bg-white/80 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-300 to-purple-400 flex items-center justify-center">
                    <span className="text-lg">✨</span>
                  </div>
                  <span className="text-sm font-medium text-stone-700">
                    {language === 'fr' ? 'Carte Flow' : language === 'en' ? 'Flow Card' : 'Tarjeta Flow'}
                  </span>
                </div>
                <div className="w-10 h-6 rounded-full bg-stone-200 relative transition-colors" style={{ backgroundColor: showFlowCard ? '#8b5cf6' : '#e5e7eb' }}>
                  <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all" style={{ left: showFlowCard ? 'calc(100% - 1.25rem)' : '0.25rem' }}>
                    {showFlowCard ? <Eye className="w-3 h-3 text-violet-500 absolute top-0.5 left-0.5" /> : <EyeOff className="w-3 h-3 text-gray-400 absolute top-0.5 left-0.5" />}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Auth Dialog */}
      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => {
          setShowAuthDialog(false);
          // Si un plan est en attente et l'utilisateur est connecté, rediriger vers Stripe
          if (pendingPlan && user?.email) {
            const stripeUrl = pendingPlan === 'glow_start'
              ? `https://buy.stripe.com/8x26oH178evq3KLgqNf3a03?prefilled_email=${encodeURIComponent(user.email)}`
              : `https://buy.stripe.com/9B69AT178gDybddgqNf3a02?prefilled_email=${encodeURIComponent(user.email)}`;
            setPendingPlan(null);
            window.location.href = stripeUrl;
          }
        }}
        defaultMode={user ? 'signin' : 'signup'}
      />

      {/* Journal Entry Modal */}
      <JournalEntryModal
        isOpen={showJournalEntryModal}
        onClose={() => {
          setShowJournalEntryModal(false);
          setEditingEntry(null);
        }}
        onSave={handleSaveJournalEntry}
        editingEntry={editingEntry}
        language={language}
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
                      {language === 'fr' ? 'Votre série de fierté' : language === 'en' ? 'Your pride streak' : 'Tu serie de orgullo'}
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
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isToday
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

      {/* Journal View */}
      {currentView === 'journal' && canAccessFeature('journal') && (
        <div className="fixed inset-0 z-40 pb-24 bg-white overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header */}
          <div className="px-4 pt-4 pb-0 bg-white">
            <div className="flex items-center gap-3 mb-3">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
                onClick={() => setCurrentView('dashboard')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex-1">
                <h1 className="text-lg font-bold flex items-center gap-2">
                  {language === 'fr' ? 'Mon Journal' : language === 'en' ? 'My Journal' : 'Mi Diario'}
                </h1>
              </div>
            </div>

            {/* Navigation Mois */}
            <div className="flex items-center justify-center gap-4 mt-3">
              <button
                onClick={() => changeJournalMonth('prev')}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              </button>
              <span className="text-base font-semibold text-gray-800 capitalize">
                {journalCurrentMonth.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => changeJournalMonth('next')}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Liste des entrées */}
          <div className="px-4 py-4 space-y-4 max-w-lg mx-auto">
            {journalEntries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-2xl p-4 shadow-sm relative overflow-hidden transition-all hover:shadow-md border border-gray-50">
                {/* Bandeau couleur humeur */}
                <div className="absolute top-0 left-0 right-0 h-2 w-full" style={{ backgroundColor: entry.moodColor || '#fcd34d' }} />

                {/* Header avec date et humeur */}
                <div className="flex items-start justify-between mb-3 mt-1">
                  <div className="flex items-center gap-3">
                    {/* Emoji humeur */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: entry.moodColor + '20' }}
                    >
                      {entry.mood === 'bien' || entry.mood === 'good' ? '😊' :
                        entry.mood === 'super' || entry.mood === 'great' ? '😄' :
                          entry.mood === 'triste' || entry.mood === 'sad' ? '😢' :
                            entry.mood === 'fatigué' || entry.mood === 'tired' ? '😴' : '😐'}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        {entry.date === new Date().toISOString().split('T')[0]
                          ? (language === 'fr' ? 'Aujourd\'hui' : language === 'en' ? 'Today' : 'Hoy')
                          : language === 'fr' ? 'Hier' : language === 'en' ? 'Yesterday' : 'Ayer'
                        }, {new Date(entry.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', { day: 'numeric', month: 'long' })}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-lg font-semibold"
                          style={{ color: entry.moodColor }}
                        >
                          {entry.mood}
                        </span>
                        <span className="text-xs text-gray-400">{entry.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuEntryId(openMenuEntryId === entry.id ? null : entry.id);
                      }}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </button>

                    {/* Menu déroulant */}
                    {openMenuEntryId === entry.id && (
                      <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 min-w-[140px]">
                        <button
                          onClick={() => {
                            editJournalEntry(entry);
                            setOpenMenuEntryId(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          {language === 'fr' ? 'Modifier' : language === 'en' ? 'Edit' : 'Editar'}
                        </button>
                        <button
                          onClick={() => {
                            deleteJournalEntry(entry.id);
                            setOpenMenuEntryId(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          {language === 'fr' ? 'Supprimer' : language === 'en' ? 'Delete' : 'Eliminar'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {entry.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Texte */}
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  {entry.text}
                </p>

                {/* Images si présentes */}
                {entry.images && entry.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {entry.images.map((img, idx) => (
                      <div key={idx} className="flex-shrink-0 w-24 h-24 rounded-xl bg-gray-100 overflow-hidden">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

          </div>
        </div>
      )}

      {/* Glow Mirror View */}
      {currentView === 'glow-mirror' && canAccessFeature('glow_mirror') && (
        <div className="pb-24 bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header */}
          <div className="p-4 pb-0 bg-white">
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
                  {language === 'fr' ? 'Glow Mirror' : language === 'en' ? 'Glow Mirror' : 'Glow Mirror'}
                </h1>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  {language === 'fr' ? 'Qui êtes-vous en train de devenir ?' : language === 'en' ? 'Who are you becoming?' : '¿En quién te estás convirtiendo?'}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 max-w-lg mx-auto">
            {/* Description */}
            <div className="mb-6 p-5 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-violet-800">
                  {language === 'fr' ? 'Qui êtes-vous en train de devenir ?' : language === 'en' ? 'Who are you becoming?' : '¿En quién te estás convirtiendo?'}
                </h2>
              </div>
              <p className="text-sm text-violet-700 leading-relaxed">
                {language === 'fr'
                  ? 'Glow Mirror analyse vos données sur 7 jours pour créer un reflet personnalisé de qui vous êtes en train de devenir.'
                  : language === 'en'
                    ? 'Glow Mirror analyzes your data over 7 days to create a personalized reflection of who you are becoming.'
                    : 'Glow Mirror analiza tus datos durante 7 días para crear un reflejo personalizado de en quién te estás convirtiendo.'}
              </p>
            </div>

            {/* Status message */}
            {!isGlowMirrorReady ? (
              <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {language === 'fr' ? 'Patience...' : language === 'en' ? 'Patience...' : 'Paciencia...'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === 'fr'
                    ? 'Utilisez l\'app pendant 7 jours, puis revenez voir qui vous devenez.'
                    : language === 'en'
                      ? 'Use the app for 7 days, then come back to see who you\'re becoming.'
                      : 'Usa la app durante 7 días, luego vuelve para ver en quién te estás convirtiendo.'}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                  <span className="text-sm font-medium text-gray-600">
                    {language === 'fr' ? `Jour ${daysSinceFirstUse} sur 7` : language === 'en' ? `Day ${daysSinceFirstUse} of 7` : `Día ${daysSinceFirstUse} de 7`}
                  </span>
                </div>
              </div>
            ) : !canViewGlowMirror ? (
              <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {language === 'fr' ? 'Prochain Glow Mirror' : language === 'en' ? 'Next Glow Mirror' : 'Próximo Glow Mirror'}
                </h3>
                <p className="text-gray-600">
                  {language === 'fr'
                    ? 'Votre prochain Glow Mirror sera disponible dans 7 jours.'
                    : language === 'en'
                      ? 'Your next Glow Mirror will be available in 7 days.'
                      : 'Tu próximo Glow Mirror estará disponible en 7 días.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* History */}
                {glowMirrorHistory.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-700 mb-3">
                      {language === 'fr' ? 'Historique' : language === 'en' ? 'History' : 'Historial'}
                    </h3>
                    <div className="space-y-2">
                      {glowMirrorHistory.slice(0, 3).map((entry, idx) => (
                        <div key={idx} className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                          <p className="text-xs text-gray-400 mb-2">
                            {new Date(entry.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', { day: 'numeric', month: 'long' })}
                          </p>
                          <p className="text-sm text-gray-700 line-clamp-3">{entry.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Launch Button */}
                <button
                  onClick={() => generateGlowMirror()}
                  disabled={glowMirrorLoading}
                  className="w-full py-4 rounded-2xl font-bold text-white transition-all bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {glowMirrorLoading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{language === 'fr' ? 'Analyse en cours...' : language === 'en' ? 'Analyzing...' : 'Analizando...'}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{language === 'fr' ? 'Voir mon Glow Mirror' : language === 'en' ? 'See my Glow Mirror' : 'Ver mi Glow Mirror'}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
