'use client';

import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronRight, Edit2, Check, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AIBreakdownResponse } from '@/types/goals';

interface GoalBreakdownViewProps {
  breakdown: AIBreakdownResponse;
  onPlanTasks: () => void;
}

export function GoalBreakdownView({ breakdown, onPlanTasks }: GoalBreakdownViewProps) {
  const [expandedQuarters, setExpandedQuarters] = useState<Set<number>>(new Set([0]));
  const [expandedMonths, setExpandedMonths] = useState<Set<number>>(new Set());

  const toggleQuarter = (index: number) => {
    const newExpanded = new Set(expandedQuarters);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuarters(newExpanded);
  };

  const toggleMonth = (index: number) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedMonths(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-rose-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-stone-900 mb-2">
              Plan d'action généré par Glowee Work
            </h3>
            <p className="text-sm text-stone-600">{breakdown.explanation}</p>
          </div>
        </div>

        {/* Phases */}
        {breakdown.phases && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {Object.entries(breakdown.phases).map(([phase, data]) => (
              <div key={phase} className="bg-white rounded-lg p-3">
                <div className="text-xs font-medium text-stone-500 uppercase mb-1">
                  {phase === 'learning' && '📚 Apprentissage'}
                  {phase === 'launch' && '🚀 Lancement'}
                  {phase === 'optimization' && '⚡ Optimisation'}
                  {phase === 'scale' && '📈 Scale'}
                </div>
                <div className="text-sm font-semibold text-stone-900">{data.duration}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quarters */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">
          Découpage Trimestriel
        </h4>
        {breakdown.quarters?.map((quarter, index) => (
          <div key={index} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <button
              onClick={() => toggleQuarter(index)}
              className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedQuarters.has(index) ? (
                  <ChevronDown className="w-5 h-5 text-stone-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-stone-400" />
                )}
                <div className="text-left">
                  <div className="font-semibold text-stone-900">{quarter.title}</div>
                  <div className="text-sm text-stone-500">{quarter.period}</div>
                </div>
              </div>
              <div className="text-xs text-stone-400">
                {quarter.tasks?.length || 0} tâches
              </div>
            </button>

            {expandedQuarters.has(index) && (
              <div className="p-4 pt-0 space-y-3 animate-in slide-in-from-top duration-200">
                <p className="text-sm text-stone-600">{quarter.description}</p>

                {quarter.milestones && quarter.milestones.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-stone-500 uppercase mb-2">
                      Jalons
                    </div>
                    <div className="space-y-1">
                      {quarter.milestones.map((milestone, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-stone-700">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{milestone}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {quarter.tasks && quarter.tasks.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-stone-500 uppercase mb-2">
                      Tâches principales
                    </div>
                    <div className="space-y-1">
                      {quarter.tasks.map((task, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-stone-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0 mt-2" />
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Months */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">
          Découpage Mensuel
        </h4>
        <div className="grid gap-3">
          {breakdown.months?.slice(0, 3).map((month, index) => (
            <div key={index} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <button
                onClick={() => toggleMonth(index)}
                className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {expandedMonths.has(index) ? (
                    <ChevronDown className="w-5 h-5 text-stone-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-stone-400" />
                  )}
                  <div className="text-left">
                    <div className="font-semibold text-stone-900">{month.title}</div>
                    <div className="text-sm text-stone-500">{month.period}</div>
                  </div>
                </div>
              </button>

              {expandedMonths.has(index) && (
                <div className="p-4 pt-0 space-y-2 animate-in slide-in-from-top duration-200">
                  <p className="text-sm text-stone-600 mb-3">{month.description}</p>
                  {month.tasks && month.tasks.length > 0 && (
                    <div className="space-y-1">
                      {month.tasks.map((task, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-stone-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0 mt-2" />
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          className="flex-1"
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Modifier
        </Button>
        <Button
          onClick={onPlanTasks}
          className="flex-1 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Planifier les tâches
        </Button>
      </div>
    </div>
  );
}

