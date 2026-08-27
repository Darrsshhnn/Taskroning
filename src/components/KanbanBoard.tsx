import React from 'react';
import { Task, TaskStatus, PriorityLevel } from '../types';
import { formatReadableDate, formatTime12h, isOverdue } from '../utils/dateUtils';
import { 
  Plus, 
  Circle, 
  CheckCircle2, 
  Clock, 
  Calendar as CalendarIcon, 
  Play, 
  ChevronRight, 
  ChevronLeft,
  Flame
} from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  onToggleTaskComplete: (taskId: string) => void;
  onOpenTaskModal: (task: Task) => void;
  onOpenNewTaskWithStatus: (status: TaskStatus) => void;
  onChangeTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onStartFocusOnTask: (task: Task) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onToggleTaskComplete,
  onOpenTaskModal,
  onOpenNewTaskWithStatus,
  onChangeTaskStatus,
  onStartFocusOnTask,
}) => {
  const columns: { id: TaskStatus; title: string; color: string; badgeBg: string }[] = [
    { id: 'backlog', title: 'Backlog', color: 'border-slate-700', badgeBg: 'bg-slate-800 text-slate-300' },
    { id: 'in_progress', title: 'In Progress', color: 'border-blue-500/40', badgeBg: 'bg-blue-500/20 text-blue-300' },
    { id: 'in_review', title: 'In Review / QA', color: 'border-purple-500/40', badgeBg: 'bg-purple-500/20 text-purple-300' },
    { id: 'scheduled', title: 'Calendar Scheduled', color: 'border-emerald-500/40', badgeBg: 'bg-emerald-500/20 text-emerald-300' },
    { id: 'completed', title: 'Completed', color: 'border-slate-800', badgeBg: 'bg-emerald-950/40 text-emerald-400' },
  ];

  const getPriorityChip = (p: PriorityLevel) => {
    switch (p) {
      case 'p1_urgent':
        return <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">P1</span>;
      case 'p2_high':
        return <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">P2</span>;
      case 'p3_medium':
        return <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">P3</span>;
      case 'p4_low':
        return <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-slate-700 text-slate-300">P4</span>;
    }
  };

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    switch (current) {
      case 'backlog': return 'in_progress';
      case 'in_progress': return 'in_review';
      case 'in_review': return 'scheduled';
      case 'scheduled': return 'completed';
      case 'completed': return null;
    }
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    switch (current) {
      case 'backlog': return null;
      case 'in_progress': return 'backlog';
      case 'in_review': return 'in_progress';
      case 'scheduled': return 'in_review';
      case 'completed': return 'scheduled';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white">Workflow Kanban Board</h2>
          <p className="text-xs text-slate-400">Track task progression across engineering, design, and operations</p>
        </div>

        <button
          onClick={() => onOpenNewTaskWithStatus('backlog')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
        </button>
      </div>

      {/* Kanban Columns (Horizontal Scroll on smaller screens) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          const colEstimatedMinutes = colTasks.reduce((acc, t) => acc + (t.estimatedMinutes || 30), 0);

          return (
            <div
              key={col.id}
              className={`bg-slate-900/90 border ${col.color} rounded-xl p-3.5 flex flex-col justify-between min-h-[500px] shadow-sm space-y-3`}
            >
              {/* Column Header */}
              <div className="space-y-1 border-b border-slate-800 pb-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">{col.title}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.badgeBg}`}>
                    {colTasks.length}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {(colEstimatedMinutes / 60).toFixed(1)}h total estimated
                </div>
              </div>

              {/* Tasks List */}
              <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[460px] pr-1">
                {colTasks.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
                    <span>No tasks</span>
                  </div>
                ) : (
                  colTasks.map(task => {
                    const overdue = isOverdue(task.dueDate, task.dueTime) && task.status !== 'completed';
                    const prevStatus = getPrevStatus(task.status);
                    const nextStatus = getNextStatus(task.status);

                    return (
                      <div
                        key={task.id}
                        className={`p-3 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-750 hover:border-slate-600 transition shadow-sm space-y-2 group ${
                          task.status === 'completed' ? 'opacity-70' : ''
                        }`}
                      >
                        {/* Title & Priority */}
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="flex items-start gap-2">
                            <button
                              onClick={() => onToggleTaskComplete(task.id)}
                              className="mt-0.5 text-slate-400 hover:text-emerald-400 cursor-pointer flex-shrink-0"
                            >
                              {task.status === 'completed' ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Circle className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <h4
                              onClick={() => onOpenTaskModal(task)}
                              className={`text-xs font-bold hover:text-indigo-300 cursor-pointer line-clamp-2 ${
                                task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-200'
                              }`}
                            >
                              {task.title}
                            </h4>
                          </div>
                          {getPriorityChip(task.priority)}
                        </div>

                        {/* Subtask Progress Bar */}
                        {task.subtasks.length > 0 && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                              <span>Checklist</span>
                              <span>{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-indigo-500 h-full transition-all"
                                style={{
                                  width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%`
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Calendar Time Block Badge */}
                        {task.timeBlock && (
                          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                            <CalendarIcon className="w-3 h-3 text-emerald-400" />
                            <span>{task.timeBlock.date} @ {task.timeBlock.startTime}</span>
                          </div>
                        )}

                        {/* Card Footer: Due Date, Pomodoros, Move Arrows */}
                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-[10px] text-slate-400">
                          <span className={overdue ? 'text-rose-400 font-semibold' : ''}>
                            {formatReadableDate(task.dueDate)}
                          </span>

                          <div className="flex items-center gap-1">
                            {task.status !== 'completed' && (
                              <button
                                onClick={() => onStartFocusOnTask(task)}
                                className="p-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition cursor-pointer"
                                title="Start Focus Timer"
                              >
                                <Play className="w-2.5 h-2.5 fill-current" />
                              </button>
                            )}
                            {prevStatus && (
                              <button
                                onClick={() => onChangeTaskStatus(task.id, prevStatus)}
                                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition cursor-pointer"
                                title={`Move to ${prevStatus.replace('_', ' ')}`}
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                            )}
                            {nextStatus && (
                              <button
                                onClick={() => onChangeTaskStatus(task.id, nextStatus)}
                                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition cursor-pointer"
                                title={`Move to ${nextStatus.replace('_', ' ')}`}
                              >
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Add Task Button at bottom of column */}
              <button
                onClick={() => onOpenNewTaskWithStatus(col.id)}
                className="w-full py-1.5 px-2 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg border border-dashed border-slate-800 hover:border-slate-700 flex items-center justify-center gap-1 transition cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Task</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
