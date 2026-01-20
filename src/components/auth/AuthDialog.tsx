'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Mail, Lock, User, Sparkles } from 'lucide-react';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

export function AuthDialog({ isOpen, onClose, defaultMode = 'signin' }: AuthDialogProps) {
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

      // Afficher le succès brièvement
      setSuccess(true);

      // Fermer le dialogue après un court délai
      setTimeout(() => {
        // Réinitialiser le formulaire
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setSuccess(false);
        onClose();
      }, 500);
    } catch (err: any) {
      console.error('Auth error:', err);

      // Messages d'erreur en français
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
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border border-pink-100/50 shadow-2xl shadow-pink-200/50 rounded-[2rem]">
        <DialogHeader className="pb-4 border-b border-pink-100">
          <DialogTitle className="flex items-center gap-3 text-2xl text-gray-800 font-bold">
            <Sparkles className="w-6 h-6 text-pink-500 drop-shadow-lg" />
            {mode === 'signin' ? 'Connexion' : 'Créer un compte'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          {/* Email - Glassmorphism */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-gray-800 font-bold text-sm">
              <Mail className="w-4 h-4 text-pink-500" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="ton-email@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              className="bg-gradient-to-br from-white to-pink-50 border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-xl shadow-md h-12 text-gray-800 font-medium"
            />
          </div>

          {/* Password - Glassmorphism */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2 text-gray-800 font-bold text-sm">
              <Lock className="w-4 h-4 text-pink-500" />
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              minLength={6}
              className="bg-gradient-to-br from-white to-pink-50 border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-xl shadow-md h-12 text-gray-800 font-medium"
            />
          </div>

          {/* Confirm Password (signup only) - Glassmorphism */}
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-gray-800 font-bold text-sm">
                <Lock className="w-4 h-4 text-pink-500" />
                Confirmer le mot de passe
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
                minLength={6}
                className="bg-gradient-to-br from-white to-pink-50 border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-xl shadow-md h-12 text-gray-800 font-medium"
              />
            </div>
          )}

          {/* Error message - Glassmorphism */}
          {error && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200 shadow-lg">
              <p className="text-sm text-red-700 font-semibold">{error}</p>
            </div>
          )}

          {/* Success message - Glassmorphism */}
          {success && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 border border-pink-200 shadow-lg">
              <p className="text-sm text-gray-800 flex items-center gap-2 font-bold">
                <Sparkles className="w-5 h-5 text-pink-500 drop-shadow-lg" />
                {mode === 'signin' ? 'Connexion réussie !' : 'Compte créé avec succès !'}
              </p>
            </div>
          )}

          {/* Submit button - Glassmorphism */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-400 via-rose-400 to-orange-300 hover:from-pink-500 hover:via-rose-500 hover:to-orange-400 text-white rounded-2xl py-7 shadow-2xl shadow-pink-200/50 hover:shadow-pink-300/50 hover:scale-[1.02] transition-all font-bold text-base"
            disabled={loading || success}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {mode === 'signin' ? 'Connexion...' : 'Création du compte...'}
              </>
            ) : success ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 drop-shadow-lg" />
                {mode === 'signin' ? 'Connecté !' : 'Compte créé !'}
              </>
            ) : (
              <>
                {mode === 'signin' ? (
                  <>
                    <User className="w-5 h-5 mr-2" />
                    Se connecter
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Créer mon compte
                  </>
                )}
              </>
            )}
          </Button>

          {/* Switch mode - Glassmorphism */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={switchMode}
              className="text-sm text-pink-600 hover:text-pink-700 hover:underline font-bold transition-colors"
              disabled={loading}
            >
              {mode === 'signin'
                ? "Pas encore de compte ? Créer un compte"
                : "Déjà un compte ? Se connecter"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

