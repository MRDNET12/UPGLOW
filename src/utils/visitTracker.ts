// Système de tracking des visites pour les popups Glowee

export type SectionName = 'app' | 'home' | 'planning' | 'goals' | 'energy' | 'journal';

interface VisitData {
  count: number;
  firstVisit: string;
  lastVisit: string;
  hasSeenWelcome: boolean;
}

const STORAGE_KEY = 'glowee_visits';

// Récupérer les données de visite
export function getVisitData(): Record<SectionName, VisitData> {
  if (typeof window === 'undefined') return getDefaultVisitData();
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return getDefaultVisitData();
  
  try {
    return JSON.parse(stored);
  } catch {
    return getDefaultVisitData();
  }
}

// Données par défaut
function getDefaultVisitData(): Record<SectionName, VisitData> {
  const now = new Date().toISOString();
  return {
    app: { count: 0, firstVisit: now, lastVisit: now, hasSeenWelcome: false },
    home: { count: 0, firstVisit: now, lastVisit: now, hasSeenWelcome: false },
    planning: { count: 0, firstVisit: now, lastVisit: now, hasSeenWelcome: false },
    goals: { count: 0, firstVisit: now, lastVisit: now, hasSeenWelcome: false },
    energy: { count: 0, firstVisit: now, lastVisit: now, hasSeenWelcome: false },
    journal: { count: 0, firstVisit: now, lastVisit: now, hasSeenWelcome: false },
  };
}

// Enregistrer une visite
export function trackVisit(section: SectionName): VisitData {
  const data = getVisitData();
  const now = new Date().toISOString();
  
  if (!data[section]) {
    data[section] = {
      count: 1,
      firstVisit: now,
      lastVisit: now,
      hasSeenWelcome: false,
    };
  } else {
    data[section].count += 1;
    data[section].lastVisit = now;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data[section];
}

// Marquer le popup de bienvenue comme vu
export function markWelcomeSeen(section: SectionName): void {
  const data = getVisitData();
  if (data[section]) {
    data[section].hasSeenWelcome = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

// Vérifier si c'est la première visite
export function isFirstVisit(section: SectionName): boolean {
  const data = getVisitData();
  return data[section]?.count === 0 || !data[section]?.hasSeenWelcome;
}

// Vérifier si c'est la 5ème visite de l'app
export function isFifthAppVisit(): boolean {
  const data = getVisitData();
  return data.app?.count === 5;
}

// Obtenir le nombre de visites
export function getVisitCount(section: SectionName): number {
  const data = getVisitData();
  return data[section]?.count || 0;
}

// Hook React pour tracker automatiquement les visites
export function useVisitTracker(section: SectionName) {
  if (typeof window === 'undefined') return { isFirst: false, count: 0, isFifth: false };
  
  const visitData = trackVisit(section);
  const isFirst = !visitData.hasSeenWelcome;
  const isFifth = section === 'app' && visitData.count === 5;
  
  return {
    isFirst,
    count: visitData.count,
    isFifth,
    markSeen: () => markWelcomeSeen(section),
  };
}

