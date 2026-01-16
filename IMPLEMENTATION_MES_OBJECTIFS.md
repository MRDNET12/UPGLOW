# 🎯 Implémentation - Section "Mes Objectifs"

## ✅ Ce Qui a Été Créé

### 📁 Structure des Fichiers

```
src/
├── types/
│   └── goals.ts                          # Types TypeScript complets
├── lib/
│   └── firebase/
│       └── goals-service.ts              # Services Firestore
├── components/
│   └── goals/
│       ├── MyGoals.tsx                   # Page principale
│       ├── EnergyCheckIn.tsx             # Check-in énergie (5h)
│       ├── EnergyHistory.tsx             # Graphique historique
│       ├── CreateGoal.tsx                # Création d'objectif (5 étapes)
│       └── GoalBreakdownView.tsx         # Affichage découpage IA
└── app/
    └── api/
        └── glowee-work/
            └── route.ts                  # API Glowee Work (IA découpage)
```

---

## 🗄️ Collections Firestore

### 1. `goals` - Objectifs
```typescript
{
  id: string,
  userId: string,
  type: 'financial' | 'project' | 'personal',
  name: string,
  targetAmount?: number,
  targetDate: string,
  timeframe?: number,
  competencies?: string[],
  why: string,
  desiredFeeling: string,
  status: 'active' | 'completed' | 'archived',
  progress: number,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. `energy_logs` - Check-ins Énergie
```typescript
{
  id: string,
  userId: string,
  energyLevel: number, // 0-100
  mentalState: 'calm' | 'stressed' | 'motivated' | 'tired',
  physicalState: 'fit' | 'tired' | 'sick' | 'energetic',
  timestamp: Date,
  skipped: boolean
}
```

### 3. `goal_breakdown` - Découpage IA
```typescript
{
  id: string,
  goalId: string,
  userId: string,
  level: 'year' | 'quarter' | 'month' | 'week' | 'day',
  period: string,
  title: string,
  description: string,
  tasks: string[],
  milestones?: string[],
  generatedByAI: boolean,
  modifiedByUser: boolean,
  aiExplanation?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. `tasks` - Tâches Quotidiennes
```typescript
{
  id: string,
  goalId: string,
  userId: string,
  title: string,
  description: string,
  date: string,
  completed: boolean,
  completedAt?: Date,
  generatedByAI: boolean,
  modifiedByUser: boolean,
  plannedTime?: string,
  estimatedDuration?: number,
  energyRequired?: 'low' | 'medium' | 'high',
  createdAt: Date,
  updatedAt: Date
}
```

### 5. `ai_logs` - Apprentissage IA
```typescript
{
  id: string,
  userId: string,
  goalId?: string,
  taskId?: string,
  action: 'task_completed' | 'task_skipped' | 'task_modified' | 'energy_low' | 'goal_created' | 'breakdown_generated',
  context: object,
  aiResponse?: string,
  aiModel: 'glowee' | 'glowee-work',
  timestamp: Date
}
```

---

## 🤖 Les 2 IA

### 1. **Glowee** (IA Générale)
- **Fichier** : `src/app/api/chat/route.ts`
- **Rôle** : Aide aux habitudes quotidiennes et glow up général
- **Modèle** : `grok-beta`
- **Prompt** : Bienveillante, encourageante, cheerleader

### 2. **Glowee Work** (IA Objectifs)
- **Fichier** : `src/app/api/glowee-work/route.ts`
- **Rôle** : Découpage intelligent des objectifs
- **Modèle** : `grok-beta`
- **Prompt** : Stratégique, coach, orientée résultats

---

## 🔄 Flow Utilisateur Complet

```
1. Ouverture de "Mes Objectifs"
   ↓
2. {Si > 5h depuis dernier check-in}
   → Popup Check-in Énergie (10s max)
   → Bouton "Passer" disponible
   ↓
3. Page principale "Mes Objectifs"
   → Affiche 0-3 objectifs actifs
   → Bouton "Créer" si < 3 objectifs
   ↓
4. Création d'objectif (5 étapes)
   Étape 1: Type (Financier/Projet/Personnel)
   Étape 2: Nom de l'objectif
   Étape 3: Questions adaptées au type
   Étape 4: Pourquoi ?
   Étape 5: Ressenti recherché
   ↓
5. Objectif créé → Sauvegardé dans Firestore
   ↓
6. Clic sur "Voir détails"
   → Affichage de l'objectif
   → Bouton "Demander à Glowee Work de découper"
   ↓
7. Appel API Glowee Work
   → Analyse de l'objectif
   → Prise en compte de l'énergie moyenne
   → Génération du découpage (Année → Trimestre → Mois)
   ↓
8. Affichage du découpage
   → Phases (Apprentissage, Lancement, Optimisation, Scale)
   → Trimestres avec jalons
   → Mois avec tâches
   → Bouton "Modifier" (éditable)
   → Bouton "Planifier les tâches"
   ↓
9. Planification automatique
   → Transformation des tâches en événements
   → Ajout à "Mon Planning" (section Glowee Tâches)
   → Adaptation selon l'énergie
   ↓
10. Suivi et apprentissage
    → Tâches complétées/ignorées enregistrées
    → Glowee Work apprend et adapte
    → Prochaines recommandations ajustées
```

---

## 🎨 Composants Créés

### 1. `MyGoals.tsx` - Page Principale
- Affiche les 3 objectifs actifs
- Bouton "Créer un objectif" (si < 3)
- Bouton "Énergie" pour voir l'historique
- Gestion du check-in automatique (5h)

### 2. `EnergyCheckIn.tsx` - Check-in Énergie
- Slider énergie (0-100)
- Sélection état mental (4 options)
- Sélection état physique (4 options)
- Bouton "Passer" toujours visible
- Temps : 10 secondes max
- Sauvegarde dans `energy_logs`

### 3. `EnergyHistory.tsx` - Historique Énergie
- Graphique des 7 derniers jours
- Moyenne hebdomadaire
- Insights automatiques
- États mental/physique fréquents

### 4. `CreateGoal.tsx` - Création d'Objectif
- 5 étapes guidées
- Questions adaptées au type
- Validation progressive
- Sauvegarde dans `goals`

### 5. `GoalBreakdownView.tsx` - Découpage IA
- Affichage des phases
- Trimestres expandables
- Mois expandables
- Bouton "Modifier"
- Bouton "Planifier les tâches"

---

## 🔧 Services Firestore

### Fonctions Créées

#### Goals
- `createGoal()` - Créer un objectif
- `getActiveGoals()` - Récupérer les objectifs actifs
- `getGoalById()` - Récupérer un objectif par ID
- `updateGoal()` - Mettre à jour un objectif
- `updateGoalProgress()` - Mettre à jour la progression
- `archiveGoal()` - Archiver un objectif

#### Energy Logs
- `createEnergyLog()` - Créer un check-in
- `getRecentEnergyLogs()` - Récupérer les logs récents
- `getLastEnergyLog()` - Récupérer le dernier log
- `getAverageEnergy()` - Calculer la moyenne d'énergie

#### Breakdown
- `createBreakdown()` - Créer un découpage
- `getGoalBreakdown()` - Récupérer le découpage d'un objectif

#### Tasks
- `createTask()` - Créer une tâche
- `getTasksByGoal()` - Récupérer les tâches d'un objectif
- `getTasksByDate()` - Récupérer les tâches d'une date
- `completeTask()` - Marquer une tâche comme complétée
- `updateTask()` - Mettre à jour une tâche
- `deleteTask()` - Supprimer une tâche

#### AI Logs
- `createAILog()` - Créer un log IA
- `getAILogs()` - Récupérer les logs IA

---

**Suite dans le prochain fichier...**

