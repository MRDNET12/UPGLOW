'use client';

import { useState } from 'react';
import { X, ArrowLeft, ArrowRight, MessageCircle, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createGoal } from '@/lib/firebase/goals-service';
import { useAuth } from '@/contexts/AuthContext';

// Types
type GoalDuration = 1 | 3 | 6 | 12; // mois
type GoalRhythm = 'doux' | 'equilibre' | 'intense';
type GoalColor = '#f43f5e' | '#3b82f6' | '#10b981'; // rose, bleu, vert

interface CreateGoalWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language?: 'fr' | 'en' | 'es';
}

// Traductions
const translations = {
  fr: {
    // Étape 1
    step1Title: 'Quel objectif veux-tu atteindre ?',
    step1Placeholder: 'Ex : lancer mon projet, mieux organiser mes semaines, reprendre le sport...',
    step1WhyLabel: 'Pourquoi cet objectif est important pour toi ? (optionnel)',
    step1WhyPlaceholder: 'Ce qui te motive vraiment...',
    step1Reassurance: 'Pas besoin d\'être parfait. Tu pourras ajuster plus tard.',
    step1HelpBtn: '💬 M\'aider à clarifier avec ChatGPT',
    // Étape 2
    step2Title: 'Dans combien de temps veux-tu atteindre cet objectif ?',
    step2Subtitle: 'La durée détermine le rythme et le niveau de détail.',
    duration1: '1 mois',
    duration1Sub: 'Focus immédiat',
    duration3: '3 mois',
    duration3Sub: 'Résultats visibles',
    duration6: '6 mois',
    duration6Sub: 'Progression stable',
    duration12: '1 an',
    duration12Sub: 'Vision long terme',
    // Étape 3
    step3Title: 'Quel rythme te correspond en ce moment ?',
    step3Subtitle: 'Choisis ce qui est réaliste, pas idéal.',
    rhythmDoux: '🔋 Doux',
    rhythmDouxSub: '1 action / jour',
    rhythmEquilibre: '⚖️ Équilibré',
    rhythmEquilibreSub: '1 à 2 actions / jour',
    rhythmIntense: '🔥 Intense',
    rhythmIntenseSub: 'jusqu\'à 3 actions / jour',
    rhythmWarning: '❗ Jamais plus de 3 actions par jour.',
    // Étape 4 - Couleur
    step4Title: 'Choisis une couleur pour cet objectif',
    step4Subtitle: 'Cette couleur identifiera tes tâches dans Glowee tâches.',
    colorRose: 'Rose',
    colorBlue: 'Bleu',
    colorGreen: 'Vert',
    // Navigation
    back: 'Retour',
    next: 'Suivant',
    create: 'Créer mon objectif 🎯',
    creating: 'Création...',
    copied: 'Copié !',
    openChatGPT: 'Ouvrir ChatGPT',
  },
  en: {
    step1Title: 'What goal do you want to achieve?',
    step1Placeholder: 'Ex: launch my project, better organize my weeks, get back to sports...',
    step1WhyLabel: 'Why is this goal important to you? (optional)',
    step1WhyPlaceholder: 'What really motivates you...',
    step1Reassurance: 'No need to be perfect. You can adjust later.',
    step1HelpBtn: '💬 Help me clarify with ChatGPT',
    step2Title: 'How long do you want to achieve this goal?',
    step2Subtitle: 'Duration determines the pace and level of detail.',
    duration1: '1 month', duration1Sub: 'Immediate focus',
    duration3: '3 months', duration3Sub: 'Visible results',
    duration6: '6 months', duration6Sub: 'Stable progression',
    duration12: '1 year', duration12Sub: 'Long-term vision',
    step3Title: 'What pace suits you right now?',
    step3Subtitle: 'Choose what\'s realistic, not ideal.',
    rhythmDoux: '🔋 Gentle', rhythmDouxSub: '1 action / day',
    rhythmEquilibre: '⚖️ Balanced', rhythmEquilibreSub: '1 to 2 actions / day',
    rhythmIntense: '🔥 Intense', rhythmIntenseSub: 'up to 3 actions / day',
    rhythmWarning: '❗ Never more than 3 actions per day.',
    step4Title: 'Choose a color for this goal',
    step4Subtitle: 'This color will identify your tasks in Glowee tasks.',
    colorRose: 'Pink', colorBlue: 'Blue', colorGreen: 'Green',
    back: 'Back', next: 'Next', create: 'Create my goal 🎯', creating: 'Creating...', copied: 'Copied!', openChatGPT: 'Open ChatGPT',
  },
  es: {
    step1Title: '¿Qué objetivo quieres alcanzar?',
    step1Placeholder: 'Ej: lanzar mi proyecto, organizar mejor mis semanas, retomar el deporte...',
    step1WhyLabel: '¿Por qué este objetivo es importante para ti? (opcional)',
    step1WhyPlaceholder: 'Lo que realmente te motiva...',
    step1Reassurance: 'No necesitas ser perfecto. Podrás ajustar después.',
    step1HelpBtn: '💬 Ayúdame a clarificar con ChatGPT',
    step2Title: '¿En cuánto tiempo quieres alcanzar este objetivo?',
    step2Subtitle: 'La duración determina el ritmo y el nivel de detalle.',
    duration1: '1 mes', duration1Sub: 'Enfoque inmediato',
    duration3: '3 meses', duration3Sub: 'Resultados visibles',
    duration6: '6 meses', duration6Sub: 'Progresión estable',
    duration12: '1 año', duration12Sub: 'Visión a largo plazo',
    step3Title: '¿Qué ritmo te corresponde en este momento?',
    step3Subtitle: 'Elige lo que es realista, no ideal.',
    rhythmDoux: '🔋 Suave', rhythmDouxSub: '1 acción / día',
    rhythmEquilibre: '⚖️ Equilibrado', rhythmEquilibreSub: '1 a 2 acciones / día',
    rhythmIntense: '🔥 Intenso', rhythmIntenseSub: 'hasta 3 acciones / día',
    rhythmWarning: '❗ Nunca más de 3 acciones por día.',
    step4Title: 'Elige un color para este objetivo',
    step4Subtitle: 'Este color identificará tus tareas en Glowee tareas.',
    colorRose: 'Rosa', colorBlue: 'Azul', colorGreen: 'Verde',
    back: 'Atrás', next: 'Siguiente', create: 'Crear mi objetivo 🎯', creating: 'Creando...', copied: '¡Copiado!', openChatGPT: 'Abrir ChatGPT',
  },
};

