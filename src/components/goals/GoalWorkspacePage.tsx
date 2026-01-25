'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Target, Calendar, TrendingUp, CheckCircle2, Circle, Clock, Play, History, Sparkles, Lock, Plus, Heart, Copy, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { DeleteGoalDialog } from '@/components/goals/DeleteGoalDialog';
import { deleteGoalWithTasks } from '@/lib/firebase/goals-service';
import { useAuth } from '@/contexts/AuthContext';

interface GoalAction {
  id: string;
  text: string;
  status: 'to_plan' | 'planned' | 'completed';
  plannedDate?: string;
  completedDate?: string;
  period?: string;
  estimatedDuration?: number; // en minutes
}

interface Goal {
  id: string;
  name: string;
  type: 'financial' | 'personal' | 'project';
  description?: string;
  deadline: string;
  progress: number;
  createdAt: string;
  why?: string;
  desiredFeeling?: string;
  targetAmount?: number;
  timeframe?: number; // en mois: 1, 3, 6, 12
  rhythm?: 'doux' | 'equilibre' | 'intense'; // 1, 1-2, ou 3 actions/jour
  actions?: GoalAction[];
  color?: string;
}

interface GoalWorkspacePageProps {
  goal: Goal | null;
  onBack: () => void;
  onNavigateToPlanning?: () => void;
  onUpdateGoal?: (goal: Goal) => void;
  onGoalDeleted?: () => void;
  theme?: 'light' | 'dark';
  language?: 'fr' | 'en' | 'es';
}

