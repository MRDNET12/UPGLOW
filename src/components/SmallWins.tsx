import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { Trophy, History, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export function SmallWins() {
  const { t } = useTranslation();
  const [showHistory, setShowHistory] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  const getSmallWinsThisWeek = useStore((state) => state.getSmallWinsThisWeek);
  const getSmallWinsHistory = useStore((state) => state.getSmallWinsHistory);

  const winsThisWeek = getSmallWinsThisWeek();
  const history = getSmallWinsHistory();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {t.bonus.smallWinsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {t.bonus.smallWinsThisWeek}: {winsThisWeek.length}/3
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
        >
          <History className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500"
            style={{ width: `${Math.min((winsThisWeek.length / 3) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* FAQ Pourquoi ? */}
      <div className="mb-4">
        <button
          onClick={() => setShowFaq(!showFaq)}
          className="w-full flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
        >
          <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
            Pourquoi ?
          </span>
          {showFaq ? (
            <ChevronUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          )}
        </button>

        {showFaq && (
          <div className="mt-3 p-4 bg-yellow-50/50 dark:bg-yellow-900/10 rounded-xl space-y-3 text-sm">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">Durée : 2 à 4 minutes</p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Note trois petits accomplissements réalisés cette semaine (même les plus minimes).</li>
                <li>Décris pourquoi ces accomplissements sont importants pour toi.</li>
                <li>Relis cette liste chaque matin pour te rappeler que tu es capable.</li>
              </ol>
            </div>
            <div className="pt-3 border-t border-yellow-200 dark:border-yellow-800">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">Pourquoi ça marche ?</p>
              <p className="text-gray-700 dark:text-gray-300">
                L'auto-valorisation aide à renforcer la confiance et réduire le sentiment d'échec.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* This Week's Wins */}
      {winsThisWeek.length > 0 && (
        <div className="space-y-2 mb-4">
          {winsThisWeek.map((win) => (
            <div
              key={win.id}
              className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
            >
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white">{win.text}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(win.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History */}
      {showHistory && history.length > winsThisWeek.length && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {t.bonus.history}
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.slice(winsThisWeek.length).map((win) => (
              <div
                key={win.id}
                className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <p className="text-sm text-gray-900 dark:text-white">{win.text}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(win.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

