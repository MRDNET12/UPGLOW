'use client';

import { useState } from 'react';
import { X, Sparkles, Check, Crown, MessageCircle, Trophy, Target, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Language } from '@/lib/translations';

interface PlanSelectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: 'glow_start' | 'glow_plus') => void;
  language: Language;
}

const STRIPE_LINKS = {
  glow_start: 'https://buy.stripe.com/8x26oH178evq3KLgqNf3a03',
  glow_plus: 'https://buy.stripe.com/9B69AT178gDybddgqNf3a02'
};

export function PlanSelectionPopup({ isOpen, onClose, onSelectPlan, language }: PlanSelectionPopupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSelectPlan = (plan: 'glow_start' | 'glow_plus') => {
    if (!user || !user.email) {
      // Sauvegarder le plan sélectionné et ouvrir l'authentification
      onSelectPlan(plan);
      return;
    }

    // Rediriger vers Stripe avec l'email pré-rempli
    setIsLoading(true);
    const stripeUrl = `${STRIPE_LINKS[plan]}?prefilled_email=${encodeURIComponent(user.email)}`;
    window.location.href = stripeUrl;
  };

  if (!isOpen) return null;

  const getTexts = () => {
    switch (language) {
      case 'fr':
        return {
          title: 'Choisis ton plan ✨',
          subtitle: 'Passe à la vitesse supérieure avec nos formules',
          freeFeatures: 'Toujours gratuits :',
          trialInfo: '3 jours gratuits sur tous les plans',
          glowStart: {
            name: 'Glow Start',
            price: '1,99€',
            period: '/mois',
            features: [
              'Message à moi',
              'Petites victoires',
              'Mes habitudes',
              'Mon journal'
            ],
            cta: 'Choisir Glow Start'
          },
          glowPlus: {
            name: 'Glow Plus',
            price: '3,99€',
            period: '/mois',
            features: [
              'Tout Glow Start',
              'Glow Mirror AI',
              'Analyses personnalisées',
              'Conseils sur mesure'
            ],
            cta: 'Choisir Glow Plus',
            popular: 'Le plus populaire'
          }
        };
      case 'en':
        return {
          title: 'Choose your plan ✨',
          subtitle: 'Take it to the next level with our plans',
          freeFeatures: 'Always free:',
          trialInfo: '3 free days on all plans',
          glowStart: {
            name: 'Glow Start',
            price: '1,99€',
            period: '/month',
            features: [
              'Message to myself',
              'Small wins',
              'My habits',
              'My journal'
            ],
            cta: 'Choose Glow Start'
          },
          glowPlus: {
            name: 'Glow Plus',
            price: '3,99€',
            period: '/month',
            features: [
              'All Glow Start',
              'Glow Mirror AI',
              'Personalized analysis',
              'Custom advice'
            ],
            cta: 'Choose Glow Plus',
            popular: 'Most popular'
          }
        };
      case 'es':
        return {
          title: 'Elige tu plan ✨',
          subtitle: 'Llévalo al siguiente nivel con nuestros planes',
          freeFeatures: 'Siempre gratis:',
          trialInfo: '3 días gratis en todos los planes',
          glowStart: {
            name: 'Glow Start',
            price: '1,99€',
            period: '/mes',
            features: [
              'Mensaje a mí',
              'Pequeñas victorias',
              'Mis hábitos',
              'Mi diario'
            ],
            cta: 'Elegir Glow Start'
          },
          glowPlus: {
            name: 'Glow Plus',
            price: '3,99€',
            period: '/mes',
            features: [
              'Todo Glow Start',
              'Glow Mirror AI',
              'Análisis personalizado',
              'Consejos a medida'
            ],
            cta: 'Elegir Glow Plus',
            popular: 'Más popular'
          }
        };
      default:
        return {
          title: 'Choose your plan ✨',
          subtitle: 'Take it to the next level with our plans',
          freeFeatures: 'Always free:',
          trialInfo: '3 free days on all plans',
          glowStart: {
            name: 'Glow Start',
            price: '1,99€',
            period: '/month',
            features: [
              'Message to myself',
              'Small wins',
              'My habits',
              'My journal'
            ],
            cta: 'Choose Glow Start'
          },
          glowPlus: {
            name: 'Glow Plus',
            price: '3,99€',
            period: '/month',
            features: [
              'All Glow Start',
              'Glow Mirror AI',
              'Personalized analysis',
              'Custom advice'
            ],
            cta: 'Choose Glow Plus',
            popular: 'Most popular'
          }
        };
    }
  };

  const texts = getTexts();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-[1.5rem] shadow-2xl shadow-pink-200/50 overflow-hidden bg-white/95 backdrop-blur-xl border border-pink-100/50 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        {/* Premium Badge */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 via-rose-400 to-orange-300" />

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2 z-10 rounded-full hover:bg-pink-100 w-7 h-7"
        >
          <X className="w-4 h-4 text-gray-500" />
        </Button>

        {/* Content */}
        <div className="px-5 py-6 pt-7">
          {/* Header */}
          <div className="text-center mb-5">
            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 bg-clip-text text-transparent leading-tight">
              {texts.title}
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              {texts.subtitle}
            </p>
          </div>

          {/* Features toujours gratuites */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 mb-4">
            <p className="text-xs font-bold text-green-700 mb-2">{texts.freeFeatures}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-green-600">
                <Target className="w-3.5 h-3.5" />
                <span>Flow</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-green-600">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Ma Semaine</span>
              </div>
            </div>
          </div>

          {/* Plan Glow Start */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 mb-3">
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-2xl font-bold text-gray-800">{texts.glowStart.price}</span>
              <span className="text-sm text-gray-600">{texts.glowStart.period}</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">{texts.glowStart.name}</h3>
            <div className="space-y-1.5 mb-3">
              {texts.glowStart.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
                  <span className="text-xs text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            <Button
              onClick={() => handleSelectPlan('glow_start')}
              disabled={isLoading}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 text-sm rounded-xl"
            >
              {isLoading ? '...' : texts.glowStart.cta}
            </Button>
          </div>

          {/* Plan Glow Plus */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-300 relative">
            {/* Badge Popular */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold rounded-full">
              {texts.glowPlus.popular}
            </div>
            
            <div className="flex items-baseline gap-1 mb-2 mt-1">
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">{texts.glowPlus.price}</span>
              <span className="text-sm text-gray-600">{texts.glowPlus.period}</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">{texts.glowPlus.name}</h3>
            <div className="space-y-1.5 mb-3">
              {texts.glowPlus.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
                  <span className="text-xs text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            <Button
              onClick={() => handleSelectPlan('glow_plus')}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-400 via-rose-400 to-orange-300 hover:from-pink-500 hover:via-rose-500 hover:to-orange-400 text-white font-bold py-4 text-sm shadow-lg shadow-pink-200/50 rounded-xl"
            >
              {isLoading ? (
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Crown className="w-4 h-4 mr-2" />
              )}
              {texts.glowPlus.cta}
            </Button>
          </div>

          {/* Info essai */}
          <p className="text-[10px] text-center text-gray-500 mt-4">
            {texts.trialInfo}
          </p>
        </div>
      </div>
    </div>
  );
}
