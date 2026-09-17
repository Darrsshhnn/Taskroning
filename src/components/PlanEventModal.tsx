import React, { useState } from 'react';
import { CalendarEvent, EventCategory } from '../types';
import { useAuth } from '../context/AuthContext';
import { saveUserEvent } from '../services/eventService';
import { audioManager } from '../utils/audioUtils';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Bell, 
  Sparkles, 
  Loader2,
  CheckCircle2
} from 'lucide-react';

interface PlanEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
  onEventCreated?: (event: CalendarEvent) => void;
}

const CATEGORY_OPTIONS: { id: EventCategory; label: string; color: string }[] = [
  { id: 'deep_work', label: 'Deep Work', color: '#00F5C4' },
  { id: 'meeting', label: 'Meeting', color: '#3B82F6' },
  { id: 'review', label: 'Review', color: '#F59E0B' },
  { id: 'client_call', label: 'Client Call', color: '#8B5CF6' },
  { id: 'standup', label: 'Standup', color: '#06B6D4' },
  { id: 'deadline', label: 'Deadline', color: '#EF4444' },
  { id: 'personal', label: 'Personal / Break', color: '#10B981' },
];

export const PlanEventModal: React.FC<PlanEventModalProps> = ({
  isOpen,
  onClose,
  defaultDate,
  onEventCreated,
}) => {
  const { firebaseUser } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('deep_work');
  const [date, setDate] = useState(defaultDate || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('12:00');
  const [locationOrUrl, setLocationOrUrl] = useState('Google Meet');
  const [attendeesStr, setAttendeesStr] = useState('Product Team, Design Pod');
  const [description, setDescription] = useState('');
  const [reminderMinutes, setReminderMinutes] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please provide an event title.');
      return;
    }

    if (!firebaseUser?.uid) {
      setErrorMessage('User session missing.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const chosenCat = CATEGORY_OPTIONS.find(c => c.id === category);

    const newEvent: CalendarEvent = {
      id: `ev-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      date: date || new Date().toISOString().split('T')[0],
      startTime: startTime || '10:00',
      endTime: endTime || '11:00',
      category: category,
      color: chosenCat?.color || '#00F5C4',
      locationOrUrl: locationOrUrl.trim() || undefined,
      attendees: attendeesStr.split(',').map(s => s.trim()).filter(Boolean),
      reminderMinutes: reminderMinutes,
    };

    try {
      await saveUserEvent(firebaseUser.uid, newEvent);
      audioManager.playChime('success');
      if (onEventCreated) {
        onEventCreated(newEvent);
      }
      onClose();
    } catch (err) {
      console.error('Error saving event:', err);
      setErrorMessage('Failed to save event to Firestore. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg rounded-2xl bg-[#091321] border border-cyan-500/40 p-6 space-y-5 shadow-2xl relative select-none max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#14263E] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-400/50 flex items-center justify-center text-cyan-400">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Plan Event</h3>
              <p className="text-[11px] text-slate-400">Schedule real sprint milestones, meetings, or deep focus</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#0C1929] hover:bg-[#12253D] text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Title */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Event Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Interaction 5,7,8 updation : Project 2P"
              required
              className="w-full bg-[#060D17] border border-[#162D4A] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORY_OPTIONS.map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-2 rounded-xl text-left border transition flex items-center gap-2 cursor-pointer ${
                    category === cat.id
                      ? 'bg-cyan-950/40 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,245,196,0.2)]'
                      : 'bg-[#060D17] border-[#152B47] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="truncate text-[11px] font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <CalendarIcon className="w-3 h-3 text-cyan-400" />
                <span>Date</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-[#060D17] border border-[#162D4A] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>Start Time</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full bg-[#060D17] border border-[#162D4A] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>End Time</span>
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full bg-[#060D17] border border-[#162D4A] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Location / Meeting URL */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>Location / URL</span>
            </label>
            <input
              type="text"
              value={locationOrUrl}
              onChange={(e) => setLocationOrUrl(e.target.value)}
              placeholder="e.g. Google Meet or Conference Room Alpha"
              className="w-full bg-[#060D17] border border-[#162D4A] rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Attendees */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
              <Users className="w-3 h-3 text-cyan-400" />
              <span>Attendees (comma-separated)</span>
            </label>
            <input
              type="text"
              value={attendeesStr}
              onChange={(e) => setAttendeesStr(e.target.value)}
              placeholder="e.g. Lead Designer, Ankit, Product Manager"
              className="w-full bg-[#060D17] border border-[#162D4A] rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Description & Reminder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Bell className="w-3 h-3 text-cyan-400" />
                <span>Reminder Notification</span>
              </label>
              <select
                value={reminderMinutes}
                onChange={(e) => setReminderMinutes(Number(e.target.value))}
                className="w-full bg-[#060D17] border border-[#162D4A] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value={0}>At time of event</option>
                <option value={5}>5 minutes before</option>
                <option value={10}>10 minutes before</option>
                <option value={15}>15 minutes before</option>
                <option value={30}>30 minutes before</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Notes / Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional agenda or details"
                className="w-full bg-[#060D17] border border-[#162D4A] rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#14263E]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#08121E] hover:bg-[#0E1C2E] border border-[#172D47] text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 text-xs font-bold transition shadow-[0_0_15px_rgba(0,245,196,0.35)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving to Cloud...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save Event</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
