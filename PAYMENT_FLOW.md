# 💳 Flux de Paiement UPGLOW

## 📋 Vue d'ensemble

Ce document décrit le flux complet d'inscription, de paiement et d'accès à l'application UPGLOW.

## 🔄 Flux Utilisateur Complet

### Étape 1 : Première Ouverture (Jours 1-3)
- ✅ L'utilisateur ouvre l'app pour la première fois
- ✅ `initializeFirstOpen()` enregistre la date dans le store local
- ✅ Badge "3 jours gratuits" visible dans le dashboard
- ✅ Accès complet à l'application

### Étape 2 : Jour 4 - Popup d'Extension
- 🎨 Le popup `TrialExtensionPopup` s'affiche automatiquement
- 📝 L'utilisateur peut :
  - **S'inscrire** : Formulaire email + mot de passe
  - **Skip** : Reporter l'inscription

#### Si l'utilisateur s'inscrit :
1. **Firebase Authentication** crée le compte
2. **Firestore** crée un document utilisateur :
   ```json
   {
     "email": "user@example.com",
     "hasPaid": false,
     "createdAt": "2024-01-16T10:00:00.000Z",
     "registrationDate": "2024-01-16T10:00:00.000Z"
   }
   ```
3. **Store local** met à jour `hasRegistered: true`
4. ✅ **3 jours supplémentaires** débloqués (total : 6 jours)

### Étape 3 : Jour 7 (ou Jour 4 si skip) - Popup d'Abonnement
- 👑 Le popup `SubscriptionPopup` s'affiche
- 💰 Prix affiché : **6,99€/mois**
- 📧 L'email de l'utilisateur est pré-rempli dans le lien Stripe

#### Quand l'utilisateur clique sur "S'abonner" :
1. **Redirection vers Stripe** avec l'email pré-rempli :
   ```
   https://buy.stripe.com/bJeaEX4jkevq0yz6Qdf3a00?prefilled_email=user@example.com
   ```
2. L'utilisateur complète le paiement sur Stripe
3. Stripe redirige vers `/payment-confirmation`

### Étape 4 : Page de Confirmation
**URL** : `/payment-confirmation`

#### Vérifications :
- ✅ L'utilisateur doit être connecté (Firebase Auth)
- ✅ Sinon, redirection vers `/`

#### Processus :
1. **Affichage** :
   - Image Glowee animée
   - Message "Confirmation en cours..."
   - Loader animé

2. **Mise à jour Firestore** :
   ```typescript
   await updateUserPaidStatus();
   // Met à jour hasPaid: true dans Firestore
   ```

3. **Succès** :
   - Affichage du message de succès
   - Icône de validation
   - Redirection automatique vers `/`

4. **Erreur** :
   - Message d'erreur affiché
   - Bouton "Retour à l'accueil"

### Étape 5 : Accès à l'Application
- ✅ L'utilisateur a maintenant `hasPaid: true` dans Firestore
- ✅ Accès illimité à toutes les fonctionnalités
- ✅ Badge "Premium" visible dans le dashboard

## 🛠️ Architecture Technique

### Firebase Authentication
```typescript
// Inscription
await signUp(email, password);

// Connexion
await signIn(email, password);

// Déconnexion
await signOut();
```

### Firestore - Collection `users`
```typescript
interface UserData {
  email: string;
  hasPaid: boolean;
  createdAt: string;
  registrationDate: string;
}
```

### Store Local (Zustand)
```typescript
interface SubscriptionState {
  firstOpenDate: string | null;
  hasRegistered: boolean;
  registrationDate: string | null;
  isSubscribed: boolean;
  subscriptionEndDate: string | null;
  hasSeenTrialPopup: boolean;
}
```

### Composants

#### 1. `AuthContext`
- Gère l'authentification Firebase
- Fournit `user`, `userData`, `signUp`, `signIn`, `signOut`
- Méthode `updateUserPaidStatus()` pour mettre à jour Firestore

#### 2. `TrialExtensionPopup`
- Formulaire d'inscription
- Validation des champs
- Création du compte Firebase
- Mise à jour du store local

#### 3. `SubscriptionPopup`
- Affichage du prix et des avantages
- Génération du lien Stripe avec email
- Redirection vers Stripe

#### 4. `ProtectedRoute`
- Vérifie l'authentification
- Vérifie le statut de paiement
- Affiche un loader pendant la vérification
- Redirige si accès non autorisé

## 🔐 Sécurité

### Vérifications Côté Client
- ✅ Utilisateur connecté (Firebase Auth)
- ✅ Période d'essai valide (Store local)
- ✅ Statut de paiement (Firestore)

### Vérifications Côté Serveur (À implémenter)
- 🔜 Webhook Stripe pour confirmer le paiement
- 🔜 Validation du token Firebase
- 🔜 Vérification de l'abonnement actif

## 📱 Utilisation

### Intégrer l'AuthProvider
```tsx
// src/app/layout.tsx
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Protéger une Route
```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function MyPage() {
  return (
    <ProtectedRoute requireAuth requirePaid>
      {/* Contenu protégé */}
    </ProtectedRoute>
  );
}
```

### Utiliser l'Auth dans un Composant
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, userData, signOut } = useAuth();
  
  return (
    <div>
      {user && <p>Email: {user.email}</p>}
      {userData?.hasPaid && <p>Premium ✨</p>}
    </div>
  );
}
```

## 🧪 Tests

### Tester le Flux Complet

1. **Réinitialiser** :
   - Supprimer `glow-up-storage` dans localStorage
   - Se déconnecter de Firebase

2. **Jour 1-3** :
   - Ouvrir l'app
   - Vérifier le badge "3 jours gratuits"

3. **Jour 4** :
   - Modifier `firstOpenDate` dans localStorage (4 jours avant)
   - Recharger → Popup d'extension apparaît

4. **Inscription** :
   - Remplir email + mot de passe
   - Vérifier la création dans Firebase Console
   - Vérifier le badge "6 jours gratuits"

5. **Jour 7** :
   - Modifier `registrationDate` (7 jours avant)
   - Recharger → Popup d'abonnement apparaît

6. **Paiement** :
   - Cliquer sur "S'abonner"
   - Vérifier la redirection vers Stripe avec email
   - Compléter le paiement (mode test)

7. **Confirmation** :
   - Vérifier la page `/payment-confirmation`
   - Vérifier `hasPaid: true` dans Firestore
   - Vérifier la redirection vers `/`
   - Vérifier le badge "Premium"

## 🚀 Prochaines Étapes

1. **Webhook Stripe** 🔜
   - Créer `/api/webhooks/stripe`
   - Vérifier les paiements
   - Mettre à jour Firestore automatiquement

2. **Gestion des Abonnements** 🔜
   - Annulation
   - Renouvellement
   - Facturation

3. **Analytics** 🔜
   - Tracking des conversions
   - Taux d'inscription
   - Taux d'abonnement

4. **Emails** 🔜
   - Email de bienvenue
   - Email de confirmation de paiement
   - Rappels d'expiration

