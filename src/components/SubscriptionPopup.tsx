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
}

export function SubscriptionPopup({ isOpen, onClose, theme = 'light' }: SubscriptionPopupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { subscribe } = useStore();
  const { user } = useAuth();

  const handleSubscribe = () => {
    if (!user || !user.email) {
      alert('Vous devez être connecté pour vous abonner');
      return;
    }

    // Créer le lien Stripe avec l'email de l'utilisateur
    const stripeUrl = `https://buy.stripe.com/bJeaEX4jkevq0yz6Qdf3a00?prefilled_email=${encodeURIComponent(user.email)}`;

    // Rediriger vers Stripe
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className={`
          relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden
          ${theme === 'dark' ? 'bg-stone-900 text-stone-100' : 'bg-white text-stone-900'}
          animate-in zoom-in-95 duration-300
        `}
      >
        {/* Premium Badge */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300" />

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2 z-10 rounded-full h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Glowee Image */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src="/Glowee/glowee-felicite.webp"
                alt="Glowee Premium"
                className="w-24 h-24 object-contain"
              />
              <Crown className="absolute -top-1 -right-1 w-7 h-7 text-yellow-400" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-1.5">
            <h2 className="text-xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent leading-tight">
              Continue ton Glow Up ! ✨
            </h2>
            <p className={`text-sm leading-snug ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
              Ton essai gratuit est terminé, mais ton voyage ne fait que commencer !
            </p>
          </div>

          {/* Pricing */}
          <div className={`
            p-4 rounded-xl text-center space-y-1
            ${theme === 'dark' ? 'bg-stone-800/50' : 'bg-gradient-to-br from-rose-50 to-pink-50'}
          `}>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-4xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                6,99€
              </span>
              <span className={`text-base ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                /mois
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5"
              >
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className={`text-sm ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Glowee Message */}
          <div className={`
            p-3 rounded-xl border-2
            ${theme === 'dark' ? 'bg-rose-900/20 border-rose-800/30' : 'bg-rose-50 border-rose-200'}
          `}>
            <div className="flex items-start gap-2">
              <img
                src="/Glowee/glowee-nav-bar.webp"
                alt="Glowee"
                className="w-8 h-8 object-contain flex-shrink-0"
              />
              <div>
                <p className="text-xs font-semibold text-rose-500 mb-0.5">Glowee</p>
                <p className={`text-sm italic ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
                  "J'ai envie de t'aider à faire briller ton glow"
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white font-semibold py-5 text-base shadow-lg hover:shadow-xl transition-all"
          >
            {isLoading ? (
              'Traitement en cours...'
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Commencer mon abonnement
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

