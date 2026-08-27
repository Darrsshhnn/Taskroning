import React, { useState } from 'react';
import { AchievementItem } from '../../types';
import { INITIAL_ACHIEVEMENTS } from '../../data/initialData';
import { 
  Trophy, 
  Clock, 
  Flag, 
  Layers, 
  Hourglass, 
  Target, 
  Calendar, 
  Bug, 
  Users, 
  Brain, 
  Crosshair, 
  TrendingUp, 
  MessageSquare,
  Award,
  Filter,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

export const AchievementsView: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'remaining'>('all');
  const [selectedBadge, setSelectedBadge] = useState<AchievementItem | null>(null);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Trophy': return Trophy;
      case 'Clock': return Clock;
      case 'Flag': return Flag;
      case 'Layers': return Layers;
      case 'Hourglass': return Hourglass;
      case 'Target': return Target;
      case 'Calendar': return Calendar;
      case 'Bug': return Bug;
      case 'Users': return Users;
      case 'Brain': return Brain;
      case 'Crosshair': return Crosshair;
      case 'TrendingUp': return TrendingUp;
      case 'MessageSquare': return MessageSquare;
      default: return Award;
    }
  };

  const filteredBadges = INITIAL_ACHIEVEMENTS.filter(b => {
    if (filter === 'completed') return b.unlocked;
    if (filter === 'remaining') return !b.unlocked;
    return true;
  });

  const projectAchieves = INITIAL_ACHIEVEMENTS.slice(0, 6);

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1600px] mx-auto space-y-6 select-none">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: All Achievements (8 cols)                    */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 taskroning-card p-5 sm:p-6 space-y-6">
          
          {/* Header & Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#142337]">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
              All Achievements
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              {/* Checkboxes */}
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="achieveFilter"
                  checked={filter === 'all'}
                  onChange={() => setFilter('all')}
                  className="accent-cyan-400"
                />
                <span>All</span>
              </label>
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="achieveFilter"
                  checked={filter === 'completed'}
                  onChange={() => setFilter('completed')}
                  className="accent-cyan-400"
                />
                <span>Completed</span>
              </label>
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="achieveFilter"
                  checked={filter === 'remaining'}
                  onChange={() => setFilter('remaining')}
                  className="accent-cyan-400"
                />
                <span>Remaining</span>
              </label>

              {/* Dropdown */}
              <div className="flex items-center gap-1 px-3 py-1 bg-[#09121E] border border-[#172D47] rounded-lg text-slate-300">
                <span>All Time</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* 12 Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredBadges.map(badge => {
              const Icon = getIconComponent(badge.iconName);
              return (
                <div
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  className={`p-4 rounded-2xl flex flex-col items-center justify-between text-center gap-3 transition cursor-pointer group ${
                    badge.unlocked
                      ? 'bg-[#08121E] border border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_15px_-5px_rgba(0,245,196,0.2)]'
                      : 'bg-[#070D16] border border-[#142337] opacity-60 hover:opacity-90'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                    badge.unlocked
                      ? 'bg-cyan-950/60 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,245,196,0.4)]'
                      : 'bg-slate-900 border border-slate-700 text-slate-500'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-200 block truncate">
                      {badge.tag}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 line-clamp-1">
                      {badge.description}
                    </span>
                  </div>

                  {/* Mini Progress Bar */}
                  <div className="w-full bg-[#050A10] h-1.5 rounded-full overflow-hidden border border-[#142438]">
                    <div 
                      className={`h-full rounded-full ${
                        badge.unlocked ? 'bg-cyan-400 shadow-[0_0_4px_#00F5C4]' : 'bg-slate-600'
                      }`}
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Project Achieves (4 cols)                   */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 taskroning-card p-5 sm:p-6 space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#142337]">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
              Project Achieves
            </div>
            <span className="text-xs font-mono text-cyan-400">Project 2P</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {projectAchieves.map(b => {
              const Icon = getIconComponent(b.iconName);
              return (
                <div 
                  key={b.id}
                  onClick={() => setSelectedBadge(b)}
                  className="p-3.5 rounded-xl bg-[#08121E] border border-cyan-500/30 flex flex-col items-center text-center gap-2 hover:border-cyan-400 transition cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-cyan-950/60 border border-cyan-400/80 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(0,245,196,0.3)] group-hover:scale-105 transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200">{b.tag}</span>
                  <div className="w-full bg-[#050A10] h-1 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 w-full" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Badge detail preview */}
          {selectedBadge && (
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400">{selectedBadge.tag}</span>
                <span className="text-[10px] font-mono text-slate-400">{selectedBadge.unlocked ? 'Unlocked' : 'In Progress'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedBadge.description}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
