import React, { useState } from 'react';
import { UserProfile, MainNavTab } from '../../types';
import { INITIAL_USER_PROFILE, INITIAL_ACHIEVEMENTS } from '../../data/initialData';
import { 
  User, 
  Calendar, 
  MapPin, 
  Clock, 
  Award, 
  Sparkles, 
  Plane, 
  HeartPulse, 
  Edit3,
  ChevronRight
} from 'lucide-react';

interface ProfileViewProps {
  onSelectTab: (tab: MainNavTab) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onSelectTab }) => {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [isEditing, setIsEditing] = useState(false);

  const previewBadges = INITIAL_ACHIEVEMENTS.slice(0, 6);

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1600px] mx-auto space-y-6 select-none">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: User Info, Work Flow, Achievements (8 cols)  */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main User Card */}
          <div className="taskroning-card p-6 space-y-5">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 shadow-[0_0_20px_rgba(0,245,196,0.3)]">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover rounded-[14px]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-md cursor-pointer hover:scale-105"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white tracking-wide">{profile.name}</h2>
                  <p className="text-xs text-cyan-400 font-semibold">{profile.role}</p>
                  
                  {/* Tags */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">
                      UI/UX
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-500/40 text-blue-300 text-[10px] font-bold">
                      PRO
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                      DEV+
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-4 py-2 rounded-xl bg-[#08121E] border border-[#162C47] text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">Active Hours</span>
                  <span className="text-xs font-bold text-cyan-400 font-mono">{profile.timeZone}</span>
                </div>
              </div>
            </div>

            {/* Profile Field Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#142337] text-xs">
              <div className="p-3 rounded-xl bg-[#08121E] border border-[#14263D] space-y-1">
                <span className="text-[10px] text-slate-500 block font-semibold">Date of Birth</span>
                <span className="font-bold text-slate-200">{profile.dob}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#08121E] border border-[#14263D] space-y-1">
                <span className="text-[10px] text-slate-500 block font-semibold">Gender</span>
                <span className="font-bold text-slate-200">{profile.gender}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#08121E] border border-[#14263D] space-y-1">
                <span className="text-[10px] text-slate-500 block font-semibold">Location / Hub</span>
                <span className="font-bold text-slate-200 truncate block">{profile.address}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              {profile.description}
            </p>

          </div>

          {/* Bottom Row: Work Flow Spline + Achievements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Work Flow */}
            <div className="taskroning-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                  Work Flow
                </div>
              </div>

              <div className="relative h-24 w-full">
                <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                  <path
                    d="M0,80 C60,40 120,90 180,30 C240,10 300,70 400,20 L400,120 L0,120 Z"
                    fill="rgba(0, 245, 196, 0.15)"
                  />
                  <path
                    d="M0,80 C60,40 120,90 180,30 C240,10 300,70 400,20"
                    fill="none"
                    stroke="#00F5C4"
                    strokeWidth="3"
                  />
                  <circle cx="60" cy="55" r="4" fill="#00F5C4" />
                  <circle cx="180" cy="30" r="4" fill="#22D3EE" />
                  <circle cx="280" cy="55" r="4" fill="#3B82F6" />
                  <circle cx="400" cy="20" r="4" fill="#10B981" />
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-2 border-t border-[#142337]">
                <div>Achieved: <span className="text-slate-200 font-mono">03/03/2026</span></div>
                <div>Achieved: <span className="text-slate-200 font-mono">12/01/2026</span></div>
              </div>
            </div>

            {/* Achievements Preview */}
            <div className="taskroning-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                  Achievements
                </div>
                <button 
                  onClick={() => onSelectTab('achievements')}
                  className="text-xs text-cyan-400 font-semibold hover:text-white cursor-pointer"
                >
                  View All →
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {previewBadges.slice(0, 3).map(b => (
                  <div key={b.id} className="p-2 rounded-xl bg-[#08121E] border border-cyan-500/30 flex flex-col items-center gap-1.5 text-center">
                    <div className="w-9 h-9 rounded-full bg-cyan-950/60 border border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-[0_0_8px_rgba(0,245,196,0.3)]">
                      <Award className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-200 truncate max-w-full">{b.tag}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Monthly Schedule & Scheduled Leave (4 cols) */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="taskroning-card p-5 space-y-5">
            
            <div className="flex items-center justify-between border-b border-[#142337] pb-3">
              <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                Monthly Schedule
              </div>
              <span className="text-xs font-mono text-cyan-400">March 2026</span>
            </div>

            {/* Mini Calendar View */}
            <div className="p-3.5 rounded-xl bg-[#08121E] border border-[#162C47] space-y-2">
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-cyan-400">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-400">
                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                  <div
                    key={d}
                    className={`py-1 rounded-md ${
                      d === 19 ? 'bg-blue-600 text-white font-bold' :
                      d === 9 || d === 25 || d === 26 || d === 27 ? 'bg-rose-950/60 border border-rose-500/40 text-rose-300' :
                      d % 3 === 0 ? 'bg-[#0E1B2A] text-slate-300' : ''
                    }`}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>

            {/* Scheduled Leave */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Scheduled Leave
              </span>

              <div className="space-y-2">
                {profile.leaves.map(leave => (
                  <div
                    key={leave.id}
                    className="p-3 rounded-xl bg-[#08121E] border border-[#162C47] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {leave.type.includes('Sick') ? (
                        <div className="w-7 h-7 rounded-lg bg-rose-950/50 border border-rose-400/40 flex items-center justify-center text-rose-400">
                          <HeartPulse className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-cyan-950/50 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                          <Plane className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-slate-200 block">{leave.type}</span>
                        <span className="text-[10px] font-mono text-slate-400">{leave.dates}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      leave.status === 'upcoming'
                        ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/40'
                        : 'bg-slate-900 text-slate-400'
                    }`}>
                      {leave.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
