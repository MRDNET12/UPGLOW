'use client';

import { useState } from 'react';
import { Layers, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language } from '@/lib/translations';

interface GoalSetup3Props {
  language: Language;
  objectifsInitiaux: string[];
  onContinue: (selectedObjectives: string[]) => void;
}

export function GoalSetup3({ language, objectifsInitiaux, onContinue }: GoalSetup3Props) {
  const [selected, setSelected] = useState<number[]>([]);

  const handleToggle = (index: number) => {
    if (selected.includes(index)) {
      setSelected(selected.filter(i => i !== index));
    } else if (selected.length < 3) {
      setSelected([...selected, index]);
    }
  };

  const handleContinue = () => {
    const selectedObjectives = selected.map(index => objectifsInitiaux[index]);
    onContinue(selectedObjectives);
  };

  const getTitle = () => {
    switch (language) {
      case 'fr': return 'Choisis tes priorités';
      case 'en': return 'Choose your priorities';
      case 'es': return 'Elige tus prioridades';
      default: return 'Choose your priorities';
    }
  };

  const getDescription = () => {
    switch (language) {
      case 'fr': return "Tu ne peux pas tout changer en même temps. Choisis 3 objectifs sur lesquels tu aimerais te concentrer.";
      case 'en': return "You can't change everything at once. Choose 3 goals you'd like to focus on.";
      case 'es': return "No puedes cambiar todo a la vez. Elige 3 objetivos en los que te gustaría concentrarte.";
      default: return "You can't change everything at once. Choose 3 goals you'd like to focus on.";
    }
  };

  const getSelectedText = () => {
    switch (language) {
      case 'fr': return 'sélectionnés';
      case 'en': return 'selected';
      case 'es': return 'seleccionados';
      default: return 'selected';
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
            <Layers className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {getTitle()}
          </h1>
          <p className="text-gray-600">
            {getDescription()}
          </p>
        </div>

        {/* Counter */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm text-gray-700 font-medium">
            <span className="text-pink-500 font-bold">{selected.length}/3</span>
            <span>{getSelectedText()}</span>
          </span>
        </div>

        {/* Selection List */}
        <div className="space-y-3">
          {objectifsInitiaux.map((objective, index) => (
            <button
              key={index}
              onClick={() => handleToggle(index)}
              disabled={!selected.includes(index) && selected.length >= 3}
              className={`w-full p-4 rounded-2xl text-left transition-all ${
                selected.includes(index)
                  ? 'bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-lg shadow-pink-200/50'
                  : selected.length >= 3
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white shadow-sm text-gray-800 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selected.includes(index) ? 'border-white bg-white/20' : 'border-gray-300'
                }`}>
                  {selected.includes(index) && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className="flex-1 font-medium">{objective}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2">
          <div className="w-8 h-2 rounded-full bg-gray-300"></div>
          <div className="w-8 h-2 rounded-full bg-pink-500"></div>
          <div className="w-8 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="pt-6 pb-8">
        <Button
          onClick={handleContinue}
          disabled={selected.length === 0}
          className={`w-full h-14 text-lg font-bold rounded-2xl shadow-lg transition-all ${
            selected.length > 0
              ? 'bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white shadow-pink-200/50 hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {getContinueText()}
          <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
