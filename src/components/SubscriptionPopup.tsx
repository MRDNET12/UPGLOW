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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-3xl shadow-soft-xl overflow-hidden bg-cream-100 border-none animate-in zoom-in-95 duration-300">
        {/* Premium Badge */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-peach-400 via-soft-orange-400 to-soft-purple-400" />

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 rounded-full hover:bg-white shadow-soft"
        >
          <X className="w-5 h-5 text-navy-900" />
        </Button>

        {/* Content */}
        <div className="p-6 space-y-5 pt-8">
          {/* Glowee Image */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src="/Glowee/glowee-felicite.webp"
                alt="Glowee Premium"
                className="w-28 h-28 object-contain"
              />
              <Crown className="absolute -top-2 -right-2 w-8 h-8 text-soft-orange-500" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-peach-500 via-soft-orange-500 to-soft-purple-500 bg-clip-text text-transparent leading-tight">
              Continue ton Glow Up ! ✨
            </h2>
            <p className="text-sm leading-snug text-stone-600">
              Ton essai gratuit est terminé, mais ton voyage ne fait que commencer !
            </p>
          </div>

          {/* Pricing */}
          <div className="p-5 rounded-2xl text-center space-y-1 bg-gradient-to-br from-peach-100 to-soft-orange-100 shadow-soft">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold bg-gradient-to-r from-peach-600 to-soft-orange-600 bg-clip-text text-transparent">
                6,99€
              </span>
              <span className="text-base text-stone-600 font-medium">
                /mois
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-peach-400 to-soft-orange-400 flex items-center justify-center shadow-soft">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm text-navy-900 font-medium">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Glowee Message */}
          <div className="p-4 rounded-2xl border-2 bg-peach-50 border-peach-200 shadow-soft">
            <div className="flex items-start gap-3">
              <img
                src="/Glowee/glowee-nav-bar.webp"
                alt="Glowee"
                className="w-10 h-10 object-contain flex-shrink-0"
              />
              <div>
                <p className="text-xs font-bold text-peach-600 mb-1">Glowee</p>
                <p className="text-sm italic text-navy-900">
                  "J'ai envie de t'aider à faire briller ton glow"
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-peach-400 to-soft-orange-400 hover:from-peach-500 hover:to-soft-orange-500 text-white font-bold py-6 text-base shadow-soft-lg hover:shadow-soft-xl transition-all rounded-2xl"
          >
            {isLoading ? (
              'Traitement en cours...'
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Je veux Glow up
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

