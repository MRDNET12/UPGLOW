'use client';

import { useState } from 'react';
import { Shield, Plus, HelpCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BoundariesTracker from './BoundariesTracker';

interface BoundariesCompactProps {
  theme: 'light' | 'dark';
}

export default function BoundariesCompact({ theme }: BoundariesCompactProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const { language, getBoundaryEntriesThisWeek } = useStore();
  const { t } = useTranslation();

  // Obtenir les limites de cette semaine
  const boundariesThisWeek = getBoundaryEntriesThisWeek();
  const thisWeekCount = boundariesThisWeek.length;

  // Obtenir la dernière limite pratiquée
  const lastBoundary = boundariesThisWeek[boundariesThisWeek.length - 1];

  return (
    <>
      <div
        className={`rounded-2xl p-4 shadow-sm w-full cursor-pointer transition-all hover:shadow-md ${
          thisWeekCount > 0
            ? (theme === 'dark'
                ? 'bg-gradient-to-br from-pink-900/20 via-rose-900/20 to-purple-900/20'
                : 'bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50')
            : (theme === 'dark' ? 'bg-gray-800' : 'bg-white')
        }`}
        onClick={() => setShowDialog(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {t.bonus.boundariesTitle}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFaq(!showFaq);
                  }}
                  className="text-pink-500 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-300 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>
              {lastBoundary ? (
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {language === 'fr' ? 'Limite pratiquée' : language === 'en' ? 'Boundary practiced' : 'Límite practicado'}
                </p>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                  {t.bonus.addBoundary}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDialog(true);
            }}
            className="ml-2 w-8 h-8 bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 rounded-full flex items-center justify-center flex-shrink-0 transition-all shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* FAQ Section */}
        {showFaq && (
          <div className={`mt-4 p-4 rounded-xl ${theme === 'dark' ? 'bg-pink-900/20' : 'bg-pink-50'}`}>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-pink-500" />
              {t.bonus.boundariesFaqTitle}
            </h4>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              {t.bonus.boundariesFaqContent}
            </p>
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          className={`max-w-md mx-5 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom duration-300`}
        >
          <DialogHeader>
            <DialogTitle className="sr-only">{t.bonus.boundariesTitle}</DialogTitle>
          </DialogHeader>
          <BoundariesTracker />
        </DialogContent>
      </Dialog>
    </>
  );
}

