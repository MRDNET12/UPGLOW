'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Calendar, Clock, ChevronUp, ChevronDown, Plus, Check, X, Sparkles, Heart, Brain, Dumbbell, Eye, Archive, Send } from 'lucide-react';
import { useTranslation } from '@/lib/useTranslation';

// Types
interface TimeCapsuleMessage {
  id: string;
  text: string;
  category: 'corps' | 'mental' | 'discipline' | 'image' | null;
  emoji: string;
  bgColor: string;
  createdAt: string;
  deliveryDate: string;
  status: 'pending' | 'delivered';
}

interface TimeCapsuleProps {
  theme?: 'light' | 'dark';
  isExpanded: boolean;
  onToggle: () => void;
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
  { id: 'image', label: { fr: 'Image', en: 'Image', es: 'Imagen' }, icon: Eye, color: 'from-pink-400 to-rose-500' }
];

// Délais prédéfinis
const PRESET_DELAYS = [
  { days: 7, label: { fr: '7 jours', en: '7 days', es: '7 días' } },
  { days: 30, label: { fr: '30 jours', en: '30 days', es: '30 días' } },
  { days: 90, label: { fr: '90 jours', en: '90 days', es: '90 días' } }
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

export function TimeCapsule({ theme = 'light', isExpanded, onToggle }: TimeCapsuleProps) {
  const { language } = useTranslation();
  
  // États
  const [capsules, setCapsules] = useState<TimeCapsuleMessage[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState('💌');
  const [selectedBgColor, setSelectedBgColor] = useState(BG_COLORS[0].value);
  const [selectedDelay, setSelectedDelay] = useState(7);
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
          if (c.status === 'pending' && c.deliveryDate <= today) {
            return { ...c, status: 'delivered' as const };
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
  }, []);

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
    
    const deliveryDate = useCustomDate && customDate 
      ? customDate 
      : addDays(getLocalDateString(), selectedDelay);
    
    const newCapsule: TimeCapsuleMessage = {
      id: `capsule_${Date.now()}`,
      text: newMessage.trim(),
      category: selectedCategory as TimeCapsuleMessage['category'],
      emoji: selectedEmoji,
      bgColor: selectedBgColor,
      createdAt: getLocalDateString(),
      deliveryDate,
      status: 'pending'
    };
    
    setCapsules([...capsules, newCapsule]);
    // Reset form
    setNewMessage('');
    setSelectedCategory(null);
    setSelectedEmoji('💌');
    setSelectedBgColor(BG_COLORS[0].value);
    setSelectedDelay(7);
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

      {/* Carte compacte - Hauteur +5px, Largeur +60px */}
      <div className="relative">
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

        {/* Section expandée - Slide similaire à Petits Succès - Centré */}
        {isExpanded && (
          <div className="fixed left-1/2 -translate-x-1/2 mt-3 p-5 bg-white/95 backdrop-blur-md rounded-[1.5rem] shadow-xl shadow-purple-100/50 border border-purple-100/50 space-y-4 transition-all duration-300 ease-out w-[90vw] max-w-md z-50" style={{ top: 'auto' }}>
            {/* Header avec onglets */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-600" />
                  {language === 'fr' ? 'Message à moi' : language === 'en' ? 'Message to me' : 'Mensaje a mí'}
                </h3>
                <button onClick={onToggle} className="p-1 hover:bg-white/50 rounded-full transition-all">
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                </button>
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
                    className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeTab === tab.id
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
                  <div className="bg-purple-50 rounded-xl p-3">
                    <p className="text-xs text-purple-700 font-medium mb-2">
                      {language === 'fr' ? 'Dans X jours, je veux me souvenir que j\'ai…' :
                       language === 'en' ? 'In X days, I want to remember that I...' :
                       'En X días, quiero recordar que...'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => setNewMessage(s[language as keyof typeof s])}
                          className="text-[10px] px-2 py-1 bg-white rounded-full text-purple-600 hover:bg-purple-100 transition-all"
                        >
                          💡 {s[language as keyof typeof s].substring(0, 30)}...
                        </button>
                      ))}
                    </div>
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
                    <div className="flex gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            selectedCategory === cat.id
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
                            className={`w-7 h-7 rounded-lg text-sm transition-all ${
                              selectedEmoji === emoji ? 'bg-purple-200 scale-110' : 'bg-gray-100 hover:bg-gray-200'
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
                            className={`w-7 h-7 rounded-lg bg-gradient-to-br ${color.value} border-2 transition-all ${
                              selectedBgColor === color.value ? 'border-purple-500 scale-110' : 'border-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Date de réception */}
                  <div>
                    <p className="text-xs font-bold text-gray-700 mb-2">
                      {language === 'fr' ? 'Recevoir dans' : language === 'en' ? 'Receive in' : 'Recibir en'}
                    </p>
                    <div className="flex gap-2 mb-2">
                      {PRESET_DELAYS.map((delay) => (
                        <button
                          key={delay.days}
                          onClick={() => { setSelectedDelay(delay.days); setUseCustomDate(false); }}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                            !useCustomDate && selectedDelay === delay.days
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
                      {useCustomDate && (
                        <input
                          type="date"
                          value={customDate}
                          onChange={(e) => setCustomDate(e.target.value)}
                          min={addDays(getLocalDateString(), 1)}
                          className="flex-1 px-2 py-1 text-xs border border-purple-200 rounded-lg"
                        />
                      )}
                    </div>
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
                            <p className="text-xs text-gray-800 line-clamp-2">{capsule.text}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[10px] text-gray-600 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(capsule.deliveryDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES')}
                              </span>
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
                                {language === 'fr' ? 'Reçu le' : language === 'en' ? 'Received on' : 'Recibido el'} {new Date(capsule.deliveryDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES')}
                              </span>
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
      </div>
    </>
  );
}