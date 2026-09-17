import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider, db, storage, firebaseConfig } from '../lib/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { GoogleAuthUser, UserProfile, AuthErrorInfo } from '../types';
import { ADMIN_EMAIL, isAdminEmail, purgeLegacyStorage } from '../utils/googleAuth';
import { parseAuthError } from '../utils/authErrors';

interface AuthContextType {
  user: GoogleAuthUser | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  error: string | null;
  authError: AuthErrorInfo | null;
  loginWithGoogle: () => Promise<void>;
  loginWithGoogleRedirect: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<string>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GoogleAuthUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<AuthErrorInfo | null>(null);

  // Clear legacy localStorage data on initial load
  useEffect(() => {
    purgeLegacyStorage();
  }, []);

  // Check redirect result on mount (for mobile / redirect flows)
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log('[Firebase Auth] Successful redirect sign-in for:', result.user.email);
        }
      })
      .catch((err: any) => {
        console.error('[Firebase Redirect Error] Code:', err?.code, 'Message:', err?.message, err);
        const parsed = parseAuthError(err, firebaseConfig.projectId);
        setAuthError(parsed);
        setError(parsed.message);
      });
  }, []);

  // Listen to Firebase Auth state change (Real session persistence)
  useEffect(() => {
    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
        unsubscribeFirestore = null;
      }

      if (fbUser) {
        setFirebaseUser(fbUser);
        const email = fbUser.email?.toLowerCase() || '';
        const isUserAdmin = isAdminEmail(email);

        // Immediate responsive fallback from Google Auth credentials
        const photo = fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
        setUser({
          id: fbUser.uid,
          uid: fbUser.uid,
          name: fbUser.displayName || 'Taskroning Member',
          email: email,
          picture: photo,
          photoURL: photo,
          profileImageType: 'upload',
          role: isUserAdmin ? 'Workspace Administrator' : 'Product Designer',
          loginTimestamp: Date.now(),
          isAdmin: isUserAdmin,
        });

        const userDocRef = doc(db, 'users', fbUser.uid);
        let hasInitialized = false;

        // Live listener to Firestore user document for real-time profile updates
        unsubscribeFirestore = onSnapshot(
          userDocRef, 
          async (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              const livePhoto = data.photoURL || fbUser.photoURL || photo;
              setUser({
                id: fbUser.uid,
                uid: fbUser.uid,
                name: data.name || fbUser.displayName || 'Taskroning Member',
                email: email,
                picture: livePhoto,
                photoURL: livePhoto,
                profileImageType: data.profileImageType || 'upload',
                role: data.role || (isUserAdmin ? 'Workspace Administrator' : 'Product Designer'),
                loginTimestamp: Date.now(),
                isAdmin: isUserAdmin,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
              });
              setIsLoading(false);
            } else if (!hasInitialized) {
              hasInitialized = true;
              // Document does not exist yet (brand new account) - seed default profile
              const initialData = {
                id: fbUser.uid,
                name: fbUser.displayName || 'Taskroning Member',
                email: email,
                photoURL: photo,
                profileImageType: 'upload',
                role: isUserAdmin ? 'Workspace Administrator' : 'Product Designer',
                timeZone: 'UTC',
                address: '',
                phoneNumber: '',
                description: '',
                skills: ['Task Scheduling', 'Workflow Management'],
                leaves: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              try {
                await setDoc(userDocRef, initialData, { merge: true });
              } catch (seedErr) {
                console.warn('Initial profile seed notice:', seedErr);
              }
              setIsLoading(false);
            } else {
              setIsLoading(false);
            }
          }, 
          (err) => {
            console.warn('Firestore user profile listener note:', err);
            setIsLoading(false);
          }
        );
      } else {
        setFirebaseUser(null);
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, []);

  // 1. Real Google Authentication via Firebase Google Provider (Popup)
  const loginWithGoogle = async () => {
    setError(null);
    setAuthError(null);
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('[Firebase Auth Error] Code:', err?.code, 'Message:', err?.message, err);
      const parsed = parseAuthError(err, firebaseConfig.projectId);
      setAuthError(parsed);
      setError(parsed.message);
      setIsLoading(false);
    }
  };

  // 1b. Real Google Authentication via Redirect (Robust for strict browsers & mobile)
  const loginWithGoogleRedirect = async () => {
    setError(null);
    setAuthError(null);
    setIsLoading(true);
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (err: any) {
      console.error('[Firebase Redirect Error] Code:', err?.code, 'Message:', err?.message, err);
      const parsed = parseAuthError(err, firebaseConfig.projectId);
      setAuthError(parsed);
      setError(parsed.message);
      setIsLoading(false);
    }
  };

  // 2. Real Sign Out terminating the Firebase session
  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      purgeLegacyStorage();
    } catch (err: any) {
      console.error('Sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Update User Profile in Firestore
  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!firebaseUser) throw new Error('No authenticated user session');
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const payload: any = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    if (updates.avatarUrl) {
      payload.photoURL = updates.avatarUrl;
    }
    await setDoc(userDocRef, payload, { merge: true });
  };

  // 4. Upload Profile Image to Firebase Storage
  const uploadProfileImage = async (file: File): Promise<string> => {
    if (!firebaseUser) throw new Error('No authenticated user session');

    // Attempt Firebase Storage upload
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const storageRef = ref(storage, `users/${firebaseUser.uid}/avatar_${Date.now()}.${ext}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      await updateUserProfile({
        avatarUrl: downloadURL,
        profileImageType: 'upload',
      });
      return downloadURL;
    } catch (storageErr) {
      console.warn('Firebase storage upload fallback to base64 data URL:', storageErr);
      // Resilient fallback: Convert file to Base64 and persist in Firestore
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Url = reader.result as string;
          try {
            await updateUserProfile({
              avatarUrl: base64Url,
              profileImageType: 'upload',
            });
            resolve(base64Url);
          } catch (e) {
            reject(e);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  };

  const clearError = () => {
    setError(null);
    setAuthError(null);
  };

  const isAdmin = !!user?.isAdmin || (!!firebaseUser?.email && isAdminEmail(firebaseUser.email));

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!firebaseUser,
        isLoading,
        isAdmin,
        error,
        authError,
        loginWithGoogle,
        loginWithGoogleRedirect,
        logout,
        updateUserProfile,
        uploadProfileImage,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
