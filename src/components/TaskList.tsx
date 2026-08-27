import React, { useState } from 'react';
import { 
  Task, 
  PriorityLevel, 
  TaskCategory, 
  TaskStatus, 
  EnergyLevel 
} from '../types';
import { 
  formatReadableDate, 
  formatTime12h, 
  isOverdue, 
  isDueToday 
} from '../utils/dateUtils';
import { 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar as CalendarIcon, 
  Play, 
  Star, 
  AlertCircle, 
  Tag, 
  ArrowUpDown, 
  Trash2,
  CheckSquare
} from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onToggleTaskStar: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenTaskModal: (task: Task) => void;
  onOpenNewTask: () => void;
  onStartFocusOnTask: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  searchQuery,
  onSearchChange,
  onToggleTaskComplete,
  onToggleTaskStar,
  onDeleteTask,
  onOpenTaskModal,
  onOpenNewTask,
  onStartFocusOnTask,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<PriorityLevel | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'overdue' | 'unscheduled'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'estimatedMinutes' | 'createdAt'>('dueDate');

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchTags = t.tags?.some(tag => tag.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }

    // Priority filter
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;

    // Category filter
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;

    // Status filter
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;

    // Date filter
    if (dateFilter === 'today' && !isDueToday(t.dueDate)) return false;
    if (dateFilter === 'overdue' && (!isOverdue(t.dueDate, t.dueTime) || t.status === 'completed')) return false;
    if (dateFilter === 'unscheduled' && (t.timeBlock || t.status === 'completed')) return false;

    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return (a.dueDate || '').localeCompare(b.dueDate || '');
    } else if (sortBy === 'priority') {
      const pOrder: Record<string, number> = { p1_urgent: 4, p2_high: 3, p3_medium: 2, p4_low: 1 };
      return (pOrder[b.priority] || 1) - (pOrder[a.priority] || 1);
    } else if (sortBy === 'estimatedMinutes') {
      return (b.estimatedMinutes || 0) - (a.estimatedMinutes || 0);
    } else {
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    }
  });

  const getPriorityBadge = (p: PriorityLevel) => {
    switch (p) {
      case 'p1_urgent':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">P1 Urgent</span>;
      case 'p2_high':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">P2 High</span>;
      case 'p3_medium':
        return <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">P3 Medium</span>;
      case 'p4_low':
        return <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-slate-700 text-slate-300">P4 Low</span>;
    }
  };

  const getStatusBadge = (s: TaskStatus) => {
    switch (s) {
      case 'backlog':
        return <span className="px-2 py-0.5 text-[10px] rounded bg-slate-800 text-slate-300 border border-slate-700">Backlog</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 text-[10px] rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">In Progress</span>;
      case 'in_review':
        return <span className="px-2 py-0.5 text-[10px] rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">In Review</span>;
      case 'scheduled':
        return <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Scheduled</span>;
      case 'completed':
        return <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">Completed</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top action & filter bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">All Employee Tasks</h2>
            <p className="text-xs text-slate-400">
              Showing {sortedTasks.length} of {tasks.length} total deliverables
            </p>
          </div>

          <button
            onClick={onOpenNewTask}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-800">
          
          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="p1_urgent">P1 Urgent</option>
            <option value="p2_high">P2 High</option>
            <option value="p3_medium">P3 Medium</option>
            <option value="p4_low">P4 Low</option>
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
            <option value="Client">Client</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="backlog">Backlog</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
          </select>

          {/* Date quick filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Deadlines</option>
            <option value="today">Due Today</option>
            <option value="overdue">Overdue</option>
            <option value="unscheduled">Unscheduled</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 ml-auto text-xs text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="estimatedMinutes">Sort by Duration</option>
              <option value="createdAt">Sort by Date Created</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task table / cards list */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm divide-y divide-slate-800">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs">
            <CheckSquare className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="font-semibold text-slate-400">No tasks match your selected filters</p>
            <p className="text-[11px] mt-1">Try changing search query or priority filters</p>
          </div>
        ) : (
          sortedTasks.map(task => {
            const overdue = isOverdue(task.dueDate, task.dueTime) && task.status !== 'completed';
            const completedCount = task.subtasks.filter(s => s.completed).length;

            return (
              <div
                key={task.id}
                className={`p-4 hover:bg-slate-850 transition flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
                  task.status === 'completed' ? 'opacity-60 bg-slate-950/40' : ''
                }`}
              >
                {/* Left info */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2 mt-0.5">
                    <button
                      onClick={() => onToggleTaskStar(task.id)}
                      className={`text-slate-500 hover:text-amber-400 transition cursor-pointer ${
                        task.isStarred ? 'text-amber-400 fill-amber-400' : ''
                      }`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onToggleTaskComplete(task.id)}
                      className="text-slate-400 hover:text-emerald-400 transition cursor-pointer"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        onClick={() => onOpenTaskModal(task)}
                        className={`text-sm font-bold hover:text-indigo-300 cursor-pointer truncate ${
                          task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-200'
                        }`}
                      >
                        {task.title}
                      </h3>
                      {getPriorityBadge(task.priority)}
                      {getStatusBadge(task.status)}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-1">{task.description}</p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span className="font-medium text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                        {task.category}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {task.estimatedMinutes}m est.
                      </span>

                      {task.subtasks.length > 0 && (
                        <span className="text-slate-400">
                          {completedCount}/{task.subtasks.length} subtasks
                        </span>
                      )}

                      {task.tags && task.tags.map(t => (
                        <span key={t} className="text-slate-400 flex items-center gap-0.5">
                          <Tag className="w-2.5 h-2.5" /> {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right controls: Deadline, TimeBlock, Focus, Delete */}
                <div className="flex items-center justify-between md:justify-end gap-3 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  
                  {/* Calendar / Deadline */}
                  <div className="text-left md:text-right text-xs">
                    {task.timeBlock ? (
                      <div className="text-emerald-400 font-mono flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>{task.timeBlock.date} @ {task.timeBlock.startTime}</span>
                      </div>
                    ) : (
                      <div className={`flex items-center gap-1 ${overdue ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
                        {overdue && <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
                        <span>Due: {formatReadableDate(task.dueDate)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => onStartFocusOnTask(task)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 transition cursor-pointer"
                        title="Start Focus Timer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span className="hidden sm:inline">Focus</span>
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
