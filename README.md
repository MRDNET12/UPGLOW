# ✨ Glow Up Challenge - 30 Jours pour Devenir la Meilleure Version de Toi-Même

Une application web mobile premium et élégante pour accompagner les femmes dans leur transformation personnelle sur 30 jours. Style "Pinterest / Soft Life / Beige Aesthetic" avec design moderne, féminin et minimaliste.

## 🌟 Caractéristiques de l'Application

### 📱 Interface Utilisateur Premium
- **Design Féminin et Élégant** - Style Pinterest avec tons beige, rose, pêche et orange
- **Thème Clair/Sombre** - Mode adapté à toutes les préférences
- **Navigation Mobile-First** - Bottom navigation intuitive pour une expérience mobile optimale
- **Design Responsive** - S'adapte parfaitement à tous les écrans

### 🎯 Fonctionnalités Principales

#### 1. **Écran d'Accueil / Onboarding**
- Citation inspirante motivante
- Présentation du challenge 30 jours
- Bouton "Commencer mon Glow Up"

#### 2. **Dashboard Principal**
- Indicateur de progression du mois (pourcentage et jours complétés)
- Accès rapide à:
  - Mon challenge du jour
  - Mon journal
  - Mes trackers
  - Ma routine Glow Up
  - Mes bonus
  - Vision Board

#### 3. **Challenge 30 Jours**
- **30 pages détaillées**, une par jour
- Pour chaque jour:
  - Titre et contenu complet
  - Affirmation du jour
  - 3 actions: Beauté, Mental, Lifestyle
  - Bouton "J'ai complété ce jour"
  - Zone de notes personnelles
  - Compteur de progression

#### 4. **Section Journaling**
- Journal libre pour exprimer ses pensées
- Questions guidées:
  - "Comment je me sens aujourd'hui ?"
  - "Qu'est-ce qui m'a apporté du glow ?"
  - "Qu'est-ce que j'ai appris ?"
- Historique des entrées avec date

#### 5. **Trackers Glow Up**
- **Hydratation** - Suivi des verres d'eau (8 verres/jour)
- **Sommeil** - Heures de sommeil avec tracking
- **Humeur** - Émoticônes pour suivre l'humeur (1-5)
- **Activité / Mouvement** - Minutes d'activité physique
- **Skincare** - Checklist routine beauté complétée
- **Habitudes Quotidiennes** - Checklist personnalisable (méditation, journaling, gratitude, exercice, lecture, pas de scroll avant dormir)

#### 6. **Routine Glow Up Personnalisable**
- Routine quotidienne en 5 étapes personnalisables
- Possibilité de modifier chaque étape
- Marqueur de complétion quotidien
- Suggestion de routine par défaut

#### 7. **Vision Board Intégré**
- Upload d'images inspirantes via URL
- Légendes personnalisables pour chaque image
- Affirmation du jour aléatoire
- Board modifiable et supprimable

#### 8. **Section Bonus**
- **Affirmations Audio** - Liste d'affirmations à écouter
- **Affirmations Écrites** - 20 affirmations puissantes
- **Checklists PDF** - Guides pratiques (routine matin/soir, self-care, objectifs)
- **Mini-Guide Soft Life** - Astuces pour une vie douce et épanouie

#### 9. **Paramètres / Profil**
- Progression globale complète
- Thème clair/foncé
- Notifications activables/désactivables
- Export des données (journal en JSON)
- Statistiques détaillées

#### 10. **Navigation**
- Bottom navigation mobile avec:
  - Accueil
  - Challenge
  - Journal
  - Trackers
  - Profil

## 🛠️ Stack Technique

### Core Framework
- **Next.js 15** - React framework avec App Router
- **TypeScript 5** - Typage strict pour plus de sécurité
- **Tailwind CSS 4** - Styling utility-first avec couleurs personnalisées

### UI Components
- **shadcn/ui** - Composants accessibles et élégants
- **Lucide React** - Icônes cohérentes et belles
- **Framer Motion** - Animations fluides
- **next-themes** - Gestion du thème clair/sombre

### State Management & Data
- **Zustand** - Gestion d'état légère et puissante
- **Prisma ORM** - Base de données SQLite
- **TanStack Query** - Gestion des requêtes serveur

### Fonts
- **Playfair Display** - Police serif élégante pour les titres
- **Inter** - Police sans-serif moderne pour le corps de texte

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ ou Bun
- npm, yarn ou bun

### Installation

```bash
# Installer les dépendances
bun install

# Démarrer le serveur de développement
bun run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### Build de Production

```bash
# Build pour la production
bun run build

# Démarrer le serveur de production
bun start
```

## 📦 Déploiement sur Netlify

### Méthode 1: Via Netlify CLI

```bash
# Installer Netlify CLI
bun add -g netlify-cli

# Initialiser le projet
netlify init

# Build et déployer
netlify deploy --prod
```

### Méthode 2: Via Netlify Dashboard

1. Connectez-vous sur [Netlify](https://app.netlify.com)
2. Cliquez sur "Add new site" → "Import an existing project"
3. Connectez votre repository (GitHub, GitLab, Bitbucket)
4. Configurez les paramètres de build:
   - **Build command**: `bun run build`
   - **Publish directory**: `.next`
5. Cliquez sur "Deploy site"

### Configuration Avancée Netlify

Créez un fichier `netlify.toml` à la racine du projet:

```toml
[build]
  command = "bun run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
