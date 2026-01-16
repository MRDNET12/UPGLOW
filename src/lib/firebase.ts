// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyABkaEROrVUV-zy4DJ5yQprwv_HFVFSU1E",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "upglow-b07ec.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "upglow-b07ec",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "upglow-b07ec.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "760517731412",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:760517731412:web:30d80753ada053008879c1",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-DT3RDBNF0T"
};

// Initialize Firebase
let app: FirebaseApp;
let analytics: Analytics | null = null;
let auth: Auth;
let db: Firestore;

// Prevent multiple initializations
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize services
auth = getAuth(app);
db = getFirestore(app);

// Initialize Analytics only in browser environment
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, analytics, auth, db };

