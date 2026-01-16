'use client';

import { useEffect, useState } from 'react';
import { Target, Plus, Activity, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getActiveGoals, getLastEnergyLog } from '@/lib/firebase/goals-service';
import { useAuth } from '@/contexts/AuthContext';
import { EnergyCheckIn } from './EnergyCheckIn';
import { CreateGoal } from './CreateGoal';
import { EnergyHistory } from './EnergyHistory';
import type { Goal } from '@/types/goals';

export function MyGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [showEnergyHistory, setShowEnergyHistory] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const checkEnergyCheckIn = async () => {
      const lastLog = await getLastEnergyLog(user.uid);
      const now = new Date();
      
      if (!lastLog) {
        setShowCheckIn(true);
      } else {
        const hoursSinceLastLog = (now.getTime() - lastLog.timestamp.getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastLog >= 5) {
          setShowCheckIn(true);
        }
      }
    };

    const fetchGoals = async () => {
      try {
        const activeGoals = await getActiveGoals(user.uid);
        setGoals(activeGoals);
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        setLoading(false);
      }
    };

    checkEnergyCheckIn();
    fetchGoals();
  }, [user]);

  const handleCheckInComplete = () => {
    setShowCheckIn(false);
  };

  const handleGoalCreated = async () => {
    if (!user) return;
    const activeGoals = await getActiveGoals(user.uid);
    setGoals(activeGoals);
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
    <div className="p-6 space-y-6">
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
      {showEnergyHistory && (
        <div className="animate-in slide-in-from-top duration-200">
          <EnergyHistory />
        </div>
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
                className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow cursor-pointer"
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
                  <Button variant="outline" size="sm" className="flex-1">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Voir détails
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Planning
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <EnergyCheckIn
        isOpen={showCheckIn}
        onClose={() => setShowCheckIn(false)}
        onComplete={handleCheckInComplete}
      />

      <CreateGoal
        isOpen={showCreateGoal}
        onClose={() => setShowCreateGoal(false)}
        onSuccess={handleGoalCreated}
      />
    </div>
  );
}

