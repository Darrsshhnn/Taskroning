import React, { useState } from 'react';
import { CalendarEvent, EventCategory, Task } from '../types';
import { getTodayKey, addMinutesToTime } from '../utils/dateUtils';
import { 
  X, 
  Trash2, 
  Video, 
  Users, 
  Repeat, 
  Bell, 
  Calendar as CalendarIcon,
  Tag
} from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  event: CalendarEvent | null;
  tasks: Task[];
  initialDate?: string;
  initialStartTime?: string;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  event,
  tasks,
  initialDate,
  initialStartTime,
  onClose,
  onSave,
  onDelete,
}) => {
  if (!isOpen) return null;

  const isEdit = !!event;

  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [date, setDate] = useState(event?.date || initialDate || getTodayKey());
  const [startTime, setStartTime] = useState(event?.startTime || initialStartTime || '10:00');
  const [endTime, setEndTime] = useState(event?.endTime || (initialStartTime ? addMinutesToTime(initialStartTime, 45) : '10:45'));
  const [category, setCategory] = useState<EventCategory>(event?.category || 'meeting');
  const [locationOrUrl, setLocationOrUrl] = useState(event?.locationOrUrl || '');
  const [attendeesInput, setAttendeesInput] = useState(event?.attendees?.join(', ') || '');
  const [recurring, setRecurring] = useState<'none' | 'daily' | 'weekly' | 'weekdays'>(event?.recurring || 'none');
  const [reminderMinutes, setReminderMinutes] = useState<number>(event?.reminderMinutes || 10);
  const [linkedTaskId, setLinkedTaskId] = useState<string>(event?.linkedTaskId || '');

  const colorMap: Record<EventCategory, string> = {
    meeting: '#8b5cf6',
    deep_work: '#10b981',
    standup: '#3b82f6',
    client_call: '#f59e0b',
    review: '#ec4899',
    deadline: '#ef4444',
    personal: '#64748b',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const attendees = attendeesInput
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);

    const updatedEvent: CalendarEvent = {
      id: event?.id || `ev-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      date,
      startTime,
      endTime,
      category,
      color: colorMap[category] || '#6366f1',
      locationOrUrl: locationOrUrl.trim() || undefined,
      attendees: attendees.length > 0 ? attendees : undefined,
      recurring,
      reminderMinutes,
      linkedTaskId: linkedTaskId || undefined,
    };

    onSave(updatedEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-indigo-400" />
            <span>{isEdit ? 'Edit Calendar Commitment' : 'Add Calendar Event'}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Event Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q3 Roadmap Review with Product Leads"
              className="w-full px-3.5 py-2 text-sm bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Event Type / Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as EventCategory)}
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="meeting">Team Meeting / Sync</option>
              <option value="deep_work">Deep Work / Focus Block</option>
              <option value="standup">Daily Standup</option>
              <option value="client_call">Client Architecture Call</option>
              <option value="review">1-on-1 / Performance Review</option>
              <option value="deadline">Milestone / Hard Deadline</option>
              <option value="personal">Personal / Out of Office</option>
            </select>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Start Time</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setEndTime(addMinutesToTime(e.target.value, 45));
                }}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">End Time</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Meeting URL / Location */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-indigo-400" />
              <span>Video Call Link or Room Location</span>
            </label>
            <input
              type="text"
              value={locationOrUrl}
              onChange={(e) => setLocationOrUrl(e.target.value)}
              placeholder="e.g. https://meet.google.com/abc-def-ghi or Room 302"
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Attendees */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Attendees (comma separated)</span>
            </label>
            <input
              type="text"
              value={attendeesInput}
              onChange={(e) => setAttendeesInput(e.target.value)}
              placeholder="e.g. Sarah Chen, Alex Morgan, Tech Lead"
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Agenda & Notes</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Meeting agenda items, discussion topics, prep notes..."
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Recurrence & Reminders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-slate-400" />
                <span>Recurrence</span>
              </label>
              <select
                value={recurring}
                onChange={(e) => setRecurring(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
              >
                <option value="none">Does not repeat</option>
                <option value="weekdays">Every weekday (Mon - Fri)</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly on this day</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-slate-400" />
                <span>Reminder Alert</span>
              </label>
              <select
                value={reminderMinutes}
                onChange={(e) => setReminderMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
              >
                <option value={5}>5 minutes before</option>
                <option value={10}>10 minutes before</option>
                <option value={15}>15 minutes before</option>
                <option value={30}>30 minutes before</option>
                <option value={0}>At time of event</option>
              </select>
            </div>
          </div>

          {/* Link to Task */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Link with Task Deliverable (Optional)</span>
            </label>
            <select
              value={linkedTaskId}
              onChange={(e) => setLinkedTaskId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">-- No linked task --</option>
              {tasks.map(t => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.category})
                </option>
              ))}
            </select>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {isEdit && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Delete this event?')) {
                    onDelete(event.id);
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
                {isEdit ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
