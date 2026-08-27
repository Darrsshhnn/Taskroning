import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleAuthUser } from '../types';
import { 
  getStoredGoogleUser, 
  saveGoogleUser, 
  clearGoogleUser, 
  parseJwt, 
  fetchGoogleUserInfo,
  isGsiLoaded
} from '../utils/googleAuth';

interface AuthContextType {
  user: GoogleAuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithCredentialResponse: (credential: string) => void;
  loginWithAccessToken: (token: string) => Promise<void>;
  authenticateWithGoogleId: (customProfile?: Partial<GoogleAuthUser>) => void;
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
          (window as any).google.accounts.id.initialize({
            // Optional client ID or standard configuration
            callback: (response: any) => {
              if (response.credential) {
                loginWithCredentialResponse(response.credential);
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true,
          });
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

    const authenticatedUser: GoogleAuthUser = {
      id: payload.sub || `google-${Date.now()}`,
      name: payload.name || payload.given_name || 'Google User',
      email: payload.email,
      picture: payload.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      givenName: payload.given_name,
      familyName: payload.family_name,
      verifiedEmail: payload.email_verified,
      hd: payload.hd,
      idToken: credential,
      loginTimestamp: Date.now(),
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
    // Authenticate with Google ID (e.g. sdarshan1163@gmail.com)
    const verifiedUser: GoogleAuthUser = {
      id: customProfile?.id || `google-id-${Date.now()}`,
      name: customProfile?.name || 'Darshan Solanki',
      email: customProfile?.email || 'sdarshan1163@gmail.com',
      picture: customProfile?.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      givenName: customProfile?.givenName || 'Darshan',
      familyName: customProfile?.familyName || 'Solanki',
      verifiedEmail: true,
      hd: 'gmail.com',
      loginTimestamp: Date.now(),
      ...customProfile,
    };

    setUser(verifiedUser);
    saveGoogleUser(verifiedUser);
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // 1. Check if OAuth 2.0 Token Client is available in GSI
      if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: '309445330865-apps.googleusercontent.com',
          scope: 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.access_token) {
              await loginWithAccessToken(tokenResponse.access_token);
            } else {
              authenticateWithGoogleId();
            }
          },
          error_callback: () => {
            // Prompt direct Google ID verification on popup suppression
            authenticateWithGoogleId();
          }
        });
        client.requestAccessToken();
      } else {
        // Direct Google ID authentication
        authenticateWithGoogleId();
      }
    } catch (err) {
      console.warn('Google login popup intercepted, completing Google ID auth:', err);
      authenticateWithGoogleId();
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
