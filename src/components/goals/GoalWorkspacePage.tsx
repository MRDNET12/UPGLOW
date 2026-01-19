'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Sparkles, FileText, Target, Calendar, Lightbulb } from 'lucide-react';
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
  duration?: number; // en jours
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
    analyzing: 'Glowee analyse ton objectif...',
    planBreakdown: 'Découpage du plan',
    dailyTarget: 'Objectif journalier',
    salesPerDay: 'ventes/jour',
    revenuePerDay: '€/jour',
    planExplanation: 'Explication',
    approvePlan: 'Approuver ce plan',
    rejectPlan: 'Proposer un autre délai',
    noNotes: 'Aucune note pour le moment',
    noPlan: 'Aucun plan généré',
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
    analyzing: 'Glowee is analyzing your goal...',
    planBreakdown: 'Plan Breakdown',
    dailyTarget: 'Daily Target',
    salesPerDay: 'sales/day',
    revenuePerDay: '€/day',
    planExplanation: 'Explanation',
    approvePlan: 'Approve this plan',
    rejectPlan: 'Propose another deadline',
    noNotes: 'No notes yet',
    noPlan: 'No plan generated',
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
    analyzing: 'Glowee está analizando tu objetivo...',
    planBreakdown: 'Desglose del Plan',
    dailyTarget: 'Objetivo Diario',
    salesPerDay: 'ventas/día',
    revenuePerDay: '€/día',
    planExplanation: 'Explicación',
    approvePlan: 'Aprobar este plan',
    rejectPlan: 'Proponer otra fecha',
    noNotes: 'Sin notas aún',
    noPlan: 'Sin plan generado',
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
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  if (!goal) return null;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
  const isLongTerm = durationInDays > 365;

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

            {/* Current Plan Section */}
            <div className={`rounded-2xl p-4 ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} border ${theme === 'dark' ? 'border-stone-800' : 'border-stone-200'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-violet-500" />
                <h3 className="font-bold">{t.currentPlan}</h3>
              </div>

              {currentPlan ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">{t.planBreakdown}</p>
                    <p className="font-semibold text-violet-600 dark:text-violet-400">{currentPlan.breakdown}</p>
                  </div>

                  {currentPlan.dailyTarget && goal.type === 'financial' && (
                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'}`}>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">{t.dailyTarget}</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {currentPlan.dailyTarget.toFixed(2)} {t.revenuePerDay}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">{t.planExplanation}</p>
                    <p className="text-sm">{currentPlan.explanation}</p>
                  </div>

                  {!currentPlan.isApproved && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => setCurrentPlan({ ...currentPlan, isApproved: true })}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                        size="sm"
                      >
                        {t.approvePlan}
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        size="sm"
                      >
                        {t.rejectPlan}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-stone-500 dark:text-stone-400 italic">{t.noPlan}</p>
              )}
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

