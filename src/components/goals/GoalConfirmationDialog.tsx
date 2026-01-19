'use client';

import { Sparkles, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface GoalConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  goalName: string;
  tasksCount: number;
  theme?: 'light' | 'dark';
}

export function GoalConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  goalName,
  tasksCount,
  theme = 'light'
}: GoalConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-md ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex flex-col items-center gap-3 mb-2">
              <div className="relative w-20 h-20">
                <Image
                  src="/Glowee/glowee.webp"
                  alt="Glowee"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                Prête à commencer ?
              </span>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center">
            <div className="space-y-4 py-4">
              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-stone-800' : 'bg-gradient-to-br from-rose-50 to-orange-50'}`}>
                <p className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-stone-200' : 'text-stone-900'}`}>
                  Ton objectif :
                </p>
                <p className="text-base font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                  {goalName}
                </p>
              </div>

              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-stone-800' : 'bg-violet-50'}`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-violet-500" />
                  <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-stone-200' : 'text-stone-900'}`}>
                    Plan d'action Glowee
                  </p>
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                  {tasksCount} tâches personnalisées vont être ajoutées à ton planning pour t'aider à atteindre cet objectif ! 🎯
                </p>
              </div>

              <div className={`p-3 rounded-lg border-2 ${theme === 'dark' ? 'bg-stone-800/50 border-green-900' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
                  <p className={`text-xs ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
                    Les tâches seront réparties sur les prochaines semaines selon les dates que j'ai planifiées pour toi
                  </p>
                </div>
              </div>

              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-stone-800' : 'bg-amber-50'}`}>
                <p className={`text-xs italic ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                  "Je suis là pour t'accompagner à chaque étape. Tu peux le faire ! 💛"
                </p>
                <p className={`text-xs font-semibold mt-1 ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
                  - Glowee
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Créer l'objectif
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

