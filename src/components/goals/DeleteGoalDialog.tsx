'use client';

import { useState } from 'react';
import { X, Trash2, CheckCircle, AlertCircle, Calendar, Shuffle, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type DeletionReason = 'achieved' | 'difficult' | 'hard_to_follow' | 'incoherent' | 'other_goal';

interface DeleteGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: DeletionReason) => void;
  goalName: string;
  language?: 'fr' | 'en' | 'es';
}

const translations = {
  fr: {
    title: 'Supprimer cet objectif ?',
    subtitle: 'Avant de supprimer, dis-nous pourquoi :',
    warning: 'Cette action supprimera aussi toutes les tâches liées à cet objectif.',
    achieved: '🎉 Objectif atteint !',
    difficult: '😓 Objectif trop difficile',
    hard_to_follow: '📅 Le planning Glowee est pas facile à suivre',
    incoherent: '🤔 Le planning Glowee est incohérent',
    other_goal: '🎯 J\'ai un autre objectif',
    cancel: 'Annuler',
    confirm: 'Supprimer',
    otherGoalTip: '💡 C\'est normal de changer d\'objectif ! Tes priorités évoluent, et c\'est une force.',
  },
  en: {
    title: 'Delete this goal?',
    subtitle: 'Before deleting, tell us why:',
    warning: 'This action will also delete all tasks linked to this goal.',
    achieved: '🎉 Goal achieved!',
    difficult: '😓 Goal too difficult',
    hard_to_follow: '📅 Glowee planning is hard to follow',
    incoherent: '🤔 Glowee planning is incoherent',
    other_goal: '🎯 I have another goal',
    cancel: 'Cancel',
    confirm: 'Delete',
    otherGoalTip: '💡 It\'s normal to change goals! Your priorities evolve, and that\'s a strength.',
  },
  es: {
    title: '¿Eliminar este objetivo?',
    subtitle: 'Antes de eliminar, dinos por qué:',
    warning: 'Esta acción también eliminará todas las tareas vinculadas a este objetivo.',
    achieved: '🎉 ¡Objetivo alcanzado!',
    difficult: '😓 Objetivo demasiado difícil',
    hard_to_follow: '📅 La planificación de Glowee es difícil de seguir',
    incoherent: '🤔 La planificación de Glowee es incoherente',
    other_goal: '🎯 Tengo otro objetivo',
    cancel: 'Cancelar',
    confirm: 'Eliminar',
    otherGoalTip: '💡 ¡Es normal cambiar de objetivo! Tus prioridades evolucionan, y eso es una fortaleza.',
  },
};

export function DeleteGoalDialog({ isOpen, onClose, onConfirm, goalName, language = 'fr' }: DeleteGoalDialogProps) {
  const [selectedReason, setSelectedReason] = useState<DeletionReason | null>(null);
  const t = translations[language];

  const reasons: { key: DeletionReason; label: string; icon: React.ReactNode }[] = [
    { key: 'achieved', label: t.achieved, icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
    { key: 'difficult', label: t.difficult, icon: <AlertCircle className="w-5 h-5 text-orange-500" /> },
    { key: 'hard_to_follow', label: t.hard_to_follow, icon: <Calendar className="w-5 h-5 text-blue-500" /> },
    { key: 'incoherent', label: t.incoherent, icon: <Shuffle className="w-5 h-5 text-purple-500" /> },
    { key: 'other_goal', label: t.other_goal, icon: <Target className="w-5 h-5 text-pink-500" /> },
  ];

  const handleConfirm = () => {
    if (selectedReason) {
      onConfirm(selectedReason);
      setSelectedReason(null);
    }
  };

  const handleClose = () => {
    setSelectedReason(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            {t.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-center text-gray-600 dark:text-gray-400 font-medium">
            "{goalName}"
          </p>
          <p className="text-sm text-center text-gray-500">{t.subtitle}</p>

          <div className="space-y-2">
            {reasons.map((reason) => (
              <button
                key={reason.key}
                onClick={() => setSelectedReason(reason.key)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  selectedReason === reason.key
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {reason.icon}
                <span className="text-sm font-medium">{reason.label}</span>
              </button>
            ))}
          </div>

          {selectedReason === 'other_goal' && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">{t.otherGoalTip}</p>
            </div>
          )}

          <p className="text-xs text-center text-red-500 dark:text-red-400">{t.warning}</p>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={handleClose} className="flex-1 rounded-xl">
              {t.cancel}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedReason}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl disabled:opacity-50"
            >
              {t.confirm}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

