'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface GloweeChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export function GloweeChatPopup({ isOpen, onClose, theme = 'light' }: GloweeChatPopupProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Messages d'accueil aléatoires
  const [welcomeMessage] = useState(() => {
    const nicknames = [
      'ma jolie',
      'mon trésor',
      'ma queen',
      'ma précieuse',
      'ma courageuse',
      'ma merveille',
      'mon rayon',
      'glow queen',
      'mon étoile',
      'ma best',
      'ma fidèle',
      'ma copine',
      'ma confidente',
      'ma bestie ✨',
      'ma glow friend'
    ];

    const phrases = [
      'vas-y, dis-moi tout 💕',
      'je t\'écoute ✨',
      'raconte-moi 🌸',
      'je suis là 💖',
      'vas-y, je t\'écoute ☀️'
    ];

    const randomNickname = nicknames[Math.floor(Math.random() * nicknames.length)];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    return `Hey ${randomNickname}, ${randomPhrase}`;
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Fonction pour formater le texte de Glowee (enlever le markdown)
  const formatGloweeText = (text: string) => {
    return text
      // Enlever les doubles astérisques (gras)
      .replace(/\*\*(.+?)\*\*/g, '$1')
      // Enlever les simples astérisques (italique)
      .replace(/\*(.+?)\*/g, '$1')
      // Enlever les tirets de liste au début des lignes
      .replace(/^- /gm, '• ')
      // Enlever les numéros de liste
      .replace(/^\d+\.\s/gm, '• ');
  };

  // Fonction pour fermer avec animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
          shortResponse: true // Demander des réponses courtes
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Oups ! J'ai eu un petit souci. Peux-tu réessayer ? 💫"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div className={`fixed bottom-20 right-2 left-2 sm:left-auto sm:right-4 z-50 sm:w-[400px] max-w-[calc(100vw-16px)] transition-all duration-300 ${
      isClosing ? 'animate-out slide-out-to-bottom' : 'animate-in slide-in-from-bottom'
    }`}>
      <div
        className={`
          relative rounded-2xl shadow-2xl overflow-hidden
          flex flex-col
          ${theme === 'dark' ? 'bg-stone-900 text-stone-100' : 'bg-white text-stone-900'}
          border ${theme === 'dark' ? 'border-stone-800' : 'border-stone-200'}
          max-h-[calc(100vh-100px)]
        `}
      >
        {/* Header avec bouton fermer */}
        <div className={`
          flex items-center justify-between px-4 py-3 border-b
          ${theme === 'dark' ? 'border-stone-800 bg-stone-900/95' : 'border-stone-200 bg-white/95'}
        `}>
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <Image
                src="/Glowee/glowee-nav-bar.webp"
                alt="Glowee"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-base font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                Glowee
              </h2>
              <p className={`text-xs ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                Ton reflet bienveillant
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="rounded-full h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Message d'accueil avec image de Glowee au centre */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="relative w-32 h-32 mb-4">
              <Image
                src="/Glowee/glowee-acceuillante.webp"
                alt="Glowee"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-center text-base font-medium bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              {welcomeMessage}
            </p>
          </div>
        )}

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 min-h-[200px] max-h-[400px]"
          ref={scrollRef}
        >
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="relative w-7 h-7 flex-shrink-0">
                    <Image
                      src="/Glowee/glowee-repond.webp"
                      alt="Glowee"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div
                  className={`
                    max-w-[75%] rounded-2xl px-3 py-2
                    ${msg.role === 'user'
                      ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-white'
                      : theme === 'dark'
                        ? 'bg-stone-800 text-stone-100'
                        : 'bg-stone-100 text-stone-900'
                    }
                  `}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {msg.role === 'assistant' ? formatGloweeText(msg.content) : msg.content}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="relative w-7 h-7 flex-shrink-0">
                  <Image
                    src="/Glowee/glowee-reflechir.webp"
                    alt="Glowee"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className={`
                  rounded-2xl px-3 py-2
                  ${theme === 'dark' ? 'bg-stone-800' : 'bg-stone-100'}
                `}>
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className={`
          p-3 border-t
          ${theme === 'dark' ? 'border-stone-800 bg-stone-900/95' : 'border-stone-200 bg-white/95'}
        `}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écris ton message..."
              disabled={isLoading}
              className={`
                flex-1 text-sm
                ${theme === 'dark'
                  ? 'bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-500'
                  : 'bg-stone-50 border-stone-200 text-stone-900 placeholder:text-stone-400'
                }
              `}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="icon"
              className="bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white h-10 w-10"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

