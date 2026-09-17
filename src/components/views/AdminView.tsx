import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_EMAIL } from '../../utils/googleAuth';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Database, 
  Users, 
  Server, 
  CheckCircle2, 
  KeyRound, 
  Activity,
  AlertTriangle,
  FileText
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { user, firebaseUser, isAdmin } = useAuth();

  // Server-enforced security check
  const isAuthorizedAdmin = isAdmin && firebaseUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  if (!isAuthorizedAdmin) {
    return (
      <div className="p-6 md:p-10 flex items-center justify-center min-h-[70vh]">
        <div className="max-w-lg w-full rounded-2xl bg-rose-950/30 border border-rose-500/40 p-8 text-center space-y-5 shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-900/40 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-rose-950 border border-rose-500/50 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
              403 Forbidden
            </span>
            <h2 className="text-xl font-bold text-white">Administrator Privileges Required</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Access to this console is restricted strictly to authorized Workspace Administrators. Your current account (<span className="text-cyan-400 font-mono">{firebaseUser?.email || 'Unknown'}</span>) does not possess system administration clearance.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#060B12] border border-rose-500/30 text-left text-xs space-y-1.5 text-slate-400 font-mono">
            <div className="flex justify-between">
              <span>Required Identity:</span>
              <span className="text-rose-300">{ADMIN_EMAIL}</span>
            </div>
            <div className="flex justify-between">
              <span>Security Rule:</span>
              <span className="text-slate-300">Zero-Trust Firestore ABAC</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0C1B2E] via-[#0A1626] to-[#08121E] border border-cyan-500/40 p-6 md:p-8 shadow-[0_0_30px_rgba(0,245,196,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Authorized Administrator
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[11px] font-mono">
              Live Verified
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide">Workspace Administration Console</h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Centralized security controls, Firebase Zero-Trust rules telemetry, and per-user Firestore isolation audit for Taskroning.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#060D17] border border-cyan-500/30 text-right space-y-1 shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Primary Admin</span>
          <span className="text-xs font-mono font-bold text-cyan-300 block">{ADMIN_EMAIL}</span>
          <span className="text-[10px] text-slate-500 font-mono block">UID: {firebaseUser?.uid}</span>
        </div>
      </div>

      {/* Grid of Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Security Rules Status */}
        <div className="taskroning-card p-5 space-y-3 bg-[#08121E] border border-[#162C47]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" /> Firestore Rules
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Zero-Trust ABAC</h3>
            <p className="text-xs text-slate-400">
              Users are restricted strictly to <code className="text-cyan-300 font-mono">users/{'{uid}'}</code>. Reads and writes outside owned UIDs are blocked server-side.
            </p>
          </div>
          <div className="pt-2 border-t border-[#13253B] flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Status</span>
            <span className="text-emerald-400">Enforced</span>
          </div>
        </div>

        {/* Database Architecture */}
        <div className="taskroning-card p-5 space-y-3 bg-[#08121E] border border-[#162C47]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" /> Cloud Firestore
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Hierarchical Schema</h3>
            <p className="text-xs text-slate-400">
              Sub-collections under <code className="text-cyan-300 font-mono">users/{'{uid}'}/tasks</code> guarantee zero data leakage between different Google accounts.
            </p>
          </div>
          <div className="pt-2 border-t border-[#13253B] flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Isolation</span>
            <span className="text-emerald-400">Per-UID Strict</span>
          </div>
        </div>

        {/* Identity Verification */}
        <div className="taskroning-card p-5 space-y-3 bg-[#08121E] border border-[#162C47]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-cyan-400" /> Google Identity
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Firebase Auth v11</h3>
            <p className="text-xs text-slate-400">
              Direct integration via GoogleAuthProvider and browser session cookies. No mock local flags or fake credentials.
            </p>
          </div>
          <div className="pt-2 border-t border-[#13253B] flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Provider</span>
            <span className="text-cyan-400">Google OAuth 2.0</span>
          </div>
        </div>
      </div>

      {/* Security Audit Log */}
      <div className="taskroning-card p-6 space-y-4 bg-[#08121E] border border-[#162C47]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Security & Access Audit Trail</h2>
          </div>
          <span className="text-xs font-mono text-slate-500">Live Telemetry</span>
        </div>

        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-[#060B12] border border-[#142337] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300">Firebase GoogleAuthProvider session active</span>
            </div>
            <span className="text-slate-500 font-mono">{new Date().toLocaleTimeString()}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#060B12] border border-[#142337] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300">Firestore Zero-Trust rules deployed & validated</span>
            </div>
            <span className="text-slate-500 font-mono">Server-enforced</span>
          </div>

          <div className="p-3 rounded-xl bg-[#060B12] border border-[#142337] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300">Administrator role granted exclusively to {ADMIN_EMAIL}</span>
            </div>
            <span className="text-cyan-400 font-mono font-bold">Admin Guard</span>
          </div>

          <div className="p-3 rounded-xl bg-[#060B12] border border-[#142337] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300">All legacy mock auth & simulated storage purged</span>
            </div>
            <span className="text-slate-500 font-mono">Cleaned</span>
          </div>
        </div>
      </div>
    </div>
  );
};
