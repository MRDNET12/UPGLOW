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
    <div className="space-y-8 pb-36 px-1">

      {/* Manifesto & Philosophy Section */}
      <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-3 mb-2 opacity-80 justify-center">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-500/50"></div>
          <span className="text-[10px] font-bold text-blue-300 uppercase tracking-[0.25em]">ESSENTIAL</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-500/50"></div>
        </div>

        <h2 className="text-3xl md:text-4xl font-light text-white leading-tight text-center tracking-tight">
          {language === 'fr' ? (
            <>Fini la <span className="font-semibold text-white dropdown-shadow">charge mentale</span>.</>
          ) : (
            <>End the <span className="font-semibold text-white dropdown-shadow">mental overload</span>.</>
          )}
        </h2>

        <div className="bg-[#1E293B]/60 border border-white/5 rounded-2xl p-5 backdrop-blur-md shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

          <p className="text-slate-200 text-sm text-center leading-relaxed font-medium relative z-10">
            {language === 'fr'
              ? "Ici, tu avances sereinement avec 3 actions à forte valeur ajoutée."
              : "Here, you move forward calmly with 3 high-value actions."}
          </p>

          <div className="mt-4 flex items-center justify-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest relative z-10">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
              <Target className="w-3 h-3 text-blue-400" />
              <span className="max-w-[100px] truncate">{personalizedFlow?.objective || objectifPrincipal}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5 text-orange-400">
              <Flame className="w-3 h-3" />
              <span>{completedCount} j</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Mission List - Numbered 1, 2, 3 */}
      <div className="space-y-3">
        {/* Step 1 */}
        {mandatoryActions[0] && (
          <div className="relative pl-3">
            <div className="absolute left-[3px] top-8 bottom-[-16px] w-[2px] bg-[#1E293B]"></div>

            <div
              onClick={() => onToggleAction(currentDay, mandatoryActions[0].id)}
              className={`relative group bg-[#162032] border border-white/5 rounded-[2rem] p-1 transition-all duration-300 ${isAction1Completed ? 'opacity-60 grayscale-[0.3]' : 'hover:border-blue-500/30 hover:bg-[#1c2840]'}`}
            >
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0F1729] border border-slate-700 flex items-center justify-center font-bold text-slate-500 text-[10px] z-10 shadow-lg group-hover:border-blue-500/50 group-hover:text-blue-400 transition-colors">1</div>

              <div className="p-3 flex items-center gap-4 cursor-pointer">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isAction1Completed
                  ? 'bg-emerald-500 text-white scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-[#1E293B] text-blue-400 border border-white/5'
                  }`}>
                  {isAction1Completed ? <Check className="w-6 h-6" /> : <div className="text-xl">{mandatoryActions[0].icon}</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-sm md:text-base truncate ${isAction1Completed ? 'text-slate-500 line-through decoration-slate-600' : 'text-slate-100'}`}>{mandatoryActions[0].title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{mandatoryActions[0].description}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTask({ title: mandatoryActions[0].title, description: mandatoryActions[0].description, icon: mandatoryActions[0].icon });
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {mandatoryActions[1] && (
          <div className="relative pl-3">
            <div className="absolute left-[3px] top-[10px] bottom-[-16px] w-[2px] bg-[#1E293B]"></div>

            <div
              onClick={() => onToggleAction(currentDay, mandatoryActions[1].id)}
              className={`relative group bg-[#162032] border border-white/5 rounded-[2rem] p-1 transition-all duration-300 ${isAction2Completed ? 'opacity-60 grayscale-[0.3]' : 'hover:border-purple-500/30 hover:bg-[#1c2840]'}`}
            >
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0F1729] border border-slate-700 flex items-center justify-center font-bold text-slate-500 text-[10px] z-10 shadow-lg group-hover:border-purple-500/50 group-hover:text-purple-400 transition-colors">2</div>

              <div className="p-3 flex items-center gap-4 cursor-pointer">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isAction2Completed
                  ? 'bg-emerald-500 text-white scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-[#1E293B] text-purple-400 border border-white/5'
                  }`}>
                  {isAction2Completed ? <Check className="w-6 h-6" /> : <div className="text-xl">{mandatoryActions[1].icon}</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-sm md:text-base truncate ${isAction2Completed ? 'text-slate-500 line-through decoration-slate-600' : 'text-slate-100'}`}>{mandatoryActions[1].title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{mandatoryActions[1].description}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTask({ title: mandatoryActions[1].title, description: mandatoryActions[1].description, icon: mandatoryActions[1].icon });
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 (Choice) */}
        {choiceActions.length > 0 && (
          <div className="relative pl-3">
            <div className={`relative bg-[#162032] border border-white/5 rounded-[2rem] p-1 transition-all duration-300 ${isChoiceCompleted ? 'opacity-80' : 'hover:border-amber-500/30'}`}>
              <div className="absolute -left-3 top-[28px] w-6 h-6 rounded-full bg-[#0F1729] border border-slate-700 flex items-center justify-center font-bold text-slate-500 text-[10px] z-10 shadow-lg group-hover:border-amber-500/50 group-hover:text-amber-400">3</div>

              <div className="overflow-hidden rounded-[1.8rem]">
                <div
                  onClick={() => setShowChoiceCard(!showChoiceCard)}
                  className="p-3 flex items-center gap-4 cursor-pointer bg-[#1E293B]/50"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isChoiceCompleted
                    ? 'bg-emerald-500 text-white scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-[#1E293B] text-amber-400 border border-white/5'
                    }`}>
                    {isChoiceCompleted ? <Check className="w-6 h-6" /> : <Sparkles className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-100">{language === 'fr' ? 'Ton Choix' : 'Your Choice'}</h4>
                    <p className="text-[10px] text-amber-500/80 font-bold tracking-wide uppercase">{language === 'fr' ? 'INSTANT SELF-CARE' : 'SELF-CARE MOMENT'}</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${showChoiceCard ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown Content */}
                <div className={`transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${showChoiceCard ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-2 pb-2 pt-0 space-y-1">
                    {choiceActions.map((action) => {
                      const isSelected = selectedChoiceId === action.id;
                      return (
                        <div
                          key={action.id}
                          onClick={() => {
                            if (isSelected) {
                              onSelectChoice(currentDay, '');
                              onToggleAction(currentDay, action.id);
                            } else {
                              onSelectChoice(currentDay, action.id);
                              onToggleAction(currentDay, action.id);
                              setShowChoiceCard(false);
                            }
                          }}
                          className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all border ${isSelected
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : 'hover:bg-white/5 border-transparent'
                            }`}
                        >
                          <div className="text-lg">{action.icon}</div>
                          <div className="flex-1">
                            <h5 className={`text-sm font-medium ${isSelected ? 'text-emerald-400' : 'text-slate-300'}`}>{action.title}</h5>
                          </div>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Validate Button Area */}
      <div className="mt-8">
        <Button
          onClick={handleValidateClick}
          disabled={personalizedFlow?.completedDays.includes(currentDay)}
          className={`w-full h-16 rounded-[2rem] text-lg font-bold shadow-xl transition-all duration-300 ${personalizedFlow?.completedDays.includes(currentDay)
            ? 'bg-transparent border border-emerald-500/20 text-emerald-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40 hover:scale-[1.02]'
            }`}
        >
          <span className="flex items-center gap-2">
            {personalizedFlow?.completedDays.includes(currentDay)
              ? (language === 'fr' ? 'Journée validée' : 'Day completed')
              : t.validate}
            {personalizedFlow?.completedDays.includes(currentDay) && <Check className="w-5 h-5" />}
          </span>
        </Button>

        {/* Continuation Logic */}
        {dayJustCompleted && !showContinuationAnimation && !showContinuationMessage && personalizedFlow && personalizedFlow.days.length < 30 && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button
              onClick={() => {
                setShowContinuationAnimation(true);
                if (onContinueFlow) onContinueFlow();
                setTimeout(() => {
                  setShowContinuationAnimation(false);
                  setShowContinuationMessage(true);
                }, 6000);
              }}
              className="w-full h-16 rounded-[2rem] bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:scale-[1.02] transition-all shadow-lg shadow-orange-900/20"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                {language === 'fr' ? 'Débloquer le jour suivant' : 'Unlock next day'}
              </span>
            </Button>
          </div>
        )}

        {showContinuationAnimation && (
          <div className="mt-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="relative w-16 h-16 mx-auto mb-3">
              <div className="absolute inset-0 rounded-full border-t-2 border-amber-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Target className="w-6 h-6 text-amber-500" />
              </div>
            </div>
            <p className="text-sm font-medium text-amber-400 animate-pulse">
              {language === 'fr' ? 'Génération en cours...' : 'Generating...'}
            </p>
          </div>
        )}

        {showContinuationMessage && (
          <div className="mt-6 p-6 rounded-[2rem] bg-[#162032] border border-white/5 text-center">
            <p className="text-sm text-slate-400">
              {language === 'fr' ? 'Top ! Reviens demain pour la suite.' : 'Great! Come back tomorrow for more.'}
            </p>
          </div>
        )}
      </div>

      {/* Validation Popup */}
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
                    {language === 'fr' ? 'Série validée !' : 'Streak validated!'}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {language === 'fr' ? 'Bravo ! Tu as complété toutes tes tâches aujourd\'hui.' : 'Great job! You completed all your tasks today.'}
                  </p>
                </div>
                <Button onClick={handleConfirmValidation} className="w-full h-14 rounded-[2rem] bg-indigo-600 text-white font-bold hover:bg-indigo-500">
                  {language === 'fr' ? 'Continuer' : 'Continue'}
                </Button>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🤔</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{language === 'fr' ? 'Moment...' : 'Wait...'}</h3>
                  <p className="text-slate-400 text-sm">
                    {language === 'fr' ? `Tu n'as complété que ${completedTasksCount}/3 tâches.` : `You only completed ${completedTasksCount}/3 tasks.`}
                  </p>
                </div>
                <div className="space-y-3">
                  <Button onClick={handleConfirmValidation} className="w-full h-14 rounded-[2rem] bg-indigo-600 text-white font-bold hover:bg-indigo-500">
                    {language === 'fr' ? 'Oui, je valide' : 'Yes, validate'}
                  </Button>
                  <Button onClick={handleCancelValidation} variant="outline" className="w-full h-14 rounded-[2rem] border-white/10 bg-transparent text-slate-300 font-bold hover:bg-slate-800">
                    {language === 'fr' ? 'Je complète' : 'I will complete'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Details Popup */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedTask(null)}>
          <div className="bg-[#0F1729] border border-white/10 rounded-[2rem] p-6 max-w-sm w-full shadow-2xl relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6 relative z-10">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl border border-white/5">
                {selectedTask.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{selectedTask.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{selectedTask.description}</p>
            </div>
            <Button onClick={() => setSelectedTask(null)} className="w-full h-14 rounded-[2rem] bg-white text-slate-950 font-bold hover:bg-slate-200">
              {language === 'fr' ? 'Fermer' : 'Close'}
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
