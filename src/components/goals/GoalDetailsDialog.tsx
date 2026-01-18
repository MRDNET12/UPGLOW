'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, FileText, Target, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Goal {
  id: string;
  name: string;
  type: 'financial' | 'personal';
  description: string;
  deadline: string;
  progress: number;
  createdAt: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  category: 'plan' | 'insight' | 'recommendation';
  timestamp: string;
}

interface GoalDetailsDialogProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GoalDetailsDialog({ goal, isOpen, onClose }: GoalDetailsDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Charger les messages et notes depuis localStorage
  useEffect(() => {
    if (goal) {
      const savedMessages = localStorage.getItem(`goal_messages_${goal.id}`);
      const savedNotes = localStorage.getItem(`goal_notes_${goal.id}`);
      
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Message de bienvenue initial
        setMessages([{
          id: '1',
          role: 'assistant',
          content: `Salut ! 👋 Je suis Glowee Work, ta coach pour atteindre ton objectif "${goal.name}". Comment puis-je t'aider aujourd'hui ?`,
          timestamp: new Date().toISOString()
        }]);
      }
      
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    }
  }, [goal]);

  // Sauvegarder les messages dans localStorage
  useEffect(() => {
    if (goal && messages.length > 0) {
      localStorage.setItem(`goal_messages_${goal.id}`, JSON.stringify(messages));
    }
  }, [messages, goal]);

  // Sauvegarder les notes dans localStorage
  useEffect(() => {
    if (goal && notes.length > 0) {
      localStorage.setItem(`goal_notes_${goal.id}`, JSON.stringify(notes));
    }
  }, [notes, goal]);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !goal) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // TODO: Appeler l'API Glowee Work pour obtenir une réponse
      // Pour l'instant, simulons une réponse
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Je comprends ta question sur "${inputMessage}". Laisse-moi t'aider avec ça ! 💡`,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Ajouter une note automatiquement
        const newNote: Note = {
          id: Date.now().toString(),
          title: 'Discussion du ' + new Date().toLocaleDateString('fr-FR'),
          content: `Question posée : ${inputMessage}`,
          category: 'insight',
          timestamp: new Date().toISOString()
        };
        
        setNotes(prev => [...prev, newNote]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  if (!goal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-rose-400" />
            <div>
              <h2 className="text-xl font-bold">{goal.name}</h2>
              <p className="text-sm text-stone-500">Discute avec Glowee Work</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Contenu principal - Split layout */}
        <div className="flex h-full overflow-hidden">
          {/* Partie gauche - Chat */}
          <div className="flex-1 flex flex-col border-r">
            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-white'
                          : 'bg-stone-100 text-stone-900'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-4 h-4 text-rose-400" />
                          <span className="text-xs font-semibold text-rose-500">Glowee Work</span>
                        </div>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-stone-500'}`}>
                        {new Date(message.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-stone-100 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />
                        <span className="text-sm text-stone-600">Glowee réfléchit...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Pose une question à Glowee Work..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Partie droite - Notes et Plans */}
          <div className="w-96 flex flex-col bg-stone-50">
            <div className="p-6 border-b bg-white">
              <h3 className="font-semibold text-stone-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-400" />
                Notes & Plans
              </h3>
              <p className="text-xs text-stone-500 mt-1">Mis à jour automatiquement</p>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {notes.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                    <p className="text-sm text-stone-500">Aucune note pour le moment</p>
                    <p className="text-xs text-stone-400 mt-1">Les notes apparaîtront au fur et à mesure de vos discussions</p>
                  </div>
                ) : (
                  notes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-4 rounded-xl border-2 ${
                        note.category === 'plan'
                          ? 'bg-blue-50 border-blue-200'
                          : note.category === 'insight'
                          ? 'bg-purple-50 border-purple-200'
                          : 'bg-green-50 border-green-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm text-stone-900">{note.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          note.category === 'plan'
                            ? 'bg-blue-100 text-blue-700'
                            : note.category === 'insight'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {note.category === 'plan' ? '📋 Plan' : note.category === 'insight' ? '💡 Insight' : '✨ Conseil'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-700">{note.content}</p>
                      <p className="text-xs text-stone-400 mt-2">
                        {new Date(note.timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


