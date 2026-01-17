'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GloweePopupProps {
  message: string;
  gloweeImage?: string;
  onClose?: () => void;
  autoClose?: number; // Durée en ms avant fermeture auto (optionnel)
  theme?: 'light' | 'dark';
}

export function GloweePopup({
  message,
  gloweeImage = '/Glowee/glowee-acceuillante.webp',
  onClose,
  autoClose,
  theme = 'light'
}: GloweePopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation d'entrée
    setTimeout(() => setIsVisible(true), 100);

    // Auto-close si spécifié
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Attendre la fin de l'animation
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div 
        className={`
          relative max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden
          transition-all duration-500 ease-out
          ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}
          ${theme === 'dark' ? 'bg-stone-900 text-stone-100' : 'bg-white text-stone-900'}
        `}
      >
        {/* Close Button */}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        )}

        {/* Content */}
        <div className="flex items-center gap-4 p-6">
          {/* Glowee Image - Left */}
          <div className="flex-shrink-0 animate-in zoom-in duration-500">
            <img 
              src={gloweeImage} 
              alt="Glowee" 
              className="w-24 h-24 object-contain"
            />
          </div>

          {/* Message - Right */}
          <div className="flex-1 animate-in slide-in-from-right duration-500 delay-200">
            <p className={`text-base leading-relaxed whitespace-pre-line ${
              theme === 'dark' ? 'text-stone-200' : 'text-stone-700'
            }`}>
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

