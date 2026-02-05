'use client';

import { useState } from 'react';
import { Star, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language } from '@/lib/translations';

interface GoalSetup1Props {
  language: Language;
  objectifsPrioritaires: string[];
  onStart: (objectifPrincipal: string) => void;
}

export function GoalSetup1({ language, objectifsPrioritaires, onStart }: GoalSetup1Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleStart = () => {
    if (selected !== null) {
      onStart(objectifsPrioritaires[selected]);
    }
  };

  const getTitle = () => {
    switch (language) {
      case 'fr': return "Choisis l'objectif";
      case 'en': return "Choose the goal";
      case 'es': return "Elige el objetivo";
      default: return "Choose the goal";
    }
  };

  const getDescription = () => {
    switch (language) {
      case 'fr': return "qui compte le plus pour toi aujourd'hui.";
      case 'en': return "that matters most to you today.";
      case 'es': return "que más te importa hoy.";
      default: return "that matters most to you today.";
    }
  };

  const getStartText = () => {
    switch (language) {
      case 'fr': return 'Commencer mon parcours';
      case 'en': return 'Start my journey';
      case 'es': return 'Comenzar mi camino';
      default: return 'Start my journey';
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <div className="flex-1 max-w-md mx-auto w-full space-y-6 pt-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg shadow-pink-200/50">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {getTitle()}
          </h1>
          <p className="text-gray-600">
            {getDescription()}
          </p>
        </div>

        {/* Selection List */}
        <div className="space-y-3">
          {objectifsPrioritaires.map((objective, index) => (
            <button
              key={index}
              onClick={() => setSelected(index)}
              className={`w-full p-4 rounded-2xl text-left transition-all ${
                selected === index
                  ? 'bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-lg shadow-pink-200/50'
                  : 'bg-white shadow-sm text-gray-800 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selected === index ? 'border-white bg-white/20' : 'border-gray-300'
                }`}>
                  {selected === index && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className="flex-1 font-medium">{objective}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2">
          <div className="w-8 h-2 rounded-full bg-gray-300"></div>
          <div className="w-8 h-2 rounded-full bg-gray-300"></div>
          <div className="w-8 h-2 rounded-full bg-pink-500"></div>
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-6 pb-8">
        <Button
          onClick={handleStart}
          disabled={selected === null}
          className={`w-full h-14 text-lg font-bold rounded-2xl shadow-lg transition-all ${
            selected !== null
              ? 'bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white shadow-pink-200/50 hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {getStartText()}
          <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
