'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ChevronRight, Loader2, Wand2, Lightbulb, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language } from '@/lib/translations';

interface FlowDescriptionPageProps {
  language: Language;
  objectifPrincipal: string;
  onBack: () => void;
  onCreate: (description: string) => void;
  onAnimationComplete?: () => void;
}

export function FlowDescriptionPage({ language, objectifPrincipal, onBack, onCreate, onAnimationComplete }: FlowDescriptionPageProps) {
  const [flowDescription, setFlowDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const title = language === 'fr' ? 'Parfait, dis-nous en un peu plus' : language === 'en' ? 'Perfect, tell us a bit more' : 'Perfecto, cuéntanos un poco más';
  const subtitle = language === 'fr' ? 'Sur ton objectif et ta situation actuelle...' : language === 'en' ? 'About your goal and current situation...' : 'Sobre tu objetivo y tu situación actual...';
  const placeholder = language === 'fr' ? 'Ex: Je veux améliorer ma confiance en moi car je me sens souvent anxieux en public...' : language === 'en' ? 'Ex: I want to improve my self-confidence because I often feel anxious in public...' : 'Ej: Quiero mejorar mi confianza porque a menudo me siento ansioso en público...';
  const createButton = language === 'fr' ? 'Créer mon Flow' : language === 'en' ? 'Create my Flow' : 'Crear mi Flow';
  const backButton = language === 'fr' ? 'Retour' : language === 'en' ? 'Back' : 'Volver';
  const labelText = language === 'fr' ? 'Décris ton objectif et ta situation' : language === 'en' ? 'Describe your goal and situation' : 'Describe tu objetivo y tu situación';
  const objectiveLabel = language === 'fr' ? 'Ton objectif principal' : language === 'en' ? 'Your main goal' : 'Tu objetivo principal';

  const generationSteps = {
    fr: [
      { text: 'Analyse de ton objectif...', icon: Target },
      { text: 'Génération des 30 jours...', icon: Wand2 },
      { text: 'Personnalisation de ton parcours...', icon: Lightbulb },
      { text: 'Finalisation...', icon: Sparkles },
    ],
    en: [
      { text: 'Analyzing your goal...', icon: Target },
      { text: 'Generating 30 days...', icon: Wand2 },
      { text: 'Personalizing your journey...', icon: Lightbulb },
      { text: 'Finalizing...', icon: Sparkles },
    ],
    es: [
      { text: 'Analizando tu objetivo...', icon: Target },
      { text: 'Generando 30 días...', icon: Wand2 },
      { text: 'Personalizando tu camino...', icon: Lightbulb },
      { text: 'Finalizando...', icon: Sparkles },
    ],
  };

  const currentSteps = generationSteps[language];

  useEffect(() => {
    if (isGenerating) {
      // 1. Animation visuelle (boucle sur les étapes)
      const interval = setInterval(() => {
        setGenerationStep((prev) => (prev + 1) % currentSteps.length);
      }, 1250); // Changement toutes les 1.25s

      // 2. Timeout de 5 secondes avant redirection
      const timeout = setTimeout(() => {
        if (onAnimationComplete) onAnimationComplete();
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isGenerating, currentSteps.length, onAnimationComplete]);

  const handleCreate = () => {
    if (!flowDescription.trim()) return;
    setIsGenerating(true);
    setGenerationStep(0);
    onCreate(flowDescription);
  };

  if (isGenerating) {
    const CurrentIcon = currentSteps[generationStep].icon;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
        <div className="text-center space-y-8 max-w-md mx-auto">
          {/* Animation circulaire */}
          <div className="relative w-40 h-40 mx-auto">
            {/* Cercles animés */}
            <div className="absolute inset-0 rounded-full border-4 border-pink-200 opacity-20 animate-ping" />
            <div className="absolute inset-2 rounded-full border-4 border-rose-300 opacity-40 animate-ping" style={{ animationDelay: '0.2s' }} />
            <div className="absolute inset-4 rounded-full border-4 border-pink-400 opacity-60 animate-ping" style={{ animationDelay: '0.4s' }} />

            {/* Icône centrale */}
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-2xl animate-pulse">
              <CurrentIcon className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Texte de l'étape */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {language === 'fr' ? 'Création de ton Flow' : language === 'en' ? 'Creating your Flow' : 'Creando tu Flow'}
            </h2>
            <p className="text-lg text-pink-600 font-medium animate-fade-in">
              {currentSteps[generationStep].text}
            </p>
          </div>

          {/* Barre de progression */}
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${((generationStep + 1) / currentSteps.length) * 100}%` }}
            />
          </div>

          {/* Objectif affiché */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 mt-8">
            <p className="text-xs text-pink-600 font-medium mb-1">
              {objectiveLabel}
            </p>
            <p className="font-medium text-gray-800">{objectifPrincipal}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-6 bg-white">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full space-y-6 pt-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg shadow-pink-200/50">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {title}
          </h1>
          <p className="text-gray-600">
            {subtitle}
          </p>
        </div>

        {/* Champ de saisie */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {labelText}
          </label>
          <textarea
            value={flowDescription}
            onChange={(e) => setFlowDescription(e.target.value)}
            placeholder={placeholder}
            className="w-full h-40 p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-pink-400 focus:outline-none text-gray-800 resize-none"
          />
        </div>

        {/* Objectif affiché */}
        <div className="bg-pink-50 rounded-xl p-4">
          <p className="text-xs text-pink-600 font-medium mb-1">
            {objectiveLabel}
          </p>
          <p className="font-medium text-gray-800">{objectifPrincipal}</p>
        </div>

        {/* Boutons */}
        <div className="pt-4 space-y-3">
          <Button
            onClick={handleCreate}
            disabled={!flowDescription.trim()}
            className={`w-full h-14 text-lg font-bold rounded-2xl shadow-lg transition-all ${flowDescription.trim()
              ? 'bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white shadow-pink-200/50 hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {createButton}
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>

          <Button
            onClick={onBack}
            variant="outline"
            className="w-full h-12 text-gray-600 font-medium rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all"
          >
            {backButton}
          </Button>
        </div>
      </div>
    </div>
  );
}
