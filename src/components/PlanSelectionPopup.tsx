'use client';

import { useState } from 'react';
import { X, Sparkles, Check, Crown, Star, Heart } from 'lucide-react';
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
      onSelectPlan(plan);
      return;
    }
    setIsLoading(true);
    const stripeUrl = `${STRIPE_LINKS[plan]}?prefilled_email=${encodeURIComponent(user.email)}`;
    window.location.href = stripeUrl;
  };

  if (!isOpen) return null;

  const getTexts = () => {
    switch (language) {
      case 'fr':
        return {
          title: 'Deviens ta meilleure version',
          subtitle: 'Investis en toi dès aujourd\'hui',
          glowStart: {
            name: 'Glow Start',
            price: '1.99€',
            period: '/mois',
            features: ['Message à moi', 'Petites victoires', 'Mes habitudes', 'Mon journal'],
            cta: 'Commencer'
          },
          glowPlus: {
            name: 'Glow Plus',
            price: '3.99€',
            period: '/mois',
            description: 'Le choix le plus populaire',
            features: ['Tout Glow Start', 'Glow Mirror AI', 'Analyses avancées', 'Support prioritaire'],
            cta: 'Rejoindre le club',
            popular: 'LOVE IT'
          }
        };
      case 'en':
        return {
          title: 'Become your best self',
          subtitle: 'Invest in yourself today',
          glowStart: {
            name: 'Glow Start',
            price: '1.99€',
            period: '/month',
            features: ['Message to myself', 'Small wins', 'My habits', 'My journal'],
            cta: 'Start'
          },
          glowPlus: {
            name: 'Glow Plus',
            price: '3.99€',
            period: '/month',
            description: 'Most popular choice',
            features: ['All Glow Start', 'Glow Mirror AI', 'Advanced insights', 'Priority support'],
            cta: 'Join the club',
            popular: 'LOVE IT'
          }
        };
      case 'es':
        return {
          title: 'Conviértete en tu mejor versión',
          subtitle: 'Invierte en ti hoy mismo',
          glowStart: {
            name: 'Glow Start',
            price: '1.99€',
            period: '/mes',
            features: ['Mensaje a mí', 'Pequeñas victorias', 'Mis hábitos', 'Mi diario'],
            cta: 'Empezar'
          },
          glowPlus: {
            name: 'Glow Plus',
            price: '3.99€',
            period: '/mes',
            description: 'La opción más popular',
            features: ['Todo Glow Start', 'Glow Mirror AI', 'Análisis avanzados', 'Soporte prioritario'],
            cta: 'Únete al club',
            popular: 'LOVE IT'
          }
        };
      default: return null; // Should not happen
    }
  };

  const texts = getTexts()!;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Container Slide Up - Full Width on Mobile */}
      <div
        className="w-full h-[92vh] sm:h-auto sm:max-h-[85vh] sm:max-w-lg bg-[#E9D8FD] rounded-t-[3rem] sm:rounded-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] overflow-hidden animate-in slide-in-from-bottom duration-500 relative flex flex-col"
      >

        {/* Background Decorations */}
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Section */}
        <div className="relative px-8 pt-8 pb-4 flex-shrink-0 text-center">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/40 flex items-center justify-center hover:bg-white/60 transition-colors"
          >
            <X className="w-5 h-5 text-[#2D2a2e]" />
          </button>

          <div className="mb-2 inline-block p-3 rounded-full bg-white/30 backdrop-blur-sm">
            <Crown className="w-8 h-8 text-[#2D2a2e]" />
          </div>

          <h2 className="text-3xl font-black text-[#2D2a2e] leading-tight mb-2">
            {texts.title}
          </h2>
          <p className="text-[#2D2a2e]/70 font-medium">
            {texts.subtitle}
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-4 scrollbar-hide">

          {/* Glow Plus Card - Highlighted */}
          <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-purple-200/50 border-2 border-white relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
            <div className="absolute top-0 right-0 bg-black text-white text-xs font-bold px-4 py-2 rounded-bl-2xl">
              {texts.glowPlus.popular}
            </div>

            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-xl font-black text-[#2D2a2e] flex items-center gap-2">
                  {texts.glowPlus.name}
                  <Sparkles className="w-5 h-5 text-purple-500 fill-purple-500" />
                </h3>
                <p className="text-sm text-gray-500 font-medium">{texts.glowPlus.description}</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-black text-[#2D2a2e]">{texts.glowPlus.price}</span>
              <span className="text-gray-400 font-medium">{texts.glowPlus.period}</span>
            </div>

            <div className="space-y-3 mb-6">
              {texts.glowPlus.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#E9D8FD] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-purple-700" />
                  </div>
                  <span className="text-gray-700 font-bold text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSelectPlan('glow_plus')}
              disabled={isLoading}
              className="w-full py-4 rounded-[1.5rem] bg-black text-white font-bold text-lg shadow-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
            >
              {texts.glowPlus.cta}
            </button>
          </div>

          {/* Glow Start Card */}
          <div className="bg-white/40 backdrop-blur-sm rounded-[2.5rem] p-6 border border-white/50 hover:bg-white/60 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#2D2a2e]">{texts.glowStart.name}</h3>
              <div className="text-right">
                <span className="text-xl font-bold text-[#2D2a2e]">{texts.glowStart.price}</span>
                <span className="text-xs text-gray-500">{texts.glowStart.period}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {texts.glowStart.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  {feature}
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSelectPlan('glow_start')}
              disabled={isLoading}
              className="w-full py-3 rounded-[1.5rem] bg-white text-[#2D2a2e] font-bold border-2 border-transparent hover:border-black/10 transition-colors text-sm"
            >
              {texts.glowStart.cta}
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-[#2D2a2e]/40 font-bold uppercase tracking-widest pt-4">
            <Heart className="w-3 h-3" />
            Cancel anytime • 100% Secure
          </div>
        </div>

      </div>
    </div>
  );
}
