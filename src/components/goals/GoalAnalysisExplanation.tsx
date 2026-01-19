'use client';

import { Sparkles, Target, TrendingUp, Calendar, Zap } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface GoalAnalysisExplanationProps {
  theme?: 'light' | 'dark';
  goalType: string;
  goalName: string;
  goalDescription: string;
  deadline: string;
  targetAmount?: number;
  competency?: string;
  why?: string;
  desiredFeeling?: string;
}

export function GoalAnalysisExplanation({
  theme = 'light',
  goalType,
  goalName,
  goalDescription,
  deadline,
  targetAmount,
  competency,
  why,
  desiredFeeling
}: GoalAnalysisExplanationProps) {
  const getTimeframeExplanation = () => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = Math.abs(deadlineDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);

    let breakdown = '';
    let explanation = '';

    // Déterminer le découpage selon la durée
    if (diffMonths >= 12) {
      breakdown = 'Année → Trimestre → Mois → Semaine → Jour';
      explanation = `Ton objectif "${goalName}" est à long terme (${diffMonths} mois). `;
    } else if (diffMonths >= 3) {
      breakdown = 'Trimestre → Mois → Semaine → Jour';
      explanation = `Ton objectif "${goalName}" est à moyen terme (${diffMonths} mois). `;
    } else {
      breakdown = 'Mois → Semaine → Jour';
      explanation = `Ton objectif "${goalName}" est à court terme (${diffMonths} mois). `;
    }

    // Ajouter une analyse personnalisée selon le type et les données
    if (goalType === 'financial' && targetAmount) {
      const dailyTarget = targetAmount / diffDays;
      explanation += `Pour atteindre ${targetAmount.toLocaleString()}€ en ${diffDays} jours, tu dois générer environ ${dailyTarget.toFixed(2)}€ par jour. `;

      if (competency && competency.toLowerCase().includes('débutant')) {
        explanation += `Comme tu débutes, j'ai prévu une phase d'apprentissage initiale pour acquérir les compétences nécessaires. `;
      }

      explanation += `Je vais découper ton objectif en étapes progressives pour que tu puisses suivre ton chiffre d'affaires et ajuster ta stratégie.`;
    } else if (goalType === 'personal') {
      if (competency) {
        explanation += `Avec ton niveau actuel (${competency}), j'ai adapté le rythme des tâches. `;
      }
      explanation += `Je vais créer un plan progressif qui respecte ton énergie et tes contraintes.`;
    }

    return { breakdown, explanation };
  };

  const timeframe = getTimeframeExplanation();

  // Calculer l'objectif journalier pour les objectifs financiers
  const getDailyFinancialTarget = () => {
    if (goalType !== 'financial' || !targetAmount) return null;

    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = Math.abs(deadlineDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      dailyRevenue: targetAmount / diffDays,
      totalDays: diffDays,
      totalAmount: targetAmount
    };
  };

  const financialTarget = getDailyFinancialTarget();

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        value="analysis"
        className={`rounded-xl overflow-hidden border-2 ${theme === 'dark' ? 'bg-stone-900 border-violet-900' : 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200'}`}
      >
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Analyse personnalisée de ton objectif</h4>
              <p className={`text-xs ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                Plan d'action adapté à ton projet
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4">
            {/* Découpage temporel */}
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-stone-800' : 'bg-white'}`}>
              <div className="flex items-start gap-2 mb-2">
                <Calendar className="w-4 h-4 text-violet-500 mt-0.5" />
                <h5 className="font-semibold text-xs text-violet-600 dark:text-violet-400">Découpage temporel</h5>
              </div>
              <div className={`text-xs mb-2 font-medium ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
                {timeframe.breakdown}
              </div>
              <p className={`text-xs ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                {timeframe.explanation}
              </p>
            </div>

            {/* Objectif financier journalier */}
            {financialTarget && (
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'}`}>
                <div className="flex items-start gap-2 mb-2">
                  <Target className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
                  <h5 className="font-semibold text-xs text-green-600 dark:text-green-400">Objectif journalier</h5>
                </div>
                <div className="space-y-2">
                  <div className={`text-lg font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    {financialTarget.dailyRevenue.toFixed(2)}€ / jour
                  </div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                    Pour atteindre {financialTarget.totalAmount.toLocaleString()}€ en {financialTarget.totalDays} jours,
                    tu dois générer environ {financialTarget.dailyRevenue.toFixed(2)}€ par jour.
                  </p>
                  {competency && (
                    <p className={`text-xs italic ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                      💡 Niveau actuel : {competency}. J'ai adapté le plan en conséquence.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Les 3 phases */}
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-stone-800' : 'bg-white'}`}>
              <div className="flex items-start gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-violet-500 mt-0.5" />
                <h5 className="font-semibold text-xs text-violet-600 dark:text-violet-400">Les 3 phases de réussite</h5>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-lg">🚀</span>
                  <div>
                    <p className="text-xs font-semibold text-green-600 dark:text-green-400">Lancement</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                      Poser les bases, comprendre les fondamentaux, créer les premières habitudes
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">⚡</span>
                  <div>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Optimisation</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                      Affiner ta méthode, corriger ce qui ne fonctionne pas, renforcer tes points forts
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">📈</span>
                  <div>
                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">Scale</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                      Accélérer le rythme, amplifier les résultats, atteindre et dépasser ton objectif
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Méthode de priorisation */}
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-stone-800' : 'bg-white'}`}>
              <div className="flex items-start gap-2 mb-2">
                <Target className="w-4 h-4 text-violet-500 mt-0.5" />
                <h5 className="font-semibold text-xs text-violet-600 dark:text-violet-400">Priorisation des tâches</h5>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
                    <span className="font-semibold">Haute priorité</span> : Actions critiques pour avancer
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-300"></div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
                    <span className="font-semibold">Moyenne priorité</span> : Actions importantes mais flexibles
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-stone-300"></div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
                    <span className="font-semibold">Basse priorité</span> : Actions bonus pour aller plus loin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

