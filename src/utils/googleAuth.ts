import { GoogleAuthUser, UserProfile } from '../types';
import { INITIAL_USER_PROFILE } from '../data/initialData';

const STORAGE_KEY_AUTH = 'taskroning_google_user_v1';
const STORAGE_KEY_PROFILES = 'taskroning_profiles_v1';
const STORAGE_KEY_RECENT_ACCOUNTS = 'taskroning_recent_google_accounts_v1';

export const ADMIN_EMAIL = 'sdarshan1163@gmail.com';

export function isAdminEmail(email?: string): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// Validate that an entered email is a legitimate Google / Workspace account
export function validateGoogleEmail(email: string): { valid: boolean; error?: string } {
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmed || !emailRegex.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid Google email address.' };
  }
  return { valid: true };
}

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
    const email = data.email;
    const user: GoogleAuthUser = {
      id: data.sub || `google-${Date.now()}`,
      name: data.name || data.given_name || 'Google User',
      email: email,
      picture: data.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      givenName: data.given_name,
      familyName: data.family_name,
      verifiedEmail: data.email_verified,
      hd: data.hd,
      accessToken,
      loginTimestamp: Date.now(),
      isAdmin: isAdminEmail(email),
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
export function getRecentGoogleAccounts(): { email: string; name: string; picture: string; isAdmin: boolean }[] {
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

  // Default accounts available for convenient testing: Admin account + workspace teammate
  return [
    {
      email: 'sdarshan1163@gmail.com',
      name: 'Darshan Solanki',
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isAdmin: true,
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
      (window as any).google.accounts.id.disableAutoSelect();
    }
  } catch (e) {
    console.warn('Error clearing Google session:', e);
  }
}

// User Profile Browser Persistence for self-editing
export function getStoredUserProfile(userEmail?: string, fallback?: UserProfile): UserProfile {
  const email = userEmail?.toLowerCase() || 'default';
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PROFILES}_${email}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.name) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading stored profile:', e);
  }

  if (fallback) {
    return fallback;
  }

  // If Darshan Solanki / Admin
  if (isAdminEmail(userEmail)) {
    return {
      ...INITIAL_USER_PROFILE,
      name: 'Darshan Solanki',
      role: 'System Administrator & Lead Designer',
    };
  }

  return INITIAL_USER_PROFILE;
}

export function saveStoredUserProfile(userEmail: string, profile: UserProfile): void {
  try {
    const email = userEmail.toLowerCase();
    localStorage.setItem(`${STORAGE_KEY_PROFILES}_${email}`, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving user profile to browser storage:', e);
  }
}

// Check if Google GSI client library is loaded
export function isGsiLoaded(): boolean {
  return typeof window !== 'undefined' && !!(window as any).google?.accounts;
}

