# 📊 API - Données d'Énergie

## 🎯 Objectif

Exposer les données du check-in énergie aux autres modules (IA, Planning, Objectifs) pour personnaliser l'expérience utilisateur.

---

## 📦 Accès aux Données

### 1. **Récupérer les Logs d'Énergie**

```typescript
// Récupérer tous les logs
const energyLogs = JSON.parse(localStorage.getItem('energyLogs') || '[]');

// Type EnergyLog
interface EnergyLog {
  level: number;              // 0-100 (affiché comme 0-10 * 10)
  timestamp: string;          // ISO 8601
  mentalState?: string;       // 'calm' | 'stressed' | 'motivated' | 'tired'
  physicalState?: string;     // 'energetic' | 'fit' | 'tired' | 'sick'
  skipped?: boolean;          // true si check-in passé
}
```

### 2. **Récupérer le Dernier Check-in**

```typescript
function getLastEnergyLog(): EnergyLog | null {
  const logs = JSON.parse(localStorage.getItem('energyLogs') || '[]');
  return logs.length > 0 ? logs[logs.length - 1] : null;
}

// Exemple d'utilisation
const lastLog = getLastEnergyLog();
if (lastLog && !lastLog.skipped) {
  console.log(`Énergie: ${lastLog.level}%`);
  console.log(`Mental: ${lastLog.mentalState}`);
  console.log(`Physique: ${lastLog.physicalState}`);
}
```

### 3. **Calculer la Moyenne d'Énergie**

