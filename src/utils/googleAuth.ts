import { GoogleAuthUser, UserProfile } from '../types';
import { INITIAL_USER_PROFILE } from '../data/initialData';

const STORAGE_KEY_AUTH = 'taskroning_google_user_v1';
const STORAGE_KEY_RECENT_ACCOUNTS = 'taskroning_recent_google_accounts_v1';

export const ADMIN_EMAIL = 'sdarshan1163@gmail.com';

export function isAdminEmail(email?: string): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// Validate email format
export function validateGoogleEmail(email: string): { valid: boolean; error?: string } {
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmed || !emailRegex.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid Google email address.' };
  }
  return { valid: true };
}

// Parse JWT ID token client-side for immediate inspection
export function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
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

// Server-side verification of Google Token (credential or access token)
export async function verifyGoogleTokenOnServer(params: {
  credential?: string;
  accessToken?: string;
}): Promise<{ user: GoogleAuthUser; sessionToken: string }> {
  const response = await fetch('/api/auth/verify-google-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    let errorMsg = 'Failed to verify Google token with backend.';
    try {
      const errData = await response.json();
      if (errData.error) errorMsg = errData.error;
    } catch {}
    throw new Error(errorMsg);
  }

  const data = await response.json();
  if (!data.success || !data.user) {
    throw new Error('Invalid verification response from server.');
  }

  return {
    user: data.user,
    sessionToken: data.sessionToken || `tk_sess_${data.user.id}_${Date.now()}`,
  };
}

// Read current authenticated Google user from persistent storage
export function getStoredGoogleUser(): GoogleAuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (user && user.id && user.email) {
      user.isAdmin = isAdminEmail(user.email);
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
    user.isAdmin = isAdminEmail(user.email);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
    saveRecentGoogleAccount(user);
  } catch (e) {
    console.error('Error persisting Google user:', e);
  }
}

// Recent Google Accounts in browser
export function getRecentGoogleAccounts(): { email: string; name: string; picture: string; isAdmin: boolean; sub?: string }[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECENT_ACCOUNTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading recent accounts:', e);
  }

  return [
    {
      email: ADMIN_EMAIL,
      name: 'Darshan Solanki',
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isAdmin: true,
      sub: 'google-sub-admin-104829482948',
    }
  ];
}

export function saveRecentGoogleAccount(user: GoogleAuthUser): void {
  try {
    const list = getRecentGoogleAccounts().filter(acc => acc.email.toLowerCase() !== user.email.toLowerCase());
    list.unshift({
      email: user.email,
      name: user.name,
      picture: user.picture,
      isAdmin: isAdminEmail(user.email),
      sub: user.id,
    });
    localStorage.setItem(STORAGE_KEY_RECENT_ACCOUNTS, JSON.stringify(list.slice(0, 5)));
  } catch (e) {
    console.warn('Error saving recent account:', e);
  }
}

// Clear authenticated user on logout
export function clearGoogleUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_AUTH);
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.disableAutoSelect();
      } catch {}
    }
  } catch (e) {
    console.warn('Error clearing Google session:', e);
  }
}

// Check if Google GSI client library is loaded
export function isGsiLoaded(): boolean {
  return typeof window !== 'undefined' && !!(window as any).google?.accounts;
}

// Fetch user info from Google OAuth2 userinfo endpoint using access token
export async function fetchGoogleUserInfo(token: string): Promise<GoogleAuthUser | null> {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const email = data.email || 'user@gmail.com';
    return {
      id: data.sub || `google-${Date.now()}`,
      name: data.name || data.given_name || 'Google User',
      email: email,
      picture: data.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      givenName: data.given_name,
      familyName: data.family_name,
      verifiedEmail: data.email_verified,
      hd: data.hd,
      accessToken: token,
      loginTimestamp: Date.now(),
      isAdmin: isAdminEmail(email),
    };
  } catch (e) {
    console.error('Failed to fetch user info from token:', e);
    return null;
  }
}

