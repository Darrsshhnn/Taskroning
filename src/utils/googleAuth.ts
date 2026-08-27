import { GoogleAuthUser } from '../types';

const STORAGE_KEY_AUTH = 'taskroning_google_user_v1';

// Parse JWT ID token payload from Google GSI
export function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT payload:', e);
    return null;
  }
}

// Fetch Google User Profile via userinfo endpoint using access token
export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleAuthUser | null> {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Userinfo request failed: ${res.status}`);
    }

    const data = await res.json();
    const user: GoogleAuthUser = {
      id: data.sub || `google-${Date.now()}`,
      name: data.name || data.given_name || 'Google User',
      email: data.email,
      picture: data.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      givenName: data.given_name,
      familyName: data.family_name,
      verifiedEmail: data.email_verified,
      hd: data.hd,
      accessToken,
      loginTimestamp: Date.now(),
    };

    return user;
  } catch (err) {
    console.warn('Failed to fetch userinfo from Google API:', err);
    return null;
  }
}

// Read current authenticated Google user from storage
export function getStoredGoogleUser(): GoogleAuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (user && user.email && user.id) {
      return user;
    }
  } catch (e) {
    console.warn('Failed reading stored auth:', e);
  }
  return null;
}

// Save authenticated user
export function saveGoogleUser(user: GoogleAuthUser): void {
  try {
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
  } catch (e) {
    console.error('Error persisting Google user:', e);
  }
}

// Clear authenticated user on logout
export function clearGoogleUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_AUTH);
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  } catch (e) {
    console.warn('Error clearing Google session:', e);
  }
}

// Check if Google GSI client library is loaded
export function isGsiLoaded(): boolean {
  return typeof window !== 'undefined' && !!(window as any).google?.accounts;
}
