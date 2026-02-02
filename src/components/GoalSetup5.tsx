'use client';

import { useState } from 'react';
import { Target, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language } from '@/lib/translations';

interface GoalSetup5Props {
  language: Language;
  onContinue: (objectives: string[]) => void;
}

export function GoalSetup5({ language, onContinue }: GoalSetup5Props) {
  const [objectives, setObjectives] = useState<string[]>(['', '', '', '', '']);
  const [error, setError] = useState('');

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);
    setError('');
  };

  const handleContinue = () => {
    const filledObjectives = objectives.filter(obj => obj.trim() !== '');
    if (filledObjectives.length < 5) {
      setError(language === 'fr' ? 'Remplis tous les 5 objectifs pour continuer' : language === 'en' ? 'Fill in all 5 objectives to continue' : 'Completa los 5 objetivos para continuar');
      return;
    }
    onContinue(objectives);
  };

  const getTitle = () => {
    switch (language) {
      case 'fr': return 'Définis tes objectifs';
      case 'en': return 'Define your goals';
      case 'es': return 'Define tus objetivos';
      default: return 'Define your goals';
    }
  };

  const getDescription = () => {
    switch (language) {
      case 'fr': return 'Prends un moment pour toi. Note 5 objectifs qui comptent pour toi en ce moment. Ils peuvent être petits ou grands.';
      case 'en': return 'Take a moment for yourself. Write down 5 goals that matter to you right now. They can be small or big.';
      case 'es': return 'Tómate un momento para ti. Anota 5 objetivos que te importen ahora mismo. Pueden ser pequeños o grandes.';
      default: return 'Take a moment for yourself. Write down 5 goals that matter to you right now. They can be small or big.';
    }
  };

  const getPlaceholder = (index: number) => {
    switch (language) {
      case 'fr': return `Objectif ${index + 1}`;
      case 'en': return `Goal ${index + 1}`;
      case 'es': return `Objetivo ${index + 1}`;
      default: return `Goal ${index + 1}`;
    }
  };

  const getContinueText = () => {
    switch (language) {
      case 'fr': return 'Continuer';
      case 'en': return 'Continue';
      case 'es': return 'Continuar';
      default: return 'Continue';
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <div className="flex-1 max-w-md mx-auto w-full space-y-6 pt-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg shadow-pink-200/50">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {getTitle()}
          </h1>
          <p className="text-gray-600">
            {getDescription()}
          </p>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          {objectives.map((objective, index) => (
            <div key={index} className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <input
                type="text"
                value={objective}
                onChange={(e) => handleObjectiveChange(index, e.target.value)}
                placeholder={getPlaceholder(index)}
                className="w-full pl-16 pr-4 py-4 rounded-2xl bg-white shadow-sm border-2 border-transparent focus:border-pink-300 focus:outline-none text-gray-800 placeholder-gray-400"
              />
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2">
          <div className="w-8 h-2 rounded-full bg-pink-500"></div>
          <div className="w-8 h-2 rounded-full bg-gray-300"></div>
          <div className="w-8 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="pt-6 pb-8">
        <Button
          onClick={handleContinue}
          className="w-full h-14 text-lg bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-200/50 hover:shadow-xl transition-all"
        >
          {getContinueText()}
          <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
