'use client';

import { Clock, Crown } from 'lucide-react';
import { useStore } from '@/lib/store';

interface TrialBadgeProps {
  theme?: 'light' | 'dark';
}

export function TrialBadge({ theme = 'light' }: TrialBadgeProps) {
  const { subscription, getRemainingFreeDays } = useStore();
  
  const remainingDays = getRemainingFreeDays();
  const isSubscribed = subscription.isSubscribed;

  if (isSubscribed) {
    return (
      <div className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold
        bg-gradient-to-r from-yellow-400 to-orange-400 text-white
        shadow-lg
      `}>
        <Crown className="w-3.5 h-3.5" />
        <span>Premium</span>
      </div>
    );
  }

  if (remainingDays === 0) {
    return (
      <div className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold
        ${theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'}
      `}>
        <Clock className="w-3.5 h-3.5" />
        <span>Essai terminé</span>
      </div>
    );
  }

  return (
    <div className={`
      flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold
      ${theme === 'dark' ? 'bg-rose-900/30 text-rose-400' : 'bg-rose-100 text-rose-600'}
    `}>
      <Clock className="w-3.5 h-3.5" />
      <span>{remainingDays} jour{remainingDays > 1 ? 's' : ''} gratuit{remainingDays > 1 ? 's' : ''}</span>
    </div>
  );
}

