'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Check, Flame, Trophy, Target, ChevronDown, ChevronUp, Sparkles, X, Droplet, Plus, Wand2, Lightbulb } from 'lucide-react';
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
  onContinueFlow?: () => void;        // Nouveau: continuer la génération
  needsContinuation?: boolean;        // Nouveau: indique si on doit afficher le bouton
  isGeneratingFlow?: boolean;         // Nouveau: indique si on génère
  checkAndUnlockNextDay?: () => void; // Nouveau: vérifie si le jour suivant doit être débloqué
}

export function FlowChallengePage({
  language,
  personalizedFlow,
  objectifPrincipal,
  onBack,
  onToggleAction,
  onSelectChoice,
  onCompleteDay,
  onRegenerateFlow,
  onContinueFlow,
  needsContinuation,
  isGeneratingFlow,
  checkAndUnlockNextDay
}: FlowChallengePageProps) {
  const [activeTab, setActiveTab] = useState<'flow' | 'progression' | 'badges'>('flow');
  const [showChoiceCard, setShowChoiceCard] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'complete' | 'incomplete' | null>(null);
  const [selectedTask, setSelectedTask] = useState<{ title: string, description: string, icon: string } | null>(null);

  // États pour l'animation de continuation du Flow
  const [showContinuationAnimation, setShowContinuationAnimation] = useState(false);
  const [continuationStep, setContinuationStep] = useState(0);
  const [showContinuationMessage, setShowContinuationMessage] = useState(false);
  const [dayJustCompleted, setDayJustCompleted] = useState(false);

  // Animation des étapes de continuation
  useEffect(() => {
    if (showContinuationAnimation) {
      const interval = setInterval(() => {
        setContinuationStep((prev) => (prev + 1) % 4);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [showContinuationAnimation]);

  // Vérifier périodiquement si le jour suivant doit être débloqué (toutes les minutes)
  useEffect(() => {
    if (checkAndUnlockNextDay) {
      checkAndUnlockNextDay(); // Vérification initiale
      const interval = setInterval(() => {
        checkAndUnlockNextDay();
      }, 60000); // Vérifier toutes les minutes
      return () => clearInterval(interval);
    }
  }, [checkAndUnlockNextDay]);

  const currentFlowDay = personalizedFlow?.days.find(d => d.day === personalizedFlow.currentDay);
  const progressPercent = personalizedFlow ? Math.round((personalizedFlow.completedDays.length / 30) * 100) : 0;
  const completedCount = personalizedFlow?.completedDays.length || 0;
  const currentDay = personalizedFlow?.currentDay || 1;

  // Vérifier si le jour suivant est débloqué (après minuit)
  const getNextDayUnlockTime = () => {
    if (!personalizedFlow?.startDate) return null;
    const start = new Date(personalizedFlow.startDate);
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceStart + 1;
  };

  const maxUnlockedDay = getNextDayUnlockTime() || currentDay;
  const canViewNextDay = currentDay <= maxUnlockedDay;

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
    // Marquer que le jour vient d'être complété (pour afficher le bouton de continuation)
    setDayJustCompleted(true);
  };

  const handleCancelValidation = () => {
    setShowValidationPopup(false);
    setValidationStatus(null);
  };

  // --- RENDERS ---

  const renderFlowSection = () => (
    <div className="space-y-6 pb-36 px-1">
      {/* Top Banner Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Streak Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2rem] p-5 shadow-lg shadow-blue-900/20 flex flex-col justify-between h-36 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/30 rounded-bl-[3rem] -mr-4 -mt-4 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-400/20 rounded-tr-[2rem] -ml-2 -mb-2 blur-lg"></div>

          <div className="relative z-10">
            <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">{t.streak}</span>
            <div className="text-4xl font-bold text-white mt-1 tracking-tight">{completedCount} <span className="text-sm font-normal text-blue-200">j</span></div>
          </div>
          <div className="flex items-center gap-2 relative z-10 bg-black/20 self-start px-3 py-1 rounded-full backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
            <span className="text-[10px] font-medium text-white tracking-wide">Active</span>
          </div>
        </div>

        {/* Goal Card */}
        <div className="bg-[#1E293B] border border-white/5 rounded-[2rem] p-5 shadow-lg flex flex-col justify-between h-36 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{language === 'fr' ? 'Objectif' : 'Goal'}</span>
          </div>
          <div className="relative z-10 font-bold text-white leading-tight line-clamp-3 text-lg">
            {personalizedFlow?.objective || objectifPrincipal}
          </div>
          <div className="absolute -bottom-2 -right-2 opacity-5">
            <Target className="w-16 h-16 text-white" />
          </div>
        </div>
      </div>

      {/* Main Actions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-bold text-white">{language === 'fr' ? 'Ta Routine' : 'Your Routine'}</h3>
          <span className="text-xs font-medium text-slate-400">{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric' })}</span>
        </div>

        {/* Action 1 */}
        {mandatoryActions[0] && (
          <div className="relative group">
            <div
              onClick={() => onToggleAction(currentDay, mandatoryActions[0].id)}
              className={`relative overflow-hidden p-0.5 rounded-[2.5rem] transition-all duration-300 ${isAction1Completed ? 'opacity-50' : 'hover:scale-[1.01]'}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2.5rem]`}></div>
              <div className={`bg-[#1E293B] relative p-5 rounded-[2.4rem] flex items-center gap-4 cursor-pointer border border-white/5 shadow-sm`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${isAction1Completed
                  ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-indigo-500/20 text-indigo-400'
                  }`}>
                  {isAction1Completed ? <Check className="w-6 h-6" /> : <div className="text-2xl">{mandatoryActions[0].icon}</div>}
                </div>
                <div className="flex-1 pr-8">
                  <h4 className={`font-bold text-base ${isAction1Completed ? 'text-slate-500 line-through' : 'text-white'}`}>{mandatoryActions[0].title}</h4>
                  <p className="text-xs text-slate-400 font-medium mt-1 line-clamp-1">{mandatoryActions[0].description}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isAction1Completed ? 'border-emerald-500 bg-emerald-500' : 'border-slate-600 group-hover:border-slate-500'
                  }`}>
                  {isAction1Completed && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            </div>
            {/* Bouton + pour voir les détails */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTask({
                  title: mandatoryActions[0].title,
                  description: mandatoryActions[0].description,
                  icon: mandatoryActions[0].icon
                });
              }}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 w-8 h-8 bg-slate-800 text-slate-300 rounded-full flex items-center justify-center border border-white/10 hover:bg-slate-700 hover:text-white transition-all z-20"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Action 2 */}
        {mandatoryActions[1] && (
          <div className="relative group">
            <div
              onClick={() => onToggleAction(currentDay, mandatoryActions[1].id)}
              className={`relative overflow-hidden p-0.5 rounded-[2.5rem] transition-all duration-300 ${isAction2Completed ? 'opacity-50' : 'hover:scale-[1.01]'}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2.5rem]`}></div>
              <div className={`bg-[#1E293B] relative p-5 rounded-[2.4rem] flex items-center gap-4 cursor-pointer border border-white/5 shadow-sm`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${isAction2Completed
                  ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-purple-500/20 text-purple-400'
                  }`}>
                  {isAction2Completed ? <Check className="w-6 h-6" /> : <div className="text-2xl">{mandatoryActions[1].icon}</div>}
                </div>
                <div className="flex-1 pr-8">
                  <h4 className={`font-bold text-base ${isAction2Completed ? 'text-slate-500 line-through' : 'text-white'}`}>{mandatoryActions[1].title}</h4>
                  <p className="text-xs text-slate-400 font-medium mt-1 line-clamp-1">{mandatoryActions[1].description}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isAction2Completed ? 'border-emerald-500 bg-emerald-500' : 'border-slate-600 group-hover:border-slate-500'
                  }`}>
                  {isAction2Completed && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            </div>
            {/* Bouton + pour voir les détails */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTask({
                  title: mandatoryActions[1].title,
                  description: mandatoryActions[1].description,
                  icon: mandatoryActions[1].icon
                });
              }}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 w-8 h-8 bg-slate-800 text-slate-300 rounded-full flex items-center justify-center border border-white/10 hover:bg-slate-700 hover:text-white transition-all z-20"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Choice Action */}
        {choiceActions.length > 0 && (
          <div className="bg-[#1E293B] border border-white/5 rounded-[2.5rem] shadow-sm overflow-hidden transition-all duration-300">
            <div
              onClick={() => setShowChoiceCard(!showChoiceCard)}
              className="p-5 flex items-center gap-4 cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${isChoiceCompleted
                ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-amber-500/20 text-amber-400'
                }`}>
                {isChoiceCompleted ? <Check className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white">{language === 'fr' ? 'Instant Self-Care' : 'Self-Care Moment'}</h4>
                <p className="text-xs text-amber-400 font-bold tracking-wide">{language === 'fr' ? 'CHOISIS TON INSTANT' : 'CHOOSE YOUR MOMENT'}</p>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${showChoiceCard ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Content */}
            {showChoiceCard && (
              <div className="px-5 pb-5 pt-0 space-y-3">
                <div className="h-px w-full bg-white/5 mb-4"></div>
                {choiceActions.map((action) => {
                  const isSelected = selectedChoiceId === action.id;
                  return (
                    <div key={action.id} className="relative group">
                      <div
                        onClick={() => {
                          if (isSelected) {
                            // Désélectionner si déjà sélectionné
                            onSelectChoice(currentDay, '');
                            onToggleAction(currentDay, action.id);
                          } else {
                            onSelectChoice(currentDay, action.id);
                            onToggleAction(currentDay, action.id);
                          }
                        }}
                        className={`p-4 rounded-2xl flex items-center gap-3 cursor-pointer transition-all border ${isSelected
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-slate-800/50 border-transparent hover:bg-slate-800'
                          }`}
                      >
                        <div className="text-xl">{action.icon}</div>
                        <div className="flex-1 pr-8">
                          <h5 className={`text-sm font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-200'}`}>{action.title}</h5>
                        </div>
                        {isSelected && <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>}
                      </div>
                      {/* Bouton + pour voir les détails */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTask({
                            title: action.title,
                            description: action.description,
                            icon: action.icon
                          });
                        }}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 w-7 h-7 bg-slate-900 text-slate-400 border border-white/10 rounded-full flex items-center justify-center hover:bg-slate-800 hover:text-white transition-all z-10"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
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
          disabled={personalizedFlow?.completedDays.includes(currentDay)}
          className={`w-full h-16 rounded-[2rem] text-lg font-bold shadow-xl transition-all duration-500 border border-t-white/10 ${personalizedFlow?.completedDays.includes(currentDay)
            ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40'
            }`}
        >
          <span className="flex items-center gap-2">
            {personalizedFlow?.completedDays.includes(currentDay)
              ? (language === 'fr' ? 'Journée validée' : language === 'en' ? 'Day completed' : 'Día completado')
              : t.validate}
            {personalizedFlow?.completedDays.includes(currentDay) && <Check className="w-5 h-5" />}
          </span>
        </Button>

        {/* Indicateur de progression */}
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-500">
          <span>{completedTasksCount}/3 {language === 'fr' ? 'tâches complétées' : language === 'en' ? 'tasks completed' : 'tareas completadas'}</span>
        </div>

        {/* Bouton Continuer - Affiché après validation de chaque jour si on n'a pas atteint 30 jours */}
        {dayJustCompleted && !showContinuationAnimation && !showContinuationMessage && personalizedFlow && personalizedFlow.days.length < 30 && (
          <div className="mt-6">
            <Button
              onClick={() => {
                setShowContinuationAnimation(true);
                // Lancer la génération en arrière-plan avec l'historique
                if (onContinueFlow) {
                  onContinueFlow();
                }
                // Après 6 secondes d'animation, afficher le message
                setTimeout(() => {
                  setShowContinuationAnimation(false);
                  setShowContinuationMessage(true);
                }, 6000);
              }}
              className="w-full h-16 rounded-[2rem] text-lg font-bold shadow-xl transition-all duration-500 bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-400 hover:to-orange-500 hover:scale-[1.02] border border-orange-400/20"
            >
              <span className="flex items-center gap-2">
                <Target className="w-5 h-5 text-white" />
                {language === 'fr' ? 'Avancer vers mon objectif' : language === 'en' ? 'Advance towards my goal' : 'Avanzar hacia mi objetivo'}
              </span>
            </Button>
            <p className="mt-2 text-center text-xs text-slate-500">
              {language === 'fr'
                ? `${personalizedFlow?.days.length || 0}/30 jours générés • Clique pour débloquer le jour suivant`
                : `${personalizedFlow?.days.length || 0}/30 days generated • Click to unlock the next day`}
            </p>
          </div>
        )}

        {/* Animation de continuation du Flow */}
        {showContinuationAnimation && (
          <div className="mt-6 flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              {/* Cercles animés identiques à l'animation initiale */}
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/30 opacity-30 animate-ping" />
              <div className="absolute inset-2 rounded-full border-4 border-orange-500/40 opacity-40 animate-ping" style={{ animationDelay: '0.2s' }} />
              <div className="absolute inset-4 rounded-full border-4 border-amber-400/50 opacity-50 animate-ping" style={{ animationDelay: '0.4s' }} />

              {/* Icône centrale qui change */}
              <div className="absolute inset-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-900/50 animate-pulse">
                {continuationStep === 0 && <Target className="w-10 h-10 text-white" />}
                {continuationStep === 1 && <Wand2 className="w-10 h-10 text-white" />}
                {continuationStep === 2 && <Lightbulb className="w-10 h-10 text-white" />}
                {continuationStep === 3 && <Sparkles className="w-10 h-10 text-white" />}
              </div>
            </div>

            {/* Texte de l'étape */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-white">
                {language === 'fr' ? 'Création de ton Flow' : language === 'en' ? 'Creating your Flow' : 'Creando tu Flow'}
              </h3>
              <p className="text-base text-amber-400 font-medium">
                {continuationStep === 0 && (language === 'fr' ? 'Analyse de ton objectif...' : language === 'en' ? 'Analyzing your goal...' : 'Analizando tu objetivo...')}
                {continuationStep === 1 && (language === 'fr' ? 'Génération du jour suivant...' : language === 'en' ? 'Generating next day...' : 'Generando el próximo día...')}
                {continuationStep === 2 && (language === 'fr' ? 'Personnalisation de ton parcours...' : language === 'en' ? 'Personalizing your journey...' : 'Personalizando tu camino...')}
                {continuationStep === 3 && (language === 'fr' ? 'Finalisation...' : language === 'en' ? 'Finalizing...' : 'Finalizando...')}
              </p>
            </div>

            {/* Barre de progression */}
            <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden mx-auto mt-4">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                style={{ width: `${((continuationStep + 1) / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Message après continuation */}
        {showContinuationMessage && (
          <div className="mt-6 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 rounded-[2rem] p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-900/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">
              {language === 'fr' ? 'Analyse des flows validés en cours' : language === 'en' ? 'Flow analysis in progress' : 'Análisis de flows en curso'}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              {language === 'fr'
                ? "Ton prochain jour sera accessible demain, pour éviter la surcharge mentale."
                : language === 'en'
                  ? "Your next day will be accessible tomorrow, to avoid mental overload."
                  : "Tu próximo día será accesible mañana, para evitar la sobrecarga mental."}
            </p>
            <div className="bg-black/30 border border-white/5 rounded-xl p-3 text-xs text-amber-400 font-medium">
              {language === 'fr'
                ? `🔒 Jour ${(personalizedFlow?.days.length || 0) + 1} verrouillé, Tu as bien avancé`
                : language === 'en'
                  ? `🔒 Day ${(personalizedFlow?.days.length || 0) + 1} locked, Great progress`
                  : `🔒 Día ${(personalizedFlow?.days.length || 0) + 1} bloqueado, Buen progreso`}
            </div>
          </div>
        )}
      </div>

      {/* Popup de validation */}
      {showValidationPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E293B] border border-white/10 rounded-[2rem] p-6 max-w-sm w-full shadow-2xl">
            {validationStatus === 'complete' ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Check className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {language === 'fr' ? 'Série validée !' : language === 'en' ? 'Streak validated!' : '¡Racha validada!'}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {language === 'fr'
                      ? 'Bravo ! Tu as complété toutes tes tâches aujourd\'hui.'
                      : language === 'en'
                        ? 'Great job! You completed all your tasks today.'
                        : '¡Excelente trabajo! Completaste todas tus tareas hoy.'}
                  </p>
                </div>
                <Button
                  onClick={handleConfirmValidation}
                  className="w-full h-14 rounded-[2rem] bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-900/50"
                >
                  {language === 'fr' ? 'Continuer' : language === 'en' ? 'Continue' : 'Continuar'}
                </Button>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🤔</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {language === 'fr' ? 'Remise en question' : language === 'en' ? 'Double check' : 'Verificación'}
                  </h3>
                  <p className="text-slate-400 text-sm">
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
                    className="w-full h-14 rounded-[2rem] bg-indigo-600 text-white font-bold hover:bg-indigo-500"
                  >
                    {language === 'fr' ? 'Oui, valider quand même' : language === 'en' ? 'Yes, validate anyway' : 'Sí, validar de todos modos'}
                  </Button>
                  <Button
                    onClick={handleCancelValidation}
                    variant="outline"
                    className="w-full h-14 rounded-[2rem] border-white/10 bg-transparent text-slate-300 font-bold hover:bg-slate-800"
                  >
                    {language === 'fr' ? 'Non, je vais compléter' : language === 'en' ? 'No, I\'ll complete them' : 'No, las completaré'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Popup détails de la tâche */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedTask(null)}>
          <div className="bg-[#0F1729] border border-white/10 rounded-[2rem] p-6 max-w-sm w-full shadow-2xl relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-blue-900/20 to-transparent"></div>
            <div className="text-center mb-6 relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl border border-white/5">
                {selectedTask.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {selectedTask.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {selectedTask.description}
              </p>
            </div>
            <Button
              onClick={() => setSelectedTask(null)}
              className="w-full h-14 rounded-[2rem] bg-white text-slate-950 font-bold hover:bg-slate-200"
            >
              {language === 'fr' ? 'Fermer' : language === 'en' ? 'Close' : 'Cerrar'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderProgressionSection = () => (
    <div className="space-y-6 pb-28">
      {/* Graph Card */}
      <div className="bg-[#1E293B] border border-white/5 rounded-[2.5rem] p-8 shadow-lg text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <div className="absolute top-0 right-0 p-6 opacity-20">
          <Sparkles className="w-24 h-24 text-blue-400" />
        </div>

        <div className="w-40 h-40 mx-auto relative mb-6">
          {/* Glowing Ring */}
          <div className="w-full h-full rounded-full border-[8px] border-slate-700/50"></div>
          <div
            className="absolute top-0 left-0 w-full h-full rounded-full border-[8px] border-blue-500 border-t-transparent border-l-transparent rotate-45 blur-[1px]"
            style={{ transform: `rotate(${(progressPercent / 100) * 360}deg)` }}
          ></div>
          <div
            className="absolute top-0 left-0 w-full h-full rounded-full border-[8px] border-blue-400 border-t-transparent border-l-transparent rotate-45"
            style={{ transform: `rotate(${(progressPercent / 100) * 360}deg)` }}
          ></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-white tracking-tighter">{progressPercent}<span className="text-xl text-blue-400">%</span></span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{t.progress}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white">{language === 'fr' ? 'Continue comme ça !' : 'Keep it up!'}</h3>
        <p className="text-slate-400 text-sm mt-1">{completedCount}/30 {language === 'fr' ? 'jours complétés' : 'days completed'}</p>

        {/* Simplified Graph Visual */}
        <div className="mt-6 flex items-end justify-between gap-1 h-12 opacity-50 px-4">
          {[20, 40, 30, 60, 50, 80, 70, 90, 100].map((h, i) => (
            <div key={i} className="w-full bg-blue-500/50 rounded-t-sm" style={{ height: `${h}%` }}></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Streak Card */}
        <div className="bg-gradient-to-br from-rose-900/40 to-rose-950/40 border border-rose-500/20 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
          <div className="text-3xl drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">🔥</div>
          <div className="font-bold text-rose-200">{language === 'fr' ? 'Ta Série' : 'Your Streak'}</div>
          <div className="text-3xl font-black text-rose-400 drop-shadow-sm">{completedCount}</div>
        </div>

        {/* Hydration Card */}
        <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 border border-blue-500/20 rounded-[2rem] p-6 relative overflow-hidden min-h-[160px] flex flex-col justify-between transition-all hover:border-blue-500/40 backdrop-blur-sm">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/10">
              <Droplet className="w-6 h-6 text-blue-400" fill="currentColor" />
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-white block leading-none">1.5L</span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-2 h-16 mt-4 px-1">
            {[35, 55, 40, 70, 50, 85, 60, 90, 45].map((h, i) => (
              <div key={i} className="w-2 rounded-full h-full relative bg-blue-950/50">
                <div
                  className="absolute bottom-0 w-full bg-blue-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_5px_rgba(96,165,250,0.5)]"
                  style={{ height: `${h}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBadgesSection = () => {
    // Définition locale des badges pour l'affichage
    const allBadges = [
      { id: 'first_step', icon: '🌱', title: language === 'fr' ? 'Premier Pas' : 'First Step', description: language === 'fr' ? 'Terminer le jour 1' : 'Complete Day 1', color: 'bg-green-500/20 text-green-400' },
      { id: 'streak_3', icon: '🔥', title: language === 'fr' ? 'En Feu' : 'On Fire', description: language === 'fr' ? 'Série de 3 jours' : '3 Day Streak', color: 'bg-orange-500/20 text-orange-400' },
      { id: 'hydration_master', icon: '💧', title: language === 'fr' ? 'Hydratation' : 'Hydration', description: language === 'fr' ? 'Objectif eau atteint' : 'Water goal reached', color: 'bg-blue-500/20 text-blue-400' },
      { id: 'self_care_queen', icon: '👑', title: 'Self-Care Queen', description: language === 'fr' ? '5 actions bien-être' : '5 self-care actions', color: 'bg-purple-500/20 text-purple-400' },
      { id: 'week_1', icon: '🌟', title: language === 'fr' ? 'Semaine 1' : 'Week 1', description: language === 'fr' ? '7 jours complétés' : '7 days completed', color: 'bg-yellow-500/20 text-yellow-400' },
      { id: 'mindful', icon: '🧘‍♀️', title: language === 'fr' ? 'Pleine Conscience' : 'Mindful', description: language === 'fr' ? '3 sessions de méditation' : '3 meditation sessions', color: 'bg-indigo-500/20 text-indigo-400' },
    ];

    return (
      <div className="space-y-6 pb-28">
        <div className="bg-[#1E293B] border border-white/5 rounded-[2.5rem] p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            🏆
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{t.badges}</h3>
          <p className="text-slate-400 text-sm px-4">
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
                className={`rounded-[2rem] p-5 flex flex-col items-center text-center gap-3 transition-all duration-300 border ${isUnlocked ? 'bg-[#1E293B] border-white/5 shadow-lg' : 'bg-slate-900 border-white/5 opacity-50 grayscale'
                  }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-1 ${isUnlocked ? badge.color : 'bg-slate-800 text-slate-600'}`}>
                  {badge.icon}
                </div>
                <div>
                  <h4 className={`font-bold text-sm leading-tight ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>{badge.title}</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-1 leading-tight">{badge.description}</p>
                </div>
                {isUnlocked && <div className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/20 text-[10px] font-bold rounded-full mt-1">Obtenu</div>}
                {!isUnlocked && <div className="px-3 py-1 bg-slate-800 text-slate-500 text-[10px] font-bold rounded-full mt-1">Verrouillé</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Content z-index adjustment */}
      <div className="relative z-10">
        {/* Soft Header */}
        <div className="px-6 pt-12 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="w-12 h-12 bg-white/5 border border-white/10 rounded-full shadow-lg flex items-center justify-center hover:bg-white/10 transition-colors backdrop-blur-md">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white leading-none tracking-tight">{t.title}</h1>
              <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2"></div>
            </div>
          </div>
          <div className="w-12 h-12 bg-white/10 border border-white/10 rounded-full shadow-lg flex items-center justify-center overflow-hidden">
            <div className="text-xl">👩‍🚀</div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-6">
          {activeTab === 'flow' && renderFlowSection()}
          {activeTab === 'progression' && renderProgressionSection()}
          {activeTab === 'badges' && renderBadgesSection()}
        </div>

        {/* Floating Dock Navigation */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0F1729]/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 rounded-full px-6 py-3 flex items-center gap-8 z-30">
          <button
            onClick={() => setActiveTab('flow')}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'flow' ? 'scale-110' : 'hover:opacity-80'}`}
          >
            <div className={`p-2.5 rounded-full transition-all ${activeTab === 'flow' ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'text-slate-400'}`}>
              <Target className={`w-6 h-6 ${activeTab === 'flow' ? 'text-white' : ''}`} />
            </div>
          </button>
          <button
            onClick={() => setActiveTab('progression')}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'progression' ? 'scale-110' : 'hover:opacity-80'}`}
          >
            <div className={`p-2.5 rounded-full transition-all ${activeTab === 'progression' ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'text-slate-400'}`}>
              <Flame className={`w-6 h-6 ${activeTab === 'progression' ? 'text-white' : ''}`} />
            </div>
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'badges' ? 'scale-110' : 'hover:opacity-80'}`}
          >
            <div className={`p-2.5 rounded-full transition-all ${activeTab === 'badges' ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'text-slate-400'}`}>
              <Trophy className={`w-6 h-6 ${activeTab === 'badges' ? 'text-white' : ''}`} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
