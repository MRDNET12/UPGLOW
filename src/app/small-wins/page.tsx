'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { 
  Trophy, 
  ArrowLeft, 
  Calendar, 
  Sparkles,
  Target,
  Award,
  Crown
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Types pour les designs
type DesignTheme = 'modern' | 'celebration' | 'minimal';

interface DesignConfig {
  name: string;
  icon: React.ReactNode;
  cardClass: string;
  headerClass: string;
  itemClass: string;
  badgeClass: string;
  accentColor: string;
}

const DESIGN_THEMES: Record<DesignTheme, DesignConfig> = {
  modern: {
    name: 'Moderne',
    icon: <Sparkles className="w-5 h-5" />,
    cardClass: 'bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50',
    headerClass: 'bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400',
    itemClass: 'bg-white/80 backdrop-blur-sm border border-pink-100 hover:border-pink-300 hover:shadow-lg',
    badgeClass: 'bg-gradient-to-r from-pink-400 to-rose-500 text-white',
    accentColor: 'pink'
  },
  celebration: {
    name: 'Célébration',
    icon: <Award className="w-5 h-5" />,
    cardClass: 'bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900',
    headerClass: 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500',
    itemClass: 'bg-white/10 backdrop-blur-md border border-white/20 hover:border-yellow-400/50 hover:bg-white/20',
    badgeClass: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 font-bold',
    accentColor: 'yellow'
  },
  minimal: {
    name: 'Minimaliste',
    icon: <Target className="w-5 h-5" />,
    cardClass: 'bg-gray-50',
    headerClass: 'bg-gray-900',
    itemClass: 'bg-white border border-gray-200 hover:border-gray-400 hover:shadow-sm',
    badgeClass: 'bg-gray-900 text-white',
    accentColor: 'gray'
  }
};

export default function SmallWinsPage() {
  const router = useRouter();
  const { language } = useTranslation();
  const [currentDesign, setCurrentDesign] = useState<DesignTheme>('modern');
  const [showDesignPicker, setShowDesignPicker] = useState(false);

  const getSmallWinsHistory = useStore((state) => state.getSmallWinsHistory);
  const smallWins = getSmallWinsHistory();

  // Fonction pour obtenir l'année d'une date
  const getYearFromDate = (dateStr: string) => {
    return new Date(dateStr).getFullYear();
  };

  // Grouper les succès par semaine et année
  const groupedWins = smallWins.reduce((acc, win) => {
    const year = getYearFromDate(win.date);
    const weekKey = `${win.weekNumber}-${year}`;
    if (!acc[weekKey]) {
      acc[weekKey] = {
        weekNumber: win.weekNumber,
        year: year,
        wins: []
      };
    }
    acc[weekKey].wins.push(win);
    return acc;
  }, {} as Record<string, { weekNumber: number; year: number; wins: typeof smallWins }>);

  // Trier par semaine (plus récente d'abord)
  const sortedGroups = Object.values(groupedWins).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.weekNumber - a.weekNumber;
  });

  const getRankForCount = (count: number) => {
    if (count >= 15) return { icon: Crown, label: language === 'fr' ? 'Légende' : 'Legend', color: 'text-yellow-400' };
    if (count >= 10) return { icon: Award, label: 'Champion', color: 'text-orange-400' };
    if (count >= 5) return { icon: Trophy, label: 'Gagnant', color: 'text-pink-400' };
    return { icon: Sparkles, label: 'Débutant', color: 'text-blue-400' };
  };

  const totalWins = smallWins.length;
  const rank = getRankForCount(totalWins);
  const design = DESIGN_THEMES[currentDesign];

  return (
    <div className={`min-h-screen ${design.cardClass} transition-colors duration-500`}>
      {/* Header */}
      <div className={`${design.headerClass} text-white sticky top-0 z-10 shadow-lg`}>
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">
              {language === 'fr' ? 'Carnet de fierté' : language === 'en' ? 'Pride Journal' : 'Diario de orgullo'}
            </h1>
            <button
              onClick={() => setShowDesignPicker(true)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title={language === 'fr' ? 'Changer le design' : 'Change design'}
            >
              <Sparkles className="w-6 h-6" />
            </button>
          </div>
          
          {/* Stats */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{totalWins}</div>
              <div className="text-sm opacity-90">
                {language === 'fr' ? 'succès' : language === 'en' ? 'wins' : 'éxitos'}
              </div>
            </div>
            <div className="h-12 w-px bg-white/30" />
            <div className="flex items-center gap-2">
              <rank.icon className={`w-8 h-8 ${rank.color}`} />
              <span className="text-sm font-medium">{rank.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {smallWins.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              {language === 'fr' 
                ? 'Aucun succès enregistré' 
                : language === 'en' 
                  ? 'No wins recorded yet'
                  : 'Aún no hay éxitos registrados'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {language === 'fr' 
                ? 'Commence à célébrer tes victoires !'
                : language === 'en'
                  ? 'Start celebrating your victories!'
                  : '¡Comienza a celebrar tus victorias!'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedGroups.map((group) => (
              <div key={`${group.year}-${group.weekNumber}`} className="space-y-3">
                {/* Week Header */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                    {language === 'fr' ? 'Semaine' : language === 'en' ? 'Week' : 'Semana'} {group.weekNumber} - {group.year}
                  </h2>
                  <span className={`ml-auto text-xs px-2 py-1 rounded-full ${design.badgeClass}`}>
                    {group.wins.length}
                  </span>
                </div>

                {/* Wins List */}
                <div className="space-y-2">
                  {group.wins
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((win) => (
                    <div
                      key={win.id}
                      className={`${design.itemClass} rounded-2xl p-4 transition-all duration-300`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${design.badgeClass}`}>
                          <Trophy className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium ${currentDesign === 'celebration' ? 'text-white' : 'text-gray-800'}`}>
                            {win.text}
                          </p>
                          <p className={`text-sm mt-1 ${currentDesign === 'celebration' ? 'text-white/70' : 'text-gray-500'}`}>
                            {new Date(win.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Design Picker Dialog */}
      <Dialog open={showDesignPicker} onOpenChange={setShowDesignPicker}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === 'fr' ? 'Choisir un design' : language === 'en' ? 'Choose a design' : 'Elegir un diseño'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 mt-4">
            {(Object.keys(DESIGN_THEMES) as DesignTheme[]).map((theme) => (
              <button
                key={theme}
                onClick={() => {
                  setCurrentDesign(theme);
                  setShowDesignPicker(false);
                }}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                  currentDesign === theme 
                    ? 'border-pink-500 bg-pink-50' 
                    : 'border-gray-200 hover:border-pink-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl ${DESIGN_THEMES[theme].headerClass} flex items-center justify-center text-white`}>
                  {DESIGN_THEMES[theme].icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-gray-800">{DESIGN_THEMES[theme].name}</h3>
                  <p className="text-sm text-gray-500">
                    {theme === 'modern' && (language === 'fr' ? 'Style doux et coloré' : 'Soft and colorful style')}
                    {theme === 'celebration' && (language === 'fr' ? 'Ambiance festive et premium' : 'Festive and premium vibe')}
                    {theme === 'minimal' && (language === 'fr' ? 'Épuré et élégant' : 'Clean and elegant')}
                  </p>
                </div>
                {currentDesign === theme && (
                  <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
