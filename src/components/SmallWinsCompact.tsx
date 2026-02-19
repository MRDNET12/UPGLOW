import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { Trophy, Plus, Award, Crown, ChevronDown, ChevronUp, Palette, Sparkles, Target } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SmallWinsCompactProps {
  theme?: 'light' | 'dark';
}

// Types pour les designs
type DesignTheme = 'modern' | 'celebration' | 'minimal';

interface DesignConfig {
  name: string;
  nameEn: string;
  nameEs: string;
  icon: React.ReactNode;
  bgGradient: string;
  textColor: string;
  inputBorder: string;
  inputFocus: string;
  buttonGradient: string;
  itemBg: string;
  itemBorder: string;
  itemHover: string;
}

const DESIGN_THEMES: Record<DesignTheme, DesignConfig> = {
  modern: {
    name: 'Moderne',
    nameEn: 'Modern',
    nameEs: 'Moderno',
    icon: <Sparkles className="w-5 h-5" />,
    bgGradient: 'from-pink-400 via-rose-400 to-orange-400',
    textColor: 'text-white',
    inputBorder: 'border-pink-200',
    inputFocus: 'focus:border-pink-400 focus:ring-pink-400',
    buttonGradient: 'from-pink-400 via-rose-400 to-orange-400',
    itemBg: 'bg-white/60',
    itemBorder: 'border-pink-100',
    itemHover: 'hover:border-pink-200'
  },
  celebration: {
    name: 'Célébration',
    nameEn: 'Celebration',
    nameEs: 'Celebración',
    icon: <Award className="w-5 h-5" />,
    bgGradient: 'from-purple-400 via-pink-500 to-rose-500',
    textColor: 'text-white',
    inputBorder: 'border-purple-200',
    inputFocus: 'focus:border-purple-400 focus:ring-purple-400',
    buttonGradient: 'from-purple-400 via-pink-500 to-rose-500',
    itemBg: 'bg-white/80',
    itemBorder: 'border-purple-100',
    itemHover: 'hover:border-purple-200'
  },
  minimal: {
    name: 'Minimaliste',
    nameEn: 'Minimal',
    nameEs: 'Minimalista',
    icon: <Target className="w-5 h-5" />,
    bgGradient: 'from-gray-600 via-gray-700 to-gray-800',
    textColor: 'text-white',
    inputBorder: 'border-gray-300',
    inputFocus: 'focus:border-gray-500 focus:ring-gray-500',
    buttonGradient: 'from-gray-600 via-gray-700 to-gray-800',
    itemBg: 'bg-gray-50',
    itemBorder: 'border-gray-200',
    itemHover: 'hover:border-gray-300'
  }
};

// Messages pour les rangs 4-6 victoires (tournent aléatoirement)
const ALPHA_RANKS = {
  fr: [
    { text: 'Je savais que je pouvais le faire', emoji: '🏆' },
    { text: 'Je suis fier(e) de moi, tout simplement', emoji: '💪' },
    { text: 'J\'ai relevé le défi, et je savoure l\'instant', emoji: '⭐' },
    { text: 'Je célèbre ma détermination', emoji: '🎉' },
    { text: 'Je transforme mes efforts en victoire', emoji: '✨' },
    { text: 'Je suis capable de grandes choses', emoji: '🌟' }
  ],
  en: [
    { text: 'I knew I could do it', emoji: '🏆' },
    { text: 'I\'m proud of myself, plain and simple', emoji: '💪' },
    { text: 'I took on the challenge, and I\'m savoring the moment', emoji: '⭐' },
    { text: 'I celebrate my determination', emoji: '🎉' },
    { text: 'I turn my efforts into victory', emoji: '✨' },
    { text: 'I am capable of great things', emoji: '🌟' }
  ],
  es: [
    { text: 'Sabía que podía hacerlo', emoji: '🏆' },
    { text: 'Estoy orgulloso(a) de mí mismo(a), sencillamente', emoji: '💪' },
    { text: 'Acepté el desafío, y saboreo el momento', emoji: '⭐' },
    { text: 'Celebro mi determinación', emoji: '🎉' },
    { text: 'Convierto mis esfuerzos en victoria', emoji: '✨' },
    { text: 'Soy capaz de grandes cosas', emoji: '🌟' }
  ]
};

