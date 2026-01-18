'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface GloweeHourlyMessageProps {
  theme?: 'light' | 'dark';
}

const messages = [
  // Version très courte (micro-motivation)
  'Avance, même un peu. Ça compte 💛',
  'Continue, c\'est déjà bien 🌸',
  'Même un pas, c\'est du progrès',
  'Tu avances. C\'est l\'essentiel',
  'Un geste pour toi, maintenant',
  'Pas besoin d\'en faire trop',
  'Chaque petit effort compte',
  'Avance à ton rythme',
  'Tu fais déjà quelque chose pour toi',
  
  // Glow up mindset
  'Chaque effort te rapproche de ton glow ✨ Continue',
  'Ton glow se construit un jour à la fois',
  'Ce que tu fais aujourd\'hui compte vraiment',
  'Chaque action t\'aligne avec la meilleure version de toi',
  'Tu investis en toi, et ça se voit',
  'Continue, ton glow est en chemin',
  'Tu construis quelque chose de beau',
  'Ton futur toi te dira merci',
  'Chaque pas nourrit ton glow',
  'Tu es sur la bonne voie, continue',
  
  // Motivation assumée (se dépasser)
  'Tu es capable de plus que tu ne le penses. Vas-y 💪',
  'Tu peux te dépasser aujourd\'hui, fais-toi confiance !',
  'Donne un peu plus, tu en es capable !',
  'Tu as cette force en toi, utilise-la !',
  'Aujourd\'hui est une bonne occasion d\'oser !',
  'Tu peux aller plus loin que tu crois !',
  'Fais-le, même si c\'est inconfortable !',
  'Montre-toi de quoi tu es capable !',
  'Tu as déjà tout en toi !',
  'Vas-y, je suis avec toi ✨',
  
  // Version anti-stress
  'Un pas à la fois, sans pression. Je suis là avec toi 🌸',
  'Tu peux y aller à ton rythme',
  'Pas besoin de faire parfait',
  'Fais ce que tu peux aujourd\'hui',
  'Même doucement, tu avances',
  'Prends ton temps, c\'est ok',
  'Tu n\'es pas en retard',
  'Avance sans te juger',
  'Je suis là, quoi qu\'il arrive'
];

export function GloweeHourlyMessage({ theme = 'light' }: GloweeHourlyMessageProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);

  // Sélectionner le message basé sur l'heure actuelle
  useEffect(() => {
    const selectMessage = () => {
      const hour = new Date().getHours();
      const messageIndex = hour % messages.length;
      return messages[messageIndex];
    };

    const initialMessage = selectMessage();
    setCurrentMessage(initialMessage);
    setDisplayedText('');
    setIsTyping(true);
    setHasTyped(false);

    // Mettre à jour le message toutes les heures
    const interval = setInterval(() => {
      const newMessage = selectMessage();
      setCurrentMessage(newMessage);
      setDisplayedText('');
      setIsTyping(true);
      setHasTyped(false);
    }, 60 * 60 * 1000); // 1 heure

    return () => clearInterval(interval);
  }, []);

  // Effet d'écriture - ne se déclenche qu'une fois par message
  useEffect(() => {
    if (!currentMessage || hasTyped) return;

    setDisplayedText('');
    setIsTyping(true);
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < currentMessage.length) {
        setDisplayedText(currentMessage.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        setHasTyped(true);
        clearInterval(typingInterval);
      }
    }, 50); // 50ms par caractère

    return () => clearInterval(typingInterval);
  }, [currentMessage, hasTyped]);

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-rose-50/50 via-pink-50/50 to-orange-50/50 dark:from-rose-900/10 dark:via-pink-900/10 dark:to-orange-900/10">
      {/* Image de Glowee */}
      <div className="relative w-16 h-16 flex-shrink-0">
        <Image
          src="/Glowee/glowee.webp"
          alt="Glowee"
          fill
          className="object-contain"
        />
      </div>

      {/* Message avec effet d'écriture */}
      <div className="flex-1">
        <p className={`text-base font-medium bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent ${
          isTyping ? 'animate-pulse' : ''
        }`}>
          {displayedText}
          {isTyping && <span className="inline-block w-0.5 h-4 ml-1 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 animate-pulse" />}
        </p>
      </div>
    </div>
  );
}

