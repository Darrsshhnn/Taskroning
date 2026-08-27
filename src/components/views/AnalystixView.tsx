import React from 'react';
import { MainNavTab } from '../../types';
import { INITIAL_ACHIEVEMENTS } from '../../data/initialData';
import { 
  Trophy, 
  Clock, 
  Target, 
  Bug, 
  TrendingUp, 
  MessageSquare, 
  Crosshair,
  Sparkles,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';

interface AnalystixViewProps {
  onSelectTab: (tab: MainNavTab) => void;
}

export const AnalystixView: React.FC<AnalystixViewProps> = ({ onSelectTab }) => {
  const previewBadges = INITIAL_ACHIEVEMENTS.slice(0, 6);

  const monthlyBars = [
    { height: 45 }, { height: 70 }, { height: 60 }, { height: 85 }, { height: 40 },
    { height: 90 }, { height: 65 }, { height: 75 }, { height: 50 }, { height: 95 },
    { height: 80 }, { height: 60 }, { height: 70 }, { height: 85 }, { height: 100 },
    { height: 75 }, { height: 55 }, { height: 65 }, { height: 90 }, { height: 80 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1600px] mx-auto space-y-6 select-none">
      
      {/* ======================================================== */}
      {/* TOP ROW: Overview & Monthly Focused                       */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Overview Card (6 cols) */}
        <div className="lg:col-span-6 taskroning-card p-5 flex flex-col justify-between space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
              Overview
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 my-2">
            
            {/* Accolading List */}
            <div className="space-y-3 flex-1 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
                <span className="font-semibold">Working on one project longest</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00F5C4]" />
                <span className="font-semibold">Designing in P2</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_#3B82F6]" />
                <span className="font-semibold">2 Project at once</span>
              </div>
            </div>

            {/* Circular Double Arc Gauge */}
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#0F1D2E" strokeWidth="6" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#00F5C4"
                  strokeWidth="6"
                  strokeDasharray="251"
                  strokeDashoffset="86"
                  strokeLinecap="round"
                  fill="none"
                  className="shadow-[0_0_10px_#00F5C4]"
                />
                <circle cx="50" cy="50" r="30" stroke="#0D1826" strokeWidth="5" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  stroke="#3B82F6"
                  strokeWidth="5"
                  strokeDasharray="188"
                  strokeDashoffset="60"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-black text-white">65.7%</span>
              </div>
            </div>

          </div>

          {/* Level Progress Bar */}
          <div className="space-y-2 pt-3 border-t border-[#142337]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">Junior level</span>
              <span className="font-bold text-cyan-400">Medial level</span>
            </div>
            <div className="w-full bg-[#070D16] h-2 rounded-full overflow-hidden border border-[#16273C]">
              <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full w-[65.7%] shadow-[0_0_8px_#00F5C4]" />
            </div>
          </div>

        </div>

        {/* Monthly Focused Card (6 cols) */}
        <div className="lg:col-span-6 taskroning-card p-5 flex flex-col justify-between space-y-4">
          
          <div className="flex items-center justify-between">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
              Monthly Focused
            </div>
            <span className="text-xs font-mono text-slate-400">January / March</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            
            {/* Bar Chart Area (7 cols) */}
            <div className="sm:col-span-7 h-44 flex items-end justify-between gap-1 pt-2 pb-1 border-b border-[#142337]">
              {monthlyBars.map((bar, i) => (
                <div key={i} className="flex-1 bg-[#091321] rounded-t-sm h-full flex items-end">
                  <div 
                    className="w-full bg-gradient-to-t from-cyan-600 to-teal-300 rounded-t-sm transition-all hover:brightness-125"
                    style={{ height: `${bar.height}%` }}
                  />
                </div>
              ))}
            </div>

            {/* Metrics List (5 cols) */}
            <div className="sm:col-span-5 space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-[#08121E] border border-[#15273C]">
                <span className="text-[10px] text-slate-400 block font-semibold">Average</span>
                <span className="text-xs font-bold text-cyan-400 font-mono">02 : 42 Hr</span>
              </div>
              <div className="p-2 rounded-lg bg-[#08121E] border border-[#15273C]">
                <span className="text-[10px] text-slate-400 block font-semibold">Peak Day</span>
                <span className="text-xs font-bold text-slate-200 font-mono">03 : 51 Hr [ 14/04 ]</span>
              </div>
              <div className="p-2 rounded-lg bg-[#08121E] border border-[#15273C]">
                <span className="text-[10px] text-slate-400 block font-semibold">Estimated Goal</span>
                <span className="text-xs font-bold text-emerald-400 font-mono">03 : 00 Hr</span>
              </div>
              <div className="p-2 rounded-lg bg-[#08121E] border border-[#15273C]">
                <span className="text-[10px] text-slate-400 block font-semibold">Upcoming Goal</span>
                <span className="text-xs font-bold text-blue-400 font-mono">03 : 30 Hr</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* BOTTOM ROW: Achievements & Work Flow                      */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Achievements Preview (6 cols) */}
        <div className="lg:col-span-6 taskroning-card p-5 space-y-4">
          
          <div className="flex items-center justify-between border-b border-[#142337] pb-3">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
              Achievements
            </div>
            <button
              onClick={() => onSelectTab('achievements')}
              className="text-xs font-bold text-cyan-400 hover:text-white transition cursor-pointer"
            >
              View All →
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {previewBadges.map(badge => (
              <div 
                key={badge.id}
                onClick={() => onSelectTab('achievements')}
                className="flex flex-col items-center gap-2 p-2 rounded-xl bg-[#08121E] border border-[#162B45] hover:border-cyan-400/60 transition cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-full bg-cyan-950/40 border border-cyan-400/60 group-hover:border-cyan-400 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(0,245,196,0.3)] transition-transform group-hover:scale-105">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-[9.5px] font-bold text-slate-300 text-center truncate max-w-full">
                  {badge.tag}
                </span>
                <div className="w-full bg-[#060B12] h-1 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 w-full" />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Work Flow Spline Chart (6 cols) */}
        <div className="lg:col-span-6 taskroning-card p-5 space-y-4">
          
          <div className="flex items-center justify-between">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
              Work Flow
            </div>
          </div>

          {/* SVG Wave Spline Graphic */}
          <div className="relative h-28 w-full">
            <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00F5C4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00F5C4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,80 C60,40 120,90 180,30 C240,10 300,70 400,20 L400,120 L0,120 Z"
                fill="url(#waveGradient)"
              />
              <path
                d="M0,80 C60,40 120,90 180,30 C240,10 300,70 400,20"
                fill="none"
                stroke="#00F5C4"
                strokeWidth="3"
                className="drop-shadow-[0_0_8px_#00F5C4]"
              />
              {/* Milestone Dots */}
              <circle cx="60" cy="55" r="4" fill="#00F5C4" className="shadow-lg" />
              <circle cx="180" cy="30" r="4" fill="#22D3EE" />
              <circle cx="280" cy="55" r="4" fill="#3B82F6" />
              <circle cx="400" cy="20" r="4" fill="#10B981" />
            </svg>
          </div>

          {/* Achieved Dates Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#142337] text-[11px]">
            <div className="text-slate-400">
              <span className="block text-[9px] uppercase font-bold text-slate-500">Achieved</span>
              <span className="font-mono text-slate-200">03/03/2026</span>
            </div>
            <div className="text-slate-400">
              <span className="block text-[9px] uppercase font-bold text-slate-500">Achieved</span>
              <span className="font-mono text-slate-200">12/01/2026</span>
            </div>
            <div className="text-slate-400">
              <span className="block text-[9px] uppercase font-bold text-slate-500">Achieved</span>
              <span className="font-mono text-slate-200">25/02/2026</span>
            </div>
            <div className="text-slate-400">
              <span className="block text-[9px] uppercase font-bold text-slate-500">Achieved</span>
              <span className="font-mono text-slate-200">31/01/2026</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
