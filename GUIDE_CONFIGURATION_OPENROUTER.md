# 🔑 Guide de Configuration OpenRouter pour Glowee Chat

## 🎯 Problème Actuel

```
[Chat API] OPENROUTER_API_KEY not configured
```

**Cause** : La variable d'environnement `OPENROUTER_API_KEY` n'est pas configurée sur Render.

---

## ✅ Solution : Configurer OpenRouter sur Render

### Étape 1 : Obtenir une Clé API OpenRouter (GRATUIT) 🆓

1. **Va sur OpenRouter** : https://openrouter.ai/
2. **Crée un compte** (gratuit)
3. **Va dans "Keys"** : https://openrouter.ai/keys
4. **Clique sur "Create Key"**
5. **Copie ta clé API** (commence par `sk-or-v1-...`)

> 💡 **OpenRouter est GRATUIT** pour le modèle `google/gemini-2.0-flash-exp:free` !

---

### Étape 2 : Ajouter la Clé sur Render 🚀

1. **Va sur Render** : https://dashboard.render.com/
2. **Sélectionne ton service** "upglow" ou "upglow2"
3. **Va dans "Environment"** (dans le menu de gauche)
4. **Clique sur "Add Environment Variable"**
5. **Ajoute** :
   - **Key** : `OPENROUTER_API_KEY`
   - **Value** : `sk-or-v1-...` (ta clé copiée)
6. **Clique sur "Save Changes"**

> ⚠️ **Render va automatiquement redéployer l'app** (2-3 minutes)

---

### Étape 3 : Vérifier que ça Fonctionne ✅

1. **Attends que Render finisse de déployer** (2-3 min)
2. **Ouvre l'app** sur ton téléphone
3. **Clique sur l'icône Glowee** (en bas)
4. **Envoie un message** : "Salut Glowee !"
5. **Glowee devrait répondre** ! 🎉

---

## 🔍 Vérifier les Logs

### Sur Render

1. **Va dans "Logs"** (menu de gauche)
2. **Cherche** :
   ```
   [Chat API] API Key present: sk-or-v1-...
   [Chat API] Calling OpenRouter API with X messages
   [Chat API] AI response received: ...
   ```

### Si ça Fonctionne

```
[Chat API] Received message: { sessionId: 'session-...', messageLength: 15 }
[Chat API] API Key present: sk-or-v1-...
[Chat API] Calling OpenRouter API with 2 messages
[Chat API] OpenRouter API response status: 200
[Chat API] AI response received: Salut ! 💖 Comment puis-je t'aider...
```

### Si ça ne Fonctionne Pas

```
[Chat API] OPENROUTER_API_KEY not configured
```
→ **La clé n'est pas configurée sur Render**

---

## 📋 Récapitulatif

### Variables d'Environnement Nécessaires sur Render

| Variable | Obligatoire | Où l'obtenir |
|----------|-------------|--------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ Oui | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ Oui | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ Oui | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ Oui | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ Oui | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ Oui | Firebase Console |
| **`OPENROUTER_API_KEY`** | ✅ **Oui (pour Glowee Chat)** | **https://openrouter.ai/keys** |

---

## 🎨 Modèle Utilisé

Le code utilise le modèle **gratuit** de Google Gemini via OpenRouter :

```typescript
model: 'google/gemini-2.0-flash-exp:free'
```

### Avantages
- ✅ **100% GRATUIT**
- ✅ Très performant
- ✅ Rapide
- ✅ Supporte le français
- ✅ Pas de limite de requêtes (raisonnable)

---

## 🔧 Code de l'API

Le code est dans `src/app/api/chat/route.ts` :

```typescript
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

if (!OPENROUTER_API_KEY) {
  console.error('[Chat API] OPENROUTER_API_KEY not configured');
  return NextResponse.json(
    { success: false, error: 'OPENROUTER_API_KEY not configured' },
    { status: 500 }
  );
}
```

---

## 🚨 Erreurs Courantes

### 1. "OPENROUTER_API_KEY not configured"
**Cause** : La clé n'est pas dans les variables d'environnement de Render  
**Solution** : Ajoute la clé dans Render → Environment

### 2. "Invalid API key"
**Cause** : La clé est incorrecte ou expirée  
**Solution** : Crée une nouvelle clé sur https://openrouter.ai/keys

### 3. "Rate limit exceeded"
**Cause** : Trop de requêtes (peu probable avec le modèle gratuit)  
**Solution** : Attends quelques minutes

### 4. "Model not found"
**Cause** : Le modèle n'existe plus  
**Solution** : Change le modèle dans `src/app/api/chat/route.ts`

---

## 🎯 Prochaines Étapes

1. ✅ **Obtenir la clé OpenRouter** (https://openrouter.ai/keys)
2. ✅ **Ajouter la clé sur Render** (Environment Variables)
3. ✅ **Attendre le redéploiement** (2-3 min)
4. ✅ **Tester Glowee Chat** sur l'app
5. ✅ **Vérifier les logs** sur Render

---

## 📞 Support

Si ça ne fonctionne toujours pas :

1. **Vérifie les logs Render** → Cherche les erreurs
2. **Vérifie que la clé est bien ajoutée** → Environment Variables
3. **Vérifie que Render a bien redéployé** → Logs
4. **Teste avec un message simple** : "Salut"

---

## 🎉 Résultat Attendu

Après configuration, Glowee devrait répondre comme ça :

**Toi** : "Salut Glowee !"  
**Glowee** : "Salut ma belle ! 💖 Comment vas-tu aujourd'hui ? Je suis là pour t'accompagner dans ton glow up ! ✨"

---

**Prêt à configurer OpenRouter ! 🚀**

