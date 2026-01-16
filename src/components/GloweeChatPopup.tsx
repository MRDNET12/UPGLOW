'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Coucou ! 🌟 Je suis Glowee, ton assistante personnelle pour ton Glow Up ! Comment puis-je t'aider aujourd'hui ?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
          sessionId
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`
          relative w-full max-w-2xl h-[600px] rounded-2xl shadow-2xl overflow-hidden
          flex flex-col
          ${theme === 'dark' ? 'bg-stone-900 text-stone-100' : 'bg-white text-stone-900'}
          animate-in zoom-in-95 duration-200
        `}
      >
        {/* Header */}
        <div className={`
          flex items-center justify-between p-4 border-b
          ${theme === 'dark' ? 'border-stone-800 bg-stone-900/95' : 'border-stone-200 bg-white/95'}
        `}>
          <div className="flex items-center gap-3">
            <img 
              src="/Glowee/glowee-nav-bar.webp" 
              alt="Glowee" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                Glowee
              </h2>
              <p className={`text-xs ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                Ton assistante Glow Up
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <img 
                    src="/Glowee/glowee-repond.webp" 
                    alt="Glowee" 
                    className="w-8 h-8 object-contain flex-shrink-0"
                  />
                )}
                <div
                  className={`
                    max-w-[75%] rounded-2xl px-4 py-2
                    ${msg.role === 'user'
                      ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-white'
                      : theme === 'dark'
                        ? 'bg-stone-800 text-stone-100'
                        : 'bg-stone-100 text-stone-900'
                    }
                  `}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <img
                  src="/Glowee/glowee-reflechir.webp"
                  alt="Glowee"
                  className="w-8 h-8 object-contain flex-shrink-0"
                />
                <div className={`
                  rounded-2xl px-4 py-2
                  ${theme === 'dark' ? 'bg-stone-800' : 'bg-stone-100'}
                `}>
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className={`
          p-4 border-t
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
              placeholder="Écris ton message à Glowee..."
              disabled={isLoading}
              className={`
                flex-1
                ${theme === 'dark'
                  ? 'bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-500'
                  : 'bg-stone-50 border-stone-200 text-stone-900 placeholder:text-stone-400'
                }
              `}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
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

