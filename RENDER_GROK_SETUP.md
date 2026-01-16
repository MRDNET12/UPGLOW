# 🚀 Configuration de Grok API sur Render

## ❌ Problème

L'IA Glowee ne fonctionne pas car la variable d'environnement `XAI_API_KEY` n'est pas configurée sur Render.

---

## ✅ Solution : Ajouter XAI_API_KEY sur Render

### Étape 1 : Obtenir votre Clé API Grok

1. Allez sur [console.x.ai](https://console.x.ai/)
2. Connectez-vous avec votre compte X/Twitter
3. Naviguez vers **API Keys**
4. Cliquez sur **Create API Key**
5. Copiez votre clé API (elle commence par `xai-...`)

⚠️ **Important** : Gardez cette clé secrète !

---

### Étape 2 : Ajouter la Variable d'Environnement sur Render

1. **Connectez-vous sur Render** : [dashboard.render.com](https://dashboard.render.com/)

2. **Sélectionnez votre service** : `upglow`

3. **Allez dans Environment** :
   - Cliquez sur votre service
   - Dans le menu de gauche, cliquez sur **Environment**

4. **Ajoutez la variable** :
   - Cliquez sur **Add Environment Variable**
   - **Key** : `XAI_API_KEY`
   - **Value** : `xai-votre-cle-api-ici` (collez votre clé)
   - Cliquez sur **Save Changes**

5. **Redéployez** :
   - Render va automatiquement redéployer votre application
   - Attendez que le déploiement soit terminé (environ 2-3 minutes)

---

## 🧪 Tester l'IA Glowee

Une fois le déploiement terminé :

1. Ouvrez votre app UPGLOW
2. Allez dans le chat Glowee (icône en bas)
3. Envoyez un message : "Bonjour Glowee !"
4. Vous devriez recevoir une réponse de l'IA 💫

---

## 🔍 Vérifier que la Clé est Configurée

### Sur Render

1. Allez dans **Environment**
2. Vérifiez que `XAI_API_KEY` est bien présent dans la liste
3. La valeur doit être masquée (pour la sécurité)

### Dans les Logs

1. Allez dans **Logs** sur Render
2. Cherchez les erreurs liées à Grok :
   - ❌ `XAI_API_KEY not configured` → La clé n'est pas configurée
   - ✅ Pas d'erreur → La clé est bien configurée

---

## 🎯 Variables d'Environnement Complètes

Voici toutes les variables nécessaires pour UPGLOW sur Render :

```bash
# Firebase (déjà configurées)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Grok API (À AJOUTER)
XAI_API_KEY=xai-votre-cle-api-ici

# NextAuth (déjà configurées)
NEXTAUTH_URL=https://votre-app.onrender.com
NEXTAUTH_SECRET=...

# Database (déjà configurée)
DATABASE_URL=...
```

---

## 💰 Tarification Grok API

- **Modèle** : `grok-beta`
- **Coût** : Environ $5 par million de tokens
- **Estimation UPGLOW** :
  - 1 conversation = ~10 messages
  - 1 message = ~500 tokens
  - 1 conversation = ~5000 tokens = $0.025

Avec un usage modéré (100 conversations/mois), le coût est d'environ **$2.50/mois**.

---

## 🐛 Dépannage

### Erreur : "XAI_API_KEY not configured"

**Cause** : La variable d'environnement n'est pas configurée sur Render.

**Solution** :
1. Vérifiez que `XAI_API_KEY` est bien dans **Environment**
2. Vérifiez que la valeur commence par `xai-`
3. Redéployez l'application

### Erreur : "Grok API error: 401"

**Cause** : La clé API est invalide ou expirée.

**Solution** :
1. Générez une nouvelle clé sur [console.x.ai](https://console.x.ai/)
2. Mettez à jour `XAI_API_KEY` sur Render
3. Redéployez

### Erreur : "Grok API error: 429"

**Cause** : Limite de requêtes dépassée.

**Solution** :
1. Attendez quelques minutes
2. Vérifiez votre quota sur [console.x.ai](https://console.x.ai/)

---

## 📝 Notes

- La clé API est **secrète** et ne doit jamais être partagée
- Render masque automatiquement les variables d'environnement dans les logs
- Vous pouvez révoquer et régénérer votre clé à tout moment sur console.x.ai

---

**Dernière mise à jour** : 2026-01-16  
**Status** : ✅ Prêt pour la configuration

