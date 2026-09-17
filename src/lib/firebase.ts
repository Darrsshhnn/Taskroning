import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfigJson from '../../firebase-applet-config.json';

// Construct Firebase configuration with Vite environment variable overrides
// This allows seamless deployments to Vercel, Netlify, and Cloudflare
export const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY as string) || firebaseConfigJson.apiKey,
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) || firebaseConfigJson.authDomain,
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || firebaseConfigJson.projectId,
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) || firebaseConfigJson.storageBucket,
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || firebaseConfigJson.messagingSenderId,
  appId: (import.meta.env.VITE_FIREBASE_APP_ID as string) || firebaseConfigJson.appId,
  measurementId: (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string) || firebaseConfigJson.measurementId || '',
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.warn('[Firebase Configuration Warning] Missing apiKey or projectId in Firebase configuration.', {
    hasEnvApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
    hasJsonApiKey: !!firebaseConfigJson.apiKey,
    projectId: firebaseConfig.projectId,
  });
}

// Initialize or reuse Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase Services
export const auth = getAuth(app);

// Initialize Firestore with resilient auto-detect long polling for iframes, proxies, and edge networks
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  }, (firebaseConfigJson as any).firestoreDatabaseId);
} catch {
  firestoreDb = getFirestore(app, (firebaseConfigJson as any).firestoreDatabaseId);
}
export const db = firestoreDb;

export const storage = getStorage(app);

// Google Auth Provider configured for account selection
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});
