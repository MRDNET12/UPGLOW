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
    ? 'top-8 sm:top-12 left-1/2 -translate-x-1/2'
    : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Popup - Design avec Glowee à moitié dehors */}
      <div
        className={`fixed ${positionClasses} z-50 w-[90%] sm:w-full max-w-md sm:max-w-lg px-2 sm:px-4 animate-in slide-in-from-top duration-300`}
      >
        {/* Container avec espace pour Glowee en haut */}
        <div className="relative pt-16 sm:pt-20">
          {/* Glowee qui dépasse en haut */}
          <div className="absolute -top-2 sm:-top-4 left-4 sm:left-6 w-28 h-28 sm:w-36 sm:h-36 z-10">
            <div className="relative w-full h-full drop-shadow-2xl">
              <Image
                src={`/Glowee/${gloweeImage}`}
                alt="Glowee"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Carte principale */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-rose-200 overflow-hidden">
            {/* Bouton X en haut à droite */}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors shadow-md"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-stone-600" />
              </button>
            )}

            {/* Contenu */}
            <div className="p-4 sm:p-6 pt-6 sm:pt-8">
              {/* Titre avec nom flatteur */}
              <div className="mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-1">
                  {userName} ! 💖
                </h3>
                <h4 className="text-base sm:text-lg font-semibold text-rose-500">
                  {title}
                </h4>
              </div>

              {/* Message */}
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed mb-4 sm:mb-5">
                {message}
              </p>

              {/* Bouton de fermeture */}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
                >
                  Merci Glowee ! ✨
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

