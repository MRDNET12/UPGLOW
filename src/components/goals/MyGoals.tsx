'use client';

import { useEffect, useState } from 'react';
import { Target, Plus, Activity, Calendar, TrendingUp, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Goal {
  id: string;
  name: string;
  type: 'financial' | 'project' | 'personal';
  description: string;
  deadline: string;
  progress: number;
  createdAt: string;
}

interface EnergyLog {
  level: number;
  timestamp: string;
}

export function MyGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [showEnergyHistory, setShowEnergyHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [energyLogs, setEnergyLogs] = useState<EnergyLog[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        // Load goals
        const savedGoals = localStorage.getItem('myGoals');
        if (savedGoals) {
          setGoals(JSON.parse(savedGoals));
        }

        // Load energy logs
        const savedLogs = localStorage.getItem('energyLogs');
        if (savedLogs) {
          setEnergyLogs(JSON.parse(savedLogs));
        }

        // Check if we need to show energy check-in
        checkEnergyCheckIn();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const checkEnergyCheckIn = () => {
    const savedLogs = localStorage.getItem('energyLogs');
    if (!savedLogs) {
      setShowCheckIn(true);
      return;
    }

    const logs: EnergyLog[] = JSON.parse(savedLogs);
    if (logs.length === 0) {
      setShowCheckIn(true);
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

  const handleGoalCreated = (newGoal: Goal) => {
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    localStorage.setItem('myGoals', JSON.stringify(updatedGoals));
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
    <div className="p-6 space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-rose-400" />
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Mes Objectifs</h1>
            <p className="text-sm text-stone-600">Transforme tes rêves en réalité 🎯</p>
          </div>
        </div>
        <Button
          onClick={() => setShowEnergyHistory(!showEnergyHistory)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Activity className="w-4 h-4" />
          Énergie
        </Button>
      </div>

      {/* Energy History (collapsible) */}
      {showEnergyHistory && energyLogs.length > 0 && (
        <Card className="bg-gradient-to-br from-rose-50 to-orange-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-stone-900 mb-3">Historique d'énergie</h3>
            <div className="space-y-2">
              {energyLogs.slice(-5).reverse().map((log, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-stone-600">
                    {new Date(log.timestamp).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-4 rounded ${
                            i < log.level ? 'bg-gradient-to-t from-rose-400 to-orange-300' : 'bg-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-rose-500">{log.level}/10</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900">
            Mes 3 Objectifs Actifs ({goals.length}/3)
          </h2>
          {goals.length < 3 && (
            <Button
              onClick={() => setShowCreateGoal(true)}
              size="sm"
              className="bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer
            </Button>
          )}
        </div>

        {goals.length === 0 ? (
          <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-8 text-center">
            <Target className="w-16 h-16 mx-auto mb-4 text-rose-300" />
            <h3 className="text-lg font-semibold text-stone-900 mb-2">
              Prête à conquérir tes objectifs ?
            </h3>
            <p className="text-sm text-stone-600 mb-4">
              Crée ton premier objectif et laisse Glowee Work t'aider à l'atteindre ! 💫
            </p>
            <Button
              onClick={() => setShowCreateGoal(true)}
              className="bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer mon premier objectif
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getGoalIcon(goal.type)}</span>
                    <div>
                      <h3 className="font-semibold text-stone-900">{goal.name}</h3>
                      <p className="text-xs text-stone-500 capitalize">{goal.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-rose-500">{goal.progress}%</div>
                    <div className="text-xs text-stone-500">progression</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-400 to-orange-300 transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => alert('Fonctionnalité à venir !')}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Voir détails
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => alert('Fonctionnalité à venir !')}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
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
      />
    </div>
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
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-400" />
            Check-in Énergie
          </DialogTitle>
          <DialogDescription>
            Comment te sens-tu en ce moment ? 💫
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Glowee Image */}
          <div className="flex justify-center">
            <img
              src="/glowee/glowee-happy.webp"
              alt="Glowee"
              className="w-32 h-32 object-contain"
            />
          </div>

          {/* Energy Level Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-stone-600">
              <span>Épuisée 😴</span>
              <span>Énergique 🔥</span>
            </div>

            <div className="flex gap-1 justify-center">
              {[...Array(10)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setEnergyLevel(i + 1)}
                  className={`w-8 h-12 rounded transition-all ${
                    i < energyLevel
                      ? 'bg-gradient-to-t from-rose-400 to-orange-300 scale-105'
                      : 'bg-stone-200 hover:bg-stone-300'
                  }`}
                />
              ))}
            </div>

            <div className="text-center">
              <span className="text-3xl font-bold text-rose-500">{energyLevel}/10</span>
            </div>
          </div>

          <Button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Valider
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Create Goal Modal Component
function CreateGoalModal({
  isOpen,
  onClose,
  onSuccess
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (goal: Goal) => void;
}) {
  const [step, setStep] = useState(1);
  const [goalType, setGoalType] = useState<'financial' | 'project' | 'personal'>('personal');
  const [goalName, setGoalName] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');

  const resetForm = () => {
    setStep(1);
    setGoalType('personal');
    setGoalName('');
    setGoalDescription('');
    setGoalDeadline('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      name: goalName,
      type: goalType,
      description: goalDescription,
      deadline: goalDeadline,
      progress: 0,
      createdAt: new Date().toISOString()
    };

    onSuccess(newGoal);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-400" />
            Créer un Objectif
          </DialogTitle>
          <DialogDescription>
            Étape {step}/3 - Glowee Work va t'aider à l'atteindre ! 🎯
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-stone-900">Quel type d'objectif ?</h3>
              <div className="grid gap-3">
                <button
                  onClick={() => setGoalType('financial')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    goalType === 'financial'
                      ? 'border-rose-400 bg-rose-50'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">💰</span>
                    <div>
                      <div className="font-semibold">Financier</div>
                      <div className="text-sm text-stone-600">Économiser, gagner de l'argent</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setGoalType('project')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    goalType === 'project'
                      ? 'border-rose-400 bg-rose-50'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">📚</span>
                    <div>
                      <div className="font-semibold">Projet</div>
                      <div className="text-sm text-stone-600">Créer, construire, réaliser</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setGoalType('personal')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    goalType === 'personal'
                      ? 'border-rose-400 bg-rose-50'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">💖</span>
                    <div>
                      <div className="font-semibold">Personnel</div>
                      <div className="text-sm text-stone-600">Développement, bien-être</div>
                    </div>
                  </div>
                </button>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
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
                  placeholder="Ex: Économiser 5000€"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-900 mb-2">
                  Description détaillée
                </label>
                <Textarea
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                  placeholder="Décris ton objectif en détail..."
                  rows={4}
                  className="w-full"
                />
              </div>

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
                  disabled={!goalName || !goalDescription}
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
                  Date limite
                </label>
                <Input
                  type="date"
                  value={goalDeadline}
                  onChange={(e) => setGoalDeadline(e.target.value)}
                  className="w-full"
                />
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
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1"
                >
                  Retour
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!goalDeadline}
                  className="flex-1 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Créer l'objectif
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

