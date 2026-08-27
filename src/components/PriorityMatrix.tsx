import React from 'react';
import { Task, PriorityLevel } from '../types';
import { formatReadableDate, isOverdue, formatTime12h } from '../utils/dateUtils';
import { 
  AlertCircle, 
  Calendar, 
  Clock, 
  Zap, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Plus, 
  Flame,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface PriorityMatrixProps {
  tasks: Task[];
  onToggleTaskComplete: (taskId: string) => void;
  onOpenTaskModal: (task: Task) => void;
  onOpenNewTaskWithPriority: (priority: PriorityLevel) => void;
  onChangeTaskPriority: (taskId: string, newPriority: PriorityLevel) => void;
  onOpenFocusOnTask: (task: Task) => void;
}

export const PriorityMatrix: React.FC<PriorityMatrixProps> = ({
  tasks,
  onToggleTaskComplete,
  onOpenTaskModal,
  onOpenNewTaskWithPriority,
  onChangeTaskPriority,
  onOpenFocusOnTask,
}) => {
  const activeTasks = tasks.filter(t => t.status !== 'completed');

  const q1Tasks = activeTasks.filter(t => t.priority === 'p1_urgent');
  const q2Tasks = activeTasks.filter(t => t.priority === 'p2_high');
  const q3Tasks = activeTasks.filter(t => t.priority === 'p3_medium');
  const q4Tasks = activeTasks.filter(t => t.priority === 'p4_low');

  const q1Minutes = q1Tasks.reduce((acc, t) => acc + (t.estimatedMinutes || 30), 0);
  const q2Minutes = q2Tasks.reduce((acc, t) => acc + (t.estimatedMinutes || 30), 0);
  const q3Minutes = q3Tasks.reduce((acc, t) => acc + (t.estimatedMinutes || 30), 0);
  const q4Minutes = q4Tasks.reduce((acc, t) => acc + (t.estimatedMinutes || 30), 0);

  const renderQuadrantCard = (
    quadrantTitle: string,
    actionAdvice: string,
    priority: PriorityLevel,
    tasksList: Task[],
    totalMinutes: number,
    icon: React.ReactNode,
    borderColor: string,
    bgColor: string,
    accentBadge: string
  ) => {
    return (
      <div className={`rounded-xl border ${borderColor} ${bgColor} p-5 shadow-sm flex flex-col justify-between min-h-[380px] space-y-4`}>
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              <h3 className="text-sm font-bold text-white">{quadrantTitle}</h3>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${accentBadge}`}>
              {tasksList.length} Tasks • {(totalMinutes / 60).toFixed(1)}h
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">{actionAdvice}</p>
        </div>

        {/* Task List in Quadrant */}
        <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[360px] pr-1">
          {tasksList.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-slate-600 mb-1" />
              <p>No active tasks in this quadrant</p>
            </div>
          ) : (
            tasksList.map(task => {
              const overdue = isOverdue(task.dueDate, task.dueTime);

              return (
                <div
                  key={task.id}
                  className="p-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg shadow-sm transition space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <button
                        onClick={() => onToggleTaskComplete(task.id)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-400 transition cursor-pointer"
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
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {task.description || task.category}
                        </p>
                      </div>
                    </div>

                    {overdue && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-0.5">
                        <AlertCircle className="w-2.5 h-2.5" /> Overdue
                      </span>
                    )}
                  </div>

                  {/* Footer infos & priority quick change */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {task.estimatedMinutes}m
                      </span>
                      <span>•</span>
                      <span className="text-slate-400">{formatReadableDate(task.dueDate)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {task.timeBlock ? (
                        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          {task.timeBlock.startTime}
                        </span>
                      ) : (
                        <button
                          onClick={() => onOpenTaskModal(task)}
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
                        >
                          + Time-Block
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add Task Button at bottom of quadrant */}
        <button
          onClick={() => onOpenNewTaskWithPriority(priority)}
          className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-700/80 flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add to {quadrantTitle}</span>
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Eisenhower Decision Matrix</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
              Employee Prioritization Framework
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Categorize and time-block deliverables based on urgency vs. high strategic importance to prevent burnout.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-800/80 px-3.5 py-2 rounded-lg border border-slate-700">
          <span className="font-semibold text-white">Total Active Work:</span>
          <span>{activeTasks.length} tasks</span>
          <span className="text-slate-500">•</span>
          <span className="font-mono text-emerald-400">{((q1Minutes + q2Minutes + q3Minutes + q4Minutes) / 60).toFixed(1)} hours</span>
        </div>
      </div>

      {/* 2x2 Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Q1: Urgent & Important */}
        {renderQuadrantCard(
          "Q1: Urgent & Important",
          "DO FIRST — Production blockers, client deadlines, critical security patches",
          "p1_urgent",
          q1Tasks,
          q1Minutes,
          <ShieldAlert className="w-4 h-4 text-rose-400" />,
          "border-rose-500/30",
          "bg-rose-950/10",
          "bg-rose-500/20 text-rose-300 border border-rose-500/30"
        )}

        {/* Q2: Not Urgent & Important */}
        {renderQuadrantCard(
          "Q2: High Importance / Long-Term",
          "SCHEDULE ON CALENDAR — Architecture, skill growth, sprint roadmap planning",
          "p2_high",
          q2Tasks,
          q2Minutes,
          <Sparkles className="w-4 h-4 text-indigo-400" />,
          "border-indigo-500/30",
          "bg-indigo-950/10",
          "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
        )}

        {/* Q3: Urgent & Less Strategic */}
        {renderQuadrantCard(
          "Q3: Urgent / Delegate / Batch",
          "QUICK WINS & DELEGATION — PR reviews, quick async replies, minor syncs",
          "p3_medium",
          q3Tasks,
          q3Minutes,
          <Zap className="w-4 h-4 text-amber-400" />,
          "border-amber-500/30",
          "bg-amber-950/10",
          "bg-amber-500/20 text-amber-300 border border-amber-500/30"
        )}

        {/* Q4: Not Urgent & Not Strategic */}
        {renderQuadrantCard(
          "Q4: Backlog / Low Priority",
          "SOMEDAY / BACKLOG — Nice-to-have cleanups, exploratory research",
          "p4_low",
          q4Tasks,
          q4Minutes,
          <Clock className="w-4 h-4 text-slate-400" />,
          "border-slate-700/50",
          "bg-slate-900/40",
          "bg-slate-700/50 text-slate-300 border border-slate-600"
        )}

      </div>
    </div>
  );
};
