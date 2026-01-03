import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { Trophy, Plus, History, Sparkles } from 'lucide-react';

export function SmallWins() {
  const { t } = useTranslation();
  const [newWin, setNewWin] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  
  const addSmallWin = useStore((state) => state.addSmallWin);
  const winsThisWeek = useStore((state) => state.getSmallWinsThisWeek());
  const history = useStore((state) => state.getSmallWinsHistory());

  const handleAddWin = () => {
    if (newWin.trim()) {
      addSmallWin(newWin.trim());
      setNewWin('');
      
      // Show congrats popup at 3 wins
      if (winsThisWeek.length + 1 === 3) {
        setShowCongrats(true);
        setTimeout(() => setShowCongrats(false), 4000);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddWin();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t.bonus.smallWinsTitle}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.bonus.smallWinsThisWeek}: {winsThisWeek.length}/5
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <History className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500"
            style={{ width: `${Math.min((winsThisWeek.length / 5) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Input */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newWin}
            onChange={(e) => setNewWin(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t.bonus.smallWinPlaceholder}
            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:text-white"
          />
          <button
            onClick={handleAddWin}
            disabled={!newWin.trim()}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            {t.bonus.addSmallWin}
          </button>
        </div>
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

      {/* Congratulations Popup */}
      {showCongrats && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center animate-bounce-in">
            <div className="text-6xl mb-4">🥂</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t.bonus.congratulations}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t.bonus.keepGoing}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

