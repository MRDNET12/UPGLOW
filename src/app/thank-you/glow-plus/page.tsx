'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/lib/store';
import { CheckCircle2, Heart, Star, ArrowRight, Share2, Users, Sparkles, Crown } from 'lucide-react';

export default function ThankYouGlowPlus() {
  const router = useRouter();
  const { user, updateUserPaidStatus } = useAuth();
  const { subscribeToPlan, language } = useStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const texts = {
    fr: {
      processing: 'Confirmation de ton abonnement...',
      thankYouTitle: 'Merci d\'avoir choisi l\'excellence ! 💖',
      subtitle: 'Tu as choisi Glow Plus',
      message: 'Quel choix extraordinaire ! Avec Glow Plus, tu as accès à TOUT : les 4 fondations essentielles (Message, Victoires, Habitudes, Journal) PLUS le Glow Mirror AI qui va devenir ton coach personnel. Imagine avoir quelqu\'un qui comprend exactement qui tu es et ce dont tu as besoin, 24h/24. C\'est exactement ce que tu viens d\'obtenir !',
      features: [
        '✨ TOUT Glow Start inclus',
        '🔮 Glow Mirror AI - Ton coach personnel',
        '📊 Analyses approfondies de tes progrès',
        '💡 Conseils sur mesure basés sur tes données'
      ],
      shareTitle: 'Partage le Glow avec tes proches 💫',
      shareMessage: 'Si cette app t\'aide vraiment, partage-la avec une amie qui en aurait besoin. Ensemble, on brille plus fort !',
      shareButton: 'Partager l\'app',
      cta: 'Découvrir mon Glow Mirror',
      loading: 'Préparation de ton espace premium...'
    },
    en: {
      processing: 'Confirming your subscription...',
      thankYouTitle: 'Thank you for choosing excellence! 💖',
      subtitle: 'You chose Glow Plus',
      message: 'What an extraordinary choice! With Glow Plus, you have access to EVERYTHING: the 4 essential foundations (Message, Wins, Habits, Journal) PLUS the Glow Mirror AI that will become your personal coach. Imagine having someone who understands exactly who you are and what you need, 24/7. That\'s exactly what you just got!',
      features: [
        '✨ ALL Glow Start included',
        '🔮 Glow Mirror AI - Your personal coach',
        '📊 In-depth analysis of your progress',
        '💡 Tailored advice based on your data'
      ],
      shareTitle: 'Share the Glow with your loved ones 💫',
      shareMessage: 'If this app really helps you, share it with a friend who needs it. Together, we shine brighter!',
      shareButton: 'Share the app',
      cta: 'Discover my Glow Mirror',
      loading: 'Preparing your premium space...'
    },
    es: {
      processing: 'Confirmando tu suscripción...',
      thankYouTitle: '¡Gracias por elegir la excelencia! 💖',
      subtitle: 'Elegiste Glow Plus',
      message: '¡Qué elección tan extraordinaria! Con Glow Plus, tienes acceso a TODO: las 4 bases esenciales (Mensaje, Victorias, Hábitos, Diario) MÁS el Glow Mirror AI que se convertirá en tu coach personal. Imagina tener a alguien que entiende exactamente quién eres y qué necesitas, 24/7. ¡Eso es exactamente lo que acabas de obtener!',
      features: [
        '✨ TODO Glow Start incluido',
        '🔮 Glow Mirror AI - Tu coach personal',
        '📊 Análisis en profundidad de tu progreso',
        '💡 Consejos personalizados basados en tus datos'
      ],
      shareTitle: 'Comparte el Glow con tus seres queridos 💫',
      shareMessage: 'Si esta app realmente te ayuda, compártela con una amiga que la necesite. ¡Juntas brillamos más fuerte!',
      shareButton: 'Compartir la app',
      cta: 'Descubrir mi Glow Mirror',
      loading: 'Preparando tu espacio premium...'
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
        await new Promise(resolve => setTimeout(resolve, 1500));
        await updateUserPaidStatus('glow_plus');
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        subscribeToPlan('glow_plus', endDate.toISOString().split('T')[0]);
        setIsProcessing(false);
        setShowContent(true);
      } catch (err: any) {
        console.error('Payment confirmation error:', err);
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [user, router, updateUserPaidStatus, subscribeToPlan]);

  const handleShare = async () => {
    const shareData = {
      title: 'UPGLOW - Transforme ta vie',
      text: language === 'fr' 
        ? 'Cette app m\'aide tellement à devenir la meilleure version de moi-même. Essaie-la ! ✨'
        : language === 'en'
        ? 'This app helps me so much to become the best version of myself. Try it! ✨'
        : '¡Esta app me ayuda tanto a convertirme en la mejor versión de mí misma. ¡Pruébala! ✨',
      url: 'https://upglow.app'
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert(language === 'fr' ? 'Lien copié !' : language === 'en' ? 'Link copied!' : '¡Enlace copiado!');
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
          <div className="flex justify-center animate-bounce">
            <img src="/Glowee/glowee-felicite.webp" alt="Glowee" className="w-32 h-32 object-contain" />
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {t.processing}
            </h1>
            <p className="text-stone-600">{t.loading}</p>
          </div>
          <div className="flex justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-violet-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-violet-500 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 overflow-y-auto">
      <div className="max-w-md w-full space-y-6 animate-in fade-in duration-700 py-8">
        {/* Badge Premium */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold shadow-lg">
            <Crown className="w-5 h-5" />
            <span>PREMIUM</span>
          </div>
        </div>

        {/* Glowee joyeuse */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-300 to-pink-300 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <img
              src="/Glowee/glowee-felicite.webp"
              alt="Glowee"
              className="w-32 h-32 object-contain relative z-10 drop-shadow-2xl animate-bounce"
            />
            <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg animate-pulse">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Message de remerciement */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl shadow-violet-200/50 border border-violet-100/50 text-center space-y-4">
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {t.thankYouTitle}
          </h1>
          <p className="text-violet-600 font-bold text-lg">{t.subtitle}</p>
        </div>

        {/* Message explicatif */}
        <div className="bg-gradient-to-br from-violet-100 via-purple-100 to-pink-100 rounded-3xl p-5 shadow-xl border border-violet-200/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <p className="text-gray-700 font-medium text-sm leading-relaxed">{t.message}</p>
          </div>
        </div>

        {/* Features incluses */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500" />
            {language === 'fr' ? 'Ton pack Premium inclus :' : language === 'en' ? 'Your Premium pack includes:' : 'Tu pack Premium incluye:'}
          </h3>
          <div className="space-y-2">
            {t.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-violet-50/50">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section partage */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-5 shadow-lg border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-blue-800 text-sm">{t.shareTitle}</h3>
          </div>
          <p className="text-blue-700 text-xs mb-4 leading-relaxed">{t.shareMessage}</p>
          <button
            onClick={handleShare}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-200/50 transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            {t.shareButton}
          </button>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push('/')}
          className="w-full py-4 px-6 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-violet-200/50 hover:shadow-violet-300/50 hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          {t.cta}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
