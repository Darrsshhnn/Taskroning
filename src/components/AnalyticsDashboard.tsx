import React from 'react';
import { Task, CalendarEvent } from '../types';
import { calculateMinutesBetween } from '../utils/dateUtils';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Timer, 
  TrendingUp, 
  Flame, 
  ShieldCheck, 
  Award,
  Layers
} from 'lucide-react';

interface AnalyticsDashboardProps {
  tasks: Task[];
  events: CalendarEvent[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ tasks, events }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const activeTasks = tasks.filter(t => t.status !== 'completed');
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Total Pomodoro sessions
  const totalPomodoros = tasks.reduce((acc, t) => acc + (t.pomodoroCount || 0), 0);
  const totalFocusHoursFromPomodoros = (totalPomodoros * 25) / 60;

  // Calculate meeting hours
  const totalMeetingMinutes = events.reduce((acc, ev) => {
    return acc + Math.max(0, calculateMinutesBetween(ev.startTime, ev.endTime));
  }, 0);

  // Time-blocked focus task hours
  const totalTimeBlockedMinutes = tasks
    .filter(t => t.timeBlock)
    .reduce((acc, t) => acc + Math.max(0, calculateMinutesBetween(t.timeBlock!.startTime, t.timeBlock!.endTime)), 0);

  // Category distribution
  const categories = ['Engineering', 'Product', 'Design', 'Marketing', 'Operations', 'Client'];
  const categoryCounts = categories.map(cat => ({
    name: cat,
    count: tasks.filter(t => t.category === cat).length,
    completed: tasks.filter(t => t.category === cat && t.status === 'completed').length,
  }));

  // Priority distribution
  const p1Count = tasks.filter(t => t.priority === 'p1_urgent').length;
  const p2Count = tasks.filter(t => t.priority === 'p2_high').length;
  const p3Count = tasks.filter(t => t.priority === 'p3_medium').length;
  const p4Count = tasks.filter(t => t.priority === 'p4_low').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Productivity & Workflow Analytics</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Employee Performance Metrics
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking of deliverable completion, deep work focus hours, and meeting load balance.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300 font-medium">Sprint Health:</span>
          <span className="text-emerald-400 font-bold">{completionRate}% Completed</span>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Completion Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{completionRate}%</div>
          <p className="text-[11px] text-slate-400">
            {completedTasks.length} of {totalTasks} deliverables done
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Deep Work Logged</span>
            <Timer className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalFocusHoursFromPomodoros.toFixed(1)} hrs</div>
          <p className="text-[11px] text-slate-400">
            {totalPomodoros} focus sessions completed
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Calendar Meeting Load</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{(totalMeetingMinutes / 60).toFixed(1)} hrs</div>
          <p className="text-[11px] text-slate-400">
            {events.length} team & client commitments
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Time-Blocked Focus</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{(totalTimeBlockedMinutes / 60).toFixed(1)} hrs</div>
          <p className="text-[11px] text-slate-400">
            {tasks.filter(t => t.timeBlock).length} tasks scheduled on calendar
          </p>
        </div>

      </div>

      {/* Grid: Category Breakdown & Priority Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Workstream Distribution</h3>
            <span className="text-xs text-slate-400">By Department</span>
          </div>

          <div className="space-y-3">
            {categoryCounts.map(cat => {
              const pct = totalTasks > 0 ? (cat.count / totalTasks) * 100 : 0;
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-medium">{cat.name}</span>
                    <span className="font-mono text-slate-400">{cat.completed}/{cat.count} done ({Math.round(pct)}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Matrix Distribution */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Priority Level Allocation</h3>
            <span className="text-xs text-slate-400">Urgency Breakdown</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-lg">
              <div className="text-xs font-bold text-rose-400">P1 Urgent & Critical</div>
              <div className="text-xl font-bold text-white mt-1">{p1Count}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Top-priority items</p>
            </div>

            <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg">
              <div className="text-xs font-bold text-amber-400">P2 High Strategic</div>
              <div className="text-xl font-bold text-white mt-1">{p2Count}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Key roadmap items</p>
            </div>

            <div className="p-3 bg-blue-950/20 border border-blue-500/30 rounded-lg">
              <div className="text-xs font-bold text-blue-400">P3 Medium Async</div>
              <div className="text-xl font-bold text-white mt-1">{p3Count}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Reviews & batch tasks</p>
            </div>

            <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-lg">
              <div className="text-xs font-bold text-slate-400">P4 Backlog</div>
              <div className="text-xl font-bold text-white mt-1">{p4Count}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Low-priority backlog</p>
            </div>
          </div>
        </div>

      </div>

      {/* Completed Milestones List */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white">Recent Completed Deliverables</h3>
          <span className="text-xs text-emerald-400 font-semibold">{completedTasks.length} Completed</span>
        </div>

        {completedTasks.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            <p>No completed deliverables yet. Check off items in the Daily Planner or Kanban board!</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {completedTasks.map(task => (
              <div
                key={task.id}
                className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-slate-300">{task.title}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">{task.category}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {task.pomodoroCount || 0} Pomodoros • {task.estimatedMinutes}m
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
