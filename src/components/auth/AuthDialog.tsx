'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Mail, Lock, User, Sparkles, Heart } from 'lucide-react';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
  onSuccess?: () => void;
}

export function AuthDialog({ isOpen, onClose, defaultMode = 'signin', onSuccess }: AuthDialogProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }

      setSuccess(true);

      setTimeout(() => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setSuccess(false);
        onSuccess?.();
        onClose();
      }, 500);
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.message.includes('email-already-in-use')) {
        setError('Cet email est déjà utilisé');
      } else if (err.message.includes('invalid-email')) {
        setError('Email invalide');
      } else if (err.message.includes('user-not-found')) {
        setError('Aucun compte trouvé avec cet email');
      } else if (err.message.includes('wrong-password')) {
        setError('Mot de passe incorrect');
      } else {
        setError(err.message || 'Une erreur est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#E9D8FD] border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
        {/* Cute Header Graphic */}
        <div className="relative h-32 bg-purple-200/50 flex items-center justify-center overflow-hidden">
          {/* Character */}
          <div className="absolute bottom-[-10px]">
            <svg width="120" height="120" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 80 C 20 40, 60 20, 80 30 C 110 40, 130 70, 120 100 C 110 130, 60 140, 40 130 C 10 120, 20 100, 30 80 Z" fill="#fff" />
              <circle cx="65" cy="85" r="3.5" fill="#000" />
              <circle cx="95" cy="85" r="3.5" fill="#000" />
              <path d="M68 100 Q 80 115 92 100" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="58" cy="92" r="5" fill="#FAA2C1" opacity="0.6" />
              <circle cx="102" cy="92" r="5" fill="#FAA2C1" opacity="0.6" />
            </svg>
          </div>

          <div className="absolute top-4 right-4 animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="p-8 pt-4">
          <DialogHeader className="mb-6 text-center">
            <DialogTitle className="text-2xl font-black text-[#2D2a2e] flex items-center justify-center gap-2">
              {mode === 'signin' ? 'Bon retour !' : 'Rejoins le club'}
            </DialogTitle>
            <p className="text-sm text-[#2D2a2e]/60 font-medium mt-1">
              {mode === 'signin'
                ? 'Prête à continuer ton glow up ?'
                : 'Commence ta transformation aujourd\'hui'
              }
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-[#2D2a2e] uppercase tracking-wider ml-1">
                Email
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
                  <Mail className="w-4 h-4" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@glowup.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="bg-white/80 border-none rounded-2xl h-12 pl-10 text-[#2D2a2e] placeholder:text-gray-400 focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold text-[#2D2a2e] uppercase tracking-wider ml-1">
                {mode === 'signin' ? 'Mot de passe' : 'Choisis un mot de passe'}
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
                  <Lock className="w-4 h-4" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  minLength={6}
                  className="bg-white/80 border-none rounded-2xl h-12 pl-10 text-[#2D2a2e] placeholder:text-gray-400 focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            {/* Confirm Password (signup only) */}
            {mode === 'signup' && (
              <div className="space-y-1.5 animate-in slide-in-from-top-2">
                <Label htmlFor="confirmPassword" className="text-xs font-bold text-[#2D2a2e] uppercase tracking-wider ml-1">
                  Confirmer
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                    minLength={6}
                    className="bg-white/80 border-none rounded-2xl h-12 pl-10 text-[#2D2a2e] placeholder:text-gray-400 focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="p-3 rounded-xl bg-red-100 text-red-600 text-xs font-bold text-center animate-in shake">
                {error}
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in zoom-in">
                <Sparkles className="w-4 h-4" />
                {mode === 'signin' ? 'Connexion réussie !' : 'Compte créé !'}
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white rounded-2xl h-12 font-bold shadow-lg shadow-purple-900/10 mt-2 transition-all hover:scale-[1.02] active:scale-95"
              disabled={loading || success}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  {mode === 'signin' ? 'Se connecter' : 'Créer mon compte'}
                  <Heart className="w-4 h-4 fill-white" />
                </span>
              )}
            </Button>

            {/* Switch mode */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={switchMode}
                className="text-xs text-[#2D2a2e]/60 hover:text-[#2D2a2e] font-bold transition-colors underline decoration-dotted"
                disabled={loading}
              >
                {mode === 'signin'
                  ? "Pas encore de compte ? Créer un compte"
                  : "Déjà un compte ? Se connecter"}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
