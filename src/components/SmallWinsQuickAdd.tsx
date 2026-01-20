import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { Trophy, Plus, ChevronDown, ChevronUp, History, Award, Crown, Sparkles } from 'lucide-react';

interface SmallWinsQuickAddProps {
  theme?: 'light' | 'dark';
}

export function SmallWinsQuickAdd({ theme = 'light' }: SmallWinsQuickAddProps) {
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

  // Déterminer le palier actuel
  const getRank = () => {
    const count = winsThisWeek.length;
    if (count >= 5) {
      return {
        name: language === 'fr' ? 'Légende' : language === 'en' ? 'Legend' : 'Leyenda',
        icon: Crown,
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
        progress: 100,
        message: language === 'fr' ? '🎉 Statut Légende atteint !' : language === 'en' ? '🎉 Legend status achieved!' : '🎉 ¡Estado Leyenda alcanzado!'
      };
    } else if (count >= 3) {
      return {
        name: 'Alpha',
        icon: Award,
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-gradient-to-r from-yellow-400 to-orange-500',
        progress: (count / 5) * 100,
        message: language === 'fr' ? `Plus que ${5 - count} pour Légende !` : language === 'en' ? `${5 - count} more for Legend!` : `¡${5 - count} más para Leyenda!`
      };
    } else {
      return {
        name: language === 'fr' ? 'Débutant' : language === 'en' ? 'Beginner' : 'Principiante',
        icon: Sparkles,
        color: 'text-gray-600 dark:text-gray-400',
        bgColor: 'bg-gradient-to-r from-gray-400 to-gray-500',
        progress: (count / 5) * 100,
        message: language === 'fr' ? `Plus que ${3 - count} pour Alpha !` : language === 'en' ? `${3 - count} more for Alpha!` : `¡${3 - count} más para Alpha!`
      };
    }
  };

  const rank = getRank();

  return (
    <div className={`rounded-2xl p-5 shadow-lg w-full ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-yellow-50/30'}`}>
      {/* Header avec badge de rang */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${rank.bgColor} rounded-2xl flex items-center justify-center shadow-lg`}>
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {t.bonus.smallWinsTitle}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <rank.icon className={`w-4 h-4 ${rank.color}`} />
              <span className={`text-sm font-bold ${rank.color}`}>
                {rank.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                • {winsThisWeek.length} {language === 'fr' ? 'cette semaine' : language === 'en' ? 'this week' : 'esta semana'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de progression améliorée */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {rank.message}
          </span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full ${rank.bgColor} transition-all duration-500 shadow-lg`}
            style={{ width: `${rank.progress}%` }}
          />
        </div>
      </div>

      {/* FAQ Pourquoi ? */}
      <div className="mb-3">
        <button
          onClick={() => setShowFaq(!showFaq)}
          className="w-full flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
        >
          <span className="font-semibold text-gray-900 dark:text-white text-xs">
            {t.bonus.why || 'Pourquoi ?'}
          </span>
          {showFaq ? (
            <ChevronUp className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          )}
        </button>

        {showFaq && (
          <div className="mt-2 p-3 bg-yellow-50/50 dark:bg-yellow-900/10 rounded-xl space-y-2 text-xs">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">{t.bonus.smallWinsDescription || 'Célèbre tes victoires quotidiennes !'}</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>{t.bonus.smallWinsStep1 || 'Note trois petits accomplissements réalisés cette semaine (même les plus minimes).'}</li>
                <li>{t.bonus.smallWinsStep2 || 'Décris pourquoi ces accomplissements sont importants pour toi.'}</li>
                <li>{t.bonus.smallWinsStep3 || 'Relis cette liste chaque matin pour te rappeler que tu es capable.'}</li>
              </ol>
            </div>
            <div className="pt-2 border-t border-yellow-200 dark:border-yellow-800">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">{t.bonus.whyItWorks || 'Pourquoi ça marche ?'}</p>
              <p className="text-gray-700 dark:text-gray-300">
                {t.bonus.smallWinsExplanation || "L'auto-valorisation aide à renforcer la confiance et réduire le sentiment d'échec."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input amélioré */}
      <div className="mb-4">
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
            placeholder={t.bonus.smallWinPlaceholder}
            className="flex-1 px-4 py-3 text-sm bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:text-white placeholder:text-gray-400 shadow-sm"
          />
          <button
            onClick={handleAddWin}
            disabled={!newWin.trim()}
            className={`px-5 py-3 ${rank.bgColor} hover:shadow-lg disabled:bg-gray-300 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl transition-all disabled:cursor-not-allowed flex items-center gap-2 text-sm font-semibold shadow-md`}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Succès de la semaine */}
      {winsThisWeek.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
            {language === 'fr' ? 'Cette semaine' : language === 'en' ? 'This week' : 'Esta semana'}
          </p>
          <div className="space-y-2">
            {winsThisWeek.slice().reverse().map((win, index) => (
              <div
                key={win.id}
                className={`p-3 rounded-xl border-2 transition-all ${
                  index === 0
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border-yellow-300 dark:border-yellow-700 shadow-md'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start gap-2">
                  <Trophy className={`w-4 h-4 mt-0.5 flex-shrink-0 ${index === 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{win.text}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(win.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historique amélioré */}
      {history.length > 0 && (
        <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-bold text-gray-900 dark:text-white text-sm">
                {language === 'fr' ? 'Historique' : language === 'en' ? 'History' : 'Historial'} ({history.length})
              </span>
            </div>
            {showHistory ? (
              <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {showHistory && (
            <div className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1">
              {history.map((win) => (
                <div
                  key={win.id}
                  className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-yellow-300 dark:hover:border-yellow-700 transition-all"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{win.text}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(win.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

