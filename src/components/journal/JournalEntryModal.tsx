'use client';

import { useState, useEffect } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

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
    { emoji: '😄', label: 'super', color: '#22c55e' },
    { emoji: '😊', label: 'bien', color: '#84cc16' },
    { emoji: '😐', label: 'neutre', color: '#eab308' },
    { emoji: '😴', label: 'fatigué', color: '#8b5cf6' },
    { emoji: '😢', label: 'triste', color: '#3b82f6' }
  ],
  en: [
    { emoji: '😄', label: 'great', color: '#22c55e' },
    { emoji: '😊', label: 'good', color: '#84cc16' },
    { emoji: '😐', label: 'neutral', color: '#eab308' },
    { emoji: '😴', label: 'tired', color: '#8b5cf6' },
    { emoji: '😢', label: 'sad', color: '#3b82f6' }
  ],
  es: [
    { emoji: '😄', label: 'genial', color: '#22c55e' },
    { emoji: '😊', label: 'bien', color: '#84cc16' },
    { emoji: '😐', label: 'neutral', color: '#eab308' },
    { emoji: '😴', label: 'cansado', color: '#8b5cf6' },
    { emoji: '😢', label: 'triste', color: '#3b82f6' }
  ]
};

const tagOptions = {
  fr: ['sommeil', 'sport', 'travail', 'relation', 'santé', 'famille', 'créativité', 'nutrition'],
  en: ['sleep', 'sport', 'work', 'relationship', 'health', 'family', 'creativity', 'nutrition'],
  es: ['sueño', 'deporte', 'trabajo', 'relación', 'salud', 'familia', 'creatividad', 'nutrición']
};

export function JournalEntryModal({ isOpen, onClose, onSave, editingEntry, language }: JournalEntryModalProps) {
  const [text, setText] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedMoodColor, setSelectedMoodColor] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const t = {
    fr: {
      editEntry: 'Modifier l\'entrée',
      newEntry: 'Nouvelle entrée',
      howAreYou: 'Comment vous sentez-vous ?',
      tags: 'Tags (optionnel)',
      yourEntry: 'Votre entrée',
      placeholder: 'Écrivez vos pensées, ressentis, gratitudes...',
      photos: 'Photos',
      addPhoto: 'Ajouter une photo',
      maxImages: 'Maximum 4 images. Les images sont stockées localement.',
      save: 'Enregistrer',
      add: 'Ajouter',
      cancel: 'Annuler'
    },
    en: {
      editEntry: 'Edit entry',
      newEntry: 'New entry',
      howAreYou: 'How are you feeling?',
      tags: 'Tags (optional)',
      yourEntry: 'Your entry',
      placeholder: 'Write your thoughts, feelings, gratitudes...',
      photos: 'Photos',
      addPhoto: 'Add a photo',
      maxImages: 'Maximum 4 images. Images are stored locally.',
      save: 'Save',
      add: 'Add',
      cancel: 'Cancel'
    },
    es: {
      editEntry: 'Editar entrada',
      newEntry: 'Nueva entrada',
      howAreYou: '¿Cómo te sientes?',
      tags: 'Etiquetas (opcional)',
      yourEntry: 'Tu entrada',
      placeholder: 'Escribe tus pensamientos, sentimientos, gratitudes...',
      photos: 'Fotos',
      addPhoto: 'Agregar una foto',
      maxImages: 'Máximo 4 imágenes. Las imágenes se almacenan localmente.',
      save: 'Guardar',
      add: 'Agregar',
      cancel: 'Cancelar'
    }
  }[language];

  useEffect(() => {
    if (editingEntry) {
      setText(editingEntry.text);
      setSelectedMood(editingEntry.mood);
      setSelectedMoodColor(editingEntry.moodColor);
      setSelectedTags(editingEntry.tags);
      setImages(editingEntry.images || []);
    } else {
      resetForm();
    }
  }, [editingEntry, isOpen]);

  const resetForm = () => {
    setText('');
    setSelectedMood('');
    setSelectedMoodColor('');
    setSelectedTags([]);
    setImages([]);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">
            {editingEntry ? t.editEntry : t.newEntry}
          </h2>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Mood Selector */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">{t.howAreYou}</p>
            <div className="flex gap-2">
              {moodOptions[language].map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => {
                    setSelectedMood(mood.label);
                    setSelectedMoodColor(mood.color);
                  }}
                  className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${
                    selectedMood === mood.label
                      ? 'bg-gray-100 ring-2 ring-gray-300'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className={`text-xs capitalize ${selectedMood === mood.label ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">{t.tags}</p>
            <div className="flex flex-wrap gap-2">
              {tagOptions[language].map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Text Input */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">{t.yourEntry}</p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.placeholder}
              className="w-full h-32 p-4 bg-gray-50 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {/* Image Upload */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              {t.photos} <span className="text-gray-400 font-normal">({images.length}/4)</span>
            </p>
            
            {/* Preview of uploaded images */}
            {images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-3 mb-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Upload button */}
            {images.length < 4 && (
              <label className="flex items-center justify-center gap-2 w-full py-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
                <ImageIcon className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-500">{t.addPhoto}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
            <p className="text-xs text-gray-400 mt-2">{t.maxImages}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
          <button
            onClick={handleSave}
            disabled={!text.trim() || !selectedMood}
            className={`w-full py-4 rounded-2xl font-semibold transition-all ${
              text.trim() && selectedMood
                ? 'bg-gray-900 text-white hover:bg-gray-800'
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
