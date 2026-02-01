'use client';

import { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Sparkles, Heart, Brain, Zap, Coffee, Sun, Moon } from 'lucide-react';

export interface JournalEntry {
  id: string;
  date: string;
  time: string;
  mood: string;
  moodColor: string;
  tags: string[];
  text: string;
  images: string[];
}

interface JournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<JournalEntry, 'id'>) => void;
  editingEntry: JournalEntry | null;
  language: 'fr' | 'en' | 'es';
}

const moodOptions = {
  fr: [
    { emoji: '😄', label: 'super', color: 'from-emerald-400 to-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', icon: Sun },
    { emoji: '😊', label: 'bien', color: 'from-lime-400 to-lime-500', bgColor: 'bg-lime-50', textColor: 'text-lime-700', icon: Sun },
    { emoji: '😐', label: 'neutre', color: 'from-amber-400 to-amber-500', bgColor: 'bg-amber-50', textColor: 'text-amber-700', icon: Coffee },
    { emoji: '😴', label: 'fatigué', color: 'from-violet-400 to-violet-500', bgColor: 'bg-violet-50', textColor: 'text-violet-700', icon: Moon },
    { emoji: '😢', label: 'triste', color: 'from-blue-400 to-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700', icon: Heart }
  ],
  en: [
    { emoji: '😄', label: 'great', color: 'from-emerald-400 to-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', icon: Sun },
    { emoji: '😊', label: 'good', color: 'from-lime-400 to-lime-500', bgColor: 'bg-lime-50', textColor: 'text-lime-700', icon: Sun },
    { emoji: '😐', label: 'neutral', color: 'from-amber-400 to-amber-500', bgColor: 'bg-amber-50', textColor: 'text-amber-700', icon: Coffee },
    { emoji: '😴', label: 'tired', color: 'from-violet-400 to-violet-500', bgColor: 'bg-violet-50', textColor: 'text-violet-700', icon: Moon },
    { emoji: '😢', label: 'sad', color: 'from-blue-400 to-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700', icon: Heart }
  ],
  es: [
    { emoji: '😄', label: 'genial', color: 'from-emerald-400 to-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', icon: Sun },
    { emoji: '😊', label: 'bien', color: 'from-lime-400 to-lime-500', bgColor: 'bg-lime-50', textColor: 'text-lime-700', icon: Sun },
    { emoji: '😐', label: 'neutral', color: 'from-amber-400 to-amber-500', bgColor: 'bg-amber-50', textColor: 'text-amber-700', icon: Coffee },
    { emoji: '😴', label: 'cansado', color: 'from-violet-400 to-violet-500', bgColor: 'bg-violet-50', textColor: 'text-violet-700', icon: Moon },
    { emoji: '😢', label: 'triste', color: 'from-blue-400 to-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700', icon: Heart }
  ]
};

// Main tags with colors
const mainTags = {
  fr: [
    { tag: 'bonne nuit', color: 'from-indigo-400 to-purple-500' },
    { tag: 'manger sain', color: 'from-emerald-400 to-green-500' },
    { tag: 'soleil', color: 'from-amber-400 to-orange-500' },
    { tag: 'sport', color: 'from-rose-400 to-pink-500' },
    { tag: 'travail', color: 'from-blue-400 to-indigo-500' },
    { tag: 'sommeil', color: 'from-violet-400 to-purple-500' }
  ],
  en: [
    { tag: 'good night', color: 'from-indigo-400 to-purple-500' },
    { tag: 'healthy eating', color: 'from-emerald-400 to-green-500' },
    { tag: 'sun', color: 'from-amber-400 to-orange-500' },
    { tag: 'sport', color: 'from-rose-400 to-pink-500' },
    { tag: 'work', color: 'from-blue-400 to-indigo-500' },
    { tag: 'sleep', color: 'from-violet-400 to-purple-500' }
  ],
  es: [
    { tag: 'buena noche', color: 'from-indigo-400 to-purple-500' },
    { tag: 'comer sano', color: 'from-emerald-400 to-green-500' },
    { tag: 'sol', color: 'from-amber-400 to-orange-500' },
    { tag: 'deporte', color: 'from-rose-400 to-pink-500' },
    { tag: 'trabajo', color: 'from-blue-400 to-indigo-500' },
    { tag: 'sueño', color: 'from-violet-400 to-purple-500' }
  ]
};

