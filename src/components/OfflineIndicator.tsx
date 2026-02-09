'use client';

import { useOfflineMode } from '@/hooks/useOfflineMode';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

export function OfflineIndicator() {
  const { isOnline, wasOffline } = useOfflineMode();
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    // Vérifier s'il y a des données en attente
    if (typeof window !== 'undefined') {
      const queue = JSON.parse(localStorage.getItem('offline_sync_queue') || '[]');
      setPendingCount(queue.length);
    }
  }, [isOnline]);

  useEffect(() => {
    if (isOnline && wasOffline && pendingCount > 0) {
      setShowSyncSuccess(true);
      setTimeout(() => setShowSyncSuccess(false), 3000);
    }
  }, [isOnline, wasOffline, pendingCount]);

  if (isOnline && !showSyncSuccess) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {!isOnline && (
        <div className="bg-amber-500 text-white px-4 py-3 shadow-lg flex items-center justify-center gap-2">
          <WifiOff className="w-5 h-5" />
          <span className="font-medium">Mode hors ligne</span>
          <span className="text-sm opacity-90">
            {pendingCount > 0 && `• ${pendingCount} modification${pendingCount > 1 ? 's' : ''} en attente`}
          </span>
        </div>
      )}
      
      {showSyncSuccess && (
        <div className="bg-emerald-500 text-white px-4 py-3 shadow-lg flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="font-medium">Synchronisation...</span>
        </div>
      )}
    </div>
  );
}
