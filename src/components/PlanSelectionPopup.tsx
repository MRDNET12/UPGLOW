'use client';

import { useState } from 'react';
import { X, Sparkles, Check, Crown, Star, Heart, Zap, Shield } from 'lucide-react';
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
          title: 'Débloque tout ton potentiel',
          subtitle: 'Choisis le plan qui te correspond',
          glowStart: {
            name: 'Glow Start',
            price: '1.99€',
            period: '/mois',
            features: [
              'Message à moi',
              'Petites victoires',
              'Mes habitudes',
              'Mon journal'
            ],
            cta: 'Commencer Glow Start'
          },
          glowPlus: {
            name: 'Glow Plus',
            price: '3.99€',
            period: '/mois',
            description: 'L\'expérience ultime',
            features: [
              'Tout Glow Start',
              'Glow Mirror (IA)',
              'Analyses avancées'
            ],
            cta: 'Devenir Glow Plus',
            popular: 'RECOMMANDÉ'
          }
        };
      case 'en':
        return {
          title: 'Unlock your full potential',
          subtitle: 'Choose the plan that suits you',
          glowStart: {
            name: 'Glow Start',
            price: '1.99€',
            period: '/month',
            features: [
              'Message to myself',
              'Small wins',
              'My habits',
              'My journal'
            ],
            cta: 'Start Glow Start'
          },
          glowPlus: {
            name: 'Glow Plus',
            price: '3.99€',
            period: '/month',
            description: 'The ultimate experience',
            features: [
              'All Glow Start',
              'Glow Mirror (AI)',
              'Advanced analytics'
            ],
            cta: 'Become Glow Plus',
            popular: 'RECOMMENDED'
          }
        };
      case 'es':
        return {
          title: 'Desbloquea todo tu potencial',
          subtitle: 'Elige el plan que te convenga',
          glowStart: {
            name: 'Glow Start',
            price: '1.99€',
            period: '/mes',
            features: [
              'Mensaje a mí',
              'Pequeñas victorias',
              'Mis hábitos',
              'Mi diario'
            ],
            cta: 'Comenzar Glow Start'
          },
          glowPlus: {
            name: 'Glow Plus',
            price: '3.99€',
            period: '/mes',
            description: 'La experiencia definitiva',
            features: [
              'Todo Glow Start',
              'Glow Mirror (IA)',
              'Análisis avanzados'
            ],
            cta: 'Ser Glow Plus',
            popular: 'RECOMENDADO'
          }
        };
      default:
        return {
          title: 'Unlock your full potential',
          subtitle: 'Choose the plan that suits you',
          glowStart: {
            name: 'Glow Start',
            price: '1.99€',
            period: '/month',
            features: [
              'Message to myself',
              'Small wins',
              'My habits',
              'My journal'
            ],
            cta: 'Start Glow Start'
          },
          glowPlus: {
            name: 'Glow Plus',
            price: '3.99€',
            period: '/month',
            description: 'The ultimate experience',
            features: [
              'All Glow Start',
              'Glow Mirror (AI)',
              'Advanced analytics'
            ],
            cta: 'Become Glow Plus',
            popular: 'RECOMMENDED'
          }
        };
    }
  };

  const texts = getTexts();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#F8F9FE] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto border border-white/50">

        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-50 to-[#F8F9FE]"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-white/50 hover:bg-white text-slate-400 hover:text-slate-600 transition-colors w-8 h-8"
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Content */}
        <div className="relative px-6 py-8 pt-10">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm mb-4 text-2xl">
              💎
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {texts.title}
            </h2>
            <p className="text-slate-500 font-medium">
              {texts.subtitle}
            </p>
          </div>

          <div className="space-y-4">
            {/* Plan 1: Glow Start */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:border-blue-100 transition-colors relative group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{texts.glowStart.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-slate-900">{texts.glowStart.price}</span>
                    <span className="text-xs text-slate-400 font-medium">{texts.glowStart.period}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <Star className="w-5 h-5 fill-blue-500/20" />
                </div>
              </div>

              <div className="space-y-2 mb-5">
                {texts.glowStart.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-blue-600" />
                    </div>
                    <span className="text-sm text-slate-600 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handleSelectPlan('glow_start')}
                disabled={isLoading}
                variant="outline"
                className="w-full h-12 rounded-xl border-2 border-slate-100 bg-transparent hover:bg-slate-50 text-slate-700 font-bold"
              >
                {isLoading ? '...' : texts.glowStart.cta}
              </Button>
            </div>

            {/* Plan 2: Glow Plus */}
            <div className="bg-white rounded-[2rem] p-1 shadow-md border border-purple-100 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50"></div>

              <div className="relative bg-white/80 backdrop-blur-sm rounded-[1.8rem] p-5">
                <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-2xl">
                  {texts.glowPlus.popular}
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      {texts.glowPlus.name}
                      <Crown className="w-4 h-4 text-purple-500 fill-purple-500/20" />
                    </h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {texts.glowPlus.price}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{texts.glowPlus.period}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {texts.glowPlus.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-purple-600" />
                      </div>
                      <span className="text-sm text-slate-700 font-bold">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleSelectPlan('glow_plus')}
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-slate-900 hover:bg-black text-white font-bold shadow-lg shadow-purple-200"
                >
                  {isLoading ? (
                    <Sparkles className="w-4 h-4 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      {texts.glowPlus.cta} <Sparkles className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6 font-medium">
            Secured by Stripe • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
