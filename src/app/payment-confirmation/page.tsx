'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/lib/store';
import { Sparkles, CheckCircle2, Heart, Target, Star, ArrowRight } from 'lucide-react';

export default function PaymentConfirmation() {
  const router = useRouter();
  const { user, updateUserPaidStatus } = useAuth();
  const { subscribe, language } = useStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [showThankYou, setShowThankYou] = useState(false);
  const [error, setError] = useState('');

  const texts = {
    fr: {
      processing: 'Confirmation en cours...',
      preparing: 'Glowee prépare ton espace premium ✨',
      thankYouTitle: 'Merci infiniment ! 💖',
      thankYouSubtitle: 'Tu fais maintenant partie de la famille UPGLOW Premium',
      gloweePromise: '"Ma chérie, je suis tellement heureuse que tu me fasses confiance ! Je te promets de tout donner pour t\'aider à atteindre tes objectifs. Ensemble, on va faire de grandes choses ! Tu mérites cette transformation, et je serai là à chaque étape. Prête à briller ? ✨"',
      features: [
        { icon: '🎯', text: 'Objectifs personnalisés illimités' },
        { icon: '🤖', text: 'Assistant Glowee 24/7' },
        { icon: '📊', text: 'Analyses détaillées de tes progrès' },
        { icon: '💪', text: 'Plans d\'action sur mesure' }
      ],
      cta: 'Commencer mon aventure',
      errorTitle: 'Oups ! Une erreur est survenue',
      errorButton: 'Retour à l\'accueil'
    },
    en: {
      processing: 'Confirming...',
      preparing: 'Glowee is preparing your premium space ✨',
      thankYouTitle: 'Thank you so much! 💖',
      thankYouSubtitle: 'You\'re now part of the UPGLOW Premium family',
      gloweePromise: '"My dear, I\'m so happy you trust me! I promise to give my all to help you reach your goals. Together, we\'re going to do great things! You deserve this transformation, and I\'ll be there every step of the way. Ready to shine? ✨"',
      features: [
        { icon: '🎯', text: 'Unlimited personalized goals' },
        { icon: '🤖', text: '24/7 Glowee assistant' },
        { icon: '📊', text: 'Detailed progress analytics' },
        { icon: '💪', text: 'Custom action plans' }
      ],
      cta: 'Start my journey',
      errorTitle: 'Oops! An error occurred',
      errorButton: 'Back to home'
    },
    es: {
      processing: 'Confirmando...',
      preparing: 'Glowee está preparando tu espacio premium ✨',
      thankYouTitle: '¡Muchísimas gracias! 💖',
      thankYouSubtitle: 'Ahora eres parte de la familia UPGLOW Premium',
      gloweePromise: '"Mi querida, ¡estoy tan feliz de que confíes en mí! Te prometo dar todo de mí para ayudarte a alcanzar tus objetivos. ¡Juntas vamos a hacer grandes cosas! Mereces esta transformación, y estaré ahí en cada paso. ¿Lista para brillar? ✨"',
      features: [
        { icon: '🎯', text: 'Objetivos personalizados ilimitados' },
        { icon: '🤖', text: 'Asistente Glowee 24/7' },
        { icon: '📊', text: 'Análisis detallados de tu progreso' },
        { icon: '💪', text: 'Planes de acción a medida' }
      ],
      cta: 'Comenzar mi aventura',
      errorTitle: '¡Ups! Ocurrió un error',
      errorButton: 'Volver al inicio'
    }
  };

  const t = texts[language] || texts.fr;

  useEffect(() => {
    const processPayment = async () => {
      if (!user) {
        router.push('/');
        return;
      }

      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await updateUserPaidStatus();
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1);
        subscribe(endDate.toISOString().split('T')[0]);
        setIsProcessing(false);
        setShowThankYou(true);
      } catch (err: any) {
        console.error('Payment confirmation error:', err);
        setError(err.message || 'Une erreur est survenue');
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [user, router, updateUserPaidStatus, subscribe]);

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
            <h1 className="text-2xl font-bold text-stone-900">{t.errorTitle}</h1>
            <p className="text-stone-600">{error}</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 px-6 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white font-semibold rounded-xl transition-all"
          >
            {t.errorButton}
          </button>
        </div>
      </div>
    );
  }

  if (showThankYou) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
        <div className="max-w-md w-full space-y-6 animate-in fade-in duration-700">
          {/* Glowee joyeuse */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <img
                src="/Glowee/glowee-felicite.webp"
                alt="Glowee"
                className="w-48 h-48 object-contain relative z-10 drop-shadow-2xl animate-bounce"
              />
              <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg animate-pulse">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Message de remerciement */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl shadow-pink-200/50 border border-pink-100/50 text-center space-y-4">
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              {t.thankYouTitle}
            </h1>
            <p className="text-gray-600 font-medium">{t.thankYouSubtitle}</p>
          </div>

          {/* Promesse de Glowee */}
          <div className="bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100 rounded-3xl p-5 shadow-xl border border-pink-200/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <p className="text-gray-700 font-medium italic text-sm leading-relaxed">
                {t.gloweePromise}
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg space-y-3">
            {t.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 animate-in slide-in-from-left duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-gray-700 font-medium text-sm">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => router.push('/')}
            className="w-full py-4 px-6 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-pink-200/50 hover:shadow-pink-300/50 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            {t.cta}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
        <div className="flex justify-center animate-bounce">
          <img src="/Glowee/glowee-felicite.webp" alt="Glowee" className="w-32 h-32 object-contain" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            {t.processing}
          </h1>
          <p className="text-stone-600">{t.preparing}</p>
        </div>
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-rose-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-rose-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

