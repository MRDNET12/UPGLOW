import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { Trophy, Plus, ChevronDown, ChevronUp, History, Award, Crown, Sparkles } from 'lucide-react';

interface SmallWinsQuickAddProps {
  theme?: 'light' | 'dark';
}

export function SmallWinsQuickAdd({ }: SmallWinsQuickAddProps) {
  const { t, language } = useTranslation();
  const [newWin, setNewWin] = useState('');
  const [showFaq, setShowFaq] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const addSmallWin = useStore((state) => state.addSmallWin);
  const getSmallWinsThisWeek = useStore((state) => state.getSmallWinsThisWeek);
  const getSmallWinsHistory = useStore((state) => state.getSmallWinsHistory);

  const winsThisWeek = getSmallWinsThisWeek();
  const history = getSmallWinsHistory();

  const handleAddWin = () => {
    if (newWin.trim()) {
      addSmallWin(newWin.trim());
      setNewWin('');
    }
  };

  // Déterminer le palier actuel (sans afficher "Débutant")
  const getRank = () => {
    const count = winsThisWeek.length;
    if (count >= 5) {
      return {
        name: language === 'fr' ? 'Légende' : language === 'en' ? 'Legend' : 'Leyenda',
        icon: Crown,
        color: 'text-purple-600',
        bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
        progress: 100,
        message: language === 'fr' ? '🎉 Statut Légende atteint !' : language === 'en' ? '🎉 Legend status achieved!' : '🎉 ¡Estado Leyenda alcanzado!',
        showBadge: true
      };
    } else if (count >= 3) {
      return {
        name: 'Alpha',
        icon: Award,
        color: 'text-yellow-600',
        bgColor: 'bg-gradient-to-r from-yellow-400 to-orange-500',
        progress: (count / 5) * 100,
        message: language === 'fr' ? `Plus que ${5 - count} pour Légende !` : language === 'en' ? `${5 - count} more for Legend!` : `¡${5 - count} más para Leyenda!`,
        showBadge: true
      };
    } else {
      return {
        name: '',
        icon: Sparkles,
        color: 'text-gray-600',
        bgColor: 'bg-gradient-to-r from-gray-400 to-gray-500',
        progress: (count / 5) * 100,
        message: language === 'fr' ? `Plus que ${3 - count} pour Alpha !` : language === 'en' ? `${3 - count} more for Alpha!` : `¡${3 - count} más para Alpha!`,
        showBadge: false
      };
    }
  };

  const rank = getRank();

  return (
    <div className="w-full px-5">
      {/* Header avec badge de rang - Glassmorphism */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg drop-shadow-lg">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">
            {t.bonus.smallWinsTitle}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            {rank.showBadge && (
              <>
                <rank.icon className="w-3 h-3 text-orange-500" />
                <span className="text-xs font-bold text-orange-500">
                  {rank.name}
                </span>
                <span className="text-xs text-gray-400">•</span>
              </>
            )}
            <span className="text-xs text-gray-600 font-medium">
              {winsThisWeek.length} {language === 'fr' ? 'cette semaine' : language === 'en' ? 'this week' : 'esta semana'}
            </span>
          </div>
        </div>
      </div>

      {/* Barre de progression - Glassmorphism */}
      <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-white to-orange-50 shadow-md border border-orange-100/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-800">
            {rank.message}
          </span>
        </div>
        <div className="h-2 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500 shadow-sm"
            style={{ width: `${rank.progress}%` }}
          />
        </div>
      </div>

      {/* FAQ Pourquoi ? - Glassmorphism */}
      <div className="mb-4">
        <button
          onClick={() => setShowFaq(!showFaq)}
          className="w-full flex items-center justify-between p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl hover:from-orange-200 hover:to-orange-300 transition-all shadow-md"
        >
          <span className="font-bold text-gray-800 text-sm">
            {t.bonus.why || 'Pourquoi ?'}
          </span>
          {showFaq ? (
            <ChevronUp className="w-4 h-4 text-orange-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-orange-500" />
          )}
        </button>

        {showFaq && (
          <div className="mt-3 p-4 bg-gradient-to-br from-white to-orange-50 rounded-xl space-y-3 text-sm shadow-lg border border-orange-100/50">
            <div>
              <p className="font-bold text-gray-800 mb-2">{t.bonus.smallWinsDescription || 'Célèbre tes victoires quotidiennes !'}</p>
              <ol className="list-decimal list-inside space-y-1.5 text-gray-700 font-medium">
                <li>{t.bonus.smallWinsStep1 || 'Note trois petits accomplissements réalisés cette semaine (même les plus minimes).'}</li>
                <li>{t.bonus.smallWinsStep2 || 'Décris pourquoi ces accomplissements sont importants pour toi.'}</li>
                <li>{t.bonus.smallWinsStep3 || 'Relis cette liste chaque matin pour te rappeler que tu es capable.'}</li>
              </ol>
            </div>
            <div className="pt-3 border-t border-orange-200">
              <p className="font-bold text-gray-800 mb-1.5">{t.bonus.whyItWorks || 'Pourquoi ça marche ?'}</p>
              <p className="text-gray-700 font-medium">
                {t.bonus.smallWinsExplanation || "L'auto-valorisation aide à renforcer la confiance et réduire le sentiment d'échec."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input moderne - Glassmorphism */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newWin}
            onChange={(e) => setNewWin(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddWin();
              }
            }}
            placeholder={t.bonus.smallWinPlaceholder}
            className="flex-1 px-4 py-3 text-sm bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-gray-800 placeholder:text-gray-400 shadow-md font-medium"
          />
          <button
            onClick={handleAddWin}
            disabled={!newWin.trim()}
            className="px-4 py-3 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 disabled:bg-gray-300 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-xl transition-all disabled:cursor-not-allowed flex items-center gap-2 text-sm font-bold shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Succès de la semaine - Glassmorphism */}
      {winsThisWeek.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-wide">
            {language === 'fr' ? 'Cette semaine' : language === 'en' ? 'This week' : 'Esta semana'}
          </p>
          <div className="space-y-2">
            {winsThisWeek.slice().reverse().map((win, index) => (
              <div
                key={win.id}
                className={`p-3 rounded-xl transition-all shadow-md ${
                  index === 0
                    ? 'bg-gradient-to-r from-orange-100 to-orange-200 border border-orange-300/50'
                    : 'bg-gradient-to-br from-white to-orange-50 border border-orange-100/50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <Trophy className={`w-4 h-4 mt-0.5 flex-shrink-0 drop-shadow-md ${index === 0 ? 'text-orange-500' : 'text-gray-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">{win.text}</p>
                    <p className="text-xs text-gray-600 mt-1 font-medium">
                      {new Date(win.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historique - Glassmorphism */}
      {history.length > 0 && (
        <div className="border-t-2 border-orange-200 pt-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between p-3 bg-gradient-to-br from-white to-orange-50 rounded-xl hover:from-orange-50 hover:to-orange-100 transition-all shadow-md border border-orange-100/50"
          >
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-gray-800 text-sm">
                {language === 'fr' ? 'Historique' : language === 'en' ? 'History' : 'Historial'} ({history.length})
              </span>
            </div>
            {showHistory ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {showHistory && (
            <div className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1">
              {history.map((win) => (
                <div
                  key={win.id}
                  className="p-3 bg-gradient-to-br from-white to-orange-50 border border-orange-200 rounded-xl hover:border-orange-300 transition-all shadow-md"
                >
                  <p className="text-sm font-bold text-gray-800">{win.text}</p>
                  <p className="text-xs text-gray-600 mt-1 font-medium">
                    {new Date(win.date).toLocaleDateString()}
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

