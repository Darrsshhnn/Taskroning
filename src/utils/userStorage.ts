import { Task, CalendarEvent, UserProfile } from '../types';
import { getInitialTasks, getInitialCalendarEvents, INITIAL_USER_PROFILE } from '../data/initialData';
import { ADMIN_EMAIL, isAdminEmail } from './googleAuth';

const LEGACY_STORAGE_KEY_TASKS = 'taskroning_tasks_v2';
const LEGACY_STORAGE_KEY_EVENTS = 'taskroning_events_v2';
const LEGACY_STORAGE_KEY_PROFILES = 'taskroning_profiles_v1';

export function getUserStoragePrefix(userId: string): string {
  // Sanitize user ID / sub
  const cleanId = (userId || 'guest').replace(/[^a-zA-Z0-9_-]/g, '_');
  return `taskroning_${cleanId}`;
}

// -------------------------------------------------------------
// USER-SCOPED TASKS
// -------------------------------------------------------------
export function getUserTasks(userId: string, userEmail?: string): Task[] {
  if (!userId) return getInitialTasks();
  const key = `${getUserStoragePrefix(userId)}_tasks`;

  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // Migration check: If this is admin / sdarshan1163 or first user, check legacy storage
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY_TASKS);
    if (legacyRaw) {
      const legacyParsed = JSON.parse(legacyRaw);
      if (Array.isArray(legacyParsed) && legacyParsed.length > 0) {
        // Copy to this user's isolated storage so no data is lost
        localStorage.setItem(key, JSON.stringify(legacyParsed));
        return legacyParsed;
      }
    }
  } catch (e) {
    console.warn('Error reading user tasks:', e);
  }

  // If new user with no previous data, initialize clean initial tasks
  const initial = getInitialTasks();
  try {
    localStorage.setItem(key, JSON.stringify(initial));
  } catch {}
  return initial;
}

export function saveUserTasks(userId: string, tasks: Task[]): void {
  if (!userId) return;
  const key = `${getUserStoragePrefix(userId)}_tasks`;
  try {
    localStorage.setItem(key, JSON.stringify(tasks));
    // Also mirror to legacy key for backward compatibility
    localStorage.setItem(LEGACY_STORAGE_KEY_TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving user tasks:', e);
  }
}

// -------------------------------------------------------------
// USER-SCOPED CALENDAR EVENTS
// -------------------------------------------------------------
export function getUserEvents(userId: string): CalendarEvent[] {
  if (!userId) return getInitialCalendarEvents();
  const key = `${getUserStoragePrefix(userId)}_events`;

  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // Check legacy events
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY_EVENTS);
    if (legacyRaw) {
      const legacyParsed = JSON.parse(legacyRaw);
      if (Array.isArray(legacyParsed) && legacyParsed.length > 0) {
        localStorage.setItem(key, JSON.stringify(legacyParsed));
        return legacyParsed;
      }
    }
  } catch (e) {
    console.warn('Error reading user events:', e);
  }

  const initial = getInitialCalendarEvents();
  try {
    localStorage.setItem(key, JSON.stringify(initial));
  } catch {}
  return initial;
}

export function saveUserEvents(userId: string, events: CalendarEvent[]): void {
  if (!userId) return;
  const key = `${getUserStoragePrefix(userId)}_events`;
  try {
    localStorage.setItem(key, JSON.stringify(events));
    localStorage.setItem(LEGACY_STORAGE_KEY_EVENTS, JSON.stringify(events));
  } catch (e) {
    console.error('Error saving user events:', e);
  }
}

// -------------------------------------------------------------
// USER-SCOPED PROFILE
// -------------------------------------------------------------
export function getUserProfile(userId: string, email?: string, fallback?: UserProfile): UserProfile {
  const cleanId = getUserStoragePrefix(userId || 'default');
  const userKey = `${cleanId}_profile`;

  try {
    const raw = localStorage.getItem(userKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.name) {
        return parsed;
      }
    }

    // Legacy email check
    if (email) {
      const emailRaw = localStorage.getItem(`${LEGACY_STORAGE_KEY_PROFILES}_${email.toLowerCase()}`);
      if (emailRaw) {
        const parsed = JSON.parse(emailRaw);
        if (parsed && parsed.name) {
          localStorage.setItem(userKey, JSON.stringify(parsed));
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn('Error reading user profile:', e);
  }

  if (fallback) {
    return fallback;
  }

  const isAdmin = isAdminEmail(email);
  return {
    ...INITIAL_USER_PROFILE,
    name: isAdmin ? 'Darshan Solanki' : (email ? email.split('@')[0] : INITIAL_USER_PROFILE.name),
    email: email || (isAdmin ? ADMIN_EMAIL : undefined),
    role: isAdmin ? 'System Administrator & Lead Architect' : 'Product & UX Contributor',
  };
}

export function saveUserProfile(userId: string, email: string | undefined, profile: UserProfile): void {
  if (!userId) return;
  const userKey = `${getUserStoragePrefix(userId)}_profile`;
  try {
    localStorage.setItem(userKey, JSON.stringify(profile));
    if (email) {
      localStorage.setItem(`${LEGACY_STORAGE_KEY_PROFILES}_${email.toLowerCase()}`, JSON.stringify(profile));
    }
  } catch (e) {
    console.error('Error saving user profile:', e);
  }
}
