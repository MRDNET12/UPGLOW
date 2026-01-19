'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { Shield, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CompactBoundariesProps {
  theme?: 'light' | 'dark';
}

export function CompactBoundaries({ theme = 'light' }: CompactBoundariesProps) {
  const { t, language } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const getBoundaryEntriesThisWeek = useStore((state) => state.getBoundaryEntriesThisWeek);
  const entriesThisWeek = getBoundaryEntriesThisWeek();
  const progress = (entriesThisWeek.length / 8) * 100;

  const latestEntry = entriesThisWeek.length > 0 ? entriesThisWeek[entriesThisWeek.length - 1] : null;

  // Helper to get boundary label
  const getBoundaryLabel = (key: string) => {
    const labels: Record<string, Record<string, string>> = {
      'no-messages-late': {
        fr: 'Pas de messages tard le soir',
        en: 'No late-night messages',
        es: 'Sin mensajes tarde por la noche'
      },
      'no-work-weekend': {
        fr: 'Pas de travail le week-end',
        en: 'No work on weekends',
        es: 'Sin trabajo los fines de semana'
      },
      'say-no': {
        fr: 'Dire non quand nécessaire',
        en: 'Say no when necessary',
        es: 'Decir no cuando sea necesario'
      },
      'me-time': {
        fr: 'Temps pour moi',
        en: 'Me time',
        es: 'Tiempo para mí'
      },
      'social-media-limit': {
        fr: 'Limiter les réseaux sociaux',
        en: 'Limit social media',
        es: 'Limitar redes sociales'
      },
      'respect-sleep': {
        fr: 'Respecter mon sommeil',
        en: 'Respect my sleep',
        es: 'Respetar mi sueño'
      },
      'healthy-relationships': {
        fr: 'Relations saines uniquement',
        en: 'Healthy relationships only',
        es: 'Solo relaciones saludables'
      },
      'protect-energy': {
        fr: 'Protéger mon énergie',
        en: 'Protect my energy',
        es: 'Proteger mi energía'
      }
    };
    return labels[key]?.[language] || key;
  };

  return (
    <div className={`rounded-2xl p-4 shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Header - Always visible */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {t.bonus.boundariesTitle}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {t.bonus.boundariesThisWeek}: {entriesThisWeek.length}
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

      {/* Latest Boundary - Always visible */}
      {latestEntry && !isExpanded && (
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
            {getBoundaryLabel(latestEntry.boundaryType)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {new Date(latestEntry.date).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-3 mt-3">
          {/* FAQ Info */}
          <div className="p-3 bg-purple-50/50 dark:bg-purple-900/10 rounded-xl">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-gray-900 dark:text-white font-medium mb-1">
                  {language === 'fr' ? 'Apprends à poser des limites saines pour préserver ta paix intérieure.' : 
                   language === 'en' ? 'Learn to set healthy boundaries to preserve your inner peace.' :
                   'Aprende a establecer límites saludables para preservar tu paz interior.'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {language === 'fr' ? 'Pourquoi ça marche ? Poser des limites n\'est pas égoïste, c\'est essentiel pour ton bien-être mental et émotionnel.' :
                   language === 'en' ? 'Why does it work? Setting boundaries is not selfish, it\'s essential for your mental and emotional well-being.' :
                   '¿Por qué funciona? Establecer límites no es egoísta, es esencial para tu bienestar mental y emocional.'}
                </p>
              </div>
            </div>
          </div>

          {/* All Boundaries This Week */}
          {entriesThisWeek.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                {language === 'fr' ? 'Cette semaine' : language === 'en' ? 'This week' : 'Esta semana'}
              </p>
              {entriesThisWeek.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg"
                >
                  <p className="text-sm text-gray-900 dark:text-white">
                    {getBoundaryLabel(entry.boundaryType)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(entry.date).toLocaleDateString()}
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

