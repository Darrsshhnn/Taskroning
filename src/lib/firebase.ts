import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize or reuse Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase Services
export const auth = getAuth(app);

// Initialize Firestore with resilient auto-detect long polling for iframes/proxies
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  }, (firebaseConfig as any).firestoreDatabaseId);
} catch {
  firestoreDb = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
}
export const db = firestoreDb;

export const storage = getStorage(app);

// Google Auth Provider configured for account selection
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});
