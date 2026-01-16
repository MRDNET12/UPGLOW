'use client'

import { useState, useRef, useEffect } from 'react'
import { useAIChat } from '@/hooks/use-ai-chat'
import { Send, Trash2, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIChatProps {
  className?: string
  systemPrompt?: string
  placeholder?: string
  maxHeight?: string
  theme?: 'light' | 'dark'
  onClose?: () => void
}

export function AIChat({
  className = '',
  systemPrompt,
  placeholder = "Tapez votre message...",
  maxHeight = '500px',
  theme = 'light',
  onClose
}: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const sessionId = useRef(`glowee-session-${Date.now()}`)
  const { sendMessage, clearChat, isLoading, error } = useAIChat(sessionId.current)

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Bonjour ! 👋 Je suis Glowee, ton reflet bienveillant. Comment puis-je t'aider aujourd'hui ?",
        timestamp: new Date()
      }
    ])
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const userInput = input.trim()
    setInput('')

    try {
      const aiResponse = await sendMessage(userInput, systemPrompt)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      // Remove user message if error
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id))
    }
  }

  const handleClearChat = async () => {
    await clearChat()
    sessionId.current = `glowee-session-${Date.now()}`
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Bonjour ! 👋 Je suis Glowee, ton reflet bienveillant. Comment puis-je t'aider aujourd'hui ?",
        timestamp: new Date()
      }
    ])
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${
        theme === 'dark' ? 'border-stone-800' : 'border-stone-200'
      }`}>
        <div className="flex items-center gap-3">
          <img
            src="/glowee/glowee-acceuillante.webp"
            alt="Glowee"
            className="w-10 h-10 object-contain"
          />
          <div>
            <h3 className="text-lg font-semibold">Glowee</h3>
            <p className={`text-xs ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
              Ton reflet bienveillant
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearChat}
            className="w-8 h-8"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-8 h-8"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" style={{ maxHeight }}>
        <div className="space-y-4" ref={scrollRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0">
                  <img
                    src="/glowee/glowee-repond.webp"
                    alt="Glowee"
                    className="w-8 h-8 object-contain"
                  />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-white'
                    : theme === 'dark'
                      ? 'bg-stone-800 text-stone-100'
                      : 'bg-stone-100 text-stone-900'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0">
                <img
                  src="/glowee/glowee-reflechir.webp"
                  alt="Glowee"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className={`rounded-2xl px-4 py-3 ${
                theme === 'dark' ? 'bg-stone-800' : 'bg-stone-100'
              }`}>
                <Loader2 className="w-5 h-5 text-rose-400 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Error Message */}
      {error && (
        <div className={`px-4 py-2 text-sm ${
          theme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'
        }`}>
          {error}
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className={`flex gap-2 p-4 border-t ${
        theme === 'dark' ? 'border-stone-800' : 'border-stone-200'
      }`}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className={theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 hover:from-rose-500 hover:via-pink-500 hover:to-orange-400 text-white"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </form>
    </div>
  )
}


