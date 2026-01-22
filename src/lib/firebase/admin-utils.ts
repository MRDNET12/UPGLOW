import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Liste des emails administrateurs
 */
const ADMIN_EMAILS = [
  'miroidi40@gmail.com'
];

/**
 * Vérifie si un email est un email administrateur
 */
export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * Donne le statut admin et l'accès payant à un utilisateur par email
 * Cette fonction peut être appelée depuis la console du navigateur
 */
export async function grantAdminAccess(email: string): Promise<void> {
  if (!db) {
    throw new Error('Firebase not configured');
  }

  try {
    // Rechercher l'utilisateur par email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.error(`No user found with email: ${email}`);
      throw new Error(`Aucun utilisateur trouvé avec l'email: ${email}`);
    }

    // Mettre à jour chaque utilisateur trouvé (normalement il n'y en a qu'un)
    const promises = snapshot.docs.map(async (userDoc) => {
      const userRef = doc(db, 'users', userDoc.id);
      await setDoc(userRef, {
        hasPaid: true,
        isAdmin: true
      }, { merge: true });
      
      console.log(`✅ Admin access granted to ${email} (UID: ${userDoc.id})`);
    });

    await Promise.all(promises);
    console.log(`✅ Successfully granted admin access to ${email}`);
  } catch (error) {
    console.error('Error granting admin access:', error);
    throw error;
  }
}

/**
 * Vérifie le statut admin d'un utilisateur par email
 */
export async function checkAdminStatus(email: string): Promise<void> {
  if (!db) {
    throw new Error('Firebase not configured');
  }

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log(`❌ No user found with email: ${email}`);
      return;
    }

    snapshot.docs.forEach((userDoc) => {
      const data = userDoc.data();
      console.log(`User: ${email} (UID: ${userDoc.id})`);
      console.log(`  - hasPaid: ${data.hasPaid}`);
      console.log(`  - isAdmin: ${data.isAdmin}`);
      console.log(`  - createdAt: ${data.createdAt}`);
    });
  } catch (error) {
    console.error('Error checking admin status:', error);
    throw error;
  }
}

// Exposer les fonctions dans window pour utilisation dans la console
if (typeof window !== 'undefined') {
  (window as any).grantAdminAccess = grantAdminAccess;
  (window as any).checkAdminStatus = checkAdminStatus;
}

