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
      <DialogContent className="sm:max-w-md bg-cream-100 border-none shadow-soft-xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-navy-900">
            <Sparkles className="w-5 h-5 text-peach-500" />
            {mode === 'signin' ? 'Connexion' : 'Créer un compte'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-navy-900 font-semibold">
              <Mail className="w-4 h-4 text-peach-500" />
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
              className="bg-white border-stone-200 focus:border-peach-400 focus:ring-peach-400 rounded-xl"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2 text-navy-900 font-semibold">
              <Lock className="w-4 h-4 text-peach-500" />
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
              className="bg-white border-stone-200 focus:border-peach-400 focus:ring-peach-400 rounded-xl"
            />
          </div>

          {/* Confirm Password (signup only) */}
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-navy-900 font-semibold">
                <Lock className="w-4 h-4 text-peach-500" />
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
                className="bg-white border-stone-200 focus:border-peach-400 focus:ring-peach-400 rounded-xl"
              />
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 shadow-soft">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-peach-100 to-soft-orange-100 border border-peach-200 shadow-soft">
              <p className="text-sm text-navy-900 flex items-center gap-2 font-semibold">
                <Sparkles className="w-4 h-4 text-peach-500" />
                {mode === 'signin' ? 'Connexion réussie !' : 'Compte créé avec succès !'}
              </p>
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-peach-400 to-soft-orange-400 hover:from-peach-500 hover:to-soft-orange-500 text-white rounded-2xl py-6 shadow-soft-lg font-semibold"
            disabled={loading || success}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {mode === 'signin' ? 'Connexion...' : 'Création du compte...'}
              </>
            ) : success ? (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {mode === 'signin' ? 'Connecté !' : 'Compte créé !'}
              </>
            ) : (
              <>
                {mode === 'signin' ? (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Se connecter
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Créer mon compte
                  </>
                )}
              </>
            )}
          </Button>

          {/* Switch mode */}
          <div className="text-center">
            <button
              type="button"
              onClick={switchMode}
              className="text-sm text-peach-600 hover:text-peach-700 hover:underline font-medium"
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

