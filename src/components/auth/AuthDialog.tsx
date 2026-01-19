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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-purple-500" />
            {mode === 'signin' ? 'Connexion' : 'Créer un compte'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
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
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
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
            />
          </div>

          {/* Confirm Password (signup only) */}
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
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
              />
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {mode === 'signin' ? 'Connexion réussie !' : 'Compte créé avec succès !'}
              </p>
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
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
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
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

