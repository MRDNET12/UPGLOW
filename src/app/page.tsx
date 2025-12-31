'use client';

import { useEffect, useState } from 'react';
import { useStore, View } from '@/lib/store';
import { challengeDays, bonusAffirmations, checklistsData, softLifeGuide, bonusSections, fiftyThingsAlone } from '@/lib/challenge-data';
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

export default function GlowUpChallengeApp() {
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
    getCurrentUnlockedDay
  } = useStore();

  const { t } = useTranslation();

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
  const [selectedChecklist, setSelectedChecklist] = useState<typeof checklistsData[0] | null>(null);
  const [showSoftLifeGuide, setShowSoftLifeGuide] = useState(false);
  const [selectedGuideStep, setSelectedGuideStep] = useState<number | null>(null);
  const [selectedBonusSection, setSelectedBonusSection] = useState<typeof bonusSections[0] | null>(null);

  useEffect(() => {
    if (hasStarted) {
      setCurrentView('dashboard');
    }
  }, [hasStarted, setCurrentView]);

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
              {language === 'fr' ? 'Bienvenue' : language === 'en' ? 'Welcome' : 'Bienvenida'}
            </h1>
            <p className="text-xl text-stone-600 dark:text-stone-400 font-light">
              {language === 'fr' ? 'Choisissez votre langue' : language === 'en' ? 'Choose your language' : 'Elige tu idioma'}
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
            onClick={() => setCurrentView('onboarding')}
            className="w-full h-14 text-lg bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white font-semibold rounded-full shadow-lg shadow-rose-200 dark:shadow-rose-900/30"
          >
            {language === 'fr' ? 'Continuer' : language === 'en' ? 'Continue' : 'Continuar'}
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
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
                { icon: BookOpen, title: language === 'fr' ? '30 Jours' : language === 'en' ? '30 Days' : '30 Días', desc: language === 'fr' ? 'Contenu complet' : language === 'en' ? 'Full content' : 'Contenido completo' },
                { icon: TrendingUp, title: language === 'fr' ? 'Progression' : language === 'en' ? 'Progress' : 'Progreso', desc: language === 'fr' ? 'Suivi avancé' : language === 'en' ? 'Advanced tracking' : 'Seguimiento avanzado' },
                { icon: Heart, title: 'Journaling', desc: language === 'fr' ? 'Introspection' : language === 'en' ? 'Self-reflection' : 'Introspección' },
                { icon: Target, title: 'Trackers', desc: language === 'fr' ? 'Habitudes' : language === 'en' ? 'Habits' : 'Hábitos' }
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
                {language === 'fr' ? 'Bienvenue' : language === 'en' ? 'Welcome' : 'Bienvenida'} ✨
              </h1>
              <p className={`text-stone-600 dark:text-stone-400 ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                {language === 'fr' ? 'Continue ton Glow Up Challenge' : language === 'en' ? 'Continue your Glow Up Challenge' : 'Continúa tu Desafío Glow Up'}
              </p>
            </div>

            {/* Progress Card */}
            <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-400" />
                  {language === 'fr' ? 'Ta Progression' : language === 'en' ? 'Your Progress' : 'Tu Progreso'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{language === 'fr' ? 'Semaine' : language === 'en' ? 'Week' : 'Semana'} {Math.ceil(currentDay / 7)} / 4</span>
                  <span className="text-2xl font-bold text-rose-500">{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <p className="text-xs text-stone-500 dark:text-stone-500 text-center">
                  {challengeProgress.completedDays.length} / 30 {language === 'fr' ? 'jours complétés' : language === 'en' ? 'days completed' : 'días completados'}
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
                  <Badge className="bg-rose-500 hover:bg-rose-600">{language === 'fr' ? 'Jour' : language === 'en' ? 'Day' : 'Día'} {challengeProgress.currentDay}</Badge>
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
                  <p className="text-xs text-stone-500 dark:text-stone-500">{journalEntries.length} {language === 'fr' ? 'entrées' : language === 'en' ? 'entries' : 'entradas'}</p>
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
                  <p className="text-xs text-stone-500 dark:text-stone-500">5 {language === 'fr' ? 'étapes' : language === 'en' ? 'steps' : 'pasos'}</p>
                </CardContent>
              </Card>

              <Card
                className={`border-none shadow-md cursor-pointer transition-all hover:scale-105 ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}
                onClick={() => setCurrentView('vision-board')}
              >
                <CardContent className="p-4 text-center">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                  <h3 className="font-semibold text-sm">{t.visionBoard.title}</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-500">{visionBoardImages.length} {language === 'fr' ? 'images' : language === 'en' ? 'images' : 'imágenes'}</p>
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
                    <p className="text-xs text-stone-500 dark:text-stone-500">{t.bonus.affirmations} & {language === 'fr' ? 'Guides' : language === 'en' ? 'Guides' : 'Guías'}</p>
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
                        { label: t.challenge.beauty, icon: '💄', value: getCurrentDayData()?.actions.beauty },
                        { label: t.challenge.mental, icon: '🧠', value: getCurrentDayData()?.actions.mental },
                        { label: t.challenge.lifestyle, icon: '✨', value: getCurrentDayData()?.actions.lifestyle }
                      ].map((action, index) => (
                        <div key={index} className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50'}`}>
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{action.icon}</span>
                            <div>
                              <h4 className="font-semibold text-sm mb-1">{action.label}</h4>
                              <p className="text-sm text-stone-600 dark:text-stone-400">{action.value}</p>
                            </div>
                          </div>
                        </div>
                      ))}
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
                <CardDescription>{language === 'fr' ? 'Exprime-toi librement' : language === 'en' ? 'Express yourself freely' : 'Exprésate libremente'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{language === 'fr' ? 'Comment je me sens aujourd\'hui ?' : language === 'en' ? 'How do I feel today?' : '¿Cómo me siento hoy?'}</label>
                  <Textarea
                    placeholder={language === 'fr' ? 'Ton humeur du moment...' : language === 'en' ? 'Your current mood...' : 'Tu estado de ánimo actual...'}
                    value={newJournalEntry.mood}
                    onChange={(e) => setNewJournalEntry({ ...newJournalEntry, mood: e.target.value })}
                    rows={2}
                    className={theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{language === 'fr' ? 'Qu\'est-ce qui m\'a apporté du glow ?' : language === 'en' ? 'What brought me glow?' : '¿Qué me trajo brillo?'}</label>
                  <Textarea
                    placeholder={language === 'fr' ? 'Les petits moments de joie...' : language === 'en' ? 'Little moments of joy...' : 'Pequeños momentos de alegría...'}
                    value={newJournalEntry.glow}
                    onChange={(e) => setNewJournalEntry({ ...newJournalEntry, glow: e.target.value })}
                    rows={2}
                    className={theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{language === 'fr' ? 'Qu\'est-ce que j\'ai appris ?' : language === 'en' ? 'What did I learn?' : '¿Qué aprendí?'}</label>
                  <Textarea
                    placeholder={language === 'fr' ? 'Tes découvertes et apprentissages...' : language === 'en' ? 'Your discoveries and learnings...' : 'Tus descubrimientos y aprendizajes...'}
                    value={newJournalEntry.learned}
                    onChange={(e) => setNewJournalEntry({ ...newJournalEntry, learned: e.target.value })}
                    rows={2}
                    className={theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{language === 'fr' ? 'Journal libre' : language === 'en' ? 'Free journal' : 'Diario libre'}</label>
                  <Textarea
                    placeholder={language === 'fr' ? 'Écris tout ce qui te passe par la tête...' : language === 'en' ? 'Write whatever comes to mind...' : 'Escribe lo que se te pase por la cabeza...'}
                    value={newJournalEntry.freeContent}
                    onChange={(e) => setNewJournalEntry({ ...newJournalEntry, freeContent: e.target.value })}
                    rows={3}
                    className={theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50'}
                  />
                </div>

                <Button onClick={handleSaveJournalEntry} className="w-full bg-rose-500 hover:bg-rose-600 text-white">
                  <Plus className="mr-2 w-4 h-4" />
                  {language === 'fr' ? 'Ajouter au Journal' : language === 'en' ? 'Add to Journal' : 'Agregar al Diario'}
                </Button>
              </CardContent>
            </Card>

            {/* Journal History */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">{language === 'fr' ? 'Historique' : language === 'en' ? 'History' : 'Historial'}</h2>
              {journalEntries.length === 0 ? (
                <div className={`text-center p-8 rounded-xl ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-stone-400" />
                  <p className="text-stone-500 dark:text-stone-500">{language === 'fr' ? 'Aucune entrée pour le moment' : language === 'en' ? 'No entries yet' : 'Sin entradas por ahora'}</p>
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
                          <p className="text-xs text-stone-500 dark:text-stone-500 mb-1">{language === 'fr' ? 'Glow du jour' : language === 'en' ? 'Today\'s glow' : 'Brillo del día'}</p>
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

        {/* Trackers View */}
        {currentView === 'trackers' && (
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
              <h1 className="text-2xl font-bold">{t.trackers.title} Glow Up</h1>
            </div>

            {/* Today's Trackers */}
            <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle>{t.trackers.today}</CardTitle>
                <CardDescription>{new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hydration */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold">Hydratation</h3>
                    <span className="ml-auto text-sm text-stone-500 dark:text-stone-500">{getTodayTracker().waterGlasses} / 8 verres</span>
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

                {/* Sleep */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Moon className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold">Sommeil</h3>
                    <span className="ml-auto text-sm text-stone-500 dark:text-stone-500">{getTodayTracker().sleepHours}h</span>
                  </div>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    max="12"
                    placeholder="Nombre d'heures"
                    value={getTodayTracker().sleepHours || ''}
                    onChange={(e) => updateTodayTracker({ sleepHours: parseFloat(e.target.value) || 0 })}
                    className={theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50'}
                  />
                </div>

                {/* Mood */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Smile className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-semibold">Humeur</h3>
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

                {/* Activity */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-400" />
                    <h3 className="font-semibold">Activité / Mouvement</h3>
                    <span className="ml-auto text-sm text-stone-500 dark:text-stone-500">{getTodayTracker().activityMinutes} min</span>
                  </div>
                  <Input
                    type="number"
                    min="0"
                    max="180"
                    placeholder="Minutes d'activité"
                    value={getTodayTracker().activityMinutes || ''}
                    onChange={(e) => updateTodayTracker({ activityMinutes: parseInt(e.target.value) || 0 })}
                    className={theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50'}
                  />
                </div>

                {/* Skincare */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-rose-500" />
                    <div>
                      <h3 className="font-semibold">{language === 'fr' ? 'Skincare complété' : language === 'en' ? 'Skincare completed' : 'Cuidado de la piel completado'}</h3>
                      <p className="text-xs text-stone-600 dark:text-stone-400">{language === 'fr' ? 'Routine du jour' : language === 'en' ? 'Today\'s routine' : 'Rutina del día'}</p>
                    </div>
                  </div>
                  <Switch
                    checked={getTodayTracker().skincareCompleted}
                    onCheckedChange={(checked) => updateTodayTracker({ skincareCompleted: checked })}
                  />
                </div>

                {/* Habits */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-green-400" />
                    {t.trackers.dailyHabits}
                  </h3>
                  <div className="space-y-2">
                    {[
                      { key: 'meditation', label: t.trackers.meditation5min },
                      { key: 'journaling', label: t.trackers.journaling },
                      { key: 'gratitude', label: t.trackers.gratitude },
                      { key: 'exercise', label: t.trackers.exercise },
                      { key: 'reading', label: t.trackers.reading },
                      { key: 'noScroll', label: t.trackers.noScrollBeforeSleep }
                    ].map((habit) => (
                      <div key={habit.key} className="flex items-center justify-between p-3 rounded-lg bg-stone-50 dark:bg-stone-800">
                        <span className="text-sm">{habit.label}</span>
                        <Switch
                          checked={getTodayTracker().habits[habit.key] || false}
                          onCheckedChange={(checked) =>
                            updateTodayTracker({
                              habits: { ...getTodayTracker().habits, [habit.key]: checked }
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Routine View */}
        {currentView === 'routine' && (
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
              <h1 className="text-2xl font-bold">{language === 'fr' ? 'Ma Routine Glow Up' : language === 'en' ? 'My Glow Up Routine' : 'Mi Rutina Glow Up'}</h1>
            </div>

            {/* Routine Card */}
            <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-rose-400" />
                  {language === 'fr' ? 'Routine Quotidienne - 5 Étapes' : language === 'en' ? 'Daily Routine - 5 Steps' : 'Rutina Diaria - 5 Pasos'}
                </CardTitle>
                <CardDescription>{language === 'fr' ? 'Personnalise ta routine Glow Up' : language === 'en' ? 'Customize your Glow Up routine' : 'Personaliza tu rutina Glow Up'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 text-white flex items-center justify-center text-sm font-semibold">
                        {step}
                      </div>
                      <Input
                        placeholder={`Étape ${step}`}
                        value={(routine as any)[`step${step}`]}
                        onChange={(e) => updateRoutine({ [`step${step}`]: e.target.value })}
                        className={theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50'}
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{language === 'fr' ? 'Routine complétée aujourd\'hui ?' : language === 'en' ? 'Routine completed today?' : '¿Rutina completada hoy?'}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-500">{language === 'fr' ? 'Marque quand tu as fini' : language === 'en' ? 'Mark when you\'re done' : 'Marca cuando termines'}</p>
                    </div>
                    <Switch
                      checked={routineCompletedDates.includes(todayDate)}
                      onCheckedChange={(checked) => setRoutineCompleted(todayDate, checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Today's Routine Status */}
            {routineCompletedDates.includes(todayDate) && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                <Check className="w-6 h-6" />
                <p className="font-semibold">{language === 'fr' ? 'Routine Glow Up complétée aujourd\'hui ! ✨' : language === 'en' ? 'Glow Up routine completed today! ✨' : '¡Rutina Glow Up completada hoy! ✨'}</p>
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
                <CardDescription>{language === 'fr' ? 'Upload une image qui t\'inspire' : language === 'en' ? 'Upload an image that inspires you' : 'Sube una imagen que te inspire'}</CardDescription>
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
                  <label className="text-sm font-medium">{t.visionBoard.caption} ({language === 'fr' ? 'optionnel' : language === 'en' ? 'optional' : 'opcional'})</label>
                  <Input
                    placeholder={language === 'fr' ? 'Une description ou affirmation...' : language === 'en' ? 'A description or affirmation...' : 'Una descripción o afirmación...'}
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
                  {language === 'fr' ? 'Ajouter au Vision Board' : language === 'en' ? 'Add to Vision Board' : 'Agregar al Tablero de Visión'}
                </Button>
              </CardContent>
            </Card>

            {/* Affirmations Section */}
            <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-gradient-to-br from-rose-900/30 to-pink-900/30' : 'bg-gradient-to-br from-rose-50 to-pink-50'}`}>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-rose-400" />
                  {language === 'fr' ? 'Affirmation du jour' : language === 'en' ? 'Today\'s affirmation' : 'Afirmación del día'}
                </h3>
                <p className="text-lg italic text-stone-700 dark:text-stone-300 font-serif">
                  "{bonusAffirmations[Math.floor(Math.random() * bonusAffirmations.length)]}"
                </p>
              </CardContent>
            </Card>

            {/* Images Grid */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">{language === 'fr' ? 'Mes Images' : language === 'en' ? 'My Images' : 'Mis Imágenes'}</h2>
              {visionBoardImages.length === 0 ? (
                <div className={`text-center p-8 rounded-xl ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 text-stone-400" />
                  <p className="text-stone-500 dark:text-stone-500">{language === 'fr' ? 'Aucune image pour le moment' : language === 'en' ? 'No images yet' : 'Sin imágenes por ahora'}</p>
                  <p className="text-xs text-stone-400 dark:text-stone-600 mt-1">{language === 'fr' ? 'Ajoute des images qui t\'inspirent' : language === 'en' ? 'Add images that inspire you' : 'Agrega imágenes que te inspiren'}</p>
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

            {/* Sections Bonus Principales */}
            <div className="space-y-3">
              {bonusSections.map((section) => (
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
                        <h3 className="font-semibold text-base mb-1">{section.title}</h3>
                        <p className="text-xs text-stone-600 dark:text-stone-400">{section.description}</p>
                        <p className="text-xs text-stone-500 dark:text-stone-500 mt-1 italic">{section.duration}</p>
                      </div>
                      <ChevronRight className={`w-5 h-5 ${section.iconColor} flex-shrink-0`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Affirmations Écrites */}
            <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  {t.bonus.affirmations}
                </CardTitle>
                <CardDescription>{language === 'fr' ? 'Ton arsenal de pensées positives' : language === 'en' ? 'Your arsenal of positive thoughts' : 'Tu arsenal de pensamientos positivos'}</CardDescription>
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
                <CardDescription>{language === 'fr' ? 'Des guides pratiques pour t\'organiser' : language === 'en' ? 'Practical guides to organize yourself' : 'Guías prácticas para organizarte'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {checklistsData.map((checklist) => (
                  <div
                    key={checklist.id}
                    onClick={() => setSelectedChecklist(checklist)}
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 cursor-pointer hover:scale-105 transition-transform"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-xl">
                        {checklist.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{checklist.title}</p>
                        <p className="text-xs text-stone-500 dark:text-stone-500">{checklist.items.length} {language === 'fr' ? 'étapes' : language === 'en' ? 'steps' : 'pasos'}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-blue-400" />
                  </div>
                ))}
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
                <CardDescription>{language === 'fr' ? '5 étapes pour une vie douce et épanouie' : language === 'en' ? '5 steps for a soft and fulfilling life' : '5 pasos para una vida suave y plena'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    {language === 'fr' ? 'Découvre comment créer une vie alignée et sereine' : language === 'en' ? 'Discover how to create an aligned and serene life' : 'Descubre cómo crear una vida alineada y serena'}
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
                      {language === 'fr' ? 'Pourcentage' : language === 'en' ? 'Percentage' : 'Porcentaje'}
                    </span>
                    <span className="font-semibold text-rose-500">{progressPercentage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600 dark:text-stone-400">{t.journal.title}</span>
                    <span className="font-semibold">
                      {journalEntries.length} {language === 'fr' ? 'entrées' : language === 'en' ? 'entries' : 'entradas'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600 dark:text-stone-400">{t.visionBoard.title}</span>
                    <span className="font-semibold">
                      {visionBoardImages.length} {language === 'fr' ? 'images' : language === 'en' ? 'images' : 'imágenes'}
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
                        {language === 'fr' ? 'Change l\'apparence' : language === 'en' ? 'Change appearance' : 'Cambiar apariencia'}
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
                <CardTitle>{language === 'fr' ? 'Export' : language === 'en' ? 'Export' : 'Exportar'}</CardTitle>
                <CardDescription>{language === 'fr' ? 'Télécharge tes données' : language === 'en' ? 'Download your data' : 'Descarga tus datos'}</CardDescription>
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
            className={`flex-1 h-16 flex-col gap-1 rounded-none ${currentView === 'challenge' ? 'text-rose-500' : ''}`}
            onClick={() => setCurrentView('challenge')}
          >
            <Sparkles className="w-6 h-6" />
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
              {softLifeGuide.steps.map((step) => (
                <Card
                  key={step.number}
                  onClick={() => setSelectedGuideStep(selectedGuideStep === step.number ? null : step.number)}
                  className={`border-none shadow-md cursor-pointer transition-all hover:scale-[1.02] ${theme === 'dark' ? 'bg-stone-800' : 'bg-white'}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{step.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">Étape {step.number}</Badge>
                        </div>
                        <CardTitle className="text-lg mt-1">{step.title}</CardTitle>
                        <CardDescription className="text-xs mt-1">{step.description}</CardDescription>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-amber-400 transition-transform ${selectedGuideStep === step.number ? 'rotate-90' : ''}`} />
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
              ))}
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
              </div>
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
            {/* Animation de célébration */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 flex items-center justify-center animate-pulse">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
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

      <style jsx global>{`
        .safe-area-pb {
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
      `}</style>
    </div>
  );
}
