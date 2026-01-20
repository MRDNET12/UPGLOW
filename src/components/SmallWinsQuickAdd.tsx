import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { Trophy, Plus, ChevronDown, ChevronUp, History, Award, Crown, Sparkles, Star, Zap } from 'lucide-react';

interface SmallWinsQuickAddProps {
  theme?: 'light' | 'dark';
}

export function SmallWinsQuickAdd({ }: SmallWinsQuickAddProps) {
  const { t, language } = useTranslation();
  const [newWin, setNewWin] = useState('');
  const [showFaq, setShowFaq] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const addSmallWin = useStore((state) => state.addSmallWin);
  const getSmallWinsThisWeek = useStore((state) => state.getSmallWinsThisWeek);
  const getSmallWinsHistory = useStore((state) => state.getSmallWinsHistory);

  const winsThisWeek = getSmallWinsThisWeek();
  const history = getSmallWinsHistory();

  const handleAddWin = () => {
    if (newWin.trim()) {
      addSmallWin(newWin.trim());
      setNewWin('');
    }
  };

  // Déterminer le palier actuel avec design amélioré
  const getRank = () => {
    const count = winsThisWeek.length;
    if (count >= 5) {
      return {
        name: language === 'fr' ? 'Légende' : language === 'en' ? 'Legend' : 'Leyenda',
        icon: Crown,
        color: 'text-purple-600',
        bgGradient: 'from-purple-400 via-pink-400 to-rose-400',
        borderColor: 'border-purple-300',
        shadowColor: 'shadow-purple-200/50',
        progress: 100,
        message: language === 'fr' ? '🎉 Statut Légende atteint !' : language === 'en' ? '🎉 Legend status achieved!' : '¡Estado Leyenda alcanzado!',
        showBadge: true,
        emoji: '👑'
      };
    } else if (count >= 3) {
      return {
        name: 'Alpha',
        icon: Award,
        color: 'text-amber-600',
        bgGradient: 'from-amber-400 via-orange-400 to-rose-400',
        borderColor: 'border-amber-300',
        shadowColor: 'shadow-amber-200/50',
        progress: (count / 5) * 100,
        message: language === 'fr' ? `Plus que ${5 - count} pour Légende !` : language === 'en' ? `${5 - count} more for Legend!` : `¡${5 - count} más para Leyenda!`,
        showBadge: true,
        emoji: '🏆'
      };
    } else {
      return {
        name: language === 'fr' ? 'En route' : language === 'en' ? 'On the way' : 'En camino',
        icon: Sparkles,
        color: 'text-pink-600',
        bgGradient: 'from-pink-400 via-rose-400 to-orange-400',
        borderColor: 'border-pink-300',
        shadowColor: 'shadow-pink-200/50',
        progress: (count / 5) * 100,
        message: language === 'fr' ? `Plus que ${3 - count} pour Alpha !` : language === 'en' ? `${3 - count} more for Alpha!` : `¡${3 - count} más para Alpha!`,
        showBadge: true,
        emoji: '✨'
      };
    }
  };

  const rank = getRank();

  return (
    <div className="w-full px-5">
      {/* Header magnifique avec badge de rang */}
      <div className="mb-5">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 bg-gradient-to-br ${rank.bgGradient} rounded-2xl flex items-center justify-center shadow-2xl ${rank.shadowColor} relative`}>
            <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm"></div>
            <Trophy className="w-8 h-8 text-white drop-shadow-2xl relative z-10" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-orange-500 bg-clip-text text-transparent mb-1">
              {t.bonus.smallWinsTitle}
            </h3>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${rank.bgGradient} shadow-lg ${rank.shadowColor}`}>
                <span className="text-lg">{rank.emoji}</span>
                <span className="text-sm font-bold text-white drop-shadow-md">
                  {rank.name}
                </span>
              </div>
              <span className="text-sm text-gray-600 font-semibold">
                {winsThisWeek.length} {language === 'fr' ? 'cette semaine' : language === 'en' ? 'this week' : 'esta semana'}
              </span>
            </div>
          </div>
        </div>

        {/* Barre de progression magnifique */}
        <div className={`p-4 rounded-2xl bg-white/60 backdrop-blur-md shadow-xl ${rank.shadowColor} border ${rank.borderColor}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-800">
              {rank.message}
            </span>
            <span className="text-sm font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              {Math.round(rank.progress)}%
            </span>
          </div>
          <div className="h-3 bg-gradient-to-r from-pink-100 via-rose-100 to-orange-100 rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full bg-gradient-to-r ${rank.bgGradient} transition-all duration-700 shadow-lg relative`}
              style={{ width: `${rank.progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Pourquoi ? - Design magnifique */}
      <div className="mb-5">
        <button
          onClick={() => setShowFaq(!showFaq)}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100 rounded-2xl hover:from-pink-200 hover:via-rose-200 hover:to-orange-200 transition-all shadow-xl shadow-pink-200/50 border border-pink-200/50"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">💡</span>
            <span className="font-bold text-gray-800 text-base">
              {t.bonus.why || 'Pourquoi ?'}
            </span>
          </div>
          {showFaq ? (
            <ChevronUp className="w-5 h-5 text-pink-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-pink-500" />
          )}
        </button>

        {showFaq && (
          <div className="mt-3 p-5 bg-white/80 backdrop-blur-md rounded-2xl space-y-4 shadow-2xl shadow-pink-200/50 border border-pink-100/50">
            <div>
              <p className="font-bold text-gray-800 mb-3 text-base">{t.bonus.smallWinsDescription || 'Célèbre tes victoires quotidiennes !'}</p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 font-semibold text-sm">
                <li>{t.bonus.smallWinsStep1 || 'Note trois petits accomplissements réalisés cette semaine (même les plus minimes).'}</li>
                <li>{t.bonus.smallWinsStep2 || 'Décris pourquoi ces accomplissements sont importants pour toi.'}</li>
                <li>{t.bonus.smallWinsStep3 || 'Relis cette liste chaque matin pour te rappeler que tu es capable.'}</li>
              </ol>
            </div>
            <div className="pt-4 border-t-2 border-pink-200">
              <p className="font-bold text-gray-800 mb-2 text-base">{t.bonus.whyItWorks || 'Pourquoi ça marche ?'}</p>
              <p className="text-gray-700 font-semibold text-sm leading-relaxed">
                {t.bonus.smallWinsExplanation || "L'auto-valorisation aide à renforcer la confiance et réduire le sentiment d'échec."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input magnifique */}
      <div className="mb-5">
        <div className="flex gap-3">
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
            placeholder={t.bonus.smallWinPlaceholder}
            className="flex-1 px-5 py-4 text-base bg-white/80 backdrop-blur-md border-2 border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 text-gray-800 placeholder:text-gray-400 shadow-xl shadow-pink-200/50 font-semibold transition-all"
          />
          <button
            onClick={handleAddWin}
            disabled={!newWin.trim()}
            className={`px-5 py-4 bg-gradient-to-r ${rank.bgGradient} hover:scale-105 disabled:bg-gray-300 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-2xl transition-all disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 text-base font-bold shadow-2xl ${rank.shadowColor} hover:shadow-pink-300/50`}
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Succès de la semaine - Design magnifique */}
      {winsThisWeek.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🌟</span>
            <p className="text-sm font-bold text-gray-800 uppercase tracking-wide">
              {language === 'fr' ? 'Cette semaine' : language === 'en' ? 'This week' : 'Esta semana'}
            </p>
          </div>
          <div className="space-y-3">
            {winsThisWeek.slice().reverse().map((win, index) => (
              <div
                key={win.id}
                className={`p-4 rounded-2xl transition-all shadow-xl ${
                  index === 0
                    ? `bg-gradient-to-br ${rank.bgGradient} border-2 ${rank.borderColor} ${rank.shadowColor} scale-[1.02]`
                    : 'bg-white/80 backdrop-blur-md border border-pink-100/50 shadow-pink-200/30 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    index === 0
                      ? 'bg-white/30 backdrop-blur-sm'
                      : 'bg-gradient-to-br from-pink-100 to-rose-100'
                  }`}>
                    <Trophy className={`w-5 h-5 drop-shadow-lg ${index === 0 ? 'text-white' : 'text-pink-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-base font-bold leading-relaxed ${index === 0 ? 'text-white drop-shadow-md' : 'text-gray-800'}`}>
                      {win.text}
                    </p>
                    <p className={`text-sm mt-1.5 font-semibold ${index === 0 ? 'text-white/90' : 'text-gray-600'}`}>
                      {new Date(win.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historique - Design magnifique */}
      {history.length > 0 && (
        <div className="border-t-2 border-pink-200 pt-5">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between p-4 bg-white/80 backdrop-blur-md rounded-2xl hover:bg-gradient-to-br hover:from-pink-50 hover:to-rose-50 transition-all shadow-xl shadow-pink-200/50 border border-pink-100/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center">
                <History className="w-5 h-5 text-pink-500" />
              </div>
              <span className="font-bold text-gray-800 text-base">
                {language === 'fr' ? 'Historique' : language === 'en' ? 'History' : 'Historial'} ({history.length})
              </span>
            </div>
            {showHistory ? (
              <ChevronUp className="w-6 h-6 text-pink-500" />
            ) : (
              <ChevronDown className="w-6 h-6 text-pink-500" />
            )}
          </button>

          {showHistory && (
            <div className="mt-4 space-y-3 max-h-80 overflow-y-auto pr-2">
              {history.map((win) => (
                <div
                  key={win.id}
                  className="p-4 bg-white/80 backdrop-blur-md border border-pink-100/50 rounded-2xl hover:border-pink-200 hover:shadow-xl transition-all shadow-lg shadow-pink-200/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-4 h-4 text-pink-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-gray-800 leading-relaxed">{win.text}</p>
                      <p className="text-sm text-gray-600 mt-1 font-semibold">
                        {new Date(win.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

