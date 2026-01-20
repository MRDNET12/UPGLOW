'use client';

import { useState } from 'react';
import { X, Sparkles, Check, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
  onOpenAuthDialog?: () => void;
}

export function SubscriptionPopup({ isOpen, onClose, theme = 'light', onOpenAuthDialog }: SubscriptionPopupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { subscribe } = useStore();
  const { user } = useAuth();

  const handleSubscribe = () => {
    if (!user || !user.email) {
      // Si l'utilisateur n'est pas connecté, fermer ce popup et ouvrir le dialogue d'authentification
      onClose();
      if (onOpenAuthDialog) {
        onOpenAuthDialog();
      }
      return;
    }

    // Si l'utilisateur est connecté, rediriger vers Stripe
    const stripeUrl = `https://buy.stripe.com/bJeaEX4jkevq0yz6Qdf3a00?prefilled_email=${encodeURIComponent(user.email)}`;
    window.location.href = stripeUrl;
  };

  if (!isOpen) return null;

  const features = [
    'Suivi personnalisé avec Glowee',
    'Journal et suivi d\'habitude',
    'Planning et atteindre tes objectifs',
    'Glowee te crée ton planning'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-[2rem] shadow-2xl shadow-pink-200/50 overflow-hidden bg-white/95 backdrop-blur-xl border border-pink-100/50 animate-in zoom-in-95 duration-300">
        {/* Premium Badge Glassmorphism */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-pink-400 via-rose-400 to-orange-300" />

        {/* Close Button Glassmorphism */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full hover:bg-pink-100 shadow-lg shadow-pink-200/50 transition-all"
        >
          <X className="w-5 h-5 text-gray-700" />
        </Button>

        {/* Content */}
        <div className="p-8 space-y-6 pt-10">
          {/* Glowee Image avec effet 3D */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full blur-2xl opacity-40 scale-110"></div>
              <img
                src="/Glowee/glowee-felicite.webp"
                alt="Glowee Premium"
                className="w-32 h-32 object-contain relative z-10 drop-shadow-2xl"
              />
              <Crown className="absolute -top-3 -right-3 w-10 h-10 text-pink-500 drop-shadow-2xl animate-bounce" />
            </div>
          </div>

          {/* Title Glassmorphism */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 bg-clip-text text-transparent leading-tight drop-shadow-lg">
              Continue ton Glow Up ! ✨
            </h2>
            <p className="text-sm leading-relaxed text-gray-700 font-medium">
              Ton essai gratuit est terminé, mais ton voyage ne fait que commencer !
            </p>
          </div>

          {/* Pricing Glassmorphism */}
          <div className="p-6 rounded-2xl text-center space-y-2 bg-gradient-to-br from-pink-50 to-rose-50 shadow-lg border border-pink-100/50">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-6xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent drop-shadow-lg">
                6,99€
              </span>
              <span className="text-lg text-gray-700 font-bold">
                /mois
              </span>
            </div>
          </div>

          {/* Features Glassmorphism */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-white to-pink-50 shadow-md"
              >
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center shadow-lg drop-shadow-lg">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-800 font-semibold">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Glowee Message Glassmorphism */}
          <div className="p-5 rounded-2xl border-l-4 border-pink-400 bg-gradient-to-br from-pink-100 to-rose-100 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="relative w-12 h-12 flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 rounded-2xl blur-md opacity-50"></div>
                <img
                  src="/Glowee/glowee-nav-bar.webp"
                  alt="Glowee"
                  className="w-12 h-12 object-contain relative z-10 drop-shadow-2xl"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-pink-500 mb-2">Glowee</p>
                <p className="text-sm italic text-gray-800 font-medium leading-relaxed">
                  "J'ai envie de t'aider à faire briller ton glow"
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button Glassmorphism */}
          <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-400 via-rose-400 to-orange-300 hover:from-pink-500 hover:via-rose-500 hover:to-orange-400 text-white font-bold py-7 text-lg shadow-2xl shadow-pink-200/50 hover:shadow-pink-300/50 hover:scale-[1.02] transition-all rounded-2xl"
          >
            {isLoading ? (
              'Traitement en cours...'
            ) : (
              <>
                <Sparkles className="w-6 h-6 mr-2 drop-shadow-lg" />
                Je veux Glow up
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