// Categories with their tags and colors
const tagCategories = {
  fr: [
    { name: 'Relations', color: 'from-rose-400 to-pink-500', icon: Heart, tags: ['famille', 'amis', 'rendez-vous amoureux', 'rencontre nouvelle', 'conflit', 'discussion', 'temps seul'] },
    { name: 'Santé', color: 'from-emerald-400 to-green-500', icon: Heart, tags: ['malade', 'malaise', 'fatigue'] },
    { name: 'Productivité', color: 'from-blue-400 to-indigo-500', icon: Zap, tags: ['deep work', 'réunion', 'créativité', 'procrastination', 'objectif atteint', 'stress', 'burnout'] },
    { name: 'Loisirs', color: 'from-amber-400 to-orange-500', icon: Sparkles, tags: ['lecture', 'films', 'gaming', 'nature', 'art', 'création', 'voyage'] },
    { name: 'Émotions', color: 'from-violet-400 to-purple-500', icon: Brain, tags: ['gratitude', 'anxiété', 'fierté', 'colère', 'flow', 'plénitude', 'mélancolie'] },
    { name: 'Développement', color: 'from-cyan-400 to-blue-500', icon: Sun, tags: ['nouvelle habitude', 'échec', 'apprentissage', 'méditation', 'journal', 'morning pages', 'insight', 'prise de conscience', 'lâcher prise'] },
    { name: 'Quotidien', color: 'from-gray-400 to-slate-500', icon: Coffee, tags: ['ménage', 'courses', 'cuisine', 'organisation', 'finances', 'administration'] }
  ],
  en: [
    { name: 'Relationships', color: 'from-rose-400 to-pink-500', icon: Heart, tags: ['family', 'friends', 'date', 'new encounter', 'conflict', 'discussion', 'alone time'] },
    { name: 'Health', color: 'from-emerald-400 to-green-500', icon: Heart, tags: ['sick', 'unwell', 'fatigue'] },
    { name: 'Productivity', color: 'from-blue-400 to-indigo-500', icon: Zap, tags: ['deep work', 'meeting', 'creativity', 'procrastination', 'goal achieved', 'stress', 'burnout'] },
    { name: 'Leisure', color: 'from-amber-400 to-orange-500', icon: Sparkles, tags: ['reading', 'movies', 'gaming', 'nature', 'art', 'creation', 'travel'] },
    { name: 'Emotions', color: 'from-violet-400 to-purple-500', icon: Brain, tags: ['gratitude', 'anxiety', 'pride', 'anger', 'flow', 'fulfillment', 'melancholy'] },
    { name: 'Growth', color: 'from-cyan-400 to-blue-500', icon: Sun, tags: ['new habit', 'failure', 'learning', 'meditation', 'journaling', 'morning pages', 'insight', 'realization', 'letting go'] },
    { name: 'Daily', color: 'from-gray-400 to-slate-500', icon: Coffee, tags: ['housework', 'shopping', 'cooking', 'organization', 'finances', 'administration'] }
  ],
  es: [
    { name: 'Relaciones', color: 'from-rose-400 to-pink-500', icon: Heart, tags: ['familia', 'amigos', 'cita', 'nuevo encuentro', 'conflicto', 'discusión', 'tiempo solo'] },
    { name: 'Salud', color: 'from-emerald-400 to-green-500', icon: Heart, tags: ['enfermo', 'malestar', 'cansancio'] },
    { name: 'Productividad', color: 'from-blue-400 to-indigo-500', icon: Zap, tags: ['deep work', 'reunión', 'creatividad', 'procrastinación', 'objetivo logrado', 'estrés', 'burnout'] },
    { name: 'Ocio', color: 'from-amber-400 to-orange-500', icon: Sparkles, tags: ['lectura', 'películas', 'gaming', 'naturaleza', 'arte', 'creación', 'viaje'] },
    { name: 'Emociones', color: 'from-violet-400 to-purple-500', icon: Brain, tags: ['gratitud', 'ansiedad', 'orgullo', 'ira', 'flow', 'plenitud', 'melancolía'] },
    { name: 'Desarrollo', color: 'from-cyan-400 to-blue-500', icon: Sun, tags: ['nuevo hábito', 'fracaso', 'aprendizaje', 'meditación', 'diario', 'morning pages', 'insight', 'toma de conciencia', 'soltar'] },
    { name: 'Vida', color: 'from-gray-400 to-slate-500', icon: Coffee, tags: ['limpieza', 'compras', 'cocina', 'organización', 'finanzas', 'administración'] }
  ]
};

