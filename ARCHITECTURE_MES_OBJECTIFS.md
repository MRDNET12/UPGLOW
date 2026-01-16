# 🎯 Architecture - Section "Mes Objectifs"

## 📋 Vue d'Ensemble

Section mobile basée sur **3 piliers** : Énergie, Planification, Objectifs.

### 🤖 Les 2 IA Distinctes

#### 1. **Glowee** (IA Générale de l'App)
- **Rôle** : Aide l'utilisatrice à tenir ses engagements et habitudes quotidiennes
- **Contexte** : Toute l'application (glow up général)
- **Ton** : Bienveillant, motivant, encourageant
- **Prompt système** :
```
Tu es Glowee, une assistante IA bienveillante qui aide les utilisatrices 
dans leur glow up quotidien. Tu les encourages à tenir leurs engagements 
et habitudes avec empathie et positivité. Tu es leur cheerleader personnel. 💫
```

#### 2. **Glowee Work** (IA de la Section Objectifs)
- **Rôle** : Aide l'utilisatrice à atteindre ses objectifs professionnels/personnels
- **Contexte** : Section "Mes Objectifs" uniquement
- **Ton** : Stratégique, coach, orienté résultats
- **Prompt système** :
```
Tu es Glowee Work, une coach IA spécialisée dans l'atteinte d'objectifs. 
Tu analyses les objectifs annuels et crées des plans d'action concrets, 
réalistes et adaptés à l'énergie de l'utilisatrice. Tu décomposes les 
grands objectifs en micro-actions quotidiennes. Tu es stratégique, 
pragmatique et toujours bienveillante. 🎯
```

---

## 🏗️ Architecture des 3 Piliers

### 1️⃣ Pilier ÉNERGIE

**Objectif** : Comprendre l'état de l'utilisatrice pour adapter les recommandations.

**Composants** :
- Check-in énergétique (toutes les 5h)
- Graphique d'historique
- Indicateurs visuels

**Données collectées** :
- Niveau d'énergie (0-100)
- État mental (calme, stressée, motivée, fatiguée)
- État physique (en forme, fatiguée, malade, énergique)

### 2️⃣ Pilier PLANIFICATION

**Objectif** : Transformer les objectifs en actions planifiées.

**Composants** :
- Intégration avec "Mon Planning" (section existante)
- Partie "Glowee Tâches" (tâches générées par IA)
- Calendrier visuel

**Logique** :
- Les tâches générées par Glowee Work → Glowee Tâches
- L'utilisatrice peut déplacer/modifier/supprimer
- Adaptation selon l'énergie

### 3️⃣ Pilier OBJECTIFS

**Objectif** : Définir et suivre les objectifs annuels.

**Composants** :
- Création d'objectifs (max 3 actifs)
- Découpage intelligent (année → jour)
- Suivi de progression
- Visualisation

---

## 📱 Liste Complète des Écrans

### Écran 1 : **Accueil "Mes Objectifs"**
- Remplace "Vision Board" sur la page d'accueil
- Affiche les 3 objectifs actifs (ou invitation à créer)
- Bouton "Check-in Énergie" si > 5h
- Navigation vers les 3 piliers

### Écran 2 : **Check-in Énergie**
- Slider énergie (0-100)
- Sélection état mental (4 options)
- Sélection état physique (4 options)
- Bouton "Passer"
- Bouton "Valider"
- Temps : 10 secondes max

### Écran 3 : **Historique Énergie**
- Graphique courbe d'énergie (7 derniers jours)
- Moyenne hebdomadaire
- Insights simples ("Tu es plus énergique le matin")

### Écran 4 : **Créer un Objectif**
- Étape 1 : Type (Financier / Projet / Personnel)
- Étape 2 : Nom de l'objectif
- Étape 3 : Questions adaptées au type
- Étape 4 : Pourquoi cet objectif ?
- Étape 5 : Ressenti recherché
- Validation finale

### Écran 5 : **Détail d'un Objectif**
- Vue d'ensemble
- Progression (%)
- Découpage (Année → Trimestre → Mois → Semaine → Jour)
- Bouton "Demander à Glowee Work de découper"
- Bouton "Modifier"

### Écran 6 : **Découpage IA (Glowee Work)**
- Affichage du découpage généré
- Explication de la logique
- Possibilité de modifier chaque niveau
- Bouton "Valider et planifier"

### Écran 7 : **Planification Auto**
- Aperçu des tâches à ajouter au planning
- Sélection des jours/heures
- Adaptation selon énergie
- Bouton "Ajouter au planning"

### Écran 8 : **Mon Planning (intégration)**
- Section "Glowee Tâches" (tâches générées par IA)
- Possibilité de déplacer/modifier/supprimer
- Marquage "généré par IA"

