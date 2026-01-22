'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Sparkles, FileText, Target, Calendar, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';

interface TimeBreakdownItem {
  level: string;
  title: string;
  steps: string[];
  motivation: string;
}

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
  duration?: number; // en jours
  breakdown?: TimeBreakdownItem[]; // Plan pré-généré à la création
  breakdownGeneratedAt?: string;
}

interface Message {
  id: string;
  role: 'user' | 'glowee';
  content: string;
  timestamp: Date;
}

interface Note {
  id: string;
  content: string;
  timestamp: Date;
  category: 'insight' | 'action' | 'milestone';
}

interface Plan {
  id: string;
  title: string;
  breakdown: string;
  explanation: string;
  dailyTarget?: number;
  isApproved: boolean;
  timestamp: Date;
}

interface Task {
  id: string;
  day: string;
  date?: string;
  task: string;
  text?: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  goalId?: string;
  goalName?: string;
  goalColor?: string;
  completed?: boolean;
}

interface GoalWorkspacePageProps {
  goal: Goal | null;
  onBack: () => void;
  theme?: 'light' | 'dark';
  language?: 'fr' | 'en' | 'es';
}

const translations = {
  fr: {
    back: 'Retour',
    chatWithGlowee: 'Discuter avec Glowee Work',
    notesAndPlans: 'Notes & Plans',
    typeMessage: 'Écris ton message...',
    send: 'Envoyer',
    gloweeNotes: 'Notes de Glowee',
    currentPlan: 'Plan actuel',
    yourInitialInputs: 'Tes réponses initiales',
    why: 'Pourquoi cet objectif',
    desiredFeeling: 'Ressenti recherché',
    description: 'Description',
    competency: 'Niveau de compétence',
    targetAmount: 'Montant cible',
    deadline: 'Échéance',
    analyzing: 'Glowee Work analyse...',
    planBreakdown: 'Découpage du plan',
    dailyTarget: 'Objectif journalier',
    salesPerDay: 'ventes/jour',
    revenuePerDay: '€/jour',
    planExplanation: 'Explication',
    approvePlan: 'Approuver ce plan',
    rejectPlan: 'Proposer un autre délai',
    noNotes: 'Aucune note pour le moment',
    noPlan: 'Aucun plan généré',
    taskTracking: 'Suivi des tâches',
    thisWeek: 'Cette semaine',
    tasksCompleted: 'tâches complétées',
    tasksTotal: 'tâches au total',
    completionRate: 'Taux de complétion',
    highPriority: 'Haute priorité',
    mediumPriority: 'Moyenne priorité',
    lowPriority: 'Basse priorité',
    completed: 'Complétée',
    pending: 'En attente',
    noTasksThisWeek: 'Aucune tâche cette semaine',
  },
  en: {
    back: 'Back',
    chatWithGlowee: 'Chat with Glowee Work',
    notesAndPlans: 'Notes & Plans',
    typeMessage: 'Type your message...',
    send: 'Send',
    gloweeNotes: 'Glowee\'s Notes',
    currentPlan: 'Current Plan',
    yourInitialInputs: 'Your Initial Inputs',
    why: 'Why this goal',
    desiredFeeling: 'Desired feeling',
    description: 'Description',
    competency: 'Competency level',
    targetAmount: 'Target amount',
    deadline: 'Deadline',
    analyzing: 'Glowee Work is analyzing...',
    planBreakdown: 'Plan Breakdown',
    dailyTarget: 'Daily Target',
    salesPerDay: 'sales/day',
    revenuePerDay: '€/day',
    planExplanation: 'Explanation',
    approvePlan: 'Approve this plan',
    rejectPlan: 'Propose another deadline',
    noNotes: 'No notes yet',
    noPlan: 'No plan generated',
    taskTracking: 'Task Tracking',
    thisWeek: 'This week',
    tasksCompleted: 'tasks completed',
    tasksTotal: 'tasks total',
    completionRate: 'Completion rate',
    highPriority: 'High priority',
    mediumPriority: 'Medium priority',
    lowPriority: 'Low priority',
    completed: 'Completed',
    pending: 'Pending',
    noTasksThisWeek: 'No tasks this week',
  },
  es: {
    back: 'Volver',
    chatWithGlowee: 'Hablar con Glowee Work',
    notesAndPlans: 'Notas y Planes',
    typeMessage: 'Escribe tu mensaje...',
    send: 'Enviar',
    gloweeNotes: 'Notas de Glowee',
    currentPlan: 'Plan Actual',
    yourInitialInputs: 'Tus Respuestas Iniciales',
    why: 'Por qué este objetivo',
    desiredFeeling: 'Sentimiento deseado',
    description: 'Descripción',
    competency: 'Nivel de competencia',
    targetAmount: 'Monto objetivo',
    deadline: 'Fecha límite',
    analyzing: 'Glowee Work está analizando...',
    planBreakdown: 'Desglose del Plan',
    dailyTarget: 'Objetivo Diario',
    salesPerDay: 'ventas/día',
    revenuePerDay: '€/día',
    planExplanation: 'Explicación',
    approvePlan: 'Aprobar este plan',
    rejectPlan: 'Proponer otra fecha',
    noNotes: 'Sin notas aún',
    noPlan: 'Sin plan generado',
    taskTracking: 'Seguimiento de tareas',
    thisWeek: 'Esta semana',
    tasksCompleted: 'tareas completadas',
    tasksTotal: 'tareas en total',
    completionRate: 'Tasa de finalización',
    highPriority: 'Alta prioridad',
    mediumPriority: 'Prioridad media',
    lowPriority: 'Baja prioridad',
    completed: 'Completada',
    pending: 'Pendiente',
    noTasksThisWeek: 'Sin tareas esta semana',
  }
};

