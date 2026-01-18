import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Shield, Plus, History, Trash2 } from 'lucide-react';

export function BoundariesTracker() {
  const [newBoundary, setNewBoundary] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const addBoundaryEntry = useStore((state) => state.addBoundaryEntry);
  const getBoundaryEntriesThisWeek = useStore((state) => state.getBoundaryEntriesThisWeek);
  const getBoundaryHistory = useStore((state) => state.getBoundaryHistory);
  const removeBoundaryEntry = useStore((state) => state.removeBoundaryEntry);

  const entriesThisWeek = getBoundaryEntriesThisWeek();
  const history = getBoundaryHistory();

  const handleAddBoundary = () => {
    if (newBoundary.trim()) {
      addBoundaryEntry(newBoundary.trim());
      setNewBoundary('');

      // Show congrats at 3 boundaries
      if (entriesThisWeek.length + 1 === 3) {
        setShowCongrats(true);
        setTimeout(() => setShowCongrats(false), 4000);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddBoundary();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              8 limites pour préserver ta paix intérieure
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Cette semaine : {entriesThisWeek.length}
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

      {/* Description */}
      <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          Apprends à poser des limites saines pour préserver ta paix intérieure.
        </p>
        <div className="pt-2 border-t border-purple-200 dark:border-purple-800">
          <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
            Pourquoi ça marche ?
          </p>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Poser des limites n'est pas égoïste, c'est essentiel pour ton bien-être mental et émotionnel.
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-500"
            style={{ width: `${Math.min((entriesThisWeek.length / 8) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Input */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newBoundary}
            onChange={(e) => setNewBoundary(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Quelle limite as-tu posée ?"
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
          />
          <button
            onClick={handleAddBoundary}
            disabled={!newBoundary.trim()}
            className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Ajouter</span>
            <span className="sm:hidden">+</span>
          </button>
        </div>
      </div>

      {/* This Week's Boundaries */}
      {entriesThisWeek.length > 0 && (
        <div className="space-y-2 mb-4">
          {entriesThisWeek.map((entry) => (
            <div
              key={entry.id}
              className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg"
            >
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">{entry.boundaryType}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => removeBoundaryEntry && removeBoundaryEntry(entry.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History */}
      {showHistory && history.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Historique
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {entry.boundaryType}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
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
              Félicitations !
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Continue comme ça !
            </p>
          </div>
        </div>
      )}
    </div>
  );
}