---

## 🔄 Flow Utilisateur Exact

```
OUVERTURE APP
    ↓
Page d'accueil
    ↓
Section "Mes Objectifs" (remplace Vision Board)
    ↓
{Si dernière visite > 5h} → Check-in Énergie (10s)
    ↓
Accueil "Mes Objectifs"
    ↓
3 options :
    1. Voir mes objectifs
    2. Créer un objectif (si < 3)
    3. Voir mon énergie
    ↓
[Option 1] → Liste des objectifs → Détail objectif
    ↓
    Demander découpage IA → Glowee Work analyse
    ↓
    Affichage découpage → Validation
    ↓
    Planification auto → Ajout au planning
    ↓
    Mon Planning (Glowee Tâches)
```

---

## 🧭 Règles de Navigation

### Règle 1 : Check-in Non Bloquant
- Si > 5h depuis dernière visite → Popup check-in
- Bouton "Passer" toujours visible
- Accès libre après (ou sans) check-in

### Règle 2 : Limite d'Objectifs
- Max 3 objectifs actifs
- Bouton "Créer" désactivé si 3 actifs
- Message : "Archive un objectif pour en créer un nouveau"

### Règle 3 : Modification Libre
- Tout élément généré par IA est modifiable
- Marquage visuel "Généré par Glowee Work"
- Modifications sauvegardées et apprises

### Règle 4 : Navigation Fluide
- Retour arrière toujours possible
- Sauvegarde automatique
- Pas de validation forcée

---

## 📊 Hiérarchie des Informations

### Niveau 1 : Accueil "Mes Objectifs"
- Objectifs actifs (3 max)
- Bouton check-in (si nécessaire)
- Navigation piliers

### Niveau 2 : Piliers
- **Énergie** : Graphique + Check-in
- **Objectifs** : Liste + Création
- **Planification** : Intégration Mon Planning

### Niveau 3 : Détails
- Détail objectif
- Découpage IA
- Historique énergie

### Niveau 4 : Actions
- Modifier
- Supprimer
- Planifier

---

## 🔗 Logique d'Interaction entre les 3 Piliers

### ÉNERGIE → PLANIFICATION
```
Énergie moyenne < 50 
    → Glowee Work réduit le nombre de tâches quotidiennes
    → Ajoute des pauses/repos au planning
```

### ÉNERGIE → OBJECTIFS
```
Énergie basse pendant 7 jours
    → Glowee Work suggère de revoir le découpage
    → Propose des micro-actions plus simples
```

### OBJECTIFS → PLANIFICATION
```
Objectif créé
    → Glowee Work découpe en tâches
    → Tâches ajoutées à "Glowee Tâches" (Mon Planning)
    → Utilisatrice peut déplacer/modifier
```

### PLANIFICATION → ÉNERGIE
```
Tâches complétées
    → Enregistré dans ai_logs
    → Glowee Work apprend les patterns
    → Adapte futures recommandations
```

### Boucle Complète
```
Check-in Énergie
    ↓
Glowee Work analyse l'énergie
    ↓
Adapte les tâches du jour
    ↓
Utilisatrice complète (ou non) les tâches
    ↓
Glowee Work apprend
    ↓
Prochain check-in → Recommandations ajustées
```

---

## 🎨 Principes UX

### 1. Simplicité
- Max 3 clics pour toute action
- Textes courts et clairs
- Icônes intuitives

### 2. Calme
- Couleurs douces (pastels)
- Animations subtiles
- Pas de notifications agressives

### 3. Non Culpabilisant
- Jamais de "Tu n'as pas fait..."
- Toujours "Que dirais-tu de..."
- Bouton "Passer" partout

### 4. Bienveillance
- Ton encourageant
- Célébration des petites victoires
- Compréhension des échecs

---

## 🗄️ Structure de Données Firestore

