import React, { useState, useEffect } from 'react';
import { UserProfile, MainNavTab } from '../../types';
import { INITIAL_USER_PROFILE, INITIAL_ACHIEVEMENTS } from '../../data/initialData';
import { useAuth } from '../../context/AuthContext';
import { 
  ADMIN_EMAIL, 
  isAdminEmail, 
  getStoredUserProfile, 
  saveStoredUserProfile 
} from '../../utils/googleAuth';
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
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Key,
  Save,
  X,
  Plus,
  Trash2,
  Crown,
  Camera,
  Briefcase
} from 'lucide-react';

interface ProfileViewProps {
  onSelectTab: (tab: MainNavTab) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onSelectTab }) => {
  const { user, updateUserProfile, logout } = useAuth();
  const userEmail = user?.email || ADMIN_EMAIL;
  const isAdmin = isAdminEmail(userEmail);

  // Load user profile from personal browser storage, keyed by their authenticated Google account
  const [profile, setProfile] = useState<UserProfile>(() => {
    return getStoredUserProfile(userEmail, {
      ...INITIAL_USER_PROFILE,
      name: user?.name || INITIAL_USER_PROFILE.name,
      email: userEmail,
      avatarUrl: user?.picture || INITIAL_USER_PROFILE.avatarUrl,
    });
  });

  // Re-sync if authenticated user email changes
  useEffect(() => {
    if (user?.email) {
      const stored = getStoredUserProfile(user.email, {
        ...INITIAL_USER_PROFILE,
        name: user.name || INITIAL_USER_PROFILE.name,
        email: user.email,
        avatarUrl: user.picture || INITIAL_USER_PROFILE.avatarUrl,
      });
      setProfile(stored);
    }
  }, [user?.email, user?.name, user?.picture]);

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Edit form state
  const [editName, setEditName] = useState(profile.name);
  const [editRole, setEditRole] = useState(profile.role);
  const [editAddress, setEditAddress] = useState(profile.address);
  const [editTimeZone, setEditTimeZone] = useState(profile.timeZone);
  const [editDescription, setEditDescription] = useState(profile.description);
  const [editAvatarUrl, setEditAvatarUrl] = useState(profile.avatarUrl);
  const [editPhone, setEditPhone] = useState(profile.phoneNumber || '+1 (555) 349-2819');
  const [editSkills, setEditSkills] = useState(profile.skills.join(', '));
  const [newLeaveType, setNewLeaveType] = useState('Vacation Leave');
  const [newLeaveDates, setNewLeaveDates] = useState('');

  const previewBadges = INITIAL_ACHIEVEMENTS.slice(0, 6);

  const handleStartEdit = () => {
    setEditName(profile.name);
    setEditRole(profile.role);
    setEditAddress(profile.address);
    setEditTimeZone(profile.timeZone);
    setEditDescription(profile.description);
    setEditAvatarUrl(profile.avatarUrl);
    setEditPhone(profile.phoneNumber || '+1 (555) 349-2819');
    setEditSkills(profile.skills.join(', '));
    setIsEditing(true);
    setSaveSuccessMessage(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedSkills = editSkills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const updatedProfile: UserProfile = {
      ...profile,
      name: editName.trim() || profile.name,
      role: editRole.trim() || profile.role,
      address: editAddress.trim() || profile.address,
      timeZone: editTimeZone.trim() || profile.timeZone,
      description: editDescription.trim() || profile.description,
      avatarUrl: editAvatarUrl.trim() || profile.avatarUrl,
      phoneNumber: editPhone.trim(),
      skills: parsedSkills.length > 0 ? parsedSkills : profile.skills,
    };

    // 1. Save in personal browser local storage
    saveStoredUserProfile(userEmail, updatedProfile);
    setProfile(updatedProfile);

    // 2. Synchronize with global Auth state so top bar and AI view update
    updateUserProfile({
      name: updatedProfile.name,
      picture: updatedProfile.avatarUrl,
    });

    setIsEditing(false);
    setSaveSuccessMessage('Profile saved successfully in this browser!');
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 4000);
  };

  const handleAddLeave = () => {
    if (!newLeaveDates.trim()) return;
    const newLeave = {
      id: `leave-${Date.now()}`,
      type: newLeaveType,
      dates: newLeaveDates.trim(),
      status: 'upcoming' as const,
    };
    const updated = {
      ...profile,
      leaves: [newLeave, ...profile.leaves],
    };
    saveStoredUserProfile(userEmail, updated);
    setProfile(updated);
    setNewLeaveDates('');
  };

  const handleRemoveLeave = (leaveId: string) => {
    const updated = {
      ...profile,
      leaves: profile.leaves.filter(l => l.id !== leaveId),
    };
    saveStoredUserProfile(userEmail, updated);
    setProfile(updated);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1600px] mx-auto space-y-6 select-none">
      
      {/* Save Success Banner */}
      {saveSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs flex items-center justify-between shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">{saveSuccessMessage}</span>
          </div>
          <button 
            onClick={() => setSaveSuccessMessage(null)}
            className="text-emerald-400 hover:text-emerald-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: User Info & Editor (8 cols)                  */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main User Card */}
          <div className="taskroning-card p-6 space-y-5 relative">
            
            {/* Top Row: User Avatar, Name, Email, Admin Badge, and Edit/SignOut actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 shadow-[0_0_20px_rgba(0,245,196,0.3)]">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover rounded-[14px]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div 
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shadow-md ring-2 ring-[#070D16]" 
                    title="Google ID Verified"
                  >
                    <CheckCircle2 className="w-4 h-4 fill-slate-950 text-emerald-400 stroke-[2.5]" />
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-white tracking-wide">{profile.name}</h2>
                    
                    {/* Admin ID Badge */}
                    {isAdmin ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/60 text-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Crown className="w-3 h-3 text-amber-400 fill-amber-400" /> Admin ID
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-[10px] font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-cyan-400" /> Google Member
                      </span>
                    )}

                    <span className="text-xs text-slate-400 font-medium">({profile.role})</span>
                  </div>

                  <p className="text-xs text-cyan-400 font-mono font-semibold mt-1 flex items-center gap-1.5">
                    {userEmail}
                    {isAdmin && (
                      <span className="text-[10px] text-amber-400 font-sans font-bold">• System Administrator</span>
                    )}
                  </p>
                  
                  {/* Skill Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                    {profile.skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-0.5 rounded-md bg-[#0D1E33] border border-cyan-500/30 text-cyan-300 text-[10px] font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Edit Profile & Sign Out */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={handleStartEdit}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
                  title="Edit your personal profile in this browser"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-xl bg-[#0F1D2E] border border-rose-500/40 hover:bg-rose-950/40 hover:border-rose-400 text-rose-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="Sign out of Google ID"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Google Authentication Meta Banner */}
            <div className="p-3.5 rounded-xl bg-[#091523] border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shrink-0">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Google ID Authentication</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono">
                      Personal Browser Synced
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono truncate max-w-sm block">
                    {userEmail} • Verified Single Sign-On
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 shrink-0">
                ● Live Google Session
              </span>
            </div>

            {/* Profile Field Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-[#08121E] border border-[#14263D] space-y-1">
                <span className="text-[10px] text-slate-500 block font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> Active Hub Hours
                </span>
                <span className="font-bold text-cyan-400 font-mono">{profile.timeZone}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#08121E] border border-[#14263D] space-y-1">
                <span className="text-[10px] text-slate-500 block font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" /> Access Tier
                </span>
                <span className="font-bold text-slate-200">
                  {isAdmin ? 'Root Administrator' : 'Standard Google SSO'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#08121E] border border-[#14263D] space-y-1">
                <span className="text-[10px] text-slate-500 block font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" /> Location / Hub
                </span>
                <span className="font-bold text-slate-200 truncate block">{profile.address}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              {profile.description}
            </p>

          </div>

          {/* Bottom Row: Work Flow Spline + Achievements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Work Flow */}
            <div className="taskroning-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                  Work Flow Efficiency
                </div>
                <span className="text-[11px] font-mono text-cyan-400">98.4% On-Time</span>
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
                <div>Sprint Goal 1: <span className="text-emerald-400 font-mono">Complete</span></div>
                <div>Sprint Goal 2: <span className="text-cyan-400 font-mono">In Progress</span></div>
              </div>
            </div>

            {/* Achievements Preview */}
            <div className="taskroning-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                  Earned Badges
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
                      d === 19 ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_8px_#00F5C4]' :
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
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Scheduled Leave
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {profile.leaves.length} registered
                </span>
              </div>

              {/* Add leave quick input */}
              <div className="p-3 rounded-xl bg-[#08121E] border border-[#152B47] space-y-2 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Add Leave Block</span>
                <div className="flex gap-2">
                  <select
                    value={newLeaveType}
                    onChange={(e) => setNewLeaveType(e.target.value)}
                    className="bg-[#050A12] border border-[#193557] rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Vacation Leave">Vacation Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Personal Time">Personal Time</option>
                    <option value="Conference">Conference</option>
                  </select>
                  <input
                    type="text"
                    placeholder="e.g. 25-27 Mar"
                    value={newLeaveDates}
                    onChange={(e) => setNewLeaveDates(e.target.value)}
                    className="flex-1 bg-[#050A12] border border-[#193557] rounded-lg px-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddLeave}
                    className="px-2.5 py-1 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs cursor-pointer"
                    title="Add leave"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {profile.leaves.map(leave => (
                  <div
                    key={leave.id}
                    className="p-3 rounded-xl bg-[#08121E] border border-[#162C47] flex items-center justify-between text-xs group"
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

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        leave.status === 'upcoming'
                          ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/40'
                          : 'bg-slate-900 text-slate-400'
                      }`}>
                        {leave.status}
                      </span>
                      <button
                        onClick={() => handleRemoveLeave(leave.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition cursor-pointer p-1"
                        title="Delete leave block"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* EDIT PROFILE MODAL / DRAWER DIALOG                        */}
      {/* ======================================================== */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#091422] border border-cyan-500/40 rounded-2xl w-full max-w-xl p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#162D4A]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-400/60 flex items-center justify-center text-cyan-300">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Edit Your Profile</h3>
                  <p className="text-[11px] text-slate-400">
                    Changes are automatically persisted in your personal browser for <span className="text-cyan-400 font-mono">{userEmail}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={handleCancelEdit}
                className="w-8 h-8 rounded-lg bg-[#0E1E31] border border-[#1A385C] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Avatar URL & Live Preview */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Avatar Photo URL</label>
                <div className="flex items-center gap-3">
                  <img
                    src={editAvatarUrl}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover border border-cyan-400/40 shrink-0"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
                    }}
                  />
                  <input
                    type="url"
                    value={editAvatarUrl}
                    onChange={(e) => setEditAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-[#050A12] border border-[#183457] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              {/* Name and Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#050A12] border border-[#183457] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Title / Role</label>
                  <input
                    type="text"
                    required
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full bg-[#050A12] border border-[#183457] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Location & Timezone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Location / Hub</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="e.g. San Francisco, CA / Remote"
                    className="w-full bg-[#050A12] border border-[#183457] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Active Hours / Time Zone</label>
                  <input
                    type="text"
                    value={editTimeZone}
                    onChange={(e) => setEditTimeZone(e.target.value)}
                    placeholder="e.g. GMT+5:30 (09:00 - 18:00)"
                    className="w-full bg-[#050A12] border border-[#183457] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              {/* Phone and Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-[#050A12] border border-[#183457] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Skills & Tags (comma separated)</label>
                  <input
                    type="text"
                    value={editSkills}
                    onChange={(e) => setEditSkills(e.target.value)}
                    placeholder="UI/UX, PRO, DEV+, React"
                    className="w-full bg-[#050A12] border border-[#183457] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Bio / Description */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Professional Bio / Description</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-[#050A12] border border-[#183457] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#162D4A]">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2.5 rounded-xl bg-[#0E1E31] border border-[#1A385C] text-slate-300 hover:text-white text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 text-xs font-bold transition shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile in Browser</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
