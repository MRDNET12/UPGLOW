import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { Trophy, Plus, ChevronDown, ChevronUp, History } from 'lucide-react';

interface SmallWinsQuickAddProps {
  theme?: 'light' | 'dark';
}

export function SmallWinsQuickAdd({ theme = 'light' }: SmallWinsQuickAddProps) {
  const { t } = useTranslation();
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddWin();
    }
  };

  return (
    <div className={`rounded-2xl p-4 shadow-sm w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
          <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {t.bonus.smallWinsTitle}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {winsThisWeek.length}/3 cette semaine
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500"
            style={{ width: `${Math.min((winsThisWeek.length / 3) * 100, 100)}%` }}
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
            Pourquoi ?
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
              <p className="font-semibold text-gray-900 dark:text-white mb-1">Célèbre tes victoires quotidiennes !</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>Note trois petits accomplissements réalisés cette semaine (même les plus minimes).</li>
                <li>Décris pourquoi ces accomplissements sont importants pour toi.</li>
                <li>Relis cette liste chaque matin pour te rappeler que tu es capable.</li>
              </ol>
            </div>
            <div className="pt-2 border-t border-yellow-200 dark:border-yellow-800">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">Pourquoi ça marche ?</p>
              <p className="text-gray-700 dark:text-gray-300">
                L'auto-valorisation aide à renforcer la confiance et réduire le sentiment d'échec.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newWin}
          onChange={(e) => setNewWin(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t.bonus.smallWinPlaceholder}
          className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:text-white"
        />
        <button
          onClick={handleAddWin}
          disabled={!newWin.trim()}
          className="px-4 py-2 text-sm bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Dernier ajouté */}
      {winsThisWeek.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Dernier ajouté :</p>
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-gray-900 dark:text-white">{winsThisWeek[winsThisWeek.length - 1].text}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {new Date(winsThisWeek[winsThisWeek.length - 1].date).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {/* Historique */}
      {history.length > 0 && (
        <div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="font-semibold text-gray-900 dark:text-white text-xs">
                Historique ({history.length})
              </span>
            </div>
            {showHistory ? (
              <ChevronUp className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            )}
          </button>

          {showHistory && (
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {history.map((win) => (
                <div
                  key={win.id}
                  className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <p className="text-sm text-gray-900 dark:text-white">{win.text}</p>
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

