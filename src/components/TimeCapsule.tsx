'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Calendar, Clock, ChevronUp, ChevronDown, Plus, Check, X, Sparkles, Heart, Brain, Dumbbell, Eye, Archive, Send, Trophy } from 'lucide-react';
import { useTranslation } from '@/lib/useTranslation';
import { useStore } from '@/lib/store';

// Types
interface TimeCapsuleMessage {
  id: string;
  text: string;
  category: 'corps' | 'mental' | 'discipline' | 'image' | null;
  emoji: string;
  bgColor: string;
  createdAt: string;
  deliveryDate: string | null;
  status: 'pending' | 'delivered';
  triggerType: 'days' | 'wins';
  triggerValue: number;
  winsAtCreation: number;
}

interface TimeCapsuleProps {
  theme?: 'light' | 'dark';
  isExpanded?: boolean;
  onToggle?: () => void;
  standalone?: boolean;
}

// Couleurs de fond disponibles
const BG_COLORS = [
  { name: 'Rose', value: 'from-pink-100 to-rose-100' },
  { name: 'Bleu', value: 'from-blue-100 to-indigo-100' },
  { name: 'Vert', value: 'from-green-100 to-emerald-100' },
  { name: 'Violet', value: 'from-purple-100 to-violet-100' },
  { name: 'Orange', value: 'from-orange-100 to-yellow-100' },
  { name: 'Blanc', value: 'from-white to-gray-50' }
];

// Emojis disponibles
const EMOJIS = ['💌', '✨', '🌟', '💪', '🎯', '🌈', '🦋', '🔥', '💎', '🌸'];

// Catégories
const CATEGORIES = [
  { id: 'corps', label: { fr: 'Corps', en: 'Body', es: 'Cuerpo' }, icon: Dumbbell, color: 'from-green-400 to-emerald-500' },
  { id: 'mental', label: { fr: 'Mental', en: 'Mental', es: 'Mental' }, icon: Brain, color: 'from-purple-400 to-violet-500' },
  { id: 'discipline', label: { fr: 'Discipline', en: 'Discipline', es: 'Disciplina' }, icon: Clock, color: 'from-blue-400 to-indigo-500' },
  { id: 'image', label: { fr: 'Image', en: 'Image', es: 'Imagen' }, icon: Eye, color: 'from-pink-400 to-rose-500' },
  { id: 'accomplissement', label: { fr: 'Accomplissement', en: 'Achievement', es: 'Logro' }, icon: Check, color: 'from-yellow-400 to-amber-500' }
];

// Délais prédéfinis
const PRESET_DELAYS = [
  { days: 7, label: { fr: '7 jours', en: '7 days', es: '7 días' } },
  { days: 30, label: { fr: '30 jours', en: '30 days', es: '30 días' } },
  { days: 90, label: { fr: '90 jours', en: '90 days', es: '90 días' } }
];

// Seuils de victoires prédéfinis
const PRESET_WIN_THRESHOLDS = [
  { wins: 10, label: { fr: '10 victoires', en: '10 wins', es: '10 victorias' } },
  { wins: 30, label: { fr: '30 victoires', en: '30 wins', es: '30 victorias' } },
  { wins: 40, label: { fr: '40 victoires', en: '40 wins', es: '40 victorias' } }
];

