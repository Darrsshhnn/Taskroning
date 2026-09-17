import React, { useState } from 'react';
import { MainNavTab } from '../types';
import { TaskroningLogo } from './TaskroningLogo';
import { 
  Plus, 
  Bell, 
  User, 
  LogOut, 
  CheckCircle2, 
  Menu, 
  X,
  LayoutGrid,
  Layers,
  ClipboardList,
  TrendingUp,
  Sparkles,
  Timer,
  Calendar,
  Trophy,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TopHeaderProps {
  currentTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  onOpenNewTask: () => void;
  unreadNotifsCount: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewTask,
  unreadNotifsCount,
}) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const primaryNavItems: { id: MainNavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'project', label: 'Project', icon: Layers },
    { id: 'taskroning', label: 'Taskroning', icon: ClipboardList },
    { id: 'analytics', label: 'Analystix', icon: TrendingUp },
    { id: 'ai', label: 'AI Assistant', icon: Sparkles },
    { id: 'focus', label: 'Focus Mode', icon: Timer },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'chat', label: 'Team Chat', icon: MessageSquare },
  ];

  const getTabTitle = (tab: MainNavTab): string => {
    switch (tab) {
      case 'dashboard':
        return 'Dashboard';
      case 'project':
        return 'Project';
      case 'project_updates':
        return 'Project Updates';
      case 'taskroning':
        return 'Taskroning';
      case 'analytics':
        return 'Analystix';
      case 'ai':
        return 'Taskroning AI';
      case 'focus':
        return 'Focus Mode';
      case 'calendar':
        return 'Monthly Calendar';
      case 'achievements':
        return 'Achievements';
      case 'chat':
        return 'Chat';
      case 'notification':
        return 'Notification';
      case 'profile':
        return 'Profile';
      default:
        return 'Dashboard';
    }
  };

  const handleTabClick = (tab: MainNavTab) => {
    onSelectTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="h-16 px-4 sm:px-6 md:px-8 border-b border-[#142337] bg-[#070D16] flex items-center justify-between z-20 shrink-0 select-none">
        
        {/* Left Side: Mobile Hamburger Button & Title Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Mobile Hamburger Menu Button (Phone screen only) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-xl bg-[#0C1624] border border-[#1E3654] hover:border-cyan-400 text-slate-300 hover:text-cyan-400 flex items-center justify-center transition cursor-pointer"
            title={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4 text-cyan-400" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Title Badge matching design system pill */}
          <div className="px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-[#0C1624] border border-[#1E3654] shadow-[0_0_15px_-4px_rgba(30,58,138,0.4)] flex items-center gap-2">
            <span className="text-xs sm:text-sm md:text-base font-bold text-slate-100 tracking-wide">
              {getTabTitle(currentTab)}
            </span>
          </div>

          {/* Quick sub-navigation for connected screens */}
          {currentTab === 'project' && (
            <button
              onClick={() => onSelectTab('project_updates')}
              className="hidden sm:inline-flex items-center text-xs px-3 py-1.5 rounded-lg bg-[#101D2E] hover:bg-[#162A43] text-cyan-400 border border-cyan-500/30 transition cursor-pointer font-medium"
            >
              View Department Updates →
            </button>
          )}
          {currentTab === 'project_updates' && (
            <button
              onClick={() => onSelectTab('project')}
              className="hidden sm:inline-flex items-center text-xs px-3 py-1.5 rounded-lg bg-[#101D2E] hover:bg-[#162A43] text-cyan-400 border border-cyan-500/30 transition cursor-pointer font-medium"
            >
              ← Back to Project Timeline
            </button>
          )}
        </div>

        {/* Action Icons top-right (Add, Notification, Google Profile & Logout) */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Google ID Pill Badge */}
          {user && (
            <div 
              onClick={() => onSelectTab('profile')}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0C1827] border border-cyan-500/30 hover:border-cyan-400 transition cursor-pointer"
              title={`Authenticated as ${user.email}`}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
              <span className="text-xs font-bold text-slate-200 truncate max-w-[130px]">{user.name}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 fill-cyan-950" />
            </div>
          )}

          {/* Add Task Button */}
          <button
            onClick={onOpenNewTask}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0C1624] border border-cyan-400/80 hover:border-cyan-300 flex items-center justify-center text-cyan-400 hover:text-white transition shadow-[0_0_12px_rgba(0,245,196,0.3)] hover:scale-105 cursor-pointer"
            title="Create New Task"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </button>

          {/* Notification Button */}
          <button
            onClick={() => onSelectTab('notification')}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0C1624] border transition flex items-center justify-center cursor-pointer relative hover:scale-105 ${
              currentTab === 'notification'
                ? 'border-cyan-400 text-cyan-400 shadow-[0_0_12px_rgba(0,245,196,0.4)]'
                : 'border-cyan-500/40 hover:border-cyan-400 text-cyan-400/90'
            }`}
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 font-bold text-[9px] rounded-full flex items-center justify-center ring-2 ring-[#070D16] shadow-sm">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Google Profile Button */}
          <button
            onClick={() => onSelectTab('profile')}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0C1624] border transition flex items-center justify-center cursor-pointer hover:scale-105 overflow-hidden ${
              currentTab === 'profile'
                ? 'border-cyan-400 shadow-[0_0_12px_rgba(0,245,196,0.5)]'
                : 'border-cyan-500/40 hover:border-cyan-400'
            }`}
            title={user?.email ? `Google ID: ${user.email}` : 'User Profile'}
          >
            {user?.picture ? (
              <img 
                src={user.picture} 
                alt={user.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-xs">
                <User className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </div>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0C1624] border border-[#1C324C] hover:border-rose-400/80 text-slate-400 hover:text-rose-400 flex items-center justify-center transition hover:scale-105 cursor-pointer"
            title="Sign Out from Google ID"
          >
            <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>

        </div>

      </header>

      {/* Mobile Screen Navigation Drawer: All options are hidden by default and only rendered when opened, with one-tap dismiss */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop click to hide */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide-out / Dropdown Menu Container */}
          <div className="relative w-72 max-w-[85vw] bg-[#080E17] border-r border-[#152438] h-full p-5 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
            
            <div className="space-y-6">
              {/* Header inside mobile menu */}
              <div className="flex items-center justify-between pb-4 border-b border-[#152438]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0C1725] border border-cyan-500/30 p-1 flex items-center justify-center">
                    <TaskroningLogo className="w-full h-full" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white tracking-wider block">TASKRONING</span>
                    <span className="text-[10px] text-cyan-400 font-mono">Workspace Menu</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-lg bg-[#0E1B2C] border border-[#1E3654] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Options List - Hidden in mobile menu per user request */}
              {/* All navigation options are hidden on phone screen */}
              <div className="py-2 text-center text-slate-500 text-xs">
                <p className="text-[11px] text-slate-400">Taskroning Workspace</p>
              </div>
            </div>

            {/* Bottom User Info in Mobile Drawer */}
            <div className="pt-4 border-t border-[#152438] space-y-3">
              {user && (
                <div 
                  onClick={() => handleTabClick('profile')}
                  className="p-2.5 rounded-xl bg-[#0B1522] border border-cyan-500/30 flex items-center gap-2.5 cursor-pointer hover:border-cyan-400 transition"
                >
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-7 h-7 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-white block truncate">{user.name}</span>
                    <span className="text-[10px] text-cyan-400 font-mono truncate block">{user.email}</span>
                  </div>
                </div>
              )}

              <button
                onClick={logout}
                className="w-full py-2 px-3 rounded-xl bg-rose-950/30 border border-rose-500/30 hover:border-rose-400 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
