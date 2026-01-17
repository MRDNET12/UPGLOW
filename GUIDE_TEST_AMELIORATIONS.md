# 🧪 Guide de Test - Améliorations Mes Objectifs

## 🎯 Objectif

Tester les nouvelles fonctionnalités du module Check-in Énergie et Objectifs.

---

## ✅ Tests à Effectuer

### 1. **Check-in Énergie Amélioré** ⚡

#### Test 1.1 : Déclenchement Automatique
- [ ] Ouvrir l'application
- [ ] Aller dans "Mes Objectifs"
- [ ] Vérifier que le modal de check-in s'affiche automatiquement (si > 5h depuis le dernier)

#### Test 1.2 : Étape 1 - Niveau d'Énergie
- [ ] Vérifier que le slider va de 0 à 100
- [ ] Déplacer le slider et vérifier que la valeur s'affiche correctement
- [ ] Vérifier que le bouton "Passer" est visible
- [ ] Cliquer sur "Suivant" pour passer à l'étape 2

#### Test 1.3 : Étape 2 - État Mental
- [ ] Vérifier que 4 options sont affichées (Calme, Stressée, Motivée, Fatiguée)
- [ ] Sélectionner un état mental
- [ ] Vérifier que la sélection est bien mise en surbrillance
- [ ] Vérifier que le bouton "Passer" est visible
- [ ] Cliquer sur "Suivant" pour passer à l'étape 3

#### Test 1.4 : Étape 3 - État Physique
- [ ] Vérifier que 4 options sont affichées (Énergique, En forme, Fatiguée, Malade)
- [ ] Sélectionner un état physique
- [ ] Vérifier que la sélection est bien mise en surbrillance
- [ ] Vérifier que le bouton "Passer" est visible
- [ ] Cliquer sur "Valider"

#### Test 1.5 : Option "Passer"
- [ ] Recommencer le check-in
- [ ] Cliquer sur "Passer" à l'étape 1
- [ ] Vérifier que le check-in est enregistré avec `skipped: true`
- [ ] Vérifier que le modal se ferme

#### Test 1.6 : Historique d'Énergie
- [ ] Cliquer sur le bouton "Énergie" dans Mes Objectifs
- [ ] Vérifier que le graphique s'affiche avec les barres colorées
- [ ] Vérifier que la moyenne est calculée et affichée
- [ ] Vérifier que les 5 derniers check-ins sont listés
- [ ] Vérifier que les états mental/physique sont affichés avec des tags colorés
- [ ] Vérifier que les check-ins passés sont marqués "Check-in passé"
- [ ] Survoler une barre du graphique et vérifier que le tooltip s'affiche

---

### 2. **Module Objectifs Amélioré** 🎯

#### Test 2.1 : Création d'Objectif Financier
- [ ] Cliquer sur "Créer un objectif"
- [ ] **Étape 1** : Sélectionner "Financier"
- [ ] Cliquer sur "Suivant"
- [ ] **Étape 2** : 
  - [ ] Entrer un nom (ex: "Atteindre 10 000€ de CA")
  - [ ] Entrer un chiffre d'affaires (ex: 10000)
  - [ ] Sélectionner une durée (ex: 12 mois)
  - [ ] Sélectionner un niveau de compétence (ex: Intermédiaire)
- [ ] Vérifier que le bouton "Suivant" est désactivé si un champ est vide
- [ ] Cliquer sur "Suivant"
- [ ] **Étape 3** :
  - [ ] Entrer le "Pourquoi" (ex: "Je veux être indépendante financièrement")
  - [ ] Entrer le "Ressenti recherché" (ex: "Je me sentirai fière et libre")
- [ ] Vérifier que le bouton "Suivant" est désactivé si un champ est vide
- [ ] Cliquer sur "Suivant"
- [ ] **Étape 4** :
  - [ ] Sélectionner une date limite (dans les 12 prochains mois)
  - [ ] Vérifier que le message Glowee Work s'affiche
