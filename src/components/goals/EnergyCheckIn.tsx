'use client';

import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { createEnergyLog } from '@/lib/firebase/goals-service';
import { useAuth } from '@/contexts/AuthContext';
import type { MentalState, PhysicalState } from '@/types/goals';

interface EnergyCheckInProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const MENTAL_STATES: { value: MentalState; label: string; emoji: string }[] = [
  { value: 'calm', label: 'Calme', emoji: '😌' },
  { value: 'stressed', label: 'Stressée', emoji: '😰' },
  { value: 'motivated', label: 'Motivée', emoji: '🔥' },
  { value: 'tired', label: 'Fatiguée', emoji: '😴' }
];

const PHYSICAL_STATES: { value: PhysicalState; label: string; emoji: string }[] = [
  { value: 'fit', label: 'En forme', emoji: '💪' },
  { value: 'tired', label: 'Fatiguée', emoji: '😓' },
  { value: 'sick', label: 'Malade', emoji: '🤒' },
  { value: 'energetic', label: 'Énergique', emoji: '⚡' }
];

export function EnergyCheckIn({ isOpen, onClose, onComplete }: EnergyCheckInProps) {
  const { user } = useAuth();
  const [energyLevel, setEnergyLevel] = useState([75]);
  const [mentalState, setMentalState] = useState<MentalState | null>(null);
  const [physicalState, setPhysicalState] = useState<PhysicalState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSkip = async () => {
    if (!user) return;
    
    try {
      await createEnergyLog(user.uid, {
        energyLevel: 50,
        mentalState: 'calm',
        physicalState: 'fit',
        skipped: true
      });
      onComplete();
      onClose();
    } catch (error) {
      console.error('Error skipping check-in:', error);
    }
  };

  const handleSubmit = async () => {
    if (!user || !mentalState || !physicalState) return;
    
    setIsSubmitting(true);
    try {
      await createEnergyLog(user.uid, {
        energyLevel: energyLevel[0],
        mentalState,
        physicalState,
        skipped: false
      });
      onComplete();
      onClose();
    } catch (error) {
      console.error('Error saving check-in:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-400" />
            <h2 className="text-xl font-semibold text-stone-900">Check-in Énergie</h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Message bienveillant */}
          <p className="text-sm text-stone-600">
            Comment te sens-tu aujourd'hui ? 💫
          </p>

          {/* Niveau d'énergie */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-stone-700">
              Niveau d'énergie
            </label>
            <div className="space-y-2">
              <Slider
                value={energyLevel}
                onValueChange={setEnergyLevel}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-stone-500">
                <span>0</span>
                <span className="text-lg font-semibold text-rose-400">{energyLevel[0]}</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {/* État mental */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-stone-700">
              État mental
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MENTAL_STATES.map((state) => (
                <button
                  key={state.value}
                  onClick={() => setMentalState(state.value)}
                  className={`
                    p-3 rounded-xl border-2 transition-all
                    ${mentalState === state.value
                      ? 'border-rose-400 bg-rose-50'
                      : 'border-stone-200 hover:border-stone-300'
                    }
                  `}
                >
                  <div className="text-2xl mb-1">{state.emoji}</div>
                  <div className="text-xs font-medium text-stone-700">{state.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* État physique */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-stone-700">
              État physique
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PHYSICAL_STATES.map((state) => (
                <button
                  key={state.value}
                  onClick={() => setPhysicalState(state.value)}
                  className={`
                    p-3 rounded-xl border-2 transition-all
                    ${physicalState === state.value
                      ? 'border-rose-400 bg-rose-50'
                      : 'border-stone-200 hover:border-stone-300'
                    }
                  `}
                >
                  <div className="text-2xl mb-1">{state.emoji}</div>
                  <div className="text-xs font-medium text-stone-700">{state.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="flex-1"
          >
            Passer
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!mentalState || !physicalState || isSubmitting}
            className="flex-1 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
          >
            {isSubmitting ? 'Enregistrement...' : 'Valider ✓'}
          </Button>
        </div>
      </div>
    </div>
  );
}

