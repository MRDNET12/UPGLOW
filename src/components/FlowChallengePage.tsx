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

  const currentFlowDay = personalizedFlow?.days.find(d => d.day === personalizedFlow.currentDay);
  const progressPercent = personalizedFlow ? Math.round((personalizedFlow.completedDays.length / 30) * 100) : 0;
  const completedCount = personalizedFlow?.completedDays.length || 0;
  const currentDay = personalizedFlow?.currentDay || 1;

  // Traductions minimalistes
  const t = {
    title: currentFlowDay?.title || `Jour ${currentDay}`,
    subtitle: personalizedFlow?.objective || objectifPrincipal,
    validate: language === 'fr' ? 'Valider' : language === 'en' ? 'Complete' : 'Completar',
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
  const canCompleteDay = isAction1Completed && isAction2Completed && isChoiceCompleted;

  // --- RENDERS ---

  const renderFlowSection = () => (
    <div className="space-y-6 pb-28">
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

      {/* Validate Button */}
      <div className="fixed bottom-24 left-6 right-6 z-20">
        <Button
          onClick={() => onCompleteDay(currentDay)}
          disabled={!canCompleteDay}
          className={`w-full h-16 rounded-[2rem] text-lg font-bold shadow-xl transition-all duration-500 ${canCompleteDay
              ? 'bg-slate-900 text-white hover:bg-black hover:scale-[1.02]'
              : 'bg-white text-gray-300 shadow-none border-2 border-gray-100'
            }`}
        >
          {canCompleteDay ? (
            <span className="flex items-center gap-2">
              {t.validate} <Check className="w-5 h-5" />
            </span>
          ) : (
            <span>{Math.round(((Number(isAction1Completed) + Number(isAction2Completed) + Number(isChoiceCompleted)) / 3) * 100)}%</span>
          )}
        </Button>
      </div>
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
        <div className="bg-[#F2F7FF] rounded-[2rem] p-6 flex flex-col items-center justify-center gap-2">
          <div className="text-3xl">💧</div>
          <div className="font-bold text-blue-900">{language === 'fr' ? 'Hydratation' : 'Hydration'}</div>
          <div className="text-2xl font-black text-blue-400">100%</div>
        </div>
      </div>
    </div>
  );

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
        {/* Reuse existing badges section logic if needed, slightly adapted */}
        {activeTab === 'badges' && renderFlowSection()} {/* Placeholder, reusing Flow for now for visual consistency check or implement specific badge view matching style */}
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
