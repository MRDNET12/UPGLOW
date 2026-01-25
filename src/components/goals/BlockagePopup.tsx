'use client';

import { useState, useEffect } from 'react';
import { X, Copy, Check, ExternalLink, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';

interface Goal {
  id: string;
  name: string;
  progress: number;
}

interface BlockagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  goals: Goal[];
  language?: 'fr' | 'en' | 'es';
}

const translations = {
  fr: {
    title: "Hey, ça fait un moment... 💫",
    subtitle: "Glowee t'a remarqué(e) !",
    message: "Ce n'est pas grave si tu as fait une pause. L'important, c'est de reprendre doucement.",
    yourGoals: "Tes objectifs en cours",
    progress: "Progression",
    helpPromptTitle: "💬 Besoin d'aide pour débloquer ?",
    helpPromptDesc: "Copie ce prompt et colle-le dans ChatGPT pour t'aider à avancer.",
    copied: "Copié !",
    openChatGPT: "Ouvrir ChatGPT",
    thanks: "Merci Glowee ! ✨",
    noGoals: "Tu n'as pas encore d'objectif actif.",
    createGoal: "Créer un objectif",
    oneStepAtATime: "Un pas à la fois, c'est déjà avancer. 🌱",
  },
  en: {
    title: "Hey, it's been a while... 💫",
    subtitle: "Glowee noticed you!",
    message: "It's okay if you took a break. What matters is getting back on track gently.",
    yourGoals: "Your current goals",
    progress: "Progress",
    helpPromptTitle: "💬 Need help to get unstuck?",
    helpPromptDesc: "Copy this prompt and paste it into ChatGPT for guidance.",
    copied: "Copied!",
    openChatGPT: "Open ChatGPT",
    thanks: "Thanks Glowee! ✨",
    noGoals: "You don't have any active goals yet.",
    createGoal: "Create a goal",
    oneStepAtATime: "One step at a time is still moving forward. 🌱",
  },
  es: {
    title: "Hey, ha pasado un tiempo... 💫",
    subtitle: "¡Glowee te ha notado!",
    message: "Está bien si tomaste un descanso. Lo importante es retomar suavemente.",
    yourGoals: "Tus objetivos actuales",
    progress: "Progreso",
    helpPromptTitle: "💬 ¿Necesitas ayuda para desbloquear?",
    helpPromptDesc: "Copia este prompt y pégalo en ChatGPT para orientarte.",
    copied: "¡Copiado!",
    openChatGPT: "Abrir ChatGPT",
    thanks: "¡Gracias Glowee! ✨",
    noGoals: "Aún no tienes objetivos activos.",
    createGoal: "Crear un objetivo",
    oneStepAtATime: "Un paso a la vez ya es avanzar. 🌱",
  },
};

const getUnblockPrompt = (goals: Goal[], language: 'fr' | 'en' | 'es') => {
  const goalsText = goals.map(g => `- ${g.name} (${g.progress}%)`).join('\n');
  
  if (language === 'en') {
    return `I'm stuck and not making progress.

Here are my goals:
${goalsText || '[No goals yet]'}

Here's what's blocking me:
[EXPLAIN YOUR SITUATION HERE]

Help me understand what's happening and suggest a very simple action for today.`;
  } else if (language === 'es') {
    return `Estoy bloqueado(a) y no avanzo.

Aquí están mis objetivos:
${goalsText || '[Sin objetivos aún]'}

Esto es lo que me bloquea:
[EXPLICA TU SITUACIÓN AQUÍ]

Ayúdame a entender qué pasa y sugiere una acción muy simple para hoy.`;
  }
  
  return `Je suis bloqué(e) et je n'avance plus.

Voici mes objectifs :
${goalsText || '[Pas encore d\'objectifs]'}

Voici ce qui me bloque :
[EXPLIQUE TA SITUATION ICI]

Aide-moi à comprendre ce qui se passe et propose une action très simple pour aujourd'hui.`;
};

export function BlockagePopup({ isOpen, onClose, goals, language = 'fr' }: BlockagePopupProps) {
  const [copied, setCopied] = useState(false);
  const t = translations[language];
  
  const handleCopyPrompt = async () => {
    const prompt = getUnblockPrompt(goals, language);
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Header avec Glowee */}
        <div className="relative bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 p-6 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image
                src="/Glowee/glowee-acceuillante.webp"
                alt="Glowee"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t.title}</h2>
              <p className="text-sm text-rose-600 dark:text-rose-400">{t.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Message bienveillant */}
          <p className="text-gray-600 dark:text-gray-300 text-sm">{t.message}</p>

          {/* Objectifs en cours */}
          {goals.length > 0 ? (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                {t.yourGoals}
              </h3>
              {goals.map((goal) => (
                <div key={goal.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">{goal.name}</span>
                    <span className="text-xs text-rose-500 font-bold">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              {t.noGoals}
            </div>
          )}

          {/* Prompt ChatGPT */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{t.helpPromptTitle}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t.helpPromptDesc}</p>
            <div className="flex gap-2">
              <Button
                onClick={handleCopyPrompt}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    {t.copied}
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copier le prompt
                  </>
                )}
              </Button>
              <Button
                onClick={() => window.open('https://chat.openai.com', '_blank')}
                size="sm"
                className="bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {t.openChatGPT}
              </Button>
            </div>
          </div>

          {/* Message de réassurance */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 italic">
            {t.oneStepAtATime}
          </p>

          {/* Bouton fermer */}
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
          >
            {t.thanks}
          </Button>
        </div>
      </div>
    </div>
  );
}

