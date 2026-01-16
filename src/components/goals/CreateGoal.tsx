'use client';

import { useState } from 'react';
import { X, ArrowLeft, ArrowRight, Target, DollarSign, Briefcase, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createGoal } from '@/lib/firebase/goals-service';
import { useAuth } from '@/contexts/AuthContext';
import type { GoalType } from '@/types/goals';

interface CreateGoalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const GOAL_TYPES: { value: GoalType; label: string; icon: any; color: string }[] = [
  { value: 'financial', label: 'Financier', icon: DollarSign, color: 'text-green-500' },
  { value: 'project', label: 'Projet', icon: Briefcase, color: 'text-blue-500' },
  { value: 'personal', label: 'Personnel', icon: Heart, color: 'text-rose-500' }
];

export function CreateGoal({ isOpen, onClose, onSuccess }: CreateGoalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [type, setType] = useState<GoalType | null>(null);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [competencies, setCompetencies] = useState('');
  const [currentLevel, setCurrentLevel] = useState('');
  const [why, setWhy] = useState('');
  const [desiredFeeling, setDesiredFeeling] = useState('');

  const handleSubmit = async () => {
    if (!user || !type) return;

    setIsSubmitting(true);
    try {
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + parseInt(timeframe || '12'));

      await createGoal(user.uid, {
        type,
        name,
        targetAmount: type === 'financial' ? parseFloat(targetAmount) : undefined,
        targetDate: targetDate.toISOString().split('T')[0],
        timeframe: parseInt(timeframe || '12'),
        competencies: type === 'project' ? competencies.split(',').map(c => c.trim()) : undefined,
        why,
        desiredFeeling,
        status: 'active',
        progress: 0
      });

      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setType(null);
    setName('');
    setTargetAmount('');
    setTimeframe('');
    setCompetencies('');
    setCurrentLevel('');
    setWhy('');
    setDesiredFeeling('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-400" />
            <h2 className="text-xl font-semibold text-stone-900">Créer un Objectif</h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all ${
                  s <= step ? 'bg-gradient-to-r from-rose-400 to-orange-300' : 'bg-stone-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-stone-500 mt-2">Étape {step} sur 5</p>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px]">
          {/* Step 1: Type */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-stone-900">Quel type d'objectif ?</h3>
              <div className="grid gap-3">
                {GOAL_TYPES.map((goalType) => {
                  const Icon = goalType.icon;
                  return (
                    <button
                      key={goalType.value}
                      onClick={() => setType(goalType.value)}
                      className={`
                        p-4 rounded-xl border-2 transition-all text-left
                        ${type === goalType.value
                          ? 'border-rose-400 bg-rose-50'
                          : 'border-stone-200 hover:border-stone-300'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-6 h-6 ${goalType.color}`} />
                        <span className="font-medium text-stone-900">{goalType.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Name */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-stone-900">Nomme ton objectif</h3>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Atteindre 50k€ de CA"
                className="text-lg"
                autoFocus
              />
              <p className="text-sm text-stone-500">
                Sois précise et inspirante ! 💫
              </p>
            </div>
          )}

          {/* Step 3: Questions adaptées */}
          {step === 3 && type === 'financial' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-stone-900">Détails financiers</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-stone-700">
                    Quel chiffre d'affaires vises-tu ?
                  </label>
                  <Input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="50000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700">
                    En combien de temps ? (mois)
                  </label>
                  <Input
                    type="number"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    placeholder="12"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700">
                    Où en es-tu aujourd'hui ?
                  </label>
                  <Input
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value)}
                    placeholder="Ex: 10k€ de CA actuel"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && type === 'project' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-stone-900">Détails du projet</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-stone-700">
                    En combien de temps ? (mois)
                  </label>
                  <Input
                    type="number"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    placeholder="12"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700">
                    Quelles compétences dois-tu acquérir ?
                  </label>
                  <Textarea
                    value={competencies}
                    onChange={(e) => setCompetencies(e.target.value)}
                    placeholder="Ex: Marketing digital, Montage vidéo, SEO"
                    className="mt-1"
                    rows={3}
                  />
                  <p className="text-xs text-stone-500 mt-1">Sépare par des virgules</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && type === 'personal' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-stone-900">Détails personnels</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-stone-700">
                    Quand veux-tu l'atteindre ? (mois)
                  </label>
                  <Input
                    type="number"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    placeholder="12"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Why */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-stone-900">Pourquoi cet objectif ?</h3>
              <Textarea
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                placeholder="Qu'est-ce qui te motive vraiment ? Pourquoi est-ce important pour toi ?"
                rows={5}
                autoFocus
              />
              <p className="text-sm text-stone-500">
                Connecte-toi à ta motivation profonde 💖
              </p>
            </div>
          )}

          {/* Step 5: Desired Feeling */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-stone-900">Comment veux-tu te sentir ?</h3>
              <Textarea
                value={desiredFeeling}
                onChange={(e) => setDesiredFeeling(e.target.value)}
                placeholder="Quand tu auras atteint cet objectif, comment te sentiras-tu ?"
                rows={5}
                autoFocus
              />
              <p className="text-sm text-stone-500">
                Visualise ton succès ✨
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-stone-100">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          )}

          {step < 5 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !type) ||
                (step === 2 && !name) ||
                (step === 3 && (!timeframe || (type === 'financial' && !targetAmount)))
              }
              className="flex-1 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
            >
              Suivant
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!why || !desiredFeeling || isSubmitting}
              className="flex-1 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
            >
              {isSubmitting ? 'Création...' : 'Créer mon objectif 🎯'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

