'use client';

import { useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

export function useInstallTracking() {
  const { user } = useAuth();

  useEffect(() => {
    const trackInstall = async () => {
      if (!db || !user) return;

      try {
        // Vérifier si cette installation est déjà trackée
        const installsRef = collection(db, 'installs');
        const q = query(installsRef, where('userId', '==', user.uid));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          // Détecter la plateforme
          const userAgent = navigator.userAgent.toLowerCase();
          const isAndroid = /android/.test(userAgent);
          const isIOS = /iphone|ipad|ipod/.test(userAgent);
          const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator as any).standalone === true;

          // Enregistrer l'installation
          await addDoc(installsRef, {
            userId: user.uid,
            userEmail: user.email,
            platform: isAndroid ? 'android' : isIOS ? 'ios' : 'web',
            isPWA: isPWA,
            userAgent: navigator.userAgent,
            timestamp: serverTimestamp(),
            screenWidth: window.screen.width,
            screenHeight: window.screen.height
          });

          console.log('[Install Tracking] Installation tracked:', {
            platform: isAndroid ? 'android' : isIOS ? 'ios' : 'web',
            isPWA
          });
        }
      } catch (error) {
        console.error('[Install Tracking] Error:', error);
      }
    };

    // Attendre un peu pour s'assurer que tout est chargé
    const timer = setTimeout(trackInstall, 3000);
    return () => clearTimeout(timer);
  }, [user]);
}

export default useInstallTracking;
