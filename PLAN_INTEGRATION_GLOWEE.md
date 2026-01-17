# 🌟 Plan d'Intégration Glowee dans Toute l'App

## 📋 Vue d'Ensemble

Glowee sera intégrée dans **TOUTES** les sections de l'app avec :
- ✅ **Popups de bienvenue** (1ère visite de chaque section)
- ✅ **Popups de félicitations** (actions complétées)
- ✅ **Popups d'encouragement** (motivation)
- ✅ **Glowee fixe** dans certaines sections
- ✅ **Popup spécial 5ème visite** de l'app

---

## 🎯 Sections à Intégrer

### 1. **Page d'Accueil (Dashboard)** 🏠

#### Popups
- **1ère visite** : Bienvenue dans Glowee
  - Image : `glowee-acceuillante.webp`
  - Nom : "Ma star"
  - Message : Présentation de l'app

- **5ème visite** : Félicitations pour la fidélité
  - Image : `glowee-felicite.webp`
  - Nom : "Ma championne"
  - Message : Fierté de la voir revenir

#### Glowee Fixe
- Coin inférieur droit (petite mascotte)
- Au clic : message d'encouragement aléatoire

---

### 2. **Planning (Routine)** 📅

#### Popups
- **1ère visite** : Explication du Planning
  - Image : `glowee-explique.webp`
  - Nom : "Ma belle"
  - Message : Comment utiliser le planning

- **Tâche complétée** : Félicitations
  - Image : `glowee-felicite.webp`
  - Nom : "Ma guerrière"
  - Message : Bravo pour la tâche

- **Toutes tâches complétées** : Super félicitations
  - Image : `glowee-felicite.webp`
  - Nom : "Ma superstar"
  - Message : Toutes les tâches terminées

- **Encouragement** (si aucune tâche cochée après 2h)
  - Image : `glowee-encouragement.webp`
  - Nom : "Ma courageuse"
  - Message : Tu peux le faire

#### Glowee Fixe
- En haut à droite du planning
- Affiche le nombre de tâches complétées

---

### 3. **Mes Objectifs** 🎯

#### Popups
- **1ère visite** : Explication des Objectifs
  - Image : `glowee-explique.webp`
  - Nom : "Ma visionnaire"
  - Message : Comment créer des objectifs

- **Objectif créé** : Félicitations
  - Image : `glowee-felicite.webp`
  - Nom : "Ma boss"
  - Message : Bravo pour l'objectif créé

- **Analyse en cours** : Patience
  - Image : `Glowee-travaille.webp`
  - Nom : "Ma patiente"
  - Message : Je travaille pour toi

- **Objectif complété** : Super félicitations
  - Image : `glowee-felicite.webp`
  - Nom : "Ma légende"
  - Message : Objectif atteint !

#### Glowee Fixe
- Dans la liste des objectifs
- Affiche le nombre d'objectifs actifs

---

### 4. **Check-in Énergie** ⚡

#### Popups
- **1ère visite** : Explication du Check-in
  - Image : `glowee-explique.webp`
  - Nom : "Ma douce"
  - Message : Importance de s'écouter

- **Check-in complété** : Félicitations
  - Image : `glowee-felicite.webp`
  - Nom : "Ma précieuse"
  - Message : Merci de prendre soin de toi

- **Énergie basse** : Encouragement doux
  - Image : `glowee-encouragement.webp`
  - Nom : "Ma chérie"
  - Message : Prends soin de toi

- **Énergie haute** : Félicitations
  - Image : `glowee-felicite.webp`
  - Nom : "Ma dynamo"
  - Message : Quelle énergie !

#### Glowee Fixe
- Dans l'historique d'énergie
- Affiche la moyenne d'énergie

---

### 5. **Journal** 📝

#### Popups
- **1ère visite** : Explication du Journal
  - Image : `glowee-journal.webp`
  - Nom : "Ma poétesse"
  - Message : Importance d'écrire

- **Entrée créée** : Félicitations
  - Image : `glowee-felicite.webp`
  - Nom : "Ma philosophe"
  - Message : Belle entrée

- **Encouragement** (si pas d'écriture depuis 3 jours)
  - Image : `glowee-encouragement.webp`
  - Nom : "Ma créative"
  - Message : Et si tu écrivais ?

#### Glowee Fixe
- En haut du journal
- Affiche le nombre d'entrées

---

## 🛠️ Composants Créés

### 1. **GloweePopup.tsx**
Composant réutilisable pour tous les popups :
- Glowee à gauche (30%)
- Contenu à droite (70%)
- Padding 20px
- Position en haut de page
- Bouton de fermeture

### 2. **visitTracker.ts**
Système de tracking des visites :
- Compte les visites par section
- Détecte la 1ère visite
- Détecte la 5ème visite de l'app
- Sauvegarde dans localStorage

### 3. **gloweeMessages.ts**
Tous les messages Glowee :
- Messages par section
- Messages par situation
- Noms flatteurs variés
- Images correspondantes

---

## 📸 Images Glowee Disponibles

1. ✅ `glowee-acceuillante.webp` - Bienvenue
2. ✅ `glowee-attend-requete.webp` - Attente
3. ✅ `glowee-decu.webp` - Déçue
4. ✅ `glowee-encouragement.webp` - Encouragement
5. ✅ `glowee-explique.webp` - Explication
6. ✅ `glowee-felicite.webp` - Félicitations
7. ✅ `glowee-journal.webp` - Journal
8. ✅ `glowee-nav-bar.webp` - Navigation
9. ✅ `glowee-reflechir.webp` - Réflexion
10. ✅ `glowee-repond.webp` - Réponse
11. ✅ `glowee-triste.webp` - Triste
12. ✅ `Glowee-travaille.webp` - Travail

---

## 🔧 Corrections à Faire

### Chemins d'Images à Vérifier
- ✅ Popup de suppression de tâche
- ✅ Tous les chemins dans MyGoals.tsx
- ✅ Tous les chemins dans Planning
- ✅ Tous les chemins dans page.tsx

**Format correct** : `/Glowee/nom-image.webp`

---

## 📝 Ordre d'Implémentation

1. ✅ Créer GloweePopup.tsx
2. ✅ Créer visitTracker.ts
3. ✅ Créer gloweeMessages.ts
4. 🔄 Intégrer dans page.tsx (Dashboard)
5. 🔄 Intégrer dans Planning
6. 🔄 Intégrer dans Mes Objectifs
7. 🔄 Intégrer dans Check-in Énergie
8. 🔄 Intégrer dans Journal
9. 🔄 Corriger tous les chemins d'images
10. 🔄 Tester toutes les intégrations

---

## ✨ Résultat Final

L'utilisatrice verra Glowee **partout** dans l'app :
- 🎉 Popups de bienvenue chaleureux
- 💪 Encouragements constants
- 🏆 Félicitations pour chaque victoire
- 💖 Noms flatteurs variés
- 🌟 Expérience personnalisée et bienveillante

**Glowee devient une vraie compagne de route ! 🌸**

