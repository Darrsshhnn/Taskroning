import React, { useState, useEffect } from 'react';
import { Task, CalendarEvent, MainNavTab } from '../../types';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Clock, 
  Coffee, 
  Play, 
  CheckCircle2, 
  Circle,
  ArrowRight,
  Sparkles,
  Calendar as CalendarIcon,
  Flame,
  Check
} from 'lucide-react';
import { getTodayKey } from '../../utils/dateUtils';

interface TaskroningViewProps {
  tasks: Task[];
  events: CalendarEvent[];
  onOpenTaskModal: (task?: Task, defaultDueDate?: string) => void;
  onOpenPlanEvent: (defaultDate?: string) => void;
  onSelectTab: (tab: MainNavTab) => void;
  onToggleTaskComplete: (taskId: string) => void;
}

export const TaskroningView: React.FC<TaskroningViewProps> = ({
  tasks,
  events,
  onOpenTaskModal,
  onOpenPlanEvent,
  onSelectTab,
  onToggleTaskComplete,
}) => {
  const [reportPeriod, setReportPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [taskPage, setTaskPage] = useState(0);
  const [countdownSeconds, setCountdownSeconds] = useState(14 * 60 + 22);

  // Live countdown timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatMinSec = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')} Min`;
  };

  const weeklyBars = [
    { day: 'Mon', heightPct: 60 },
    { day: 'Tue', heightPct: 95 },
    { day: 'Wed', heightPct: 65 },
    { day: 'Thu', heightPct: 75 },
    { day: 'Fri', heightPct: 85 },
    { day: 'Sat', heightPct: 45 },
  ];

  // Pagination for Task Schedule
  const PAGE_SIZE = 6;
  const totalPages = Math.ceil(Math.max(1, tasks.length) / PAGE_SIZE);
  const paginatedTasks = tasks.slice(taskPage * PAGE_SIZE, (taskPage + 1) * PAGE_SIZE);

  // Next upcoming task for countdown
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const nextTask = pendingTasks[0] || tasks[0];

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1600px] mx-auto space-y-6 select-none animate-fadeIn">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: Task Schedule & Weekly Report (7 cols)       */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Working Task Schedule Card */}
          <div className="taskroning-card p-5 space-y-4 shadow-xl">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#142337]">
              <div className="flex items-center gap-2">
                <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                  Task Schedule
                </div>
                <span className="text-[10px] text-cyan-400 font-mono hidden sm:inline">
                  {tasks.length} Active Cloud Tasks
                </span>
              </div>

              <div className="flex items-center gap-2">
                {totalPages > 1 && (
                  <div className="flex items-center gap-1 bg-[#08121E] px-2 py-1 rounded-lg border border-[#152538] text-xs">
                    <button
                      onClick={() => setTaskPage(p => Math.max(0, p - 1))}
                      disabled={taskPage === 0}
                      className="p-0.5 text-slate-400 hover:text-cyan-400 disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono px-1">
                      {taskPage + 1}/{totalPages}
                    </span>
                    <button
                      onClick={() => setTaskPage(p => Math.min(totalPages - 1, p + 1))}
                      disabled={taskPage >= totalPages - 1}
                      className="p-0.5 text-slate-400 hover:text-cyan-400 disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => onOpenTaskModal()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-400 text-cyan-400 hover:text-white transition text-xs font-bold shadow-[0_0_10px_rgba(0,245,196,0.3)] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto min-h-[220px]">
              {tasks.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <p className="text-xs text-slate-400">No tasks in schedule yet.</p>
                  <button
                    onClick={() => onOpenTaskModal()}
                    className="text-xs text-cyan-400 hover:underline font-bold"
                  >
                    + Create your first task
                  </button>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 font-medium border-b border-[#142337] text-[11px]">
                      <th className="py-2 px-2 w-8">Status</th>
                      <th className="py-2 px-2">Task Name</th>
                      <th className="py-2 px-2 w-28">Progress</th>
                      <th className="py-2 px-2 w-20 text-center">Time</th>
                      <th className="py-2 px-2 w-16 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#122033]">
                    {paginatedTasks.map((task, idx) => {
                      const isCompleted = task.status === 'completed';
                      const progressPct = task.progress ?? (isCompleted ? 100 : 50);

                      return (
                        <tr 
                          key={task.id} 
                          className="hover:bg-[#0E1928] transition group"
                        >
                          {/* Toggle Completion Checkmark */}
                          <td className="py-2.5 px-2 text-center">
                            <button
                              onClick={() => onToggleTaskComplete(task.id)}
                              className="text-slate-400 hover:text-cyan-400 transition cursor-pointer"
                              title={isCompleted ? "Mark in-progress" : "Mark completed"}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shadow-[0_0_8px_#10B981]" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-500 hover:text-cyan-400" />
                              )}
                            </button>
                          </td>

                          {/* Task Name & Modal Trigger */}
                          <td 
                            onClick={() => onOpenTaskModal(task)}
                            className="py-2.5 px-2 cursor-pointer"
                          >
                            <span className={`font-medium block truncate max-w-[280px] ${
                              isCompleted 
                                ? 'line-through text-slate-500' 
                                : 'text-slate-200 group-hover:text-cyan-300'
                            } transition`}>
                              {task.title}
                            </span>
                          </td>

                          {/* Progress */}
                          <td className="py-2.5 px-2">
                            <div className="w-full bg-[#070D16] h-1.5 rounded-full overflow-hidden border border-[#16273C]">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isCompleted
                                    ? 'bg-emerald-400 shadow-[0_0_6px_#10B981]'
                                    : 'bg-gradient-to-r from-cyan-400 to-teal-300 shadow-[0_0_6px_rgba(0,245,196,0.5)]'
                                }`}
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </td>

                          {/* Time */}
                          <td className="py-2.5 px-2 font-mono text-[11px] text-slate-300 text-center whitespace-nowrap">
                            {task.dueTime || '10:15'}
                          </td>

                          {/* Update / Edit Icon */}
                          <td className="py-2.5 px-2 text-center">
                            <button
                              onClick={() => onOpenTaskModal(task)}
                              className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-[#12253D] rounded transition cursor-pointer"
                              title="Edit task details"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

          </div>

          {/* Weekly Report Card */}
          <div className="taskroning-card p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                Weekly Report
              </div>

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
                    reportPeriod === 'weekly' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Weekly
                </button>
              </div>
            </div>

            {/* Chart */}
            <div className="mt-6 flex items-end justify-between gap-3 h-36 pt-4 pb-2 border-b border-[#142337]">
              <div className="flex flex-col justify-between h-full text-[10px] font-mono text-slate-500 pb-1">
                <span>7h</span>
                <span>5h</span>
                <span>3h</span>
                <span>1h</span>
              </div>

              <div className="flex-1 flex items-end justify-around h-full gap-2 px-2">
                {weeklyBars.map((bar) => (
                  <div key={bar.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-3 bg-[#0e1b2a] rounded-t-full h-full flex items-end overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-cyan-500 to-teal-300 rounded-t-full transition-all duration-700 shadow-[0_0_8px_rgba(0,245,196,0.3)]"
                        style={{ height: `${bar.heightPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-end">
              <div className="px-3.5 py-1.5 rounded-lg bg-[#0C1726] border border-[#19304D] text-right">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Weekly Avg</span>
                <span className="text-xs font-bold text-cyan-400">5:30 <span className="text-[10px] text-slate-400 font-normal">HOURS</span></span>
              </div>
            </div>

          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Project Task, Task Reminder, Plan Event     */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Project Task Card */}
          <div className="taskroning-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-300">
                Project Task
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <button 
                  onClick={() => setTaskPage(prev => Math.max(0, prev - 1))}
                  className="p-1 hover:text-cyan-400 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setTaskPage(prev => prev + 1)}
                  className="p-1 hover:text-cyan-400 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Featured Task */}
            {nextTask && (
              <div 
                onClick={() => onOpenTaskModal(nextTask)}
                className="p-3.5 rounded-xl bg-[#08121E] border border-cyan-500/30 space-y-2 cursor-pointer hover:border-cyan-400/60 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100 truncate max-w-[220px]">
                    {nextTask.title}
                  </span>
                  <span className="text-xs font-bold text-cyan-400 font-mono">
                    {nextTask.progress ?? 55}%
                  </span>
                </div>
                <div className="w-full bg-[#070D16] h-1.5 rounded-full overflow-hidden border border-[#16273C]">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full" 
                    style={{ width: `${nextTask.progress ?? 55}%` }}
                  />
                </div>
              </div>
            )}

            {/* Sublist */}
            <div className="space-y-1.5 pt-1 text-xs">
              {tasks.slice(0, 5).map((t, idx) => (
                <div 
                  key={t.id}
                  onClick={() => onOpenTaskModal(t)}
                  className="p-2 rounded-lg hover:bg-[#0E1928] flex items-center justify-between transition cursor-pointer text-slate-300"
                >
                  <span className="text-[11.5px] truncate max-w-[280px]">
                    {idx + 1}. {t.title}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                </div>
              ))}
            </div>

          </div>

          {/* Task Reminder Card (Countdown) */}
          <div className="taskroning-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                Task Reminder
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-[#0C1929] to-[#091320] border border-cyan-500/40 shadow-[0_0_15px_-4px_rgba(0,245,196,0.2)] space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Next Task</span>
                <span className="text-xs font-bold text-slate-100 block truncate">
                  {nextTask?.title || 'Meeting with new team - Offline : New'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-cyan-400 font-mono drop-shadow-[0_0_8px_rgba(0,245,196,0.6)]">
                    {formatMinSec(countdownSeconds)}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 block">{nextTask?.dueTime || '12 : 00 P.M.'}</span>
                </div>

                <button 
                  onClick={() => onSelectTab('focus')}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  Enter Focus
                </button>
              </div>
            </div>

            {/* Upcoming items in queue */}
            <div className="space-y-1.5 text-xs text-slate-400 pt-1">
              {tasks.slice(1, 3).map((t, i) => (
                <div key={t.id} className="flex items-center justify-between p-1.5 rounded-lg bg-[#08121E] border border-[#14263D]">
                  <span className="text-[11px] truncate max-w-[200px]">{i + 1}. {t.title}</span>
                  <span className="text-[10px] font-mono text-cyan-400">{t.dueTime || '01:30 P.M.'}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Working Plan Event Card */}
          <div className="taskroning-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#142337] pb-2">
              <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                Plan Event
              </div>
              <button 
                onClick={() => onOpenPlanEvent()}
                className="w-6 h-6 rounded-full bg-cyan-950/40 border border-cyan-400 text-cyan-400 hover:text-white flex items-center justify-center cursor-pointer transition"
                title="Plan new event modal"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Break / Event Countdowns */}
            <div className="space-y-2.5 pt-1">
              <div 
                onClick={() => onOpenPlanEvent()}
                className="p-3 rounded-xl bg-[#08121E] border border-[#162C47] hover:border-emerald-400/50 flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-950/50 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                    <Coffee className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Lunch Break</span>
                    <span className="text-[10px] font-mono text-slate-400">01 : 00 P.M.</span>
                  </div>
                </div>
                <span className="text-xs font-bold font-mono text-emerald-400">00 : 59 Min</span>
              </div>

              <div 
                onClick={() => onOpenPlanEvent()}
                className="p-3 rounded-xl bg-[#08121E] border border-[#162C47] hover:border-teal-400/50 flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-950/50 border border-teal-400/40 flex items-center justify-center text-teal-400">
                    <Coffee className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Evening Break</span>
                    <span className="text-[10px] font-mono text-slate-400">05 : 00 P.M.</span>
                  </div>
                </div>
                <span className="text-xs font-bold font-mono text-teal-400">05 : 14 Min</span>
              </div>
            </div>

            <button
              onClick={() => onOpenPlanEvent()}
              className="w-full mt-2 py-2 rounded-xl bg-[#0A1626] hover:bg-[#0E2036] border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Schedule New Event</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