export function JournalEntryModal({ isOpen, onClose, onSave, editingEntry, language }: JournalEntryModalProps) {
  const [text, setText] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedMoodColor, setSelectedMoodColor] = useState('');
  const [selectedMoodBg, setSelectedMoodBg] = useState('');
  const [selectedMoodText, setSelectedMoodText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const t = {
    fr: {
      editEntry: 'Modifier l\'entrée',
      newEntry: 'Moments vrais',
      howAreYou: 'Comment vous sentez-vous ?',
      tags: 'Tags',
      quickTags: 'Tags rapides',
      categories: 'Catégories',
      yourEntry: 'Ma journée',
      placeholder: 'Écrivez vos pensées, ressentis, gratitudes...',
      photos: 'Photos',
      addPhoto: 'Ajouter une photo',
      maxImages: 'Maximum 4 images',
      save: 'Enregistrer',
      add: 'Ma journée',
      cancel: 'Annuler'
    },
    en: {
      editEntry: 'Edit entry',
      newEntry: 'New entry',
      howAreYou: 'How are you feeling?',
      tags: 'Tags',
      quickTags: 'Quick Tags',
      categories: 'Categories',
      yourEntry: 'Your entry',
      placeholder: 'Write your thoughts, feelings, gratitudes...',
      photos: 'Photos',
      addPhoto: 'Add a photo',
      maxImages: 'Maximum 4 images',
      save: 'Save',
      add: 'My day',
      cancel: 'Cancel'
    },
    es: {
      editEntry: 'Editar entrada',
      newEntry: 'Nueva entrada',
      howAreYou: '¿Cómo te sientes?',
      tags: 'Etiquetas',
      quickTags: 'Etiquetas rápidas',
      categories: 'Categorías',
      yourEntry: 'Tu entrada',
      placeholder: 'Escribe tus pensamientos, sentimientos, gratitudes...',
      photos: 'Fotos',
      addPhoto: 'Agregar una foto',
      maxImages: 'Máximo 4 imágenes',
      save: 'Guardar',
      add: 'Mi día',
      cancel: 'Cancelar'
    }
  }[language];

  useEffect(() => {
    if (editingEntry) {
      setText(editingEntry.text);
      setSelectedMood(editingEntry.mood);
      setSelectedMoodColor(editingEntry.moodColor);
      const moodData = moodOptions[language].find(m => m.label === editingEntry.mood);
      if (moodData) {
        setSelectedMoodBg(moodData.bgColor);
        setSelectedMoodText(moodData.textColor);
      }
      setSelectedTags(editingEntry.tags);
      setImages(editingEntry.images || []);
    } else {
      resetForm();
    }
  }, [editingEntry, isOpen, language]);

  const resetForm = () => {
    setText('');
    setSelectedMood('');
    setSelectedMoodColor('');
    setSelectedMoodBg('');
    setSelectedMoodText('');
    setSelectedTags([]);
    setImages([]);
    setExpandedCategory(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    if (!text.trim() || !selectedMood) return;

    const now = new Date();
    const entryData = {
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      mood: selectedMood,
      moodColor: selectedMoodColor,
      tags: selectedTags,
      text: text,
      images: images
    };

    onSave(entryData);
    resetForm();
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).slice(0, 4 - images.length).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
    e.target.value = '';
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  const selectMood = (mood: typeof moodOptions['fr'][0]) => {
    setSelectedMood(mood.label);
    setSelectedMoodColor(mood.color);
    setSelectedMoodBg(mood.bgColor);
    setSelectedMoodText(mood.textColor);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className={`bg-white w-full max-w-lg sm:rounded-[2rem] rounded-t-[2rem] max-h-[95vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 ${selectedMoodBg || 'bg-white'}`}>
        {/* Header avec gradient dynamique */}
        <div className={`sticky top-0 px-6 py-5 flex items-center justify-between ${selectedMood ? `bg-gradient-to-r ${selectedMoodColor} text-white` : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {editingEntry ? t.editEntry : t.newEntry}
              </h2>
              <p className="text-xs opacity-80">
                {new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(95vh-180px)]">
          {/* Mood Selector */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              {t.howAreYou}
            </p>
            <div className="flex gap-2">
              {moodOptions[language].map((mood) => {
                const IconComponent = mood.icon;
                return (
                  <button
                    key={mood.label}
                    onClick={() => selectMood(mood)}
                    className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-300 ${
                      selectedMood === mood.label
                        ? `bg-gradient-to-br ${mood.color} text-white shadow-lg scale-105`
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className={`text-xs font-medium capitalize ${selectedMood === mood.label ? 'text-white' : ''}`}>
                      {mood.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Tags Display */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-md"
                >
                  {tag}
                  <button
                    onClick={() => toggleTag(tag)}
                    className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/50"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Quick Tags */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              {t.quickTags}
            </p>
            <div className="flex flex-wrap gap-2">
              {mainTags[language].map((item) => (
                <button
                  key={item.tag}
                  onClick={() => toggleTag(item.tag)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                    selectedTags.includes(item.tag)
                      ? `bg-gradient-to-r ${item.color} text-white shadow-md scale-105`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {item.tag}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-violet-500" />
              {t.categories}
            </p>
            <div className="flex flex-wrap gap-2">
              {tagCategories[language].map((category) => {
                const IconComponent = category.icon;
                return (
                  <div key={category.name} className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategory(category.name);
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                        expandedCategory === category.name
                          ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                          : 'bg-white border-2 border-gray-100 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                      {category.name}
                    </button>
                    
                    {/* Dropdown with tags */}
                    {expandedCategory === category.name && (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="absolute z-50 top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 min-w-[220px] max-w-[300px]"
                      >
                        <p className={`text-xs font-bold mb-3 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                          {category.name}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {category.tags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => toggleTag(tag)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                selectedTags.includes(tag)
                                  ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Text Input */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-500" />
              {t.yourEntry}
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.placeholder}
              className="w-full h-36 p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-200 border border-gray-100"
            />
          </div>

          {/* Image Upload */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-500" />
              {t.photos} <span className="text-gray-400 font-normal">({images.length}/4)</span>
            </p>
            
            {/* Preview of uploaded images */}
            {images.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-3 mb-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative flex-shrink-0">
                    <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden shadow-md">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Upload button */}
            {images.length < 4 && (
              <label className="flex items-center justify-center gap-2 w-full py-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-500">
                  {t.addPhoto}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
            <p className="text-xs text-gray-400 mt-2 text-center">{t.maxImages}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6">
          <button
            onClick={handleSave}
            disabled={!text.trim() || !selectedMood}
            className={`w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 ${
              text.trim() && selectedMood
                ? 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl hover:scale-[1.02]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {editingEntry ? t.save : t.add}
          </button>
        </div>
      </div>
    </div>
  );
}