// Prompts ChatGPT
const getClarifyPrompt = (goal: string, language: string) => {
  if (language === 'en') {
    return `I have a goal but it's unclear.
Help me make it clear, realistic and achievable.

My goal:
${goal}

My context:
- Available time:
- Energy level:
- Current constraints:

Ask me questions if needed.`;
  }
  if (language === 'es') {
    return `Tengo un objetivo pero es confuso.
Ayúdame a hacerlo claro, realista y alcanzable.

Mi objetivo:
${goal}

Mi contexto:
- Tiempo disponible:
- Nivel de energía:
- Restricciones actuales:

Hazme preguntas si es necesario.`;
  }
  return `J'ai un objectif mais il est flou.
Aide-moi à le rendre clair, réaliste et atteignable.

Mon objectif :
${goal}

Mon contexte :
- Temps disponible :
- Niveau d'énergie :
- Contraintes actuelles :

Pose-moi des questions si nécessaire.`;
};

export function CreateGoalWizard({ isOpen, onClose, onSuccess, language = 'fr' }: CreateGoalWizardProps) {
  const { user } = useAuth();
  const t = translations[language];

  // État du wizard
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Données du formulaire
  const [goalName, setGoalName] = useState('');
  const [why, setWhy] = useState('');
  const [duration, setDuration] = useState<GoalDuration | null>(null);
  const [rhythm, setRhythm] = useState<GoalRhythm | null>(null);
  const [color, setColor] = useState<GoalColor | null>(null);

  const resetForm = () => {
    setStep(1);
    setGoalName('');
    setWhy('');
    setDuration(null);
    setRhythm(null);
    setColor(null);
  };

  const handleCopyPrompt = async () => {
    const prompt = getClarifyPrompt(goalName || '[Ton objectif ici]', language);
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!user || !duration || !rhythm || !color) return;

    setIsSubmitting(true);
    try {
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + duration);

      const goalId = await createGoal(user.uid, {
        type: 'personal',
        name: goalName,
        targetDate: targetDate.toISOString().split('T')[0],
        timeframe: duration,
        why: why || '',
        desiredFeeling: '',
        status: 'active',
        progress: 0,
        rhythm,
        color,
      });

      // Sauvegarder dans localStorage aussi
      const existingGoals = JSON.parse(localStorage.getItem('myGoals') || '[]');
      const newGoal = {
        id: goalId,
        userId: user.uid,
        type: 'personal',
        name: goalName,
        targetDate: targetDate.toISOString().split('T')[0],
        timeframe: duration,
        why: why || '',
        desiredFeeling: '',
        status: 'active',
        progress: 0,
        rhythm,
        color,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('myGoals', JSON.stringify([...existingGoals, newGoal]));

      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canGoNext = () => {
    switch (step) {
      case 1: return goalName.trim().length > 0;
      case 2: return duration !== null;
      case 3: return rhythm !== null;
      case 4: return color !== null;
      default: return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Étape {step}/4</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-1 rounded-full transition-colors ${
                    s <= step ? 'bg-gradient-to-r from-rose-400 to-pink-400' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
          <button onClick={() => { onClose(); resetForm(); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px]">
          {/* Étape 1: Nom + Pourquoi */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                {t.step1Title}
              </h2>

              <Input
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder={t.step1Placeholder}
                className="text-base py-6 rounded-xl"
              />

              <div className="space-y-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">{t.step1WhyLabel}</label>
                <Textarea
                  value={why}
                  onChange={(e) => setWhy(e.target.value)}
                  placeholder={t.step1WhyPlaceholder}
                  className="rounded-xl resize-none"
                  rows={3}
                />
              </div>

              <p className="text-sm text-gray-500 italic">{t.step1Reassurance}</p>

              {/* Bouton ChatGPT */}
              <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl">
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-2 text-sm text-pink-600 dark:text-pink-400 hover:underline"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? t.copied : t.step1HelpBtn}
                </button>
                {copied && (
                  <a
                    href="https://chat.openai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 mt-2 text-xs text-gray-500 hover:text-pink-500"
                  >
                    <ExternalLink className="w-3 h-3" /> {t.openChatGPT}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Étape 2: Durée */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                  {t.step2Title}
                </h2>
                <p className="text-sm text-gray-500 mt-2">{t.step2Subtitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: 1, label: t.duration1, sub: t.duration1Sub },
                  { value: 3, label: t.duration3, sub: t.duration3Sub },
                  { value: 6, label: t.duration6, sub: t.duration6Sub },
                  { value: 12, label: t.duration12, sub: t.duration12Sub },
                ] as { value: GoalDuration; label: string; sub: string }[]).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDuration(opt.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      duration === opt.value
                        ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-pink-200'
                    }`}
                  >
                    <div className="font-semibold">{opt.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Étape 3: Rythme */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                  {t.step3Title}
                </h2>
                <p className="text-sm text-gray-500 mt-2">{t.step3Subtitle}</p>
              </div>

              <div className="space-y-3">
                {([
                  { value: 'doux' as GoalRhythm, label: t.rhythmDoux, sub: t.rhythmDouxSub },
                  { value: 'equilibre' as GoalRhythm, label: t.rhythmEquilibre, sub: t.rhythmEquilibreSub },
                  { value: 'intense' as GoalRhythm, label: t.rhythmIntense, sub: t.rhythmIntenseSub },
                ]).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setRhythm(opt.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                      rhythm === opt.value
                        ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-pink-200'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{opt.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{opt.sub}</div>
                    </div>
                    {rhythm === opt.value && <Check className="w-5 h-5 text-pink-500" />}
                  </button>
                ))}
              </div>

              <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">{t.rhythmWarning}</p>
            </div>
          )}

          {/* Étape 4: Couleur */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                  {t.step4Title}
                </h2>
                <p className="text-sm text-gray-500 mt-2">{t.step4Subtitle}</p>
              </div>

              <div className="flex justify-center gap-6 py-8">
                {([
                  { value: '#f43f5e' as GoalColor, label: t.colorRose, ring: 'ring-rose-400' },
                  { value: '#3b82f6' as GoalColor, label: t.colorBlue, ring: 'ring-blue-400' },
                  { value: '#10b981' as GoalColor, label: t.colorGreen, ring: 'ring-emerald-400' },
                ]).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setColor(opt.value)}
                    className={`flex flex-col items-center gap-2 transition-transform ${
                      color === opt.value ? 'scale-110' : 'hover:scale-105'
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full transition-all ${
                        color === opt.value ? `ring-4 ${opt.ring} ring-offset-2` : ''
                      }`}
                      style={{ backgroundColor: opt.value }}
                    />
                    <span className={`text-sm ${color === opt.value ? 'font-semibold' : 'text-gray-500'}`}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Récapitulatif */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  {color && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />}
                  <span className="font-medium">{goalName}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {duration === 1 && '1 mois'} {duration === 3 && '3 mois'} {duration === 6 && '6 mois'} {duration === 12 && '1 an'} • {rhythm === 'doux' && '🔋 Doux'} {rhythm === 'equilibre' && '⚖️ Équilibré'} {rhythm === 'intense' && '🔥 Intense'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Navigation */}
        <div className="flex gap-3 p-4 border-t border-gray-100 dark:border-gray-800">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.back}
            </Button>
          )}

          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext()}
              className="flex-1 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
            >
              {t.next}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canGoNext() || isSubmitting}
              className="flex-1 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
            >
              {isSubmitting ? t.creating : t.create}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

