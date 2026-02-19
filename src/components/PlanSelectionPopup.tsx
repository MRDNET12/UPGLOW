'use client';

import { useState } from 'react';
import { X, Sparkles, Check, Crown, Heart } from 'lucide-react';
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
          title: 'Continue de Briller',
          subtitle: 'Investis en toi dès aujourd\'hui',
          description: 'Cette app est un projet qui nous tient à cœur et nous ajoutons constamment des nouvelles mises à jour, fonctionnalités et améliorations. Nous avons besoin de vous.',
          glowStart: {
            name: 'Glow Start',
            price: '1.99€',
            period: '/mois',
            features: ['Message à moi', 'Petites victoires', 'Mes habitudes', 'Mon journal'],
            cta: 'Commencer'
          }
        };
      case 'en':
        return {
          title: 'Keep Shining',
          subtitle: 'Invest in yourself today',
          description: 'This app is a project close to our hearts, and we are constantly adding new updates, features, and improvements. We need you.',
          glowStart: {
            name: 'Glow Start',
            price: '1.99€',
            period: '/month',
            features: ['Message to myself', 'Small wins', 'My habits', 'My journal'],
            cta: 'Start'
          }
        };
      case 'es':
        return {
          title: 'Sigue Brillando',
          subtitle: 'Invierte en ti hoy mismo',
          description: 'Esta aplicación es un proyecto que nos importa mucho y constantemente agregamos nuevas actualizaciones, funciones y mejoras. Te necesitamos.',
          glowStart: {
            name: 'Glow Start',
            price: '1.99€',
            period: '/mes',
            features: ['Mensaje a mí', 'Pequeñas victorias', 'Mis hábitos', 'Mi diario'],
            cta: 'Empezar'
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

          {/* Glow Start Card */}
          <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-purple-200/50 border-2 border-white relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-xl font-black text-[#2D2a2e] flex items-center gap-2">
                  {texts.glowStart.name}
                  <Sparkles className="w-5 h-5 text-purple-500 fill-purple-500" />
                </h3>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-black text-[#2D2a2e]">{texts.glowStart.price}</span>
              <span className="text-gray-400 font-medium">{texts.glowStart.period}</span>
            </div>

            <div className="space-y-3 mb-6">
              {texts.glowStart.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#E9D8FD] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-purple-700" />
                  </div>
                  <span className="text-gray-700 font-bold text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSelectPlan('glow_start')}
              disabled={isLoading}
              className="w-full py-4 rounded-[1.5rem] bg-black text-white font-bold text-lg shadow-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
            >
              {texts.glowStart.cta}
            </button>
          </div>

          {/* Description */}
          <div className="bg-white/60 backdrop-blur-sm rounded-[1.5rem] p-4 border border-white/50">
            <p className="text-sm text-[#2D2a2e]/80 text-center leading-relaxed">
              {texts.description}
            </p>
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
