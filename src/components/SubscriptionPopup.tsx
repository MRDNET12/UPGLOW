'use client';

import { useState } from 'react';
import { X, Sparkles, Check, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

interface SubscriptionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export function SubscriptionPopup({ isOpen, onClose, theme = 'light' }: SubscriptionPopupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { subscribe } = useStore();

  const handleSubscribe = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Intégrer Stripe ou autre système de paiement ici
      // Pour l'instant, on simule l'abonnement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Calculer la date de fin d'abonnement (1 mois)
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      const endDateString = endDate.toISOString().split('T')[0];
      
      subscribe(endDateString);
      
      alert('🎉 Bienvenue dans la communauté UPGLOW Premium !');
      onClose();
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Une erreur est survenue. Réessaie plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const features = [
    'Accès illimité à tous les challenges',
    'Nouveau contenu chaque semaine',
    'Suivi personnalisé avec Glowee',
    'Journal et trackers avancés',
    'Vision board illimité',
    'Communauté exclusive',
    'Support prioritaire'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className={`
          relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden
          ${theme === 'dark' ? 'bg-stone-900 text-stone-100' : 'bg-white text-stone-900'}
          animate-in zoom-in-95 duration-300
        `}
      >
        {/* Premium Badge */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300" />

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Glowee Image */}
          <div className="flex justify-center animate-in zoom-in duration-500">
            <div className="relative">
              <img
                src="/Glowee/glowee-felicite.webp"
                alt="Glowee Premium"
                className="w-40 h-40 object-contain"
              />
              <Crown className="absolute -top-2 -right-2 w-10 h-10 text-yellow-400 animate-bounce" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Continue ton Glow Up ! ✨
            </h2>
            <p className={`text-base ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
              Ton essai gratuit est terminé, mais ton voyage ne fait que commencer !
            </p>
          </div>

          {/* Pricing */}
          <div className={`
            p-6 rounded-2xl text-center space-y-2
            ${theme === 'dark' ? 'bg-stone-800/50' : 'bg-gradient-to-br from-rose-50 to-pink-50'}
          `}>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                6,99€
              </span>
              <span className={`text-lg ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                /mois
              </span>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
              Annule à tout moment
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 animate-in slide-in-from-left duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className={`text-sm ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all"
          >
            {isLoading ? (
              'Traitement en cours...'
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Commencer mon abonnement
              </>
            )}
          </Button>

          {/* Footer */}
          <p className={`text-xs text-center ${theme === 'dark' ? 'text-stone-500' : 'text-stone-500'}`}>
            En t'abonnant, tu acceptes nos conditions d'utilisation et notre politique de confidentialité.
          </p>
        </div>
      </div>
    </div>
  );
}

