export const ADMIN_EMAIL = 'sdarshan1163@gmail.com';

/**
 * Checks if a given email is the designated system administrator.
 */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

/**
 * Clear any legacy cache keys from old sessions.
 */
export function purgeLegacyStorage(): void {
  try {
    localStorage.removeItem('taskroning_google_user_v1');
    localStorage.removeItem('taskroning_recent_google_accounts_v1');
    localStorage.removeItem('taskroning_tasks_v2');
    localStorage.removeItem('taskroning_events_v2');
  } catch (e) {
    console.warn('Storage cleanup notice:', e);
  }
}