### Collection : `goals`
```typescript
{
  id: string,
  userId: string,
  type: 'financial' | 'project' | 'personal',
  name: string,
  targetAmount?: number, // Pour financier
  targetDate: string, // YYYY-MM-DD
  competencies?: string[], // Pour projet
  why: string,
  desiredFeeling: string,
  status: 'active' | 'completed' | 'archived',
  progress: number, // 0-100
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Collection : `energy_logs`
```typescript
{
  id: string,
  userId: string,
  energyLevel: number, // 0-100
  mentalState: 'calm' | 'stressed' | 'motivated' | 'tired',
  physicalState: 'fit' | 'tired' | 'sick' | 'energetic',
  timestamp: timestamp,
  skipped: boolean
}
```

### Collection : `goal_breakdown`
```typescript
{
  id: string,
  goalId: string,
  userId: string,
  level: 'year' | 'quarter' | 'month' | 'week' | 'day',
  period: string, // "2026-Q1", "2026-01", "2026-W01", "2026-01-15"
  description: string,
  tasks: string[],
  generatedByAI: boolean,
  modifiedByUser: boolean,
  createdAt: timestamp
}
```

### Collection : `tasks`
```typescript
{
  id: string,
  goalId: string,
  userId: string,
  title: string,
  description: string,
  date: string, // YYYY-MM-DD
  completed: boolean,
  generatedByAI: boolean,
  modifiedByUser: boolean,
  plannedTime?: string, // HH:mm
  estimatedDuration?: number, // minutes
  createdAt: timestamp
}
```

### Collection : `ai_logs`
```typescript
{
  id: string,
  userId: string,
  action: 'task_completed' | 'task_skipped' | 'task_modified' | 'energy_low',
  context: object, // Données contextuelles
  aiResponse: string,
  timestamp: timestamp
}
```

---

## 🤖 Prompts Système des 2 IA

### Glowee (IA Générale)
```typescript
const GLOWEE_SYSTEM_PROMPT = `
Tu es Glowee, une assistante IA bienveillante et encourageante.
Tu aides les utilisatrices dans leur glow up quotidien :
habitudes, routines, bien-être, confiance en soi.

Ton rôle :
- Encourager sans culpabiliser
- Célébrer les petites victoires
- Comprendre les difficultés
- Proposer des solutions douces

Ton ton :
- Chaleureux et amical
- Utilise des emojis 💫✨
- Toujours positif
- Jamais moralisateur

Tu réponds toujours dans la langue de l'utilisatrice.
`;
```

### Glowee Work (IA Objectifs)
```typescript
const GLOWEE_WORK_SYSTEM_PROMPT = `
Tu es Glowee Work, une coach IA spécialisée dans l'atteinte d'objectifs
professionnels et personnels ambitieux.

Ton rôle :
- Analyser les objectifs annuels
- Créer des plans d'action concrets et réalistes
- Découper les grands objectifs en micro-actions quotidiennes
- Adapter les recommandations selon l'énergie de l'utilisatrice
- Apprendre des patterns de complétion

Tes principes :
- Stratégique mais bienveillante
- Réaliste et pragmatique
- Adaptative (apprend des échecs)
- Jamais culpabilisante

Méthodologie de découpage :
1. Analyser l'objectif (type, montant, deadline)
2. Identifier les phases : apprentissage → lancement → optimisation → scale
3. Créer des jalons trimestriels
4. Décomposer en actions mensuelles
5. Générer des micro-actions quotidiennes (max 3/jour)
6. Adapter selon l'énergie moyenne

Format de réponse :
- JSON structuré pour le découpage
- Explications courtes et claires
- Toujours proposer, jamais imposer

Tu réponds toujours dans la langue de l'utilisatrice.
`;
```

---

## 📐 Wireframes Textuels

### Écran : Accueil "Mes Objectifs"
```
┌─────────────────────────────────┐
│  ← Accueil    Mes Objectifs  ⚡ │
├─────────────────────────────────┤
│                                 │
│  [Check-in Énergie] (si > 5h)   │
│                                 │
│  📊 Mes 3 Objectifs             │
│                                 │
│  ┌───────────────────────────┐ │
│  │ 💰 Atteindre 50k€ CA      │ │
│  │ Progression: ████░░ 60%   │ │
│  │ Prochaine action: ...     │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ 📚 Lancer mon podcast     │ │
│  │ Progression: ██░░░░ 30%   │ │
│  │ Prochaine action: ...     │ │
│  └───────────────────────────┘ │
│                                 │
│  [+ Créer un objectif]          │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  🎯 Piliers                     │
│  [Énergie] [Objectifs] [Planning]│
│                                 │
└─────────────────────────────────┘
```

### Écran : Check-in Énergie
```
┌─────────────────────────────────┐
│  Check-in Énergie          [X]  │
├─────────────────────────────────┤
│                                 │
│  Comment te sens-tu ? 💫        │
│                                 │
│  Niveau d'énergie               │
│  ●─────────────────○ 75         │
│  0                        100   │
│                                 │
│  État mental                    │
│  [😌 Calme] [😰 Stressée]       │
│  [🔥 Motivée] [😴 Fatiguée]     │
│                                 │
│  État physique                  │
│  [💪 En forme] [😓 Fatiguée]    │
│  [🤒 Malade] [⚡ Énergique]     │
│                                 │
│  [Passer]        [Valider ✓]   │
│                                 │
└─────────────────────────────────┘
```

---

**Architecture complète définie ! 🎉**