// Traductions complètes avec micro-copy bienveillante
const translations = {
  fr: {
    back: 'Retour',
    overview: 'Vue d\'ensemble',
    planSteps: 'Plan & actions',
    today: 'Aujourd\'hui',
    tracking: 'Suivi',
    help: 'Déblocage',
    why: 'Pourquoi cet objectif ?',
    duration: 'Durée',
    rhythm: 'Rythme',
    progress: 'Progression',
    // Messages motivationnels bienveillants
    motivationMessage: 'Tu avances à ton rythme. Chaque petit pas compte.',
    planningIsProgress: 'Planifier, c\'est déjà avancer.',
    actionBetterThanIntention: 'Une action planifiée vaut mieux qu\'une intention.',
    youProgressAtYourPace: 'Tu avances à ton rythme.',
    evenSlowlyYouProgress: 'Tu avances. Même lentement.',
    // Statuts
    toPlan: '🟡 À planifier',
    planned: '🔵 Planifiée',
    completed: '✅ Réalisée',
    // Actions
    planInGlowee: '📅 Planifier dans Glowee tâches',
    addAction: '+ Ajouter une action',
    todayActions: 'Actions prévues aujourd\'hui',
    noActionsToday: 'Aucune action prévue aujourd\'hui',
    iMadeProgress: '✔️ J\'ai avancé aujourd\'hui',
    completedActions: 'Actions réalisées',
    weeksCompleted: 'Semaines complétées',
    actionsPlanned: 'Actions planifiées',
    actionsCompleted: 'Actions réalisées',
    noHistory: 'Aucun historique pour le moment',
    // Pause
    goalPaused: 'Objectif en pause',
    planActionToProgress: 'Pour avancer, planifie au moins une action.',
    // Durées
    month: 'mois',
    months: 'mois',
    year: 'an',
    // Rythmes
    rhythmDoux: '🔋 Doux',
    rhythmEquilibre: '⚖️ Équilibré',
    rhythmIntense: '🔥 Intense',
    rhythmDouxDesc: '1 action / jour',
    rhythmEquilibreDesc: '1 à 2 actions / jour',
    rhythmIntensetDesc: 'jusqu\'à 3 actions / jour',
    // Aide ChatGPT
    helpTitle: 'Parfois, on bloque. Et c\'est normal.',
    helpSubtitle: 'Utilise ces prompts pour t\'aider avec ChatGPT',
    clarifyGoal: '💬 M\'aider à clarifier mon objectif',
    getBreakdown: '🧠 Demander un découpage',
    findActions: '✍️ Trouver des idées d\'actions',
    unblock: '❤️ M\'aider à débloquer',
    copyPrompt: 'Copier le prompt',
    promptCopied: 'Copié !',
    openChatGPT: 'Ouvrir ChatGPT',
    // Création d'action
    actionPlaceholder: 'Ex: 30 min de travail sur X',
    actionRules: 'Action claire • Faisable en -60 min • Mesurable',
    actionExamples: 'Exemples : "1 appel", "Préparer un document", "1 séance de sport"',
    // Découpage temporel
    temporalBreakdown: 'Découpage temporel',
    period: 'Période',
    maxActions: 'Actions max',
    currentActions: 'Actions actuelles',
    talkToGlowee: 'Parler à ChatGPT',
  },
  en: {
    back: 'Back',
    overview: 'Overview',
    planSteps: 'Plan & actions',
    today: 'Today',
    tracking: 'Tracking',
    help: 'Unblock',
    why: 'Why this goal?',
    duration: 'Duration',
    rhythm: 'Rhythm',
    progress: 'Progress',
    motivationMessage: 'You\'re progressing at your own pace. Every small step counts.',
    planningIsProgress: 'Planning is already progress.',
    actionBetterThanIntention: 'A planned action is better than an intention.',
    youProgressAtYourPace: 'You progress at your own pace.',
    evenSlowlyYouProgress: 'You\'re progressing. Even slowly.',
    toPlan: '🟡 To plan',
    planned: '🔵 Planned',
    completed: '✅ Completed',
    planInGlowee: '📅 Plan in Glowee tasks',
    addAction: '+ Add an action',
    todayActions: 'Today\'s planned actions',
    noActionsToday: 'No actions planned for today',
    iMadeProgress: '✔️ I made progress today',
    completedActions: 'Completed actions',
    weeksCompleted: 'Weeks completed',
    actionsPlanned: 'Actions planned',
    actionsCompleted: 'Actions completed',
    noHistory: 'No history yet',
    goalPaused: 'Goal paused',
    planActionToProgress: 'To progress, plan at least one action.',
    month: 'month',
    months: 'months',
    year: 'year',
    rhythmDoux: '🔋 Gentle',
    rhythmEquilibre: '⚖️ Balanced',
    rhythmIntense: '🔥 Intense',
    rhythmDouxDesc: '1 action / day',
    rhythmEquilibreDesc: '1 to 2 actions / day',
    rhythmIntensetDesc: 'up to 3 actions / day',
    helpTitle: 'Sometimes we get stuck. And that\'s normal.',
    helpSubtitle: 'Use these prompts to help you with ChatGPT',
    clarifyGoal: '💬 Help me clarify my goal',
    getBreakdown: '🧠 Get a breakdown',
    findActions: '✍️ Find action ideas',
    unblock: '❤️ Help me unblock',
    copyPrompt: 'Copy prompt',
    promptCopied: 'Copied!',
    openChatGPT: 'Open ChatGPT',
    actionPlaceholder: 'Ex: 30 min work on X',
    actionRules: 'Clear action • Doable in <60 min • Measurable',
    actionExamples: 'Examples: "1 call", "Prepare a document", "1 workout session"',
    temporalBreakdown: 'Temporal breakdown',
    period: 'Period',
    maxActions: 'Max actions',
    currentActions: 'Current actions',
    talkToGlowee: 'Talk to ChatGPT',
  },
  es: {
    back: 'Volver',
    overview: 'Vista general',
    planSteps: 'Plan y acciones',
    today: 'Hoy',
    tracking: 'Seguimiento',
    help: 'Desbloqueo',
    why: '¿Por qué este objetivo?',
    duration: 'Duración',
    rhythm: 'Ritmo',
    progress: 'Progreso',
    motivationMessage: 'Avanzas a tu ritmo. Cada pequeño paso cuenta.',
    planningIsProgress: 'Planificar ya es avanzar.',
    actionBetterThanIntention: 'Una acción planificada vale más que una intención.',
    youProgressAtYourPace: 'Avanzas a tu ritmo.',
    evenSlowlyYouProgress: 'Avanzas. Incluso lentamente.',
    toPlan: '🟡 Por planificar',
    planned: '🔵 Planificada',
    completed: '✅ Realizada',
    planInGlowee: '📅 Planificar en Glowee tareas',
    addAction: '+ Añadir una acción',
    todayActions: 'Acciones previstas hoy',
    noActionsToday: 'Sin acciones previstas hoy',
    iMadeProgress: '✔️ Avancé hoy',
    completedActions: 'Acciones realizadas',
    weeksCompleted: 'Semanas completadas',
    actionsPlanned: 'Acciones planificadas',
    actionsCompleted: 'Acciones realizadas',
    noHistory: 'Sin historial por ahora',
    goalPaused: 'Objetivo en pausa',
    planActionToProgress: 'Para avanzar, planifica al menos una acción.',
    month: 'mes',
    months: 'meses',
    year: 'año',
    rhythmDoux: '🔋 Suave',
    rhythmEquilibre: '⚖️ Equilibrado',
    rhythmIntense: '🔥 Intenso',
    rhythmDouxDesc: '1 acción / día',
    rhythmEquilibreDesc: '1 a 2 acciones / día',
    rhythmIntensetDesc: 'hasta 3 acciones / día',
    helpTitle: 'A veces nos bloqueamos. Y es normal.',
    helpSubtitle: 'Usa estos prompts para ayudarte con ChatGPT',
    clarifyGoal: '💬 Ayúdame a clarificar mi objetivo',
    getBreakdown: '🧠 Pedir un desglose',
    findActions: '✍️ Encontrar ideas de acciones',
    unblock: '❤️ Ayúdame a desbloquear',
    copyPrompt: 'Copiar prompt',
    promptCopied: '¡Copiado!',
    openChatGPT: 'Abrir ChatGPT',
    actionPlaceholder: 'Ej: 30 min de trabajo en X',
    actionRules: 'Acción clara • Factible en <60 min • Medible',
    actionExamples: 'Ejemplos: "1 llamada", "Preparar un documento", "1 sesión de deporte"',
    temporalBreakdown: 'Desglose temporal',
    period: 'Período',
    maxActions: 'Acciones máx',
    currentActions: 'Acciones actuales',
    talkToGlowee: 'Hablar con ChatGPT',
  }
};

