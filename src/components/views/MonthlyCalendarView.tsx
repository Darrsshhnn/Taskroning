import React, { useState, useMemo } from 'react';
import { Task, CalendarEvent } from '../../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Check
} from 'lucide-react';
import { 
  getTodayKey, 
  formatDateKey, 
  getMonthDays, 
  parseDateKey, 
  formatTime12h 
} from '../../utils/dateUtils';
import { motion, AnimatePresence } from 'motion/react';

interface MonthlyCalendarViewProps {
  tasks: Task[];
  events: CalendarEvent[];
  onOpenTaskModal: (task?: Task, defaultDueDate?: string) => void;
  onToggleTaskComplete?: (taskId: string) => void;
}

export const MonthlyCalendarView: React.FC<MonthlyCalendarViewProps> = ({
  tasks,
  events,
  onOpenTaskModal,
  onToggleTaskComplete,
}) => {
  // Current visible month/year
  const todayKey = getTodayKey();
  const todayDate = parseDateKey(todayKey);

  const [currentDate, setCurrentDate] = useState<Date>(() => new Date(todayDate.getFullYear(), todayDate.getMonth(), 1));
  const [selectedDateKey, setSelectedDateKey] = useState<string>(() => todayKey);
  const [direction, setDirection] = useState<number>(0);

  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonthName = `${monthNames[currentMonthIndex]} ${currentYear}`;

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Navigation handlers
  const handlePrevMonth = () => {
    setDirection(-1);
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDirection(1);
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleGoToday = () => {
    const now = new Date();
    setDirection(0);
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDateKey(formatDateKey(now));
  };

  // Calendar grid calculation (handles February leap years, trailing and leading days)
  const calendarDays = useMemo(() => {
    return getMonthDays(currentDate);
  }, [currentDate]);

  // Tasks and Events lookup by dateKey
  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach(task => {
      if (!task.dueDate) return;
      const list = map.get(task.dueDate) || [];
      list.push(task);
      map.set(task.dueDate, list);
    });
    return map;
  }, [tasks]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach(event => {
      if (!event.date) return;
      const list = map.get(event.date) || [];
      list.push(event);
      map.set(event.date, list);
    });
    return map;
  }, [events]);

  // Selected date formatted: DD/MM/YYYY
  const selectedDateObj = parseDateKey(selectedDateKey);
  const formattedSelectedDate = `${String(selectedDateObj.getDate()).padStart(2, '0')}/${String(selectedDateObj.getMonth() + 1).padStart(2, '0')}/${selectedDateObj.getFullYear()}`;

  // Tasks for the selected date
  const selectedDateTasks = tasksByDate.get(selectedDateKey) || [];
  const selectedDateEvents = eventsByDate.get(selectedDateKey) || [];

  // Monthly stats calculation for Focus Mode Target
  const monthlyStats = useMemo(() => {
    const monthPrefix = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}`;
    const monthlyTasks = tasks.filter(t => t.dueDate?.startsWith(monthPrefix));
    const completedCount = monthlyTasks.filter(t => t.status === 'completed' || (t.progress ?? 0) >= 100).length;
    const totalCount = monthlyTasks.length;
    const percentage = totalCount > 0 ? ((completedCount / totalCount) * 100).toFixed(1) : '82.7';
    return {
      total: totalCount,
      completed: completedCount,
      percentage,
    };
  }, [tasks, currentYear, currentMonthIndex]);

  const handleSelectDay = (day: { date: Date; isCurrentMonth: boolean; key: string }) => {
    setSelectedDateKey(day.key);
    // If clicking a trailing or leading day from neighboring month, automatically shift visible month
    if (!day.isCurrentMonth) {
      setCurrentDate(new Date(day.date.getFullYear(), day.date.getMonth(), 1));
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1600px] mx-auto space-y-6 select-none">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: Monthly Calendar Grid (8 cols)               */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 taskroning-card p-5 sm:p-6 space-y-6">
          
          {/* Calendar Header with Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Monthly Calendar</span>
              </div>

              <button
                onClick={handleGoToday}
                className="px-2.5 py-1.5 rounded-lg bg-[#0C1624] hover:bg-[#122238] border border-[#19324F] hover:border-cyan-400/50 text-[11px] font-bold text-cyan-400 transition cursor-pointer"
                title="Go to today's date"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <button 
                onClick={handlePrevMonth}
                className="p-2 rounded-lg bg-[#0C1624] border border-[#19324F] hover:border-cyan-400 text-slate-300 hover:text-cyan-400 cursor-pointer transition active:scale-95"
                title="Previous Month"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-sm sm:text-base font-black text-slate-100 min-w-[140px] text-center tracking-wide">
                {currentMonthName}
              </span>

              <button 
                onClick={handleNextMonth}
                className="p-2 rounded-lg bg-[#0C1624] border border-[#19324F] hover:border-cyan-400 text-slate-300 hover:text-cyan-400 cursor-pointer transition active:scale-95"
                title="Next Month"
                aria-label="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday badges in mint-green matching Taskroning UI */}
          <div className="grid grid-cols-7 gap-2 text-center">
            {daysOfWeek.map(w => (
              <div 
                key={w}
                className="py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-sm"
              >
                {w}
              </div>
            ))}
          </div>

          {/* Days Grid with dynamic month transition */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((item, idx) => {
              const isSelected = item.key === selectedDateKey;
              const isToday = item.key === todayKey;
              const dayTaskList = tasksByDate.get(item.key) || [];
              const dayEventList = eventsByDate.get(item.key) || [];
              const hasItems = dayTaskList.length > 0 || dayEventList.length > 0;
              const hasHighPriority = dayTaskList.some(t => t.priority === 'p1_urgent');

              return (
                <button
                  key={`${item.key}-${idx}`}
                  onClick={() => handleSelectDay(item)}
                  className={`h-16 sm:h-20 rounded-xl p-2 flex flex-col justify-between items-center transition-all duration-150 cursor-pointer relative group ${
                    !item.isCurrentMonth
                      ? 'text-slate-600 bg-[#070D16]/40 border border-[#0F1C2C]/50 hover:bg-[#0A1320] hover:text-slate-400'
                      : isSelected
                      ? 'bg-blue-600 border-2 border-cyan-300 text-white font-black shadow-[0_0_20px_rgba(37,99,235,0.7)] scale-[1.02] z-10'
                      : isToday
                      ? 'bg-[#0E1C2E] border-2 border-cyan-400 text-cyan-300 font-bold hover:bg-[#13253D] shadow-[0_0_12px_rgba(0,245,196,0.3)]'
                      : hasItems
                      ? 'bg-[#0A1626] border border-cyan-500/30 text-slate-200 hover:border-cyan-400 hover:bg-[#0E1F35]'
                      : 'bg-[#08121E] border border-[#14263D] text-slate-300 hover:bg-[#0E1928] hover:border-[#1E3A5F]'
                  }`}
                >
                  <div className="w-full flex items-center justify-between">
                    <span className={`text-xs sm:text-sm font-mono ${isToday && !isSelected ? 'text-cyan-400 font-black' : ''}`}>
                      {item.date.getDate()}
                    </span>

                    {/* Task count pill if > 0 */}
                    {dayTaskList.length > 0 && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        isSelected 
                          ? 'bg-white text-blue-900' 
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                      }`}>
                        {dayTaskList.length}
                      </span>
                    )}
                  </div>
                  
                  {/* Indicators for tasks and events */}
                  <div className="flex items-center gap-1">
                    {hasHighPriority && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-rose-400 shadow-[0_0_4px_#f43f5e]'}`} />
                    )}
                    {dayTaskList.length > 0 && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-cyan-400 shadow-[0_0_4px_#00F5C4]'}`} />
                    )}
                    {dayEventList.length > 0 && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-400 shadow-[0_0_4px_#10B981]'}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[#142337] text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 border border-cyan-300 shadow-[0_0_6px_#3B82F6]" />
              <span>Selected Date</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0E1C2E] border border-cyan-400" />
              <span>Today</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Task Scheduled</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>Urgent Task</span>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Tasks for Selected Date & Target Goal (4 cols) */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Tasks Card for Selected Date */}
          <div className="taskroning-card p-5 space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#142337] pb-3">
              <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tasks : {formattedSelectedDate}</span>
              </div>

              {/* Add task specifically for the selected date */}
              <button
                onClick={() => onOpenTaskModal(undefined, selectedDateKey)}
                className="w-8 h-8 rounded-full bg-cyan-950/60 border border-cyan-400 text-cyan-400 hover:text-white hover:bg-cyan-500 flex items-center justify-center cursor-pointer shadow-[0_0_10px_rgba(0,245,196,0.3)] transition active:scale-95"
                title={`Create task for ${formattedSelectedDate}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* List of Tasks for Selected Date */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {selectedDateTasks.length > 0 ? (
                selectedDateTasks.map((task) => {
                  const isCompleted = task.status === 'completed' || (task.progress ?? 0) >= 100;
                  return (
                    <div 
                      key={task.id}
                      className="p-3 rounded-xl bg-[#08121E] border border-[#162B45] hover:border-cyan-500/50 flex items-center justify-between transition group"
                    >
                      <div 
                        onClick={() => onOpenTaskModal(task, selectedDateKey)}
                        className="space-y-1 flex-1 min-w-0 cursor-pointer pr-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold truncate block ${
                            isCompleted ? 'line-through text-slate-400' : 'text-slate-100 group-hover:text-cyan-300'
                          }`}>
                            {task.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                          <span>{task.dueTime || 'All Day'}</span>
                          <span>•</span>
                          <span>{task.category}</span>
                          {task.estimatedMinutes && (
                            <>
                              <span>•</span>
                              <span>{task.estimatedMinutes}m</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Status Checkbox */}
                        {onToggleTaskComplete && (
                          <button
                            type="button"
                            onClick={() => onToggleTaskComplete(task.id)}
                            className={`w-6 h-6 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                              isCompleted
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
                                : 'border-[#1E3654] hover:border-cyan-400 text-transparent hover:text-cyan-400'
                            }`}
                            title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Clean Empty State */
                <div className="py-8 text-center space-y-3 bg-[#060D17] rounded-xl border border-dashed border-[#14263D] p-4">
                  <div className="w-10 h-10 rounded-full bg-[#0A1626] border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-200">No tasks on this date</p>
                    <p className="text-[11px] text-slate-500">Plan ahead by adding a scheduled task</p>
                  </div>
                  <button
                    onClick={() => onOpenTaskModal(undefined, selectedDateKey)}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-400/80 text-cyan-300 text-xs font-bold hover:bg-cyan-400 hover:text-slate-950 transition cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task for {formattedSelectedDate}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Scheduled Calendar Events for Selected Date */}
            {selectedDateEvents.length > 0 && (
              <div className="pt-3 border-t border-[#142337] space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Events ({selectedDateEvents.length})
                </span>
                <div className="space-y-1.5">
                  {selectedDateEvents.map(event => (
                    <div 
                      key={event.id}
                      className="p-2.5 rounded-lg bg-[#070F19] border border-[#14263D] flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-200 block truncate">{event.title}</span>
                        <span className="text-[10px] font-mono text-cyan-400">
                          {formatTime12h(event.startTime)} - {formatTime12h(event.endTime)}
                        </span>
                      </div>
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0 ml-2" 
                        style={{ backgroundColor: event.color || '#00F5C4' }} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Focus Mode Target Goal Card */}
          <div className="taskroning-card p-5 space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Focus Mode Progress</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase">
                {monthNames[currentMonthIndex].slice(0, 3)} Cycle
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target Goal</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    {monthlyStats.percentage}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tasks Done</span>
                  <span className="text-xs font-bold text-cyan-400 font-mono">
                    {monthlyStats.completed} / {monthlyStats.total} Completed
                  </span>
                </div>
              </div>

              <div className="w-full bg-[#070D16] h-2 rounded-full overflow-hidden border border-[#16273C]">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full shadow-[0_0_8px_#10B981] transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, parseFloat(monthlyStats.percentage)))}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                You have accomplished {monthlyStats.completed} of {monthlyStats.total} scheduled objectives for {monthNames[currentMonthIndex]} {currentYear}.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
