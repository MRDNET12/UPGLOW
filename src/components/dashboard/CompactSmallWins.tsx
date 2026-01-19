'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { Trophy, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CompactSmallWinsProps {
  theme?: 'light' | 'dark';
}

export function CompactSmallWins({ theme = 'light' }: CompactSmallWinsProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newWin, setNewWin] = useState('');

  const addSmallWin = useStore((state) => state.addSmallWin);
  const getSmallWinsThisWeek = useStore((state) => state.getSmallWinsThisWeek);
  const removeSmallWin = useStore((state) => state.removeSmallWin);

  const winsThisWeek = getSmallWinsThisWeek();
  const progress = (winsThisWeek.length / 3) * 100;

  const handleAddWin = () => {
    if (newWin.trim()) {
      addSmallWin(newWin.trim());
      setNewWin('');
    }
  };

  const latestWin = winsThisWeek.length > 0 ? winsThisWeek[winsThisWeek.length - 1] : null;

  return (
    <div className={`rounded-2xl p-4 shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Header - Always visible */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {t.bonus.smallWinsTitle}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {t.bonus.smallWinsThisWeek}: {winsThisWeek.length}/3
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <Progress value={progress} className="h-2 mb-3" />

      {/* Latest Win - Always visible */}
      {latestWin && !isExpanded && (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
            {latestWin.text}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {new Date(latestWin.date).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-3 mt-3">
          {/* Add New Win */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newWin}
              onChange={(e) => setNewWin(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddWin();
                }
              }}
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

          {/* All Wins This Week */}
          {winsThisWeek.length > 0 && (
            <div className="space-y-2">
              {winsThisWeek.map((win) => (
                <div
                  key={win.id}
                  className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {win.text}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(win.date).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeSmallWin(win.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 text-xs transition-opacity"
                    >
                      ✕
                    </button>
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

