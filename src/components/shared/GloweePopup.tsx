import React from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

interface GloweePopupProps {
  isOpen: boolean;
  onClose: () => void;
  gloweeImage: string; // Nom de l'image (ex: "glowee-felicite.webp")
  title: string;
  message: string;
  userName?: string; // "Ma star", "Ma belle", etc.
  position?: 'top' | 'center'; // Position du popup
  showCloseButton?: boolean;
}

export default function GloweePopup({
  isOpen,
  onClose,
  gloweeImage,
  title,
  message,
  userName = "Ma belle",
  position = 'top',
  showCloseButton = true,
}: GloweePopupProps) {
  if (!isOpen) return null;

  const positionClasses = position === 'top' 
    ? 'top-4 left-1/2 -translate-x-1/2' 
    : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Popup */}
      <div 
        className={`fixed ${positionClasses} z-50 w-full max-w-2xl mx-4 animate-in slide-in-from-top duration-300`}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-rose-200">
          {/* Contenu avec padding 20px */}
          <div className="p-5 flex gap-4 items-start">
            {/* Glowee à gauche (30%) */}
            <div className="w-[30%] flex-shrink-0">
              <div className="relative w-full aspect-square">
                <Image
                  src={`/Glowee/${gloweeImage}`}
                  alt="Glowee"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Contenu à droite (70%) */}
            <div className="flex-1 space-y-3">
              {/* Titre avec nom flatteur */}
              <div>
                <h3 className="text-xl font-bold text-stone-900 mb-1">
                  {userName} ! 💖
                </h3>
                <h4 className="text-lg font-semibold text-rose-500">
                  {title}
                </h4>
              </div>

              {/* Message */}
              <p className="text-stone-700 leading-relaxed">
                {message}
              </p>

              {/* Bouton de fermeture */}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="mt-4 w-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Merci Glowee ! ✨
                </button>
              )}
            </div>

            {/* Bouton X en haut à droite */}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-stone-600" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

