# 🚨 SOLUTION RAPIDE - Chrome ne fonctionne pas

## ⚡ Solution en 3 Étapes (30 secondes)

### Étape 1 : Ouvrir la page de réinitialisation
```
http://localhost:3000/unregister-sw.html
```
(En production : remplacez `localhost:3000` par votre domaine)

### Étape 2 : Cliquer sur le bouton
Cliquez sur le gros bouton **"Tout Réinitialiser"**

### Étape 3 : Recharger
Fermez tous les onglets UPGLOW et rouvrez l'application

---

## ✅ C'est Réglé !

L'application devrait maintenant fonctionner parfaitement dans Chrome.

---

## 🤔 Pourquoi ce problème ?

Le Service Worker (système de cache PWA) avait mis en cache une ancienne version de l'application.

Chrome en mode privé fonctionnait car il n'utilise pas le cache.

---

## 🛠️ Solution Alternative (Manuelle)

Si la solution rapide ne fonctionne pas :

1. **Ouvrir DevTools** : Appuyez sur `F12`
2. **Onglet Application** : Cliquez sur l'onglet "Application"
3. **Storage** : Dans le menu de gauche, cliquez sur "Storage"
4. **Clear site data** : Cliquez sur le bouton "Clear site data"
5. **Recharger** : Appuyez sur `Ctrl + Shift + R`

---

## 📞 Besoin d'Aide ?

Consultez le guide complet : `TROUBLESHOOTING.md`

