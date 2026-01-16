# 🎯 Flux Mes Objectifs - Documentation

## 📋 Vue d'ensemble

La section **Mes Objectifs** permet aux utilisateurs de créer et suivre jusqu'à 3 objectifs actifs avec l'aide de Glowee Work (IA).

---

## 🔄 Flux Utilisateur

### 1. **Ouverture de la section Mes Objectifs**
- L'utilisateur clique sur "Mes Objectifs" dans le dashboard
- Le système vérifie automatiquement le dernier check-in d'énergie

### 2. **Vérification d'énergie (Energy Check-in)**
- **Déclenchement automatique** :
  - À la première ouverture (aucun log)
  - Toutes les 5 heures après le dernier check-in
  
- **Interface** :
  - Image de Glowee (glowee-happy.webp)
  - Slider visuel de 1 à 10 (barres colorées)
  - Question : "Comment te sens-tu en ce moment ? 💫"
  - Bouton "Valider" avec icône Sparkles

- **Stockage** :
  - Sauvegarde dans `localStorage` : `energyLogs`
  - Format : `{ level: number, timestamp: string }`

### 3. **Accès aux objectifs**
- Après le check-in, l'utilisateur accède à la liste des objectifs
- Affichage : "Mes 3 Objectifs Actifs (X/3)"
- Bouton "Énergie" en haut à droite pour voir l'historique

### 4. **Créer un objectif**

#### Étape 1 : Type d'objectif
- **3 types disponibles** :
  - 💰 **Financier** : Économiser, gagner de l'argent
  - 📚 **Projet** : Créer, construire, réaliser
  - 💖 **Personnel** : Développement, bien-être

#### Étape 2 : Détails de l'objectif
- **Nom de l'objectif** : Ex: "Économiser 5000€"
- **Description détaillée** : Textarea pour décrire l'objectif

#### Étape 3 : Date limite
- **Sélection de date** : Input type="date"
- **Message Glowee Work** :
  > "Glowee Work va analyser ton objectif. Elle va le découper en étapes et créer un plan d'action personnalisé pour toi ! 🎯"

### 5. **Analyser et générer automatiquement un découpage**
⚠️ **À implémenter** : Utiliser Grok API pour :
- Analyser l'objectif (type, description, deadline)
- Découper en étapes (année → mois → semaine → jour)
- Générer des tâches concrètes et actionnables

### 6. **Planifier dans le calendrier**
⚠️ **À implémenter** : 
- Ajouter les tâches générées dans l'onglet "Glowee tâches" du Planning
- Répartir les tâches sur les jours selon la deadline
- Permettre à l'utilisateur de modifier la planification

---

## 💾 Stockage des données

### localStorage Keys

#### `myGoals`
```json
[
  {
    "id": "1234567890",
    "name": "Économiser 5000€",
    "type": "financial",
    "description": "Pour mes vacances de rêve",
    "deadline": "2026-12-31",
    "progress": 0,
    "createdAt": "2026-01-16T10:00:00.000Z"
  }
]
```

#### `energyLogs`
```json
[
  {
    "level": 7,
    "timestamp": "2026-01-16T10:00:00.000Z"
  },
  {
    "level": 8,
    "timestamp": "2026-01-16T15:30:00.000Z"
  }
]
```

---

## 🎨 Interface Utilisateur

### Carte Objectif
```
┌─────────────────────────────────────────┐
│ 💰  Économiser 5000€        52%         │
│     Financier                           │
│                                         │
│ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░ (barre)           │
│                                         │
│ [Voir détails]    [Planning]            │
└─────────────────────────────────────────┘
```

### Historique d'énergie
```
┌─────────────────────────────────────────┐
│ Historique d'énergie                    │
│                                         │
│ 16 jan, 15:30    ▓▓▓▓▓▓▓▓░░  8/10      │
│ 16 jan, 10:00    ▓▓▓▓▓▓▓░░░  7/10      │
│ 15 jan, 18:00    ▓▓▓▓▓▓▓▓▓░  9/10      │
└─────────────────────────────────────────┘
```

---

## 🚀 Fonctionnalités implémentées

✅ **Check-in d'énergie automatique**
- Déclenchement toutes les 5h
- Interface avec slider visuel
- Historique des 5 derniers logs

✅ **Création d'objectif en 3 étapes**
- Sélection du type
- Saisie des détails
- Définition de la deadline

✅ **Affichage des objectifs**
- Liste des 3 objectifs actifs
- Barre de progression
- Icônes par type

✅ **Stockage localStorage**
- Persistance des objectifs
- Persistance des logs d'énergie

---

## 🔜 Fonctionnalités à implémenter

### 1. Analyse et découpage automatique (Grok API)
```typescript
// Appel API pour analyser l'objectif
const response = await fetch('/api/goals/analyze', {
  method: 'POST',
  body: JSON.stringify({
    goal: {
      name: goalName,
      type: goalType,
      description: goalDescription,
      deadline: goalDeadline
    }
  })
});

const { tasks } = await response.json();
// tasks = [
//   { day: 'monday', task: 'Rechercher des opportunités', priority: 'high' },
//   { day: 'tuesday', task: 'Créer un budget', priority: 'high' },
//   ...
// ]
```

### 2. Intégration avec Planning
- Ajouter les tâches dans `weeklyTasks` du store
- Afficher dans l'onglet "Glowee tâches"
- Permettre la modification/suppression

### 3. Suivi de progression
- Calculer automatiquement le % de progression
- Mettre à jour quand les tâches sont complétées
- Afficher des statistiques

### 4. Détails de l'objectif
- Vue détaillée avec toutes les tâches
- Timeline de progression
- Historique des modifications

---

## 🎯 Prochaines étapes

1. ✅ Créer le composant MyGoals sans auth
2. ✅ Implémenter le check-in d'énergie
3. ✅ Créer le formulaire de création d'objectif
4. ⏳ Implémenter l'analyse Grok API
5. ⏳ Intégrer avec le Planning (Glowee tâches)
6. ⏳ Ajouter le suivi de progression automatique

---

**Date** : 2026-01-16  
**Version** : 1.0.0  
**Status** : 🚧 En développement