// Messages d'auto-validation pour moins de 4 victoires (aléatoires)
const AUTO_VALIDATIONS = {
  fr: [
    "Je suis légitime dans cette réussite",
    "Même quand c'était difficile, je n'ai pas abandonné",
    "C'est la preuve que je suis capable de grandes choses.",
    "Je m'autorise à ressentir pleinement la joie de ce moment.",
    "Je valide chaque effort qui m'a mené(e) ici.",
    "Je m'accorde le mérite de cette réussite méritée.",
    "Merci moi.",
    "Je suis fier(e) d'avoir cru en mon propre potentiel.",
    "Je savoure ce succès que j'ai construit pas à pas.",
    "Je valide la qualité du travail que j'ai fourni.",
    "Je savoure la récompense de ma propre discipline.",
    "Je sais que j'ai donné le meilleur de moi-même.",
    "Je mérite cette victoire.",
    "Ma constance me rend fier.",
    "Je félicite ma détermination sans faille.",
    "Je brille par mes propres moyens.",
    "Un pas de plus.",
    "Ma discipline paie."
  ],
  en: [
    'I\'m growing.',
    'I\'m making progress.',
    'I deserve this victory.',
    'My discipline pays off.',
    'One more step.',
    'I have value.',
    'My consistency makes me proud.',
    'Thank you, me.',
    'I\'m doing well.',
    'I rise.',
    'I validate myself.',
    'I am consistent.',
    'I honor myself.'
  ],
  es: [
    'Estoy creciendo.',
    'Estoy progresando.',
    'Merezco esta victoria.',
    'Mi disciplina da frutos.',
    'Un paso más.',
    'Tengo valor.',
    'Mi constancia me llena de orgullo.',
    'Gracias, yo.',
    'Lo estoy haciendo bien.',
    'Me elevo.',
    'Me valido a mí mismo.',
    'Soy constante.',
    'Me honro.'
  ]
};

