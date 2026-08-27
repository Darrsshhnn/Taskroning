import React from 'react';
import { MainNavTab } from '../types';
import { Plus, Bell, User, LogOut, CheckCircle2 } from 'lucide-react';
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

  return (
    <header className="h-16 px-6 sm:px-8 border-b border-[#142337] bg-[#070D16] flex items-center justify-between z-20 shrink-0 select-none">
      
      {/* Title Badge matching design system pill */}
      <div className="flex items-center gap-3">
        <div className="px-5 py-2 rounded-xl bg-[#0C1624] border border-[#1E3654] shadow-[0_0_15px_-4px_rgba(30,58,138,0.4)] flex items-center gap-2">
          <span className="text-sm md:text-base font-bold text-slate-100 tracking-wide">
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

      {/* Action Icons matching screenshot top-right (Add, Notification, Google Profile & Logout) */}
      <div className="flex items-center gap-3">
        
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
          className="w-9 h-9 rounded-full bg-[#0C1624] border border-cyan-400/80 hover:border-cyan-300 flex items-center justify-center text-cyan-400 hover:text-white transition shadow-[0_0_12px_rgba(0,245,196,0.3)] hover:scale-105 cursor-pointer"
          title="Create New Task"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Notification Button */}
        <button
          onClick={() => onSelectTab('notification')}
          className={`w-9 h-9 rounded-full bg-[#0C1624] border transition flex items-center justify-center cursor-pointer relative hover:scale-105 ${
            currentTab === 'notification'
              ? 'border-cyan-400 text-cyan-400 shadow-[0_0_12px_rgba(0,245,196,0.4)]'
              : 'border-cyan-500/40 hover:border-cyan-400 text-cyan-400/90'
          }`}
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 font-bold text-[9px] rounded-full flex items-center justify-center ring-2 ring-[#070D16] shadow-sm">
              {unreadNotifsCount}
            </span>
          )}
        </button>

        {/* Google Profile Button */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`w-9 h-9 rounded-full bg-[#0C1624] border transition flex items-center justify-center cursor-pointer hover:scale-105 overflow-hidden ${
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
          className="w-9 h-9 rounded-full bg-[#0C1624] border border-[#1C324C] hover:border-rose-400/80 text-slate-400 hover:text-rose-400 flex items-center justify-center transition hover:scale-105 cursor-pointer"
          title="Sign Out from Google ID"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>

      </div>

    </header>
  );
};
