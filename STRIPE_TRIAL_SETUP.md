# 🔧 Configuration Stripe avec Trial de 3 Jours

## 🎯 Objectif

Créer un lien de paiement Stripe qui offre **3 jours d'essai gratuit** avant de débiter l'utilisateur.

---

## 📋 Étapes de Configuration

### 1. Accéder à Stripe Dashboard

1. Connectez-vous à [Stripe Dashboard](https://dashboard.stripe.com/)
2. Allez dans **Products** (Produits)

---

### 2. Créer ou Modifier le Produit

#### Si vous n'avez pas encore de produit :

1. Cliquez sur **+ Add product**
2. Remplissez :
   - **Name** : UPGLOW Premium
   - **Description** : Accès illimité à l'application UPGLOW
   - **Pricing model** : Recurring (Récurrent)
   - **Price** : 6,99 EUR
   - **Billing period** : Monthly (Mensuel)

#### Si vous avez déjà un produit :

1. Cliquez sur votre produit existant
2. Notez le **Price ID** (commence par `price_...`)

---

### 3. Créer un Payment Link avec Trial

1. Dans votre produit, cliquez sur **Create payment link**
2. Configurez :
   - **Price** : Sélectionnez votre prix à 6,99€/mois
   - **Trial period** : Cochez "Add a free trial"
   - **Trial duration** : 3 days
   - **Collect customer email** : Activé
   - **Allow promotion codes** : Optionnel

3. Dans **After payment** :
   - **Success URL** : `https://votre-domaine.com/payment-confirmation`
   - **Cancel URL** : `https://votre-domaine.com/` (optionnel)

4. Cliquez sur **Create link**

---

### 4. Copier le Lien de Paiement

Vous obtiendrez un lien comme :
```
https://buy.stripe.com/XXXXXXXX
```

**Important** : Ce lien inclut automatiquement le trial de 3 jours.

---

### 5. Mettre à Jour le Code

Ouvrez `src/components/TrialExtensionPopup.tsx` et remplacez :

```typescript
// Ligne 47
const stripeUrlWithTrial = `https://buy.stripe.com/bJeaEX4jkevq0yz6Qdf3a00?prefilled_email=${encodeURIComponent(email)}&trial_from_plan=true`;
```

Par :

```typescript
const stripeUrlWithTrial = `https://buy.stripe.com/VOTRE_NOUVEAU_LIEN?prefilled_email=${encodeURIComponent(email)}`;
```

---

## 🔍 Vérification

### Comment tester le trial :

1. **Mode Test Stripe** :
   - Utilisez une carte de test : `4242 4242 4242 4242`
   - Date d'expiration : N'importe quelle date future
   - CVC : N'importe quel 3 chiffres

2. **Vérifier dans Stripe Dashboard** :
   - Allez dans **Customers** → Votre client de test
   - Vérifiez que le statut est **"trialing"** (en essai)
   - La date de fin du trial doit être dans 3 jours

3. **Vérifier le débit** :
   - Pendant les 3 jours : Aucun débit
   - Après 3 jours : Stripe débite automatiquement 6,99€

---

## 📊 Flux Utilisateur Final

```
Jour 1-3 : Essai gratuit (sans inscription)
    ↓
Jour 4 : Popup Glowee
    ↓
Inscription (email/password Firebase)
    ↓
Redirection vers Stripe
    ↓
Paiement Stripe (carte enregistrée, pas de débit)
    ↓
Statut : "trialing" (3 jours gratuits)
    ↓
/payment-confirmation → hasPaid: true + isSubscribed: true
    ↓
Accès à l'app (Badge "Premium")
    ↓
Jour 7 : Stripe débite automatiquement 6,99€
    ↓
Accès illimité ✨
```

---

## ⚠️ Important

### Différence entre Trial et Essai Gratuit Initial

- **Jour 1-3** : Essai gratuit géré par l'app (localStorage)
- **Jour 4-7** : Trial Stripe (géré par Stripe, carte enregistrée)

### Pourquoi 2 périodes d'essai ?

1. **Jour 1-3** : L'utilisateur découvre l'app sans inscription
2. **Jour 4** : Il s'inscrit et enregistre sa carte
3. **Jour 4-7** : Trial Stripe (pas de débit pendant 3 jours)
4. **Jour 7** : Débit automatique si non annulé

---

## 🔐 Sécurité

### Webhook Stripe (Recommandé pour la production)

Pour vérifier les paiements côté serveur, configurez un webhook :

1. Dans Stripe Dashboard → **Developers** → **Webhooks**
2. Ajoutez un endpoint : `https://votre-domaine.com/api/stripe-webhook`
3. Écoutez les événements :
   - `customer.subscription.created` - Abonnement créé
   - `customer.subscription.trial_will_end` - Trial va se terminer (2 jours avant)
   - `invoice.payment_succeeded` - Paiement réussi
   - `customer.subscription.deleted` - Abonnement annulé

---

## 📝 Notes

- Le trial Stripe nécessite une carte bancaire valide
- L'utilisateur peut annuler pendant le trial sans être débité
- Après le trial, le renouvellement est automatique
- Vous pouvez envoyer un email de rappel 1 jour avant la fin du trial

---

## 🚀 Déploiement

1. Créez le lien Stripe avec trial
2. Mettez à jour `TrialExtensionPopup.tsx` avec le nouveau lien
3. Configurez les variables d'environnement Firebase
4. Déployez sur Render/Vercel
5. Testez le flux complet en mode test

---

**Tout est prêt ! 🎉**

