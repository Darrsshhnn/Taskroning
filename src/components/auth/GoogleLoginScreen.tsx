import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TaskroningLogo } from '../TaskroningLogo';
import { ADMIN_EMAIL } from '../../utils/googleAuth';
import { firebaseConfig } from '../../lib/firebase';
import { 
  ShieldCheck, 
  Lock, 
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Globe,
  RefreshCw,
  Info
} from 'lucide-react';

export const GoogleLoginScreen: React.FC = () => {
  const { 
    loginWithGoogle, 
    loginWithGoogleRedirect, 
    isLoading, 
    error, 
    authError, 
    clearError 
  } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'taskroning.vercel.app';

  const handleGoogleSignInPopup = () => {
    setIsSigningIn(true);
    loginWithGoogle().finally(() => {
      setIsSigningIn(false);
    });
  };

  const handleGoogleSignInRedirect = () => {
    setIsSigningIn(true);
    loginWithGoogleRedirect().finally(() => {
      setIsSigningIn(false);
    });
  };

  const handleCopy = (text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2000);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#060B12] text-slate-100 flex items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden font-sans">
      
      {/* Ambient Cyber Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(0,245,196,0.12),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_120%,rgba(20,50,80,0.35),rgba(255,255,255,0))]" />
      
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#00F5C4 1px, transparent 1px), linear-gradient(90deg, #00F5C4 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="w-full max-w-lg relative z-10 space-y-6">
        
        {/* Taskroning Logo Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#091524] border border-cyan-500/50 shadow-[0_0_25px_rgba(0,245,196,0.3)] relative">
            <TaskroningLogo className="w-14 h-14" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-[#060B12] shadow-[0_0_8px_#00F5C4]" />
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-wider text-white">TASKRONING</h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">Enterprise Workflow & Schedule Orchestrator</p>
          </div>
        </div>

        {/* Real Google SSO Security Badge */}
        <div className="rounded-2xl bg-[#0A1626] border border-cyan-500/40 p-4 shadow-[0_0_25px_-5px_rgba(0,245,196,0.2)] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-cyan-300" />
              <span>Google Identity Authentication</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-mono border border-emerald-500/40">
              Firebase Verified
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Taskroning authenticates directly via <strong className="text-white">Google OAuth & Firebase Auth</strong>. Sign in with your Google account to access your workspace and real-time Firestore database.
          </p>

          <div className="pt-2 border-t border-[#13253B] flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 font-mono text-cyan-300/80">
              <Lock className="w-3 h-3 text-cyan-400" /> End-to-End Per-UID Isolation
            </span>
            <span className="text-slate-400 text-[10px]">
              Admin: <span className="text-cyan-400 font-mono">{ADMIN_EMAIL}</span>
            </span>
          </div>
        </div>

        {/* Diagnostic Error Notification Banner with Actionable Guidance */}
        {(authError || error) && (
          <div className="rounded-2xl bg-[#140810] border border-rose-500/50 p-4 sm:p-5 text-xs space-y-3.5 shadow-2xl animate-fadeIn text-rose-100">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-950 border border-rose-500/40 text-rose-400">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-rose-200 text-sm">
                    {authError?.title || 'Authentication Error'}
                  </h3>
                  {authError?.code && (
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 font-mono text-[11px] text-rose-300">
                      {authError.code}
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={clearError}
                className="text-rose-400 hover:text-white text-base font-bold px-2 py-1 rounded transition"
                title="Dismiss"
              >
                ×
              </button>
            </div>

            <p className="text-slate-200 leading-relaxed">
              {authError?.message || error}
            </p>

            {/* Specialized Remediation Guide for auth/unauthorized-domain (Vercel Domain Whitelist) */}
            {authError?.code === 'auth/unauthorized-domain' && (
              <div className="p-3.5 rounded-xl bg-[#091522] border border-cyan-500/40 space-y-3 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-300 font-semibold flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> Domain Whitelist Required
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Firebase Console Action</span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Firebase Authentication requires explicitly registering external domains like <strong className="text-white font-mono">{currentHost}</strong> to prevent unauthorized OAuth usage.
                </p>

                {/* Domain Copy Box */}
                <div className="flex items-center gap-2 bg-[#060D17] border border-[#162A43] p-2 rounded-lg font-mono text-xs text-cyan-300">
                  <span className="truncate flex-1 select-all">{currentHost}</span>
                  <button
                    onClick={() => handleCopy(currentHost)}
                    className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[11px] flex items-center gap-1 transition cursor-pointer"
                  >
                    {copiedDomain ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Steps list */}
                <ol className="list-decimal list-inside text-[11px] space-y-1 text-slate-300 pl-1">
                  <li>Open <strong className="text-white">Firebase Console</strong> → Select project <span className="font-mono text-cyan-300">{firebaseConfig.projectId}</span></li>
                  <li>Go to <strong className="text-white">Authentication</strong> → <strong className="text-white">Settings</strong> tab → <strong className="text-white">Authorized domains</strong></li>
                  <li>Click <strong className="text-white">Add domain</strong>, paste <span className="font-mono text-cyan-300">{currentHost}</span>, and click Save</li>
                </ol>

                <div className="pt-2 border-t border-[#13253B] flex items-center justify-between text-[11px]">
                  <a 
                    href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/settings`}
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 underline font-medium"
                  >
                    Open Firebase Console Settings <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={handleGoogleSignInPopup}
                    className="text-white bg-cyan-600 hover:bg-cyan-500 px-3 py-1 rounded font-medium text-[11px] transition"
                  >
                    Retry After Adding
                  </button>
                </div>
              </div>
            )}

            {/* Quick action for popup-blocked error */}
            {authError?.code === 'auth/popup-blocked' && (
              <div className="p-3 rounded-xl bg-[#091522] border border-cyan-500/40 space-y-2">
                <p className="text-[11px] text-slate-300">
                  Popups are blocked by your browser settings. You can authenticate seamlessly using a direct page redirect instead:
                </p>
                <button
                  onClick={handleGoogleSignInRedirect}
                  className="w-full py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Continue via Redirect
                </button>
              </div>
            )}

            {/* Fallback raw message for unexpected errors */}
            {authError?.rawError && authError.code !== 'auth/unauthorized-domain' && authError.code !== 'auth/popup-blocked' && (
              <div className="p-2.5 rounded-lg bg-[#060D17] border border-rose-500/30 text-[11px] font-mono text-rose-300 break-all">
                {authError.rawError}
              </div>
            )}
          </div>
        )}

        {/* Main Sign-In Card with Real Google Sign-In Action */}
        <div className="taskroning-card p-6 sm:p-7 space-y-6 bg-[#08121E]/95 border border-[#18314E] shadow-2xl backdrop-blur-md">
          
          <div className="space-y-1 text-center">
            <h2 className="text-base font-bold text-white tracking-wide">Sign In to Your Workspace</h2>
            <p className="text-xs text-slate-400">
              Select your registered Google account to continue
            </p>
          </div>

          {/* Authentic Continue with Google Button (Popup Flow) */}
          <button
            id="btn-google-sign-in"
            onClick={handleGoogleSignInPopup}
            disabled={isLoading || isSigningIn}
            className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-900 font-semibold text-sm flex items-center justify-center gap-3 transition shadow-[0_4px_20px_rgba(255,255,255,0.12)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group border border-slate-200"
          >
            {isLoading || isSigningIn ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-slate-700" />
                <span className="text-slate-800">Connecting to Google...</span>
              </>
            ) : (
              <>
                {/* Official Google G Logo SVG */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12c0 2.02.46 3.84 1.26 5.42l4.02-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span className="text-slate-900 tracking-wide font-bold">Continue with Google</span>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform ml-auto" />
              </>
            )}
          </button>

          {/* Alternative: Direct Redirect Sign-In for Mobile / Strict Browsers */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={handleGoogleSignInRedirect}
              disabled={isLoading || isSigningIn}
              className="text-cyan-400 hover:text-cyan-300 transition text-[11px] underline underline-offset-2 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Having trouble with popups? Use Redirect Sign-In
            </button>
            <span className="text-[10px] text-slate-500 font-mono">v11.1</span>
          </div>

          {/* Security details & feature pill list */}
          <div className="pt-2 border-t border-[#13253B] space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Real-time Cloud Sync
              </span>
              <span className="text-slate-500 font-mono">Firebase Auth v11</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Automatic Session Persistence</span>
              <span className="text-emerald-400 font-medium">Active</span>
            </div>
          </div>

        </div>

        {/* Project & Environment Diagnostic Footnote */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 font-mono">
          <span className="truncate max-w-[200px]" title={currentHost}>
            Host: <span className="text-slate-400">{currentHost}</span>
          </span>
          <span className="truncate max-w-[220px]" title={firebaseConfig.projectId}>
            Project: <span className="text-slate-400">{firebaseConfig.projectId}</span>
          </span>
        </div>

      </div>
    </div>
  );
};