// Helper pour obtenir la date locale
const getLocalDateString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// Helper pour ajouter des jours à une date
const addDays = (dateStr: string, days: number): string => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export function TimeCapsule({ theme = 'light', isExpanded, onToggle, standalone = false }: TimeCapsuleProps) {
  const { language } = useTranslation();
  const getSmallWinsHistory = useStore((state) => state.getSmallWinsHistory);
  const totalWins = getSmallWinsHistory().length;

  // États
  const [capsules, setCapsules] = useState<TimeCapsuleMessage[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState('💌');
  const [selectedBgColor, setSelectedBgColor] = useState(BG_COLORS[0].value);
  const [triggerType, setTriggerType] = useState<'days' | 'wins'>('days');
  const [selectedDelay, setSelectedDelay] = useState(7);
  const [selectedWinThreshold, setSelectedWinThreshold] = useState(10);
  const [customDate, setCustomDate] = useState('');
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'pending' | 'delivered'>('create');
  const [deliveredCapsule, setDeliveredCapsule] = useState<TimeCapsuleMessage | null>(null);

  // Charger les capsules depuis localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('timeCapsules');
      if (saved) {
        const parsed = JSON.parse(saved) as TimeCapsuleMessage[];
        // Vérifier si des capsules doivent être livrées
        const today = getLocalDateString();
        const updated = parsed.map(c => {
          if (c.status === 'pending') {
            // Vérifier si c'est un déclenchement par jours
            if (c.triggerType === 'days' && c.deliveryDate && c.deliveryDate <= today) {
              return { ...c, status: 'delivered' as const };
            }
            // Vérifier si c'est un déclenchement par victoires
            if (c.triggerType === 'wins') {
              const targetWins = c.winsAtCreation + c.triggerValue;
              if (totalWins >= targetWins) {
                return { ...c, status: 'delivered' as const, deliveryDate: today };
              }
            }
          }
          return c;
        });
        setCapsules(updated);
        // Sauvegarder si des changements
        if (JSON.stringify(updated) !== JSON.stringify(parsed)) {
          localStorage.setItem('timeCapsules', JSON.stringify(updated));
        }
        // Afficher popup si capsule livrée aujourd'hui
        const justDelivered = updated.find(c => c.deliveryDate === today && c.status === 'delivered');
        if (justDelivered && !localStorage.getItem(`capsule_shown_${justDelivered.id}`)) {
          setDeliveredCapsule(justDelivered);
          localStorage.setItem(`capsule_shown_${justDelivered.id}`, 'true');
        }
      }
    }
  }, [totalWins]);

  // Sauvegarder les capsules
  useEffect(() => {
    if (typeof window !== 'undefined' && capsules.length > 0) {
      localStorage.setItem('timeCapsules', JSON.stringify(capsules));
    }
  }, [capsules]);

  // Suggestions de messages
  const suggestions = [
    { fr: 'Écris une micro-victoire que tu veux célébrer dans 7 jours', en: 'Write a micro-victory you want to celebrate in 7 days', es: 'Escribe una micro-victoria que quieras celebrar en 7 días' },
    { fr: 'Une phrase d\'encouragement pour toi dans le futur', en: 'A word of encouragement for your future self', es: 'Una frase de aliento para ti en el futuro' }
  ];

  // Créer une nouvelle capsule
  const handleCreateCapsule = () => {
    if (!newMessage.trim()) return;

    const today = getLocalDateString();
    const deliveryDate = triggerType === 'days' 
      ? (useCustomDate && customDate ? customDate : addDays(today, selectedDelay))
      : null;

    const newCapsule: TimeCapsuleMessage = {
      id: `capsule_${Date.now()}`,
      text: newMessage.trim(),
      category: selectedCategory as TimeCapsuleMessage['category'],
      emoji: selectedEmoji,
      bgColor: selectedBgColor,
      createdAt: today,
      deliveryDate,
      status: 'pending',
      triggerType,
      triggerValue: triggerType === 'days' ? selectedDelay : selectedWinThreshold,
      winsAtCreation: totalWins
    };

    setCapsules([...capsules, newCapsule]);
    // Reset form
    setNewMessage('');
    setSelectedCategory(null);
    setSelectedEmoji('💌');
    setSelectedBgColor(BG_COLORS[0].value);
    setTriggerType('days');
    setSelectedDelay(7);
    setSelectedWinThreshold(10);
    setCustomDate('');
    setUseCustomDate(false);
    setShowCreateForm(false);
    setActiveTab('pending');
  };

  const pendingCapsules = capsules.filter(c => c.status === 'pending');
  const deliveredCapsules = capsules.filter(c => c.status === 'delivered');

  return (
    <>
      {/* Popup de capsule livrée */}
      {deliveredCapsule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-sm bg-gradient-to-br ${deliveredCapsule.bgColor} rounded-3xl p-6 shadow-2xl`}>
            <div className="text-center mb-4">
              <span className="text-5xl">{deliveredCapsule.emoji}</span>
              <h3 className="text-lg font-bold text-gray-900 mt-2">
                {language === 'fr' ? '💌 Message du passé' : language === 'en' ? '💌 Message from the past' : '💌 Mensaje del pasado'}
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                {language === 'fr' ? `Écrit le ${new Date(deliveredCapsule.createdAt).toLocaleDateString('fr-FR')}` :
                  language === 'en' ? `Written on ${new Date(deliveredCapsule.createdAt).toLocaleDateString('en-US')}` :
                    `Escrito el ${new Date(deliveredCapsule.createdAt).toLocaleDateString('es-ES')}`}
              </p>
              {deliveredCapsule.triggerType === 'wins' && (
                <p className="text-xs text-purple-600 font-medium mt-1 flex items-center justify-center gap-1">
                  <Trophy className="w-3 h-3" />
                  {language === 'fr' ? `Débloqué après ${deliveredCapsule.triggerValue} victoires` :
                    language === 'en' ? `Unlocked after ${deliveredCapsule.triggerValue} wins` :
                      `Desbloqueado después de ${deliveredCapsule.triggerValue} victorias`}
                </p>
              )}
            </div>
            <div className="bg-white/80 rounded-2xl p-4 mb-4">
              <p className="text-sm text-gray-800 leading-relaxed">{deliveredCapsule.text}</p>
            </div>
            <button
              onClick={() => setDeliveredCapsule(null)}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold text-sm hover:scale-105 transition-all"
            >
              {language === 'fr' ? 'Merci moi du passé ✨' : language === 'en' ? 'Thank you past me ✨' : 'Gracias yo del pasado ✨'}
            </button>
          </div>
        </div>
      )}

      {/* Carte compacte / Trigger (seulement si non standalone) */}
      {!standalone && (
        <div className="w-full flex flex-col items-center">
          <div
            className="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 rounded-full px-11 py-2.5 shadow-lg cursor-pointer hover:scale-105 transition-all flex items-center gap-2 min-h-[42px]"
            onClick={onToggle}
          >
            <Mail className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold text-gray-800">
              {language === 'fr' ? 'Message à moi' : language === 'en' ? 'Message to me' : 'Mensaje a mí'}
            </span>
            {pendingCapsules.length > 0 && (
              <span className="bg-purple-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {pendingCapsules.length}
              </span>
            )}
            <ChevronUp className={`w-4 h-4 text-purple-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      )}

      {/* Section expandée - Slide similaire à Petits Succès */}
      {(isExpanded || standalone) && (
        <div className={`${standalone ? 'w-full space-y-4' : 'mt-3 p-5 bg-white/95 backdrop-blur-md rounded-[1.5rem] shadow-xl shadow-purple-100/50 border border-purple-100/50 space-y-4 transition-all duration-300 ease-out w-full max-w-md'}`}>
          {/* Header avec onglets */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-600" />
                {language === 'fr' ? 'Message à moi' : language === 'en' ? 'Message to me' : 'Mensaje a mí'}
              </h3>
              {!standalone && (
                <button onClick={onToggle} className="p-1 hover:bg-white/50 rounded-full transition-all">
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
            <div className="flex gap-1">
              {[
                { id: 'create', label: { fr: 'Écrire', en: 'Write', es: 'Escribir' }, icon: Plus },
                { id: 'pending', label: { fr: 'À venir', en: 'Pending', es: 'Pendiente' }, icon: Clock },
                { id: 'delivered', label: { fr: 'Reçus', en: 'Received', es: 'Recibidos' }, icon: Archive }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === tab.id
                    ? 'bg-white text-purple-700 shadow-md'
                    : 'text-gray-600 hover:bg-white/50'
                    }`}
                >
                  <tab.icon className="w-3 h-3" />
                  {tab.label[language as keyof typeof tab.label]}
                  {tab.id === 'pending' && pendingCapsules.length > 0 && (
                    <span className="bg-purple-500 text-white text-[9px] px-1 rounded-full">{pendingCapsules.length}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Contenu des onglets */}
          {/* Onglet Créer */}
          {activeTab === 'create' && (
            <div className="space-y-4">
              {/* Suggestion */}
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <p className="text-xs text-gray-700 font-medium mb-2">
                  {language === 'fr' ? '"Cher Moi du futur, j\'espère que tu es devenu..."' :
                    language === 'en' ? '"Dear Future Me, I hope you have become..."' :
                      '"Querido Yo Futuro, espero que te hayas convertido en..."'}
                </p>
                <p className="text-[10px] text-gray-500">
                  {language === 'fr' 
                    ? "Verrouille cette lettre. Ouvre-la quand tu auras atteint tes objectifs."
                    : language === 'en' 
                      ? "Lock this letter. Open it when you have achieved your goals."
                      : "Bloque esta carta. Ábrela cuando hayas alcanzado tus objetivos."}
                </p>
              </div>

              {/* Champ de texte */}
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={language === 'fr' ? 'Écris ton message pour le futur...' :
                  language === 'en' ? 'Write your message for the future...' :
                    'Escribe tu mensaje para el futuro...'}
                className="w-full h-24 p-3 text-sm bg-white border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              />

              {/* Catégories */}
              <div>
                <p className="text-xs font-bold text-gray-700 mb-2">
                  {language === 'fr' ? 'Catégorie (optionnel)' : language === 'en' ? 'Category (optional)' : 'Categoría (opcional)'}
                </p>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    {CATEGORIES.slice(0, 4).map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                        className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === cat.id
                          ? `bg-gradient-to-r ${cat.color} text-white`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                      >
                        <cat.icon className="w-3 h-3" />
                        {cat.label[language as keyof typeof cat.label]}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {CATEGORIES.slice(4).map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                        className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === cat.id
                          ? `bg-gradient-to-r ${cat.color} text-white`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                      >
                        <cat.icon className="w-3 h-3" />
                        {cat.label[language as keyof typeof cat.label]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Personnalisation */}
              <div className="grid grid-cols-2 gap-3">
                {/* Emoji */}
                <div>
                  <p className="text-xs font-bold text-gray-700 mb-2">Emoji</p>
                  <div className="flex flex-wrap gap-1">
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`w-7 h-7 rounded-lg text-sm transition-all ${selectedEmoji === emoji ? 'bg-purple-200 scale-110' : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Couleur */}
                <div>
                  <p className="text-xs font-bold text-gray-700 mb-2">
                    {language === 'fr' ? 'Couleur' : language === 'en' ? 'Color' : 'Color'}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {BG_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setSelectedBgColor(color.value)}
                        className={`w-7 h-7 rounded-lg bg-gradient-to-br ${color.value} border-2 transition-all ${selectedBgColor === color.value ? 'border-purple-500 scale-110' : 'border-transparent'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Type de déclenchement */}
              <div>
                <p className="text-xs font-bold text-gray-700 mb-2">
                  {language === 'fr' ? 'Recevoir quand' : language === 'en' ? 'Receive when' : 'Recibir cuando'}
                </p>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setTriggerType('days')}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${triggerType === 'days'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    <Calendar className="w-3 h-3" />
                    {language === 'fr' ? 'Par jours' : language === 'en' ? 'By days' : 'Por días'}
                  </button>
                  <button
                    onClick={() => setTriggerType('wins')}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${triggerType === 'wins'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    <Trophy className="w-3 h-3" />
                    {language === 'fr' ? 'Par victoires' : language === 'en' ? 'By wins' : 'Por victorias'}
                  </button>
                </div>

                {/* Options selon le type */}
                {triggerType === 'days' ? (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">
                      {language === 'fr' ? 'Dans' : language === 'en' ? 'In' : 'En'}
                    </p>
                    <div className="flex gap-2 mb-2">
                      {PRESET_DELAYS.map((delay) => (
                        <button
                          key={delay.days}
                          onClick={() => { setSelectedDelay(delay.days); setUseCustomDate(false); }}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${!useCustomDate && selectedDelay === delay.days
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                          {delay.label[language as keyof typeof delay.label]}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={useCustomDate}
                        onChange={(e) => setUseCustomDate(e.target.checked)}
                        className="w-4 h-4 rounded text-purple-500"
                      />
                      <span className="text-xs text-gray-600">
                        {language === 'fr' ? 'Date personnalisée' : language === 'en' ? 'Custom date' : 'Fecha personalizada'}
                      </span>
                    </div>
                    {useCustomDate && (
                      <div className="mt-2 space-y-2">
                        {/* Boutons 6 mois et 1 an */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setSelectedDelay(180); setCustomDate(addDays(getLocalDateString(), 180)); }}
                            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${customDate === addDays(getLocalDateString(), 180)
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                          >
                            {language === 'fr' ? '6 mois' : language === 'en' ? '6 months' : '6 meses'}
                          </button>
                          <button
                            onClick={() => { setSelectedDelay(365); setCustomDate(addDays(getLocalDateString(), 365)); }}
                            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${customDate === addDays(getLocalDateString(), 365)
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                          >
                            {language === 'fr' ? '1 an' : language === 'en' ? '1 year' : '1 año'}
                          </button>
                        </div>
                        {/* Calendrier */}
                        <input
                          type="date"
                          value={customDate}
                          onChange={(e) => setCustomDate(e.target.value)}
                          min={addDays(getLocalDateString(), 1)}
                          className="w-full px-2 py-1 text-xs border border-purple-200 rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">
                      {language === 'fr' ? 'Après' : language === 'en' ? 'After' : 'Después de'}
                    </p>
                    <div className="flex gap-2">
                      {PRESET_WIN_THRESHOLDS.map((threshold) => (
                        <button
                          key={threshold.wins}
                          onClick={() => setSelectedWinThreshold(threshold.wins)}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${selectedWinThreshold === threshold.wins
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                          {threshold.label[language as keyof typeof threshold.label]}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      {language === 'fr' 
                        ? `Victoires actuelles: ${totalWins} → Message à ${totalWins + selectedWinThreshold} victoires`
                        : language === 'en'
                          ? `Current wins: ${totalWins} → Message at ${totalWins + selectedWinThreshold} wins`
                          : `Victorias actuales: ${totalWins} → Mensaje a ${totalWins + selectedWinThreshold} victorias`}
                    </p>
                  </div>
                )}
              </div>

              {/* Bouton créer */}
              <button
                onClick={handleCreateCapsule}
                disabled={!newMessage.trim()}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-sm hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {language === 'fr' ? 'Envoyer au futur' : language === 'en' ? 'Send to the future' : 'Enviar al futuro'}
              </button>
            </div>
          )}

          {/* Onglet À venir */}
          {activeTab === 'pending' && (
            <div className="space-y-3">
              {pendingCapsules.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    {language === 'fr' ? 'Aucune capsule en attente' : language === 'en' ? 'No pending capsules' : 'Sin cápsulas pendientes'}
                  </p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="mt-3 text-xs text-purple-600 font-medium hover:underline"
                  >
                    {language === 'fr' ? 'Créer ma première capsule' : language === 'en' ? 'Create my first capsule' : 'Crear mi primera cápsula'}
                  </button>
                </div>
              ) : (
                pendingCapsules.map((capsule) => (
                  <div
                    key={capsule.id}
                    className={`bg-gradient-to-br ${capsule.bgColor} rounded-xl p-3 shadow-md`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">{capsule.emoji}</span>
                      <div className="flex-1 min-w-0">
                        {/* Message masqué avec cadenas */}
                        <div className="flex items-center gap-2 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                          <p className="text-xs text-gray-800 font-medium italic">
                            {language === 'fr' ? 'Je me suis engagé' : language === 'en' ? 'I committed' : 'Me comprometí'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {capsule.triggerType === 'days' && capsule.deliveryDate ? (
                            <span className="text-[10px] text-gray-600 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(capsule.deliveryDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES')}
                            </span>
                          ) : (
                            <span className="text-[10px] text-purple-600 flex items-center gap-1 font-medium">
                              <Trophy className="w-3 h-3" />
                              {language === 'fr' 
                                ? `${capsule.winsAtCreation + capsule.triggerValue} victoires`
                                : language === 'en'
                                  ? `${capsule.winsAtCreation + capsule.triggerValue} wins`
                                  : `${capsule.winsAtCreation + capsule.triggerValue} victorias`}
                            </span>
                          )}
                          {capsule.category && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-white/50 rounded-full text-gray-700">
                              {CATEGORIES.find(c => c.id === capsule.category)?.label[language as 'fr' | 'en' | 'es']}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setCapsules(capsules.filter(c => c.id !== capsule.id))}
                        className="p-1 hover:bg-white/50 rounded-full"
                      >
                        <X className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Onglet Reçus */}
          {activeTab === 'delivered' && (
            <div className="space-y-3">
              {deliveredCapsules.length === 0 ? (
                <div className="text-center py-8">
                  <Archive className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    {language === 'fr' ? 'Aucune capsule reçue' : language === 'en' ? 'No received capsules' : 'Sin cápsulas recibidas'}
                  </p>
                </div>
              ) : (
                deliveredCapsules.map((capsule) => (
                  <div
                    key={capsule.id}
                    className={`bg-gradient-to-br ${capsule.bgColor} rounded-xl p-3 shadow-md cursor-pointer hover:scale-[1.02] transition-all`}
                    onClick={() => setDeliveredCapsule(capsule)}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">{capsule.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-800 line-clamp-2">{capsule.text}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] text-gray-600 flex items-center gap-1">
                            <Check className="w-3 h-3 text-green-500" />
                            {language === 'fr' ? 'Reçu le' : language === 'en' ? 'Received on' : 'Recibido el'} {new Date(capsule.deliveryDate || capsule.createdAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES')}
                          </span>
                          {capsule.triggerType === 'wins' && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-full flex items-center gap-1">
                              <Trophy className="w-3 h-3" />
                              {capsule.triggerValue}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
