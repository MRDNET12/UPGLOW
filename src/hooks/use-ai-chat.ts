import { useState, useCallback } from 'react';

interface UseAIChatReturn {
  sendMessage: (message: string, systemPrompt?: string) => Promise<string>;
  clearChat: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useAIChat(sessionId: string): UseAIChatReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string, systemPrompt?: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          sessionId,
          systemPrompt
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get AI response');
      }

      return data.response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send message';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const clearChat = useCallback(async () => {
    try {
      await fetch(`/api/chat?sessionId=${sessionId}`, {
        method: 'DELETE'
      });
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to clear chat');
    }
  }, [sessionId]);

  return {
    sendMessage,
    clearChat,
    isLoading,
    error
  };
}

