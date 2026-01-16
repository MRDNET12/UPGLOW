# Firebase Configuration - UPGLOW

## 📋 Configuration

Firebase est configuré et prêt à être utilisé dans l'application UPGLOW.

### Fichier de configuration

Le fichier de configuration Firebase se trouve dans : `src/lib/firebase.ts`

### Services disponibles

- ✅ **Firebase App** - Initialisé et prêt
- ✅ **Analytics** - Configuré (uniquement côté client)
- 🔜 **Autres services** - À configurer selon les besoins

## 🚀 Utilisation

### Importer Firebase dans vos composants

```typescript
import { app, analytics } from '@/lib/firebase';
```

### Exemple d'utilisation d'Analytics

```typescript
'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

export default function MyComponent() {
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_title: 'My Page',
        page_location: window.location.href
      });
    }
  }, []);

  return <div>My Component</div>;
}
```

## 🔐 Sécurité

Les credentials Firebase sont :
- ✅ Stockés dans `src/lib/firebase.ts` avec des valeurs par défaut
- ✅ Peuvent être surchargés via variables d'environnement (`.env.local`)
- ✅ Les clés API Firebase publiques sont sécurisées par les règles Firebase

### Variables d'environnement (optionnel)

Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=votre_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=votre_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=votre_measurement_id
```

## 📦 Services Firebase disponibles

### À ajouter selon les besoins :

```typescript
// Authentication
import { getAuth } from 'firebase/auth';
const auth = getAuth(app);

// Firestore Database
import { getFirestore } from 'firebase/firestore';
const db = getFirestore(app);

// Storage
import { getStorage } from 'firebase/storage';
const storage = getStorage(app);

// Cloud Functions
import { getFunctions } from 'firebase/functions';
const functions = getFunctions(app);

// Remote Config
import { getRemoteConfig } from 'firebase/remote-config';
const remoteConfig = getRemoteConfig(app);
```

## 📝 Notes

- Firebase est initialisé une seule fois pour éviter les duplications
- Analytics est uniquement disponible côté client (browser)
- Les services supplémentaires peuvent être ajoutés selon les besoins futurs

## 🔗 Ressources

- [Documentation Firebase](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/project/upglow-b07ec)
- [Analytics Dashboard](https://console.firebase.google.com/project/upglow-b07ec/analytics)

