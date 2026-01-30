'use client';

import { useState } from 'react';
import { X, Sparkles, Check, Crown, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/lib/store';

interface SubscriptionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthDialog?: () => void;
  source?: 'button' | 'trial_expired'; // 'button' = Plan Pro button, 'trial_expired' = trial ended
}

// Nouveau lien Stripe unifié pour tous les popups
const STRIPE_LINK = 'https://buy.stripe.com/9B69AT178gDybddgqNf3a02';

export function SubscriptionPopup({ isOpen, onClose, source = 'trial_expired' }: SubscriptionPopupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showTrialExtension, setShowTrialExtension] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { signUp } = useAuth();
  const { registerUser, markTrialPopupSeen } = useStore();

  const handleSubscribe = () => {
    if (!user || !user.email) {
      // Rediriger vers Stripe avec email d'exemple
      window.location.href = STRIPE_LINK;
      return;
    }

    // Si l'utilisateur est connecté, rediriger vers Stripe avec son email
    const stripeUrl = `${STRIPE_LINK.split('?')[0]}?prefilled_email=${encodeURIComponent(user.email)}`;
    window.location.href = stripeUrl;
  };

  const handleClose = () => {
    // Si ouvert depuis le bouton Plan Pro, fermer simplement
    if (source === 'button') {
      onClose();
      return;
    }
    // Si trial expiré, afficher le popup d'extension de trial
    setShowTrialExtension(true);
  };

  const handleRegister = async () => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await signUp(email, password);
      registerUser();
      markTrialPopupSeen();

      // Rediriger vers Stripe avec 3 jours d'essai
      const stripeUrlWithTrial = `${STRIPE_LINK.split('?')[0]}?prefilled_email=${encodeURIComponent(email)}&trial_from_plan=true`;
      window.location.href = stripeUrlWithTrial;
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Une erreur est survenue. Réessaie plus tard.');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const features = [
    'Accéder à toutes les fonctionnalités',
    'Aider nous à améliorer l\'app'
  ];

  // Popup d'extension de trial (3 jours gratuits) - NON FERMABLE
  if (showTrialExtension) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-in fade-in duration-300">
        <div className="relative w-full max-w-sm rounded-[1.5rem] shadow-2xl shadow-pink-200/50 overflow-hidden bg-white/95 backdrop-blur-xl border border-pink-100/50 animate-in zoom-in-95 duration-300">
          {/* Premium Badge */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 via-rose-400 to-orange-300" />

          {/* Content */}
          <div className="px-5 py-5">
            {/* Glowee Image */}
            <div className="flex justify-center mb-3">
              <img
                src="/Glowee/glowee-encouragement.webp"
                alt="Glowee"
                className="w-20 h-20 object-contain drop-shadow-xl"
              />
            </div>

            {/* Title */}
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 bg-clip-text text-transparent leading-tight mb-1">
                Attends ! 🎁 3 jours gratuits
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                Inscris-toi et profite de <span className="font-bold text-pink-500">3 jours supplémentaires gratuits</span> avant que ton abonnement ne démarre !
              </p>
              <p className="text-[10px] text-gray-500 mt-1">
                Seulement 3,99€/mois après. Annule quand tu veux !
              </p>
            </div>

            {/* Registration Form */}
            <div className="space-y-2">
              {error && (
                <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                  {error}
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Ton email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-10 text-sm bg-gray-50 border-gray-200 rounded-xl"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Mot de passe (min. 6 caractères)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 h-10 text-sm bg-gray-50 border-gray-200 rounded-xl"
                />
              </div>

              <Button
                onClick={handleRegister}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-400 via-rose-400 to-orange-300 hover:from-pink-500 hover:via-rose-500 hover:to-orange-400 text-white font-bold py-5 text-sm shadow-xl shadow-pink-200/50 rounded-xl mt-2"
              >
                {isLoading ? (
                  'Redirection...'
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Obtenir 3 jours gratuits
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Popup principal d'abonnement
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm rounded-[1.5rem] shadow-2xl shadow-pink-200/50 overflow-hidden bg-white/95 backdrop-blur-xl border border-pink-100/50 animate-in zoom-in-95 duration-300">
        {/* Premium Badge */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 via-rose-400 to-orange-300" />

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 rounded-full hover:bg-pink-100 w-7 h-7"
        >
          <X className="w-4 h-4 text-gray-500" />
        </Button>

        {/* Content */}
        <div className="px-5 py-5 pt-6">
          {/* Glowee Image */}
          <div className="flex justify-center mb-2">
            <div className="relative">
              <img
                src="/Glowee/glowee-felicite.webp"
                alt="Glowee Premium"
                className="w-14 h-14 object-contain drop-shadow-xl"
              />
              <Crown className="absolute -top-1 -right-1 w-5 h-5 text-pink-500 drop-shadow-xl animate-bounce" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-3">
            <h2 className="text-lg font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 bg-clip-text text-transparent leading-tight">
              Continue ton Glow Up ! ✨
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Ton essai gratuit est terminé, mais ton voyage ne fait que commencer !
            </p>
          </div>

          {/* Pricing */}
          <div className="p-2.5 rounded-xl text-center bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100/50 mb-3">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                3,99€
              </span>
              <span className="text-sm text-gray-700 font-bold">
                /mois
              </span>
            </div>
          </div>

          {/* Features - Sans carte, juste liste */}
          <div className="space-y-1 mb-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
                <span className="text-xs text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-400 via-rose-400 to-orange-300 hover:from-pink-500 hover:via-rose-500 hover:to-orange-400 text-white font-bold py-5 text-sm shadow-xl shadow-pink-200/50 hover:scale-[1.02] transition-all rounded-xl"
          >
            {isLoading ? (
              'Traitement...'
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Je continue mon Glow Up
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

