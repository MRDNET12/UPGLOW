'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/lib/store';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function PaymentConfirmation() {
  const router = useRouter();
  const { user, userData, updateUserPaidStatus } = useAuth();
  const { subscribe } = useStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const processPayment = async () => {
      // Vérifier que l'utilisateur est connecté
      if (!user) {
        router.push('/');
        return;
      }

      try {
        // Attendre un peu pour l'effet de chargement
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mettre à jour hasPaid dans Firestore
        await updateUserPaidStatus();

        // Activer l'abonnement dans le store local
        // L'abonnement Stripe est actif (avec ou sans trial)
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1); // 1 an dans le futur
        subscribe(endDate.toISOString().split('T')[0]);

        // Attendre encore un peu pour montrer le succès
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Rediriger vers l'application
        router.push('/');
      } catch (err: any) {
        console.error('Payment confirmation error:', err);
        setError(err.message || 'Une erreur est survenue');
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [user, router, updateUserPaidStatus]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-4xl">❌</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-stone-900">
              Oups ! Une erreur est survenue
            </h1>
            <p className="text-stone-600">
              {error}
            </p>
          </div>

          <button
            onClick={() => router.push('/')}
            className="w-full py-3 px-6 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white font-semibold rounded-xl transition-all"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
        {isProcessing ? (
          <>
            {/* Glowee Image */}
            <div className="flex justify-center animate-bounce">
              <img
                src="/Glowee/glowee-felicite.webp"
                alt="Glowee"
                className="w-32 h-32 object-contain"
              />
            </div>

            {/* Loading Message */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                Confirmation en cours...
              </h1>
              <p className="text-stone-600">
                Glowee prépare ton espace premium ✨
              </p>
            </div>

            {/* Loader */}
            <div className="flex justify-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-rose-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-rose-500 rounded-full animate-spin"></div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src="/Glowee/glowee-felicite.webp"
                  alt="Glowee"
                  className="w-40 h-40 object-contain"
                />
                <CheckCircle2 className="absolute -top-2 -right-2 w-12 h-12 text-green-500 animate-bounce" />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                Bienvenue dans UPGLOW Premium ! 🎉
              </h1>
              <p className="text-stone-600">
                Ton paiement a été confirmé avec succès !
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-green-600">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Redirection en cours...</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

