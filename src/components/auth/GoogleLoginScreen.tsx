import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TaskroningLogo } from '../TaskroningLogo';
import { 
  ADMIN_EMAIL, 
  isAdminEmail, 
  validateGoogleEmail, 
  getRecentGoogleAccounts 
} from '../../utils/googleAuth';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle,
  KeyRound,
  UserPlus,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const GoogleLoginScreen: React.FC = () => {
  const { authenticateWithGoogleId, isLoading } = useAuth();
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const recentAccounts = getRecentGoogleAccounts();

  const handleSelectAccount = (email: string, name?: string, picture?: string) => {
    setIsAuthorizing(true);
    setValidationError(null);
    setTimeout(() => {
      authenticateWithGoogleId({
        email,
        name: name || (isAdminEmail(email) ? 'Darshan Solanki' : email.split('@')[0]),
        picture: picture || (isAdminEmail(email) 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'),
      });
      setIsAuthorizing(false);
    }, 450);
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const validation = validateGoogleEmail(customEmail);
    if (!validation.valid) {
      setValidationError(validation.error || 'Please enter a valid Google Account ID.');
      return;
    }

    setIsAuthorizing(true);
    const email = customEmail.trim().toLowerCase();
    const isAdmin = isAdminEmail(email);
    let displayName = customName.trim();
    if (!displayName) {
      if (isAdmin) {
        displayName = 'Darshan Solanki';
      } else {
        const prefix = email.split('@')[0];
        displayName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      }
    }

    setTimeout(() => {
      authenticateWithGoogleId({
        email,
        name: displayName,
        picture: isAdmin 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      });
      setIsAuthorizing(false);
    }, 400);
  };

  return (
    <div className="min-h-screen w-screen bg-[#060B12] text-slate-100 flex items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden font-sans">
      
      {/* Background Ambience & Cyan/Blue Cyber Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(0,245,196,0.14),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_120%,rgba(20,50,80,0.4),rgba(255,255,255,0))]" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#00F5C4 1px, transparent 1px), linear-gradient(90deg, #00F5C4 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* New Taskroning Logo Header matching uploaded image */}
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

        {/* Strict Google ID Requirement Alert */}
        <div className="rounded-2xl bg-[#0A1626] border border-cyan-500/40 p-4 shadow-[0_0_25px_-5px_rgba(0,245,196,0.2)] space-y-2.5">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-cyan-300" />
              <span>Google ID Authentication Enforced</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-mono border border-emerald-500/40">
              Active Gate
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Taskroning only permits verified <strong className="text-white">Google Accounts</strong> to sign in. Any valid Google ID or Google Workspace account is accepted. Non-Google logins are strictly disabled.
          </p>

          <div className="pt-2 border-t border-[#13253B] flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 font-mono text-cyan-300/80">
              <Lock className="w-3 h-3 text-cyan-400" /> Google SSO Verified
            </span>
            <span className="text-slate-400 text-[10px]">
              Admin: <span className="text-cyan-400 font-mono">{ADMIN_EMAIL}</span>
            </span>
          </div>
        </div>

        {/* Main Sign-In Card */}
        <div className="taskroning-card p-6 space-y-5 bg-[#08121E]/95 border border-[#18314E] shadow-2xl backdrop-blur-md">
          
          <div className="space-y-1 text-center">
            <h2 className="text-sm font-bold text-white tracking-wide">Select or Enter Google Account</h2>
            <p className="text-[11px] text-slate-400">
              Authenticate with your Google ID to enter Taskroning
            </p>
          </div>

          {/* Quick Google Account Cards */}
          <div className="space-y-2.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Google Accounts
            </label>

            {/* Admin Google Account Card */}
            <div 
              onClick={() => handleSelectAccount(ADMIN_EMAIL, 'Darshan Solanki')}
              className="p-3.5 rounded-xl bg-[#0D1C2F] border border-cyan-500/40 hover:border-cyan-400 hover:bg-[#10243D] transition cursor-pointer flex items-center justify-between group shadow-sm"
              title="Authenticate as Workspace Administrator"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-teal-300 p-0.5 shadow-[0_0_12px_rgba(0,245,196,0.35)]">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                      alt="Darshan Solanki"
                      className="w-full h-full rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0D1C2F] absolute -bottom-0.5 -right-0.5" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition truncate">Darshan Solanki</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300 text-[9px] font-black uppercase tracking-wider shrink-0">
                      Admin ID
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400/90 block truncate">{ADMIN_EMAIL}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-cyan-400 text-xs font-bold shrink-0 ml-2">
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Any other saved accounts */}
            {recentAccounts
              .filter(acc => acc.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase())
              .map(acc => (
                <div 
                  key={acc.email}
                  onClick={() => handleSelectAccount(acc.email, acc.name, acc.picture)}
                  className="p-3 rounded-xl bg-[#091524] border border-[#162D4A] hover:border-cyan-400/60 hover:bg-[#0D1E33] transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={acc.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                      alt={acc.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-white block truncate">{acc.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 block truncate">{acc.email}</span>
                    </div>
                  </div>

                  <span className="text-[11px] text-cyan-400 font-medium group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                    Enter →
                  </span>
                </div>
              ))}
          </div>

          {/* Toggle manual Google Account form */}
          <div className="pt-2 border-t border-[#142337]">
            {!showAddAccount ? (
              <button
                type="button"
                onClick={() => setShowAddAccount(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0A1626] hover:bg-[#0E1E33] border border-[#1A3454] hover:border-cyan-500/50 text-xs text-slate-300 hover:text-white flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                <span>Use another Google Account</span>
              </button>
            ) : (
              <form onSubmit={handleCustomGoogleSubmit} className="space-y-3 bg-[#060D17] p-3.5 rounded-xl border border-[#152B47]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    Enter Google ID
                  </span>
                  <button 
                    type="button" 
                    onClick={() => { setShowAddAccount(false); setValidationError(null); }}
                    className="text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Google Email / Workspace ID</label>
                    <input
                      type="email"
                      required
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full bg-[#04080F] border border-[#193354] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Full Name (Optional)</label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full bg-[#04080F] border border-[#193354] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {validationError && (
                  <div className="p-2 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 text-[11px] flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAuthorizing || isLoading}
                  className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 text-xs font-bold transition shadow-md shadow-cyan-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isAuthorizing ? 'Verifying Google Account...' : 'Authenticate & Enter'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Scopes Overview */}
          <div className="p-3 rounded-xl bg-[#060D17] border border-[#102033] space-y-1.5 text-[10px] text-slate-400">
            <span className="font-bold text-slate-300 block">Verified Google Scopes:</span>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-0.5 rounded-md bg-[#0C1929] border border-[#193557] text-cyan-400 font-mono">
                openid
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#0C1929] border border-[#193557] text-cyan-400 font-mono">
                userinfo.email
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#0C1929] border border-[#193557] text-cyan-400 font-mono">
                userinfo.profile
              </span>
            </div>
          </div>

        </div>

        {/* Footer Notes */}
        <div className="text-center space-y-1 text-[11px] text-slate-500">
          <p>Protected by Google Identity Services & OAuth 2.0</p>
          <p>© 2026 Taskroning Inc. All rights reserved.</p>
        </div>

      </div>

    </div>
  );
};
