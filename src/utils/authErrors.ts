import { AuthErrorInfo } from '../types';

/**
 * Parses Firebase Authentication errors into descriptive diagnostic structures
 * with actionable remediation steps for both developers and end-users.
 */
export function parseAuthError(err: any, currentProjectId?: string): AuthErrorInfo {
  const code: string = err?.code || 'auth/unknown-error';
  const rawMessage: string = err?.message || 'An unknown authentication error occurred.';
  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'unknown-domain';

  switch (code) {
    case 'auth/unauthorized-domain':
      return {
        code,
        title: 'Domain Not Authorized in Firebase',
        message: `The current domain "${currentDomain}" is not authorized for OAuth operations in your Firebase project.`,
        resolution: `Add "${currentDomain}" to Authorized Domains in Firebase Console: Authentication → Settings → Authorized domains → Add domain.`,
        currentDomain,
        actionType: 'domain',
        rawError: rawMessage,
      };

    case 'auth/popup-blocked':
      return {
        code,
        title: 'Sign-In Popup Blocked',
        message: 'Your browser or an extension blocked the Google Sign-In popup window.',
        resolution: 'Allow popups for this site in your browser URL bar, or click "Sign In via Redirect" below.',
        currentDomain,
        actionType: 'redirect',
        rawError: rawMessage,
      };

    case 'auth/popup-closed-by-user':
      return {
        code,
        title: 'Sign-In Cancelled',
        message: 'The Google account selector window was closed before completing sign-in.',
        resolution: 'Click "Continue with Google" again to select your Google account and grant access.',
        currentDomain,
        actionType: 'retry',
        rawError: rawMessage,
      };

    case 'auth/cancelled-popup-request':
      return {
        code,
        title: 'Sign-In Request Replaced',
        message: 'A previous popup sign-in request was replaced by a newer click.',
        resolution: 'Please wait for the current Google sign-in window to complete.',
        currentDomain,
        actionType: 'retry',
        rawError: rawMessage,
      };

    case 'auth/operation-not-allowed':
      return {
        code,
        title: 'Google Sign-In Provider Disabled',
        message: `Google identity provider is not enabled in Firebase Console for project "${currentProjectId || 'Taskroning'}".`,
        resolution: 'Go to Firebase Console → Authentication → Sign-in method, click "Google", and enable it.',
        currentDomain,
        actionType: 'config',
        rawError: rawMessage,
      };

    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid':
      return {
        code,
        title: 'Invalid Firebase API Key',
        message: 'The Firebase API key supplied to the application is invalid or has been restricted.',
        resolution: 'Check your VITE_FIREBASE_API_KEY environment variable on Vercel or in firebase-applet-config.json.',
        currentDomain,
        actionType: 'config',
        rawError: rawMessage,
      };

    case 'auth/configuration-not-found':
      return {
        code,
        title: 'Firebase Auth Config Missing',
        message: 'Firebase Authentication has not been initialized or configured for this project.',
        resolution: 'Verify your Firebase project settings and ensure Authentication is provisioned in Firebase Console.',
        currentDomain,
        actionType: 'config',
        rawError: rawMessage,
      };

    case 'auth/network-request-failed':
      return {
        code,
        title: 'Network Request Failed',
        message: 'Unable to contact Google/Firebase authentication servers.',
        resolution: 'Check your internet connection or firewall/ad-blocker settings and try again.',
        currentDomain,
        actionType: 'retry',
        rawError: rawMessage,
      };

    default:
      return {
        code,
        title: 'Authentication Error',
        message: rawMessage.replace(/^Firebase:\s*/, '').replace(/\s*\([^)]*\)\.?$/, ''),
        resolution: 'Check your browser developer console for detailed logs or verify your Firebase project setup.',
        currentDomain,
        actionType: 'retry',
        rawError: rawMessage,
      };
  }
}
