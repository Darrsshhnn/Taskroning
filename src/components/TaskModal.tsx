import React, { useState, useEffect } from 'react';
import { Task, PriorityLevel, TaskCategory, TaskStatus } from '../types';
import { X, Clock, Calendar, CheckSquare, Plus, Trash2 } from 'lucide-react';
import { getTodayKey } from '../utils/dateUtils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  initialTask?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  onDeleteTask,
  initialTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('p2_high');
  const [status, setStatus] = useState<TaskStatus>('in_progress');
  const [category, setCategory] = useState<TaskCategory>('Design');
  const [dueDate, setDueDate] = useState(getTodayKey());
  const [dueTime, setDueTime] = useState('10:15');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [progress, setProgress] = useState(50);
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setPriority(initialTask.priority);
      setStatus(initialTask.status);
      setCategory(initialTask.category);
      setDueDate(initialTask.dueDate);
      setDueTime(initialTask.dueTime || '10:15');
      setEstimatedMinutes(initialTask.estimatedMinutes || 45);
      setProgress(initialTask.progress || 50);
      setSubtasks(initialTask.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setPriority('p2_high');
      setStatus('in_progress');
      setCategory('Design');
      setDueDate(getTodayKey());
      setDueTime('10:15');
      setEstimatedMinutes(45);
      setProgress(50);
      setSubtasks([]);
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks(prev => [
      ...prev,
      { id: `st-${Date.now()}`, title: newSubtaskTitle.trim(), completed: false }
    ]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks(prev => prev.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskToSave: Task = {
      id: initialTask?.id || `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      category,
      dueDate,
      dueTime,
      estimatedMinutes,
      progress,
      subtasks,
      tags: ['Project 2P'],
      energyLevel: priority === 'p1_urgent' ? 'high_focus' : 'medium',
      createdAt: initialTask?.createdAt || getTodayKey(),
      timeBlock: {
        date: dueDate,
        startTime: dueTime,
        endTime: '11:15'
      }
    };

    onSaveTask(taskToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      <div className="taskroning-card w-full max-w-xl p-6 bg-[#08121E] border border-cyan-500/40 shadow-[0_0_30px_rgba(0,245,196,0.25)] space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#142337] pb-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
            {initialTask ? 'Edit Taskroning Task' : 'New Taskroning Task'}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#142337] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Task Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Interaction 5,7,8 updation : Project 2P"
              className="w-full bg-[#050A10] border border-[#162B45] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Time</label>
              <input
                type="text"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                placeholder="10:15"
                className="w-full bg-[#050A10] border border-[#162B45] rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full bg-[#050A10] border border-[#162B45] rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="p1_urgent">P1 Urgent (Red)</option>
                <option value="p2_high">P2 High (Yellow)</option>
                <option value="p3_medium">P3 Medium (Blue)</option>
                <option value="p4_low">P4 Low</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Progress ({progress}%)</label>
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-cyan-400 mt-2"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Description & Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Prototyping steps, user stories, or client specifications..."
              className="w-full bg-[#050A10] border border-[#162B45] rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Subtasks */}
          <div className="space-y-2 pt-2 border-t border-[#142337]">
            <label className="text-[11px] font-bold text-slate-300 block">Subtasks Checklist</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                placeholder="Add subtask step..."
                className="flex-1 bg-[#050A10] border border-[#162B45] rounded-lg px-3 py-1.5 text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 rounded-lg bg-[#0E1B2E] border border-cyan-500/40 text-cyan-400 text-xs font-bold hover:text-white"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-32 overflow-y-auto pt-1">
              {subtasks.map(st => (
                <div key={st.id} className="flex items-center justify-between p-2 rounded-lg bg-[#050A10] text-xs">
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => handleToggleSubtask(st.id)}
                      className="accent-cyan-400"
                    />
                    <span className={st.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                      {st.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubtask(st.id)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#142337]">
            {initialTask && onDeleteTask ? (
              <button
                type="button"
                onClick={() => {
                  onDeleteTask(initialTask.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-400 hover:text-white text-xs font-bold transition cursor-pointer"
              >
                Delete
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#08121E] border border-[#182E47] text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 text-xs font-bold hover:brightness-110 transition shadow-md shadow-cyan-500/30 cursor-pointer"
              >
                Save Task
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
