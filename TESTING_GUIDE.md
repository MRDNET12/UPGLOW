# 🧪 Guide de Test - Système de Paiement UPGLOW

## 📋 Prérequis

Avant de commencer les tests, assurez-vous que :
- ✅ Firebase est configuré (voir `FIREBASE_SETUP.md`)
- ✅ Les variables d'environnement sont définies dans `.env.local`
- ✅ L'application est lancée en mode développement (`npm run dev`)
- ✅ Vous avez accès à la Firebase Console
- ✅ Vous avez un compte Stripe en mode test

## 🔄 Flux de Test Complet

### 1️⃣ Test de la Période d'Essai Initiale (3 jours)

#### Étapes :
1. **Réinitialiser l'application** :
   - Ouvrir DevTools (F12)
   - Aller dans `Application` → `Local Storage`
   - Supprimer la clé `glow-up-storage`
   - Recharger la page

2. **Vérifier l'initialisation** :
   - ✅ Le badge "3 jours gratuits" doit apparaître dans le dashboard
   - ✅ L'application doit être accessible
   - ✅ Aucun popup ne doit s'afficher

3. **Vérifier le localStorage** :
   ```javascript
   // Dans la console DevTools
   const store = JSON.parse(localStorage.getItem('glow-up-storage'));
   console.log(store.state.subscription);
   // Doit afficher :
   // {
   //   firstOpenDate: "2024-01-16",
   //   hasRegistered: false,
   //   registrationDate: null,
   //   isSubscribed: false,
   //   subscriptionEndDate: null,
   //   hasSeenTrialPopup: false
   // }
   ```

### 2️⃣ Test du Popup d'Extension (Jour 4)

#### Étapes :
1. **Simuler le jour 4** :
   ```javascript
   // Dans la console DevTools
   const store = JSON.parse(localStorage.getItem('glow-up-storage'));
   const fourDaysAgo = new Date();
   fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
   store.state.subscription.firstOpenDate = fourDaysAgo.toISOString().split('T')[0];
   localStorage.setItem('glow-up-storage', JSON.stringify(store));
   location.reload();
   ```

2. **Vérifier le popup** :
   - ✅ Le popup `TrialExtensionPopup` doit s'afficher
   - ✅ Image Glowee visible
   - ✅ Message d'encouragement affiché
   - ✅ Formulaire email + mot de passe présent

3. **Tester "Peut-être plus tard"** :
   - Cliquer sur "Peut-être plus tard"
   - ✅ Le popup doit se fermer
   - ✅ Le popup d'abonnement doit s'afficher immédiatement

### 3️⃣ Test de l'Inscription

#### Étapes :
1. **Réafficher le popup d'extension** :
   - Réinitialiser le localStorage
   - Simuler le jour 4 (voir étape 2️⃣)

2. **Remplir le formulaire** :
   - Email : `test@example.com`
   - Mot de passe : `test123456`
   - Cliquer sur "Débloquer 3 jours gratuits"

3. **Vérifier l'inscription** :
   - ✅ Message de succès affiché
   - ✅ Popup fermé
   - ✅ Badge "6 jours gratuits" visible

4. **Vérifier Firebase** :
   - Aller dans Firebase Console
   - `Authentication` → Vérifier que l'utilisateur est créé
   - `Firestore` → Collection `users` → Vérifier le document :
     ```json
     {
       "email": "test@example.com",
       "hasPaid": false,
       "createdAt": "2024-01-16T10:00:00.000Z",
       "registrationDate": "2024-01-16T10:00:00.000Z"
     }
     ```

5. **Vérifier le localStorage** :
   ```javascript
   const store = JSON.parse(localStorage.getItem('glow-up-storage'));
   console.log(store.state.subscription.hasRegistered); // true
   console.log(store.state.subscription.registrationDate); // Date du jour
   ```

### 4️⃣ Test du Popup d'Abonnement (Jour 7)

#### Étapes :
1. **Simuler le jour 7** :
   ```javascript
   const store = JSON.parse(localStorage.getItem('glow-up-storage'));
   const sevenDaysAgo = new Date();
   sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
   store.state.subscription.firstOpenDate = sevenDaysAgo.toISOString().split('T')[0];
   store.state.subscription.registrationDate = sevenDaysAgo.toISOString().split('T')[0];
   localStorage.setItem('glow-up-storage', JSON.stringify(store));
   location.reload();
   ```

2. **Vérifier le popup** :
   - ✅ Le popup `SubscriptionPopup` doit s'afficher
   - ✅ Image Glowee avec couronne visible
   - ✅ Prix "6,99€/mois" affiché
   - ✅ Liste des avantages visible

