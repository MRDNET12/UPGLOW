'use client';

import { useEffect, useState } from 'react';
import { Target, Plus, Activity, Calendar, Clock, Pause, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import GloweePopup from '@/components/shared/GloweePopup';
import { DeleteGoalDialog } from '@/components/goals/DeleteGoalDialog';
import { CreateGoalWizard } from '@/components/goals/CreateGoalWizard';
import { markWelcomeSeen } from '@/utils/visitTracker';
import { gloweeMessages } from '@/data/gloweeMessages';
import { useGoalsSync } from '@/hooks/useFirebaseSync';
import { useAuth } from '@/contexts/AuthContext';
import { deleteGoalWithTasks } from '@/lib/firebase/goals-service';

interface Goal {
  id: string;
  name: string;
  type: 'financial' | 'personal' | 'project';
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
  onShowGoalDetails?: (goalId: string, goal: Goal) => void;
  onGoalsChange?: (goals: Goal[]) => void;
  language?: 'fr' | 'en' | 'es';
}

export function MyGoals({ onAddGloweeTasks, onShowGoalDetails, onGoalsChange, language = 'fr' }: MyGoalsProps = {}) {
  const { user } = useAuth();
  const { loadGoals } = useGoalsSync();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [energyLogs, setEnergyLogs] = useState<EnergyLog[]>([]);

  // États pour les popups Glowee
  const [showGloweeWelcome, setShowGloweeWelcome] = useState(false);
  const [showGloweeCheckInWelcome, setShowGloweeCheckInWelcome] = useState(false);

  // États pour la suppression d'objectif
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
            // Notifier le parent du changement
            if (onGoalsChange) {
              onGoalsChange(formattedGoals);
            }
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

  // Fonction pour ouvrir le dialogue de suppression
  const handleDeleteClick = (e: React.MouseEvent, goal: Goal) => {
    e.stopPropagation(); // Empêcher l'ouverture de l'espace de travail
    setGoalToDelete(goal);
    setShowDeleteDialog(true);
  };

  // Fonction pour confirmer la suppression
  const handleDeleteConfirm = async (reason: 'achieved' | 'difficult' | 'hard_to_follow' | 'incoherent' | 'other_goal') => {
    if (!goalToDelete) return;

    setIsDeleting(true);
    try {
      // Supprimer dans Firebase si l'utilisateur est connecté
      if (user) {
        await deleteGoalWithTasks(goalToDelete.id, { reason });
      }

      // Supprimer du localStorage
      const updatedGoals = goals.filter(g => g.id !== goalToDelete.id);
      setGoals(updatedGoals);
      localStorage.setItem('myGoals', JSON.stringify(updatedGoals));

      // Supprimer les tâches liées dans gloweeWeeklyTasks
      const storedTasks = localStorage.getItem('gloweeWeeklyTasks');
      if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        const filteredTasks = tasks.filter((task: any) => task.goalId !== goalToDelete.id);
        localStorage.setItem('gloweeWeeklyTasks', JSON.stringify(filteredTasks));
      }

      // Notifier le parent
      if (onGoalsChange) {
        onGoalsChange(updatedGoals);
      }

      console.log(`Goal ${goalToDelete.id} deleted with reason: ${reason}`);
    } catch (error) {
      console.error('Error deleting goal:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setGoalToDelete(null);
    }
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
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center shadow-xl shadow-pink-200/50">
              <Target className="w-7 h-7 text-white drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Mes Objectifs</h1>
              <p className="text-sm text-gray-600">Clique sur un objectif pour ouvrir ton espace de travail 🎯</p>
            </div>
          </div>

          {/* Liste des objectifs */}
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
                {goals.map((goal) => {
                  // Calcul du statut: objectif en pause si pas d'actions planifiées
                  const hasPlannedActions = goal.tasks && goal.tasks.length > 0;
                  const isPaused = !hasPlannedActions && goal.progress < 100;

                  // Calcul de la durée restante
                  const now = new Date();
                  const deadline = new Date(goal.deadline);
                  const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                  return (
                    <div
                      key={goal.id}
                      onClick={() => {
                        if (onShowGoalDetails) {
                          onShowGoalDetails(goal.id, goal);
                        }
                      }}
                      className={`bg-white/80 backdrop-blur-md rounded-[2rem] p-5 shadow-xl shadow-pink-100/50 border-none hover:scale-[1.02] transition-all cursor-pointer group ${
                        isPaused ? 'opacity-70' : ''
                      }`}
                    >
                      {/* Badge de statut */}
                      {isPaused && (
                        <div className="mb-3 flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full w-fit">
                          <Pause className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-600 font-medium">En pause</span>
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl drop-shadow-lg">{getGoalIcon(goal.type)}</span>
                          <div>
                            <h3 className="font-bold text-gray-800 text-base group-hover:text-pink-600 transition-colors">{goal.name}</h3>
                            <p className="text-xs text-gray-500 capitalize font-medium">{goal.type === 'financial' ? 'Financier' : goal.type === 'project' ? 'Projet' : 'Personnel'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-pink-600">{goal.progress}%</div>
                            <div className="text-xs text-gray-500 font-medium">progression</div>
                          </div>
                          <button
                            onClick={(e) => handleDeleteClick(e, goal)}
                            className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                            title="Supprimer l'objectif"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
                          </button>
                        </div>
                      </div>

                      {/* Barre de progression */}
                      <div className="mb-4">
                        <div className="h-2 bg-pink-100 rounded-full overflow-hidden shadow-inner">
                          <div
                            className={`h-full transition-all duration-500 shadow-lg ${
                              isPaused
                                ? 'bg-gradient-to-r from-gray-300 to-gray-400'
                                : 'bg-gradient-to-r from-pink-400 to-rose-400'
                            }`}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Infos: durée et date */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{daysRemaining > 0 ? `${daysRemaining} jours restants` : 'Échéance dépassée'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(goal.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                        </div>
                      </div>

                      {/* Message pour objectif en pause */}
                      {isPaused && (
                        <div className="mt-3 p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                          <p className="text-xs text-amber-700 font-medium text-center">
                            💡 Pour avancer, planifie au moins une action
                          </p>
                        </div>
                      )}

                      {/* Flèche indicateur de clic */}
                      <div className="mt-3 flex items-center justify-end">
                        <span className="text-xs text-pink-400 font-medium group-hover:text-pink-600 transition-colors">
                          Ouvrir l'espace de travail →
                        </span>
                      </div>
                    </div>
                  );
                })}
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

          {/* Create Goal Wizard */}
          <CreateGoalWizard
            isOpen={showCreateGoal}
            onClose={() => setShowCreateGoal(false)}
            onSuccess={() => {
              // Recharger les objectifs depuis localStorage
              const savedGoals = localStorage.getItem('myGoals');
              if (savedGoals) {
                setGoals(JSON.parse(savedGoals));
              }
              setShowCreateGoal(false);
            }}
            language={language}
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

          {/* Delete Goal Dialog */}
          {goalToDelete && (
            <DeleteGoalDialog
              isOpen={showDeleteDialog}
              onClose={() => {
                setShowDeleteDialog(false);
                setGoalToDelete(null);
              }}
              onConfirm={handleDeleteConfirm}
              goalName={goalToDelete.name}
              language="fr"
            />
          )}

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
