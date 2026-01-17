# 🚀 Déploiement sur Render

## ✅ Checklist Avant Déploiement

- [x] Clé API XAI ajoutée sur Render (`XAI_API_KEY`)
- [x] Code sans erreurs de compilation
- [x] Tous les chemins d'images corrigés
- [x] Popups Glowee intégrés
- [x] Système de tracking créé

---

## 📝 Étapes de Déploiement

### 1. **Commit et Push sur GitHub**

```bash
# Ajouter tous les fichiers modifiés
git add .

# Créer un commit
git commit -m "✨ Intégration complète de Glowee + Fix IA (XAI)"

# Pousser sur GitHub
git push origin main
```

### 2. **Vérifier sur Render**

1. Va sur https://render.com
2. Connecte-toi à ton compte
3. Sélectionne ton service (UPGLOW2)
4. Render va automatiquement détecter le push et redéployer
5. Attends que le statut passe à "Live" (2-3 minutes)

---

## 🔍 Vérifications Après Déploiement

### 1. **Tester l'IA** (5 min)

#### Glowee Chat
1. Ouvre l'app
2. Va dans la section Glowee (chat)
3. Envoie un message : "Bonjour Glowee !"
4. ✅ Glowee devrait répondre

#### Glowee Work
1. Va dans "Mes Objectifs"
2. Clique sur "Créer un objectif"
3. Remplis le formulaire
4. Clique sur "Analyser avec Glowee Work"
5. ✅ L'IA devrait analyser et créer un plan

### 2. **Tester les Popups Glowee** (10 min)

#### Dashboard
1. Ouvre l'app (1ère fois)
2. ✅ Popup "Bienvenue dans Glowee" devrait s'afficher
3. Ferme et rouvre l'app 4 fois de plus
4. ✅ À la 5ème ouverture, popup "Tu reviens pour la 5ème fois !"

#### Planning
1. Va dans "Mon Planning"
2. ✅ Popup "Découvre ton Planning" devrait s'afficher

#### Mes Objectifs
1. Va dans "Mes Objectifs"
2. ✅ Popup "Bienvenue dans Mes Objectifs" devrait s'afficher

#### Check-in Énergie
1. Va dans "Mes Objectifs"
2. Clique sur "Check-in Énergie"
3. ✅ Popup "Prends soin de toi" devrait s'afficher

#### Journal
1. Va dans "Journal"
2. ✅ Popup "Bienvenue dans ton Journal" devrait s'afficher

### 3. **Vérifier les Images** (2 min)

1. Vérifie que toutes les images Glowee s'affichent correctement
2. Vérifie qu'il n'y a pas d'images cassées (404)

---

## 🐛 En Cas de Problème

### L'IA ne répond toujours pas

1. Va sur Render → Environment
2. Vérifie que `XAI_API_KEY` est bien présente
3. Vérifie que la valeur commence par `xai-`
4. Si besoin, clique sur "Manual Deploy" pour forcer un redéploiement

### Les popups ne s'affichent pas

1. Ouvre la console du navigateur (F12)
2. Regarde s'il y a des erreurs
3. Vérifie que localStorage fonctionne
4. Essaye en navigation privée (pour reset localStorage)

### Les images ne s'affichent pas

1. Vérifie que le dossier `/public/Glowee/` existe
2. Vérifie que les noms de fichiers sont corrects (avec majuscules)
3. Vérifie les chemins dans le code : `/Glowee/nom-image.webp`

---

## 📊 Logs à Vérifier

### Sur Render

1. Va dans l'onglet "Logs"
2. Cherche des erreurs liées à :
   - `XAI_API_KEY`
   - `chat/route.ts`
   - `glowee-work/route.ts`

### Dans le Navigateur

1. Ouvre la console (F12)
2. Cherche des erreurs liées à :
   - Images 404
   - localStorage
   - Popups

---

## ✅ Checklist Post-Déploiement

- [ ] L'app se charge correctement
- [ ] Glowee Chat répond
- [ ] Glowee Work analyse les objectifs
- [ ] Popup Dashboard s'affiche
- [ ] Popup 5ème visite s'affiche (après 5 visites)
- [ ] Popup Planning s'affiche
- [ ] Popup Objectifs s'affiche
- [ ] Popup Check-in s'affiche
- [ ] Popup Journal s'affiche
- [ ] Toutes les images Glowee s'affichent
- [ ] Pas d'erreurs dans la console

---

## 🎉 Si Tout Fonctionne

**Félicitations ! 🎊**

L'intégration de Glowee est réussie ! Tu peux maintenant :

1. **Profiter de l'app** avec Glowee partout
2. **Ajouter d'autres popups** si besoin (félicitations, encouragements)
3. **Personnaliser les messages** dans `src/data/gloweeMessages.ts`
4. **Ajouter Glowee fixe** dans certaines sections

---

## 📝 Notes Importantes

### Réinitialiser les Popups (pour tester)

Si tu veux revoir les popups de 1ère visite :

1. Ouvre la console du navigateur (F12)
2. Tape : `localStorage.removeItem('glowee_visits')`
3. Rafraîchis la page
4. Les popups s'afficheront à nouveau

### Modifier les Messages

Pour changer les messages Glowee :
1. Édite `src/data/gloweeMessages.ts`
2. Modifie les messages, noms, ou images
3. Commit et push
4. Render redéploiera automatiquement

---

## 🚀 Commandes Rapides

```bash
# Commit et push
git add .
git commit -m "✨ Intégration Glowee"
git push origin main

# Vérifier le statut Git
git status

# Voir les derniers commits
git log --oneline -5
```

---

**Prêt à déployer ! 🚀**

Une fois déployé, teste tout et reviens me dire si ça fonctionne ! 😊

