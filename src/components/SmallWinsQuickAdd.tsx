import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { Trophy, Plus } from 'lucide-react';

interface SmallWinsQuickAddProps {
  theme?: 'light' | 'dark';
}

export function SmallWinsQuickAdd({ theme = 'light' }: SmallWinsQuickAddProps) {
  const { t } = useTranslation();
  const [newWin, setNewWin] = useState('');

  const addSmallWin = useStore((state) => state.addSmallWin);
  const getSmallWinsThisWeek = useStore((state) => state.getSmallWinsThisWeek);

  const winsThisWeek = getSmallWinsThisWeek();

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

      {/* Input */}
      <div className="flex gap-2">
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
    </div>
  );
}

