import React, { useState } from 'react';
import { 
  Task, 
  PriorityLevel, 
  TaskCategory, 
  TaskStatus, 
  EnergyLevel, 
  SubTask 
} from '../types';
import { getTodayKey, addMinutesToTime } from '../utils/dateUtils';
import { 
  X, 
  Sparkles, 
  Clock, 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Tag, 
  Zap, 
  Star 
} from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  task,
  onClose,
  onSave,
  onDelete,
}) => {
  if (!isOpen) return null;

  const isEdit = !!task;

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<PriorityLevel>(task?.priority || 'p2_high');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'backlog');
  const [category, setCategory] = useState<TaskCategory>(task?.category || 'Engineering');
  const [dueDate, setDueDate] = useState(task?.dueDate || getTodayKey());
  const [dueTime, setDueTime] = useState(task?.dueTime || '17:00');
  const [estimatedMinutes, setEstimatedMinutes] = useState(task?.estimatedMinutes || 45);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(task?.energyLevel || 'medium');
  const [isStarred, setIsStarred] = useState(task?.isStarred || false);
  const [tagsInput, setTagsInput] = useState(task?.tags?.join(', ') || '');
  const [subtasks, setSubtasks] = useState<SubTask[]>(task?.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Time block state
  const [enableTimeBlock, setEnableTimeBlock] = useState(!!task?.timeBlock);
  const [blockDate, setBlockDate] = useState(task?.timeBlock?.date || task?.dueDate || getTodayKey());
  const [blockStartTime, setBlockStartTime] = useState(task?.timeBlock?.startTime || '10:00');
  const [blockEndTime, setBlockEndTime] = useState(
    task?.timeBlock?.endTime || addMinutesToTime(task?.timeBlock?.startTime || '10:00', task?.estimatedMinutes || 45)
  );

  const [isGeneratingBreakdown, setIsGeneratingBreakdown] = useState(false);

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      {
        id: `st-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: newSubtaskTitle.trim(),
        completed: false,
        estimatedMinutes: 15,
      },
    ]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (stId: string) => {
    setSubtasks(subtasks.map(st => (st.id === stId ? { ...st, completed: !st.completed } : st)));
  };

  const handleDeleteSubtask = (stId: string) => {
    setSubtasks(subtasks.filter(st => st.id !== stId));
  };

  // AI Subtask Breakdown
  const handleAIBreakdown = async () => {
    if (!title.trim()) return;
    setIsGeneratingBreakdown(true);
    try {
      const res = await fetch('/api/ai/breakdown-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: title,
          taskDescription: description,
          category,
          priority,
        }),
      });
      const data = await res.json();
      if (data.subtasks && data.subtasks.length > 0) {
        setSubtasks(data.subtasks);
        if (data.recommendedTimeBlockMinutes) {
          setEstimatedMinutes(data.recommendedTimeBlockMinutes);
          setBlockEndTime(addMinutesToTime(blockStartTime, data.recommendedTimeBlockMinutes));
        }
        if (data.energyLevel) {
          setEnergyLevel(data.energyLevel);
        }
      }
    } catch (e) {
      console.error('AI breakdown error:', e);
    } finally {
      setIsGeneratingBreakdown(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const updatedTask: Task = {
      id: task?.id || `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      priority,
      status: enableTimeBlock && status === 'backlog' ? 'scheduled' : status,
      category,
      dueDate,
      dueTime: dueTime || undefined,
      estimatedMinutes: Number(estimatedMinutes) || 30,
      energyLevel,
      subtasks,
      tags,
      isStarred,
      createdAt: task?.createdAt || getTodayKey(),
      completedAt: status === 'completed' ? (task?.completedAt || getTodayKey()) : undefined,
      pomodoroCount: task?.pomodoroCount || 0,
      timeBlock: enableTimeBlock
        ? {
            date: blockDate,
            startTime: blockStartTime,
            endTime: blockEndTime,
          }
        : undefined,
    };

    onSave(updatedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">
              {isEdit ? 'Edit Task Deliverable' : 'Create New Deliverable'}
            </h2>
            <button
              type="button"
              onClick={() => setIsStarred(!isStarred)}
              className={`p-1 rounded text-slate-500 hover:text-amber-400 cursor-pointer ${
                isStarred ? 'text-amber-400 fill-amber-400' : ''
              }`}
            >
              <Star className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Task Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement OAuth token refresh retry logic"
              className="w-full px-3.5 py-2 text-sm bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Description & Context</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, acceptance criteria, or links..."
              className="w-full px-3.5 py-2 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Priority & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Priority */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="p1_urgent">P1 - Urgent & Critical (Do First)</option>
                <option value="p2_high">P2 - High Priority (Schedule on Calendar)</option>
                <option value="p3_medium">P3 - Medium Priority (Delegate/Async)</option>
                <option value="p4_low">P4 - Low Priority (Backlog/Someday)</option>
              </select>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Workstream Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="Client">Client</option>
                <option value="General">General</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Workflow Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="backlog">Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review / QA</option>
                <option value="scheduled">Calendar Scheduled</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Energy Level */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Focus Type</label>
              <select
                value={energyLevel}
                onChange={(e) => setEnergyLevel(e.target.value as EnergyLevel)}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="high_focus">High Concentration / Deep Focus</option>
                <option value="medium">Standard Workflow</option>
                <option value="quick_win">Quick Win (&lt; 20 min)</option>
              </select>
            </div>
          </div>

          {/* Due Date & Estimate */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Deadline Time</label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Estimated Duration</label>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={estimatedMinutes}
                  onChange={(e) => {
                    const mins = parseInt(e.target.value, 10) || 30;
                    setEstimatedMinutes(mins);
                    if (enableTimeBlock) {
                      setBlockEndTime(addMinutesToTime(blockStartTime, mins));
                    }
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">min</span>
              </div>
            </div>
          </div>

          {/* Subtasks Section with AI Breakdown */}
          <div className="border-t border-slate-800 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200">Subtasks & Action Checklist</h4>
                <p className="text-[11px] text-slate-400">Deconstruct into sequential execution milestones</p>
              </div>

              <button
                type="button"
                onClick={handleAIBreakdown}
                disabled={isGeneratingBreakdown || !title.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 disabled:opacity-50 transition cursor-pointer"
              >
                <Sparkles className={`w-3.5 h-3.5 text-amber-400 ${isGeneratingBreakdown ? 'animate-spin' : ''}`} />
                <span>{isGeneratingBreakdown ? 'Breaking down...' : '✨ AI Auto-Breakdown'}</span>
              </button>
            </div>

            {/* Subtask items */}
            <div className="space-y-1.5">
              {subtasks.map(st => (
                <div key={st.id} className="flex items-center gap-2 p-2 bg-slate-800/60 border border-slate-700/60 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleToggleSubtask(st.id)}
                    className="text-slate-400 hover:text-emerald-400 transition cursor-pointer"
                  >
                    {st.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>
                  <span className={`text-xs flex-1 ${st.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                    {st.title}
                  </span>
                  {st.estimatedMinutes && (
                    <span className="text-[10px] text-slate-400 font-mono">{st.estimatedMinutes}m</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteSubtask(st.id)}
                    className="text-slate-500 hover:text-rose-400 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Add subtask input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                  placeholder="Add a new subtask (press Enter)..."
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Time Block on Calendar Toggle */}
          <div className="border-t border-slate-800 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableTimeBlock"
                  checked={enableTimeBlock}
                  onChange={(e) => setEnableTimeBlock(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700"
                />
                <label htmlFor="enableTimeBlock" className="text-xs font-bold text-slate-200 cursor-pointer flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Time-Block on Calendar (Dedicated Focus Slot)</span>
                </label>
              </div>
            </div>

            {enableTimeBlock && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-300">Block Date</label>
                  <input
                    type="date"
                    value={blockDate}
                    onChange={(e) => setBlockDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-300">Start Time</label>
                  <input
                    type="time"
                    value={blockStartTime}
                    onChange={(e) => {
                      setBlockStartTime(e.target.value);
                      setBlockEndTime(addMinutesToTime(e.target.value, estimatedMinutes));
                    }}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-300">End Time</label>
                  <input
                    type="time"
                    value={blockEndTime}
                    onChange={(e) => setBlockEndTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-400" />
              <span>Tags (comma separated)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Backend, Security, Release"
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {isEdit && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Delete this task?')) {
                    onDelete(task.id);
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/30 transition cursor-pointer"
              >
                {isEdit ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
