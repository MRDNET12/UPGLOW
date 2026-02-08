'use client';

import { useEffect, useState } from 'react';
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type TrafficSource = 
  | 'facebook' 
  | 'instagram' 
  | 'tiktok' 
  | 'pinterest' 
  | 'google' 
  | 'youtube' 
  | 'twitter' 
  | 'linkedin'
  | 'snapchat'
  | 'direct'
  | 'organic'
  | 'referral'
  | 'other';

interface TrackingData {
  source: TrafficSource;
  referrer: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  landingPage: string;
  timestamp: string;
  userAgent: string;
  converted: boolean;
  subscribed: boolean;
  subscriptionDate?: string;
}

// Liste des patterns pour détecter les sources
const SOURCE_PATTERNS: { [key: string]: TrafficSource } = {
  'facebook.com': 'facebook',
  'fb.com': 'facebook',
  'fb.watch': 'facebook',
  'instagram.com': 'instagram',
  'tiktok.com': 'tiktok',
  'pinterest.com': 'pinterest',
  'pin.it': 'pinterest',
  'google.com': 'google',
  'google.fr': 'google',
  'youtube.com': 'youtube',
  'youtu.be': 'youtube',
  'twitter.com': 'twitter',
  'x.com': 'twitter',
  't.co': 'twitter',
  'linkedin.com': 'linkedin',
  'snapchat.com': 'snapchat',
};

// Détecter la source depuis le referrer
function detectSourceFromReferrer(referrer: string): TrafficSource {
  if (!referrer) return 'direct';
  
  const referrerLower = referrer.toLowerCase();
  
  for (const [domain, source] of Object.entries(SOURCE_PATTERNS)) {
    if (referrerLower.includes(domain)) {
      return source;
    }
  }
  
  return 'referral';
}

// Parser les paramètres UTM depuis l'URL
function getUtmParams(): { source?: string; medium?: string; campaign?: string } {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  return {
    source: urlParams.get('utm_source') || undefined,
    medium: urlParams.get('utm_medium') || undefined,
    campaign: urlParams.get('utm_campaign') || undefined,
  };
}

// Hook pour tracker la source de trafic
export function useTrafficTracking() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isClient) return;
    
    const trackVisit = async () => {
      try {
        // Récupérer les paramètres UTM
        const { source: utmSource, medium: utmMedium, campaign: utmCampaign } = getUtmParams();
        
        // Récupérer le referrer
        const referrer = document.referrer || '';
        
        // Détecter la source
        let source: TrafficSource = 'direct';
        if (utmSource) {
          source = utmSource as TrafficSource;
        } else {
          source = detectSourceFromReferrer(referrer);
        }
        
        // Données de tracking
        const trackingData: TrackingData = {
          source,
          referrer: referrer.substring(0, 500),
          utmSource: utmSource || undefined,
          utmMedium: utmMedium || undefined,
          utmCampaign: utmCampaign || undefined,
          landingPage: window.location.pathname,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent.substring(0, 200),
          converted: false,
          subscribed: false,
        };
        
        // Stocker dans sessionStorage pour lier à l'utilisateur après inscription
        sessionStorage.setItem('traffic_source', JSON.stringify(trackingData));
        
        // Enregistrer la visite dans Firebase
        if (db) {
          const today = new Date().toISOString().split('T')[0];
          const visitRef = doc(db, 'traffic_visits', `${today}_${Date.now()}`);
          
          await setDoc(visitRef, {
            ...trackingData,
            date: today,
          });
          
          // Incrémenter le compteur global pour aujourd'hui
          const statsRef = doc(db, 'traffic_stats', today);
          await setDoc(statsRef, {
            date: today,
            [source]: increment(1),
            total: increment(1),
          }, { merge: true });
        }
        
        console.log('[Traffic Tracking] Source detected:', source);
      } catch (error) {
        console.error('[Traffic Tracking] Error:', error);
      }
    };
    
    trackVisit();
  }, [isClient]);
}

// Fonction pour lier le tracking à un utilisateur après inscription
export async function linkTrackingToUser(userId: string): Promise<void> {
  try {
    const trackingData = sessionStorage.getItem('traffic_source');
    if (!trackingData || !db) return;
    
    const data: TrackingData = JSON.parse(trackingData);
    
    // Mettre à jour les stats comme converti
    const today = new Date().toISOString().split('T')[0];
    const statsRef = doc(db, 'traffic_stats', today);
    
    await updateDoc(statsRef, {
      [`${data.source}_converted`]: increment(1),
      total_converted: increment(1),
    });
    
    // Sauvegarder la source dans le profil utilisateur
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      trafficSource: data.source,
      trafficSourceDetails: {
        referrer: data.referrer,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        landingPage: data.landingPage,
        firstVisitDate: data.timestamp,
      },
    });
    
    // Supprimer du sessionStorage
    sessionStorage.removeItem('traffic_source');
    
    console.log('[Traffic Tracking] Linked to user:', userId, 'Source:', data.source);
  } catch (error) {
    console.error('[Traffic Tracking] Error linking to user:', error);
  }
}

// Fonction pour tracker un abonnement
export async function trackSubscription(userId: string, planType: string): Promise<void> {
  try {
    if (!db) return;
    
    // Récupérer les infos utilisateur
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) return;
    
    const userData = userDoc.data();
    const source = userData.trafficSource || 'unknown';
    
    // Mettre à jour les stats d'abonnement
    const today = new Date().toISOString().split('T')[0];
    const statsRef = doc(db, 'traffic_stats', today);
    
    await setDoc(statsRef, {
      [`${source}_subscribed`]: increment(1),
      [`${source}_${planType}`]: increment(1),
      total_subscribed: increment(1),
    }, { merge: true });
    
    // Mettre à jour le profil utilisateur
    await updateDoc(userRef, {
      'trafficSourceDetails.subscribed': true,
      'trafficSourceDetails.subscriptionDate': new Date().toISOString(),
      'trafficSourceDetails.planType': planType,
    });
    
    console.log('[Traffic Tracking] Subscription tracked:', source, planType);
  } catch (error) {
    console.error('[Traffic Tracking] Error tracking subscription:', error);
  }
}
