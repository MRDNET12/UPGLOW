'use client';

import { useState } from 'react';
import { Sparkles, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Language } from '@/lib/translations';
import { PersonalizedFlow } from '@/lib/store';

interface FlowChallengePageProps {
  language: Language;
  personalizedFlow: PersonalizedFlow | null;
  objectifPrincipal: string;
  onBack: () => void;
  onToggleAction: (day: number, actionId: string) => void;
  onSelectChoice: (day: number, choiceId: string) => void;
  onCompleteDay: (day: number) => void;
}

export function FlowChallengePage({ 
  language, 
  personalizedFlow, 
  objectifPrincipal,
  onBack,
  onToggleAction,
  onSelectChoice,
  onCompleteDay
}: FlowChallengePageProps) {
  const currentFlowDay = personalizedFlow?.days.find(d => d.day === personalizedFlow.currentDay);
  const progressPercent = personalizedFlow ? Math.round((personalizedFlow.completedDays.length / 30) * 100) : 0;
  const streak = personalizedFlow?.completedDays.length || 0;
  
  // Badges prédéfinis
  const badges = [
    { id: 'first-step', name: language === 'fr' ? 'Premier Pas' : language === 'en' ? 'First Step' : 'Primer Paso', icon: '👣', condition: '1 jour complété' },
    { id: 'week-warrior', name: language === 'fr' ? 'Guerrier de la Semaine' : language === 'en' ? 'Week Warrior' : 'Guerrero de la Semana', icon: '⚡', condition: '7 jours consécutifs' },
    { id: 'halfway', name: language === 'fr' ? 'Mi-Parcours' : language === 'en' ? 'Halfway There' : 'Mitad del Camino', icon: '🎯', condition: '15 jours complétés' },
    { id: 'consistent', name: language === 'fr' ? 'Cohérent' : language === 'en' ? 'Consistent' : 'Consistente', icon: '🔥', condition: '21 jours complétés' },
    { id: 'flow-master', name: language === 'fr' ? 'Maître du Flow' : language === 'en' ? 'Flow Master' : 'Maestro del Flow', icon: '👑', condition: '30 jours complétés' },
    { id: 'early-bird', name: language === 'fr' ? 'Lève-Tôt' : language === 'en' ? 'Early Bird' : 'Madrugador', icon: '🌅', condition: '5 matinées productives' },
    { id: 'night-owl', name: language === 'fr' ? 'Hibou de Nuit' : language === 'en' ? 'Night Owl' : 'Búho Nocturno', icon: '🌙', condition: '5 soirées productives' },
    { id: 'action-hero', name: language === 'fr' ? 'Héros d\'Action' : language === 'en' ? 'Action Hero' : 'Héroe de Acción', icon: '🦸', condition: '50 actions complétées' },
    { id: 'choice-maker', name: language === 'fr' ? 'Décideur' : language === 'en' ? 'Choice Maker' : 'Tomador de Decisiones', icon: '✨', condition: '20 choix effectués' },
    { id: 'perfectionist', name: language === 'fr' ? 'Perfectionniste' : language === 'en' ? 'Perfectionist' : 'Perfeccionista', icon: '💎', condition: '10 jours parfaits' },
    { id: 'comeback', name: language === 'fr' ? 'Retour en Force' : language === 'en' ? 'Comeback' : 'Regreso', icon: '🚀', condition: 'Reprise après pause' },
    { id: 'speed-demon', name: language === 'fr' ? 'Démon de Vitesse' : language === 'en' ? 'Speed Demon' : 'Demonio de Velocidad', icon: '⚡', condition: '3 jours avant 9h' },
    { id: 'weekend-warrior', name: language === 'fr' ? 'Guerrier du Weekend' : language === 'en' ? 'Weekend Warrior' : 'Guerrero de Fin de Semana', icon: '🏆', condition: 'Weekend complété' },
    { id: 'reflection', name: language === 'fr' ? 'Réfléchi' : language === 'en' ? 'Reflective' : 'Reflexivo', icon: '🤔', condition: '10 notes écrites' },
    { id: 'champion', name: language === 'fr' ? 'Champion' : language === 'en' ? 'Champion' : 'Campeón', icon: '🏅', condition: 'Flow 30 jours terminé' }
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-400 to-rose-500 p-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
          >
            <ChevronRight className="w-6 h-6 text-white rotate-180" />
          </button>
          <h1 className="text-xl font-bold text-white">
            {language === 'fr' ? 'Mon Flow' : language === 'en' ? 'My Flow' : 'Mi Flow'}
          </h1>
          <div className="w-10" />
        </div>
        
        <div className="text-center">
          <p className="text-pink-100 text-sm mb-1">
            {language === 'fr' ? 'Objectif' : language === 'en' ? 'Goal' : 'Objetivo'}
          </p>
          <p className="text-white text-lg font-bold">
            {personalizedFlow?.objective || objectifPrincipal}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 -mt-4 bg-white rounded-t-3xl">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* Section 1: Flow du jour */}
          <Card className="border-none shadow-lg shadow-pink-100/50 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-gray-800">
                  {language === 'fr' ? `Jour ${personalizedFlow?.currentDay || 1} / 30` : language === 'en' ? `Day ${personalizedFlow?.currentDay || 1} / 30` : `Día ${personalizedFlow?.currentDay || 1} / 30`}
                </CardTitle>
                <Badge className="bg-pink-500 text-white">
                  {personalizedFlow?.currentDay === 1 
                    ? (language === 'fr' ? 'Commencer' : language === 'en' ? 'Start' : 'Comenzar')
                    : (language === 'fr' ? 'En cours' : language === 'en' ? 'In progress' : 'En progreso')
                  }
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {currentFlowDay ? (
                <>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    {currentFlowDay.title}
                  </p>
                  
                  {/* Actions obligatoires */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 uppercase font-bold">
                      {language === 'fr' ? 'Actions obligatoires' : language === 'en' ? 'Mandatory actions' : 'Acciones obligatorias'}
                    </p>
                    {currentFlowDay.mandatoryActions.map((action) => (
                      <div 
                        key={action.id}
                        onClick={() => onToggleAction(personalizedFlow!.currentDay, action.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                          action.isCompleted 
                            ? 'bg-green-50 border-2 border-green-200' 
                            : 'bg-gray-50 border-2 border-gray-200 hover:border-pink-300'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          action.isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-300'
                        }`}>
                          {action.isCompleted && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${action.isCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                            {action.icon} {action.title}
                          </p>
                          <p className="text-xs text-gray-500">{action.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions au choix */}
                  <div className="space-y-2 mt-4">
                    <p className="text-xs text-gray-500 uppercase font-bold">
                      {language === 'fr' ? 'Choisis une action' : language === 'en' ? 'Choose one action' : 'Elige una acción'}
                    </p>
                    {currentFlowDay.choiceActions.map((action) => (
                      <div 
                        key={action.id}
                        onClick={() => {
                          onSelectChoice(personalizedFlow!.currentDay, action.id);
                          onToggleAction(personalizedFlow!.currentDay, action.id);
                        }}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                          currentFlowDay.selectedChoiceId === action.id
                            ? 'bg-pink-50 border-2 border-pink-300' 
                            : 'bg-gray-50 border-2 border-gray-200 hover:border-pink-200'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          currentFlowDay.selectedChoiceId === action.id ? 'bg-pink-500 border-pink-500' : 'border-gray-300'
                        }`}>
                          {currentFlowDay.selectedChoiceId === action.id && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${currentFlowDay.selectedChoiceId === action.id ? 'text-pink-700' : 'text-gray-700'}`}>
                            {action.icon} {action.title}
                          </p>
                          <p className="text-xs text-gray-500">{action.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bouton compléter le jour */}
                  <Button
                    onClick={() => onCompleteDay(personalizedFlow!.currentDay)}
                    disabled={!currentFlowDay.mandatoryActions.every(a => a.isCompleted) || !currentFlowDay.selectedChoiceId}
                    className={`w-full h-12 mt-4 text-base font-bold rounded-xl shadow-lg transition-all ${
                      currentFlowDay.mandatoryActions.every(a => a.isCompleted) && currentFlowDay.selectedChoiceId
                        ? 'bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {language === 'fr' ? 'Valider le jour' : language === 'en' ? 'Complete day' : 'Completar día'}
                    <Check className="ml-2 w-5 h-5" />
                  </Button>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>{language === 'fr' ? 'Chargement du Flow...' : language === 'en' ? 'Loading Flow...' : 'Cargando Flow...'}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 2: Progression */}
          <Card className="border-none shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-gray-800">
                {language === 'fr' ? 'Ta Progression' : language === 'en' ? 'Your Progress' : 'Tu Progreso'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Barre de progression */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {personalizedFlow?.completedDays.length || 0} / 30 {language === 'fr' ? 'jours' : language === 'en' ? 'days' : 'días'}
                  </span>
                  <span className="font-bold text-pink-600">{progressPercent}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-pink-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-pink-600">{streak}</p>
                  <p className="text-xs text-gray-600">
                    {language === 'fr' ? 'Jours complétés' : language === 'en' ? 'Days completed' : 'Días completados'}
                  </p>
                </div>
                <div className="bg-rose-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-rose-600">{30 - (personalizedFlow?.completedDays.length || 0)}</p>
                  <p className="text-xs text-gray-600">
                    {language === 'fr' ? 'Jours restants' : language === 'en' ? 'Days remaining' : 'Días restantes'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Badges */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-gray-800">
              {language === 'fr' ? 'Tes Badges' : language === 'en' ? 'Your Badges' : 'Tus Insignias'}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({personalizedFlow?.badges.length || 0}/15)
              </span>
            </h3>
            
            <div className="grid grid-cols-3 gap-2">
              {badges.map((badge) => {
                const isUnlocked = personalizedFlow?.badges.includes(badge.id);
                return (
                  <div 
                    key={badge.id}
                    className={`p-3 rounded-xl text-center transition-all ${
                      isUnlocked 
                        ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-300 shadow-md' 
                        : 'bg-gray-50 border-2 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <p className={`text-xs font-medium leading-tight ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                      {badge.name}
                    </p>
                    {isUnlocked && (
                      <p className="text-[10px] text-yellow-600 mt-1">✓ {language === 'fr' ? 'Débloqué' : language === 'en' ? 'Unlocked' : 'Desbloqueado'}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
