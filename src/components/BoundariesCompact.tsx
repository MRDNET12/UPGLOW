'use client';

import { useState } from 'react';
import { Shield, Plus, ChevronDown, ChevronUp, Check, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { boundaries, getBoundaryLabel, getBoundaryDescription } from '@/lib/boundaries-data';

interface BoundariesCompactProps {
  theme: 'light' | 'dark';
}

export default function BoundariesCompact({ }: BoundariesCompactProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const { language } = useStore();
  const { t } = useTranslation();

  const addBoundaryEntry = useStore((state) => state.addBoundaryEntry);
  const getBoundaryEntriesThisWeek = useStore((state) => state.getBoundaryEntriesThisWeek);
  const getBoundaryCountThisWeek = useStore((state) => state.getBoundaryCountThisWeek);

  // Obtenir les limites de cette semaine
  const boundariesThisWeek = getBoundaryEntriesThisWeek();
  const thisWeekCount = boundariesThisWeek.length;

  // Obtenir la dernière limite pratiquée
  const lastBoundary = boundariesThisWeek[boundariesThisWeek.length - 1];
  const lastBoundaryData = lastBoundary ? boundaries.find(b => b.key === lastBoundary.boundaryType) : null;

  const handleAddBoundary = (boundaryKey: string) => {
    addBoundaryEntry(boundaryKey);
    setShowAddModal(false);
  };

  return (
    <div className="w-full">
      {/* Carte compacte - Cliquable pour expand */}
      <div
        className={`rounded-[1.5rem] p-4 shadow-xl shadow-pink-100/50 w-full cursor-pointer transition-all hover:scale-[1.02] relative overflow-hidden border-none ${
          thisWeekCount > 0
            ? 'bg-gradient-to-br from-purple-50 via-pink-50 to-white'
            : 'bg-white/80 backdrop-blur-md'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Shield className="w-5 h-5 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold text-gray-800">
                  {language === 'fr' ? '8 Limites' : language === 'en' ? '8 Boundaries' : '8 Límites'}
                </h3>
                {thisWeekCount >= 3 && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span className="text-[10px] font-bold text-white drop-shadow-md">
                      {language === 'fr' ? 'Protégée' : language === 'en' ? 'Protected' : 'Protegida'}
                    </span>
                  </div>
                )}
              </div>
              {lastBoundaryData ? (
                <p className="text-xs text-gray-600 truncate font-medium">
                  {getBoundaryLabel(lastBoundaryData.key, language)}
                </p>
              ) : (
                <p className="text-xs text-gray-500 italic">
                  {language === 'fr' ? 'Pour ta paix intérieure' : language === 'en' ? 'For your inner peace' : 'Para tu paz interior'}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-600">{thisWeekCount}</span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-purple-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-purple-500" />
            )}
          </div>
        </div>
      </div>

      {/* Section expandée - Design magnifique */}
      {isExpanded && (
        <div className="mt-3 p-5 bg-white/80 backdrop-blur-md rounded-[1.5rem] shadow-xl shadow-purple-100/50 border border-purple-100/50 space-y-4 animate-in slide-in-from-top duration-300">
          {/* Bouton d'ajout */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAddModal(true);
            }}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 hover:from-purple-500 hover:via-pink-500 hover:to-rose-500 text-white rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-purple-200/50"
          >
            <Plus className="w-5 h-5" />
            {t.bonus.addBoundary}
          </button>

          {/* Grille des 8 limites */}
          <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-1">
            {boundaries.map((boundary) => {
              const count = getBoundaryCountThisWeek(boundary.key);
              const isInRange = count >= boundary.idealFrequency.min && count <= boundary.idealFrequency.max;

              return (
                <div
                  key={boundary.key}
                  className={`p-3 rounded-xl transition-all border-2 ${
                    count > 0
                      ? isInRange
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-md shadow-green-100/50'
                        : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300 shadow-md shadow-purple-100/50'
                      : 'bg-white/60 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0 drop-shadow-sm">{boundary.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-gray-800 mb-1">
                          {getBoundaryLabel(boundary.key, language)}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                          {getBoundaryDescription(boundary.key, language)}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium">
                          {t.bonus.idealFrequency}: {boundary.idealFrequency.min}-{boundary.idealFrequency.max} {t.bonus.timesPerWeek}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ${
                        count > 0
                          ? isInRange
                            ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
                            : 'bg-gradient-to-br from-purple-400 to-pink-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {count}
                      </div>
                      {isInRange && count > 0 && (
                        <Check className="w-4 h-4 text-green-600 drop-shadow-sm" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message de progression */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-500" />
              <p className="text-xs font-bold text-gray-700">
                {thisWeekCount >= 3
                  ? (language === 'fr' ? '🎉 Tu protèges bien ta paix intérieure !' : language === 'en' ? '🎉 You protect your inner peace well!' : '¡Proteges bien tu paz interior!')
                  : (language === 'fr' ? `Plus que ${3 - thisWeekCount} limite${3 - thisWeekCount > 1 ? 's' : ''} pour atteindre ton objectif !` : language === 'en' ? `${3 - thisWeekCount} more boundar${3 - thisWeekCount > 1 ? 'ies' : 'y'} to reach your goal!` : `¡${3 - thisWeekCount} límite${3 - thisWeekCount > 1 ? 's' : ''} más para alcanzar tu objetivo!`)
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout de limite */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 rounded-[2rem] p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl shadow-purple-300/50 border-2 border-purple-200/50 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400 flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white drop-shadow-lg" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                {t.bonus.selectBoundary}
              </h3>
            </div>
            <div className="space-y-2">
              {boundaries.map((boundary) => (
                <button
                  key={boundary.key}
                  onClick={() => handleAddBoundary(boundary.key)}
                  className="w-full p-4 bg-white/80 backdrop-blur-md hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 border border-purple-100 hover:border-purple-300 rounded-xl transition-all text-left shadow-md hover:shadow-lg hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl drop-shadow-sm">{boundary.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-800 mb-1">
                        {getBoundaryLabel(boundary.key, language)}
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {getBoundaryDescription(boundary.key, language)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              className="w-full mt-4 px-6 py-3 bg-white/80 backdrop-blur-md hover:bg-gray-100 text-gray-800 rounded-xl transition-all font-bold shadow-md border border-gray-200"
            >
              {language === 'fr' ? 'Annuler' : language === 'en' ? 'Cancel' : 'Cancelar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

