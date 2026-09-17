import React, { useState } from 'react';
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
  ArrowLeft,
  Flame, 
  Award,
  Maximize2,
  Calendar,
  Layers,
  BarChart2,
  Activity,
  CheckCircle2
} from 'lucide-react';

interface AnalystixViewProps {
  onSelectTab: (tab: MainNavTab) => void;
}

type DrillDownSection = 'overview' | 'monthly' | 'achievements' | 'workflow' | null;

export const AnalystixView: React.FC<AnalystixViewProps> = ({ onSelectTab }) => {
  const [activeDrillDown, setActiveDrillDown] = useState<DrillDownSection>(null);
  const previewBadges = INITIAL_ACHIEVEMENTS.slice(0, 6);

  const monthlyBars = [
    { day: '01', height: 45, hrs: '2.1h' }, { day: '02', height: 70, hrs: '3.5h' }, 
    { day: '03', height: 60, hrs: '3.0h' }, { day: '04', height: 85, hrs: '4.2h' }, 
    { day: '05', height: 40, hrs: '2.0h' }, { day: '06', height: 90, hrs: '4.5h' }, 
    { day: '07', height: 65, hrs: '3.2h' }, { day: '08', height: 75, hrs: '3.8h' }, 
    { day: '09', height: 50, hrs: '2.5h' }, { day: '10', height: 95, hrs: '4.8h' },
    { day: '11', height: 80, hrs: '4.0h' }, { day: '12', height: 60, hrs: '3.0h' }, 
    { day: '13', height: 70, hrs: '3.5h' }, { day: '14', height: 85, hrs: '4.2h' }, 
    { day: '15', height: 100, hrs: '5.0h' }, { day: '16', height: 75, hrs: '3.8h' }, 
    { day: '17', height: 55, hrs: '2.7h' }, { day: '18', height: 65, hrs: '3.2h' }, 
    { day: '19', height: 90, hrs: '4.5h' }, { day: '20', height: 80, hrs: '4.0h' },
  ];

  // -------------------------------------------------------------
  // 1. DRILL-DOWN: Overview & Skill Progression Dedicated Screen
  // -------------------------------------------------------------
  if (activeDrillDown === 'overview') {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 select-none animate-fadeIn">
        <div className="flex items-center justify-between pb-4 border-b border-[#142337]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveDrillDown(null)}
              className="px-3.5 py-2 rounded-xl bg-[#091524] hover:bg-[#0E1E33] border border-cyan-500/40 text-cyan-400 hover:text-white transition flex items-center gap-2 text-xs font-bold shadow-[0_0_12px_rgba(0,245,196,0.2)] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Analystix Overview</span>
            </button>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">Dedicated Metric Drill-Down</span>
              <h1 className="text-xl font-bold text-white">Skill Level & Project Distribution Deep-Dive</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 taskroning-card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Overall Capability Score</h3>
              <span className="text-xs font-mono font-bold text-cyan-400">Medial Level (65.7%)</span>
            </div>

            <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
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
                  className="shadow-[0_0_15px_#00F5C4]"
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
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white font-mono">65.7%</span>
                <span className="text-[9px] text-cyan-400 uppercase tracking-widest font-bold">Accuracy</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#142337]">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Junior Level Proficiency</span>
                  <span className="text-emerald-400 font-mono">100% Unlocked</span>
                </div>
                <div className="w-full bg-[#08121E] h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Medial Level Mastery</span>
                  <span className="text-cyan-400 font-mono">65.7% Progress</span>
                </div>
                <div className="w-full bg-[#08121E] h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 w-[65.7%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Senior Level Architect</span>
                  <span className="text-slate-500 font-mono">Locked (Need 22 more tasks)</span>
                </div>
                <div className="w-full bg-[#08121E] h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-700 w-[15%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="taskroning-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-[#142337] pb-3">Project Allocation Breakdown</h3>
              
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#08121E] border border-[#162B45] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
                    <div>
                      <span className="font-bold text-slate-200 block">Project 2P Design & Prototyping</span>
                      <span className="text-[10px] text-slate-400">Longest consecutive project run</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">42.5 hrs</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#08121E] border border-[#162B45] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_6px_#00F5C4]" />
                    <div>
                      <span className="font-bold text-slate-200 block">New Project Kickoff</span>
                      <span className="text-[10px] text-slate-400">Sprint scoping and meetings</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-cyan-400">28.0 hrs</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#08121E] border border-[#162B45] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_6px_#3B82F6]" />
                    <div>
                      <span className="font-bold text-slate-200 block">General Due Work & Reviews</span>
                      <span className="text-[10px] text-slate-400">Code reviews & QA verification</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-blue-400">16.2 hrs</span>
                </div>
              </div>
            </div>

            <div className="taskroning-card p-6 space-y-2">
              <span className="text-xs font-bold text-slate-200 block">Efficiency Insights</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                You maintain your highest focus velocity when engaging in single-project 90-minute intervals before taking scheduled coffee resets.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. DRILL-DOWN: Monthly Focused Dedicated Screen
  // -------------------------------------------------------------
  if (activeDrillDown === 'monthly') {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 select-none animate-fadeIn">
        <div className="flex items-center justify-between pb-4 border-b border-[#142337]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveDrillDown(null)}
              className="px-3.5 py-2 rounded-xl bg-[#091524] hover:bg-[#0E1E33] border border-cyan-500/40 text-cyan-400 hover:text-white transition flex items-center gap-2 text-xs font-bold shadow-[0_0_12px_rgba(0,245,196,0.2)] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Analystix Overview</span>
            </button>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">Dedicated Metric Drill-Down</span>
              <h1 className="text-xl font-bold text-white">Monthly Focus & Deep Work Chronology</h1>
            </div>
          </div>
        </div>

        <div className="taskroning-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#142337] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Daily Focus Distribution (January - March)</h3>
              <p className="text-xs text-slate-400">20-day high-resolution sprint interval</p>
            </div>
            <div className="flex gap-4 text-xs font-mono">
              <span className="text-cyan-400">Avg: 02:42 Hr</span>
              <span className="text-emerald-400">Peak: 03:51 Hr [14/04]</span>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-[#142337]">
            {monthlyBars.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[9px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition">
                  {bar.hrs}
                </span>
                <div className="w-full bg-[#091321] rounded-t-md h-full flex items-end">
                  <div 
                    className="w-full bg-gradient-to-t from-cyan-600 via-teal-400 to-cyan-300 rounded-t-md transition-all group-hover:brightness-125 shadow-[0_0_8px_rgba(0,245,196,0.3)]"
                    style={{ height: `${bar.height}%` }}
                  />
                </div>
                <span className="text-[9px] text-slate-500 font-mono">{bar.day}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs pt-2">
            <div className="p-4 rounded-xl bg-[#08121E] border border-[#15273C] space-y-1">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Daily Average</span>
              <span className="text-xl font-bold text-cyan-400 font-mono">02 : 42 Hr</span>
              <span className="text-[10px] text-slate-500 block">+12% vs previous sprint</span>
            </div>
            <div className="p-4 rounded-xl bg-[#08121E] border border-[#15273C] space-y-1">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Peak Focus Day</span>
              <span className="text-xl font-bold text-slate-100 font-mono">03 : 51 Hr</span>
              <span className="text-[10px] text-emerald-400 block">Logged on April 14</span>
            </div>
            <div className="p-4 rounded-xl bg-[#08121E] border border-[#15273C] space-y-1">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Target Goal</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">03 : 00 Hr</span>
              <span className="text-[10px] text-slate-500 block">Target 80% achieved</span>
            </div>
            <div className="p-4 rounded-xl bg-[#08121E] border border-[#15273C] space-y-1">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Upcoming Milestone</span>
              <span className="text-xl font-bold text-blue-400 font-mono">03 : 30 Hr</span>
              <span className="text-[10px] text-blue-300 block">Sprint Stretch Goal</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. DRILL-DOWN: Work Flow & Velocity Spline Dedicated Screen
  // -------------------------------------------------------------
  if (activeDrillDown === 'workflow') {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 select-none animate-fadeIn">
        <div className="flex items-center justify-between pb-4 border-b border-[#142337]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveDrillDown(null)}
              className="px-3.5 py-2 rounded-xl bg-[#091524] hover:bg-[#0E1E33] border border-cyan-500/40 text-cyan-400 hover:text-white transition flex items-center gap-2 text-xs font-bold shadow-[0_0_12px_rgba(0,245,196,0.2)] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Analystix Overview</span>
            </button>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">Dedicated Metric Drill-Down</span>
              <h1 className="text-xl font-bold text-white">Work Flow Dynamics & Velocity Waves</h1>
            </div>
          </div>
        </div>

        <div className="taskroning-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#142337] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Work Flow Spline Curvature</h3>
              <p className="text-xs text-slate-400">Milestone velocity trajectory over sprint quarters</p>
            </div>
            <span className="text-xs text-cyan-400 font-mono">4 Milestones Achieved</span>
          </div>

          <div className="relative h-48 w-full bg-[#08121E] rounded-2xl p-4 border border-[#14273E]">
            <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00F5C4" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#00F5C4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,80 C60,40 120,90 180,30 C240,10 300,70 400,20 L400,120 L0,120 Z"
                fill="url(#waveGradient2)"
              />
              <path
                d="M0,80 C60,40 120,90 180,30 C240,10 300,70 400,20"
                fill="none"
                stroke="#00F5C4"
                strokeWidth="3.5"
                className="drop-shadow-[0_0_12px_#00F5C4]"
              />
              <circle cx="60" cy="55" r="5" fill="#00F5C4" />
              <circle cx="180" cy="30" r="5" fill="#22D3EE" />
              <circle cx="280" cy="55" r="5" fill="#3B82F6" />
              <circle cx="400" cy="20" r="5" fill="#10B981" />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#08121E] border border-[#14263D] space-y-1">
              <span className="text-[10px] text-cyan-400 font-mono font-bold">Milestone 1</span>
              <span className="font-bold text-slate-200 block">Alpha Delivery</span>
              <span className="text-[10px] text-slate-400 font-mono">03/03/2026</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#08121E] border border-[#14263D] space-y-1">
              <span className="text-[10px] text-cyan-400 font-mono font-bold">Milestone 2</span>
              <span className="font-bold text-slate-200 block">Figma Token Sync</span>
              <span className="text-[10px] text-slate-400 font-mono">12/01/2026</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#08121E] border border-[#14263D] space-y-1">
              <span className="text-[10px] text-cyan-400 font-mono font-bold">Milestone 3</span>
              <span className="font-bold text-slate-200 block">Component Architecture</span>
              <span className="text-[10px] text-slate-400 font-mono">25/02/2026</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#08121E] border border-[#14263D] space-y-1">
              <span className="text-[10px] text-cyan-400 font-mono font-bold">Milestone 4</span>
              <span className="font-bold text-slate-200 block">Release Candidate</span>
              <span className="text-[10px] text-slate-400 font-mono">31/01/2026</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN ANALYTICS OVERVIEW (With Interactive Click-to-Drilldown)
  // -------------------------------------------------------------
  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1600px] mx-auto space-y-6 select-none animate-fadeIn">
      
      {/* Sub-header instruction banner */}
      <div className="flex items-center justify-between bg-[#08121E] border border-[#16273C] p-3.5 rounded-2xl">
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-slate-300 font-medium">
            Interactive Analytics Console — Click any chart or metric to open its dedicated drill-down view.
          </span>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 hidden sm:inline">4 Dedicated Sub-Screens</span>
      </div>

      {/* TOP ROW: Overview & Monthly Focused */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Overview Card (6 cols) */}
        <div 
          onClick={() => setActiveDrillDown('overview')}
          className="lg:col-span-6 taskroning-card p-5 flex flex-col justify-between space-y-6 cursor-pointer hover:border-cyan-400/70 transition-all duration-300 group"
          title="Click to explore detailed Overview & Skill breakdown"
        >
          <div className="flex items-center justify-between">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200 group-hover:border-cyan-500/50 transition">
              Overview
            </div>
            <div className="flex items-center gap-1 text-[11px] text-cyan-400 font-semibold group-hover:translate-x-0.5 transition">
              <span>Drill down</span>
              <ChevronRight className="w-3.5 h-3.5" />
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
        <div 
          onClick={() => setActiveDrillDown('monthly')}
          className="lg:col-span-6 taskroning-card p-5 flex flex-col justify-between space-y-4 cursor-pointer hover:border-cyan-400/70 transition-all duration-300 group"
          title="Click to explore detailed Monthly Focus distribution"
        >
          <div className="flex items-center justify-between">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200 group-hover:border-cyan-500/50 transition">
              Monthly Focused
            </div>
            <div className="flex items-center gap-1 text-[11px] text-cyan-400 font-semibold group-hover:translate-x-0.5 transition">
              <span>Drill down</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Bar Chart Area (7 cols) */}
            <div className="sm:col-span-7 h-44 flex items-end justify-between gap-1 pt-2 pb-1 border-b border-[#142337]">
              {monthlyBars.map((bar, i) => (
                <div key={i} className="flex-1 bg-[#091321] rounded-t-sm h-full flex items-end">
                  <div 
                    className="w-full bg-gradient-to-t from-cyan-600 to-teal-300 rounded-t-sm transition-all group-hover:brightness-125"
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

      {/* BOTTOM ROW: Achievements & Work Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Achievements Preview (6 cols) */}
        <div className="lg:col-span-6 taskroning-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#142337] pb-3">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
              Achievements
            </div>
            <button
              onClick={() => onSelectTab('achievements')}
              className="text-xs font-bold text-cyan-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
            >
              <span>View All Screen</span>
              <ChevronRight className="w-3.5 h-3.5" />
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
        <div 
          onClick={() => setActiveDrillDown('workflow')}
          className="lg:col-span-6 taskroning-card p-5 space-y-4 cursor-pointer hover:border-cyan-400/70 transition-all duration-300 group"
          title="Click to explore detailed Work Flow dynamics"
        >
          <div className="flex items-center justify-between">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200 group-hover:border-cyan-500/50 transition">
              Work Flow
            </div>
            <div className="flex items-center gap-1 text-[11px] text-cyan-400 font-semibold group-hover:translate-x-0.5 transition">
              <span>Drill down</span>
              <ChevronRight className="w-3.5 h-3.5" />
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
