import React, { useState } from 'react';
import { Task, CalendarEvent, MainNavTab } from '../../types';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Star, 
  FileText, 
  Coffee, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Maximize2
} from 'lucide-react';

interface DashboardViewProps {
  tasks: Task[];
  events: CalendarEvent[];
  onOpenTaskModal: (task?: Task) => void;
  onSelectTab: (tab: MainNavTab) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onToggleTaskStar: (taskId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  events,
  onOpenTaskModal,
  onSelectTab,
  onToggleTaskComplete,
  onToggleTaskStar,
}) => {
  const [reportPeriod, setReportPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [activeCurrentIndex, setActiveCurrentIndex] = useState(0);

  // Selected current task
  const inProgressTasks = tasks.filter(t => t.status !== 'completed');
  const currentTask = inProgressTasks[activeCurrentIndex % Math.max(1, inProgressTasks.length)] || tasks[0];

  // Day Overview calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overallPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 71;

  // Weekly bar data
  const weeklyBars = [
    { day: 'Mon', hours: 4.2, label: 'M', heightPct: 60 },
    { day: 'Tue', hours: 6.8, label: 'T', heightPct: 95 },
    { day: 'Wed', hours: 4.5, label: 'W', heightPct: 65 },
    { day: 'Thu', hours: 5.2, label: 'T', heightPct: 75 },
    { day: 'Fri', hours: 6.0, label: 'F', heightPct: 85 },
    { day: 'Sat', hours: 3.1, label: 'S', heightPct: 45 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1600px] mx-auto space-y-6 select-none">
      
      {/* ======================================================== */}
      {/* TOP ROW: Weekly Report & Task Schedule                     */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Left: Weekly Report Card */}
        <div className="lg:col-span-5 taskroning-card p-5 flex flex-col justify-between relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
              Weekly Report
            </div>

            {/* Toggle Monthly / Weekly */}
            <div className="flex items-center bg-[#070D16] p-0.5 rounded-lg border border-[#16273C] text-[11px]">
              <button
                onClick={() => setReportPeriod('monthly')}
                className={`px-2.5 py-1 rounded-md transition font-medium cursor-pointer ${
                  reportPeriod === 'monthly' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setReportPeriod('weekly')}
                className={`px-2.5 py-1 rounded-md transition font-medium cursor-pointer ${
                  reportPeriod === 'weekly' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Weekly
              </button>
            </div>
          </div>

          {/* Chart Graphic Area */}
          <div className="mt-6 flex items-end justify-between gap-3 h-48 pt-4 pb-2 border-b border-[#142337]">
            
            {/* Y-axis Labels */}
            <div className="flex flex-col justify-between h-full text-[10px] font-mono text-slate-500 pb-1">
              <span>7h</span>
              <span>5h</span>
              <span>4h</span>
              <span>2h</span>
              <span>1h</span>
            </div>

            {/* Bars */}
            <div className="flex-1 flex items-end justify-around h-full gap-2 px-2">
              {weeklyBars.map((bar) => (
                <div key={bar.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-2.5 sm:w-3.5 bg-[#0e1b2a] rounded-t-full h-full flex items-end overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-cyan-500 to-teal-300 rounded-t-full transition-all duration-700 group-hover:brightness-125 shadow-[0_0_8px_rgba(0,245,196,0.3)]"
                      style={{ height: `${bar.heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{bar.day}</span>
                </div>
              ))}
            </div>

            {/* Right stacked Day buttons */}
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-1">
                <span className="w-6 h-6 rounded-md bg-[#0C1726] border border-[#1B3352] text-[10px] font-bold text-slate-300 flex items-center justify-center">M</span>
                <span className="w-6 h-6 rounded-md bg-[#0C1726] border border-[#1B3352] text-[10px] font-bold text-slate-300 flex items-center justify-center">T</span>
              </div>
              <div className="flex gap-1">
                <span className="w-6 h-6 rounded-md bg-[#0C1726] border border-[#1B3352] text-[10px] font-bold text-slate-300 flex items-center justify-center">W</span>
                <span className="w-6 h-6 rounded-md bg-[#0C1726] border border-[#1B3352] text-[10px] font-bold text-slate-300 flex items-center justify-center">T</span>
              </div>
              <div className="flex gap-1">
                <span className="w-6 h-6 rounded-md bg-[#0C1726] border border-[#1B3352] text-[10px] font-bold text-slate-300 flex items-center justify-center">F</span>
                <span className="w-6 h-6 rounded-md bg-[#0C1726] border border-[#1B3352] text-[10px] font-bold text-slate-300 flex items-center justify-center">S</span>
              </div>
            </div>

          </div>

          {/* Bottom Average Footer */}
          <div className="mt-4 flex items-center justify-end">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0C1726] border border-[#19304D] text-right">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Weekly Avg</span>
              <span className="text-xs font-bold text-cyan-400">5:30 <span className="text-[10px] text-slate-400 font-normal">HOURS</span></span>
            </div>
          </div>

        </div>

        {/* Top Right: Task Schedule Table Card */}
        <div className="lg:col-span-7 taskroning-card p-5 flex flex-col justify-between">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#142337]">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
              Task Schedule
            </div>

            <button
              onClick={() => onOpenTaskModal()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-400/80 text-cyan-400 hover:text-white transition text-xs font-bold shadow-[0_0_12px_rgba(0,245,196,0.2)] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Task</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-medium border-b border-[#142337] text-[11px]">
                  <th className="py-2 px-2 w-8">No.</th>
                  <th className="py-2 px-2">Task Name</th>
                  <th className="py-2 px-2 w-28">Progress</th>
                  <th className="py-2 px-2 w-16 text-center">Time</th>
                  <th className="py-2 px-2 w-20 text-center">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#122033]">
                {tasks.slice(0, 6).map((task, idx) => {
                  const progressPct = task.progress || (task.status === 'completed' ? 100 : 45);
                  return (
                    <tr 
                      key={task.id} 
                      onClick={() => onOpenTaskModal(task)}
                      className="hover:bg-[#0E1928] transition group cursor-pointer"
                    >
                      <td className="py-2.5 px-2 font-mono text-slate-400 text-[11px]">
                        {idx + 1}.
                      </td>
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200 group-hover:text-cyan-400'} transition`}>
                            {task.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2">
                        <div className="w-full bg-[#070D16] h-1.5 rounded-full overflow-hidden border border-[#16273C]">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-400 to-teal-300 rounded-full transition-all duration-500 shadow-[0_0_6px_rgba(0,245,196,0.5)]"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-2.5 px-2 font-mono text-[11px] text-slate-300 text-center">
                        {task.dueTime || '10:15'}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Colored dot markers matching screenshot */}
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_4px_#10B981]" />
                          {idx % 2 === 0 ? (
                            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_4px_#EF4444]" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_4px_#F59E0B]" />
                          )}
                          <ExternalLink className="w-3 h-3 text-cyan-400/80 group-hover:text-cyan-300 ml-1" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* BOTTOM ROW: Focus Mode, Current Task, Day Overview        */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
        
        {/* Bottom Left: Focus Mode Liquid Gauge Card (4 cols) */}
        <div 
          onClick={() => onSelectTab('focus')}
          className="lg:col-span-4 taskroning-card p-5 flex flex-col justify-between cursor-pointer hover:border-cyan-500/50 transition group relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
              Focus Mode
            </div>
            <Maximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition" />
          </div>

          {/* Liquid Wave Circular Meter */}
          <div className="my-5 flex items-center justify-center gap-6">
            <div className="relative w-36 h-36 rounded-full border-2 border-cyan-400/50 bg-[#08121E] overflow-hidden shadow-[0_0_25px_rgba(0,245,196,0.25)] flex items-center justify-center">
              
              {/* Liquid Wave Background Layer */}
              <div 
                className="liquid-wave bg-gradient-to-t from-cyan-600/80 via-teal-500/60 to-cyan-400/50" 
                style={{ top: '45%' }}
              />
              <div 
                className="liquid-wave-fast bg-gradient-to-t from-emerald-600/60 via-cyan-500/50 to-teal-300/40" 
                style={{ top: '48%' }}
              />

              {/* Percentage Badge */}
              <div className="relative z-10 text-center">
                <span className="text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight">
                  55%
                </span>
              </div>
            </div>

            {/* Vertical tube gauge next to circle */}
            <div className="w-4 h-32 bg-[#08121E] border border-[#19324F] rounded-full p-0.5 flex flex-col justify-end overflow-hidden">
              <div className="w-full h-[55%] bg-gradient-to-t from-teal-400 to-cyan-300 rounded-full shadow-[0_0_8px_rgba(0,245,196,0.6)]" />
            </div>
          </div>

          {/* Bottom stats row */}
          <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-[#142337]">
            <div>
              <span className="text-xs font-bold text-slate-200 block">01 : 24 hr</span>
              <span className="text-[10px] text-slate-400 font-medium">Current</span>
            </div>
            <div>
              <span className="text-xs font-bold text-cyan-400 block">02 : 41 hr</span>
              <span className="text-[10px] text-slate-400 font-medium">Today's</span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200 block">04 : 21 hr</span>
              <span className="text-[10px] text-slate-400 font-medium">Highest</span>
            </div>
          </div>

        </div>

        {/* Bottom Middle: Current Task Card (4 cols) */}
        <div className="lg:col-span-4 taskroning-card p-5 flex flex-col justify-between">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-300">
              Current Task
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <button 
                onClick={() => setActiveCurrentIndex(prev => Math.max(0, prev - 1))}
                className="p-1 hover:text-cyan-400 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setActiveCurrentIndex(prev => prev + 1)}
                className="p-1 hover:text-cyan-400 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Task Info & Progress */}
          <div className="space-y-3 my-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white tracking-wide">
                {currentTask?.title || 'Prototype - Module 2'}
              </h4>
              <span className="text-xs font-bold text-cyan-400 font-mono">
                {currentTask?.progress || 55}%
              </span>
            </div>

            <div className="w-full bg-[#070D16] h-2 rounded-full overflow-hidden border border-[#16273C]">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(0,245,196,0.6)]"
                style={{ width: `${currentTask?.progress || 55}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
              {currentTask?.description || 'Prototyping the second module/screens and testing the spring motion on client project 2P.'}
            </p>

            {/* Sub-cards pills */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2 rounded-lg bg-[#0C1726] border border-[#182E47] text-[10px] text-slate-300">
                <span className="font-semibold block truncate">2. Prototype - Module 2</span>
                <span className="text-slate-500 font-mono">Project 2P</span>
              </div>
              <div className="p-2 rounded-lg bg-[#0C1726] border border-[#182E47] text-[10px] text-slate-300">
                <span className="font-semibold block truncate">3. Prototype - Module 2</span>
                <span className="text-slate-500 font-mono">Project 2P</span>
              </div>
            </div>
          </div>

          {/* Action Buttons matching screenshot */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#142337]">
            <button 
              onClick={() => onSelectTab('focus')}
              className="p-2 rounded-lg bg-[#0C1726] hover:bg-[#122338] border border-[#1B3452] flex flex-col items-center justify-center gap-1 transition cursor-pointer text-slate-300 hover:text-cyan-400"
            >
              <Coffee className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[9.5px] font-semibold text-center leading-tight">Custom Break</span>
            </button>

            <button 
              onClick={() => currentTask && onToggleTaskStar(currentTask.id)}
              className="p-2 rounded-lg bg-[#0C1726] hover:bg-[#122338] border border-[#1B3452] flex flex-col items-center justify-center gap-1 transition cursor-pointer text-slate-300 hover:text-amber-400"
            >
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[9.5px] font-semibold text-center leading-tight">Starred Task</span>
            </button>

            <button 
              onClick={() => onOpenTaskModal()}
              className="p-2 rounded-lg bg-[#0C1726] hover:bg-[#122338] border border-[#1B3452] flex flex-col items-center justify-center gap-1 transition cursor-pointer text-slate-300 hover:text-slate-100"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[9.5px] font-semibold text-center leading-tight">Drafted Task</span>
            </button>
          </div>

        </div>

        {/* Bottom Right: Day Overview concentric ring Card (4 cols) */}
        <div className="lg:col-span-4 taskroning-card p-5 flex flex-col justify-between">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
              Day Overview
            </div>
          </div>

          {/* Content: Checklists + Concentric Circle Ring */}
          <div className="my-2 flex items-center justify-between gap-4">
            
            {/* Checklist items */}
            <div className="space-y-2.5 flex-1 text-[11px]">
              
              {/* Group 1 */}
              <div>
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-xs bg-emerald-400" />
                  <span>Project 2P</span>
                </div>
                <div className="pl-3.5 space-y-0.5 text-slate-400 text-[10.5px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs border border-emerald-500/50 bg-emerald-950/40 flex items-center justify-center text-[8px] text-emerald-400">✓</span>
                    <span>Interactions</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs border border-slate-600 bg-slate-900" />
                    <span>Prototype Module 1</span>
                  </div>
                </div>
              </div>

              {/* Group 2 */}
              <div>
                <div className="flex items-center gap-1.5 font-bold text-cyan-400">
                  <span className="w-2 h-2 rounded-xs bg-cyan-400" />
                  <span>New Project</span>
                </div>
                <div className="pl-3.5 space-y-0.5 text-slate-400 text-[10.5px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs border border-cyan-500/50 bg-cyan-950/40 flex items-center justify-center text-[8px] text-cyan-400">✓</span>
                    <span>Meeting</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs border border-slate-600 bg-slate-900" />
                    <span>Discussion</span>
                  </div>
                </div>
              </div>

              {/* Group 3 */}
              <div>
                <div className="flex items-center gap-1.5 font-bold text-blue-400">
                  <span className="w-2 h-2 rounded-xs bg-blue-400" />
                  <span>Due Work</span>
                </div>
                <div className="pl-3.5 text-slate-400 text-[10.5px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs border border-slate-600 bg-slate-900" />
                    <span>Updation</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Concentric Double Circular Progress Rings */}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Outer Ring Track */}
                <circle cx="50" cy="50" r="42" stroke="#101E30" strokeWidth="6" fill="none" />
                {/* Outer Progress Ring (Cyan) */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#00F5C4"
                  strokeWidth="6"
                  strokeDasharray="264"
                  strokeDashoffset="75"
                  strokeLinecap="round"
                  fill="none"
                  className="shadow-[0_0_10px_#00F5C4]"
                />

                {/* Inner Ring Track */}
                <circle cx="50" cy="50" r="32" stroke="#0E1928" strokeWidth="5" fill="none" />
                {/* Inner Progress Ring (Royal Blue) */}
                <circle
                  cx="50"
                  cy="50"
                  r="32"
                  stroke="#3B82F6"
                  strokeWidth="5"
                  strokeDasharray="201"
                  strokeDashoffset="50"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-base font-extrabold text-white tracking-tight">
                  71.3%
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Progress Bar */}
          <div className="pt-3 border-t border-[#142337]">
            <div className="w-full bg-[#070D16] h-2 rounded-full overflow-hidden border border-[#16273C]">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full w-[71.3%] shadow-[0_0_6px_#00F5C4]" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
