import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, 
  Lock, 
  ShieldAlert, 
  ShieldCheck, 
  Download, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Users, 
  AlertCircle,
  BarChart3,
  Layers
} from 'lucide-react';
import { INITIAL_TIMELINE_PHASES } from '../../data/initialData';

interface ProjectReportViewProps {
  onBack: () => void;
}

export const ProjectReportView: React.FC<ProjectReportViewProps> = ({ onBack }) => {
  const { user, firebaseUser, isAdmin } = useAuth();

  // Secure admin check reusing standard workspace auth state
  if (!isAdmin) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6 select-none animate-fadeIn">
        <button
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl bg-[#091524] hover:bg-[#0E1E33] border border-cyan-500/40 text-cyan-400 hover:text-white transition flex items-center gap-2 text-xs font-bold shadow-[0_0_12px_rgba(0,245,196,0.2)] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </button>

        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="max-w-md w-full rounded-2xl bg-gradient-to-b from-[#0D1826] to-[#080E17] border border-rose-500/40 p-8 text-center space-y-5 shadow-2xl backdrop-blur-md">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-950/60 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
                Admin Access Only
              </span>
              <h2 className="text-xl font-bold text-white">Confidential Project Report</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enterprise sprint deliverables, client financial allocation, and executive team velocity reports require workspace administrator clearance.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#060B12] border border-[#16273C] text-left text-xs space-y-1.5 text-slate-400 font-mono">
              <div className="flex justify-between">
                <span>Current Account:</span>
                <span className="text-slate-200 truncate max-w-[180px]">{firebaseUser?.email || 'Authenticated User'}</span>
              </div>
              <div className="flex justify-between">
                <span>Access Status:</span>
                <span className="text-rose-400 font-bold">Standard Role</span>
              </div>
            </div>

            <button
              onClick={onBack}
              className="w-full py-2.5 rounded-xl bg-[#0E1E33] hover:bg-[#142A47] border border-cyan-500/40 text-cyan-400 hover:text-white text-xs font-bold transition cursor-pointer"
            >
              Return to Project Overview
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authorized Admin View: Full Comprehensive Project Report
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 select-none animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#142337]">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="px-3.5 py-2 rounded-xl bg-[#091524] hover:bg-[#0E1E33] border border-cyan-500/40 text-cyan-400 hover:text-white transition flex items-center gap-2 text-xs font-bold shadow-[0_0_12px_rgba(0,245,196,0.2)] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-400/50 text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Admin Verified</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">Q1/Q2 Project 2P Enterprise Dossier</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              Project Report & Executive Audit
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-[#091524] hover:bg-[#0E1E33] border border-[#18314E] text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="taskroning-card p-5 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Overall Progress</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-cyan-400 font-mono">56.0%</span>
            <span className="text-xs text-emerald-400 font-semibold font-mono">+8.4% this week</span>
          </div>
          <div className="w-full bg-[#08121E] h-1.5 rounded-full overflow-hidden border border-[#16273C]">
            <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full w-[56%]" />
          </div>
        </div>

        <div className="taskroning-card p-5 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sprint Timeline</span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-white font-mono">09/03 → 13/04</span>
            <span className="text-xs text-amber-400 font-semibold font-mono">26 Days Left</span>
          </div>
          <p className="text-[10.5px] text-slate-400">Strict Client Delivery Deadline</p>
        </div>

        <div className="taskroning-card p-5 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Resource Allocation</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-400 font-mono">$27,160</span>
            <span className="text-xs text-slate-400 font-mono">/ $48,500</span>
          </div>
          <p className="text-[10.5px] text-slate-400">56% of allocated budget utilized</p>
        </div>

        <div className="taskroning-card p-5 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Engineering Velocity</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-400 font-mono">4.8 pts</span>
            <span className="text-xs text-cyan-400 font-mono">High Output</span>
          </div>
          <p className="text-[10.5px] text-slate-400">Average story point turnaround</p>
        </div>

      </div>

      {/* Main Grid: Gantt Milestones & Team Sign-offs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sprint Deliverables & Milestones (7 cols) */}
        <div className="lg:col-span-7 taskroning-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#142337] pb-3">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
              Sprint Deliverables & Phases
            </div>
            <span className="text-xs text-slate-400 font-mono">Phase Audit</span>
          </div>

          <div className="space-y-3.5">
            {INITIAL_TIMELINE_PHASES.map((phase) => (
              <div 
                key={phase.id}
                className="p-4 rounded-xl bg-[#08121E] border border-[#162A43] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: phase.color }}
                    />
                    <span className="text-xs font-bold text-white">{phase.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold" style={{ color: phase.color }}>
                    {phase.progress}%
                  </span>
                </div>

                <div className="w-full bg-[#060B12] h-2 rounded-full overflow-hidden border border-[#16273C]">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${phase.progress}%`, backgroundColor: phase.color }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>Day {phase.startDay} - Day {phase.endDay}</span>
                  <span className="uppercase font-semibold tracking-wider">{phase.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Lead Sign-offs & Stakeholder Matrix (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="taskroning-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#142337] pb-3">
              <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                Department Lead Sign-offs
              </div>
              <span className="text-xs text-cyan-400 font-mono">Group 1, 2 & 3</span>
            </div>

            <div className="space-y-3 divide-y divide-[#122238] text-xs">
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 block">Lead Architect (Guru Sir)</span>
                  <span className="text-[10px] text-slate-400">Architecture & Spring Physics</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-400/40 text-emerald-400 text-[10px] font-bold">
                  Approved
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 block">Lead Designer (Mithilesh)</span>
                  <span className="text-[10px] text-slate-400">Figma Design Token Export</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-400/40 text-emerald-400 text-[10px] font-bold">
                  Approved
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 block">Engineering PM (Amit Sir)</span>
                  <span className="text-[10px] text-slate-400">Component Motion Specs</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-400/40 text-amber-400 text-[10px] font-bold">
                  Reviewing
                </span>
              </div>
            </div>
          </div>

          <div className="taskroning-card p-6 space-y-3">
            <span className="text-xs font-bold text-slate-200 block">Compliance & Security Clearance</span>
            <div className="p-3.5 rounded-xl bg-[#08121E] border border-cyan-500/30 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
              <p className="text-[11px] text-slate-300 leading-relaxed">
                All client source assets are scoped under enterprise Zero-Trust rules. Production artifacts verified clean.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
