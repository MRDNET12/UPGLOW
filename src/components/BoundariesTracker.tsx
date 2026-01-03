import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { boundaries, getBoundaryLabel, getBoundaryDescription } from '@/lib/boundaries-data';
import { Shield, Plus, History, Check } from 'lucide-react';

export function BoundariesTracker() {
  const { t, language } = useTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const addBoundaryEntry = useStore((state) => state.addBoundaryEntry);
  const getBoundaryEntriesThisWeek = useStore((state) => state.getBoundaryEntriesThisWeek);
  const getBoundaryCountThisWeek = useStore((state) => state.getBoundaryCountThisWeek);
  const getBoundaryHistory = useStore((state) => state.getBoundaryHistory);

  const entriesThisWeek = getBoundaryEntriesThisWeek();
  const history = getBoundaryHistory();

  const handleAddBoundary = (boundaryKey: string) => {
    addBoundaryEntry(boundaryKey);
    setShowAddModal(false);
    
    // Show congrats at 3 boundaries
    if (entriesThisWeek.length + 1 === 3) {
      setShowCongrats(true);
      setTimeout(() => setShowCongrats(false), 4000);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t.bonus.boundariesTitle}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.bonus.boundariesThisWeek}: {entriesThisWeek.length}
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

      {/* Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="w-full mb-6 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        {t.bonus.addBoundary}
      </button>

      {/* Boundaries List */}
      <div className="space-y-3">
        {boundaries.map((boundary) => {
          const count = getBoundaryCountThisWeek(boundary.key);
          const isInRange = count >= boundary.idealFrequency.min && count <= boundary.idealFrequency.max;
          
          return (
            <div
              key={boundary.key}
              className={`p-4 rounded-lg border-2 transition-all ${
                count > 0
                  ? isInRange
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                    : 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700'
                  : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">{boundary.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {getBoundaryLabel(boundary.key, language)}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {getBoundaryDescription(boundary.key, language)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {t.bonus.idealFrequency}: {boundary.idealFrequency.min}-{boundary.idealFrequency.max} {t.bonus.timesPerWeek}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    count > 0
                      ? isInRange
                        ? 'bg-green-500 text-white'
                        : 'bg-purple-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  }`}>
                    {count}
                  </div>
                  {isInRange && count > 0 && (
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* History */}
      {showHistory && history.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {t.bonus.history}
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.map((entry) => {
              const boundary = boundaries.find(b => b.key === entry.boundaryType);
              return (
                <div
                  key={entry.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center gap-3"
                >
                  <span className="text-xl">{boundary?.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {boundary ? getBoundaryLabel(boundary.key, language) : entry.boundaryType}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t.bonus.selectBoundary}
            </h3>
            <div className="space-y-2">
              {boundaries.map((boundary) => (
                <button
                  key={boundary.key}
                  onClick={() => handleAddBoundary(boundary.key)}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700 rounded-xl transition-all text-left"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{boundary.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {getBoundaryLabel(boundary.key, language)}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {getBoundaryDescription(boundary.key, language)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              className="w-full mt-4 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl transition-colors"
            >
              Annuler
            </button>
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


