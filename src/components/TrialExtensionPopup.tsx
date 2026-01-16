'use client';

import { useState } from 'react';
import { X, Sparkles, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import { useAuth } from '@/contexts/AuthContext';

interface TrialExtensionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export function TrialExtensionPopup({ isOpen, onClose, theme = 'light' }: TrialExtensionPopupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { registerUser, markTrialPopupSeen } = useStore();
  const { signUp } = useAuth();

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
      // Créer le compte Firebase
      await signUp(email, password);

      // Mettre à jour le store local
      registerUser();
      markTrialPopupSeen();

      // Afficher un message de succès
      alert('🎉 Félicitations ! Tu as débloqué 3 jours supplémentaires gratuits !');
      onClose();
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Une erreur est survenue. Réessaie plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    markTrialPopupSeen();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className={`
          relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden
          ${theme === 'dark' ? 'bg-stone-900 text-stone-100' : 'bg-white text-stone-900'}
          animate-in zoom-in-95 duration-300
        `}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSkip}
          className="absolute top-4 right-4 z-10 rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Glowee Image */}
          <div className="flex justify-center animate-in zoom-in duration-500">
            <img 
              src="/Glowee/glowee-encouragement.webp" 
              alt="Glowee" 
              className="w-32 h-32 object-contain"
            />
          </div>

          {/* Message */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Hey ! C'est Glowee 💫
            </h2>
            <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
              Je vois que tu apprécies ton parcours de transformation ! 🌟
            </p>
            <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
              Bonne nouvelle : <span className="font-bold text-rose-500">inscris-toi maintenant</span> et je t'offre <span className="font-bold text-rose-500">3 jours supplémentaires gratuits</span> pour continuer ton glow up ! ✨
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
              C'est pour ton bien, je suis là pour toi ! 💖
            </p>
          </div>

          {/* Registration Form */}
          <div className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`} />
                <Input
                  type="email"
                  placeholder="Ton email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 ${
                    theme === 'dark'
                      ? 'bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-500'
                      : 'bg-stone-50 border-stone-200 text-stone-900 placeholder:text-stone-400'
                  }`}
                />
              </div>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`} />
                <Input
                  type="password"
                  placeholder="Mot de passe (min. 6 caractères)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 ${
                    theme === 'dark'
                      ? 'bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-500'
                      : 'bg-stone-50 border-stone-200 text-stone-900 placeholder:text-stone-400'
                  }`}
                />
              </div>
            </div>

            <Button
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white font-semibold py-6 text-lg"
            >
              {isLoading ? (
                'Inscription en cours...'
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Débloquer 3 jours gratuits
                </>
              )}
            </Button>

            <button
              onClick={handleSkip}
              className={`w-full text-sm ${theme === 'dark' ? 'text-stone-400 hover:text-stone-300' : 'text-stone-600 hover:text-stone-900'} transition-colors`}
            >
              Peut-être plus tard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

