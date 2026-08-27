import React, { useState } from 'react';
import { AppNotification, MainNavTab } from '../../types';
import { INITIAL_NOTIFICATIONS } from '../../data/initialData';
import { 
  Bell, 
  Timer, 
  Trophy, 
  UserCheck, 
  Check, 
  CheckCheck, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface NotificationViewProps {
  onSelectTab: (tab: MainNavTab) => void;
}

export const NotificationView: React.FC<NotificationViewProps> = ({ onSelectTab }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const recentList = notifications.filter(n => n.dateGroup === 'recent');
  const yesterdayList = notifications.filter(n => n.dateGroup === 'yesterday');

  const getIcon = (type: string) => {
    switch (type) {
      case 'focus':
        return <Timer className="w-4 h-4 text-cyan-400" />;
      case 'achievement':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'intern':
        return <UserCheck className="w-4 h-4 text-blue-400" />;
      default:
        return <Bell className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1200px] mx-auto space-y-6 select-none">
      
      <div className="taskroning-card p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#142337] pb-4">
          <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
            Notification Feed
          </div>

          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        </div>

        {/* Section 1: Recent */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400/90 block">
            Recent
          </span>

          <div className="space-y-3">
            {recentList.map(item => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition flex items-start gap-4 ${
                  !item.read
                    ? 'bg-[#0A1626] border-cyan-500/40 shadow-[0_0_15px_-5px_rgba(0,245,196,0.15)]'
                    : 'bg-[#08121E] border-[#14263D]'
                }`}
              >
                {/* Avatar or Icon */}
                <div className="w-10 h-10 rounded-xl bg-[#0F1F33] border border-[#1E3A5F] flex items-center justify-center text-lg shrink-0">
                  {item.avatar ? item.avatar : getIcon(item.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-100">{item.title}</span>
                      {item.subtitle && (
                        <span className="text-[11px] text-slate-400 font-medium">{item.subtitle}</span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{item.time}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Yesterday */}
        <div className="space-y-3 pt-4 border-t border-[#142337]">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Yesterday (21/04/2026)
          </span>

          <div className="space-y-3">
            {yesterdayList.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#08121E] border border-[#14263D] flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0B1726] border border-[#172D47] flex items-center justify-center text-lg shrink-0">
                  {item.avatar ? item.avatar : getIcon(item.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-100">{item.title}</span>
                      {item.subtitle && (
                        <span className="text-[11px] text-slate-400 font-medium">{item.subtitle}</span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{item.time}</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
