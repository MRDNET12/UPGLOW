# 🤖 Configuration de l'API Grok (xAI)

## 🎯 Objectif

Intégrer l'API Grok de xAI pour alimenter le chat avec Glowee dans l'application UPGLOW.

---

## 📋 Étapes de Configuration

### 1. Obtenir une Clé API xAI

1. Allez sur [console.x.ai](https://console.x.ai/)
2. Créez un compte ou connectez-vous
3. Naviguez vers **API Keys**
4. Cliquez sur **Create API Key**
5. Copiez votre clé API (elle commence par `xai-...`)

⚠️ **Important** : Gardez cette clé secrète et ne la partagez jamais !

---

### 2. Configurer les Variables d'Environnement

#### En Local

1. Créez un fichier `.env.local` à la racine du projet :

```bash
# .env.local
XAI_API_KEY=xai-votre-cle-api-ici
```

2. Redémarrez le serveur de développement :

```bash
npm run dev
```

#### En Production (Render)

1. Allez dans votre dashboard Render
2. Sélectionnez votre service UPGLOW
3. Allez dans **Environment**
4. Ajoutez une nouvelle variable :
   - **Key** : `XAI_API_KEY`
   - **Value** : `xai-votre-cle-api-ici`
5. Cliquez sur **Save Changes**
6. Render redéploiera automatiquement

---

### 3. Vérifier l'Installation

#### Test en Local

1. Lancez l'application :

```bash
npm run dev
```

2. Ouvrez l'application dans votre navigateur
3. Cliquez sur l'icône de chat Glowee
4. Envoyez un message : "Bonjour Glowee !"
5. Vous devriez recevoir une réponse de Grok

#### Vérifier les Logs

Si le chat ne fonctionne pas, vérifiez les logs :

```bash
# Dans le terminal où tourne npm run dev
# Vous devriez voir les erreurs s'il y en a
```

---

## 🔧 Modèles Disponibles

L'API Grok propose plusieurs modèles :

- **`grok-beta`** (par défaut) - Modèle le plus récent et performant
- **`grok-vision-beta`** - Pour l'analyse d'images (futur)

Le modèle actuel est configuré dans `src/app/api/chat/route.ts` :

```typescript
model: 'grok-beta'
```

---

## 💰 Tarification

Consultez la tarification sur [x.ai/api](https://x.ai/api)

**Estimation pour UPGLOW** :
- 1 conversation = ~10 messages
- 1 message = ~500 tokens (entrée + sortie)
- 1 conversation = ~5000 tokens

Avec un usage modéré, le coût devrait être très faible.

---

## 🎨 Personnalisation de Glowee

Le prompt système de Glowee est défini dans `src/app/api/chat/route.ts` :

```typescript
role: 'system',
content: 'Tu es Glowee, une assistante IA bienveillante et encourageante. 
Tu aides les utilisateurs dans leur parcours de développement personnel 
avec empathie et positivité. Tu réponds toujours dans la langue de 
l\'utilisateur. Tu es chaleureuse, motivante et tu utilises des emojis 
pour rendre la conversation plus agréable. 💫'
```

Vous pouvez modifier ce prompt pour changer la personnalité de Glowee.

---

## 🔐 Sécurité

### Bonnes Pratiques

✅ **À FAIRE** :
- Stocker la clé API dans les variables d'environnement
- Ne jamais commiter `.env.local` dans Git
- Utiliser `.env.example` pour documenter les variables nécessaires
- Limiter les permissions de la clé API si possible

❌ **À NE PAS FAIRE** :
- Mettre la clé API directement dans le code
- Partager la clé API publiquement
- Commiter `.env.local` dans Git

### Fichier `.gitignore`

Vérifiez que `.env.local` est bien dans `.gitignore` :

```
# .gitignore
.env.local
.env*.local
```

---

## 🧪 Test de l'API

Vous pouvez tester l'API directement avec `curl` :

```bash
curl https://api.x.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -d '{
    "model": "grok-beta",
    "messages": [
      {
        "role": "system",
        "content": "Tu es Glowee, une assistante bienveillante."
      },
      {
        "role": "user",
        "content": "Bonjour !"
      }
    ]
  }'
```

---

## 🐛 Dépannage

### Erreur : "XAI_API_KEY not configured"

**Solution** : Vérifiez que la variable d'environnement est bien définie :

```bash
# En local
cat .env.local

# En production (Render)
# Vérifiez dans Environment > Environment Variables
```

### Erreur : "Grok API error: 401"

**Solution** : Votre clé API est invalide ou expirée. Générez-en une nouvelle sur [console.x.ai](https://console.x.ai/).

### Erreur : "Grok API error: 429"

**Solution** : Vous avez dépassé la limite de requêtes. Attendez quelques minutes ou augmentez votre quota.

### Le chat ne répond pas

**Solution** :
1. Vérifiez les logs du serveur
2. Ouvrez la console du navigateur (F12)
3. Vérifiez l'onglet Network pour voir les erreurs API

---

## 📊 Flux de Données

```
Utilisateur → AIChat.tsx
    ↓
use-ai-chat.ts (hook)
    ↓
POST /api/chat
    ↓
Grok API (xAI)
    ↓
Réponse → Utilisateur
```

---

## 🚀 Prochaines Étapes

### Améliorations Possibles

1. **Streaming** : Afficher la réponse en temps réel
2. **Vision** : Permettre à Glowee d'analyser des images
3. **Historique** : Sauvegarder les conversations dans Firestore
4. **Suggestions** : Proposer des questions rapides
5. **Émotions** : Détecter l'humeur de l'utilisateur

---

**Tout est prêt ! 🎉**

Glowee utilise maintenant Grok pour des conversations intelligentes et bienveillantes ! 💫