- [ ] Cliquer sur "Analyser avec Glowee"
- [ ] **Étape 5** :
  - [ ] Vérifier que l'animation de chargement s'affiche
  - [ ] Vérifier que les tâches sont générées
  - [ ] Vérifier que les tâches sont affichées
- [ ] Cliquer sur "Créer mon objectif"
- [ ] Vérifier que l'objectif est créé et affiché dans la liste

#### Test 2.2 : Création d'Objectif Projet
- [ ] Cliquer sur "Créer un objectif"
- [ ] **Étape 1** : Sélectionner "Projet"
- [ ] Cliquer sur "Suivant"
- [ ] **Étape 2** :
  - [ ] Entrer un nom (ex: "Lancer mon e-commerce")
  - [ ] Entrer une description du projet
  - [ ] Sélectionner un niveau de compétence
- [ ] Vérifier que le bouton "Suivant" est désactivé si un champ est vide
- [ ] Continuer jusqu'à la création de l'objectif

#### Test 2.3 : Création d'Objectif Personnel
- [ ] Cliquer sur "Créer un objectif"
- [ ] **Étape 1** : Sélectionner "Personnel"
- [ ] Cliquer sur "Suivant"
- [ ] **Étape 2** :
  - [ ] Entrer un nom (ex: "Retrouver confiance en moi")
  - [ ] Entrer une description
- [ ] Vérifier que le bouton "Suivant" est désactivé si un champ est vide
- [ ] Continuer jusqu'à la création de l'objectif

#### Test 2.4 : Validation des Champs
- [ ] Tester que les champs obligatoires sont bien validés
- [ ] Tester que les boutons "Suivant" sont désactivés si les champs sont vides
- [ ] Tester que le bouton "Retour" fonctionne à chaque étape

---

### 3. **Intégration avec Planning** 📅

#### Test 3.1 : Ajout des Tâches dans Planning
- [ ] Créer un objectif complet
- [ ] Vérifier que les tâches sont ajoutées dans "Glowee tâches" du Planning
- [ ] Vérifier que les tâches sont réparties sur les 7 jours
- [ ] Vérifier que les priorités sont correctes

---

### 4. **Sauvegarde des Données** 💾

#### Test 4.1 : LocalStorage - Check-in Énergie
- [ ] Effectuer un check-in complet
- [ ] Ouvrir la console du navigateur
- [ ] Taper : `JSON.parse(localStorage.getItem('energyLogs'))`
- [ ] Vérifier que le log est bien enregistré avec tous les champs

#### Test 4.2 : LocalStorage - Objectifs
- [ ] Créer un objectif
- [ ] Ouvrir la console du navigateur
- [ ] Taper : `JSON.parse(localStorage.getItem('myGoals'))`
- [ ] Vérifier que l'objectif est bien enregistré avec tous les champs

---

## 🐛 Bugs Potentiels à Surveiller

- [ ] Le check-in ne se déclenche pas automatiquement
- [ ] Les états mental/physique ne sont pas sauvegardés
- [ ] Le graphique ne s'affiche pas correctement
- [ ] Les tâches ne sont pas générées par Grok
- [ ] Les champs spécifiques par type ne s'affichent pas
- [ ] La validation des champs ne fonctionne pas
- [ ] Les données ne sont pas sauvegardées dans localStorage

---

## 📊 Résultats Attendus

### Check-in Énergie
- ✅ Processus fluide en 3 étapes (< 10 secondes)
- ✅ Tous les champs sauvegardés correctement
- ✅ Graphique visuel et intuitif
- ✅ Historique détaillé avec tags colorés
- ✅ Option "Passer" toujours accessible

### Objectifs
- ✅ Formulaire adaptatif selon le type
- ✅ Questions pertinentes et ciblées
- ✅ Validation intelligente à chaque étape
- ✅ Analyse Grok fonctionnelle
- ✅ Tâches générées et intégrées dans Planning

---

## 🚀 Prochaines Étapes

Si tous les tests passent :
- [ ] Ajouter les traductions FR/EN/ES
- [ ] Optimiser les performances
- [ ] Ajouter des animations
- [ ] Créer des tests unitaires

