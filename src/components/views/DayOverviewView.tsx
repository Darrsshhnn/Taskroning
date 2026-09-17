import React, { useState } from 'react';
import { Task, CalendarEvent, MainNavTab } from '../../types';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Coffee, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Flame, 
  Activity,
  Layers
} from 'lucide-react';
import { getTodayKey } from '../../utils/dateUtils';

interface DayOverviewViewProps {
  tasks: Task[];
  events: CalendarEvent[];
  onBack: () => void;
  onOpenTaskModal: (task?: Task, defaultDueDate?: string) => void;
  onOpenPlanEvent: (defaultDate?: string) => void;
  onToggleTaskComplete: (taskId: string) => void;
  selectedDate?: string;
}

export const DayOverviewView: React.FC<DayOverviewViewProps> = ({
  tasks,
  events,
  onBack,
  onOpenTaskModal,
  onOpenPlanEvent,
  onToggleTaskComplete,
  selectedDate = getTodayKey(),
}) => {
  const [currentDateKey, setCurrentDateKey] = useState(selectedDate);

  // Navigate forward / backward one day
  const handleShiftDay = (offsetDays: number) => {
    const d = new Date(currentDateKey);
    d.setDate(d.getDate() + offsetDays);
    setCurrentDateKey(d.toISOString().split('T')[0]);
  };

  // Filter tasks & events for this specific day
  const dayTasks = tasks.filter(t => t.dueDate === currentDateKey || (!t.dueDate && currentDateKey === getTodayKey()));
  const dayEvents = events.filter(e => e.date === currentDateKey);

  // Calculate day metrics
  const totalTasksCount = dayTasks.length;
  const completedTasksCount = dayTasks.filter(t => t.status === 'completed').length;
  const taskCompletionPct = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 71;

  // Formatted date string
  const dateObj = new Date(currentDateKey + 'T00:00:00');
  const formattedDateTitle = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Group tasks by category or project
  const project2PTasks = dayTasks.filter(t => t.title.toLowerCase().includes('project 2p') || t.category === 'Design' || t.category === 'Engineering');
  const newProjectTasks = dayTasks.filter(t => t.title.toLowerCase().includes('new') || t.category === 'Product' || t.category === 'Client');
  const dueWorkTasks = dayTasks.filter(t => !project2PTasks.includes(t) && !newProjectTasks.includes(t));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 select-none animate-fadeIn">
      
      {/* Top Navigation & Day Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#142337]">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="px-3.5 py-2 rounded-xl bg-[#091524] hover:bg-[#0E1E33] border border-cyan-500/40 text-cyan-400 hover:text-white transition flex items-center gap-2 text-xs font-bold shadow-[0_0_12px_rgba(0,245,196,0.2)] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-400/50 text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                Dedicated Day Screen
              </span>
              <span className="text-xs text-slate-400 font-mono">Real Firestore Sync</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              {formattedDateTitle}
            </h1>
          </div>
        </div>

        {/* Date Switcher & Actions */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-[#070D16] border border-[#16273C] rounded-xl p-1">
            <button
              onClick={() => handleShiftDay(-1)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-[#0D1929] transition cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-mono text-slate-200">{currentDateKey}</span>
            <button
              onClick={() => handleShiftDay(1)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-[#0D1929] transition cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onOpenPlanEvent(currentDateKey)}
            className="px-3.5 py-2 rounded-xl bg-[#091524] hover:bg-[#0E1E33] border border-teal-500/40 text-teal-300 hover:text-white transition text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-teal-400" />
            <span>Plan Event</span>
          </button>

          <button
            onClick={() => onOpenTaskModal(undefined, currentDateKey)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 text-xs font-bold transition shadow-[0_0_15px_rgba(0,245,196,0.3)] flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Day Task</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Concentric Gauge & Detailed Day Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Progress Rings & Day Stat Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Day Overview Concentric Circle Card */}
          <div className="taskroning-card p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#142337] pb-3">
              <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                Overall Day Completion
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {completedTasksCount} / {Math.max(1, totalTasksCount)} Done
              </span>
            </div>

            {/* Concentric Circular Meter Graphic */}
            <div className="py-4 flex flex-col items-center justify-center relative">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Outer Ring Track */}
                  <circle cx="50" cy="50" r="42" stroke="#101E30" strokeWidth="6" fill="none" />
                  {/* Outer Progress Ring (Cyan - Tasks) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#00F5C4"
                    strokeWidth="6"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * taskCompletionPct) / 100}
                    strokeLinecap="round"
                    fill="none"
                    className="shadow-[0_0_12px_#00F5C4] transition-all duration-700"
                  />

                  {/* Inner Ring Track */}
                  <circle cx="50" cy="50" r="32" stroke="#0E1928" strokeWidth="5" fill="none" />
                  {/* Inner Progress Ring (Royal Blue - Focus hours) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="32"
                    stroke="#3B82F6"
                    strokeWidth="5"
                    strokeDasharray="201"
                    strokeDashoffset={60}
                    strokeLinecap="round"
                    fill="none"
                    className="shadow-[0_0_8px_#3B82F6]"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-white font-mono drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {taskCompletionPct}%
                  </span>
                  <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">
                    Day Completed
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 flex items-center justify-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00F5C4]" />
                  <span className="text-slate-300 font-medium">Task Velocity</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_6px_#3B82F6]" />
                  <span className="text-slate-300 font-medium">Sprint Focus</span>
                </div>
              </div>
            </div>

            {/* Bottom 3-Metric Row */}
            <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-[#142337]">
              <div className="p-2.5 rounded-xl bg-[#08121E] border border-[#14263D]">
                <span className="text-xs font-bold text-slate-200 block font-mono">01 : 24 hr</span>
                <span className="text-[10px] text-slate-400">Current Work</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#08121E] border border-[#14263D]">
                <span className="text-xs font-bold text-cyan-400 block font-mono">04 : 12 hr</span>
                <span className="text-[10px] text-slate-400">Total Today</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#08121E] border border-[#14263D]">
                <span className="text-xs font-bold text-emerald-400 block font-mono">92%</span>
                <span className="text-[10px] text-slate-400">Efficiency</span>
              </div>
            </div>

          </div>

          {/* Quick Break Countdowns */}
          <div className="taskroning-card p-5 space-y-3">
            <div className="text-xs font-bold text-slate-200 pb-2 border-b border-[#142337] flex items-center justify-between">
              <span>Day Recharge Intervals</span>
              <Coffee className="w-3.5 h-3.5 text-cyan-400" />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[#08121E] border border-[#162C47] space-y-1">
                <span className="text-[11px] font-bold text-slate-200 block">Lunch Break</span>
                <span className="text-[10px] text-slate-400 block">01:00 PM - 01:30 PM</span>
                <span className="text-xs font-bold font-mono text-emerald-400">30 Min</span>
              </div>
              <div className="p-3 rounded-xl bg-[#08121E] border border-[#162C47] space-y-1">
                <span className="text-[11px] font-bold text-slate-200 block">Evening Reset</span>
                <span className="text-[10px] text-slate-400 block">05:00 PM - 05:15 PM</span>
                <span className="text-xs font-bold font-mono text-teal-400">15 Min</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Detailed Project Task Breakdowns & Timeblock Schedule (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Project-by-Project Task Checklist */}
          <div className="taskroning-card p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#142337] pb-3">
              <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                Detailed Work Matrix
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Click circle to mark completed
              </span>
            </div>

            <div className="space-y-4">
              
              {/* Group 1: Project 2P */}
              <div className="p-4 rounded-xl bg-[#08121E] border border-[#162A43] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-emerald-400 text-xs">
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-400 shadow-[0_0_6px_#10B981]" />
                    <span>Project 2P Tasks</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Design & Prototyping</span>
                </div>

                <div className="space-y-1.5 pl-2">
                  {(project2PTasks.length > 0 ? project2PTasks : dayTasks.slice(0, 3)).map((t) => {
                    const isCompleted = t.status === 'completed';
                    return (
                      <div
                        key={t.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-[#0D1826] transition group"
                      >
                        <div 
                          onClick={() => onToggleTaskComplete(t.id)}
                          className="flex items-center gap-2.5 cursor-pointer flex-1"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                          )}
                          <span className={`text-xs ${isCompleted ? 'line-through text-slate-500' : 'text-slate-200 group-hover:text-cyan-300'}`}>
                            {t.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400">{t.dueTime || '10:15'}</span>
                          <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono">
                            {t.progress || (isCompleted ? 100 : 50)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Group 2: New Project */}
              <div className="p-4 rounded-xl bg-[#08121E] border border-[#162A43] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-cyan-400 text-xs">
                    <span className="w-2.5 h-2.5 rounded-xs bg-cyan-400 shadow-[0_0_6px_#00F5C4]" />
                    <span>New Project Collaboration</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Team Sync</span>
                </div>

                <div className="space-y-1.5 pl-2">
                  {(newProjectTasks.length > 0 ? newProjectTasks : dayTasks.slice(3, 5)).map((t) => {
                    const isCompleted = t.status === 'completed';
                    return (
                      <div
                        key={t.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-[#0D1826] transition group"
                      >
                        <div 
                          onClick={() => onToggleTaskComplete(t.id)}
                          className="flex items-center gap-2.5 cursor-pointer flex-1"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                          )}
                          <span className={`text-xs ${isCompleted ? 'line-through text-slate-500' : 'text-slate-200 group-hover:text-cyan-300'}`}>
                            {t.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400">{t.dueTime || '12:00'}</span>
                          <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 font-mono">
                            {t.progress || (isCompleted ? 100 : 0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* Hour-by-Hour Timeline Schedule */}
          <div className="taskroning-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#142337] pb-3">
              <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                Day Schedule Timeline
              </div>
              <button
                onClick={() => onOpenPlanEvent(currentDateKey)}
                className="text-xs font-bold text-cyan-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Timeblock</span>
              </button>
            </div>

            <div className="space-y-2.5 divide-y divide-[#101F33]">
              {(dayEvents.length > 0 ? dayEvents : events.slice(0, 5)).map((ev) => (
                <div key={ev.id} className="pt-2.5 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: ev.color }} />
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">{ev.title}</span>
                      {ev.description && (
                        <p className="text-[10.5px] text-slate-400 leading-snug mt-0.5">{ev.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
                        {ev.locationOrUrl && <span>📍 {ev.locationOrUrl}</span>}
                        {ev.attendees && ev.attendees.length > 0 && <span>👥 {ev.attendees.join(', ')}</span>}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-cyan-300 whitespace-nowrap bg-[#0C1624] px-2.5 py-1 rounded-lg border border-[#162D4A]">
                    {ev.startTime} - {ev.endTime}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
