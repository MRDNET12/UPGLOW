import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { Trophy, Plus, Award, Crown, ChevronDown, ChevronUp } from 'lucide-react';

interface SmallWinsCompactProps {
  theme?: 'light' | 'dark';
}

export function SmallWinsCompact({ theme = 'light' }: SmallWinsCompactProps) {
  const { t, language } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [newWin, setNewWin] = useState('');

  const addSmallWin = useStore((state) => state.addSmallWin);
  const getSmallWinsThisWeek = useStore((state) => state.getSmallWinsThisWeek);

  const winsThisWeek = getSmallWinsThisWeek();
  const lastWin = winsThisWeek.length > 0 ? winsThisWeek[winsThisWeek.length - 1] : null;

  // Déterminer le palier
  const getRank = () => {
    const count = winsThisWeek.length;
    if (count >= 5) {
      return {
        name: language === 'fr' ? 'Légende' : language === 'en' ? 'Legend' : 'Leyenda',
        icon: Crown,
        color: 'text-purple-600',
        bgGradient: 'from-purple-400 via-pink-400 to-rose-400',
        emoji: '👑'
      };
    } else if (count >= 3) {
      return {
        name: 'Alpha',
        icon: Award,
        color: 'text-amber-600',
        bgGradient: 'from-amber-400 via-orange-400 to-rose-400',
        emoji: '🏆'
      };
    }
    return {
      name: language === 'fr' ? 'En route' : language === 'en' ? 'On the way' : 'En camino',
      icon: Trophy,
      color: 'text-pink-600',
      bgGradient: 'from-pink-400 via-rose-400 to-orange-400',
      emoji: '✨'
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
      {/* Carte compacte - Cliquable pour expand */}
      <div
        className={`rounded-[1.5rem] p-4 shadow-xl shadow-pink-100/50 w-full cursor-pointer transition-all hover:scale-[1.02] relative overflow-hidden border-none ${
          winsThisWeek.length > 0
            ? 'bg-gradient-to-br from-pink-50 via-rose-50 to-white'
            : 'bg-white/80 backdrop-blur-md'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${rank.bgGradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <Trophy className="w-5 h-5 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold text-gray-800">
                  {t.bonus.smallWinsTitle}
                </h3>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r ${rank.bgGradient}`}>
                  <span className="text-xs">{rank.emoji}</span>
                  <span className="text-[10px] font-bold text-white drop-shadow-md">{rank.name}</span>
                </div>
              </div>
              {lastWin ? (
                <p className="text-xs text-gray-600 truncate font-medium">
                  {lastWin.text}
                </p>
              ) : (
                <p className="text-xs text-gray-500 italic">
                  {t.bonus.addSmallWin}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-600">{winsThisWeek.length}/5</span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-pink-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-pink-500" />
            )}
          </div>
        </div>
      </div>

      {/* Section expandée - Design magnifique */}
      {isExpanded && (
        <div className="mt-3 p-5 bg-white/80 backdrop-blur-md rounded-[1.5rem] shadow-xl shadow-pink-100/50 border border-pink-100/50 space-y-4 animate-in slide-in-from-top duration-300">
          {/* FAQ Pourquoi ? - Design magnifique */}
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowWhy(!showWhy);
              }}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100 rounded-xl hover:from-pink-200 hover:via-rose-200 hover:to-orange-200 transition-all shadow-lg shadow-pink-200/50 border border-pink-200/50"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">💡</span>
                <span className="font-bold text-gray-800 text-sm">
                  {t.bonus.why || 'Pourquoi ?'}
                </span>
              </div>
              {showWhy ? (
                <ChevronUp className="w-5 h-5 text-pink-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-pink-500" />
              )}
            </button>

            {showWhy && (
              <div className="mt-3 p-4 bg-white/80 backdrop-blur-md rounded-xl space-y-3 shadow-lg shadow-pink-200/50 border border-pink-100/50 animate-in slide-in-from-top duration-300">
                <div>
                  <p className="font-bold text-gray-800 mb-2 text-sm">{t.bonus.smallWinsDescription || 'Célèbre tes victoires quotidiennes !'}</p>
                  <ol className="list-decimal list-inside space-y-1.5 text-gray-700 font-medium text-xs">
                    <li>{t.bonus.smallWinsStep1 || 'Note trois petits accomplissements réalisés cette semaine (même les plus minimes).'}</li>
                    <li>{t.bonus.smallWinsStep2 || 'Décris pourquoi ces accomplissements sont importants pour toi.'}</li>
                    <li>{t.bonus.smallWinsStep3 || 'Relis cette liste chaque matin pour te rappeler que tu es capable.'}</li>
                  </ol>
                </div>
                <div className="pt-3 border-t-2 border-pink-200">
                  <p className="font-bold text-gray-800 mb-2 text-sm">{t.bonus.whyItWorks || 'Pourquoi ça marche ?'}</p>
                  <p className="text-gray-700 font-medium text-xs leading-relaxed">
                    {t.bonus.smallWinsExplanation || "L'auto-valorisation aide à renforcer la confiance et réduire le sentiment d'échec."}
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
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {winsThisWeek.slice().reverse().map((win, index) => (
                  <div
                    key={win.id}
                    className={`p-3 rounded-xl transition-all ${
                      index === 0
                        ? `bg-gradient-to-br ${rank.bgGradient} shadow-lg`
                        : 'bg-white/60 border border-pink-100 hover:border-pink-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Trophy className={`w-4 h-4 flex-shrink-0 mt-0.5 ${index === 0 ? 'text-white' : 'text-pink-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold leading-relaxed ${index === 0 ? 'text-white' : 'text-gray-800'}`}>
                          {win.text}
                        </p>
                        <p className={`text-xs mt-1 font-medium ${index === 0 ? 'text-white/90' : 'text-gray-500'}`}>
                          {new Date(win.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Barre de progression avec points */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-700">
                {winsThisWeek.length >= 5
                  ? (language === 'fr' ? '🎉 Statut Légende !' : language === 'en' ? '🎉 Legend status!' : '¡Estado Leyenda!')
                  : winsThisWeek.length >= 3
                    ? (language === 'fr' ? `Plus que ${5 - winsThisWeek.length} pour Légende !` : language === 'en' ? `${5 - winsThisWeek.length} more for Legend!` : `¡${5 - winsThisWeek.length} más para Leyenda!`)
                    : (language === 'fr' ? `Plus que ${3 - winsThisWeek.length} pour Alpha !` : language === 'en' ? `${3 - winsThisWeek.length} more for Alpha!` : `¡${3 - winsThisWeek.length} más para Alpha!`)
                }
              </span>
              <span className="text-xs font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                {winsThisWeek.length}/5
              </span>
            </div>

            {/* Barre avec points style image */}
            <div className="relative flex items-center justify-between px-1">
              {/* Barre de fond */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-purple-200 via-pink-200 to-rose-200 rounded-full shadow-inner" />

              {/* Barre de progression */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 rounded-full shadow-lg transition-all duration-700"
                style={{
                  width: `calc(${(winsThisWeek.length / 5) * 100}% - ${winsThisWeek.length === 0 ? '0px' : '0px'})`
                }}
              />

              {/* Points (5 points pour 5 succès) */}
              {[0, 1, 2, 3, 4].map((index) => {
                const isCompleted = index < winsThisWeek.length;
                const isCurrent = index === winsThisWeek.length;

                return (
                  <div
                    key={index}
                    className="relative z-10 flex items-center justify-center transition-all duration-500"
                    style={{ flex: 1 }}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isCompleted
                          ? 'bg-gradient-to-br from-amber-300 via-orange-300 to-amber-400 shadow-lg shadow-orange-300/50 scale-110'
                          : isCurrent
                            ? 'bg-gradient-to-br from-purple-300 via-pink-300 to-rose-300 shadow-lg shadow-pink-300/50 scale-105 animate-pulse'
                            : 'bg-white border-2 border-purple-200 shadow-md'
                      }`}
                    >
                      {isCompleted ? (
                        <span className="text-white text-sm font-bold drop-shadow-md">✓</span>
                      ) : (
                        <div className={`w-3 h-3 rounded-full ${isCurrent ? 'bg-white' : 'bg-purple-200'}`} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

