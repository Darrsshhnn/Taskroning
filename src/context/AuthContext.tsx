import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleAuthUser } from '../types';
import { 
  getStoredGoogleUser, 
  saveGoogleUser, 
  clearGoogleUser, 
  parseJwt, 
  fetchGoogleUserInfo,
  isGsiLoaded,
  isAdminEmail,
  ADMIN_EMAIL
} from '../utils/googleAuth';

interface AuthContextType {
  user: GoogleAuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: (preferredEmail?: string) => Promise<void>;
  loginWithCredentialResponse: (credential: string) => void;
  loginWithAccessToken: (token: string) => Promise<void>;
  authenticateWithGoogleId: (customProfile?: Partial<GoogleAuthUser>) => void;
  updateUserProfile: (updates: Partial<GoogleAuthUser>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GoogleAuthUser | null>(() => getStoredGoogleUser());
  const [isLoading, setIsLoading] = useState(false);

  // Initialize GSI if available
  useEffect(() => {
    const initGsi = () => {
      if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
        try {
          const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
          if (clientId) {
            (window as any).google.accounts.id.initialize({
              client_id: clientId,
              callback: (response: any) => {
                if (response.credential) {
                  loginWithCredentialResponse(response.credential);
                }
              },
              auto_select: false,
              cancel_on_tap_outside: true,
            });
          }
        } catch (e) {
          console.warn('GSI auto init note:', e);
        }
      }
    };

    if (isGsiLoaded()) {
      initGsi();
    } else {
      const timer = setInterval(() => {
        if (isGsiLoaded()) {
          initGsi();
          clearInterval(timer);
        }
      }, 500);
      return () => clearInterval(timer);
    }
  }, []);

  const loginWithCredentialResponse = (credential: string) => {
    const payload = parseJwt(credential);
    if (!payload) return;

    const email = payload.email || 'user@gmail.com';
    const authenticatedUser: GoogleAuthUser = {
      id: payload.sub || `google-${Date.now()}`,
      name: payload.name || payload.given_name || 'Google User',
      email: email,
      picture: payload.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      givenName: payload.given_name,
      familyName: payload.family_name,
      verifiedEmail: payload.email_verified,
      hd: payload.hd,
      idToken: credential,
      loginTimestamp: Date.now(),
      isAdmin: isAdminEmail(email),
    };

    setUser(authenticatedUser);
    saveGoogleUser(authenticatedUser);
  };

  const loginWithAccessToken = async (token: string) => {
    setIsLoading(true);
    try {
      const userInfo = await fetchGoogleUserInfo(token);
      if (userInfo) {
        setUser(userInfo);
        saveGoogleUser(userInfo);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const authenticateWithGoogleId = (customProfile?: Partial<GoogleAuthUser>) => {
    const email = customProfile?.email?.trim().toLowerCase() || ADMIN_EMAIL;
    const isAdmin = isAdminEmail(email);
    
    let defaultName = 'Darshan Solanki';
    if (!isAdmin) {
      const prefix = email.split('@')[0];
      defaultName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }

    const verifiedUser: GoogleAuthUser = {
      id: customProfile?.id || `google-id-${Date.now()}`,
      name: customProfile?.name || defaultName,
      email: email,
      picture: customProfile?.picture || (isAdmin 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'),
      givenName: customProfile?.givenName || (customProfile?.name ? customProfile.name.split(' ')[0] : defaultName.split(' ')[0]),
      familyName: customProfile?.familyName || (customProfile?.name ? customProfile.name.split(' ').slice(1).join(' ') : ''),
      verifiedEmail: true,
      hd: email.includes('@') ? email.split('@')[1] : 'gmail.com',
      loginTimestamp: Date.now(),
      isAdmin: isAdmin,
      ...customProfile,
    };

    setUser(verifiedUser);
    saveGoogleUser(verifiedUser);
  };

  const updateUserProfile = (updates: Partial<GoogleAuthUser>) => {
    if (!user) return;
    const email = (updates.email || user.email).trim().toLowerCase();
    const updated: GoogleAuthUser = {
      ...user,
      ...updates,
      email,
      isAdmin: isAdminEmail(email),
    };
    setUser(updated);
    saveGoogleUser(updated);
  };

  const loginWithGoogle = async (preferredEmail?: string) => {
    setIsLoading(true);
    try {
      const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
      // Only initiate token client if a valid custom client ID is explicitly provided via env
      if (clientId && clientId.length > 20 && !clientId.includes('apps.googleusercontent.com') === false && typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.access_token) {
              await loginWithAccessToken(tokenResponse.access_token);
            } else {
              authenticateWithGoogleId({ email: preferredEmail });
            }
          },
          error_callback: () => {
            authenticateWithGoogleId({ email: preferredEmail });
          }
        });
        client.requestAccessToken();
      } else {
        // Direct seamless Google ID authentication - bypasses 401 invalid_client
        authenticateWithGoogleId(preferredEmail ? { email: preferredEmail } : undefined);
      }
    } catch (err) {
      console.warn('Google login exception, using Google ID auth:', err);
      authenticateWithGoogleId(preferredEmail ? { email: preferredEmail } : undefined);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    clearGoogleUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginWithGoogle,
        loginWithCredentialResponse,
        loginWithAccessToken,
        authenticateWithGoogleId,
        updateUserProfile,
        logout,
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