export function SmallWinsCompact({ theme = 'light' }: SmallWinsCompactProps) {
  const { t, language } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [newWin, setNewWin] = useState('');
  const [currentDesign, setCurrentDesign] = useState<DesignTheme>('modern');
  const [showDesignPicker, setShowDesignPicker] = useState(false);

  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  const addSmallWin = useStore((state) => state.addSmallWin);
  const getSmallWinsThisWeek = useStore((state) => state.getSmallWinsThisWeek);

  const winsThisWeek = getSmallWinsThisWeek();
  const lastWin = winsThisWeek.length > 0 ? winsThisWeek[winsThisWeek.length - 1] : null;

  // Ref pour tracker le nombre précédent de wins
  const prevCountRef = useRef(winsThisWeek.length);

  // Trigger animation on win add - 10 secondes avec phase 2 répétée 3 fois
  useEffect(() => {
    if (winsThisWeek.length > prevCountRef.current) {
      setIsAnimating(true);
      setAnimationPhase(2); // Phase 2: première explosion (1-3s)
      
      // Animation avec phase 2 répétée 3 fois sur 10 secondes
      const phaseTimers = [
        setTimeout(() => setAnimationPhase(2), 3000),   // Phase 2: deuxième explosion (4-6s)
        setTimeout(() => setAnimationPhase(2), 6000),   // Phase 2: troisième explosion (7-10s)
        setTimeout(() => {
          setIsAnimating(false);
          setAnimationPhase(0);
        }, 10000) // Fin après 10s
      ];
      
      return () => phaseTimers.forEach(timer => clearTimeout(timer));
    }
    prevCountRef.current = winsThisWeek.length;
  }, [winsThisWeek.length]);

  // Générer un message aléatoire pour les rangs Alpha (4-6 victoires)
  const getAlphaRank = useMemo(() => {
    const messages = ALPHA_RANKS[language as keyof typeof ALPHA_RANKS] || ALPHA_RANKS.fr;
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }, [language, winsThisWeek.length]); // Change quand on ajoute une victoire

  // Générer un message aléatoire pour les auto-validations (< 4 victoires)
  const getAutoValidation = useMemo(() => {
    const messages = AUTO_VALIDATIONS[language as keyof typeof AUTO_VALIDATIONS] || AUTO_VALIDATIONS.fr;
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }, [language, winsThisWeek.length]);

  const getRank = () => {
    const count = winsThisWeek.length;
    const design = DESIGN_THEMES[currentDesign];
    
    // Badge Légende uniquement au 7e succès exactement
    if (count === 7) {
      return {
        name: language === 'fr' ? 'Je suis une Légende' : language === 'en' ? 'I am a Legend' : 'Soy una Leyenda',
        icon: Crown,
        color: 'text-purple-600',
        bgGradient: 'from-purple-400 via-pink-400 to-rose-400',
        emoji: '👑'
      };
    } else if (count >= 4 && count < 7) {
      return {
        name: getAlphaRank.text,
        icon: Award,
        color: 'text-amber-600',
        bgGradient: 'from-amber-400 via-orange-400 to-rose-400',
        emoji: getAlphaRank.emoji
      };
    }
    return {
      name: getAutoValidation,
      icon: Trophy,
      color: 'text-pink-600',
      bgGradient: design.bgGradient,
      emoji: '🎉'
    };
  };

  const rank = getRank();
  const design = DESIGN_THEMES[currentDesign];

  const handleAddWin = () => {
    if (newWin.trim()) {
      addSmallWin(newWin.trim());
      setNewWin('');
    }
  };

  const getDesignName = (d: DesignConfig) => {
    if (language === 'fr') return d.name;
    if (language === 'en') return d.nameEn;
    return d.nameEs;
  };

  return (
    <div className="w-full">
      {/* Styles pour l'animation de 10 secondes */}
      <style>{`
        @keyframes win-entrance {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes win-explode {
          0% { transform: scale(1); }
          25% { transform: scale(1.1) rotate(-2deg); }
          50% { transform: scale(1.05) rotate(2deg); }
          75% { transform: scale(1.08) rotate(-1deg); }
          100% { transform: scale(1.05); }
        }
        @keyframes win-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.3); }
          50% { box-shadow: 0 0 40px rgba(255,255,255,0.6), 0 0 60px rgba(255,182,193,0.4); }
        }
        @keyframes win-particles {
          0% { opacity: 0; transform: translateY(0) scale(0); }
          20% { opacity: 1; transform: translateY(-20px) scale(1); }
          80% { opacity: 1; transform: translateY(-60px) scale(0.8); }
          100% { opacity: 0; transform: translateY(-80px) scale(0); }
        }
        @keyframes win-ring-pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes win-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes win-shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
        
        .win-animate-phase-2 {
          animation: win-explode 3s ease-in-out forwards, win-glow 3s ease-in-out infinite;
        }
        .win-animate-phase-3 {
          animation: win-explode 3s ease-in-out forwards, win-glow 3s ease-in-out infinite;
        }
        .win-animate-phase-4 {
          animation: win-explode 3s ease-in-out forwards, win-glow 3s ease-in-out infinite;
        }
        
        .win-particle {
          position: absolute;
          animation: win-particles 3s ease-out forwards;
        }
        .win-ring {
          position: absolute;
          border-radius: 50%;
          border: 3px solid rgba(255,255,255,0.6);
          animation: win-ring-pulse 1.5s ease-out forwards;
        }
        .win-shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: win-shimmer 2s ease-in-out infinite;
        }
        .win-text-pop {
          animation: win-explode 0.5s ease-out;
        }
        .win-shake {
          animation: win-shake 0.5s ease-in-out;
        }
      `}</style>

      {/* Carte compacte - Conditionnelle */}
      {winsThisWeek.length > 0 ? (
        <div
          className={`rounded-[1.5rem] p-6 shadow-xl shadow-gray-200/50 w-full transition-all duration-300 relative overflow-hidden border-none bg-gradient-to-br ${rank.bgGradient} ${
            isAnimating ? `win-animate-phase-${animationPhase}` : ''
          }`}
        >
          {/* Effet shimmer lors de l'animation */}
          {isAnimating && animationPhase >= 2 && animationPhase <= 4 && (
            <div className="absolute inset-0 win-shimmer pointer-events-none z-10" />
          )}

          {/* Anneaux d'explosion lors des phases 2, 3 et 4 */}
          {isAnimating && (animationPhase === 2 || animationPhase === 3 || animationPhase === 4) && (
            <>
              <div className="win-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32" />
              <div className="win-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48" style={{ animationDelay: '0.3s' }} />
              <div className="win-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64" style={{ animationDelay: '0.6s' }} />
            </>
          )}

          {/* Particules flottantes */}
          {isAnimating && animationPhase >= 2 && animationPhase <= 4 && (
            <>
              <span className="win-particle top-4 left-1/4 text-2xl" style={{ animationDelay: '0s' }}>✨</span>
              <span className="win-particle top-4 right-1/4 text-xl" style={{ animationDelay: '0.2s' }}>🌟</span>
              <span className="win-particle bottom-8 left-1/3 text-lg" style={{ animationDelay: '0.4s' }}>⭐</span>
              <span className="win-particle top-8 right-1/3 text-2xl" style={{ animationDelay: '0.6s' }}>💫</span>
              <span className="win-particle bottom-4 right-1/4 text-xl" style={{ animationDelay: '0.8s' }}>✦</span>
            </>
          )}

           {/* Décoration d'arrière-plan */}
           <div className="absolute -right-6 -bottom-6 opacity-10 transform rotate-12">
             <rank.icon className="w-32 h-32 text-white" />
           </div>

           {/* Bouton de personnalisation en haut */}
           <div className="absolute top-4 right-4 z-20">
             <button
               onClick={(e) => {
                 e.stopPropagation();
                 setShowDesignPicker(true);
               }}
               className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
               title={language === 'fr' ? 'Changer le design' : language === 'en' ? 'Change design' : 'Cambiar diseño'}
             >
               <Palette className="w-4 h-4 text-white" />
             </button>
           </div>
 
           <div className="relative z-10 flex items-center justify-start gap-5">
             {/* Gauche : Emoji avec animation */}
             <div className={`transition-all duration-500 ${isAnimating && (animationPhase === 2 || animationPhase === 3 || animationPhase === 4) ? 'win-text-pop' : ''}`}>
               <span className="text-5xl filter drop-shadow-lg">{rank.emoji}</span>
             </div>
 
             {/* Droite : Phrase avec animation */}
             <div className="flex-1">
               <h3 className={`text-2xl font-bold text-white leading-tight drop-shadow-md transition-all duration-500 ${isAnimating && (animationPhase === 2 || animationPhase === 3 || animationPhase === 4) ? 'win-shake' : ''}`}>
                 {rank.name}
               </h3>
             </div>
           </div>
        </div>
      ) : null}

      {/* Section expandée - Design magnifique */}
      {isExpanded && (
        <div className="mt-3 p-5 bg-white/80 backdrop-blur-md rounded-[1.5rem] shadow-xl shadow-gray-200/50 border border-pink-100/50 space-y-4 transition-all duration-300 ease-out">
          {/* Titre */}
          <h4 className="font-bold text-gray-800">
            {language === 'fr' ? 'Carnet de fierté' : language === 'en' ? 'Pride Journal' : 'Diario de orgullo'}
          </h4>

          {/* FAQ Pourquoi ? - Design compact */}
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowWhy(!showWhy);
              }}
              className="w-full flex items-center justify-between p-2.5 bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100 rounded-lg hover:from-pink-200 hover:via-rose-200 hover:to-orange-200 transition-all shadow-md shadow-pink-200/50 border border-pink-200/50"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-sm">💡</span>
                <span className="font-bold text-gray-800 text-xs">
                  {language === 'fr' ? 'Ma fierté du jour ?' : language === 'en' ? 'My pride of the day?' : '¿Mi orgullo del día?'}
                </span>
              </div>
              {showWhy ? (
                <ChevronUp className="w-4 h-4 text-pink-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-pink-500" />
              )}
            </button>

            {showWhy && (
              <div className="mt-2 p-2.5 bg-white/80 backdrop-blur-md rounded-lg space-y-2 shadow-md shadow-pink-200/50 border border-pink-100/50 transition-all duration-300 ease-out">
                <div>
                  <p className="font-bold text-gray-800 mb-2 text-xs">
                    {language === 'fr' ? 'Tu avances. Et ça compte.' : language === 'en' ? 'You\'re moving forward. And it counts.' : 'Avanzas. Y eso cuenta.'}
                  </p>
                  <p className="font-bold text-gray-800 mb-2 text-xs">
                    {language === 'fr' ? 'Célèbre tes victoires quotidiennes 🎉!' : language === 'en' ? 'Celebrate your daily victories 🎉!' : '¡Celebra tus victorias diarias 🎉!'}
                  </p>
                  <p className="text-gray-700 font-medium text-[11px] leading-relaxed mb-2">
                    {language === 'fr'
                      ? 'Chaque victoire, même minuscule, renforce la personne que tu es en train de devenir.\nPrends l\'habitude de reconnaître tes efforts et de bâtir une fierté saine, sans comparaison.\nValide tes progrès et construis ta fierté.'
                      : language === 'en'
                        ? 'Every victory, even tiny, strengthens the person you\'re becoming.\nGet in the habit of recognizing your efforts and building healthy pride, without comparison.\nValidate your progress and build your pride.'
                        : 'Cada victoria, incluso minúscula, fortalece la persona que estás llegando a ser.\nAcostúmbrate a reconocer tus esfuerzos y construir un orgullo sano, sin comparación.\nValida tu progreso y construye tu orgullo.'
                    }
                  </p>
                  <p className="text-gray-700 font-medium text-[11px] leading-relaxed mb-2">
                    {language === 'fr'
                      ? 'Note tes petits accomplissements réalisés cette semaine (même les plus minimes).\n« J\'ai commencé ... » « Je n\'ai pas abandonné ... » « J\'ai essayé ... » « J\'ai réussi ... »'
                      : language === 'en'
                        ? 'Note your small accomplishments achieved this week (even the smallest ones).\n"I started ..." "I didn\'t give up ..." "I tried ..." "I succeeded ..."'
                        : 'Anota tus pequeños logros realizados esta semana (incluso los más mínimos).\n"Empecé ..." "No abandoné ..." "Intenté ..." "Logré ..."'
                    }
                  </p>
                </div>
                <div className="pt-2 border-t border-pink-200">
                  <p className="font-bold text-gray-800 mb-1 text-xs">
                    {language === 'fr' ? 'Pourquoi ça marche ?' : language === 'en' ? 'Why does it work?' : '¿Por qué funciona?'}
                  </p>
                  <p className="text-gray-700 font-medium text-[11px] leading-relaxed">
                    {language === 'fr'
                      ? 'L\'auto-valorisation aide à renforcer la confiance et réduire le sentiment d\'échec.'
                      : language === 'en'
                        ? 'Self-appreciation helps strengthen confidence and reduce feelings of failure.'
                        : 'La autovaloración ayuda a fortalecer la confianza y reducir el sentimiento de fracaso.'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Input d'ajout rapide */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newWin}
              onChange={(e) => setNewWin(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddWin();
                }
              }}
              onClick={(e) => e.stopPropagation()}
              placeholder={t.bonus.smallWinPlaceholder}
              className={`flex-1 px-4 py-3 text-sm bg-white border-2 ${design.inputBorder} rounded-xl ${design.inputFocus} focus:outline-none focus:ring-2 text-gray-800 placeholder:text-gray-400 shadow-md font-medium transition-all`}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddWin();
              }}
              disabled={!newWin.trim()}
              className={`px-4 py-3 bg-gradient-to-r ${design.buttonGradient} hover:scale-105 disabled:bg-gray-300 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-xl transition-all disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 text-sm font-bold shadow-lg`}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Liste des succès de la semaine */}
          {winsThisWeek.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-1">
                <span>🌟</span>
                {language === 'fr' ? 'Cette semaine' : language === 'en' ? 'This week' : 'Esta semana'}
              </p>
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {winsThisWeek.slice().reverse().map((win, index) => (
                  <div
                    key={win.id}
                    className={`p-2 rounded-lg transition-all ${index === 0
                      ? `bg-gradient-to-br ${design.bgGradient} shadow-md`
                      : `${design.itemBg} border ${design.itemBorder} ${design.itemHover}`
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <Trophy className={`w-3.5 h-3.5 flex-shrink-0 ${index === 0 ? 'text-white' : 'text-pink-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold leading-tight ${index === 0 ? 'text-white' : 'text-gray-800'}`}>
                          {win.text}
                        </p>
                        <p className={`text-[10px] font-medium ${index === 0 ? 'text-white/90' : 'text-gray-500'}`}>
                          {new Date(win.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Design Picker Dialog */}
      <Dialog open={showDesignPicker} onOpenChange={setShowDesignPicker}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === 'fr' ? 'Choisir un design' : language === 'en' ? 'Choose a design' : 'Elegir un diseño'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 mt-4">
            {(Object.keys(DESIGN_THEMES) as DesignTheme[]).map((theme) => (
              <button
                key={theme}
                onClick={() => {
                  setCurrentDesign(theme);
                  setShowDesignPicker(false);
                }}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                  currentDesign === theme 
                    ? 'border-pink-500 bg-pink-50' 
                    : 'border-gray-200 hover:border-pink-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${DESIGN_THEMES[theme].bgGradient} flex items-center justify-center text-white`}>
                  {DESIGN_THEMES[theme].icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-gray-800">{getDesignName(DESIGN_THEMES[theme])}</h3>
                  <p className="text-sm text-gray-500">
                    {theme === 'modern' && (language === 'fr' ? 'Style doux et coloré' : 'Soft and colorful style')}
                    {theme === 'celebration' && (language === 'fr' ? 'Ambiance festive' : 'Festive vibe')}
                    {theme === 'minimal' && (language === 'fr' ? 'Épuré et élégant' : 'Clean and elegant')}
                  </p>
                </div>
                {currentDesign === theme && (
                  <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
