import React from 'react';
import { MainNavTab } from '../types';
import { TaskroningLogo } from './TaskroningLogo';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutGrid, 
  Layers, 
  ClipboardList, 
  TrendingUp, 
  Sparkles,
  Calendar,
  Timer,
  Trophy,
  MessageSquare,
  Bell,
  User,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  currentTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  unreadNotifsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  unreadNotifsCount = 2,
}) => {
  const { isAdmin } = useAuth();

  const primaryNavItems: { id: MainNavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'project', label: 'Project', icon: Layers },
    { id: 'taskroning', label: 'Taskroning', icon: ClipboardList },
    { id: 'analytics', label: 'Analystix', icon: TrendingUp },
    { id: 'ai', label: 'AI', icon: Sparkles },
    ...(isAdmin ? [{ id: 'admin' as MainNavTab, label: 'Admin', icon: ShieldCheck }] : []),
  ];

  const secondaryNavItems: { id: MainNavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'focus', label: 'Focus Mode', icon: Timer },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'chat', label: 'Team Chat', icon: MessageSquare },
  ];

  return (
    <aside className="hidden md:flex w-20 md:w-24 bg-[#080E17] border-r border-[#152438] flex-col items-center py-4 select-none shrink-0 z-30 h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-[#152438] scrollbar-track-transparent justify-between gap-6">
      
      {/* Top Logo */}
      <div className="flex flex-col items-center gap-5 w-full px-2">
        <button 
          onClick={() => onSelectTab('dashboard')}
          className="group flex flex-col items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 shrink-0"
          title="Taskroning Home"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#0B1726] border border-cyan-500/30 p-1.5 shadow-[0_0_16px_rgba(0,245,196,0.25)] group-hover:border-cyan-400/80 flex items-center justify-center transition">
            <TaskroningLogo className="w-full h-full" />
          </div>
          <span className="text-[9px] font-extrabold tracking-wider text-cyan-400 uppercase">Taskroning</span>
        </button>

        {/* Primary Navigation Icons matching screenshot */}
        <nav className="flex flex-col items-center gap-3.5 w-full">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full py-2.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer relative ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-950/30 border border-cyan-500/40 shadow-[0_0_15px_-3px_rgba(0,245,196,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#101D2E] border border-transparent'
                }`}
                title={item.label}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_8px_#00F5C4]" />
                )}
                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,245,196,0.6)]' : ''}`} />
                <span className="text-[10px] font-semibold tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Secondary quick icons matching app tabs */}
      <div className="flex flex-col items-center gap-2.5 w-full px-2 border-t border-[#152438] pt-3 shrink-0">
        {secondaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full py-2 px-1 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                isActive
                  ? 'text-cyan-400 bg-cyan-950/20 border border-cyan-500/30'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-[#101D2E]/60'
              }`}
              title={item.label}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[8.5px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

    </aside>
  );
};
