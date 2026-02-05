'use client';

import { useState } from 'react';
import { ChevronLeft, Check, Flame, Trophy, Target, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  const [activeTab, setActiveTab] = useState<'flow' | 'progression' | 'badges'>('flow');
  const [showChoiceCard, setShowChoiceCard] = useState(true);
  
  const currentFlowDay = personalizedFlow?.days.find(d => d.day === personalizedFlow.currentDay);
  const progressPercent = personalizedFlow ? Math.round((personalizedFlow.completedDays.length / 30) * 100) : 0;
  const completedCount = personalizedFlow?.completedDays.length || 0;
  const currentDay = personalizedFlow?.currentDay || 1;
  
  // Traductions
  const t = {
    flow: language === 'fr' ? 'Flow' : language === 'en' ? 'Flow' : 'Flow',
    progression: language === 'fr' ? 'Progression' : language === 'en' ? 'Progress' : 'Progreso',
    badges: language === 'fr' ? 'Badges' : language === 'en' ? 'Badges' : 'Insignias',
    day: language === 'fr' ? 'Jour' : language === 'en' ? 'Day' : 'Día',
    validate: language === 'fr' ? 'Valider le jour' : language === 'en' ? 'Complete day' : 'Completar día',
    or: language === 'fr' ? 'ou' : language === 'en' ? 'or' : 'o',
    mandatory: language === 'fr' ? 'Obligatoire' : language === 'en' ? 'Mandatory' : 'Obligatorio',
    choice: language === 'fr' ? 'Au choix' : language === 'en' ? 'Choose one' : 'A elegir',
    choiceTitle: language === 'fr' ? 'Action au choix' : language === 'en' ? 'Choose your action' : 'Elige tu acción',
    choiceSubtitle: language === 'fr' ? 'Sélectionne une action pour aujourd\'hui' : language === 'en' ? 'Select an action for today' : 'Selecciona una acción para hoy',
  };

  // Récupérer les actions dynamiques depuis le flow
  const mandatoryActions = currentFlowDay?.mandatoryActions || [];
  const choiceActions = currentFlowDay?.choiceActions || [];
  
  const selectedChoiceId = currentFlowDay?.selectedChoiceId || '';
  
  // Vérifier si les actions sont complétées
  const isAction1Completed = mandatoryActions[0]?.isCompleted || false;
  const isAction2Completed = mandatoryActions[1]?.isCompleted || false;
  const isChoiceCompleted = !!selectedChoiceId;
  const canCompleteDay = isAction1Completed && isAction2Completed && isChoiceCompleted;

  // Section Flow avec design des cartes du challenge beauté
  const renderFlowSection = () => (
    <div className="space-y-4 pb-24">
      {/* Header du jour */}
      <div className="text-center mb-6">
        <Badge className="bg-pink-100 text-pink-700 mb-2">
          {t.day} {currentDay} / 30
        </Badge>
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          {currentFlowDay?.title || `${t.day} ${currentDay}`}
        </h2>
        <p className="text-sm text-gray-600">
          {personalizedFlow?.objective || objectifPrincipal}
        </p>
      </div>

      {/* Liste des actions avec design des piliers beauté */}
      <div className="space-y-4">
        {/* Action 1: Première action obligatoire */}
        {mandatoryActions[0] && (
          <div
            className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01] bg-gradient-to-br from-white to-pink-50 shadow-md hover:shadow-lg ${
              isAction1Completed ? 'opacity-60' : ''
            }`}
            onClick={() => onToggleAction(currentDay, mandatoryActions[0].id)}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl drop-shadow-lg">{mandatoryActions[0].icon}</span>
              <div className="flex-1">
                <h4 className={`font-bold text-sm mb-1 text-gray-800 ${isAction1Completed ? 'line-through' : ''}`}>
                  {mandatoryActions[0].title}
                </h4>
                <p className={`text-sm ${isAction1Completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                  {mandatoryActions[0].description}
                </p>
              </div>
              {isAction1Completed && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action 2: Deuxième action obligatoire */}
        {mandatoryActions[1] && (
          <div
            className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01] bg-gradient-to-br from-white to-pink-50 shadow-md hover:shadow-lg ${
              isAction2Completed ? 'opacity-60' : ''
            }`}
            onClick={() => onToggleAction(currentDay, mandatoryActions[1].id)}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl drop-shadow-lg">{mandatoryActions[1].icon}</span>
              <div className="flex-1">
                <h4 className={`font-bold text-sm mb-1 text-gray-800 ${isAction2Completed ? 'line-through' : ''}`}>
                  {mandatoryActions[1].title}
                </h4>
                <p className={`text-sm ${isAction2Completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                  {mandatoryActions[1].description}
                </p>
              </div>
              {isAction2Completed && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action 3: Carte déroulante "1 geste pour toi" avec design beauté */}
        {choiceActions.length > 0 && (
          <div>
            {/* Header de la carte */}
            <div
              className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01] bg-gradient-to-br from-white to-pink-50 shadow-md hover:shadow-lg`}
              onClick={() => setShowChoiceCard(!showChoiceCard)}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl drop-shadow-lg">🧠</span>
                <div className="flex-1">
                  <h4 className="font-bold text-sm mb-1 text-gray-800">
                    {language === 'fr' ? '1 geste pour toi' : language === 'en' ? '1 gesture for you' : '1 gesto para ti'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === 'fr' ? 'AU CHOIX' : language === 'en' ? 'YOUR CHOICE' : 'A ELEGIR'}
                  </p>
                </div>
                <div className="flex-shrink-0 p-1 rounded-full hover:bg-pink-100 transition-colors">
                  <ChevronDown 
                    className={`w-5 h-5 text-pink-400 transition-transform duration-300 ${
                      showChoiceCard ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
              </div>
            </div>

            {/* Section déroulante avec les choix */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                showChoiceCard ? 'max-h-[800px] opacity-100 mt-3' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="bg-pink-50/50 rounded-2xl p-4 space-y-3">
                {choiceActions.map((action) => {
                  const isSelected = selectedChoiceId === action.id;
                  return (
                    <div
                      key={action.id}
                      onClick={() => {
                        onSelectChoice(currentDay, action.id);
                        onToggleAction(currentDay, action.id);
                      }}
                      className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01] ${
                        isSelected
                          ? 'bg-gradient-to-br from-green-100 to-green-200 shadow-lg'
                          : 'bg-white shadow-md hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{action.icon}</span>
                        <div className="flex-1">
                          <h5 className="font-bold text-sm text-gray-800">{action.title}</h5>
                          <p className="text-xs text-gray-600">{action.description}</p>
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-green-600 flex-shrink-0" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bouton Valider */}
      <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto">
        <Button
          onClick={() => onCompleteDay(currentDay)}
          disabled={!canCompleteDay}
          className={`w-full h-14 text-lg font-bold rounded-2xl shadow-lg transition-all ${
            canCompleteDay
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {t.validate}
          {canCompleteDay && <Check className="ml-2 w-5 h-5" />}
        </Button>
      </div>
    </div>
  );

  // Section Progression
  const renderProgressionSection = () => (
    <div className="space-y-6 pb-24">
      {/* Cercle de progression principal */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-pink-50 to-rose-50">
        <CardContent className="p-6 text-center">
          <div className="relative w-40 h-40 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#fce7f3"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${progressPercent * 2.83} 283`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-pink-600">{progressPercent}%</span>
              <span className="text-xs text-gray-500 mt-1">
                {completedCount}/30 {language === 'fr' ? 'jours' : language === 'en' ? 'days' : 'días'}
              </span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            {language === 'fr' ? 'Tu avances bien !' : language === 'en' ? 'You\'re doing great!' : '¡Vas muy bien!'}
          </h3>
          <p className="text-gray-600">
            {language === 'fr' 
              ? `Encore ${30 - completedCount} jours pour atteindre ton objectif` 
              : language === 'en' 
                ? `${30 - completedCount} more days to reach your goal`
                : `${30 - completedCount} días más para alcanzar tu objetivo`}
          </p>
        </CardContent>
      </Card>

      {/* Stats en grille */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none shadow-md bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <p className="text-3xl font-bold text-orange-600">{completedCount}</p>
            <p className="text-xs text-gray-600">
              {language === 'fr' ? 'Jours d\'affilée' : language === 'en' ? 'Streak days' : 'Días consecutivos'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <p className="text-3xl font-bold text-blue-600">
              {Math.round(completedCount * 3)}
            </p>
            <p className="text-xs text-gray-600">
              {language === 'fr' ? 'Actions complétées' : language === 'en' ? 'Actions completed' : 'Acciones completadas'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline des jours */}
      <Card className="border-none shadow-md">
        <CardContent className="p-4">
          <h4 className="font-bold text-gray-800 mb-4">
            {language === 'fr' ? 'Ta timeline' : language === 'en' ? 'Your timeline' : 'Tu línea de tiempo'}
          </h4>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const isCompleted = personalizedFlow?.completedDays.includes(day);
              const isCurrent = day === currentDay;
              return (
                <div
                  key={day}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-pink-500 text-white ring-4 ring-pink-200'
                        : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : day}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Section Badges personnalisés selon la catégorie
  const renderBadgesSection = () => {
    // Détecter la catégorie depuis le flow ou l'objectif
    const category = personalizedFlow?.category || 'general';
    
    // Badges par catégorie
    const badgesByCategory: Record<string, any[]> = {
      finance: [
        { id: 'first-deal', name: language === 'fr' ? 'Premier Deal' : 'First Deal', icon: '💰', color: 'from-green-100 to-green-200', unlocked: completedCount >= 1 },
        { id: 'week-hustler', name: language === 'fr' ? 'Hustler' : 'Hustler', icon: '💼', color: 'from-yellow-100 to-orange-200', unlocked: completedCount >= 7 },
        { id: 'money-maker', name: language === 'fr' ? 'Money Maker' : 'Money Maker', icon: '💵', color: 'from-green-200 to-emerald-300', unlocked: completedCount >= 15 },
        { id: 'business-mind', name: language === 'fr' ? 'Business Mind' : 'Business Mind', icon: '🧠', color: 'from-blue-100 to-blue-200', unlocked: completedCount >= 21 },
        { id: 'ceo-vibes', name: language === 'fr' ? 'CEO Vibes' : 'CEO Vibes', icon: '👔', color: 'from-purple-100 to-purple-200', unlocked: completedCount >= 30 },
      ],
      developpement: [
        { id: 'first-step', name: language === 'fr' ? 'Premier Pas' : 'First Step', icon: '👣', color: 'from-blue-100 to-blue-200', unlocked: completedCount >= 1 },
        { id: 'confidence-boost', name: language === 'fr' ? 'Confiance +' : 'Confidence +', icon: '💪', color: 'from-yellow-100 to-orange-200', unlocked: completedCount >= 7 },
        { id: 'fearless', name: language === 'fr' ? 'Sans Peur' : 'Fearless', icon: '🦁', color: 'from-orange-100 to-red-200', unlocked: completedCount >= 15 },
        { id: 'authentic-self', name: language === 'fr' ? 'Authentique' : 'Authentic', icon: '✨', color: 'from-purple-100 to-purple-200', unlocked: completedCount >= 21 },
        { id: 'transformed', name: language === 'fr' ? 'Transformé' : 'Transformed', icon: '🦋', color: 'from-pink-200 to-rose-300', unlocked: completedCount >= 30 },
      ],
      sante: [
        { id: 'first-workout', name: language === 'fr' ? 'Premier WOD' : 'First Workout', icon: '🏃', color: 'from-blue-100 to-blue-200', unlocked: completedCount >= 1 },
        { id: 'week-warrior', name: language === 'fr' ? 'Warrior' : 'Warrior', icon: '⚡', color: 'from-yellow-100 to-orange-200', unlocked: completedCount >= 7 },
        { id: 'fit-life', name: language === 'fr' ? 'Fit Life' : 'Fit Life', icon: '💪', color: 'from-orange-100 to-red-200', unlocked: completedCount >= 15 },
        { id: 'health-guru', name: language === 'fr' ? 'Health Guru' : 'Health Guru', icon: '🥗', color: 'from-green-100 to-green-200', unlocked: completedCount >= 21 },
        { id: 'body-goals', name: language === 'fr' ? 'Body Goals' : 'Body Goals', icon: '🔥', color: 'from-red-100 to-rose-200', unlocked: completedCount >= 30 },
      ],
      competences: [
        { id: 'first-lesson', name: language === 'fr' ? 'Première Leçon' : 'First Lesson', icon: '📚', color: 'from-blue-100 to-blue-200', unlocked: completedCount >= 1 },
        { id: 'knowledge-seeker', name: language === 'fr' ? 'Curieux' : 'Knowledge Seeker', icon: '🔍', color: 'from-yellow-100 to-orange-200', unlocked: completedCount >= 7 },
        { id: 'skill-builder', name: language === 'fr' ? 'Builder' : 'Skill Builder', icon: '🛠️', color: 'from-orange-100 to-red-200', unlocked: completedCount >= 15 },
        { id: 'expert-mode', name: language === 'fr' ? 'Expert' : 'Expert Mode', icon: '🎓', color: 'from-purple-100 to-purple-200', unlocked: completedCount >= 21 },
        { id: 'master', name: language === 'fr' ? 'Maître' : 'Master', icon: '👑', color: 'from-yellow-200 to-yellow-400', unlocked: completedCount >= 30 },
      ],
      relations: [
        { id: 'first-contact', name: language === 'fr' ? 'Premier Contact' : 'First Contact', icon: '💬', color: 'from-blue-100 to-blue-200', unlocked: completedCount >= 1 },
        { id: 'social-butterfly', name: language === 'fr' ? 'Social' : 'Social Butterfly', icon: '🦋', color: 'from-yellow-100 to-orange-200', unlocked: completedCount >= 7 },
        { id: 'heart-opener', name: language === 'fr' ? 'Cœur Ouvert' : 'Heart Opener', icon: '❤️', color: 'from-red-100 to-pink-200', unlocked: completedCount >= 15 },
        { id: 'connector', name: language === 'fr' ? 'Connecteur' : 'Connector', icon: '🤝', color: 'from-purple-100 to-purple-200', unlocked: completedCount >= 21 },
        { id: 'love-guru', name: language === 'fr' ? 'Love Guru' : 'Love Guru', icon: '💕', color: 'from-pink-200 to-rose-300', unlocked: completedCount >= 30 },
      ],
      'bien-etre': [
        { id: 'first-step', name: language === 'fr' ? 'Premier Pas' : 'First Step', icon: '👣', color: 'from-blue-100 to-blue-200', unlocked: completedCount >= 1 },
        { id: 'week-warrior', name: language === 'fr' ? 'Guerrier' : 'Week Warrior', icon: '⚡', color: 'from-yellow-100 to-orange-200', unlocked: completedCount >= 7 },
        { id: 'halfway', name: language === 'fr' ? 'Mi-Parcours' : 'Halfway', icon: '🎯', color: 'from-purple-100 to-purple-200', unlocked: completedCount >= 15 },
        { id: 'consistent', name: language === 'fr' ? 'Cohérent' : 'Consistent', icon: '🔥', color: 'from-orange-100 to-red-200', unlocked: completedCount >= 21 },
        { id: 'flow-master', name: language === 'fr' ? 'Maître' : 'Flow Master', icon: '👑', color: 'from-yellow-200 to-yellow-400', unlocked: completedCount >= 30 },
      ],
      general: [
        { id: 'first-step', name: language === 'fr' ? 'Premier Pas' : 'First Step', icon: '👣', color: 'from-blue-100 to-blue-200', unlocked: completedCount >= 1 },
        { id: 'week-warrior', name: language === 'fr' ? 'Guerrier' : 'Week Warrior', icon: '⚡', color: 'from-yellow-100 to-orange-200', unlocked: completedCount >= 7 },
        { id: 'halfway', name: language === 'fr' ? 'Mi-Parcours' : 'Halfway', icon: '🎯', color: 'from-purple-100 to-purple-200', unlocked: completedCount >= 15 },
        { id: 'consistent', name: language === 'fr' ? 'Cohérent' : 'Consistent', icon: '🔥', color: 'from-orange-100 to-red-200', unlocked: completedCount >= 21 },
        { id: 'flow-master', name: language === 'fr' ? 'Maître' : 'Flow Master', icon: '👑', color: 'from-yellow-200 to-yellow-400', unlocked: completedCount >= 30 },
      ]
    };

    const badges = badgesByCategory[category] || badgesByCategory['general'];
    const unlockedCount = badges.filter(b => b.unlocked).length;

    return (
      <div className="space-y-6 pb-24">
        {/* Header badges */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {language === 'fr' ? 'Tes Badges' : language === 'en' ? 'Your Badges' : 'Tus Insignias'}
          </h3>
          <p className="text-gray-600">
            {unlockedCount} / {badges.length} {language === 'fr' ? 'débloqués' : language === 'en' ? 'unlocked' : 'desbloqueados'}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-3 max-w-xs mx-auto">
            <div 
              className="bg-gradient-to-r from-pink-400 to-rose-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / badges.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Grille de badges */}
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl text-center transition-all ${
                badge.unlocked 
                  ? `bg-gradient-to-br ${badge.color} shadow-lg scale-100` 
                  : 'bg-gray-100 opacity-50 grayscale'
              }`}
            >
              <div className="text-4xl mb-2">{badge.icon}</div>
              <p className={`text-xs font-bold leading-tight ${badge.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                {badge.name}
              </p>
              {badge.unlocked && (
                <div className="mt-2">
                  <span className="text-[10px] bg-white/80 px-2 py-1 rounded-full text-green-600 font-bold">
                    ✓ {language === 'fr' ? 'Débloqué' : language === 'en' ? 'Unlocked' : 'Desbloqueado'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Message d'encouragement */}
        {unlockedCount === 0 && (
          <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
            <CardContent className="p-4 text-center">
              <p className="text-gray-700">
                {language === 'fr' 
                  ? '🎯 Complète ton premier jour pour débloquer ton premier badge !' 
                  : language === 'en' 
                    ? '🎯 Complete your first day to unlock your first badge!'
                    : '🎯 ¡Completa tu primer día para desbloquear tu primera insignia!'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-400 to-rose-500 p-4 pb-6">
        <div className="flex items-center mb-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white ml-3">
            {personalizedFlow?.objective || objectifPrincipal}
          </h1>
        </div>
        
        {/* Badge de progression */}
        <div className="flex items-center justify-between">
          <Badge className="bg-white/20 text-white border-none">
            <Flame className="w-4 h-4 mr-1" />
            {completedCount} {language === 'fr' ? 'jours' : language === 'en' ? 'days' : 'días'}
          </Badge>
          <span className="text-white/80 text-sm">
            {currentDay}/30
          </span>
        </div>
      </div>

      {/* Content avec padding pour la barre de nav */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'flow' && renderFlowSection()}
        {activeTab === 'progression' && renderProgressionSection()}
        {activeTab === 'badges' && renderBadgesSection()}
      </div>

      {/* Barre de navigation en bas */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <button
            onClick={() => setActiveTab('flow')}
            className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
              activeTab === 'flow' ? 'text-pink-600 bg-pink-50' : 'text-gray-400'
            }`}
          >
            <Target className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{t.flow}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('progression')}
            className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
              activeTab === 'progression' ? 'text-pink-600 bg-pink-50' : 'text-gray-400'
            }`}
          >
            <Flame className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{t.progression}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
              activeTab === 'badges' ? 'text-pink-600 bg-pink-50' : 'text-gray-400'
            }`}
          >
            <Trophy className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{t.badges}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
