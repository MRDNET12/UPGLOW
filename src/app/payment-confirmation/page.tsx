'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/lib/store';
import { Sparkles, CheckCircle2, Heart, Star, ArrowRight, Share2, Users } from 'lucide-react';

function PaymentConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, updateUserPaidStatus } = useAuth();
  const { subscribeToPlan, language } = useStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [showThankYou, setShowThankYou] = useState(false);
  const [error, setError] = useState('');
  
  // Get plan from URL params
  const planType = (searchParams?.get('plan') as 'glow_start' | 'glow_plus') || 'glow_plus';

  const texts = {
    fr: {
      processing: 'Confirmation en cours...',
      preparing: 'Glowee prépare ton espace premium ✨',
      thankYouTitle: 'Merci infiniment ! 💖',
      thankYouSubtitleStart: 'Tu as choisi Glow Start',
      thankYouSubtitlePlus: 'Tu as choisi Glow Plus',
      glowStartMessage: 'Excellent choix ! Avec Glow Start, tu vas pouvoir te reconnecter à toi-même grâce au Message à Moi, célébrer tes Petites Victoires, construire de meilleures Habitudes et suivre ton évolution dans ton Journal. Ces 4 outils sont la base d\'une transformation durable. Tu as fait le premier pas vers une meilleure version de toi !',
      glowPlusMessage: 'Quel choix extraordinaire ! Avec Glow Plus, tu as accès à TOUT : les 4 fondations essentielles (Message, Victoires, Habitudes, Journal) PLUS le Glow Mirror AI qui va devenir ton coach personnel. Imagine avoir quelqu\'un qui comprend exactement qui tu es et ce dont tu as besoin, 24h/24. C\'est exactement ce que tu viens d\'obtenir !',
      shareTitle: 'Partage le Glow avec tes proches 💫',
      shareMessage: 'Si cette app t\'aide vraiment, partage-la avec une amie qui en aurait besoin. Ensemble, on brille plus fort !',
      shareButton: 'Partager l\'app',
      ctaStart: 'Commencer ma transformation',
      ctaPlus: 'Découvrir mon Glow Mirror',
      errorTitle: 'Oups ! Une erreur est survenue',
      errorButton: 'Retour à l\'accueil'
    },
    en: {
      processing: 'Confirming...',
      preparing: 'Glowee is preparing your premium space ✨',
      thankYouTitle: 'Thank you so much! 💖',
      thankYouSubtitleStart: 'You chose Glow Start',
      thankYouSubtitlePlus: 'You chose Glow Plus',
      glowStartMessage: 'Excellent choice! With Glow Start, you\'ll be able to reconnect with yourself through Message to Myself, celebrate your Small Wins, build better Habits, and track your progress in your Journal. These 4 tools are the foundation of lasting transformation. You\'ve taken the first step towards a better version of yourself!',
      glowPlusMessage: 'What an extraordinary choice! With Glow Plus, you have access to EVERYTHING: the 4 essential foundations (Message, Wins, Habits, Journal) PLUS the Glow Mirror AI that will become your personal coach. Imagine having someone who understands exactly who you are and what you need, 24/7. That\'s exactly what you just got!',
      shareTitle: 'Share the Glow with your loved ones 💫',
      shareMessage: 'If this app really helps you, share it with a friend who needs it. Together, we shine brighter!',
      shareButton: 'Share the app',
      ctaStart: 'Start my transformation',
      ctaPlus: 'Discover my Glow Mirror',
      errorTitle: 'Oops! An error occurred',
      errorButton: 'Back to home'
    },
    es: {
      processing: 'Confirmando...',
      preparing: 'Glowee está preparando tu espacio premium ✨',
      thankYouTitle: '¡Muchísimas gracias! 💖',
      thankYouSubtitleStart: 'Elegiste Glow Start',
      thankYouSubtitlePlus: 'Elegiste Glow Plus',
      glowStartMessage: '¡Excelente elección! Con Glow Start, podrás reconectar contigo misma a través de Mensaje a Mí, celebrar tus Pequeñas Victorias, construir mejores Hábitos y seguir tu progreso en tu Diario. Estas 4 herramientas son la base de una transformación duradera. ¡Has dado el primer paso hacia una mejor versión de ti!',
      glowPlusMessage: '¡Qué elección tan extraordinaria! Con Glow Plus, tienes acceso a TODO: las 4 bases esenciales (Mensaje, Victorias, Hábitos, Diario) MÁS el Glow Mirror AI que se convertirá en tu coach personal. Imagina tener a alguien que entiende exactamente quién eres y qué necesitas, 24/7. ¡Eso es exactamente lo que acabas de obtener!',
      shareTitle: 'Comparte el Glow con tus seres queridos 💫',
      shareMessage: 'Si esta app realmente te ayuda, compártela con una amiga que la necesite. ¡Juntas brillamos más fuerte!',
      shareButton: 'Compartir la app',
      ctaStart: 'Comenzar mi transformación',
      ctaPlus: 'Descubrir mi Glow Mirror',
      errorTitle: '¡Ups! Ocurrió un error',
      errorButton: 'Volver al inicio'
    }
  };

  const t = texts[language] || texts.fr;
  const isPlus = planType === 'glow_plus';

  useEffect(() => {
    const processPayment = async () => {
      if (!user) {
        router.push('/');
        return;
      }

      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await updateUserPaidStatus(planType);
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription
        subscribeToPlan(planType, endDate.toISOString().split('T')[0]);
        setIsProcessing(false);
        setShowThankYou(true);
      } catch (err: any) {
        console.error('Payment confirmation error:', err);
        setError(err.message || 'Une erreur est survenue');
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [user, router, updateUserPaidStatus, subscribeToPlan, planType]);

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
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert(language === 'fr' ? 'Lien copié !' : language === 'en' ? 'Link copied!' : '¡Enlace copiado!');
    }
  };

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
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 overflow-y-auto">
        <div className="max-w-md w-full space-y-6 animate-in fade-in duration-700 py-8">
          {/* Glowee joyeuse */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full blur-3xl opacity-50 animate-pulse"></div>
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
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl shadow-pink-200/50 border border-pink-100/50 text-center space-y-4">
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              {t.thankYouTitle}
            </h1>
            <p className="text-pink-600 font-bold">
              {isPlus ? t.thankYouSubtitlePlus : t.thankYouSubtitleStart}
            </p>
          </div>

          {/* Message explicatif du plan */}
          <div className="bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100 rounded-3xl p-5 shadow-xl border border-pink-200/50">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${isPlus ? 'bg-gradient-to-br from-pink-500 to-rose-500' : 'bg-gradient-to-br from-gray-500 to-gray-600'}`}>
                <Heart className="w-5 h-5 text-white" />
              </div>
              <p className="text-gray-700 font-medium text-sm leading-relaxed">
                {isPlus ? t.glowPlusMessage : t.glowStartMessage}
              </p>
            </div>
          </div>

          {/* Section partage */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-5 shadow-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-blue-800 text-sm">{t.shareTitle}</h3>
            </div>
            <p className="text-blue-700 text-xs mb-4 leading-relaxed">
              {t.shareMessage}
            </p>
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
            className="w-full py-4 px-6 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-pink-200/50 hover:shadow-pink-300/50 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            {isPlus ? t.ctaPlus : t.ctaStart}
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

export default function PaymentConfirmation() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-rose-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-rose-500 rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-stone-600">Chargement...</p>
        </div>
      </div>
    }>
      <PaymentConfirmationContent />
    </Suspense>
  );
}