```

## 📂 Structure du Projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── api/               # API Routes
│   │   ├── challenge/     # Progression du challenge
│   │   ├── journal/       # Entrées de journal
│   │   ├── trackers/      # Trackers quotidiens
│   │   ├── routine/       # Routines Glow Up
│   │   ├── vision-board/  # Vision Board images
│   │   ├── settings/      # Paramètres utilisateur
│   │   └── user/          # Gestion des utilisateurs
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page principale (app)
├── components/
│   └── ui/               # Composants shadcn/ui
├── hooks/
│   ├── use-toast.ts      # Hook pour les toasts
│   └── use-mobile.ts     # Hook pour détecter mobile
├── lib/
│   ├── challenge-data.ts  # Données des 30 jours
│   ├── db.ts            # Client Prisma
│   ├── store.ts         # Store Zustand
│   └── utils.ts         # Utilitaires
├── prisma/
│   └── schema.prisma     # Schéma de la base de données
```

## 🎨 Style et Design

### Palette de Couleurs
- **Background**: Beige clair (`oklch(0.98 0.01 85)`)
- **Primary**: Rose doux (`oklch(0.65 0.18 25)`)
- **Secondary**: Pêche (`oklch(0.94 0.06 45)`)
- **Accent**: Orange pâle (`oklch(0.93 0.08 35)`)
- **Text**: Stone foncé (`oklch(0.25 0.02 45)`)

### Typographie
- **Titres**: Playfair Display (Serif élégant)
- **Corps**: Inter (Sans-serif moderne)

### Design System
- **Border Radius**: Arrondis doux (0.75rem par défaut)
- **Shadows**: Ombres subtiles pour effet glassmorphism
- **Animations**: Transitions fluides avec Framer Motion
- **Spacing**: Espacements généreux pour une aération visuelle

## 🌟 Contenu des 30 Jours

### Semaine 1: Reset & Nettoyage de vie
- Jour 1: Grand Reset
- Jour 2: Hydratation intérieure & extérieure
- Jour 3: Détox digitale
- Jour 4: Organisation rapide & douce
- Jour 5: Corps & Énergie
- Jour 6: Détox émotionnelle
- Jour 7: Bilan Semaine 1

### Semaine 2: Beauté & Self-care
- Jour 8: Stabiliser ta routine skincare
- Jour 9: Soin cheveux profond
- Jour 10: Routine "Femme Fatale" minimaliste
- Jour 11: Look frais en 5 minutes
- Jour 12: Posture & élégance
- Jour 13: Self-care mains & pieds
- Jour 14: Bilan Semaine 2

### Semaine 3: Mindset & Confiance
- Jour 15: Vision Board Féminin
- Jour 16: Affirmations puissantes
- Jour 17: Journal "Femme Confiante"
- Jour 18: Stop aux pensées négatives
- Jour 19: Routine matinale douce
- Jour 20: Petits plaisirs du quotidien
- Jour 21: Bilan Semaine 3

### Semaine 4: Lifestyle, Habitudes & Énergie féminine
- Jour 22: Routine du soir Glow
- Jour 23: Meal Prep simple
- Jour 24: Glow Up wardrobe
- Jour 25: Espace beauté organisé
- Jour 26: Hydratation maximale
- Jour 27: Journée Soft Life
- Jour 28: Social Glow Up
- Jour 29: Préparer le mois prochain
- Jour 30: Bilan final & célébration

## 💾 Persistance des Données

L'application utilise deux couches de persistance:

1. **Local Storage** - Via Zustand persist middleware pour une persistance instantanée
2. **Base de données** - Prisma avec SQLite pour une persistance durable (optionnelle via API)

## 🔒 Sécurité et Confidentialité

- Toutes les données sont stockées localement sur l'appareil de l'utilisateur
- Pas de tracking ou d'analytics externes
- API sécurisées avec validation des entrées
- Protection CORS configurée

## 🌱 Améliorations Futures

- [ ] Authentification utilisateur avec NextAuth.js
- [ ] Synchronisation cloud pour accéder aux données sur plusieurs appareils
- [ ] Export PDF du journal
- [ ] Notifications push réelles
- [ ] Partage du vision board
- [ ] Mode communauté avec challenges de groupe
- [ ] Système de récompenses et badges
- [ ] Intégration avec Google Calendar pour les rappels

## 📝 Licence

Ce projet est développé pour accompagner les femmes dans leur transformation personnelle. Utilisez-le librement pour votre bien-être.

## 🤝 Support

Pour toute question ou suggestion, n'hésitez pas à contacter l'équipe de développement.

---

**Conçu avec ❤️ pour accompagner les femmes dans leur voyage vers la meilleure version d'elles-mêmes.**

*Style: Pinterest / Soft Life / Beige Aesthetic | Développé avec Next.js 15, TypeScript et Tailwind CSS 4*
