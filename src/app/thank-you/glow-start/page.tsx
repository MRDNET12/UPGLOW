'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/lib/store';
import { CheckCircle2, Heart, Star, ArrowRight, Share2, Users, Sparkles } from 'lucide-react';

export default function ThankYouGlowStart() {
  const router = useRouter();
  const { user, updateUserPaidStatus } = useAuth();
  const { subscribeToPlan, language } = useStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const texts = {
    fr: {
      processing: 'Confirmation de ton abonnement...',
      thankYouTitle: 'Merci pour ta confiance ! 💖',
      subtitle: 'Tu as choisi Glow Start',
      message: 'Excellent choix ! Avec Glow Start, tu vas pouvoir te reconnecter à toi-même grâce au Message à Moi, célébrer tes Petites Victoires, construire de meilleures Habitudes et suivre ton évolution dans ton Journal. Ces 4 outils sont la base d\'une transformation durable. Tu as fait le premier pas vers une meilleure version de toi !',
      features: [
        'Message à Moi - Connecte-toi à ton moi intérieur',
        'Petites Victoires - Célèbre chaque progrès',
        'Mes Habitudes - Construis des routines solides',
        'Mon Journal - Suis ton évolution'
      ],
      shareTitle: 'Partage le Glow avec tes proches 💫',
      shareMessage: 'Si cette app t\'aide vraiment, partage-la avec une amie qui en aurait besoin. Ensemble, on brille plus fort !',
      shareButton: 'Partager l\'app',
      cta: 'Commencer ma transformation',
      loading: 'Préparation de ton espace...'
    },
    en: {
      processing: 'Confirming your subscription...',
      thankYouTitle: 'Thank you for your trust! 💖',
      subtitle: 'You chose Glow Start',
      message: 'Excellent choice! With Glow Start, you\'ll be able to reconnect with yourself through Message to Myself, celebrate your Small Wins, build better Habits, and track your progress in your Journal. These 4 tools are the foundation of lasting transformation. You\'ve taken the first step towards a better version of yourself!',
      features: [
        'Message to Myself - Connect with your inner self',
        'Small Wins - Celebrate every progress',
        'My Habits - Build solid routines',
        'My Journal - Track your evolution'
      ],
      shareTitle: 'Share the Glow with your loved ones 💫',
      shareMessage: 'If this app really helps you, share it with a friend who needs it. Together, we shine brighter!',
      shareButton: 'Share the app',
      cta: 'Start my transformation',
      loading: 'Preparing your space...'
    },
    es: {
      processing: 'Confirmando tu suscripción...',
      thankYouTitle: '¡Gracias por tu confianza! 💖',
      subtitle: 'Elegiste Glow Start',
      message: '¡Excelente elección! Con Glow Start, podrás reconectar contigo misma a través de Mensaje a Mí, celebrar tus Pequeñas Victorias, construir mejores Hábitos y seguir tu progreso en tu Diario. Estas 4 herramientas son la base de una transformación duradera. ¡Has dado el primer paso hacia una mejor versión de ti!',
      features: [
        'Mensaje a Mí - Conecta con tu yo interior',
        'Pequeñas Victorias - Celebra cada progreso',
        'Mis Hábitos - Construye rutinas sólidas',
        'Mi Diario - Sigue tu evolución'
      ],
      shareTitle: 'Comparte el Glow con tus seres queridos 💫',
      shareMessage: 'Si esta app realmente te ayuda, compártela con una amiga que la necesite. ¡Juntas brillamos más fuerte!',
      shareButton: 'Compartir la app',
      cta: 'Comenzar mi transformación',
      loading: 'Preparando tu espacio...'
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
        await updateUserPaidStatus('glow_start');
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        subscribeToPlan('glow_start', endDate.toISOString().split('T')[0]);
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
          <div className="flex justify-center animate-bounce">
            <img src="/Glowee/glowee-felicite.webp" alt="Glowee" className="w-32 h-32 object-contain" />
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              {t.processing}
            </h1>
            <p className="text-stone-600">{t.loading}</p>
          </div>
          <div className="flex justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-amber-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-amber-500 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 overflow-y-auto">
      <div className="max-w-md w-full space-y-6 animate-in fade-in duration-700 py-8">
        {/* Glowee joyeuse */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-300 to-orange-300 rounded-full blur-3xl opacity-50 animate-pulse"></div>
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
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl shadow-orange-200/50 border border-orange-100/50 text-center space-y-4">
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            {t.thankYouTitle}
          </h1>
          <p className="text-amber-600 font-bold text-lg">{t.subtitle}</p>
        </div>

        {/* Message explicatif */}
        <div className="bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 rounded-3xl p-5 shadow-xl border border-amber-200/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <p className="text-gray-700 font-medium text-sm leading-relaxed">{t.message}</p>
          </div>
        </div>

        {/* Features incluses */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            {language === 'fr' ? 'Ton pack inclus :' : language === 'en' ? 'Your pack includes:' : 'Tu pack incluye:'}
          </h3>
          <div className="space-y-2">
            {t.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-amber-50/50">
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
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
          className="w-full py-4 px-6 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 hover:from-amber-500 hover:via-orange-500 hover:to-yellow-400 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-orange-200/50 hover:shadow-orange-300/50 hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          {t.cta}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
