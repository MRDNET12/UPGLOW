'use client';

import { ArrowLeft, Target, Calendar, TrendingUp, Sparkles, Lightbulb, FileText, CheckSquare, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';

interface Goal {
  id: string;
  name: string;
  type: 'financial' | 'personal' | 'project';
  description: string;
  deadline: string;
  progress: number;
  createdAt: string;
  why?: string;
  desiredFeeling?: string;
  targetAmount?: number;
  competency?: string;
}

interface GoalDetailsPageProps {
  goal: Goal | null;
  onBack: () => void;
  theme?: 'light' | 'dark';
  language?: 'fr' | 'en' | 'es';
}

const translations = {
  fr: {
    back: 'Retour',
    progress: 'Progression',
    deadline: 'Échéance',
    gloweePlan: 'Plan de Glowee',
    planExplanation: 'Découpage intelligent de ton objectif',
    yourInputs: 'Tes réponses initiales',
    inputsDescription: 'Ce que tu as saisi lors de la création',
    quickActions: 'Actions rapides',
    updateProgress: 'Mettre à jour la progression',
    addNote: 'Ajouter une note',
    viewPlanning: 'Voir dans le planning',
    planTitle: 'Comment Glowee découpe ton objectif',
    planDescription: 'Glowee analyse ton objectif et le découpe automatiquement en étapes réalisables',
    yearToDay: 'Année → Trimestre → Mois → Semaine → Jour',
    monthToDay: 'Mois → Semaine → Jour',
    phases: 'Les 3 phases',
    launch: 'Lancement',
    launchDesc: 'Poser les bases et démarrer',
    optimization: 'Optimisation',
    optimizationDesc: 'Affiner et améliorer',
    scale: 'Scale',
    scaleDesc: 'Accélérer et amplifier',
    why: 'Pourquoi cet objectif',
    feeling: 'Ressenti recherché',
    description: 'Description',
    competencyLevel: 'Niveau de compétence',
    targetAmount: 'Montant cible',
    createdOn: 'Créé le'
  },
  en: {
    back: 'Back',
    progress: 'Progress',
    deadline: 'Deadline',
    gloweePlan: 'Glowee\'s Plan',
    planExplanation: 'Smart breakdown of your goal',
    yourInputs: 'Your Initial Answers',
    inputsDescription: 'What you entered during creation',
    quickActions: 'Quick Actions',
    updateProgress: 'Update progress',
    addNote: 'Add a note',
    viewPlanning: 'View in planning',
    planTitle: 'How Glowee breaks down your goal',
    planDescription: 'Glowee analyzes your goal and automatically breaks it down into achievable steps',
    yearToDay: 'Year → Quarter → Month → Week → Day',
    monthToDay: 'Month → Week → Day',
    phases: 'The 3 Phases',
    launch: 'Launch',
    launchDesc: 'Lay the foundation and start',
    optimization: 'Optimization',
    optimizationDesc: 'Refine and improve',
    scale: 'Scale',
    scaleDesc: 'Accelerate and amplify',
    why: 'Why this goal',
    feeling: 'Desired feeling',
    description: 'Description',
    competencyLevel: 'Competency level',
    targetAmount: 'Target amount',
    createdOn: 'Created on'
  },
  es: {
    back: 'Volver',
    progress: 'Progreso',
    deadline: 'Fecha límite',
    gloweePlan: 'Plan de Glowee',
    planExplanation: 'Desglose inteligente de tu objetivo',
    yourInputs: 'Tus Respuestas Iniciales',
    inputsDescription: 'Lo que ingresaste durante la creación',
    quickActions: 'Acciones rápidas',
    updateProgress: 'Actualizar progreso',
    addNote: 'Agregar nota',
    viewPlanning: 'Ver en planificación',
    planTitle: 'Cómo Glowee desglosa tu objetivo',
    planDescription: 'Glowee analiza tu objetivo y lo desglosa automáticamente en pasos alcanzables',
    yearToDay: 'Año → Trimestre → Mes → Semana → Día',
    monthToDay: 'Mes → Semana → Día',
    phases: 'Las 3 Fases',
    launch: 'Lanzamiento',
    launchDesc: 'Sentar las bases y comenzar',
    optimization: 'Optimización',
    optimizationDesc: 'Refinar y mejorar',
    scale: 'Escala',
    scaleDesc: 'Acelerar y amplificar',
    why: 'Por qué este objetivo',
    feeling: 'Sentimiento deseado',
    description: 'Descripción',
    competencyLevel: 'Nivel de competencia',
    targetAmount: 'Monto objetivo',
    createdOn: 'Creado el'
  }
};

export function GoalDetailsPage({ goal, onBack, theme = 'light', language = 'fr' }: GoalDetailsPageProps) {
  const t = translations[language];

  if (!goal) return null;

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'financial': return '💰';
      case 'project': return '📚';
      case 'personal': return '💖';
      default: return '🎯';
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-navy-900 text-stone-100' : 'bg-cream-100 text-navy-900'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 ${theme === 'dark' ? 'bg-navy-800 border-navy-700' : 'bg-white border-stone-200'} border-b shadow-soft`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full hover:bg-peach-100"
            >
              <ArrowLeft className="w-5 h-5 text-navy-900" />
            </Button>
            <div className="flex items-center gap-3 flex-1">
              <span className="text-3xl">{getGoalIcon(goal.type)}</span>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-navy-900">{goal.name}</h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'} capitalize`}>
                  {goal.type}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Progress Overview */}
        <div className={`p-6 rounded-3xl ${theme === 'dark' ? 'bg-navy-800' : 'bg-white'} shadow-soft-lg`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-peach-400 to-soft-orange-400 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-navy-900">{t.progress}</span>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-peach-500 to-soft-orange-500 bg-clip-text text-transparent">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-3" />
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-soft-purple-100 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-soft-purple-500" />
              </div>
              <span className={theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}>
                {t.deadline}: {new Date(goal.deadline).toLocaleDateString(language)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`p-5 rounded-3xl ${theme === 'dark' ? 'bg-navy-800' : 'bg-gradient-to-br from-peach-100 to-soft-orange-100'} shadow-soft-lg`}>
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-navy-900">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-soft-orange-400 to-peach-400 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            {t.quickActions}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="outline" className="w-full justify-start gap-2 bg-white border-stone-200 hover:bg-peach-50 hover:border-peach-300 rounded-xl">
              <CheckSquare className="w-4 h-4 text-peach-500" />
              <span className="text-navy-900">{t.updateProgress}</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-white border-stone-200 hover:bg-peach-50 hover:border-peach-300 rounded-xl">
              <FileText className="w-4 h-4 text-soft-purple-500" />
              <span className="text-navy-900">{t.addNote}</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-white border-stone-200 hover:bg-peach-50 hover:border-peach-300 rounded-xl">
              <Calendar className="w-4 h-4 text-soft-orange-500" />
              <span className="text-navy-900">{t.viewPlanning}</span>
            </Button>
          </div>
        </div>

        {/* Accordion Sections */}
        <Accordion type="multiple" className="space-y-4">
          {/* Glowee's Plan Section */}
          <AccordionItem
            value="glowee-plan"
            className={`rounded-3xl overflow-hidden border-2 ${theme === 'dark' ? 'bg-navy-800 border-soft-purple-400' : 'bg-white border-soft-purple-200'} shadow-soft-lg`}
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3 text-left">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-soft-purple-400 to-soft-purple-500 flex items-center justify-center shadow-soft">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-navy-900">{t.gloweePlan}</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                    {t.planExplanation}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-6">
                {/* Plan Explanation */}
                <div className={`p-5 rounded-2xl ${theme === 'dark' ? 'bg-navy-900' : 'bg-gradient-to-br from-soft-purple-100 to-soft-purple-200'} shadow-soft`}>
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-navy-900">
                    <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-soft-purple-500" />
                    </div>
                    {t.planTitle}
                  </h4>
                  <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
                    {t.planDescription}
                  </p>

                  {/* Breakdown Levels */}
                  <div className="space-y-3">
                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-navy-800' : 'bg-white'} shadow-soft`}>
                      <div className="flex items-center gap-2 text-sm font-medium text-navy-900">
                        <span className="text-2xl">📅</span>
                        <span>{t.yearToDay}</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-navy-800' : 'bg-white'} shadow-soft`}>
                      <div className="flex items-center gap-2 text-sm font-medium text-navy-900">
                        <span className="text-2xl">📆</span>
                        <span>{t.monthToDay}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3 Phases */}
                <div>
                  <h4 className="font-semibold mb-3 text-navy-900">{t.phases}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-navy-900' : 'bg-gradient-to-br from-peach-100 to-peach-200'} border-2 ${theme === 'dark' ? 'border-peach-400' : 'border-peach-300'} shadow-soft`}>
                      <div className="text-3xl mb-2">🚀</div>
                      <h5 className="font-semibold text-peach-600 mb-1">{t.launch}</h5>
                      <p className={`text-xs ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                        {t.launchDesc}
                      </p>
                    </div>
                    <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-navy-900' : 'bg-gradient-to-br from-soft-purple-100 to-soft-purple-200'} border-2 ${theme === 'dark' ? 'border-soft-purple-400' : 'border-soft-purple-300'} shadow-soft`}>
                      <div className="text-3xl mb-2">⚡</div>
                      <h5 className="font-semibold text-soft-purple-600 mb-1">{t.optimization}</h5>
                      <p className={`text-xs ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                        {t.optimizationDesc}
                      </p>
                    </div>
                    <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-navy-900' : 'bg-gradient-to-br from-soft-orange-100 to-soft-orange-200'} border-2 ${theme === 'dark' ? 'border-soft-orange-400' : 'border-soft-orange-300'} shadow-soft`}>
                      <div className="text-3xl mb-2">📈</div>
                      <h5 className="font-semibold text-soft-orange-600 mb-1">{t.scale}</h5>
                      <p className={`text-xs ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                        {t.scaleDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Your Initial Inputs Section */}
          <AccordionItem
            value="initial-inputs"
            className={`rounded-3xl overflow-hidden border-2 ${theme === 'dark' ? 'bg-navy-800 border-peach-400' : 'bg-white border-peach-200'} shadow-soft-lg`}
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3 text-left">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-peach-400 to-soft-orange-400 flex items-center justify-center shadow-soft">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-navy-900">{t.yourInputs}</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                    {t.inputsDescription}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4">
                {goal.description && (
                  <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-navy-900' : 'bg-gradient-to-br from-peach-100 to-peach-200'} shadow-soft`}>
                    <h4 className="font-semibold mb-2 text-sm text-peach-600">{t.description}</h4>
                    <p className={`text-sm ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
                      {goal.description}
                    </p>
                  </div>
                )}

                {goal.why && (
                  <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-navy-900' : 'bg-gradient-to-br from-peach-100 to-peach-200'} shadow-soft`}>
                    <h4 className="font-semibold mb-2 text-sm text-peach-600">{t.why}</h4>
                    <p className={`text-sm ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
                      {goal.why}
                    </p>
                  </div>
                )}

                {goal.desiredFeeling && (
                  <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-navy-900' : 'bg-gradient-to-br from-peach-100 to-peach-200'} shadow-soft`}>
                    <h4 className="font-semibold mb-2 text-sm text-peach-600">{t.feeling}</h4>
                    <p className={`text-sm ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
                      {goal.desiredFeeling}
                    </p>
                  </div>
                )}

                {goal.targetAmount && (
                  <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-navy-900' : 'bg-gradient-to-br from-peach-100 to-peach-200'} shadow-soft`}>
                    <h4 className="font-semibold mb-2 text-sm text-peach-600">{t.targetAmount}</h4>
                    <p className={`text-sm font-bold ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
                      {goal.targetAmount.toLocaleString(language)} €
                    </p>
                  </div>
                )}

                {goal.competency && (
                  <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-navy-900' : 'bg-gradient-to-br from-peach-100 to-peach-200'} shadow-soft`}>
                    <h4 className="font-semibold mb-2 text-sm text-peach-600">{t.competencyLevel}</h4>
                    <p className={`text-sm ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
                      {goal.competency}
                    </p>
                  </div>
                )}

                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-navy-900' : 'bg-gradient-to-br from-peach-100 to-peach-200'} shadow-soft`}>
                  <h4 className="font-semibold mb-2 text-sm text-peach-600">{t.createdOn}</h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
                    {new Date(goal.createdAt).toLocaleDateString(language, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

