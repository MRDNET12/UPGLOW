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
    'Suivi personnalisé avec Glowee, ton coach IA',
    'Journal intime et suivi d\'habitudes quotidiennes',
    'Planning hebdomadaire et atteindre tes objectifs',
    'Glowee te crée ton planning personnalisé',
    'Accès illimité à tous les bonus et contenus'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm rounded-[2rem] shadow-2xl shadow-pink-200/50 overflow-hidden bg-white/95 backdrop-blur-xl border border-pink-100/50 animate-in zoom-in-95 duration-300">
        {/* Premium Badge */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 via-rose-400 to-orange-300" />

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2 z-10 rounded-full hover:bg-pink-100 w-8 h-8"
        >
          <X className="w-4 h-4 text-gray-700" />
        </Button>

        {/* Content - Compact sans espacement inutile */}
        <div className="p-4 space-y-3 pt-7">
          {/* Glowee Image */}
          <div className="flex justify-center -mb-1">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full blur-xl opacity-30"></div>
              <img
                src="/Glowee/glowee-felicite.webp"
                alt="Glowee Premium"
                className="w-20 h-20 object-contain relative z-10 drop-shadow-xl"
              />
              <Crown className="absolute -top-2 -right-2 w-7 h-7 text-pink-500 drop-shadow-xl animate-bounce" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-0.5">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 bg-clip-text text-transparent leading-tight">
              Continue ton Glow Up ! ✨
            </h2>
            <p className="text-xs text-gray-600 font-medium">
              Ton essai gratuit est terminé !
            </p>
          </div>

          {/* Pricing */}
          <div className="p-3 rounded-xl text-center bg-gradient-to-br from-pink-50 to-rose-50 shadow-md border border-pink-100/50">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                6,99€
              </span>
              <span className="text-sm text-gray-700 font-bold">
                /mois
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-1.5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-br from-white to-pink-50 shadow-sm"
              >
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs text-gray-800 font-semibold">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Glowee Message */}
          <div className="p-2.5 rounded-xl border-l-4 border-pink-400 bg-gradient-to-br from-pink-100 to-rose-100">
            <div className="flex items-start gap-2">
              <div className="relative w-8 h-8 flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 rounded-xl blur-sm opacity-40"></div>
                <img
                  src="/Glowee/glowee-nav-bar.webp"
                  alt="Glowee"
                  className="w-8 h-8 object-contain relative z-10 drop-shadow-lg"
                />
              </div>
              <p className="text-xs italic text-gray-800 font-medium leading-relaxed flex-1">
                "J'ai tellement envie de t'accompagner dans ton Glow Up et te voir rayonner chaque jour !"
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-400 via-rose-400 to-orange-300 hover:from-pink-500 hover:via-rose-500 hover:to-orange-400 text-white font-bold py-5 text-base shadow-xl shadow-pink-200/50 hover:shadow-pink-300/50 hover:scale-[1.02] transition-all rounded-xl"
          >
            {isLoading ? (
              'Traitement...'
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Je continue mon Glow Up
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