```typescript
function getAverageEnergy(days: number = 7): number {
  const logs = JSON.parse(localStorage.getItem('energyLogs') || '[]');
  
  // Filtrer les logs des X derniers jours
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const recentLogs = logs.filter((log: EnergyLog) => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && !log.skipped;
  });
  
  if (recentLogs.length === 0) return 50; // Valeur par défaut
  
  const sum = recentLogs.reduce((acc: number, log: EnergyLog) => acc + log.level, 0);
  return Math.round(sum / recentLogs.length);
}

// Exemple d'utilisation
const avgEnergy = getAverageEnergy(7); // Moyenne sur 7 jours
console.log(`Moyenne d'énergie: ${avgEnergy}%`);
```

### 4. **Analyser les Tendances**

```typescript
function getEnergyTrend(): 'increasing' | 'decreasing' | 'stable' {
  const logs = JSON.parse(localStorage.getItem('energyLogs') || '[]');
  
  if (logs.length < 2) return 'stable';
  
  const recentLogs = logs.slice(-5).filter((log: EnergyLog) => !log.skipped);
  if (recentLogs.length < 2) return 'stable';
  
  const firstHalf = recentLogs.slice(0, Math.floor(recentLogs.length / 2));
  const secondHalf = recentLogs.slice(Math.floor(recentLogs.length / 2));
  
  const avgFirst = firstHalf.reduce((acc: number, log: EnergyLog) => acc + log.level, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((acc: number, log: EnergyLog) => acc + log.level, 0) / secondHalf.length;
  
  const diff = avgSecond - avgFirst;
  
  if (diff > 10) return 'increasing';
  if (diff < -10) return 'decreasing';
  return 'stable';
}

// Exemple d'utilisation
const trend = getEnergyTrend();
console.log(`Tendance: ${trend}`);
```

---

## 🤖 Utilisation par l'IA Glowee Work

### 1. **Adapter les Tâches selon l'Énergie**

```typescript
function adaptTasksToEnergy(tasks: Task[]): Task[] {
  const lastLog = getLastEnergyLog();
  
  if (!lastLog || lastLog.skipped) return tasks;
  
  const energyLevel = lastLog.level;
  
  // Si énergie basse (< 40%), prioriser les tâches légères
  if (energyLevel < 40) {
    return tasks.filter(task => task.priority === 'low' || task.category === 'easy');
  }
  
  // Si énergie haute (> 70%), proposer des tâches exigeantes
  if (energyLevel > 70) {
    return tasks.filter(task => task.priority === 'high' || task.category === 'challenging');
  }
  
  // Énergie moyenne : mix équilibré
  return tasks;
}
```

### 2. **Messages Personnalisés**

```typescript
function getPersonalizedMessage(): string {
  const lastLog = getLastEnergyLog();
  
  if (!lastLog || lastLog.skipped) {
    return "Prête à briller aujourd'hui ? ✨";
  }
  
  const { level, mentalState, physicalState } = lastLog;
  
  // Énergie basse
  if (level < 40) {
    return "Prends soin de toi aujourd'hui. Commence par des petites tâches douces 💕";
  }
  
  // Stressée
  if (mentalState === 'stressed') {
    return "Je vois que tu es stressée. Que dirais-tu de commencer par une tâche relaxante ? 🌸";
  }
  
  // Motivée et énergique
  if (mentalState === 'motivated' && level > 70) {
    return "Tu es au top ! C'est le moment parfait pour les tâches importantes 🔥";
  }
  
  // Fatiguée
  if (physicalState === 'tired') {
    return "Tu sembles fatiguée. Concentre-toi sur l'essentiel aujourd'hui 💫";
  }
  
  return "Belle journée à toi ! 🌟";
}
```

---

## 📅 Utilisation dans le Planning

### Suggestions de Tâches Adaptées

```typescript
function suggestTasksForToday(): Task[] {
  const lastLog = getLastEnergyLog();
  const allTasks = getGloweeTasks(); // Récupérer toutes les tâches
  
  if (!lastLog || lastLog.skipped) {
    return allTasks.slice(0, 5); // Par défaut, 5 tâches
  }
  
  const { level, mentalState, physicalState } = lastLog;
  
  // Filtrer selon l'énergie
  let suggestedTasks = allTasks;
  
  if (level < 40 || physicalState === 'tired' || physicalState === 'sick') {
    // Tâches légères uniquement
    suggestedTasks = allTasks.filter(task => 
      task.priority === 'low' && 
      (task.estimatedDuration || 30) <= 30
    );
  } else if (level > 70 && mentalState === 'motivated') {
    // Tâches importantes
    suggestedTasks = allTasks.filter(task => task.priority === 'high');
  }
  
  return suggestedTasks.slice(0, 5);
}
```

---

## 🎯 Utilisation dans les Objectifs

### Ajuster la Progression

```typescript
function adjustGoalProgress(goalId: string): void {
  const avgEnergy = getAverageEnergy(7);
  const trend = getEnergyTrend();
  
  // Si énergie en baisse, suggérer de ralentir
  if (trend === 'decreasing' && avgEnergy < 50) {
    console.log("💡 Suggestion: Prends le temps de te reposer. Ton objectif peut attendre quelques jours.");
  }
  
  // Si énergie en hausse, encourager
  if (trend === 'increasing' && avgEnergy > 60) {
    console.log("🔥 Tu es sur une bonne lancée ! Continue comme ça !");
  }
}
```

---

## 📊 Exemples d'Insights

```typescript
function getEnergyInsights(): string[] {
  const logs = JSON.parse(localStorage.getItem('energyLogs') || '[]');
  const insights: string[] = [];
  
  // Analyse des états mentaux
  const mentalStates = logs.filter((log: EnergyLog) => !log.skipped).map((log: EnergyLog) => log.mentalState);
  const mostCommonMental = getMostCommon(mentalStates);
  
  if (mostCommonMental === 'stressed') {
    insights.push("Tu sembles souvent stressée. Pense à intégrer des moments de détente 🧘‍♀️");
  }
  
  // Analyse de l'énergie
  const avgEnergy = getAverageEnergy(7);
  if (avgEnergy < 50) {
    insights.push("Ton énergie est basse ces derniers jours. Prends soin de toi 💕");
  }
  
  return insights;
}
```

---

## 🔧 Fonctions Utilitaires

```typescript
function getMostCommon(arr: string[]): string | null {
  if (arr.length === 0) return null;
  
  const counts: Record<string, number> = {};
  arr.forEach(item => {
    counts[item] = (counts[item] || 0) + 1;
  });
  
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}
```

