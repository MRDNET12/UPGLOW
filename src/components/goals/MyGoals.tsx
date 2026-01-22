'use client';

import { useEffect, useState } from 'react';
import { Target, Plus, Activity, Calendar, TrendingUp, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import GloweePopup from '@/components/shared/GloweePopup';
import { GoalDetailsDialog } from '@/components/goals/GoalDetailsDialog';
import { GoalAnalysisExplanation } from '@/components/goals/GoalAnalysisExplanation';
import { GoalConfirmationDialog } from '@/components/goals/GoalConfirmationDialog';
import { markWelcomeSeen } from '@/utils/visitTracker';
import { gloweeMessages } from '@/data/gloweeMessages';
import { useGoalsSync } from '@/hooks/useFirebaseSync';
import { useAuth } from '@/contexts/AuthContext';

interface Goal {
  id: string;
  name: string;
  type: 'financial' | 'personal';
  description: string;
  deadline: string;
  progress: number;
  createdAt: string;
  tasks?: Task[];
  weeklyPriorities?: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  goalColor?: string;
}

interface EnergyLog {
  level: number;
  timestamp: string;
  mentalState?: string;
  physicalState?: string;
  skipped?: boolean;
}

interface Task {
  day: string;
  date?: string; // Date spécifique au format YYYY-MM-DD
  task: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  goalId?: string;
  goalName?: string;
  goalColor?: string;
}

interface MyGoalsProps {
  onAddGloweeTasks?: (
    tasks: Task[],
    goalData: {
      id: string;
      name: string;
      color: string;
      weeklyPriorities: Array<{id: string, text: string, completed: boolean}>;
    }
  ) => void;
  onNavigateToPlanning?: (goalId: string) => void;
  onShowGoalDetails?: (goalId: string) => void;
}

export function MyGoals({ onAddGloweeTasks, onNavigateToPlanning, onShowGoalDetails }: MyGoalsProps = {}) {
  const { user } = useAuth();
  const { loadGoals } = useGoalsSync();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [showEnergyHistory, setShowEnergyHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [energyLogs, setEnergyLogs] = useState<EnergyLog[]>([]);

  // États pour les popups Glowee
  const [showGloweeWelcome, setShowGloweeWelcome] = useState(false);
  const [showGloweeCheckInWelcome, setShowGloweeCheckInWelcome] = useState(false);

  // État pour le dialogue de détails
  const [selectedGoalForDetails, setSelectedGoalForDetails] = useState<Goal | null>(null);
  const [showGoalDetailsDialog, setShowGoalDetailsDialog] = useState(false);

  // État pour le dialogue de confirmation
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingGoalData, setPendingGoalData] = useState<any>(null);

  // Load data from Firebase and localStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load goals from Firebase if user is authenticated
        if (user) {
          console.log('Loading goals from Firebase...');
          const firebaseGoals = await loadGoals();
          if (firebaseGoals.length > 0) {
            console.log('Loaded goals from Firebase:', firebaseGoals);
            // Convertir les objectifs Firebase au format local
            const formattedGoals = firebaseGoals.map((goal: any) => ({
              id: goal.id,
              name: goal.name,
              type: goal.type,
              description: goal.why || '',
              deadline: goal.targetDate,
              progress: goal.progress || 0,
              createdAt: goal.createdAt?.toISOString?.() || new Date().toISOString(),
              tasks: [],
              weeklyPriorities: [],
              goalColor: goal.type === 'financial' ? '#10b981' : goal.type === 'project' ? '#3b82f6' : '#f43f5e'
            }));
            setGoals(formattedGoals);
            // Sauvegarder aussi dans localStorage pour backup
            localStorage.setItem('myGoals', JSON.stringify(formattedGoals));
          } else {
            // Si pas d'objectifs Firebase, charger depuis localStorage
            const savedGoals = localStorage.getItem('myGoals');
            if (savedGoals) {
              setGoals(JSON.parse(savedGoals));
            }
          }
        } else {
          // Si pas d'utilisateur, charger depuis localStorage
          const savedGoals = localStorage.getItem('myGoals');
          if (savedGoals) {
            setGoals(JSON.parse(savedGoals));
          }
        }

        // Load energy logs
        const savedLogs = localStorage.getItem('energyLogs');
        if (savedLogs) {
          setEnergyLogs(JSON.parse(savedLogs));
        }

        // Check if we need to show energy check-in
        checkEnergyCheckIn();

        // DÉSACTIVÉ TEMPORAIREMENT - Les popups s'affichent trop souvent
        /*
        // Vérifier si c'est la 1ère visite de la section Objectifs
        if (isFirstVisit('goals')) {
          setTimeout(() => setShowGloweeWelcome(true), 1000);
        }
        */
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, loadGoals]);

  const checkEnergyCheckIn = () => {
    const savedLogs = localStorage.getItem('energyLogs');
    if (!savedLogs) {
      setShowCheckIn(true);
      // DÉSACTIVÉ TEMPORAIREMENT - Les popups s'affichent trop souvent
      /*
      // Vérifier si c'est la 1ère visite du check-in
      if (isFirstVisit('energy')) {
        setTimeout(() => setShowGloweeCheckInWelcome(true), 1500);
      }
      */
      return;
    }

    const logs: EnergyLog[] = JSON.parse(savedLogs);
    if (logs.length === 0) {
      setShowCheckIn(true);
      // DÉSACTIVÉ TEMPORAIREMENT - Les popups s'affichent trop souvent
      /*
      // Vérifier si c'est la 1ère visite du check-in
      if (isFirstVisit('energy')) {
        setTimeout(() => setShowGloweeCheckInWelcome(true), 1500);
      }
      */
      return;
    }

    const lastLog = logs[logs.length - 1];
    const now = new Date();
    const lastLogTime = new Date(lastLog.timestamp);
    const hoursSinceLastLog = (now.getTime() - lastLogTime.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastLog >= 5) {
      setShowCheckIn(true);
    }
  };

  const handleCheckInComplete = () => {
    const newLog: EnergyLog = {
      level: energyLevel,
      timestamp: new Date().toISOString()
    };

    const updatedLogs = [...energyLogs, newLog];
    setEnergyLogs(updatedLogs);
    localStorage.setItem('energyLogs', JSON.stringify(updatedLogs));
    setShowCheckIn(false);
  };

  const handleGoalCreated = async () => {
    // Recharger les objectifs après création
    if (user) {
      // Utilisateur connecté: recharger depuis Firebase
      try {
        console.log('Reloading goals from Firebase after creation...');
        const firebaseGoals = await loadGoals();
        const formattedGoals = firebaseGoals.map((goal: any) => ({
          id: goal.id,
          name: goal.name,
          type: goal.type,
          description: goal.why || '',
          deadline: goal.targetDate,
          progress: goal.progress || 0,
          createdAt: goal.createdAt?.toISOString?.() || new Date().toISOString(),
          tasks: [],
          weeklyPriorities: [],
          goalColor: goal.type === 'financial' ? '#10b981' : goal.type === 'project' ? '#3b82f6' : '#f43f5e'
        }));
        setGoals(formattedGoals);
        localStorage.setItem('myGoals', JSON.stringify(formattedGoals));
        console.log('Goals reloaded successfully:', formattedGoals.length);
      } catch (error) {
        console.error('Error reloading goals:', error);
      }
    } else {
      // Utilisateur non connecté: recharger depuis localStorage
      console.log('Reloading goals from localStorage after creation...');
      const savedGoals = localStorage.getItem('myGoals');
      if (savedGoals) {
        const parsedGoals = JSON.parse(savedGoals);
        // Assigner les couleurs par défaut si manquantes
        const goalsWithColors = parsedGoals.map((goal: any) => ({
          ...goal,
          goalColor: goal.goalColor || (goal.type === 'financial' ? '#10b981' : goal.type === 'project' ? '#3b82f6' : '#f43f5e')
        }));
        setGoals(goalsWithColors);
        console.log('Goals reloaded from localStorage:', goalsWithColors.length);
      }
    }
    setShowCreateGoal(false);
  };

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'financial': return '💰';
      case 'project': return '📚';
      case 'personal': return '💖';
      default: return '🎯';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-stone-200 rounded w-1/3"></div>
          <div className="h-32 bg-stone-200 rounded"></div>
          <div className="h-32 bg-stone-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pb-20 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 min-h-screen">
        <div className="p-5 space-y-5 max-w-3xl mx-auto">
          {/* Header glassmorphism */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center shadow-xl shadow-pink-200/50">
                <Target className="w-7 h-7 text-white drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Mes Objectifs</h1>
                <p className="text-sm text-gray-600">Transforme tes rêves en réalité 🎯</p>
              </div>
            </div>
            <Button
              onClick={() => setShowEnergyHistory(!showEnergyHistory)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 rounded-xl border-pink-200 hover:bg-pink-50 bg-white/80 backdrop-blur-sm shadow-lg shadow-pink-100/50"
            >
              <Activity className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-medium">Énergie</span>
            </Button>
          </div>

          {/* Historique d'énergie (collapsible) - Glassmorphism */}
          {showEnergyHistory && energyLogs.length > 0 && (
            <Card className="border-none shadow-xl shadow-pink-100/50 bg-white/80 backdrop-blur-md rounded-[2rem]">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                    <Activity className="w-5 h-5 text-pink-500" />
                    Historique d'énergie
                  </h3>
                  <span className="text-xs font-semibold text-pink-500 bg-pink-50 px-3 py-1 rounded-full">
                    {energyLogs.length} check-in{energyLogs.length > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Graphique glassmorphism */}
                <div className="mb-6">
                  <div className="h-32 flex items-end gap-2 mb-3">
                    {energyLogs.slice(-7).map((log, index) => {
                      const height = (log.level * 10);
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                          <div
                            className="w-full bg-gradient-to-t from-pink-400 to-pink-300 rounded-t-2xl transition-all hover:opacity-80 cursor-pointer relative group shadow-lg shadow-pink-200/50"
                            style={{ height: `${height}%` }}
                            title={`${log.level * 10}%`}
                          >
                            <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                              {log.level * 10}%
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 font-medium">
                            {new Date(log.timestamp).toLocaleDateString('fr-FR', { weekday: 'short' })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Moyenne */}
                  {energyLogs.length > 0 && (
                    <div className="flex items-center justify-center gap-2 text-sm bg-gradient-to-r from-pink-50 to-rose-50 p-3 rounded-xl">
                      <TrendingUp className="w-5 h-5 text-pink-500" />
                      <span className="text-gray-700">
                        Moyenne : <span className="font-bold text-pink-600">
                          {Math.round((energyLogs.reduce((sum, log) => sum + log.level, 0) / energyLogs.length) * 10)}%
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Liste détaillée */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-800">Derniers check-ins</h4>
                  {energyLogs.slice(-5).reverse().map((log, index) => (
                    <div key={index} className="bg-gradient-to-br from-white to-pink-50 rounded-2xl p-4 space-y-2 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 font-medium">
                          {new Date(log.timestamp).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className="text-base font-bold text-pink-600">
                          {log.level * 10}%
                        </span>
                      </div>

                      {log.mentalState && log.physicalState && !log.skipped && (
                        <div className="flex gap-2 text-xs flex-wrap">
                          <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                            🧠 {log.mentalState === 'calm' ? 'Calme' :
                                log.mentalState === 'stressed' ? 'Stressée' :
                                log.mentalState === 'motivated' ? 'Motivée' : 'Fatiguée'}
                          </span>
                          <span className="px-3 py-1.5 bg-pink-100 text-pink-700 rounded-full font-medium">
                            💪 {log.physicalState === 'energetic' ? 'Énergique' :
                                log.physicalState === 'fit' ? 'En forme' :
                                log.physicalState === 'tired' ? 'Fatiguée' : 'Malade'}
                          </span>
                        </div>
                      )}

                      {log.skipped && (
                        <span className="text-xs text-gray-400 italic">Check-in passé</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liste des objectifs - Glassmorphism */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                Mes 3 Objectifs Actifs ({goals.length}/3)
              </h2>
              {goals.length < 3 && (
                <Button
                  onClick={() => setShowCreateGoal(true)}
                  size="sm"
                  className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl shadow-lg shadow-pink-200/50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Créer</span>
                </Button>
              )}
            </div>

            {goals.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-8 text-center shadow-xl shadow-pink-100/50">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full blur-xl opacity-40"></div>
                  <Target className="w-20 h-20 mx-auto text-pink-400 drop-shadow-2xl relative z-10" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Prête à conquérir tes objectifs ?
                </h3>
                <p className="text-sm text-gray-600 mb-5">
                  Crée ton premier objectif et laisse Glowee Work t'aider à l'atteindre ! 💫
                </p>
                <Button
                  onClick={() => setShowCreateGoal(true)}
                  className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white rounded-[1.5rem] shadow-xl shadow-pink-200/50 h-12 px-6"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Créer mon premier objectif
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="bg-white/80 backdrop-blur-md rounded-[2rem] p-5 shadow-xl shadow-pink-100/50 border-none hover:scale-[1.02] transition-transform"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl drop-shadow-lg">{getGoalIcon(goal.type)}</span>
                        <div>
                          <h3 className="font-bold text-gray-800 text-base">{goal.name}</h3>
                          <p className="text-xs text-gray-500 capitalize font-medium">{goal.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-pink-600">{goal.progress}%</div>
                        <div className="text-xs text-gray-500 font-medium">progression</div>
                      </div>
                    </div>

                    {/* Barre de progression glassmorphism */}
                    <div className="mb-4">
                      <div className="h-2 bg-pink-100 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-pink-400 to-rose-400 transition-all duration-500 shadow-lg"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions glassmorphism */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-xl border-pink-200 hover:bg-pink-50 text-sm font-medium bg-white/60 backdrop-blur-sm"
                        onClick={() => {
                          if (onShowGoalDetails) {
                            onShowGoalDetails(goal.id);
                          } else {
                            setSelectedGoalForDetails(goal);
                            setShowGoalDetailsDialog(true);
                          }
                        }}
                      >
                        <TrendingUp className="w-4 h-4 mr-1 text-pink-500" />
                        Avancer
                      </Button>
                        <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-xl border-pink-200 hover:bg-pink-50 text-sm font-medium bg-white/60 backdrop-blur-sm"
                        onClick={() => {
                          if (onNavigateToPlanning) {
                            onNavigateToPlanning(goal.id);
                          } else {
                            alert('Fonctionnalité à venir !');
                          }
                        }}
                      >
                        <Calendar className="w-4 h-4 mr-1 text-pink-500" />
                        Planning
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Energy Check-in Modal */}
          <EnergyCheckInModal
            isOpen={showCheckIn}
            onClose={() => setShowCheckIn(false)}
            energyLevel={energyLevel}
            setEnergyLevel={setEnergyLevel}
            onComplete={handleCheckInComplete}
          />

          {/* Create Goal Modal */}
          <CreateGoalModal
            isOpen={showCreateGoal}
            onClose={() => setShowCreateGoal(false)}
            onSuccess={handleGoalCreated}
            onAddGloweeTasks={onAddGloweeTasks}
          />

          {/* Glowee Welcome Popup - 1ère visite Objectifs */}
          <GloweePopup
            isOpen={showGloweeWelcome}
            onClose={() => {
              setShowGloweeWelcome(false);
              markWelcomeSeen('goals');
            }}
            gloweeImage={gloweeMessages.goals.firstVisit.image}
            userName={gloweeMessages.goals.firstVisit.userName}
            title={gloweeMessages.goals.firstVisit.title}
            message={gloweeMessages.goals.firstVisit.message}
            position="top"
          />

          {/* Glowee Check-in Welcome Popup - 1ère visite Check-in */}
          <GloweePopup
            isOpen={showGloweeCheckInWelcome}
            onClose={() => {
              setShowGloweeCheckInWelcome(false);
              markWelcomeSeen('energy');
            }}
            gloweeImage={gloweeMessages.energy.firstVisit.image}
            userName={gloweeMessages.energy.firstVisit.userName}
            title={gloweeMessages.energy.firstVisit.title}
            message={gloweeMessages.energy.firstVisit.message}
            position="top"
          />

          {/* Dialogue de détails de l'objectif */}
          <GoalDetailsDialog
            goal={selectedGoalForDetails}
            isOpen={showGoalDetailsDialog}
            onClose={() => {
              setShowGoalDetailsDialog(false);
              setSelectedGoalForDetails(null);
            }}
          />
        </div>
      </div>
    </>
  );
}

// Energy Check-in Modal Component
function EnergyCheckInModal({
  isOpen,
  onClose,
  energyLevel,
  setEnergyLevel,
  onComplete
}: {
  isOpen: boolean;
  onClose: () => void;
  energyLevel: number;
  setEnergyLevel: (level: number) => void;
  onComplete: () => void;
}) {
  const [mentalState, setMentalState] = useState<string>('');
  const [physicalState, setPhysicalState] = useState<string>('');
  const [step, setStep] = useState(1); // 1: énergie, 2: mental, 3: physique

  const mentalStates = [
    { value: 'calm', label: 'Calme', emoji: '😌' },
    { value: 'stressed', label: 'Stressée', emoji: '😰' },
    { value: 'motivated', label: 'Motivée', emoji: '🔥' },
    { value: 'tired', label: 'Fatiguée', emoji: '😴' },
  ];

  const physicalStates = [
    { value: 'energetic', label: 'Énergique', emoji: '⚡' },
    { value: 'fit', label: 'En forme', emoji: '💪' },
    { value: 'tired', label: 'Fatiguée', emoji: '😴' },
    { value: 'sick', label: 'Malade', emoji: '🤒' },
  ];

  const handleSkip = () => {
    const newLog: EnergyLog = {
      level: 50,
      timestamp: new Date().toISOString(),
      mentalState: 'calm',
      physicalState: 'fit',
      skipped: true
    };

    const savedLogs = localStorage.getItem('energyLogs');
    const logs: EnergyLog[] = savedLogs ? JSON.parse(savedLogs) : [];
    const updatedLogs = [...logs, newLog];
    localStorage.setItem('energyLogs', JSON.stringify(updatedLogs));

    setStep(1);
    setMentalState('');
    setPhysicalState('');
    onComplete();
  };

  const handleComplete = () => {
    const newLog: EnergyLog = {
      level: energyLevel,
      timestamp: new Date().toISOString(),
      mentalState,
      physicalState,
      skipped: false
    };

    const savedLogs = localStorage.getItem('energyLogs');
    const logs: EnergyLog[] = savedLogs ? JSON.parse(savedLogs) : [];
    const updatedLogs = [...logs, newLog];
    localStorage.setItem('energyLogs', JSON.stringify(updatedLogs));

    setStep(1);
    setMentalState('');
    setPhysicalState('');
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border border-pink-100/50 shadow-2xl shadow-pink-200/50 rounded-[2rem]">
        <DialogHeader className="pb-4 border-b border-pink-100">
          <DialogTitle className="flex items-center gap-3 text-xl text-gray-800 font-bold">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center shadow-lg drop-shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            Check-in Énergie
          </DialogTitle>
          <DialogDescription className="text-gray-600 font-medium">
            {step === 1 && "Comment te sens-tu en ce moment ? 💫"}
            {step === 2 && "Comment est ton état mental ? 🧠"}
            {step === 3 && "Comment est ton état physique ? 💪"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Glowee Image avec effet 3D */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full blur-xl opacity-40 scale-110"></div>
              <img
                src="/Glowee/Glowee-travaille.webp"
                alt="Glowee"
                className="w-24 h-24 object-contain relative z-10 drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Step 1: Energy Level - Glassmorphism */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-3 p-5 rounded-2xl bg-gradient-to-br from-white to-pink-50 shadow-lg border border-pink-100/50">
                <label className="text-sm font-bold text-gray-800">
                  Niveau d'énergie (0-100)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={energyLevel * 10}
                  onChange={(e) => setEnergyLevel(Math.round(parseInt(e.target.value) / 10))}
                  className="w-full h-3 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full appearance-none cursor-pointer accent-pink-500 shadow-md"
                />
                <div className="flex justify-between text-xs text-gray-600 font-semibold">
                  <span>0</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent drop-shadow-lg">{energyLevel * 10}</span>
                  <span>100</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="flex-1 rounded-xl border-pink-200 hover:bg-pink-50 font-semibold"
                >
                  Passer
                </Button>
                <Button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gradient-to-r from-pink-400 via-rose-400 to-orange-300 hover:from-pink-500 hover:via-rose-500 hover:to-orange-400 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all font-bold"
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Mental State - Glassmorphism */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                {mentalStates.map((state) => (
                  <button
                    key={state.value}
                    onClick={() => setMentalState(state.value)}
                    className={`p-4 rounded-2xl border-2 transition-all shadow-md hover:shadow-lg hover:scale-[1.02] ${
                      mentalState === state.value
                        ? 'border-pink-400 bg-gradient-to-br from-pink-100 to-rose-100'
                        : 'border-pink-200 bg-gradient-to-br from-white to-pink-50 hover:border-pink-300'
                    }`}
                  >
                    <div className="text-3xl mb-2 drop-shadow-lg">{state.emoji}</div>
                    <div className="text-xs font-bold text-gray-800">{state.label}</div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="flex-1 rounded-xl border-pink-200 hover:bg-pink-50 font-semibold"
                >
                  Passer
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!mentalState}
                  className="flex-1 bg-gradient-to-r from-pink-400 via-rose-400 to-orange-300 hover:from-pink-500 hover:via-rose-500 hover:to-orange-400 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all font-bold disabled:opacity-50 disabled:hover:scale-100"
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Physical State - Glassmorphism */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                {physicalStates.map((state) => (
                  <button
                    key={state.value}
                    onClick={() => setPhysicalState(state.value)}
                    className={`p-4 rounded-2xl border-2 transition-all shadow-md hover:shadow-lg hover:scale-[1.02] ${
                      physicalState === state.value
                        ? 'border-pink-400 bg-gradient-to-br from-pink-100 to-rose-100'
                        : 'border-pink-200 bg-gradient-to-br from-white to-pink-50 hover:border-pink-300'
                    }`}
                  >
                    <div className="text-3xl mb-2 drop-shadow-lg">{state.emoji}</div>
                    <div className="text-xs font-bold text-gray-800">{state.label}</div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="flex-1 rounded-xl border-pink-200 hover:bg-pink-50 font-semibold"
                >
                  Passer
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={!physicalState}
                  className="flex-1 bg-gradient-to-r from-pink-400 via-rose-400 to-orange-300 hover:from-pink-500 hover:via-rose-500 hover:to-orange-400 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all font-bold disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Sparkles className="w-5 h-5 mr-2 drop-shadow-lg" />
                  Valider
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Create Goal Modal Component
function CreateGoalModal({
  isOpen,
  onClose,
  onSuccess,
  onAddGloweeTasks
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (goal: Goal) => void;
  onAddGloweeTasks?: (tasks: Task[]) => void;
}) {
  const [step, setStep] = useState(1);
  const [goalType, setGoalType] = useState<'financial' | 'personal'>('personal');
  const [goalName, setGoalName] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');

  // Questions spécifiques par type
  const [targetAmount, setTargetAmount] = useState(''); // Pour financier
  const [competency, setCompetency] = useState(''); // Pour financier/projet
  const [why, setWhy] = useState(''); // Pourquoi cet objectif
  const [desiredFeeling, setDesiredFeeling] = useState(''); // Ressenti recherché

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedTasks, setAnalyzedTasks] = useState<Task[]>([]);
  const [analyzedPriorities, setAnalyzedPriorities] = useState<Array<{
    id: string;
    text: string;
    completed: boolean;
  }>>([]);
  const [gloweeAnalysis, setGloweeAnalysis] = useState<{
    opinion: string;
    feasibility: string;
    feasibilityScore: number;
    reasoning: string;
    keySuccessFactors: string[];
    potentialChallenges: string[];
    recommendations: string[];
  } | null>(null);

  // États pour le dialogue de confirmation
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingGoalData, setPendingGoalData] = useState<Goal | null>(null);

  const resetForm = () => {
    setStep(1);
    setGoalType('personal');
    setGoalName('');
    setGoalDescription('');
    setGoalDeadline('');
    setTargetAmount('');
    setCompetency('');
    setWhy('');
    setDesiredFeeling('');
    setIsAnalyzing(false);
    setAnalyzedTasks([]);
    setAnalyzedPriorities([]);
    setGloweeAnalysis(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setStep(5); // Nouvelle étape pour l'analyse

    try {
      const response = await fetch('/api/goals/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal: {
            name: goalName,
            type: goalType,
            description: goalDescription,
            deadline: goalDeadline,
            targetAmount: targetAmount ? parseFloat(targetAmount) : undefined,
            competency: competency || undefined,
            why: why || undefined,
            desiredFeeling: desiredFeeling || undefined,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze goal');
      }

      const data = await response.json();
      setAnalyzedTasks(data.tasks || []);

      // Générer les 3 priorités de la semaine à partir des tâches
      if (data.tasks && data.tasks.length > 0) {
        // Prendre les 3 premières tâches de haute priorité de cette semaine
        const thisWeekTasks = data.tasks.filter((task: Task) => {
          const taskDate = new Date(task.date || getNextDateForDay(task.day));
          const today = new Date();
          const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          return taskDate >= today && taskDate <= weekFromNow;
        });

        const highPriorityTasks = thisWeekTasks
          .filter((task: Task) => task.priority === 'high')
          .slice(0, 3);

        const priorities = highPriorityTasks.map((task: Task, index: number) => ({
          id: `priority_${Date.now()}_${index}`,
          text: task.task,
          completed: false
        }));

        setAnalyzedPriorities(priorities);
      }

      // Stocker l'analyse de Glowee Work si disponible
      if (data.analysis) {
        setGloweeAnalysis(data.analysis);
      }
    } catch (error) {
      console.error('Error analyzing goal:', error);
      alert('Erreur lors de l\'analyse. Réessaye plus tard.');
      setStep(3);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    const goalId = Date.now().toString();
    const goalColor = getGoalColor(goalId);

    // Préparer les données de l'objectif
    const goalData = {
      id: goalId,
      name: goalName,
      type: goalType,
      description: goalDescription,
      deadline: goalDeadline,
      progress: 0,
      createdAt: new Date().toISOString(),
      tasks: analyzedTasks,
      weeklyPriorities: analyzedPriorities,
      goalColor: goalColor,
    };

    // Stocker les données et afficher le dialogue de confirmation
    setPendingGoalData(goalData);
    setShowConfirmation(true);
  };

  // Palette de couleurs pour les objectifs
  const getGoalColor = (goalId: string): string => {
    const colors = [
      '#8B5CF6', // violet
      '#EC4899', // rose
      '#F59E0B', // orange
      '#10B981', // vert
      '#3B82F6', // bleu
      '#EF4444', // rouge
    ];

    // Utiliser l'ID pour générer un index cohérent
    const hash = goalId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const confirmGoalCreation = () => {
    if (!pendingGoalData) return;

    // Ajouter les tâches dans Glowee tâches du Planning avec dates spécifiques
    if (onAddGloweeTasks && analyzedTasks.length > 0) {
      const goalColor = pendingGoalData.goalColor || getGoalColor(pendingGoalData.id);

      // Ajouter les dates et les infos de l'objectif aux tâches
      const tasksWithDates = analyzedTasks.map(task => ({
        ...task,
        date: task.date || getNextDateForDay(task.day),
        goalId: pendingGoalData.id,
        goalName: pendingGoalData.name,
        goalColor: goalColor
      }));

      // Préparer les données de l'objectif avec ses priorités
      const goalDataForPlanning = {
        id: pendingGoalData.id,
        name: pendingGoalData.name,
        color: goalColor,
        weeklyPriorities: pendingGoalData.weeklyPriorities || []
      };

      onAddGloweeTasks(tasksWithDates, goalDataForPlanning);
    }

    onSuccess(pendingGoalData);
    resetForm();
    setPendingGoalData(null);
  };

  // Fonction pour obtenir la prochaine date pour un jour donné
  const getNextDateForDay = (dayName: string): string => {
    const daysMap: Record<string, number> = {
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4,
      'friday': 5,
      'saturday': 6,
      'sunday': 0
    };

    const today = new Date();
    const targetDay = daysMap[dayName.toLowerCase()];
    const currentDay = today.getDay();

    let daysUntilTarget = targetDay - currentDay;
    if (daysUntilTarget <= 0) {
      daysUntilTarget += 7; // Passer à la semaine prochaine
    }

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilTarget);

    return targetDate.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-pink-100/50 shadow-2xl shadow-pink-200/50 rounded-[2rem]">
        <DialogHeader className="pb-4 border-b border-pink-100">
          <DialogTitle className="flex items-center gap-3 text-xl text-gray-800 font-bold">
            <Target className="w-6 h-6 text-pink-500 drop-shadow-lg" />
            Créer un Objectif
          </DialogTitle>
          <DialogDescription className="text-gray-600 font-medium">
            {step <= 4 ? `Étape ${step}/4` : 'Analyse Glowee Work'} - Glowee Work va t'aider à l'atteindre ! 🎯
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 1 && (
            <div className="space-y-5">
              <h3 className="font-bold text-gray-800 text-base">Quel type d'objectif ?</h3>
              <div className="grid gap-3">
                <button
                  onClick={() => setGoalType('financial')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all shadow-md hover:shadow-lg hover:scale-[1.02] ${
                    goalType === 'financial'
                      ? 'border-pink-400 bg-gradient-to-br from-pink-100 to-rose-100'
                      : 'border-pink-200 bg-gradient-to-br from-white to-pink-50 hover:border-pink-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl drop-shadow-lg">💰</span>
                    <div>
                      <div className="font-bold text-gray-800">Financier</div>
                      <div className="text-sm text-gray-600 font-medium">Économiser, gagner de l'argent</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setGoalType('personal')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all shadow-md hover:shadow-lg hover:scale-[1.02] ${
                    goalType === 'personal'
                      ? 'border-pink-400 bg-gradient-to-br from-pink-100 to-rose-100'
                      : 'border-pink-200 bg-gradient-to-br from-white to-pink-50 hover:border-pink-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl drop-shadow-lg">💖</span>
                    <div>
                      <div className="font-bold text-gray-800">Personnel</div>
                      <div className="text-sm text-gray-600 font-medium">Développement, bien-être</div>
                    </div>
                  </div>
                </button>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-pink-400 via-rose-400 to-orange-300 hover:from-pink-500 hover:via-rose-500 hover:to-orange-400 text-white rounded-2xl py-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all font-bold"
              >
                Suivant
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-2">
                  Nom de l'objectif
                </label>
                <Input
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder={
                    goalType === 'financial' ? "Ex: Atteindre 10 000€ de CA" :
                    "Ex: Retrouver confiance en moi"
                  }
                  className="w-full"
                />
              </div>

              {/* Questions spécifiques pour Financier */}
              {goalType === 'financial' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-stone-900 mb-2">
                      Chiffre d'affaires attendu (€)
                    </label>
                    <Input
                      type="number"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      placeholder="Ex: 10000"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-900 mb-2">
                      Description du projet
                    </label>
                    <Textarea
                      value={goalDescription}
                      onChange={(e) => setGoalDescription(e.target.value)}
                      placeholder="Décris ton projet en détail..."
                      rows={3}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-900 mb-2">
                      Ton niveau de compétence dans ce domaine
                    </label>
                    <select
                      value={competency}
                      onChange={(e) => setCompetency(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                    >
                      <option value="">Sélectionne...</option>
                      <option value="beginner">Débutante 🌱</option>
                      <option value="intermediate">Intermédiaire 🌿</option>
                      <option value="advanced">Avancée 🌳</option>
                    </select>
                  </div>
                </>
              )}

              {/* Questions spécifiques pour Personnel */}
              {goalType === 'personal' && (
                <div>
                  <label className="block text-sm font-medium text-stone-900 mb-2">
                    Description de ton objectif
                  </label>
                  <Textarea
                    value={goalDescription}
                    onChange={(e) => setGoalDescription(e.target.value)}
                    placeholder="Décris ce que tu veux accomplir..."
                    rows={3}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1"
                >
                  Retour
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={
                    !goalName ||
                    (goalType === 'financial' && (!targetAmount || !goalDescription || !competency)) ||
                    (goalType === 'personal' && !goalDescription)
                  }
                  className="flex-1 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-2">
                  Pourquoi cet objectif est important pour toi ? 💭
                </label>
                <Textarea
                  value={why}
                  onChange={(e) => setWhy(e.target.value)}
                  placeholder="Ex: Je veux être indépendante financièrement et pouvoir voyager..."
                  rows={3}
                  className="w-full"
                />
                <p className="text-xs text-stone-500 mt-1">
                  Prends le temps de réfléchir à ta vraie motivation 💫
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-900 mb-2">
                  Quel ressenti recherches-tu en atteignant cet objectif ? ✨
                </label>
                <Textarea
                  value={desiredFeeling}
                  onChange={(e) => setDesiredFeeling(e.target.value)}
                  placeholder="Ex: Je me sentirai fière, libre, confiante..."
                  rows={3}
                  className="w-full"
                />
                <p className="text-xs text-stone-500 mt-1">
                  Visualise comment tu te sentiras quand tu l'auras atteint 🌟
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1"
                >
                  Retour
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  disabled={!why || !desiredFeeling}
                  className="flex-1 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-2">
                  En combien de temps veux-tu atteindre cet objectif ?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const deadline = new Date();
                      deadline.setMonth(deadline.getMonth() + 1);
                      setGoalDeadline(deadline.toISOString().split('T')[0]);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      goalDeadline && new Date(goalDeadline) <= new Date(Date.now() + 31 * 24 * 60 * 60 * 1000)
                        ? 'border-rose-400 bg-rose-50'
                        : 'border-stone-200 hover:border-rose-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">⚡</div>
                    <div className="font-semibold text-stone-900">1 mois</div>
                    <div className="text-xs text-stone-500 mt-1">Objectif sprint</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const deadline = new Date();
                      deadline.setMonth(deadline.getMonth() + 3);
                      setGoalDeadline(deadline.toISOString().split('T')[0]);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      goalDeadline && new Date(goalDeadline) > new Date(Date.now() + 31 * 24 * 60 * 60 * 1000) && new Date(goalDeadline) <= new Date(Date.now() + 93 * 24 * 60 * 60 * 1000)
                        ? 'border-rose-400 bg-rose-50'
                        : 'border-stone-200 hover:border-rose-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">🎯</div>
                    <div className="font-semibold text-stone-900">3 mois</div>
                    <div className="text-xs text-stone-500 mt-1">Court terme</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const deadline = new Date();
                      deadline.setMonth(deadline.getMonth() + 6);
                      setGoalDeadline(deadline.toISOString().split('T')[0]);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      goalDeadline && new Date(goalDeadline) > new Date(Date.now() + 93 * 24 * 60 * 60 * 1000) && new Date(goalDeadline) <= new Date(Date.now() + 186 * 24 * 60 * 60 * 1000)
                        ? 'border-rose-400 bg-rose-50'
                        : 'border-stone-200 hover:border-rose-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">🌟</div>
                    <div className="font-semibold text-stone-900">6 mois</div>
                    <div className="text-xs text-stone-500 mt-1">Moyen terme</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const deadline = new Date();
                      deadline.setFullYear(deadline.getFullYear() + 1);
                      setGoalDeadline(deadline.toISOString().split('T')[0]);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      goalDeadline && new Date(goalDeadline) > new Date(Date.now() + 186 * 24 * 60 * 60 * 1000)
                        ? 'border-rose-400 bg-rose-50'
                        : 'border-stone-200 hover:border-rose-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">🚀</div>
                    <div className="font-semibold text-stone-900">1 an</div>
                    <div className="text-xs text-stone-500 mt-1">Long terme</div>
                  </button>
                </div>
                {goalDeadline && (
                  <p className="text-xs text-stone-500 mt-2 text-center">
                    📅 Date limite : {new Date(goalDeadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-rose-400 mt-1" />
                  <div className="text-sm text-stone-700">
                    <p className="font-semibold mb-1">Glowee Work va analyser ton objectif</p>
                    <p>Elle va le découper en étapes et créer un plan d'action personnalisé pour toi ! 🎯</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setStep(3)}
                  variant="outline"
                  className="flex-1"
                >
                  Retour
                </Button>
                <Button
                  onClick={handleAnalyze}
                  disabled={!goalDeadline}
                  className="flex-1 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyser avec Glowee
                </Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              {isAnalyzing ? (
                <div className="text-center py-8">
                  <div className="flex justify-center mb-4">
                    <img
                      src="/Glowee/Glowee-travaille.webp"
                      alt="Glowee"
                      className="w-24 h-24 object-contain animate-pulse"
                    />
                  </div>
                  <h3 className="font-semibold text-stone-900 mb-2">
                    Glowee Work analyse ton objectif...
                  </h3>
                  <p className="text-sm text-stone-600">
                    Elle crée un plan d'action personnalisé pour toi ! ✨
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-rose-400 mt-1" />
                      <div className="text-sm text-stone-700">
                        <p className="font-semibold mb-1">Plan d'action créé ! 🎉</p>
                        <p>Glowee a généré {analyzedTasks.length} tâches cette semaine pour t'aider à atteindre ton objectif.</p>
                      </div>
                    </div>
                  </div>

                  {/* Explication de l'analyse */}
                  <GoalAnalysisExplanation
                    goalType={goalType}
                    goalName={goalName}
                    goalDescription={goalDescription}
                    deadline={goalDeadline}
                    targetAmount={targetAmount ? parseFloat(targetAmount) : undefined}
                    competency={competency}
                    why={why}
                    desiredFeeling={desiredFeeling}
                  />

                  {/* Analyse de Glowee Work */}
                  {gloweeAnalysis && (
                    <div className="space-y-3">
                      {/* Avis de Glowee */}
                      <div className="bg-white rounded-xl p-4 border-2 border-rose-200">
                        <h4 className="font-semibold text-sm text-rose-500 mb-2">💭 Mon avis sur ton objectif</h4>
                        <p className="text-sm text-stone-700">{gloweeAnalysis.opinion}</p>
                      </div>

                      {/* Faisabilité */}
                      <div className="bg-white rounded-xl p-4 border-2 border-orange-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm text-orange-500">🎯 Faisabilité</h4>
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                            {gloweeAnalysis.feasibilityScore}%
                          </span>
                        </div>
                        <p className="text-sm text-stone-700 mb-2">{gloweeAnalysis.feasibility}</p>
                        <p className="text-xs text-stone-600">{gloweeAnalysis.reasoning}</p>
                      </div>

                      {/* Facteurs clés de succès */}
                      {gloweeAnalysis.keySuccessFactors && gloweeAnalysis.keySuccessFactors.length > 0 && (
                        <div className="bg-white rounded-xl p-4 border-2 border-green-200">
                          <h4 className="font-semibold text-sm text-green-600 mb-2">✨ Facteurs clés de succès</h4>
                          <ul className="space-y-1">
                            {gloweeAnalysis.keySuccessFactors.map((factor, index) => (
                              <li key={index} className="text-xs text-stone-700 flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>{factor}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Défis potentiels */}
                      {gloweeAnalysis.potentialChallenges && gloweeAnalysis.potentialChallenges.length > 0 && (
                        <div className="bg-white rounded-xl p-4 border-2 border-amber-200">
                          <h4 className="font-semibold text-sm text-amber-600 mb-2">⚠️ Défis à anticiper</h4>
                          <ul className="space-y-1">
                            {gloweeAnalysis.potentialChallenges.map((challenge, index) => (
                              <li key={index} className="text-xs text-stone-700 flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">•</span>
                                <span>{challenge}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Recommandations */}
                      {gloweeAnalysis.recommendations && gloweeAnalysis.recommendations.length > 0 && (
                        <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
                          <h4 className="font-semibold text-sm text-purple-600 mb-2">💡 Mes recommandations</h4>
                          <ul className="space-y-1">
                            {gloweeAnalysis.recommendations.map((rec, index) => (
                              <li key={index} className="text-xs text-stone-700 flex items-start gap-2">
                                <span className="text-purple-500 mt-0.5">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    <h4 className="font-semibold text-sm text-stone-700 mb-2">📋 Tâches générées</h4>
                    {analyzedTasks.map((task, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-3 border border-stone-200"
                      >
                        <div className="flex items-start gap-2">
                          <div className={`w-2 h-2 rounded-full mt-1.5 ${
                            task.priority === 'high' ? 'bg-rose-400' :
                            task.priority === 'medium' ? 'bg-orange-300' :
                            'bg-stone-300'
                          }`} />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-stone-900">{task.task}</div>
                            <div className="text-xs text-stone-500 mt-1">
                              {task.day === 'monday' ? 'Lundi' :
                               task.day === 'tuesday' ? 'Mardi' :
                               task.day === 'wednesday' ? 'Mercredi' :
                               task.day === 'thursday' ? 'Jeudi' :
                               task.day === 'friday' ? 'Vendredi' :
                               task.day === 'saturday' ? 'Samedi' : 'Dimanche'} • {task.category}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setStep(3)}
                      variant="outline"
                      className="flex-1"
                    >
                      Retour
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="flex-1 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Créer l'objectif
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>

      {/* Dialogue de confirmation */}
      <GoalConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmGoalCreation}
        goalName={goalName}
        tasksCount={analyzedTasks.length}
      />
    </Dialog>
  );
}