3. **Vérifier le lien Stripe** :
   - Ouvrir DevTools → Network
   - Cliquer sur "Commencer mon abonnement"
   - ✅ Redirection vers Stripe
   - ✅ URL contient `prefilled_email=test@example.com`

### 5️⃣ Test du Paiement Stripe

#### Étapes :
1. **Sur la page Stripe** :
   - ✅ Email pré-rempli : `test@example.com`
   - Utiliser une carte de test :
     - Numéro : `4242 4242 4242 4242`
     - Date : N'importe quelle date future
     - CVC : N'importe quel 3 chiffres

2. **Compléter le paiement** :
   - Remplir les informations
   - Cliquer sur "S'abonner"

3. **Vérifier la redirection** :
   - ✅ Redirection vers `/payment-confirmation`

### 6️⃣ Test de la Page de Confirmation

#### Étapes :
1. **Vérifier l'affichage** :
   - ✅ Image Glowee animée (bounce)
   - ✅ Message "Confirmation en cours..."
   - ✅ Loader animé visible

2. **Vérifier la mise à jour Firestore** :
   - Aller dans Firebase Console
   - `Firestore` → Collection `users` → Document de l'utilisateur
   - ✅ `hasPaid` doit être `true`

3. **Vérifier la redirection** :
   - Après ~3-4 secondes
   - ✅ Message de succès affiché
   - ✅ Redirection automatique vers `/`

4. **Vérifier l'accès** :
   - ✅ Badge "Premium" visible dans le dashboard
   - ✅ Accès complet à l'application
   - ✅ Plus de popup d'abonnement

### 7️⃣ Test de Protection des Routes

#### Étapes :
1. **Se déconnecter** :
   ```javascript
   // Dans la console
   import { auth } from '@/lib/firebase';
   import { signOut } from 'firebase/auth';
   await signOut(auth);
   ```

2. **Essayer d'accéder à `/payment-confirmation`** :
   - ✅ Redirection automatique vers `/`

3. **Se reconnecter** :
   - Utiliser le formulaire d'inscription (qui sert aussi de connexion)
   - ✅ Accès restauré

## 🐛 Tests d'Erreurs

### Test 1 : Email Invalide
- Email : `test` (sans @)
- ✅ Message d'erreur Firebase affiché

### Test 2 : Mot de Passe Trop Court
- Mot de passe : `123`
- ✅ Message "Le mot de passe doit contenir au moins 6 caractères"

### Test 3 : Email Déjà Utilisé
- Essayer de s'inscrire avec le même email
- ✅ Message d'erreur Firebase affiché

### Test 4 : Accès Sans Connexion
- Se déconnecter
- Essayer d'accéder à `/payment-confirmation`
- ✅ Redirection vers `/`

## 📊 Checklist Complète

- [ ] Période d'essai initiale (3 jours)
- [ ] Badge "3 jours gratuits" visible
- [ ] Popup d'extension au jour 4
- [ ] Inscription Firebase réussie
- [ ] Document Firestore créé avec `hasPaid: false`
- [ ] Badge "6 jours gratuits" après inscription
- [ ] Popup d'abonnement au jour 7
- [ ] Lien Stripe avec email pré-rempli
- [ ] Paiement Stripe en mode test
- [ ] Redirection vers `/payment-confirmation`
- [ ] Loader et animation Glowee
- [ ] Mise à jour `hasPaid: true` dans Firestore
- [ ] Message de succès affiché
- [ ] Redirection vers `/`
- [ ] Badge "Premium" visible
- [ ] Protection des routes fonctionnelle
- [ ] Gestion des erreurs

## 🔧 Commandes Utiles

### Réinitialiser Complètement
```javascript
// Supprimer le localStorage
localStorage.removeItem('glow-up-storage');

// Se déconnecter de Firebase
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
await signOut(auth);

// Recharger
location.reload();
```

### Vérifier l'État Actuel
```javascript
// Store local
const store = JSON.parse(localStorage.getItem('glow-up-storage'));
console.log('Subscription:', store.state.subscription);

// Utilisateur Firebase
import { auth } from '@/lib/firebase';
console.log('User:', auth.currentUser);
```

## 📝 Notes

- Les tests doivent être effectués dans l'ordre
- Utilisez toujours le mode test de Stripe
- Vérifiez Firebase Console après chaque étape importante
- En cas de problème, réinitialisez complètement avant de recommencer

