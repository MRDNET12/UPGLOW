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
import InstallPrompt from '@/components/InstallPrompt';
import AppLoader from '@/components/AppLoader';
import { SmallWins } from '@/components/SmallWins';
import { EveningQuestion } from '@/components/EveningQuestion';
import { BoundariesTracker } from '@/components/BoundariesTracker';

export default function GlowUpChallengeApp() {
  const [isHydrated, setIsHydrated] = useState(false);

  const {
    currentView,
    setCurrentView,
    currentDay,
    setCurrentDay,
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
    getSectionWeeklyCompletion
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

  // Hydratation du store - évite les problèmes d'hydratation SSR/CSR
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (hasStarted && isHydrated) {
      setCurrentView('dashboard');
    }
  }, [hasStarted, setCurrentView, isHydrated]);

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

  // Presentation Screen
  if (currentView === 'presentation') {
    return (
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-stone-950 text-stone-100' : 'bg-amber-50 text-stone-900'}`}>
        <div className="flex-1 flex flex-col items-center justify-center p-6 pb-24">
          <div className="max-w-2xl w-full text-center space-y-8">
            {/* Logo / Title */}
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-rose-200 via-pink-200 to-orange-100 dark:from-rose-900 dark:via-pink-900 dark:to-orange-900 shadow-lg">
                <Sparkles className="w-12 h-12 text-rose-500 dark:text-rose-300" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                {t.presentation.title}
              </h1>
              <p className="text-xl text-stone-600 dark:text-stone-400 font-light">
                {t.presentation.subtitle}
              </p>
            </div>

            {/* Quote */}
            <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} shadow-sm border border-stone-200 dark:border-stone-800`}>
              <p className="text-lg italic text-stone-700 dark:text-stone-300 font-serif">
                "{t.presentation.quote}"
              </p>
            </div>

            {/* Description */}
            <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} shadow-sm border border-stone-200 dark:border-stone-800`}>
              <p className="text-base text-stone-700 dark:text-stone-300">
                {t.presentation.description}
              </p>
            </div>

            {/* Triangle of Transformation */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-200">
                {t.presentation.triangleTitle}
              </h2>
              
              <div className="grid gap-6">
                {/* Pillar 1 */}
                <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} shadow-sm border border-stone-200 dark:border-stone-800`}>
                  <h3 className="text-lg font-semibold mb-3 text-rose-500">
                    {t.presentation.pillar1Title}
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    {t.presentation.pillar1Desc}
                  </p>
                </div>

                {/* Pillar 2 */}
                <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} shadow-sm border border-stone-200 dark:border-stone-800`}>
                  <h3 className="text-lg font-semibold mb-3 text-pink-500">
                    {t.presentation.pillar2Title}
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    {t.presentation.pillar2Desc}
                  </p>
                </div>

                {/* Pillar 3 */}
                <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} shadow-sm border border-stone-200 dark:border-stone-800`}>
                  <h3 className="text-lg font-semibold mb-3 text-orange-500">
                    {t.presentation.pillar3Title}
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    {t.presentation.pillar3Desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-200">
                {t.presentation.rulesTitle}
              </h2>
              
              <div className="grid gap-3">
                {[1, 2, 3, 4, 5].map((ruleNum) => (
                  <div
                    key={ruleNum}
                    className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} shadow-sm border border-stone-200 dark:border-stone-800`}
                  >
                    <p className="text-sm text-stone-700 dark:text-stone-300">
                      {(t.presentation as any)[`rule${ruleNum}`]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <Button
              onClick={() => setCurrentView('onboarding')}
              className="w-full h-14 text-lg bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white font-semibold rounded-full shadow-lg shadow-rose-200 dark:shadow-rose-900/30"
            >
              {t.presentation.startChallenge}
              <Sparkles className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Onboarding Screen
  if (!hasStarted) {
    return (
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-stone-950 text-stone-100' : 'bg-amber-50 text-stone-900'}`}>
        <div className="flex-1 flex flex-col items-center justify-center p-6 pb-24">
          <div className="max-w-md w-full text-center space-y-8">
            {/* Logo / Title */}
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-rose-200 via-pink-200 to-orange-100 dark:from-rose-900 dark:via-pink-900 dark:to-orange-900 shadow-lg">
                <Sparkles className="w-12 h-12 text-rose-500 dark:text-rose-300" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                {t.onboarding.title}
              </h1>
              <p className="text-xl text-stone-600 dark:text-stone-400 font-light">
                {t.onboarding.subtitle}
              </p>
            </div>

            {/* Description */}
            <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} shadow-sm border border-stone-200 dark:border-stone-800`}>
              <p className="text-base text-stone-700 dark:text-stone-300">
                {t.onboarding.description}
              </p>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BookOpen, title: t.onboarding.thirtyDays, desc: t.onboarding.fullContent },
                { icon: TrendingUp, title: t.challenge.progression, desc: t.onboarding.advancedTracking },
                { icon: Heart, title: 'Journaling', desc: t.onboarding.selfReflection },
                { icon: Target, title: 'Trackers', desc: t.onboarding.habits }
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} shadow-sm border border-stone-200 dark:border-stone-800`}
                >
                  <feature.icon className="w-8 h-8 mx-auto mb-2 text-rose-400" />
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-500">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Start Button */}
            <Button
              onClick={startChallenge}
              className="w-full h-14 text-lg bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white font-semibold rounded-full shadow-lg shadow-rose-200 dark:shadow-rose-900/30"
            >
              {t.onboarding.startButton}
              <Sparkles className="ml-2 w-5 h-5" />
            </Button>
          </div>
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
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                {t.dashboard.welcome} ✨
              </h1>
              <p className={`text-stone-600 dark:text-stone-400 ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                {t.dashboard.continueYourChallenge}
              </p>
            </div>

            {/* Progress Card */}
            <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-400" />
                  {t.dashboard.yourProgress}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t.dashboard.week} {Math.ceil(currentDay / 7)} / 4</span>
                  <span className="text-2xl font-bold text-rose-500">{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <p className="text-xs text-stone-500 dark:text-stone-500 text-center">
                  {challengeProgress.completedDays.length} / 30 {t.dashboard.daysCompleted}
                </p>
              </CardContent>
            </Card>

            {/* Today's Challenge */}
            <Card
              className={`border-none shadow-lg cursor-pointer transition-all hover:scale-105 ${theme === 'dark' ? 'bg-gradient-to-br from-rose-900/30 to-pink-900/30' : 'bg-gradient-to-br from-rose-50 to-pink-50'}`}
              onClick={() => {
                setCurrentDay(challengeProgress.currentDay);
                setCurrentView('challenge');
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-rose-500 hover:bg-rose-600">{t.challenge.day} {challengeProgress.currentDay}</Badge>
                  <ChevronRight className="w-5 h-5 text-rose-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{getCurrentDayData()?.title}</h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2">{getCurrentDayData()?.content}</p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Card
                className={`border-none shadow-md cursor-pointer transition-all hover:scale-105 ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}
                onClick={() => setCurrentView('journal')}
              >
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                  <h3 className="font-semibold text-sm">{t.journal.title}</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-500">{journalEntries.length} {t.journal.entries}</p>
                </CardContent>
              </Card>

              <Card
                className={`border-none shadow-md cursor-pointer transition-all hover:scale-105 ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}
                onClick={() => setCurrentView('trackers')}
              >
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                  <h3 className="font-semibold text-sm">{t.trackers.title}</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-500">{t.trackers.today}</p>
                </CardContent>
              </Card>

              <Card
                className={`border-none shadow-md cursor-pointer transition-all hover:scale-105 ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}
                onClick={() => setCurrentView('routine')}
              >
                <CardContent className="p-4 text-center">
                  <Layers className="w-8 h-8 mx-auto mb-2 text-rose-400" />
                  <h3 className="font-semibold text-sm">{t.routine.title}</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-500">5 {t.routine.steps}</p>
                </CardContent>
              </Card>

              <Card
                className={`border-none shadow-md cursor-pointer transition-all hover:scale-105 ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}
                onClick={() => setCurrentView('vision-board')}
              >
                <CardContent className="p-4 text-center">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                  <h3 className="font-semibold text-sm">{t.visionBoard.title}</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-500">{visionBoardImages.length} {t.visionBoard.images}</p>
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
            className={`flex-1 h-16 flex-col gap-1 rounded-none ${currentView === 'challenge' ? 'text-rose-500' : ''}`}
            onClick={() => setCurrentView('challenge')}
          >
            <Target className="w-6 h-6" />
            <span className="text-xs">{t.nav.challenge}</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 h-16 flex-col gap-1 rounded-none ${currentView === 'journal' ? 'text-rose-500' : ''}`}
            onClick={() => setCurrentView('journal')}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">{t.nav.journal}</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 h-16 flex-col gap-1 rounded-none ${currentView === 'trackers' ? 'text-rose-500' : ''}`}
            onClick={() => setCurrentView('trackers')}
          >
            <Activity className="w-6 h-6" />
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

      <style jsx global>{`
        .safe-area-pb {
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
      `}</style>

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
}