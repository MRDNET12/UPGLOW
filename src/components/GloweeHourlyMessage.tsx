'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface GloweeHourlyMessageProps {
  theme?: 'light' | 'dark';
  language?: 'fr' | 'en' | 'es';
}

const messages = {
  fr: [
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
  ],
  en: [
    // Short version (micro-motivation)
    'Move forward, even a little. It counts 💛',
    'Keep going, that\'s already good 🌸',
    'Even one step is progress',
    'You\'re moving forward. That\'s what matters',
    'One gesture for yourself, now',
    'No need to do too much',
    'Every small effort counts',
    'Go at your own pace',
    'You\'re already doing something for yourself',

    // Glow up mindset
    'Every effort brings you closer to your glow ✨ Keep going',
    'Your glow is built one day at a time',
    'What you do today really matters',
    'Every action aligns you with your best self',
    'You\'re investing in yourself, and it shows',
    'Keep going, your glow is on its way',
    'You\'re building something beautiful',
    'Your future self will thank you',
    'Every step feeds your glow',
    'You\'re on the right path, keep going',

    // Assumed motivation (push yourself)
    'You\'re capable of more than you think. Go for it 💪',
    'You can push yourself today, trust yourself!',
    'Give a little more, you can do it!',
    'You have this strength in you, use it!',
    'Today is a good opportunity to dare!',
    'You can go further than you think!',
    'Do it, even if it\'s uncomfortable!',
    'Show yourself what you\'re capable of!',
    'You already have everything in you!',
    'Go ahead, I\'m with you ✨',

    // Anti-stress version
    'One step at a time, no pressure. I\'m here with you 🌸',
    'You can go at your own pace',
    'No need to be perfect',
    'Do what you can today',
    'Even slowly, you\'re moving forward',
    'Take your time, it\'s okay',
    'You\'re not late',
    'Move forward without judging yourself',
    'I\'m here, no matter what'
  ],
  es: [
    // Versión corta (micro-motivación)
    'Avanza, aunque sea un poco. Cuenta 💛',
    'Continúa, ya está bien 🌸',
    'Incluso un paso es progreso',
    'Estás avanzando. Eso es lo esencial',
    'Un gesto para ti, ahora',
    'No necesitas hacer demasiado',
    'Cada pequeño esfuerzo cuenta',
    'Avanza a tu ritmo',
    'Ya estás haciendo algo por ti',

    // Mentalidad glow up
    'Cada esfuerzo te acerca a tu glow ✨ Continúa',
    'Tu glow se construye un día a la vez',
    'Lo que haces hoy realmente importa',
    'Cada acción te alinea con tu mejor versión',
    'Estás invirtiendo en ti, y se nota',
    'Continúa, tu glow está en camino',
    'Estás construyendo algo hermoso',
    'Tu yo futuro te lo agradecerá',
    'Cada paso nutre tu glow',
    'Estás en el camino correcto, continúa',

    // Motivación asumida (superarse)
    'Eres capaz de más de lo que piensas. Adelante 💪',
    '¡Puedes superarte hoy, confía en ti!',
    '¡Da un poco más, puedes hacerlo!',
    '¡Tienes esta fuerza en ti, úsala!',
    '¡Hoy es una buena oportunidad para atreverte!',
    '¡Puedes ir más lejos de lo que crees!',
    '¡Hazlo, aunque sea incómodo!',
    '¡Muéstrate de lo que eres capaz!',
    '¡Ya tienes todo en ti!',
    'Adelante, estoy contigo ✨',

    // Versión anti-estrés
    'Un paso a la vez, sin presión. Estoy aquí contigo 🌸',
    'Puedes ir a tu propio ritmo',
    'No necesitas ser perfecta',
    'Haz lo que puedas hoy',
    'Incluso despacio, estás avanzando',
    'Tómate tu tiempo, está bien',
    'No llegas tarde',
    'Avanza sin juzgarte',
    'Estoy aquí, pase lo que pase'
  ]
};

export function GloweeHourlyMessage({ theme = 'light', language = 'fr' }: GloweeHourlyMessageProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);

  // Sélectionner le message basé sur l'heure actuelle
  useEffect(() => {
    const selectMessage = () => {
      const hour = new Date().getHours();
      const languageMessages = messages[language] || messages.fr;
      const messageIndex = hour % languageMessages.length;
      return languageMessages[messageIndex];
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
  }, [language]);

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

