'use client';

import { useState, useEffect } from 'react';

export function useOfflineMode() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        // L'utilisateur revient en ligne
        console.log('🌐 Back online!');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      console.log('📴 Gone offline - switching to offline mode');
    };

    // Vérifier l'état initial
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return { isOnline, wasOffline };
}

// Hook pour stocker des données localement
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      setIsLoaded(true);
    }
  }, [key]);

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue, isLoaded];
}

// Fonction pour mettre en file d'attente les actions à synchroniser
export function queueForSync(action: string, data: any) {
  const queue = JSON.parse(localStorage.getItem('offline_sync_queue') || '[]');
  queue.push({
    action,
    data,
    timestamp: Date.now(),
    id: Date.now().toString(),
  });
  localStorage.setItem('offline_sync_queue', JSON.stringify(queue));
}

// Fonction pour récupérer la file d'attente
export function getSyncQueue() {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('offline_sync_queue') || '[]');
}

// Fonction pour vider la file d'attente
export function clearSyncQueue() {
  localStorage.removeItem('offline_sync_queue');
}

// Fonction pour supprimer un item de la file
export function removeFromSyncQueue(id: string) {
  const queue = getSyncQueue();
  const filtered = queue.filter((item: any) => item.id !== id);
  localStorage.setItem('offline_sync_queue', JSON.stringify(filtered));
}
