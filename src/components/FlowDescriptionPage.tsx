'use client';

import { useState } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language } from '@/lib/translations';

interface FlowDescriptionPageProps {
  language: Language;
  objectifPrincipal: string;
  onBack: () => void;
  onCreate: (description: string) => void;
}

export function FlowDescriptionPage({ language, objectifPrincipal, onBack, onCreate }: FlowDescriptionPageProps) {
  const [flowDescription, setFlowDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const title = language === 'fr' ? 'Parfait, dis-nous en un peu plus' : language === 'en' ? 'Perfect, tell us a bit more' : 'Perfecto, cuéntanos un poco más';
  const subtitle = language === 'fr' ? 'Sur ton objectif et ta situation actuelle...' : language === 'en' ? 'About your goal and current situation...' : 'Sobre tu objetivo y tu situación actual...';
  const placeholder = language === 'fr' ? 'Ex: Je veux améliorer ma confiance en moi car je me sens souvent anxieux en public...' : language === 'en' ? 'Ex: I want to improve my self-confidence because I often feel anxious in public...' : 'Ej: Quiero mejorar mi confianza porque a menudo me siento ansioso en público...';
  const createButton = language === 'fr' ? 'Créer mon Flow' : language === 'en' ? 'Create my Flow' : 'Crear mi Flow';
  const backButton = language === 'fr' ? 'Retour' : language === 'en' ? 'Back' : 'Volver';
  const labelText = language === 'fr' ? 'Décris ton objectif et ta situation' : language === 'en' ? 'Describe your goal and situation' : 'Describe tu objetivo y tu situación';
  const objectiveLabel = language === 'fr' ? 'Ton objectif principal' : language === 'en' ? 'Your main goal' : 'Tu objetivo principal';
  const preparingText = language === 'fr' ? 'Préparation de ton Flow...' : language === 'en' ? 'Preparing your Flow...' : 'Preparando tu Flow...';

  const handleCreate = () => {
    if (!flowDescription.trim()) return;
    setIsGenerating(true);
    // Simuler la génération
    setTimeout(() => {
      setIsGenerating(false);
      onCreate(flowDescription);
    }, 2000);
  };

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
            disabled={!flowDescription.trim() || isGenerating}
            className={`w-full h-14 text-lg font-bold rounded-2xl shadow-lg transition-all ${
              flowDescription.trim() && !isGenerating
                ? 'bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white shadow-pink-200/50 hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {preparingText}
              </span>
            ) : (
              <>
                {createButton}
                <ChevronRight className="ml-2 w-5 h-5" />
              </>
            )}
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