export function GoalWorkspacePage({ goal, onBack, theme = 'light', language = 'fr' }: GoalWorkspacePageProps) {
  const t = translations[language];
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [goalTasks, setGoalTasks] = useState<Task[]>([]);
  const [performanceAnalysis, setPerformanceAnalysis] = useState<{
    completionRate: number;
    trend: 'improving' | 'stable' | 'declining';
    suggestions: string[];
    celebrationMessage?: string;
  } | null>(null);
  const [isAnalyzingPerformance, setIsAnalyzingPerformance] = useState(false);
  const [showWeeklyTasksGenerator, setShowWeeklyTasksGenerator] = useState(false);
  const [dailyCheck, setDailyCheck] = useState<{
    status: 'on_track' | 'behind' | 'ahead';
    message: string;
    suggestions: string[];
    urgency: 'low' | 'medium' | 'high';
  } | null>(null);
  const [blockerAnalysis, setBlockerAnalysis] = useState<{
    blockedCategories: Array<{ category: string; count: number; percentage: number }>;
    patterns: string[];
    solutions: string[];
    rootCause?: string;
  } | null>(null);
  const [timeBreakdown, setTimeBreakdown] = useState<Array<{
    level: string;
    title: string;
    steps: string[];
    motivation: string;
  }> | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  if (!goal) return null;

  // Récupérer les tâches Glowee liées à cet objectif
  useEffect(() => {
    const loadGoalTasks = () => {
      try {
        const storedTasks = localStorage.getItem('gloweeWeeklyTasks');
        if (storedTasks) {
          const allTasks = JSON.parse(storedTasks);
          // Récupérer toutes les tâches de tous les jours
          const tasksArray: Task[] = [];
          Object.keys(allTasks).forEach((day) => {
            const dayTasks = allTasks[day] || [];
            dayTasks.forEach((task: Task) => {
              if (task.goalId === goal.id) {
                tasksArray.push({ ...task, day });
              }
            });
          });
          setGoalTasks(tasksArray);
        }
      } catch (error) {
        console.error('Error loading goal tasks:', error);
      }
    };

    loadGoalTasks();

    // Écouter les changements dans localStorage
    const handleStorageChange = () => {
      loadGoalTasks();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [goal.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Charger le plan pré-généré ou générer si absent
  useEffect(() => {
    const loadOrGeneratePlan = async () => {
      if (timeBreakdown || isGeneratingPlan) return; // Déjà chargé ou en cours

      // 1. Vérifier si le plan est déjà stocké dans l'objectif
      if (goal.breakdown && Array.isArray(goal.breakdown) && goal.breakdown.length > 0) {
        console.log('Plan loaded from goal:', goal.breakdown.length, 'phases');
        setTimeBreakdown(goal.breakdown);
        return;
      }

      // 2. Sinon, générer le plan (pour les anciens objectifs sans plan)
      console.log('No pre-generated plan found, generating...');
      setIsGeneratingPlan(true);
      try {
        const response = await fetch('/api/goals/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ goal })
        });

        if (response.ok) {
          const data = await response.json();
          setTimeBreakdown(data.breakdown);
        }
      } catch (error) {
        console.error('Error generating plan:', error);
      } finally {
        setIsGeneratingPlan(false);
      }
    };

    loadOrGeneratePlan();
  }, [goal.id, goal.breakdown]); // Recharger si l'objectif ou son plan change

  // Calculer les statistiques des tâches de cette semaine (AVANT useEffect)
  const getThisWeekTasks = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lundi
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Dimanche

    return goalTasks.filter(task => {
      if (!task.date) return false;
      const taskDate = new Date(task.date);
      return taskDate >= startOfWeek && taskDate <= endOfWeek;
    });
  };

  const thisWeekTasks = getThisWeekTasks();
  const completedTasks = thisWeekTasks.filter(t => t.completed);
  const completionRate = thisWeekTasks.length > 0
    ? Math.round((completedTasks.length / thisWeekTasks.length) * 100)
    : 0;

  // Message initial de Glowee Work avec suivi des tâches
  useEffect(() => {
    if (messages.length === 0 && thisWeekTasks.length > 0) {
      const completedCount = completedTasks.length;
      const totalCount = thisWeekTasks.length;
      const rate = completionRate;

      let initialMessage = '';
      if (language === 'fr') {
        if (rate === 100) {
          initialMessage = `🎉 Bravo ! Tu as complété toutes tes tâches cette semaine (${totalCount}/${totalCount}) ! Continue comme ça, tu es sur la bonne voie pour atteindre "${goal.name}".`;
        } else if (rate >= 70) {
          initialMessage = `👏 Excellent travail ! Tu as complété ${completedCount} tâches sur ${totalCount} cette semaine (${rate}%). Tu es bien engagée dans ton objectif "${goal.name}". Comment puis-je t'aider à aller encore plus loin ?`;
        } else if (rate >= 40) {
          initialMessage = `💪 Tu as complété ${completedCount} tâches sur ${totalCount} cette semaine (${rate}%). C'est un bon début ! Parlons ensemble de ce qui pourrait t'aider à progresser davantage vers "${goal.name}".`;
        } else if (rate > 0) {
          initialMessage = `Je vois que tu as complété ${completedCount} tâche${completedCount > 1 ? 's' : ''} sur ${totalCount} cette semaine. Pas de panique ! Discutons ensemble pour comprendre ce qui te bloque et ajuster ton plan pour "${goal.name}".`;
        } else {
          initialMessage = `Je remarque que tu n'as pas encore commencé les tâches de cette semaine (0/${totalCount}). C'est normal d'avoir des moments difficiles. Parlons-en ensemble pour trouver ce qui te conviendrait mieux pour avancer vers "${goal.name}".`;
        }
      } else if (language === 'en') {
        if (rate === 100) {
          initialMessage = `🎉 Congrats! You completed all your tasks this week (${totalCount}/${totalCount})! Keep it up, you're on track to achieve "${goal.name}".`;
        } else if (rate >= 70) {
          initialMessage = `👏 Excellent work! You completed ${completedCount} out of ${totalCount} tasks this week (${rate}%). You're well engaged in your goal "${goal.name}". How can I help you go even further?`;
        } else if (rate >= 40) {
          initialMessage = `💪 You completed ${completedCount} out of ${totalCount} tasks this week (${rate}%). That's a good start! Let's talk about what could help you progress more towards "${goal.name}".`;
        } else if (rate > 0) {
          initialMessage = `I see you completed ${completedCount} task${completedCount > 1 ? 's' : ''} out of ${totalCount} this week. No worries! Let's discuss together to understand what's blocking you and adjust your plan for "${goal.name}".`;
        } else {
          initialMessage = `I notice you haven't started this week's tasks yet (0/${totalCount}). It's normal to have difficult moments. Let's talk about it to find what would work better for you to move forward with "${goal.name}".`;
        }
      } else {
        if (rate === 100) {
          initialMessage = `🎉 ¡Felicidades! Completaste todas tus tareas esta semana (${totalCount}/${totalCount}). Sigue así, estás en camino de lograr "${goal.name}".`;
        } else if (rate >= 70) {
          initialMessage = `👏 ¡Excelente trabajo! Completaste ${completedCount} de ${totalCount} tareas esta semana (${rate}%). Estás bien comprometida con tu objetivo "${goal.name}". ¿Cómo puedo ayudarte a ir aún más lejos?`;
        } else if (rate >= 40) {
          initialMessage = `💪 Completaste ${completedCount} de ${totalCount} tareas esta semana (${rate}%). ¡Es un buen comienzo! Hablemos sobre qué podría ayudarte a progresar más hacia "${goal.name}".`;
        } else if (rate > 0) {
          initialMessage = `Veo que completaste ${completedCount} tarea${completedCount > 1 ? 's' : ''} de ${totalCount} esta semana. ¡No te preocupes! Hablemos juntas para entender qué te bloquea y ajustar tu plan para "${goal.name}".`;
        } else {
          initialMessage = `Noto que aún no has comenzado las tareas de esta semana (0/${totalCount}). Es normal tener momentos difíciles. Hablemos para encontrar qué funcionaría mejor para ti para avanzar hacia "${goal.name}".`;
        }
      }

      const gloweeInitialMessage: Message = {
        id: `msg_initial_${Date.now()}`,
        role: 'glowee',
        content: initialMessage,
        timestamp: new Date()
      };
      setMessages([gloweeInitialMessage]);
    }
  }, [thisWeekTasks.length, completedTasks.length, completionRate, goal.name, language, messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsAnalyzing(true);

    // Simulate Glowee response (replace with actual API call)
    setTimeout(() => {
      const gloweeMessage: Message = {
        id: `msg_${Date.now()}_glowee`,
        role: 'glowee',
        content: `J'ai bien compris. Laisse-moi analyser ça et je te propose un plan d'action adapté.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, gloweeMessage]);
      setIsAnalyzing(false);
    }, 2000);
  };

  // Calculate duration in days
  const durationInDays = goal.duration || Math.ceil((new Date(goal.deadline).getTime() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  // Analyser la performance et obtenir des suggestions
  const analyzePerformance = async () => {
    if (thisWeekTasks.length === 0) return;

    setIsAnalyzingPerformance(true);
    try {
      const response = await fetch('/api/goals/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: thisWeekTasks,
          goal: {
            type: goal.type,
            targetAmount: goal.targetAmount,
            daysRemaining: Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPerformanceAnalysis(data.analysis);

        // Ajouter un message de Glowee Work avec les suggestions
        if (data.analysis.suggestions.length > 0) {
          const suggestionMessage: Message = {
            id: `msg_suggestions_${Date.now()}`,
            role: 'glowee',
            content: `📊 Analyse de ta semaine :\n\n${data.analysis.suggestions.join('\n\n')}`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, suggestionMessage]);
        }

        // Message de célébration si applicable
        if (data.analysis.celebrationMessage) {
          const celebrationMsg: Message = {
            id: `msg_celebration_${Date.now()}`,
            role: 'glowee',
            content: data.analysis.celebrationMessage,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, celebrationMsg]);
        }
      }
    } catch (error) {
      console.error('Error analyzing performance:', error);
    } finally {
      setIsAnalyzingPerformance(false);
    }
  };

  // Générer de nouvelles tâches pour la semaine prochaine
  const generateWeeklyTasks = async () => {
    try {
      const weekNumber = Math.ceil((new Date().getTime() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 7));

      const response = await fetch('/api/goals/generate-weekly-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: {
            id: goal.id,
            name: goal.name,
            type: goal.type,
            description: goal.description,
            deadline: goal.deadline,
            targetAmount: goal.targetAmount,
            competency: goal.competency,
            progress: goal.progress
          },
          previousTasks: thisWeekTasks,
          completionRate,
          weekNumber
        })
      });

      if (response.ok) {
        const data = await response.json();

        // Message de Glowee Work avec les nouvelles tâches
        const newTasksMessage: Message = {
          id: `msg_new_tasks_${Date.now()}`,
          role: 'glowee',
          content: `✨ J'ai généré ${data.tasks.length} nouvelles tâches pour la semaine ${data.weekNumber} ! Elles sont adaptées à ta performance actuelle (${completionRate}%). Tu peux les voir dans ton Planning.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newTasksMessage]);

        // TODO: Ajouter les tâches au Planning
        // onAddGloweeTasks(data.tasks);
      }
    } catch (error) {
      console.error('Error generating weekly tasks:', error);
    }
  };

  // Vérification quotidienne de l'objectif
  const performDailyCheck = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const todayTasks = goalTasks.filter(t => t.date === today);
      const todayCompleted = todayTasks.filter(t => t.completed);

      const response = await fetch('/api/goals/daily-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalId: goal.id,
          goalType: goal.type,
          targetAmount: goal.targetAmount,
          daysRemaining: Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
          todayRevenue: 0, // TODO: Récupérer depuis tracking utilisateur
          todayTasksCompleted: todayCompleted.length,
          todayTasksTotal: todayTasks.length
        })
      });

      if (response.ok) {
        const data = await response.json();
        setDailyCheck(data.check);

        // Message de Glowee Work avec le check quotidien
        const checkMessage: Message = {
          id: `msg_daily_check_${Date.now()}`,
          role: 'glowee',
          content: `${data.check.message}\n\n${data.check.suggestions.join('\n\n')}${data.check.encouragement ? `\n\n${data.check.encouragement}` : ''}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, checkMessage]);
      }
    } catch (error) {
      console.error('Error performing daily check:', error);
    }
  };

  // Analyser les blocages
  const analyzeBlockers = async () => {
    try {
      const response = await fetch('/api/goals/analyze-blockers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: thisWeekTasks,
          goal: {
            id: goal.id,
            name: goal.name
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setBlockerAnalysis(data.analysis);

        // Message de Glowee Work avec l'analyse des blocages
        let blockerMessage = `🔍 Analyse de tes blocages :\n\n`;

        if (data.analysis.patterns.length > 0) {
          blockerMessage += `📊 Patterns identifiés :\n${data.analysis.patterns.join('\n')}\n\n`;
        }

        if (data.analysis.rootCause) {
          blockerMessage += `💡 Cause racine : ${data.analysis.rootCause}\n\n`;
        }

        if (data.analysis.solutions.length > 0) {
          blockerMessage += `✅ Solutions proposées :\n${data.analysis.solutions.join('\n')}`;
        }

        const analysisMessage: Message = {
          id: `msg_blocker_analysis_${Date.now()}`,
          role: 'glowee',
          content: blockerMessage,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, analysisMessage]);
      }
    } catch (error) {
      console.error('Error analyzing blockers:', error);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-stone-950 text-stone-100' : 'bg-amber-50 text-stone-900'}`}>
      {/* Header - Mobile optimized */}
      <div className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-stone-900/95' : 'bg-white/95'} backdrop-blur-sm border-b ${theme === 'dark' ? 'border-stone-800' : 'border-stone-200'}`}>
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t.back}</span>
          </Button>

          <div className="flex-1 mx-4 min-w-0">
            <h1 className="text-lg font-bold truncate">{goal.name}</h1>
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <Calendar className="w-3 h-3" />
              <span>{new Date(goal.deadline).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Mobile: Glowee Work button */}
          <Button
            onClick={() => setShowMobileChat(!showMobileChat)}
            className="sm:hidden bg-gradient-to-r from-violet-500 to-purple-500 text-white"
            size="sm"
          >
            <Sparkles className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-stone-600 dark:text-stone-400">Progression</span>
            <span className="font-semibold">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>
      </div>

      {/* Main Content - Desktop: Side by side, Mobile: Stacked */}
      <div className="flex flex-col sm:flex-row h-[calc(100vh-140px)]">

        {/* LEFT SIDE: Chat with Glowee Work */}
        <div className={`${showMobileChat ? 'flex' : 'hidden'} sm:flex flex-col w-full sm:w-1/2 ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} border-r ${theme === 'dark' ? 'border-stone-800' : 'border-stone-200'}`}>
          {/* Chat Header */}
          <div className={`p-4 border-b ${theme === 'dark' ? 'border-stone-800 bg-gradient-to-r from-violet-900/30 to-purple-900/30' : 'border-stone-200 bg-gradient-to-r from-violet-50 to-purple-50'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-sm">Glowee Work</h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">Ton assistant IA personnel</p>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{ scrollbarWidth: 'thin' }}
          >
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 mx-auto mb-3 text-violet-400 opacity-50" />
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  {language === 'fr' ? 'Commence à discuter avec Glowee pour affiner ton plan' :
                   language === 'en' ? 'Start chatting with Glowee to refine your plan' :
                   'Comienza a chatear con Glowee para refinar tu plan'}
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
                      : theme === 'dark'
                        ? 'bg-stone-800 text-stone-100'
                        : 'bg-stone-100 text-stone-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-violet-100' : 'text-stone-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isAnalyzing && (
              <div className="flex justify-start">
                <div className={`rounded-2xl px-4 py-2 ${theme === 'dark' ? 'bg-stone-800' : 'bg-stone-100'}`}>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-xs text-stone-500">{t.analyzing}</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className={`p-4 border-t ${theme === 'dark' ? 'border-stone-800 bg-stone-900' : 'border-stone-200 bg-white'}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={t.typeMessage}
                className={`flex-1 px-4 py-2 rounded-xl border ${
                  theme === 'dark'
                    ? 'bg-stone-800 border-stone-700 text-stone-100 placeholder-stone-500'
                    : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400'
                } focus:outline-none focus:ring-2 focus:ring-violet-500`}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isAnalyzing}
                className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Notes & Plans */}
        <div className={`${showMobileChat ? 'hidden' : 'flex'} sm:flex flex-col w-full sm:w-1/2 overflow-y-auto`}>
          <div className="p-4 space-y-4">

            {/* Current Plan Section - Horizontal Timeline */}
            <div className={`rounded-2xl p-4 ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} border ${theme === 'dark' ? 'border-stone-800' : 'border-stone-200'}`}>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-violet-500" />
                <h3 className="font-bold">{t.currentPlan}</h3>
              </div>

              {isGeneratingPlan ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <p className="text-sm text-violet-500 font-medium">Glowee Work crée ton plan...</p>
                  </div>
                </div>
              ) : timeBreakdown && timeBreakdown.length > 0 ? (
                <div className="space-y-4">
                  {/* Horizontal Timeline */}
                  <div className="overflow-x-auto pb-2">
                    <div className="flex gap-3 min-w-max">
                      {timeBreakdown.map((phase, index) => (
                        <div
                          key={index}
                          className={`flex-shrink-0 w-64 rounded-xl p-4 border-2 transition-all hover:scale-105 ${
                            theme === 'dark'
                              ? 'bg-gradient-to-br from-violet-900/30 to-purple-900/30 border-violet-700/50'
                              : 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200'
                          }`}
                        >
                          {/* Phase Title */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-xs text-violet-600 dark:text-violet-400 font-semibold">{phase.level}</p>
                              <p className="text-sm font-bold">{phase.title}</p>
                            </div>
                          </div>

                          {/* Steps */}
                          <div className="space-y-2 mb-3">
                            {phase.steps.map((step, stepIndex) => (
                              <div key={stepIndex} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 flex-shrink-0"></div>
                                <p className="text-xs leading-relaxed">{step}</p>
                              </div>
                            ))}
                          </div>

                          {/* Motivation */}
                          <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-violet-900/40' : 'bg-violet-100'}`}>
                            <p className="text-xs italic text-violet-600 dark:text-violet-300">{phase.motivation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scroll Indicator */}
                  <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
                    <span>← Fais défiler pour voir toutes les étapes →</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-stone-500 dark:text-stone-400 italic">{t.noPlan}</p>
              )}
            </div>

            {/* Task Tracking Section */}
            <div className={`rounded-2xl p-4 ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} border ${theme === 'dark' ? 'border-stone-800' : 'border-stone-200'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold">{t.taskTracking}</h3>
              </div>

              {thisWeekTasks.length > 0 ? (
                <div className="space-y-3">
                  {/* Stats */}
                  <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-indigo-900/20' : 'bg-indigo-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-stone-600 dark:text-stone-400">{t.thisWeek}</span>
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {completionRate}% {t.completionRate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{completedTasks.length}</span>
                      <span className="text-stone-600 dark:text-stone-400">/</span>
                      <span className="text-stone-600 dark:text-stone-400">{thisWeekTasks.length} {t.tasksTotal}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={analyzePerformance}
                      disabled={isAnalyzingPerformance}
                      className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
                      size="sm"
                    >
                      <Lightbulb className="w-4 h-4 mr-1" />
                      <span className="text-xs">{isAnalyzingPerformance ? 'Analyse...' : 'Analyser'}</span>
                    </Button>
                    <Button
                      onClick={analyzeBlockers}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      size="sm"
                    >
                      <Target className="w-4 h-4 mr-1" />
                      <span className="text-xs">Blocages</span>
                    </Button>
                  </div>

                  {/* Daily Check Button for Financial Goals */}
                  {goal.type === 'financial' && goal.targetAmount && (
                    <Button
                      onClick={performDailyCheck}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                      size="sm"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Vérifier mon objectif du jour
                    </Button>
                  )}

                  {/* Performance Analysis */}
                  {performanceAnalysis && (
                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-violet-900/20' : 'bg-violet-50'} border ${theme === 'dark' ? 'border-violet-800' : 'border-violet-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                        <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                          Tendance : {performanceAnalysis.trend === 'improving' ? '📈 En progression' : performanceAnalysis.trend === 'declining' ? '📉 En baisse' : '➡️ Stable'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Task List */}
                  <div className="space-y-2">
                    {thisWeekTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3 rounded-xl border ${
                          task.completed
                            ? theme === 'dark' ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
                            : theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                            task.completed
                              ? 'bg-green-500 border-green-500'
                              : theme === 'dark' ? 'border-stone-600' : 'border-stone-300'
                          }`}>
                            {task.completed && <span className="text-white text-xs">✓</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${task.completed ? 'line-through text-stone-500' : ''}`}>
                              {task.task || task.text}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                task.priority === 'high'
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                                  : task.priority === 'medium'
                                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                    : 'bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-400'
                              }`}>
                                {task.priority === 'high' ? t.highPriority : task.priority === 'medium' ? t.mediumPriority : t.lowPriority}
                              </span>
                              {task.date && (
                                <span className="text-xs text-stone-500 dark:text-stone-400">
                                  {new Date(task.date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-stone-500 dark:text-stone-400 italic">{t.noTasksThisWeek}</p>
              )}
            </div>

            {/* Weekly Tasks Generator Section */}
            <div className={`rounded-2xl p-4 ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} border ${theme === 'dark' ? 'border-stone-800' : 'border-stone-200'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold">Tâches de la semaine prochaine</h3>
              </div>

              <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">
                Glowee Work peut générer automatiquement de nouvelles tâches adaptées à ta performance actuelle.
              </p>

              <Button
                onClick={generateWeeklyTasks}
                className="w-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
                size="sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Générer les tâches de la semaine prochaine
              </Button>
            </div>

            {/* Glowee's Notes Section */}
            <div className={`rounded-2xl p-4 ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} border ${theme === 'dark' ? 'border-stone-800' : 'border-stone-200'}`}>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold">{t.gloweeNotes}</h3>
              </div>

              {notes.length > 0 ? (
                <div className="space-y-2">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-3 rounded-xl ${
                        note.category === 'insight'
                          ? theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
                          : note.category === 'action'
                            ? theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'
                            : theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg">
                          {note.category === 'insight' ? '💡' : note.category === 'action' ? '✅' : '🎯'}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm">{note.content}</p>
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                            {note.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-500 dark:text-stone-400 italic">{t.noNotes}</p>
              )}
            </div>

            {/* Initial Inputs Section - Collapsible */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="initial-inputs"
                className={`rounded-2xl border ${theme === 'dark' ? 'border-stone-800 bg-stone-900' : 'border-stone-200 bg-white'}`}
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-rose-500" />
                    <span className="font-bold">{t.yourInitialInputs}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3">
                    {goal.why && (
                      <div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">{t.why}</p>
                        <p className="text-sm font-medium">{goal.why}</p>
                      </div>
                    )}

                    {goal.desiredFeeling && (
                      <div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">{t.desiredFeeling}</p>
                        <p className="text-sm font-medium">{goal.desiredFeeling}</p>
                      </div>
                    )}

                    {goal.description && (
                      <div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">{t.description}</p>
                        <p className="text-sm font-medium">{goal.description}</p>
                      </div>
                    )}

                    {goal.competency && (
                      <div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">{t.competency}</p>
                        <p className="text-sm font-medium">{goal.competency}</p>
                      </div>
                    )}

                    {goal.targetAmount && (
                      <div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">{t.targetAmount}</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          {goal.targetAmount.toLocaleString()} €
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">{t.deadline}</p>
                      <p className="text-sm font-medium">
                        {new Date(goal.deadline).toLocaleDateString()} ({durationInDays} jours)
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

          </div>
        </div>
      </div>
    </div>
  );
}

