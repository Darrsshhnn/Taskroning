import React, { useState } from 'react';
import { 
  CalendarEvent, 
  Task, 
  CalendarViewMode 
} from '../types';
import { 
  getWeekDays, 
  getMonthDays, 
  formatReadableDate, 
  formatTime12h, 
  formatDateKey, 
  getTodayKey, 
  calculateMinutesBetween,
  addMinutesToTime 
} from '../utils/dateUtils';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  CheckCircle2, 
  AlertTriangle,
  Video,
  Layers,
  CalendarDays,
  Grid,
  ListOrdered
} from 'lucide-react';

interface CalendarViewProps {
  currentDateKey: string;
  onDateChange: (key: string) => void;
  events: CalendarEvent[];
  tasks: Task[];
  onOpenEventModal: (event: CalendarEvent) => void;
  onOpenTaskModal: (task: Task) => void;
  onOpenNewEvent: (initialDate?: string, initialStartTime?: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentDateKey,
  onDateChange,
  events,
  tasks,
  onOpenEventModal,
  onOpenTaskModal,
  onOpenNewEvent,
}) => {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('week');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const currentDate = new Date(currentDateKey + 'T00:00:00');

  // Navigation handlers
  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewMode === 'day') {
      d.setDate(d.getDate() - 1);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() - 7);
    } else if (viewMode === 'month') {
      d.setMonth(d.getMonth() - 1);
    } else {
      d.setDate(d.getDate() - 1);
    }
    onDateChange(formatDateKey(d));
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewMode === 'day') {
      d.setDate(d.getDate() + 1);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() + 7);
    } else if (viewMode === 'month') {
      d.setMonth(d.getMonth() + 1);
    } else {
      d.setDate(d.getDate() + 1);
    }
    onDateChange(formatDateKey(d));
  };

  const handleToday = () => {
    onDateChange(getTodayKey());
  };

  // Filter events & time-blocked tasks
  const filteredEvents = events.filter(e => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'task_blocks') return false;
    return e.category === categoryFilter;
  });

  const filteredTasksWithBlocks = tasks.filter(t => {
    if (!t.timeBlock || !t.timeBlock.date) return false;
    if (categoryFilter === 'all' || categoryFilter === 'task_blocks') return true;
    return false;
  });

  // Calculate day conflicts
  const checkConflicts = (dateStr: string) => {
    const dayEvs = filteredEvents.filter(e => e.date === dateStr);
    const dayTbs = filteredTasksWithBlocks.filter(t => t.timeBlock?.date === dateStr);
    
    const items = [
      ...dayEvs.map(e => ({ id: e.id, title: e.title, start: e.startTime, end: e.endTime })),
      ...dayTbs.map(t => ({ id: t.id, title: t.title, start: t.timeBlock!.startTime, end: t.timeBlock!.endTime }))
    ].sort((a, b) => a.start.localeCompare(b.start));

    const conflicts: string[] = [];
    for (let i = 0; i < items.length - 1; i++) {
      const current = items[i];
      const next = items[i + 1];
      if (current.end > next.start) {
        conflicts.push(`"${current.title}" overlaps with "${next.title}" at ${formatTime12h(next.start)}`);
      }
    }
    return conflicts;
  };

  const dayConflicts = checkConflicts(currentDateKey);

  // Time grid hours for Day / Week view (08:00 to 19:00)
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const h = i + 8;
    return `${String(h).padStart(2, '0')}:00`;
  });

  const getCategoryColorStyle = (category: string) => {
    switch (category) {
      case 'standup': return 'bg-blue-600/20 text-blue-300 border-blue-500/40 hover:bg-blue-600/30';
      case 'meeting': return 'bg-purple-600/20 text-purple-300 border-purple-500/40 hover:bg-purple-600/30';
      case 'deep_work': return 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/30';
      case 'client_call': return 'bg-amber-600/20 text-amber-300 border-amber-500/40 hover:bg-amber-600/30';
      case 'review': return 'bg-pink-600/20 text-pink-300 border-pink-500/40 hover:bg-pink-600/30';
      default: return 'bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Calendar Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm">
        
        {/* Date Navigator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              id="cal-prev-btn"
              onClick={handlePrev}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="cal-today-btn"
              onClick={handleToday}
              className={`px-3 py-1 text-xs font-semibold rounded transition cursor-pointer ${
                currentDateKey === getTodayKey() ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              id="cal-next-btn"
              onClick={handleNext}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-indigo-400" />
            <span>
              {viewMode === 'month' 
                ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : formatReadableDate(currentDateKey, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </h2>
        </div>

        {/* View Switchers & Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Category Filter */}
          <select
            id="cal-category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Events & Tasks</option>
            <option value="meeting">Meetings</option>
            <option value="deep_work">Deep Work</option>
            <option value="standup">Standups</option>
            <option value="client_call">Client Calls</option>
            <option value="review">Reviews</option>
            <option value="task_blocks">Task Blocks Only</option>
          </select>

          {/* View Mode Buttons */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setViewMode('day')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition cursor-pointer ${
                viewMode === 'day' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition cursor-pointer ${
                viewMode === 'week' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition cursor-pointer ${
                viewMode === 'month' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition cursor-pointer ${
                viewMode === 'timeline' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Agenda
            </button>
          </div>

          <button
            id="cal-new-event-btn"
            onClick={() => onOpenNewEvent(currentDateKey)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Conflict Warning Banner if any */}
      {dayConflicts.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-500/40 p-3 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold">Schedule Conflict Detected for {currentDateKey}:</span>
            <ul className="list-disc list-inside text-amber-300/90 text-[11px]">
              {dayConflicts.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ========================================================
          1. WEEK VIEW
          ======================================================== */}
      {viewMode === 'week' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          {/* Weekday column headers */}
          <div className="grid grid-cols-8 border-b border-slate-800 bg-slate-850">
            <div className="p-3 text-center text-xs font-bold text-slate-500 border-r border-slate-800">
              GMT-local
            </div>
            {getWeekDays(currentDate).map((day) => {
              const dayKey = formatDateKey(day);
              const isTodayDay = dayKey === getTodayKey();
              const isSelected = dayKey === currentDateKey;

              return (
                <div
                  key={dayKey}
                  onClick={() => onDateChange(dayKey)}
                  className={`p-2.5 text-center border-r border-slate-800 cursor-pointer transition ${
                    isSelected ? 'bg-indigo-950/40' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="text-[11px] font-semibold text-slate-400">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={`inline-flex items-center justify-center w-7 h-7 mt-0.5 text-xs font-bold rounded-full ${
                    isTodayDay ? 'bg-indigo-600 text-white' : 'text-slate-200'
                  }`}>
                    {day.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Slots Grid */}
          <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-800/60">
            {timeSlots.map((timeStr) => {
              const hourNum = parseInt(timeStr.split(':')[0], 10);

              return (
                <div key={timeStr} className="grid grid-cols-8 min-h-[64px]">
                  {/* Time label */}
                  <div className="p-2 text-right text-[11px] font-mono text-slate-400 border-r border-slate-800 bg-slate-900/50">
                    {formatTime12h(timeStr)}
                  </div>

                  {/* 7 Days columns */}
                  {getWeekDays(currentDate).map((day) => {
                    const dayKey = formatDateKey(day);

                    // Find events in this hour
                    const dayEventsInHour = filteredEvents.filter(e => {
                      if (e.date !== dayKey) return false;
                      const sH = parseInt(e.startTime.split(':')[0], 10);
                      return sH === hourNum;
                    });

                    // Find time-blocked tasks in this hour
                    const dayTasksInHour = filteredTasksWithBlocks.filter(t => {
                      if (!t.timeBlock || t.timeBlock.date !== dayKey) return false;
                      const sH = parseInt(t.timeBlock.startTime.split(':')[0], 10);
                      return sH === hourNum;
                    });

                    return (
                      <div
                        key={dayKey}
                        onClick={() => onOpenNewEvent(dayKey, timeStr)}
                        className="p-1 border-r border-slate-800/60 relative group hover:bg-slate-800/30 transition min-h-[64px]"
                      >
                        {/* Event blocks */}
                        {dayEventsInHour.map(event => (
                          <div
                            key={event.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenEventModal(event);
                            }}
                            className={`p-1.5 mb-1 rounded border text-[11px] font-medium leading-tight cursor-pointer transition shadow-xs ${getCategoryColorStyle(event.category)}`}
                          >
                            <div className="font-bold truncate">{event.title}</div>
                            <div className="text-[9px] font-mono opacity-80 mt-0.5">
                              {event.startTime} - {event.endTime}
                            </div>
                          </div>
                        ))}

                        {/* Task blocks */}
                        {dayTasksInHour.map(task => (
                          <div
                            key={task.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenTaskModal(task);
                            }}
                            className={`p-1.5 mb-1 rounded border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-[11px] font-medium leading-tight cursor-pointer hover:bg-emerald-900/50 transition ${
                              task.status === 'completed' ? 'line-through opacity-60' : ''
                            }`}
                          >
                            <div className="font-bold truncate">✓ {task.title}</div>
                            <div className="text-[9px] font-mono opacity-80 mt-0.5">
                              {task.timeBlock?.startTime} - {task.timeBlock?.endTime}
                            </div>
                          </div>
                        ))}

                        {/* Quick add prompt on hover */}
                        {dayEventsInHour.length === 0 && dayTasksInHour.length === 0 && (
                          <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-[10px] text-slate-500 font-medium">+ slot</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          2. MONTH VIEW
          ======================================================== */}
      {viewMode === 'month' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          {/* Days of week */}
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-850 text-center py-2 text-xs font-bold text-slate-400">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-800">
            {getMonthDays(currentDate).map(({ date, isCurrentMonth, key }) => {
              const dayEvents = filteredEvents.filter(e => e.date === key);
              const dayTasks = filteredTasksWithBlocks.filter(t => t.timeBlock?.date === key);
              const isTodayDay = key === getTodayKey();
              const isSelected = key === currentDateKey;

              return (
                <div
                  key={key}
                  onClick={() => {
                    onDateChange(key);
                    setViewMode('day');
                  }}
                  className={`min-h-[105px] p-2 transition cursor-pointer flex flex-col justify-between ${
                    isSelected ? 'bg-indigo-950/30' : 'hover:bg-slate-800/40'
                  } ${!isCurrentMonth ? 'opacity-40 bg-slate-950/40' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                      isTodayDay ? 'bg-indigo-600 text-white' : 'text-slate-300'
                    }`}>
                      {date.getDate()}
                    </span>

                    {(dayEvents.length > 0 || dayTasks.length > 0) && (
                      <span className="text-[10px] font-semibold text-slate-400">
                        {dayEvents.length + dayTasks.length} items
                      </span>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="space-y-1 mt-1 flex-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map(ev => (
                      <div
                        key={ev.id}
                        className={`text-[10px] px-1.5 py-0.5 rounded truncate font-medium border ${getCategoryColorStyle(ev.category)}`}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayTasks.slice(0, 1).map(tk => (
                      <div
                        key={tk.id}
                        className="text-[10px] px-1.5 py-0.5 rounded truncate font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                      >
                        ✓ {tk.title}
                      </div>
                    ))}
                    {(dayEvents.length + dayTasks.length > 3) && (
                      <div className="text-[9px] text-slate-500 font-semibold pl-1">
                        +{dayEvents.length + dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          3. DAY VIEW
          ======================================================== */}
      {viewMode === 'day' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">
                Detailed Agenda for {formatReadableDate(currentDateKey, { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              <p className="text-xs text-slate-400">
                {filteredEvents.filter(e => e.date === currentDateKey).length} events • {filteredTasksWithBlocks.filter(t => t.timeBlock?.date === currentDateKey).length} time-blocks
              </p>
            </div>
            <button
              onClick={() => onOpenNewEvent(currentDateKey)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
            >
              + Add Event
            </button>
          </div>

          <div className="space-y-2">
            {timeSlots.map(timeStr => {
              const hourNum = parseInt(timeStr.split(':')[0], 10);
              const dayEvs = filteredEvents.filter(e => e.date === currentDateKey && parseInt(e.startTime.split(':')[0], 10) === hourNum);
              const dayTks = filteredTasksWithBlocks.filter(t => t.timeBlock?.date === currentDateKey && parseInt(t.timeBlock.startTime.split(':')[0], 10) === hourNum);

              return (
                <div key={timeStr} className="flex items-start gap-4 py-2 border-b border-slate-800/60 last:border-0">
                  <div className="w-16 flex-shrink-0 text-right text-xs font-mono text-slate-400">
                    {formatTime12h(timeStr)}
                  </div>
                  <div className="flex-1 space-y-2">
                    {dayEvs.map(ev => (
                      <div
                        key={ev.id}
                        onClick={() => onOpenEventModal(ev)}
                        className={`p-3 rounded-lg border-l-4 cursor-pointer transition ${getCategoryColorStyle(ev.category)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">{ev.title}</span>
                            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-850 text-slate-300">
                              {ev.category}
                            </span>
                          </div>
                          <span className="text-xs font-mono text-slate-300">{formatTime12h(ev.startTime)} - {formatTime12h(ev.endTime)}</span>
                        </div>
                        {ev.description && <p className="text-xs text-slate-300/80 mt-1">{ev.description}</p>}
                        {ev.locationOrUrl && (
                          <div className="flex items-center gap-1.5 text-xs text-indigo-300 mt-2">
                            <Video className="w-3.5 h-3.5" />
                            <span>{ev.locationOrUrl}</span>
                          </div>
                        )}
                      </div>
                    ))}

                    {dayTks.map(tk => (
                      <div
                        key={tk.id}
                        onClick={() => onOpenTaskModal(tk)}
                        className="p-3 rounded-lg border-l-4 border-emerald-500 bg-emerald-950/20 border border-slate-800 cursor-pointer hover:border-emerald-500/40"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-emerald-300">[Time-Blocked Task] {tk.title}</span>
                          <span className="text-xs font-mono text-emerald-400">
                            {formatTime12h(tk.timeBlock?.startTime || '')} - {formatTime12h(tk.timeBlock?.endTime || '')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{tk.description}</p>
                      </div>
                    ))}

                    {dayEvs.length === 0 && dayTks.length === 0 && (
                      <div 
                        onClick={() => onOpenNewEvent(currentDateKey, timeStr)}
                        className="py-2 px-3 rounded-lg border border-dashed border-slate-800 text-xs text-slate-500 hover:border-indigo-500/40 hover:text-slate-400 cursor-pointer transition"
                      >
                        + Open slot (click to add event or time-block)
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          4. AGENDA / TIMELINE LIST VIEW
          ======================================================== */}
      {viewMode === 'timeline' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Upcoming Agenda & Deliverables</h3>
            <p className="text-xs text-slate-400">Next 7 days schedule chronologically organized</p>
          </div>

          <div className="space-y-6">
            {getWeekDays(currentDate).map(day => {
              const dayKey = formatDateKey(day);
              const dayEvs = filteredEvents.filter(e => e.date === dayKey).sort((a, b) => a.startTime.localeCompare(b.startTime));
              const dayTks = filteredTasksWithBlocks.filter(t => t.timeBlock?.date === dayKey).sort((a, b) => (a.timeBlock?.startTime || '').localeCompare(b.timeBlock?.startTime || ''));

              if (dayEvs.length === 0 && dayTks.length === 0) return null;

              return (
                <div key={dayKey} className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 bg-slate-800/60 px-3 py-1.5 rounded-lg">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>{formatReadableDate(dayKey, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                  </div>

                  <div className="space-y-2 pl-2">
                    {dayEvs.map(ev => (
                      <div
                        key={ev.id}
                        onClick={() => onOpenEventModal(ev)}
                        className={`p-3 rounded-lg border-l-4 cursor-pointer transition flex items-center justify-between ${getCategoryColorStyle(ev.category)}`}
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{ev.title}</div>
                          <div className="text-[11px] text-slate-300 mt-0.5">{ev.description || ev.category}</div>
                        </div>
                        <div className="text-right text-xs font-mono text-slate-300">
                          {formatTime12h(ev.startTime)} - {formatTime12h(ev.endTime)}
                        </div>
                      </div>
                    ))}

                    {dayTks.map(tk => (
                      <div
                        key={tk.id}
                        onClick={() => onOpenTaskModal(tk)}
                        className="p-3 rounded-lg border-l-4 border-emerald-500 bg-emerald-950/20 border border-slate-800 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-emerald-300">✓ {tk.title}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{tk.category} • {tk.estimatedMinutes}m est.</div>
                        </div>
                        <div className="text-right text-xs font-mono text-emerald-400">
                          {formatTime12h(tk.timeBlock?.startTime || '')} - {formatTime12h(tk.timeBlock?.endTime || '')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
