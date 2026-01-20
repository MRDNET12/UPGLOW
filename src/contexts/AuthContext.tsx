'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserData {
  email: string;
  hasPaid: boolean;
  createdAt: string;
  registrationDate: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserPaidStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Écouter les changements d'authentification
  useEffect(() => {
    // Si Firebase n'est pas configuré, on skip l'authentification
    if (!auth || !db) {
      console.warn('Firebase not configured, skipping authentication');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user && db) {
        // Récupérer les données utilisateur depuis Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Inscription
  const signUp = async (email: string, password: string) => {
    if (!auth || !db) {
      throw new Error('Firebase n\'est pas configuré');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Créer le document utilisateur dans Firestore
      const userData: UserData = {
        email: user.email || email,
        hasPaid: false,
        createdAt: new Date().toISOString(),
        registrationDate: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      setUserData(userData);
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Erreur lors de l\'inscription');
    }
  };

  // Connexion
  const signIn = async (email: string, password: string) => {
    if (!auth) {
      throw new Error('Firebase n\'est pas configuré');
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Erreur lors de la connexion');
    }
  };

  // Déconnexion
  const signOut = async () => {
    if (!auth) {
      throw new Error('Firebase n\'est pas configuré');
    }

    try {
      await firebaseSignOut(auth);
      setUserData(null);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Erreur lors de la déconnexion');
    }
  };

  // Mettre à jour le statut de paiement
  const updateUserPaidStatus = async () => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    if (!db) {
      throw new Error('Firebase n\'est pas configuré');
    }

    try {
      await setDoc(doc(db, 'users', user.uid), {
        hasPaid: true
      }, { merge: true });

      // Mettre à jour l'état local
      setUserData(prev => prev ? { ...prev, hasPaid: true } : null);
    } catch (error: any) {
      console.error('Update paid status error:', error);
      throw new Error(error.message || 'Erreur lors de la mise à jour');
    }
  };

  const value = {
    user,
    userData,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserPaidStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

