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
        color: 'text-soft-purple-500',
        bgColor: 'bg-soft-purple-100'
      };
    } else if (count >= 3) {
      return {
        name: 'Alpha',
        icon: Award,
        color: 'text-soft-orange-500',
        bgColor: 'bg-soft-orange-100'
      };
    }
    return null;
  };

  const rank = getRank();

  return (
    <>
      <div
        className={`rounded-2xl p-3 shadow-soft w-full cursor-pointer transition-all hover:scale-[1.01] relative overflow-hidden ${
          winsThisWeek.length > 0
            ? 'bg-gradient-to-br from-soft-orange-100 to-soft-orange-200'
            : 'bg-white'
        }`}
        onClick={() => setShowDialog(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-9 h-9 bg-white/60 rounded-xl flex items-center justify-center flex-shrink-0">
              <Trophy className="w-4 h-4 text-soft-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <h3 className="text-sm font-bold text-navy-900">
                  {t.bonus.smallWinsTitle}
                </h3>
                {rank && (
                  <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${rank.bgColor}`}>
                    <rank.icon className={`w-2.5 h-2.5 ${rank.color}`} />
                    <span className={`text-[10px] font-bold ${rank.color}`}>{rank.name}</span>
                  </div>
                )}
              </div>
              {lastWin ? (
                <p className="text-[11px] text-navy-800 truncate">
                  {lastWin.text}
                </p>
              ) : (
                <p className="text-[11px] text-stone-500 italic">
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
            className="ml-1 w-7 h-7 bg-gradient-to-r from-soft-orange-400 to-soft-orange-500 hover:from-soft-orange-500 hover:to-soft-orange-600 rounded-full flex items-center justify-center flex-shrink-0 transition-all shadow-soft"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 backdrop-blur-2xl border-2 border-pink-200/50 shadow-2xl shadow-pink-300/50 rounded-[2.5rem] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom duration-300 px-0"
        >
          <DialogHeader className="px-0 pb-0">
            <DialogTitle className="sr-only">{t.bonus.smallWinsTitle}</DialogTitle>
          </DialogHeader>
          <div className="px-0 py-6">
            <SmallWinsQuickAdd theme={theme} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

