import React, { useState } from 'react';
import { Task, CalendarEvent } from '../../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  Calendar as CalendarIcon
} from 'lucide-react';

interface MonthlyCalendarViewProps {
  tasks: Task[];
  events: CalendarEvent[];
  onOpenTaskModal: (task?: Task) => void;
}

export const MonthlyCalendarView: React.FC<MonthlyCalendarViewProps> = ({
  tasks,
  events,
  onOpenTaskModal,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(19);
  const [currentMonth, setCurrentMonth] = useState<string>('March 2026');

  // Days of March 2026 (starts on Sunday, March 1)
  // Let's create the 5x7 grid
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const calendarDays = [
    { day: 23, inMonth: false }, { day: 24, inMonth: false }, { day: 25, inMonth: false }, { day: 26, inMonth: false }, { day: 27, inMonth: false }, { day: 28, inMonth: false }, { day: 1, inMonth: true },
    { day: 2, inMonth: true }, { day: 3, inMonth: true }, { day: 4, inMonth: true }, { day: 5, inMonth: true }, { day: 6, inMonth: true }, { day: 7, inMonth: true }, { day: 8, inMonth: true },
    { day: 9, inMonth: true }, { day: 10, inMonth: true }, { day: 11, inMonth: true }, { day: 12, inMonth: true }, { day: 13, inMonth: true }, { day: 14, inMonth: true }, { day: 15, inMonth: true },
    { day: 16, inMonth: true }, { day: 17, inMonth: true }, { day: 18, inMonth: true }, { day: 19, inMonth: true, isHighlight: true }, { day: 20, inMonth: true, isHighlight: true }, { day: 21, inMonth: true }, { day: 22, inMonth: true },
    { day: 23, inMonth: true, isHighlight: true }, { day: 24, inMonth: true }, { day: 25, inMonth: true }, { day: 26, inMonth: true }, { day: 27, inMonth: true }, { day: 28, inMonth: true }, { day: 29, inMonth: true },
    { day: 30, inMonth: true }, { day: 31, inMonth: true }, { day: 1, inMonth: false }, { day: 2, inMonth: false }, { day: 3, inMonth: false }, { day: 4, inMonth: false }, { day: 5, inMonth: false },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1600px] mx-auto space-y-6 select-none">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: Monthly Calendar Grid (8 cols)               */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 taskroning-card p-5 sm:p-6 space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
              Monthly Calendar
            </div>

            <div className="flex items-center gap-3">
              <button className="p-1.5 rounded-lg bg-[#0C1624] border border-[#19324F] text-slate-400 hover:text-cyan-400 cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-slate-100">{currentMonth}</span>
              <button className="p-1.5 rounded-lg bg-[#0C1624] border border-[#19324F] text-slate-400 hover:text-cyan-400 cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday badges in mint-green matching screenshot */}
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

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((item, idx) => {
              const isSelected = item.inMonth && item.day === selectedDay;
              const isEventDay = item.isHighlight;
              return (
                <button
                  key={idx}
                  onClick={() => item.inMonth && setSelectedDay(item.day)}
                  className={`h-16 sm:h-20 rounded-xl p-2 flex flex-col justify-between items-center transition cursor-pointer relative ${
                    !item.inMonth
                      ? 'text-slate-600 bg-[#070D16]/40 border border-transparent'
                      : isSelected
                      ? 'bg-blue-600 border border-blue-400 text-white font-bold shadow-[0_0_15px_rgba(37,99,235,0.6)]'
                      : isEventDay
                      ? 'bg-[#0E1C2E] border border-cyan-500/50 text-cyan-400 font-bold hover:bg-[#13253D]'
                      : 'bg-[#08121E] border border-[#14263D] text-slate-300 hover:bg-[#0E1928]'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{item.day}</span>
                  
                  {item.inMonth && (
                    <div className="flex items-center gap-1">
                      {isEventDay && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-cyan-400 shadow-[0_0_4px_#00F5C4]'}`} />
                      )}
                      {item.day % 4 === 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Tasks for Selected Date & Target Goal (4 cols) */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Tasks Card */}
          <div className="taskroning-card p-5 space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#142337] pb-3">
              <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                Tasks : {selectedDay.toString().padStart(2, '0')}/03/2026
              </div>

              <button
                onClick={() => onOpenTaskModal()}
                className="w-7 h-7 rounded-full bg-cyan-950/40 border border-cyan-400 text-cyan-400 hover:text-white flex items-center justify-center cursor-pointer shadow-[0_0_8px_rgba(0,245,196,0.3)]"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks.slice(0, 5).map((task, idx) => (
                <div 
                  key={task.id}
                  onClick={() => onOpenTaskModal(task)}
                  className="p-3 rounded-xl bg-[#08121E] border border-[#162B45] hover:border-cyan-500/40 flex items-center justify-between transition cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-200 block truncate max-w-[200px]">
                      {task.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Estimated {task.estimatedMinutes}m • {task.category}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {task.dueTime || '10:15'}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Focus Mode Target Goal Card */}
          <div className="taskroning-card p-5 space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                Focus Mode Progress
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target Goal</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">82.67%</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Monthly Avg</span>
                  <span className="text-xs font-bold text-cyan-400 font-mono">79.3% (02:26 Hr)</span>
                </div>
              </div>

              <div className="w-full bg-[#070D16] h-2 rounded-full overflow-hidden border border-[#16273C]">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full w-[82.67%] shadow-[0_0_8px_#10B981]" />
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                You are currently tracking 6.2% above your target threshold for the Q1 focus cycle.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
