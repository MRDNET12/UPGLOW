import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { Trophy, Plus, Award, Crown, ChevronDown, ChevronUp } from 'lucide-react';

interface SmallWinsCompactProps {
  theme?: 'light' | 'dark';
}

// Messages d'auto-validation qui tournent à chaque ajout
const AUTO_VALIDATIONS = [
  'Je suis une légende.',
  'Je grandis.',
  'Je progresse.',
  'Je mérite cette victoire.',
  'Ma discipline paie.',
  'Un pas de plus.',
  'J\'ai de la valeur.',
  'Ma constance me rend fier.',
  'Merci moi.',
  'Je fais bien.',
  'Je m\'élève.',
  'Je me valide.',
  'Je suis constant.',
  'Je m\'honore.'
];

export function SmallWinsCompact({ theme = 'light' }: SmallWinsCompactProps) {
  const { t, language } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [newWin, setNewWin] = useState('');

  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);

  const addSmallWin = useStore((state) => state.addSmallWin);
  const getSmallWinsThisWeek = useStore((state) => state.getSmallWinsThisWeek);

  const winsThisWeek = getSmallWinsThisWeek();
  const lastWin = winsThisWeek.length > 0 ? winsThisWeek[winsThisWeek.length - 1] : null; // Conservé pour la logique mais non affiché

  // Ref pour tracker le nombre précédent de wins afin de déclencher l'animation uniquement sur ajout
  const prevCountRef = useRef(winsThisWeek.length);

  // Trigger animation on win add
  useEffect(() => {
    if (winsThisWeek.length > prevCountRef.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 3000);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = winsThisWeek.length;
  }, [winsThisWeek.length]);

  // ... getAutoValidation and getRank ...

  const getAutoValidation = () => {
    const count = winsThisWeek.length;
    if (count === 0) return AUTO_VALIDATIONS[0];
    return AUTO_VALIDATIONS[count % AUTO_VALIDATIONS.length];
  };

  const getRank = () => {
    const count = winsThisWeek.length;
    if (count === 5) {
      return {
        name: language === 'fr' ? 'Légende' : language === 'en' ? 'Legend' : 'Leyenda',
        icon: Crown,
        color: 'text-purple-600',
        bgGradient: 'from-purple-400 via-pink-400 to-rose-400',
        emoji: '👑'
      };
    } else if (count === 3) {
      return {
        name: 'Alpha',
        icon: Award,
        color: 'text-amber-600',
        bgGradient: 'from-amber-400 via-orange-400 to-rose-400',
        emoji: '🏆'
      };
    }
    return {
      name: getAutoValidation(),
      icon: Trophy,
      color: 'text-pink-600',
      bgGradient: 'from-pink-400 via-rose-400 to-orange-400',
      emoji: '🎉'
    };
  };

  const rank = getRank();

  const handleAddWin = () => {
    if (newWin.trim()) {
      addSmallWin(newWin.trim());
      setNewWin('');
    }
  };

  return (
    <div className="w-full">
      {/* Carte compacte - Style Badge Géant Animé */}
      <div
        className={`rounded-[1.5rem] p-6 shadow-xl shadow-gray-200/50 w-full cursor-pointer transition-all duration-300 relative overflow-hidden border-none bg-gradient-to-br ${rank.bgGradient} \
        ${isAnimating ? 'scale-105 ring-4 ring-pink-300 ring-offset-2 animate-pulse' : 'hover:scale-[1.02]'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Décoration d'arrière-plan */}
        <div className="absolute -right-6 -bottom-6 opacity-10 transform rotate-12">
          <rank.icon className="w-32 h-32 text-white" />
        </div>

        <div className="relative z-10 flex items-center justify-start gap-5">
          {/* Gauche : Emoji Géant */}
          <div className={`transition-transform duration-500 ${isAnimating ? 'scale-125 rotate-12' : ''}`}>
            <span className="text-5xl filter drop-shadow-lg">{rank.emoji}</span>
          </div>

          {/* Droite : Phrase qui change */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-md">
              {rank.name}
            </h3>
          </div>
        </div>
      </div>

      {/* Section expandée - Design magnifique */}
      {isExpanded && (
        <div className="mt-3 p-5 bg-white/80 backdrop-blur-md rounded-[1.5rem] shadow-xl shadow-gray-200/50 border border-pink-100/50 space-y-4 transition-all duration-300 ease-out">
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
              className="flex-1 px-4 py-3 text-sm bg-white border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 text-gray-800 placeholder:text-gray-400 shadow-md font-medium transition-all"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddWin();
              }}
              disabled={!newWin.trim()}
              className={`px-4 py-3 bg-gradient-to-r ${rank.bgGradient} hover:scale-105 disabled:bg-gray-300 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-xl transition-all disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 text-sm font-bold shadow-lg`}
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
                      ? `bg-gradient-to-br ${rank.bgGradient} shadow-md`
                      : 'bg-white/60 border border-pink-100 hover:border-pink-200'
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
    </div>
  );
}

