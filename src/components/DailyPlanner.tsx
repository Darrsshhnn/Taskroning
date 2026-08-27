import React, { useState } from 'react';
import { 
  CalendarEvent, 
  Task, 
  PriorityLevel 
} from '../types';
import { 
  formatReadableDate, 
  formatTime12h, 
  getTodayKey, 
  calculateMinutesBetween, 
  addMinutesToTime 
} from '../utils/dateUtils';
import { 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Play, 
  Calendar as CalendarIcon, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Video, 
  ExternalLink,
  Flame
} from 'lucide-react';

interface DailyPlannerProps {
  currentDateKey: string;
  onDateChange: (newKey: string) => void;
  tasks: Task[];
  events: CalendarEvent[];
  onToggleTaskComplete: (taskId: string) => void;
  onOpenTaskModal: (task: Task) => void;
  onOpenEventModal: (event: CalendarEvent) => void;
  onTimeBlockTask: (taskId: string, date: string, startTime: string, endTime: string) => void;
  onOpenNewTask: () => void;
  onOpenNewEvent: () => void;
  onOpenAIOptimizer: () => void;
  onStartFocusOnTask: (task: Task) => void;
}

export const DailyPlanner: React.FC<DailyPlannerProps> = ({
  currentDateKey,
  onDateChange,
  tasks,
  events,
  onToggleTaskComplete,
  onOpenTaskModal,
  onOpenEventModal,
  onTimeBlockTask,
  onOpenNewTask,
  onOpenNewEvent,
  onOpenAIOptimizer,
  onStartFocusOnTask,
}) => {
  const [activeQuickSlotTime, setActiveQuickSlotTime] = useState<string | null>(null);

  const isToday = currentDateKey === getTodayKey();

  // Navigation handlers
  const handlePrevDay = () => {
    const d = new Date(currentDateKey + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    onDateChange(`${y}-${m}-${day}`);
  };

  const handleNextDay = () => {
    const d = new Date(currentDateKey + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    onDateChange(`${y}-${m}-${day}`);
  };

  const handleTodayClick = () => {
    onDateChange(getTodayKey());
  };

  // Filter day's events & time-blocked tasks
  const dayEvents = events
    .filter(e => e.date === currentDateKey)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const dayTimeBlockedTasks = tasks
    .filter(t => t.timeBlock && t.timeBlock.date === currentDateKey)
    .sort((a, b) => (a.timeBlock?.startTime || '').localeCompare(b.timeBlock?.startTime || ''));

  // Pending tasks due today or unscheduled
  const unscheduledTasks = tasks.filter(t => {
    if (t.status === 'completed') return false;
    const isDue = t.dueDate === currentDateKey;
    const isNotTimeBlocked = !t.timeBlock || t.timeBlock.date !== currentDateKey;
    return isDue && isNotTimeBlocked;
  });

  // Calculate Metrics
  const totalMeetingMinutes = dayEvents
    .filter(e => e.category !== 'deep_work')
    .reduce((acc, ev) => acc + Math.max(0, calculateMinutesBetween(ev.startTime, ev.endTime)), 0);

  const totalFocusMinutes = dayTimeBlockedTasks
    .reduce((acc, t) => acc + (t.timeBlock ? Math.max(0, calculateMinutesBetween(t.timeBlock.startTime, t.timeBlock.endTime)) : (t.estimatedMinutes || 45)), 0) +
    dayEvents.filter(e => e.category === 'deep_work').reduce((acc, ev) => acc + Math.max(0, calculateMinutesBetween(ev.startTime, ev.endTime)), 0);

  const totalScheduledMinutes = totalMeetingMinutes + totalFocusMinutes;
  const workDayCapacityMinutes = 8 * 60; // 8 hours
  const freeMinutes = Math.max(0, workDayCapacityMinutes - totalScheduledMinutes);

  // Time grid hours (08:00 to 18:00)
  const hours = Array.from({ length: 11 }, (_, i) => {
    const h = i + 8;
    return `${String(h).padStart(2, '0')}:00`;
  });

  // Next upcoming item for today
  const now = new Date();
  const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const upcomingEvent = dayEvents.find(e => e.startTime >= currentHHMM);
  const upcomingTask = dayTimeBlockedTasks.find(t => t.status !== 'completed' && (t.timeBlock?.startTime || '') >= currentHHMM);

  const getPriorityBadge = (p: PriorityLevel) => {
    switch (p) {
      case 'p1_urgent':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">P1 Urgent</span>;
      case 'p2_high':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">P2 High</span>;
      case 'p3_medium':
        return <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">P3 Medium</span>;
      case 'p4_low':
        return <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-slate-500/10 text-slate-400 border border-slate-500/30">P4 Low</span>;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'standup': return 'border-blue-500 bg-blue-500/10 text-blue-300';
      case 'meeting': return 'border-purple-500 bg-purple-500/10 text-purple-300';
      case 'deep_work': return 'border-emerald-500 bg-emerald-500/10 text-emerald-300';
      case 'client_call': return 'border-amber-500 bg-amber-500/10 text-amber-300';
      case 'review': return 'border-pink-500 bg-pink-500/10 text-pink-300';
      default: return 'border-slate-600 bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner: Date Controls + AI Quick Planner Trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              id="planner-prev-day-btn"
              onClick={handlePrevDay}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="planner-today-btn"
              onClick={handleTodayClick}
              className={`px-3 py-1 text-xs font-semibold rounded transition cursor-pointer ${
                isToday ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              id="planner-next-day-btn"
              onClick={handleNextDay}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-indigo-400" />
              <span>{formatReadableDate(currentDateKey, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {dayEvents.length} calendar events • {dayTimeBlockedTasks.length} time-blocked tasks • {unscheduledTasks.length} pending
            </p>
          </div>
        </div>

        {/* AI Optimize button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            id="planner-ai-optimize-btn"
            onClick={onOpenAIOptimizer}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500/20 to-indigo-500/20 hover:from-amber-500/30 hover:to-indigo-500/30 text-amber-300 border border-amber-500/40 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>AI Schedule Optimizer</span>
          </button>
        </div>
      </div>

      {/* Workload Capacity Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-medium">Total Workload</span>
            <span className="text-slate-200 font-bold">{(totalScheduledMinutes / 60).toFixed(1)}h / 8.0h</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
            <div 
              className="bg-purple-500 h-full transition-all" 
              style={{ width: `${Math.min(100, (totalMeetingMinutes / workDayCapacityMinutes) * 100)}%` }} 
              title={`Meetings: ${(totalMeetingMinutes / 60).toFixed(1)}h`}
            />
            <div 
              className="bg-emerald-500 h-full transition-all" 
              style={{ width: `${Math.min(100, (totalFocusMinutes / workDayCapacityMinutes) * 100)}%` }} 
              title={`Focus Tasks: ${(totalFocusMinutes / 60).toFixed(1)}h`}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {totalScheduledMinutes > workDayCapacityMinutes 
              ? <span className="text-rose-400 font-semibold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Over capacity by {((totalScheduledMinutes - workDayCapacityMinutes)/60).toFixed(1)}h</span> 
              : <span>{((freeMinutes)/60).toFixed(1)}h free focus gap remaining</span>}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span>Calendar Meetings</span>
          </div>
          <div className="text-lg font-bold text-white">{(totalMeetingMinutes / 60).toFixed(1)} hrs</div>
          <p className="text-[11px] text-slate-400 mt-1">{dayEvents.length} scheduled commitments</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Focus & Deep Work</span>
          </div>
          <div className="text-lg font-bold text-white">{(totalFocusMinutes / 60).toFixed(1)} hrs</div>
          <p className="text-[11px] text-slate-400 mt-1">{dayTimeBlockedTasks.length} time-blocked task blocks</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Unscheduled Tasks</span>
          </div>
          <div className="text-lg font-bold text-white">{unscheduledTasks.length} tasks</div>
          <p className="text-[11px] text-slate-400 mt-1">Due today without calendar slot</p>
        </div>
      </div>

      {/* Up Next / Current Active Focus Card */}
      {isToday && (upcomingEvent || upcomingTask) && (
        <div className="bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/30 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  Next Up Today
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  {upcomingEvent ? formatTime12h(upcomingEvent.startTime) : formatTime12h(upcomingTask?.timeBlock?.startTime || '')}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                {upcomingEvent ? upcomingEvent.title : upcomingTask?.title}
              </h3>
              <p className="text-xs text-slate-400">
                {upcomingEvent?.description || upcomingTask?.description || 'Upcoming agenda item'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {upcomingEvent?.locationOrUrl && (
              <a
                href={upcomingEvent.locationOrUrl.startsWith('http') ? upcomingEvent.locationOrUrl : `https://${upcomingEvent.locationOrUrl}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-500 rounded-lg transition"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join Meeting</span>
              </a>
            )}
            {upcomingTask && (
              <button
                onClick={() => onStartFocusOnTask(upcomingTask)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Focus Session</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Grid: Schedule Timeline & Unscheduled Tasks Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Hour by Hour Timeline */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Daily Timeline & Time-Blocks</h3>
              <p className="text-xs text-slate-400">Synchronized meetings and dedicated task work slots</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="timeline-add-event-btn"
                onClick={onOpenNewEvent}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
              >
                + Add Event
              </button>
            </div>
          </div>

          {/* Timeline list */}
          <div className="space-y-3">
            {hours.map((hourStr) => {
              const hourNum = parseInt(hourStr.split(':')[0], 10);
              const nextHourStr = `${String(hourNum + 1).padStart(2, '0')}:00`;

              // Find events and tasks in this slot
              const slotEvents = dayEvents.filter(e => {
                const sH = parseInt(e.startTime.split(':')[0], 10);
                return sH === hourNum;
              });

              const slotTasks = dayTimeBlockedTasks.filter(t => {
                if (!t.timeBlock) return false;
                const sH = parseInt(t.timeBlock.startTime.split(':')[0], 10);
                return sH === hourNum;
              });

              const hasItems = slotEvents.length > 0 || slotTasks.length > 0;

              return (
                <div key={hourStr} className="group flex items-start gap-4 pt-1">
                  {/* Time label */}
                  <div className="w-16 flex-shrink-0 text-right">
                    <span className="text-xs font-semibold text-slate-400">{formatTime12h(hourStr)}</span>
                  </div>

                  {/* Slot content */}
                  <div className="flex-1 min-h-[52px] border-l-2 border-slate-800 pl-4 py-0.5 space-y-2">
                    {slotEvents.map(event => (
                      <div
                        key={event.id}
                        onClick={() => onOpenEventModal(event)}
                        className={`p-2.5 rounded-lg border-l-4 transition hover:brightness-110 cursor-pointer shadow-sm ${getCategoryColor(event.category)}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{event.title}</span>
                            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-300">
                              {event.category.replace('_', ' ')}
                            </span>
                          </div>
                          <span className="text-xs font-mono font-medium text-slate-300">
                            {formatTime12h(event.startTime)} - {formatTime12h(event.endTime)}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-xs text-slate-300/80 mt-1 line-clamp-1">{event.description}</p>
                        )}
                        {event.locationOrUrl && (
                          <div className="flex items-center gap-1.5 text-[11px] text-indigo-300 mt-1">
                            <Video className="w-3 h-3" />
                            <span className="truncate">{event.locationOrUrl}</span>
                          </div>
                        )}
                      </div>
                    ))}

                    {slotTasks.map(task => (
                      <div
                        key={task.id}
                        className={`p-2.5 rounded-lg border-l-4 border-emerald-500 bg-emerald-950/20 border border-slate-800/80 transition hover:border-emerald-500/50 shadow-sm ${
                          task.status === 'completed' ? 'opacity-60 bg-slate-900/50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleTaskComplete(task.id);
                              }}
                              className="text-slate-400 hover:text-emerald-400 cursor-pointer"
                            >
                              {task.status === 'completed' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </button>
                            <span 
                              onClick={() => onOpenTaskModal(task)}
                              className={`text-xs font-bold cursor-pointer hover:text-emerald-300 ${
                                task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-200'
                              }`}
                            >
                              [Task Block] {task.title}
                            </span>
                            {getPriorityBadge(task.priority)}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-medium text-emerald-400">
                              {formatTime12h(task.timeBlock?.startTime || '')} - {formatTime12h(task.timeBlock?.endTime || '')}
                            </span>
                            {task.status !== 'completed' && (
                              <button
                                onClick={() => onStartFocusOnTask(task)}
                                className="p-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition cursor-pointer"
                                title="Start Focus Timer"
                              >
                                <Play className="w-3 h-3 fill-current" />
                              </button>
                            )}
                          </div>
                        </div>

                        {task.subtasks.length > 0 && (
                          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-3">
                            <span>
                              Subtasks: {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} done
                            </span>
                            <span className="text-slate-500">•</span>
                            <span>{task.category}</span>
                          </div>
                        )}
                      </div>
                    ))}

                    {!hasItems && (
                      <div className="flex items-center justify-between py-2 px-3 rounded-lg border border-dashed border-slate-800 text-xs text-slate-500 hover:border-slate-700 hover:bg-slate-800/30 transition">
                        <span>Open focus window</span>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                          {unscheduledTasks.length > 0 && (
                            <button
                              onClick={() => setActiveQuickSlotTime(activeQuickSlotTime === hourStr ? null : hourStr)}
                              className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition cursor-pointer"
                            >
                              + Slot Task
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Quick Slot Selector dropdown if open */}
                    {activeQuickSlotTime === hourStr && (
                      <div className="p-3 bg-slate-800 border border-slate-700 rounded-lg space-y-2 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                          <span>Select task to time-block at {formatTime12h(hourStr)}:</span>
                          <button onClick={() => setActiveQuickSlotTime(null)} className="text-slate-400 hover:text-white">✕</button>
                        </div>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {unscheduledTasks.map(t => (
                            <button
                              key={t.id}
                              onClick={() => {
                                const endT = addMinutesToTime(hourStr, t.estimatedMinutes || 45);
                                onTimeBlockTask(t.id, currentDateKey, hourStr, endT);
                                setActiveQuickSlotTime(null);
                              }}
                              className="w-full text-left p-2 rounded bg-slate-900/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-200 flex items-center justify-between transition cursor-pointer"
                            >
                              <span className="font-medium truncate">{t.title}</span>
                              <span className="text-[10px] text-slate-400 font-mono flex-shrink-0 ml-2">{t.estimatedMinutes || 45}m</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: Unscheduled Priority Tasks */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Tasks Due Today</h3>
                <p className="text-xs text-slate-400">Ready for calendar allocation</p>
              </div>
              <button
                id="planner-add-task-btn"
                onClick={onOpenNewTask}
                className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>

            {unscheduledTasks.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500/40 mb-2" />
                <p className="font-medium text-slate-400">All tasks scheduled or done!</p>
                <p className="text-[11px] mt-1">Check the calendar or add new deliverables.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {unscheduledTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg bg-slate-800/70 border border-slate-700/70 hover:border-slate-600 transition space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => onToggleTaskComplete(task.id)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-400 cursor-pointer"
                        >
                          <Circle className="w-4 h-4" />
                        </button>
                        <div>
                          <h4 
                            onClick={() => onOpenTaskModal(task)}
                            className="text-xs font-bold text-slate-200 hover:text-indigo-300 cursor-pointer line-clamp-1"
                          >
                            {task.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{task.description}</p>
                        </div>
                      </div>
                      {getPriorityBadge(task.priority)}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-700/50 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {task.estimatedMinutes}m est.
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            // Find first free slot or default 14:00
                            const startT = '14:00';
                            const endT = addMinutesToTime(startT, task.estimatedMinutes || 45);
                            onTimeBlockTask(task.id, currentDateKey, startT, endT);
                          }}
                          className="px-2 py-0.5 text-[10px] font-semibold rounded bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 transition cursor-pointer"
                          title="Schedule into calendar"
                        >
                          + Time-Block
                        </button>
                        <button
                          onClick={() => onStartFocusOnTask(task)}
                          className="p-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition cursor-pointer"
                          title="Start Focus Session"
                        >
                          <Play className="w-3 h-3 fill-current" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
