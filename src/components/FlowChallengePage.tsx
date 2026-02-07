'use client';

import { useState } from 'react';
import { ChevronLeft, Check, Flame, Trophy, Target, ChevronDown, ChevronUp, Sparkles, X, Droplet } from 'lucide-react';
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
  onRegenerateFlow?: () => void;
}

export function FlowChallengePage({
  language,
  personalizedFlow,
  objectifPrincipal,
  onBack,
  onToggleAction,
  onSelectChoice,
  onCompleteDay,
  onRegenerateFlow
}: FlowChallengePageProps) {
  const [activeTab, setActiveTab] = useState<'flow' | 'progression' | 'badges'>('flow');
  const [showChoiceCard, setShowChoiceCard] = useState(true);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'complete' | 'incomplete' | null>(null);

  const currentFlowDay = personalizedFlow?.days.find(d => d.day === personalizedFlow.currentDay);
  const progressPercent = personalizedFlow ? Math.round((personalizedFlow.completedDays.length / 30) * 100) : 0;
  const completedCount = personalizedFlow?.completedDays.length || 0;
  const currentDay = personalizedFlow?.currentDay || 1;

  // Traductions minimalistes
  const t = {
    title: currentFlowDay?.title || `Jour ${currentDay}`,
    subtitle: personalizedFlow?.objective || objectifPrincipal,
    validate: language === 'fr' ? 'Valider ma journée' : language === 'en' ? 'Complete my day' : 'Completar mi día',
    progress: language === 'fr' ? 'Progression' : language === 'en' ? 'Progress' : 'Progreso',
    streak: language === 'fr' ? 'Série' : language === 'en' ? 'Streak' : 'Racha',
    actions: language === 'fr' ? 'Actions' : language === 'en' ? 'Actions' : 'Acciones',
    badges: language === 'fr' ? 'Succès' : language === 'en' ? 'Badges' : 'Logros',
  };

  const mandatoryActions = currentFlowDay?.mandatoryActions || [];
  const choiceActions = currentFlowDay?.choiceActions || [];
  const selectedChoiceId = currentFlowDay?.selectedChoiceId || '';

  const isAction1Completed = mandatoryActions[0]?.isCompleted || false;
  const isAction2Completed = mandatoryActions[1]?.isCompleted || false;
  const isChoiceCompleted = !!selectedChoiceId;
  const completedTasksCount = Number(isAction1Completed) + Number(isAction2Completed) + Number(isChoiceCompleted);
  const canCompleteDay = completedTasksCount === 3;

  const handleValidateClick = () => {
    if (canCompleteDay) {
      setValidationStatus('complete');
    } else {
      setValidationStatus('incomplete');
    }
    setShowValidationPopup(true);
  };

  const handleConfirmValidation = () => {
    onCompleteDay(currentDay);
    setShowValidationPopup(false);
    setValidationStatus(null);
  };

  const handleCancelValidation = () => {
    setShowValidationPopup(false);
    setValidationStatus(null);
  };

  // --- RENDERS ---

  const renderFlowSection = () => (
    <div className="space-y-6 pb-36">
      {/* Top Banner Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Day Card */}
        <div className="bg-white rounded-[2rem] p-5 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-[2rem] -mr-2 -mt-2 group-hover:bg-blue-100 transition-colors"></div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.streak}</span>
            <div className="text-3xl font-bold text-slate-800 mt-1">{completedCount} <span className="text-sm font-normal text-gray-400">j</span></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs font-medium text-green-600">Active</span>
          </div>
        </div>

        {/* Focus Card */}
        <div className="bg-[#EAEFFF] rounded-[2rem] p-5 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="absolute -bottom-4 -right-4 text-6xl opacity-10 rotate-12">🎯</div>
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{language === 'fr' ? 'Objectif' : 'Goal'}</span>
          </div>
          <div className="font-bold text-indigo-900 leading-tight line-clamp-2">
            {personalizedFlow?.objective || objectifPrincipal}
          </div>
        </div>
      </div>

      {/* Main Actions List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-700 ml-2">{language === 'fr' ? 'Ta Routine' : 'Your Routine'}</h3>

        {/* Action 1 */}
        {mandatoryActions[0] && (
          <div
            onClick={() => onToggleAction(currentDay, mandatoryActions[0].id)}
            className={`bg-white p-5 rounded-[2.5rem] shadow-sm flex items-center gap-4 cursor-pointer transition-all duration-300 ${isAction1Completed ? 'opacity-60 grayscale-[0.5]' : 'hover:shadow-md hover:scale-[1.01]'}`}
          >
            <div className={`p-4 rounded-3xl flex-shrink-0 ${isAction1Completed ? 'bg-green-100 text-green-600' : 'bg-rose-50 text-rose-500'}`}>
              {isAction1Completed ? <Check className="w-6 h-6" /> : <div className="text-2xl">{mandatoryActions[0].icon}</div>}
            </div>
            <div className="flex-1">
              <h4 className={`font-bold text-slate-800 ${isAction1Completed ? 'line-through text-gray-400' : ''}`}>{mandatoryActions[0].title}</h4>
              <p className="text-xs text-gray-400 font-medium mt-0.5 line-clamp-1">{mandatoryActions[0].description}</p>
            </div>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${isAction1Completed ? 'border-green-400 bg-green-50' : 'border-gray-100'}`}>
              {isAction1Completed && <div className="w-4 h-4 rounded-full bg-green-400" />}
            </div>
          </div>
        )}

        {/* Action 2 */}
        {mandatoryActions[1] && (
          <div
            onClick={() => onToggleAction(currentDay, mandatoryActions[1].id)}
            className={`bg-white p-5 rounded-[2.5rem] shadow-sm flex items-center gap-4 cursor-pointer transition-all duration-300 ${isAction2Completed ? 'opacity-60 grayscale-[0.5]' : 'hover:shadow-md hover:scale-[1.01]'}`}
          >
            <div className={`p-4 rounded-3xl flex-shrink-0 ${isAction2Completed ? 'bg-green-100 text-green-600' : 'bg-purple-50 text-purple-500'}`}>
              {isAction2Completed ? <Check className="w-6 h-6" /> : <div className="text-2xl">{mandatoryActions[1].icon}</div>}
            </div>
            <div className="flex-1">
              <h4 className={`font-bold text-slate-800 ${isAction2Completed ? 'line-through text-gray-400' : ''}`}>{mandatoryActions[1].title}</h4>
              <p className="text-xs text-gray-400 font-medium mt-0.5 line-clamp-1">{mandatoryActions[1].description}</p>
            </div>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${isAction2Completed ? 'border-green-400 bg-green-50' : 'border-gray-100'}`}>
              {isAction2Completed && <div className="w-4 h-4 rounded-full bg-green-400" />}
            </div>
          </div>
        )}

        {/* Choice Action */}
        {choiceActions.length > 0 && (
          <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden transition-all duration-300">
            <div
              onClick={() => setShowChoiceCard(!showChoiceCard)}
              className="p-5 flex items-center gap-4 cursor-pointer"
            >
              <div className={`p-4 rounded-3xl flex-shrink-0 ${isChoiceCompleted ? 'bg-green-100 text-green-600' : 'bg-amber-50 text-amber-500'}`}>
                {isChoiceCompleted ? <Check className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800">{language === 'fr' ? 'Instant Self-Care' : 'Self-Care Moment'}</h4>
                <p className="text-xs text-amber-500 font-bold tracking-wide">{language === 'fr' ? 'CHOISIS TON INSTANT' : 'CHOOSE YOUR MOMENT'}</p>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform ${showChoiceCard ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Content */}
            {showChoiceCard && (
              <div className="px-5 pb-5 pt-0 space-y-3">
                <div className="h-px w-full bg-gray-50 mb-4"></div>
                {choiceActions.map((action) => {
                  const isSelected = selectedChoiceId === action.id;
                  return (
                    <div
                      key={action.id}
                      onClick={() => {
                        onSelectChoice(currentDay, action.id);
                        onToggleAction(currentDay, action.id);
                      }}
                      className={`p-4 rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${isSelected ? 'bg-amber-50 border-2 border-amber-100' : 'bg-gray-50 hover:bg-gray-100'}`}
                    >
                      <div className="text-xl">{action.icon}</div>
                      <div className="flex-1">
                        <h5 className={`text-sm font-bold ${isSelected ? 'text-amber-900' : 'text-slate-700'}`}>{action.title}</h5>
                      </div>
                      {isSelected && <div className="w-3 h-3 rounded-full bg-amber-500"></div>}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Validate Button - Sous les tâches */}
      <div className="mt-6 mb-8">
        <Button
          onClick={handleValidateClick}
          className="w-full h-16 rounded-[2rem] text-lg font-bold shadow-xl transition-all duration-500 bg-slate-900 text-white hover:bg-black hover:scale-[1.02]"
        >
          <span className="flex items-center gap-2">
            {t.validate} <Check className="w-5 h-5" />
          </span>
        </Button>

        {/* Indicateur de progression */}
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-400">
          <span>{completedTasksCount}/3 {language === 'fr' ? 'tâches complétées' : language === 'en' ? 'tasks completed' : 'tareas completadas'}</span>
        </div>
      </div>

      {/* Popup de validation */}
      {showValidationPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-6 max-w-sm w-full shadow-2xl">
            {validationStatus === 'complete' ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {language === 'fr' ? 'Série validée !' : language === 'en' ? 'Streak validated!' : '¡Racha validada!'}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {language === 'fr'
                      ? 'Bravo ! Tu as complété toutes tes tâches aujourd\'hui.'
                      : language === 'en'
                        ? 'Great job! You completed all your tasks today.'
                        : '¡Excelente trabajo! Completaste todas tus tareas hoy.'}
                  </p>
                </div>
                <Button
                  onClick={handleConfirmValidation}
                  className="w-full h-14 rounded-[2rem] bg-slate-900 text-white font-bold hover:bg-black"
                >
                  {language === 'fr' ? 'Continuer' : language === 'en' ? 'Continue' : 'Continuar'}
                </Button>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🤔</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {language === 'fr' ? 'Remise en question' : language === 'en' ? 'Double check' : 'Verificación'}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {language === 'fr'
                      ? `Tu n'as complété que ${completedTasksCount}/3 tâches. Veux-tu vraiment valider sans avoir tout complété ?`
                      : language === 'en'
                        ? `You only completed ${completedTasksCount}/3 tasks. Do you really want to validate without completing everything?`
                        : `Solo completaste ${completedTasksCount}/3 tareas. ¿Realmente quieres validar sin completar todo?`}
                  </p>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={handleConfirmValidation}
                    className="w-full h-14 rounded-[2rem] bg-slate-900 text-white font-bold hover:bg-black"
                  >
                    {language === 'fr' ? 'Oui, valider quand même' : language === 'en' ? 'Yes, validate anyway' : 'Sí, validar de todos modos'}
                  </Button>
                  <Button
                    onClick={handleCancelValidation}
                    variant="outline"
                    className="w-full h-14 rounded-[2rem] border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
                  >
                    {language === 'fr' ? 'Non, je vais compléter' : language === 'en' ? 'No, I\'ll complete them' : 'No, las completaré'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderProgressionSection = () => (
    <div className="space-y-6 pb-28">
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-purple-400"></div>
        <div className="w-40 h-40 mx-auto relative mb-4">
          {/* Simple Ring generated with CSS for cleaner look in this style */}
          <div className="w-full h-full rounded-full border-[12px] border-gray-100"></div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-[12px] border-blue-500 border-t-transparent border-l-transparent rotate-45" style={{ transform: `rotate(${(progressPercent / 100) * 360}deg)` }}></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-slate-800">{progressPercent}%</span>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t.progress}</span>
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-700">{language === 'fr' ? 'Continue comme ça !' : 'Keep it up!'}</h3>
        <p className="text-gray-400 text-sm mt-1">{completedCount}/30 {language === 'fr' ? 'jours complétés' : 'days completed'}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#FFF4F4] rounded-[2rem] p-6 flex flex-col items-center justify-center gap-2">
          <div className="text-3xl">🔥</div>
          <div className="font-bold text-rose-900">{language === 'fr' ? 'Ta Série' : 'Your Streak'}</div>
          <div className="text-2xl font-black text-rose-400">{completedCount}</div>
        </div>
        <div className="bg-[#2b7fff] rounded-[2rem] p-5 flex flex-col justify-between text-white shadow-lg shadow-blue-200 relative overflow-hidden group">
          {/* Decorative background blur */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center gap-2 mb-3 relative z-10">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Droplet className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm tracking-wide">{language === 'fr' ? 'Hydratation' : 'Hydration'}</span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="flex items-end justify-between gap-1.5 h-16 mb-2 px-1 relative z-10">
            {[90, 85, 95, 100, 92, 88, 98].map((height, i) => (
              <div key={i} className="w-2 flex-1 bg-white/20 rounded-full h-full relative overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 w-full bg-white rounded-full transition-all duration-1000 ease-out"
                  style={{ height: `${height}%` }}
                ></div>
              </div>
            ))}
          </div>

          <div className="flex items-baseline gap-1 relative z-10">
            <span className="text-3xl font-bold tracking-tight">100%</span>
            <span className="text-sm font-medium text-white/80"></span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBadgesSection = () => {
    // Définition locale des badges pour l'affichage
    const allBadges = [
      { id: 'first_step', icon: '🌱', title: language === 'fr' ? 'Premier Pas' : 'First Step', description: language === 'fr' ? 'Terminer le jour 1' : 'Complete Day 1', color: 'bg-green-100 text-green-600' },
      { id: 'streak_3', icon: '🔥', title: language === 'fr' ? 'En Feu' : 'On Fire', description: language === 'fr' ? 'Série de 3 jours' : '3 Day Streak', color: 'bg-orange-100 text-orange-600' },
      { id: 'hydration_master', icon: '💧', title: language === 'fr' ? 'Hydratation' : 'Hydration', description: language === 'fr' ? 'Objectif eau atteint' : 'Water goal reached', color: 'bg-blue-100 text-blue-600' },
      { id: 'self_care_queen', icon: '👑', title: 'Self-Care Queen', description: language === 'fr' ? '5 actions bien-être' : '5 self-care actions', color: 'bg-purple-100 text-purple-600' },
      { id: 'week_1', icon: '🌟', title: language === 'fr' ? 'Semaine 1' : 'Week 1', description: language === 'fr' ? '7 jours complétés' : '7 days completed', color: 'bg-yellow-100 text-yellow-600' },
      { id: 'mindful', icon: '🧘‍♀️', title: language === 'fr' ? 'Pleine Conscience' : 'Mindful', description: language === 'fr' ? '3 sessions de méditation' : '3 meditation sessions', color: 'bg-indigo-100 text-indigo-600' },
    ];

    return (
      <div className="space-y-6 pb-28">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            🏆
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">{t.badges}</h3>
          <p className="text-gray-400 text-sm px-4">
            {language === 'fr' ? 'Complète tes journées pour débloquer ces récompenses uniques.' : 'Complete your days to unlock these unique rewards.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {allBadges.map((badge) => {
            // Logique de déblocage simulée pour l'UI, connectée aux données réelles si disponibles
            const isUnlocked = personalizedFlow?.badges?.includes(badge.id) ||
              (badge.id === 'first_step' && (personalizedFlow?.completedDays.length || 0) > 0) ||
              (badge.id === 'streak_3' && (personalizedFlow?.completedDays.length || 0) >= 3) ||
              (badge.id === 'week_1' && (personalizedFlow?.completedDays.length || 0) >= 7);

            return (
              <div
                key={badge.id}
                className={`rounded-[2rem] p-5 flex flex-col items-center text-center gap-3 transition-all duration-300 border-2 ${isUnlocked ? 'bg-white border-transparent shadow-sm' : 'bg-gray-50 border-transparent opacity-60 grayscale'
                  }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-1 ${isUnlocked ? badge.color : 'bg-gray-200 text-gray-400'}`}>
                  {badge.icon}
                </div>
                <div>
                  <h4 className={`font-bold text-sm leading-tight ${isUnlocked ? 'text-slate-800' : 'text-gray-400'}`}>{badge.title}</h4>
                  <p className="text-[10px] text-gray-400 font-medium mt-1 leading-tight">{badge.description}</p>
                </div>
                {isUnlocked && <div className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full mt-1">Obtenu</div>}
                {!isUnlocked && <div className="px-3 py-1 bg-gray-200 text-gray-500 text-[10px] font-bold rounded-full mt-1">Verrouillé</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-slate-800 font-sans">
      {/* Soft Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 leading-none">{t.title}</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric' })}</p>
          </div>
        </div>
        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center overflow-hidden border-2 border-white">
          <div className="w-full h-full bg-gradient-to-br from-indigo-200 to-purple-200"></div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6">
        {activeTab === 'flow' && renderFlowSection()}
        {activeTab === 'progression' && renderProgressionSection()}
        {activeTab === 'badges' && renderBadgesSection()}
      </div>

      {/* Floating Dock Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-full px-6 py-3 flex items-center gap-8 z-30">
        <button
          onClick={() => setActiveTab('flow')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'flow' ? 'text-slate-900 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <div className={`p-2 rounded-full ${activeTab === 'flow' ? 'bg-slate-100' : ''}`}>
            <Target className="w-6 h-6" />
          </div>
        </button>
        <button
          onClick={() => setActiveTab('progression')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'progression' ? 'text-slate-900 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <div className={`p-2 rounded-full ${activeTab === 'progression' ? 'bg-slate-100' : ''}`}>
            <Flame className="w-6 h-6" />
          </div>
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'badges' ? 'text-slate-900 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <div className={`p-2 rounded-full ${activeTab === 'badges' ? 'bg-slate-100' : ''}`}>
            <Trophy className="w-6 h-6" />
          </div>
        </button>
      </div>
    </div>
  );
}
