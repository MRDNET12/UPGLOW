# 🔄 Migration vers Google Gemini

## 🎯 Pourquoi ce Changement ?

L'API Grok (xAI) nécessite des crédits payants. Nous avons migré vers **Google Gemini** qui est :

- ✅ **100% Gratuit** (quota généreux)
- ✅ **Très performant** pour la génération de tâches
- ✅ **Pas de carte bancaire** requise
- ✅ **API simple** et bien documentée

---

## 🚀 Configuration

### 1. Obtenir une Clé API Google Gemini

1. Va sur : https://aistudio.google.com/app/apikey
2. Clique sur **"Get API Key"** ou **"Create API Key"**
3. Sélectionne ou crée un projet Google Cloud (gratuit)
4. Copie ta clé API

### 2. Ajouter la Clé dans `.env.local`

```bash
# Google Gemini API Key (GRATUIT)
GOOGLE_GEMINI_API_KEY=ta_clé_api_ici
```

### 3. Redémarrer le Serveur

```bash
# Arrête le serveur (Ctrl+C)
# Puis relance :
npm run dev
```

---

## 📊 Comparaison Grok vs Gemini

| Critère | Grok (xAI) | Google Gemini |
|---------|------------|---------------|
| **Prix** | Payant (crédits requis) | **Gratuit** ✅ |
| **Performance** | Excellent | Excellent |
| **Quota gratuit** | ❌ Non | ✅ Oui (généreux) |
| **Carte bancaire** | Requise | **Non requise** ✅ |
| **Vitesse** | Rapide | Rapide |
| **Qualité** | Très bonne | Très bonne |

---

## 🔧 Changements Techniques

### Fichiers Modifiés

1. **`src/app/api/goals/analyze/route.ts`**
   - Remplacement de l'endpoint Grok par Gemini
   - Adaptation du format de requête
   - Adaptation du parsing de réponse

2. **`.env.local`**
   - Ajout de `GOOGLE_GEMINI_API_KEY`
   - Commentaire de `XAI_API_KEY`

3. **`.env.example`**
   - Documentation de la nouvelle clé API
   - Marquage de Grok comme optionnel

---

## 📝 Détails de l'API Gemini

### Endpoint Utilisé

```
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
```

### Modèle

- **gemini-1.5-flash** : Rapide et efficace pour la génération de tâches

### Configuration

```javascript
{
  temperature: 0.7,      // Créativité modérée
  topK: 40,              // Diversité des réponses
  topP: 0.95,            // Qualité des réponses
  maxOutputTokens: 2048  // Longueur maximale
}
```

---

## ✅ Avantages de Gemini

### 1. **Gratuit et Généreux**
- Quota quotidien très élevé
- Pas de limite stricte pour les petits projets
- Pas de carte bancaire requise

### 2. **Performant**
- Génération rapide de tâches
- Compréhension contextuelle excellente
- Réponses structurées en JSON

### 3. **Fiable**
- API stable de Google
- Documentation complète
- Support actif

---

## 🧪 Test de l'API

Pour tester que tout fonctionne :

1. **Ouvre l'application** : http://localhost:3000
2. **Va dans "Mes Objectifs"**
3. **Clique sur "Créer un objectif"**
4. **Remplis le formulaire** :
   - Type : Financier
   - Nom : "Atteindre 5000€ de CA"
   - CA attendu : 5000
   - Durée : 6 mois
   - Compétence : Intermédiaire
   - Pourquoi : "Je veux être indépendante"
   - Ressenti : "Je me sentirai fière"
   - Deadline : Dans 6 mois
5. **Clique sur "Analyser avec Glowee"**
6. **Vérifie que les tâches sont générées** ✨

---

## 🐛 Dépannage

### Erreur : "Failed to analyze goal with Gemini"

**Causes possibles :**
1. Clé API invalide ou manquante
2. Quota dépassé (rare)
3. Serveur non redémarré

**Solutions :**
1. Vérifie que `GOOGLE_GEMINI_API_KEY` est bien dans `.env.local`
2. Vérifie que la clé est correcte (copie-colle depuis Google AI Studio)
3. Redémarre le serveur : `npm run dev`

### Erreur : "Invalid API key"

**Solution :**
1. Va sur https://aistudio.google.com/app/apikey
2. Crée une nouvelle clé API
3. Remplace la clé dans `.env.local`
4. Redémarre le serveur

---

## 📚 Ressources

- **Google AI Studio** : https://aistudio.google.com/
- **Documentation Gemini** : https://ai.google.dev/docs
- **Obtenir une clé API** : https://aistudio.google.com/app/apikey

---

## 🔮 Futur : Retour à Grok (Optionnel)

Si tu veux revenir à Grok plus tard (quand tu auras des crédits) :

1. Décommente `XAI_API_KEY` dans `.env.local`
2. Modifie `src/app/api/goals/analyze/route.ts` pour utiliser Grok
3. Redémarre le serveur

Ou mieux : on peut créer un **système de fallback** qui utilise Gemini si Grok échoue !

---

## ✨ Résumé

- ✅ Migration vers Google Gemini (gratuit)
- ✅ Clé API configurée
- ✅ Code modifié et testé
- ✅ Documentation mise à jour
- ✅ Prêt à utiliser !

**Profite de l'IA gratuite de Google ! 🚀**

