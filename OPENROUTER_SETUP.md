# 🚀 Configuration OpenRouter pour UPGLOW

## 📝 Qu'est-ce qu'OpenRouter ?

**OpenRouter** est une plateforme qui donne accès à **tous les meilleurs modèles d'IA** avec une seule API :
- ✅ GPT-4, GPT-3.5 (OpenAI)
- ✅ Claude 3.5 Sonnet, Claude 3 (Anthropic)
- ✅ Gemini 2.0, Gemini 1.5 (Google)
- ✅ Llama 3, Mixtral (Open Source)
- ✅ Et bien d'autres !

**Avantages** :
- 🎯 Une seule clé API pour tous les modèles
- 💰 Souvent moins cher que les API directes
- 🔄 Facile de changer de modèle
- 📊 Dashboard pour suivre l'utilisation
- 🆓 Modèles gratuits disponibles !

---

## 🔑 Obtenir une Clé API OpenRouter

### 1. Créer un Compte

1. Va sur https://openrouter.ai/
2. Clique sur **"Sign In"** (en haut à droite)
3. Connecte-toi avec Google ou GitHub
4. C'est gratuit ! ✅

### 2. Obtenir la Clé API

1. Une fois connecté, va sur https://openrouter.ai/keys
2. Clique sur **"Create Key"**
3. Donne un nom à ta clé : `UPGLOW`
4. Copie la clé (elle commence par `sk-or-v1-...`)
5. ⚠️ **Sauvegarde-la bien, tu ne pourras plus la revoir !**

### 3. Ajouter des Crédits (Optionnel)

- OpenRouter offre des **modèles gratuits** (comme Gemini 2.0 Flash)
- Si tu veux utiliser GPT-4 ou Claude, ajoute des crédits :
  - Va sur https://openrouter.ai/credits
  - Ajoute $5-10 pour commencer
  - Tu peux suivre ta consommation en temps réel

---

## ⚙️ Configuration sur Render

### 1. Ajouter la Variable d'Environnement

1. Va sur https://render.com
2. Sélectionne ton service **UPGLOW2**
3. Va dans l'onglet **"Environment"**
4. Clique sur **"Add Environment Variable"**
5. Ajoute :
   - **Key** : `OPENROUTER_API_KEY`
   - **Value** : `sk-or-v1-...` (ta clé OpenRouter)
6. Clique sur **"Save Changes"**

### 2. Redéployer

Render va automatiquement redéployer l'application avec la nouvelle clé ! 🚀

---

## 🎯 Modèles Utilisés dans UPGLOW

### Glowee Chat (Conversation)
**Modèle** : `google/gemini-2.0-flash-exp:free`
- ✅ **Gratuit** !
- ⚡ Très rapide
- 💬 Excellent pour les conversations
- 🌍 Multilingue

### Glowee Work (Analyse d'Objectifs)
**Modèle** : `google/gemini-2.0-flash-exp:free`
- ✅ **Gratuit** !
- 🧠 Très intelligent
- 📊 Excellent pour l'analyse et la planification
- 📝 Génère du JSON structuré

---

## 🔄 Changer de Modèle (Optionnel)

Si tu veux utiliser un autre modèle (GPT-4, Claude, etc.), édite les fichiers :

### Pour Glowee Chat
**Fichier** : `src/app/api/chat/route.ts`
**Ligne 64** : Change le modèle

```typescript
model: 'google/gemini-2.0-flash-exp:free', // Modèle actuel (gratuit)
```

**Autres options** :
```typescript
// Gratuits
model: 'google/gemini-2.0-flash-exp:free',
model: 'meta-llama/llama-3.1-8b-instruct:free',

// Payants (meilleurs)
model: 'anthropic/claude-3.5-sonnet', // Le meilleur !
model: 'openai/gpt-4-turbo',
model: 'google/gemini-pro-1.5',
```

### Pour Glowee Work
**Fichier** : `src/app/api/glowee-work/route.ts`
**Ligne 126** : Change le modèle (même syntaxe)

---

## 💰 Tarification

### Modèles Gratuits
- ✅ `google/gemini-2.0-flash-exp:free` - **GRATUIT**
- ✅ `meta-llama/llama-3.1-8b-instruct:free` - **GRATUIT**
- ✅ `google/gemini-flash-1.5:free` - **GRATUIT**

### Modèles Payants (Exemples)
- 💎 `anthropic/claude-3.5-sonnet` - ~$3 / 1M tokens
- 🤖 `openai/gpt-4-turbo` - ~$10 / 1M tokens
- 🧠 `google/gemini-pro-1.5` - ~$1 / 1M tokens

**Estimation pour UPGLOW** :
- 1 conversation = ~10 messages
- 1 message = ~500 tokens
- 1 conversation = ~5000 tokens = **$0.015** (avec Claude)
- 100 conversations = **$1.50**

Avec les modèles gratuits, c'est **$0** ! 🎉

---

## 📊 Suivre l'Utilisation

1. Va sur https://openrouter.ai/activity
2. Tu verras :
   - Nombre de requêtes
   - Tokens utilisés
   - Coût total
   - Modèles utilisés

---

## 🐛 Dépannage

### L'IA ne répond pas

1. **Vérifie la clé API sur Render** :
   - Va dans Environment
   - Vérifie que `OPENROUTER_API_KEY` existe
   - Vérifie qu'elle commence par `sk-or-v1-`

2. **Vérifie les logs sur Render** :
   - Va dans l'onglet "Logs"
   - Cherche des erreurs avec "OpenRouter"

3. **Vérifie les crédits** :
   - Va sur https://openrouter.ai/credits
   - Si tu utilises un modèle payant, vérifie que tu as des crédits

### Erreur "Model not found"

- Le nom du modèle est incorrect
- Vérifie la liste des modèles : https://openrouter.ai/models

### Erreur "Insufficient credits"

- Tu utilises un modèle payant sans crédits
- Ajoute des crédits ou utilise un modèle gratuit

---

## ✅ Checklist de Configuration

- [ ] Compte OpenRouter créé
- [ ] Clé API générée
- [ ] Clé API ajoutée sur Render (`OPENROUTER_API_KEY`)
- [ ] Application redéployée
- [ ] Test de Glowee Chat
- [ ] Test de Glowee Work

---

## 🎉 Résultat

Une fois configuré, tu auras :
- ✅ Glowee Chat fonctionnel
- ✅ Glowee Work fonctionnel
- ✅ Modèles gratuits et performants
- ✅ Possibilité de changer de modèle facilement
- ✅ Dashboard pour suivre l'utilisation

**Prêt à tester ! 🚀**