type TabType = 'overview' | 'plan' | 'today' | 'tracking' | 'help';

// Prompts ChatGPT pré-rédigés
const getChatGPTPrompts = (goal: Goal, language: string) => ({
  clarify: language === 'fr'
    ? `J'ai un objectif mais il est flou.
Aide-moi à le rendre clair, réaliste et atteignable.

Mon objectif :
${goal.name}

${goal.why ? `Pourquoi : ${goal.why}` : ''}

Mon contexte :
- Temps disponible : ${goal.timeframe ? `${goal.timeframe} mois` : 'Non défini'}
- Niveau d'énergie : ${goal.rhythm || 'Non défini'}

Pose-moi des questions si nécessaire.`
    : language === 'en'
    ? `I have a goal but it's unclear.
Help me make it clear, realistic and achievable.

My goal:
${goal.name}

${goal.why ? `Why: ${goal.why}` : ''}

My context:
- Available time: ${goal.timeframe ? `${goal.timeframe} months` : 'Not defined'}
- Energy level: ${goal.rhythm || 'Not defined'}

Ask me questions if needed.`
    : `Tengo un objetivo pero es confuso.
Ayúdame a hacerlo claro, realista y alcanzable.

Mi objetivo:
${goal.name}

${goal.why ? `Por qué: ${goal.why}` : ''}

Mi contexto:
- Tiempo disponible: ${goal.timeframe ? `${goal.timeframe} meses` : 'No definido'}
- Nivel de energía: ${goal.rhythm || 'No definido'}

Hazme preguntas si es necesario.`,

  breakdown: language === 'fr'
    ? `Aide-moi à découper cet objectif en actions simples.

Objectif :
${goal.name}

Durée :
${goal.timeframe ? `${goal.timeframe} mois` : '3 mois'}

Je veux :
- Des actions réalistes
- Peu de tâches par jour (max ${goal.rhythm === 'intense' ? '3' : goal.rhythm === 'equilibre' ? '2' : '1'})
- Un plan que je peux suivre sans stress`
    : language === 'en'
    ? `Help me break down this goal into simple actions.

Goal:
${goal.name}

Duration:
${goal.timeframe ? `${goal.timeframe} months` : '3 months'}

I want:
- Realistic actions
- Few tasks per day (max ${goal.rhythm === 'intense' ? '3' : goal.rhythm === 'equilibre' ? '2' : '1'})
- A plan I can follow without stress`
    : `Ayúdame a desglosar este objetivo en acciones simples.

Objetivo:
${goal.name}

Duración:
${goal.timeframe ? `${goal.timeframe} meses` : '3 meses'}

Quiero:
- Acciones realistas
- Pocas tareas por día (máx ${goal.rhythm === 'intense' ? '3' : goal.rhythm === 'equilibre' ? '2' : '1'})
- Un plan que pueda seguir sin estrés`,

  actions: language === 'fr'
    ? `Je bloque pour trouver des actions concrètes.

Objectif :
${goal.name}

${goal.why ? `Pourquoi : ${goal.why}` : ''}

Donne-moi 5 idées d'actions simples et faisables dès aujourd'hui.
Chaque action doit être :
- Claire et précise
- Faisable en moins de 60 minutes
- Mesurable`
    : language === 'en'
    ? `I'm stuck finding concrete actions.

Goal:
${goal.name}

${goal.why ? `Why: ${goal.why}` : ''}

Give me 5 simple action ideas I can do today.
Each action must be:
- Clear and precise
- Doable in less than 60 minutes
- Measurable`
    : `Estoy bloqueado para encontrar acciones concretas.

Objetivo:
${goal.name}

${goal.why ? `Por qué: ${goal.why}` : ''}

Dame 5 ideas de acciones simples que pueda hacer hoy.
Cada acción debe ser:
- Clara y precisa
- Factible en menos de 60 minutos
- Medible`,

  unblock: language === 'fr'
    ? `Je suis bloqué et je n'avance plus.

Voici mon objectif :
${goal.name}

${goal.why ? `Pourquoi c'est important : ${goal.why}` : ''}

Aide-moi à comprendre ce qui se passe et propose une action très simple pour aujourd'hui.
Sois bienveillant et sans jugement.`
    : language === 'en'
    ? `I'm stuck and not making progress.

Here's my goal:
${goal.name}

${goal.why ? `Why it's important: ${goal.why}` : ''}

Help me understand what's happening and suggest a very simple action for today.
Be kind and non-judgmental.`
    : `Estoy bloqueado y no avanzo.

Aquí está mi objetivo:
${goal.name}

${goal.why ? `Por qué es importante: ${goal.why}` : ''}

Ayúdame a entender qué está pasando y sugiere una acción muy simple para hoy.
Sé amable y sin juzgar.`
});

export function GoalWorkspacePage({ goal, onBack, onNavigateToPlanning, onUpdateGoal: _onUpdateGoal, onGoalDeleted, theme = 'light', language = 'fr' }: GoalWorkspacePageProps) {
  const { user } = useAuth();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [actions, setActions] = useState<GoalAction[]>(goal?.actions || []);
  const [todayTasks, setTodayTasks] = useState<Array<{id: string; text: string; completed: boolean; goalId?: string}>>([]);
  const [newActionText, setNewActionText] = useState('');
  const [showAddAction, setShowAddAction] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Unused for now but kept for future enhancement
  void _onUpdateGoal;

  if (!goal) return null;

  const prompts = getChatGPTPrompts(goal, language);

  // Copier un prompt dans le presse-papier
  const copyPrompt = async (promptKey: string, promptText: string) => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedPrompt(promptKey);
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Ouvrir ChatGPT
  const openChatGPT = () => {
    window.open('https://chat.openai.com', '_blank');
  };

  // Supprimer l'objectif
  const handleDeleteConfirm = async (reason: 'achieved' | 'difficult' | 'hard_to_follow' | 'incoherent' | 'other_goal') => {
    if (!goal) return;

    setIsDeleting(true);
    try {
      // Supprimer dans Firebase si l'utilisateur est connecté
      if (user) {
        await deleteGoalWithTasks(goal.id, { reason });
      }

      // Supprimer du localStorage
      const savedGoals = localStorage.getItem('myGoals');
      if (savedGoals) {
        const goals = JSON.parse(savedGoals);
        const updatedGoals = goals.filter((g: any) => g.id !== goal.id);
        localStorage.setItem('myGoals', JSON.stringify(updatedGoals));
      }

      // Supprimer les tâches liées dans gloweeWeeklyTasks
      const storedTasks = localStorage.getItem('gloweeWeeklyTasks');
      if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        const filteredTasks = tasks.filter((task: any) => task.goalId !== goal.id);
        localStorage.setItem('gloweeWeeklyTasks', JSON.stringify(filteredTasks));
      }

      console.log(`Goal ${goal.id} deleted with reason: ${reason}`);

      // Retourner à la liste et notifier le parent
      if (onGoalDeleted) {
        onGoalDeleted();
      }
      onBack();
    } catch (error) {
      console.error('Error deleting goal:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Charger les tâches d'aujourd'hui liées à cet objectif depuis Glowee tâches
  useEffect(() => {
    const loadTodayTasks = () => {
      try {
        const storedTasks = localStorage.getItem('gloweeWeeklyTasks');
        if (storedTasks) {
          const allTasks = JSON.parse(storedTasks);
          const today = new Date().toISOString().split('T')[0];
          const tasksForToday: Array<{id: string; text: string; completed: boolean; goalId?: string}> = [];

          Object.values(allTasks).forEach((dayTasks: any) => {
            if (Array.isArray(dayTasks)) {
              dayTasks.forEach((task: any) => {
                if (task.goalId === goal.id && task.date === today) {
                  tasksForToday.push({
                    id: task.id,
                    text: task.text || task.task,
                    completed: task.completed || false,
                    goalId: task.goalId
                  });
                }
              });
            }
          });
          setTodayTasks(tasksForToday);
        }
      } catch (error) {
        console.error('Error loading today tasks:', error);
      }
    };

    loadTodayTasks();
    window.addEventListener('storage', loadTodayTasks);
    return () => window.removeEventListener('storage', loadTodayTasks);
  }, [goal.id]);

  // Vérifier si l'objectif est en pause (aucune action planifiée)
  const hasPlannedActions = actions.some(a => a.status === 'planned') || todayTasks.length > 0;
  const isPaused = !hasPlannedActions && goal.progress < 100;

  // Calculer la progression
  const completedActionsCount = actions.filter(a => a.status === 'completed').length;
  const plannedActionsCount = actions.filter(a => a.status === 'planned').length;
  const totalActions = actions.length;
  const progressPercentage = totalActions > 0 ? Math.round((completedActionsCount / totalActions) * 100) : goal.progress || 0;

  // Formater la durée
  const formatDuration = () => {
    if (goal.timeframe) {
      if (goal.timeframe >= 12) {
        return `${Math.floor(goal.timeframe / 12)} ${t.year}`;
      }
      return `${goal.timeframe} ${goal.timeframe > 1 ? t.months : t.month}`;
    }
    return '-';
  };

  // Formater le rythme
  const formatRhythm = () => {
    switch (goal.rhythm) {
      case 'doux': return t.rhythmDoux;
      case 'equilibre': return t.rhythmEquilibre;
      case 'intense': return t.rhythmIntense;
      default: return '-';
    }
  };

  // Ajouter une nouvelle action
  const addAction = () => {
    if (!newActionText.trim()) return;

    const newAction: GoalAction = {
      id: `action_${Date.now()}`,
      text: newActionText.trim(),
      status: 'to_plan',
    };

    const updatedActions = [...actions, newAction];
    setActions(updatedActions);
    setNewActionText('');
    setShowAddAction(false);

    // Sauvegarder
    const savedGoals = localStorage.getItem('myGoals');
    if (savedGoals) {
      const goals = JSON.parse(savedGoals);
      const updatedGoals = goals.map((g: Goal) =>
        g.id === goal.id ? { ...g, actions: updatedActions } : g
      );
      localStorage.setItem('myGoals', JSON.stringify(updatedGoals));
    }
  };

  // Marquer une action comme complétée
  const markActionCompleted = (actionId: string) => {
    const updatedActions = actions.map(action =>
      action.id === actionId
        ? { ...action, status: 'completed' as const, completedDate: new Date().toISOString() }
        : action
    );
    setActions(updatedActions);

    // Sauvegarder dans localStorage
    const savedGoals = localStorage.getItem('myGoals');
    if (savedGoals) {
      const goals = JSON.parse(savedGoals);
      const updatedGoals = goals.map((g: Goal) =>
        g.id === goal.id ? { ...g, actions: updatedActions } : g
      );
      localStorage.setItem('myGoals', JSON.stringify(updatedGoals));
    }
  };

  // Calculer les semaines complétées
  const getWeeksCompleted = () => {
    const createdDate = new Date(goal.createdAt);
    const today = new Date();
    const weeksElapsed = Math.floor((today.getTime() - createdDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return Math.max(0, weeksElapsed);
  };

  // Calculer le max actions par jour selon le rythme
  const getMaxActionsPerDay = () => {
    const rhythm = goal.rhythm || 'equilibre';
    return rhythm === 'doux' ? 1 : rhythm === 'equilibre' ? 2 : 3;
  };

  // Calculer le découpage temporel basé sur la durée
  // Règles fixées (pas d'IA) :
  // - 1 mois : Mois → Semaine → Jour
  // - 3 mois : Mois → Semaine → Jour
  // - 6 mois : Mois → Semaine → Jour
  // - 1 an : Trimestre → Mois → Semaine → Jour
  const getTemporalBreakdown = () => {
    const timeframe = goal.timeframe || 3;
    const maxPerDay = getMaxActionsPerDay();
    const maxPerWeek = maxPerDay * 7; // Estimation semaine

    if (timeframe === 1) {
      // 1 mois : 4 semaines
      return {
        structure: 'Mois → Semaine → Jour',
        periods: [
          { name: 'Semaine 1', maxActions: maxPerWeek },
          { name: 'Semaine 2', maxActions: maxPerWeek },
          { name: 'Semaine 3', maxActions: maxPerWeek },
          { name: 'Semaine 4', maxActions: maxPerWeek },
        ],
        totalWeeks: 4,
        maxPerPeriod: maxPerWeek
      };
    } else if (timeframe === 3) {
      // 3 mois : 12 semaines, affichées par mois
      return {
        structure: 'Mois → Semaine → Jour',
        periods: [
          { name: 'Mois 1', maxActions: maxPerWeek * 4, subPeriods: ['Sem 1-4'] },
          { name: 'Mois 2', maxActions: maxPerWeek * 4, subPeriods: ['Sem 5-8'] },
          { name: 'Mois 3', maxActions: maxPerWeek * 4, subPeriods: ['Sem 9-12'] },
        ],
        totalWeeks: 12,
        maxPerPeriod: maxPerWeek * 4
      };
    } else if (timeframe === 6) {
      // 6 mois : regroupés par 2 mois
      return {
        structure: 'Bimestre → Mois → Semaine → Jour',
        periods: [
          { name: 'Mois 1-2', maxActions: maxPerWeek * 8 },
          { name: 'Mois 3-4', maxActions: maxPerWeek * 8 },
          { name: 'Mois 5-6', maxActions: maxPerWeek * 8 },
        ],
        totalWeeks: 24,
        maxPerPeriod: maxPerWeek * 8
      };
    } else {
      // 1 an : par trimestre
      return {
        structure: 'Trimestre → Mois → Semaine → Jour',
        periods: [
          { name: 'Trimestre 1', maxActions: maxPerWeek * 12 },
          { name: 'Trimestre 2', maxActions: maxPerWeek * 12 },
          { name: 'Trimestre 3', maxActions: maxPerWeek * 12 },
          { name: 'Trimestre 4', maxActions: maxPerWeek * 12 },
        ],
        totalWeeks: 52,
        maxPerPeriod: maxPerWeek * 12
      };
    }
  };

  // Tabs data
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: t.overview, icon: <Target className="w-4 h-4" /> },
    { id: 'plan', label: t.planSteps, icon: <Calendar className="w-4 h-4" /> },
    { id: 'today', label: t.today, icon: <Play className="w-4 h-4" /> },
    { id: 'tracking', label: t.tracking, icon: <History className="w-4 h-4" /> },
    { id: 'help', label: t.help, icon: <Heart className="w-4 h-4" /> },
  ];

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Objectif en pause warning */}
            {isPaused && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-4 flex items-center gap-3">
                <Lock className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="font-medium text-amber-700 dark:text-amber-300">{t.goalPaused}</p>
                  <p className="text-sm text-amber-600 dark:text-amber-400">{t.planActionToProgress}</p>
                </div>
              </div>
            )}

            {/* Rappel de l'objectif */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-2">{goal.name}</h3>
              {goal.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm">{goal.description}</p>
              )}
            </div>

            {/* Pourquoi (si rempli) */}
            {goal.why && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-5">
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">{t.why}</p>
                <p className="text-gray-800 dark:text-gray-200">{goal.why}</p>
              </div>
            )}

            {/* Durée + Rythme + Couleur */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{t.duration}</span>
                </div>
                <p className="font-semibold text-sm">{formatDuration()}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{t.rhythm}</span>
                </div>
                <p className="font-semibold text-sm">{formatRhythm()}</p>
              </div>
              {goal.color && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: goal.color }}
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Couleur</span>
                  </div>
                  <p className="font-semibold text-sm">
                    {goal.color === '#f43f5e' ? '🌹 Rose' :
                     goal.color === '#3b82f6' ? '💙 Bleu' :
                     goal.color === '#10b981' ? '💚 Vert' : 'Personnalisé'}
                  </p>
                </div>
              )}
            </div>

            {/* Statistiques des actions */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-amber-600">{actions.filter(a => a.status === 'to_plan').length}</p>
                <p className="text-xs text-amber-700 dark:text-amber-400">{t.toPlan.replace('🟡 ', '')}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-blue-600">{plannedActionsCount}</p>
                <p className="text-xs text-blue-700 dark:text-blue-400">{t.planned.replace('🔵 ', '')}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-green-600">{completedActionsCount}</p>
                <p className="text-xs text-green-700 dark:text-green-400">{t.completed.replace('✅ ', '')}</p>
              </div>
            </div>

            {/* Progression actuelle */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.progress}</span>
                <span className="text-lg font-bold text-pink-500">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {completedActionsCount} / {totalActions} actions
              </p>
            </div>

            {/* Message motivationnel */}
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-2xl p-4 text-center">
              <p className="text-gray-700 dark:text-gray-300">{t.motivationMessage}</p>
            </div>
          </div>
        );

      case 'plan':
        return (
          <div className="space-y-6">
            {/* Actions par statut */}
            <div className="space-y-4">
              {/* À planifier */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Circle className="w-4 h-4 text-gray-400" />
                  {t.toPlan}
                </h4>
                <div className="space-y-2">
                  {actions.filter(a => a.status === 'to_plan').map(action => (
                    <div key={action.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <Circle className="w-5 h-5 text-gray-300" />
                      <span className="text-sm">{action.text}</span>
                    </div>
                  ))}
                  {actions.filter(a => a.status === 'to_plan').length === 0 && !showAddAction && (
                    <p className="text-sm text-gray-400 italic">{t.actionBetterThanIntention}</p>
                  )}

                  {/* Formulaire d'ajout d'action */}
                  {showAddAction ? (
                    <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl space-y-3">
                      <Input
                        value={newActionText}
                        onChange={(e) => setNewActionText(e.target.value)}
                        placeholder={t.actionPlaceholder}
                        className="bg-white dark:bg-gray-700"
                        onKeyDown={(e) => e.key === 'Enter' && addAction()}
                      />
                      <p className="text-xs text-gray-500">{t.actionRules}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowAddAction(false);
                            setNewActionText('');
                          }}
                        >
                          {t.back}
                        </Button>
                        <Button
                          size="sm"
                          onClick={addAction}
                          disabled={!newActionText.trim()}
                          className="bg-pink-500 hover:bg-pink-600 text-white"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          {language === 'fr' ? 'Ajouter' : language === 'en' ? 'Add' : 'Añadir'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddAction(true)}
                      className="w-full p-3 border-2 border-dashed border-pink-200 dark:border-pink-800 rounded-xl text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {t.addAction}
                    </button>
                  )}
                </div>
              </div>

              {/* Planifiées */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-blue-100 dark:border-blue-900">
                <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t.planned}
                </h4>
                <div className="space-y-2">
                  {actions.filter(a => a.status === 'planned').map(action => (
                    <div key={action.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => markActionCompleted(action.id)}
                          className="w-5 h-5 rounded-full border-2 border-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors flex items-center justify-center"
                          title={language === 'fr' ? 'Marquer comme fait' : language === 'en' ? 'Mark as done' : 'Marcar como hecho'}
                        >
                          <Check className="w-3 h-3 text-blue-400 opacity-0 hover:opacity-100" />
                        </button>
                        <span className="text-sm">{action.text}</span>
                      </div>
                      {action.plannedDate && (
                        <span className="text-xs text-blue-500">{new Date(action.plannedDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  ))}
                  {actions.filter(a => a.status === 'planned').length === 0 && (
                    <p className="text-sm text-gray-400 italic">{t.planningIsProgress}</p>
                  )}
                </div>
              </div>

              {/* Réalisées */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-green-100 dark:border-green-900">
                <h4 className="font-medium text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {t.completed}
                </h4>
                <div className="space-y-2">
                  {actions.filter(a => a.status === 'completed').map(action => (
                    <div key={action.id} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-sm line-through text-gray-500">{action.text}</span>
                    </div>
                  ))}
                  {actions.filter(a => a.status === 'completed').length === 0 && (
                    <p className="text-sm text-gray-400 italic">Aucune action réalisée</p>
                  )}
                </div>
              </div>
            </div>

            {/* Découpage temporel */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">{t.temporalBreakdown}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">{getTemporalBreakdown().structure}</p>
              <div className="space-y-2">
                {getTemporalBreakdown().periods.map((period, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm font-medium">{period.name}</span>
                    <span className="text-xs text-gray-500">max {period.maxActions} actions</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>Rythme : {goal.rhythm === 'doux' ? '🔋 Doux (1/jour)' : goal.rhythm === 'intense' ? '🔥 Intense (3/jour)' : '⚖️ Équilibré (2/jour)'}</span>
                  <span>{getTemporalBreakdown().totalWeeks} semaines</span>
                </div>
              </div>
            </div>

            {/* Bouton Planifier dans Glowee tâches */}
            <Button
              onClick={() => onNavigateToPlanning?.()}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl py-6"
            >
              {t.planInGlowee}
            </Button>

            {/* Message de réassurance */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 italic">
              {t.planningIsProgress}
            </p>
          </div>
        );

      case 'today':
        return (
          <div className="space-y-6">
            {/* Actions prévues aujourd'hui */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-pink-500" />
                {t.todayActions}
              </h3>

              {todayTasks.length > 0 ? (
                <div className="space-y-3">
                  {todayTasks.map(task => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                        task.completed
                          ? 'bg-green-50 dark:bg-green-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/50'
                      }`}
                    >
                      <button
                        onClick={() => {
                          // Toggle task completion in localStorage
                          const storedTasks = localStorage.getItem('gloweeWeeklyTasks');
                          if (storedTasks) {
                            const allTasks = JSON.parse(storedTasks);
                            Object.keys(allTasks).forEach(day => {
                              allTasks[day] = allTasks[day].map((t: any) =>
                                t.id === task.id ? { ...t, completed: !t.completed } : t
                              );
                            });
                            localStorage.setItem('gloweeWeeklyTasks', JSON.stringify(allTasks));
                            setTodayTasks(prev => prev.map(t =>
                              t.id === task.id ? { ...t, completed: !t.completed } : t
                            ));
                          }
                        }}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          task.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 dark:border-gray-500'
                        }`}
                      >
                        {task.completed && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">{t.noActionsToday}</p>
                  <Button
                    onClick={() => onNavigateToPlanning?.()}
                    className="mt-4 bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    {t.planInGlowee}
                  </Button>
                </div>
              )}
            </div>

            {/* Bouton J'ai avancé */}
            {todayTasks.length > 0 && (
              <Button
                onClick={() => {
                  // Marquer toutes les tâches d'aujourd'hui comme complétées
                  const storedTasks = localStorage.getItem('gloweeWeeklyTasks');
                  if (storedTasks) {
                    const allTasks = JSON.parse(storedTasks);
                    const today = new Date().toISOString().split('T')[0];
                    Object.keys(allTasks).forEach(day => {
                      allTasks[day] = allTasks[day].map((t: any) =>
                        t.goalId === goal.id && t.date === today ? { ...t, completed: true } : t
                      );
                    });
                    localStorage.setItem('gloweeWeeklyTasks', JSON.stringify(allTasks));
                    setTodayTasks(prev => prev.map(t => ({ ...t, completed: true })));
                  }
                }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl py-6 text-lg"
              >
                {t.iMadeProgress}
              </Button>
            )}
          </div>
        );

      case 'tracking':
        return (
          <div className="space-y-6">
            {/* Actions réalisées */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                {t.completedActions}
              </h3>
              <div className="space-y-2">
                {actions.filter(a => a.status === 'completed').map(action => (
                  <div key={action.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-sm">{action.text}</span>
                    </div>
                    {action.completedDate && (
                      <span className="text-xs text-green-600">{new Date(action.completedDate).toLocaleDateString()}</span>
                    )}
                  </div>
                ))}
                {actions.filter(a => a.status === 'completed').length === 0 && (
                  <p className="text-center py-4 text-gray-400">{t.noHistory}</p>
                )}
              </div>
            </div>

            {/* Semaines complétées */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold mb-4">{t.weeksCompleted}</h3>
              <div className="text-center">
                <span className="text-4xl font-bold text-pink-500">{getWeeksCompleted()}</span>
                <span className="text-gray-500 ml-2">{language === 'fr' ? 'semaines' : language === 'en' ? 'weeks' : 'semanas'}</span>
              </div>
            </div>

            {/* Progression visuelle */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">{t.progress}</span>
                <span className="text-2xl font-bold text-pink-500">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-4" />
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-6">
            {/* Message bienveillant */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-2xl p-5 text-center">
              <Heart className="w-10 h-10 mx-auto mb-3 text-rose-400" />
              <h3 className="font-semibold text-lg mb-2">{t.helpTitle}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.helpSubtitle}</p>
            </div>

            {/* Prompts ChatGPT */}
            <div className="space-y-3">
              {/* Clarifier */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => copyPrompt('clarify', prompts.clarify)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{t.clarifyGoal}</span>
                    {copiedPrompt === 'clarify' ? (
                      <span className="text-green-500 text-sm flex items-center gap-1">
                        <Check className="w-4 h-4" /> {t.promptCopied}
                      </span>
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>
              </div>

              {/* Découpage */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => copyPrompt('breakdown', prompts.breakdown)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{t.getBreakdown}</span>
                    {copiedPrompt === 'breakdown' ? (
                      <span className="text-green-500 text-sm flex items-center gap-1">
                        <Check className="w-4 h-4" /> {t.promptCopied}
                      </span>
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>
              </div>

              {/* Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => copyPrompt('actions', prompts.actions)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{t.findActions}</span>
                    {copiedPrompt === 'actions' ? (
                      <span className="text-green-500 text-sm flex items-center gap-1">
                        <Check className="w-4 h-4" /> {t.promptCopied}
                      </span>
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>
              </div>

              {/* Débloquer */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-rose-100 dark:border-rose-900">
                <button
                  onClick={() => copyPrompt('unblock', prompts.unblock)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-rose-600 dark:text-rose-400">{t.unblock}</span>
                    {copiedPrompt === 'unblock' ? (
                      <span className="text-green-500 text-sm flex items-center gap-1">
                        <Check className="w-4 h-4" /> {t.promptCopied}
                      </span>
                    ) : (
                      <Copy className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Bouton ouvrir ChatGPT */}
            <Button
              onClick={openChatGPT}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {t.openChatGPT}
            </Button>

            {/* Message de réassurance */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 italic">
              {t.youProgressAtYourPace}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg truncate">{goal.name}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(goal.deadline).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1 bg-pink-100 dark:bg-pink-900/30 rounded-full">
              <span className="text-sm font-semibold text-pink-600 dark:text-pink-400">{progressPercentage}%</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
              className="rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
              title={language === 'fr' ? 'Supprimer l\'objectif' : language === 'en' ? 'Delete goal' : 'Eliminar objetivo'}
            >
              <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto px-2 pb-2 gap-1 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                  : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24 max-w-lg mx-auto">
        {renderTabContent()}
      </div>

      {/* Delete Goal Dialog */}
      <DeleteGoalDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        goalName={goal.name}
        language={language}
      />
    </div>
  );
}
