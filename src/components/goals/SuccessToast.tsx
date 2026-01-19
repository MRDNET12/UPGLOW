'use client';

import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface SuccessToastProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  autoCloseDuration?: number; // en millisecondes
}

export function SuccessToast({
  isOpen,
  onClose,
  message,
  autoCloseDuration = 3000
}: SuccessToastProps) {
  useEffect(() => {
    if (isOpen && autoCloseDuration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseDuration, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-0 border-0 bg-transparent shadow-none">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
            </div>
            
            <div className="flex-1 pt-1">
              <p className="text-white font-semibold text-lg leading-tight">
                {message}
              </p>
            </div>

            <button
              onClick={onClose}
              className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Barre de progression */}
          {autoCloseDuration > 0 && (
            <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full animate-progress"
                style={{
                  animation: `progress ${autoCloseDuration}ms linear forwards`
                }}
              />
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes progress {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }
          .animate-progress {
            animation: progress linear forwards;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}

