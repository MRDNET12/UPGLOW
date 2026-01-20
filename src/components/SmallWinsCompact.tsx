import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { Trophy, Plus, Award, Crown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SmallWinsQuickAdd } from '@/components/SmallWinsQuickAdd';

interface SmallWinsCompactProps {
  theme?: 'light' | 'dark';
}

export function SmallWinsCompact({ theme = 'light' }: SmallWinsCompactProps) {
  const { t, language } = useTranslation();
  const [showDialog, setShowDialog] = useState(false);
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
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-100 dark:bg-purple-900/30'
      };
    } else if (count >= 3) {
      return {
        name: 'Alpha',
        icon: Award,
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
      };
    }
    return null;
  };

  const rank = getRank();

  return (
    <>
      <div
        className={`rounded-2xl p-4 shadow-sm w-full cursor-pointer transition-all hover:shadow-md ${
          winsThisWeek.length > 0
            ? (theme === 'dark'
                ? 'bg-gradient-to-br from-yellow-900/20 via-amber-900/20 to-orange-900/20'
                : 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50')
            : (theme === 'dark' ? 'bg-gray-800' : 'bg-white')
        }`}
        onClick={() => setShowDialog(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {t.bonus.smallWinsTitle}
                </h3>
                {rank && (
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${rank.bgColor}`}>
                    <rank.icon className={`w-3 h-3 ${rank.color}`} />
                    <span className={`text-xs font-bold ${rank.color}`}>{rank.name}</span>
                  </div>
                )}
              </div>
              {lastWin ? (
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {lastWin.text}
                </p>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                  {t.bonus.addSmallWin}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDialog(true);
            }}
            className="ml-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 rounded-full flex items-center justify-center flex-shrink-0 transition-all shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          className={`max-w-md mx-5 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom duration-300`}
        >
          <DialogHeader>
            <DialogTitle className="sr-only">{t.bonus.smallWinsTitle}</DialogTitle>
          </DialogHeader>
          <SmallWinsQuickAdd theme={theme} />
        </DialogContent>
      </Dialog>
    </>
  );
}

