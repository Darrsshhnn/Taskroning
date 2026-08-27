import { CalendarEvent, Task } from '../types';

export function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function getTodayKey(): string {
  return formatDateKey(new Date());
}

export function formatReadableDate(keyOrDate: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof keyOrDate === 'string' ? parseDateKey(keyOrDate) : keyOrDate;
  const defaultOpts: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return d.toLocaleDateString('en-US', options || defaultOpts);
}

export function formatTime12h(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr || '0', 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const displayM = String(m).padStart(2, '0');
  return `${displayH}:${displayM} ${ampm}`;
}

export function addMinutesToTime(time24: string, minutes: number): string {
  const [h, m] = time24.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

export function calculateMinutesBetween(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

export function getStartOfWeek(date: Date, startOnMonday = true): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (startOnMonday ? (day === 0 ? -6 : 1) : 0);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekDays(currentDate: Date, startOnMonday = true): Date[] {
  const start = getStartOfWeek(currentDate, startOnMonday);
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const next = new Date(start);
    next.setDate(start.getDate() + i);
    days.push(next);
  }
  return days;
}

export function getMonthDays(currentDate: Date): { date: Date; isCurrentMonth: boolean; key: string }[] {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const startDayIndex = (firstDay.getDay() + 6) % 7; // Monday = 0

  const days: { date: Date; isCurrentMonth: boolean; key: string }[] = [];

  // Previous month trailing days
  for (let i = startDayIndex - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ date: d, isCurrentMonth: false, key: formatDateKey(d) });
  }

  // Current month days
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= lastDayOfMonth; i++) {
    const d = new Date(year, month, i);
    days.push({ date: d, isCurrentMonth: true, key: formatDateKey(d) });
  }

  // Next month leading days to complete 35 or 42 grid cells
  const remaining = 35 - days.length >= 0 ? 35 - days.length : 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    days.push({ date: d, isCurrentMonth: false, key: formatDateKey(d) });
  }

  return days;
}

export function isOverdue(dueDate: string, dueTime?: string): boolean {
  if (!dueDate) return false;
  const todayKey = getTodayKey();
  if (dueDate < todayKey) return true;
  if (dueDate === todayKey && dueTime) {
    const now = new Date();
    const currentH = now.getHours();
    const currentM = now.getMinutes();
    const [dueH, dueM] = dueTime.split(':').map(Number);
    if (currentH > dueH || (currentH === dueH && currentM > dueM)) {
      return true;
    }
  }
  return false;
}

export function isDueToday(dueDate: string): boolean {
  return dueDate === getTodayKey();
}

export function isDueSoon(dueDate: string, daysThreshold = 2): boolean {
  if (!dueDate) return false;
  const today = parseDateKey(getTodayKey());
  const due = parseDateKey(dueDate);
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= daysThreshold;
}

export function generateICS(events: CalendarEvent[], tasks: Task[]): string {
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WorkFlowSync//Employee Task & Calendar Orchestrator//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  events.forEach((ev) => {
    const dateFormatted = ev.date.replace(/-/g, '');
    const startFormatted = ev.startTime.replace(/:/g, '') + '00';
    const endFormatted = ev.endTime.replace(/:/g, '') + '00';

    ics.push('BEGIN:VEVENT');
    ics.push(`UID:${ev.id}@workflowsync.local`);
    ics.push(`DTSTAMP:${dateFormatted}T000000Z`);
    ics.push(`DTSTART:${dateFormatted}T${startFormatted}`);
    ics.push(`DTEND:${dateFormatted}T${endFormatted}`);
    ics.push(`SUMMARY:${ev.title}`);
    if (ev.description) ics.push(`DESCRIPTION:${ev.description.replace(/\n/g, '\\n')}`);
    if (ev.locationOrUrl) ics.push(`LOCATION:${ev.locationOrUrl}`);
    ics.push(`CATEGORIES:${ev.category.toUpperCase()}`);
    ics.push('END:VEVENT');
  });

  // Export time-blocked tasks
  tasks.filter(t => t.timeBlock && t.timeBlock.date).forEach((t) => {
    const tb = t.timeBlock!;
    const dateFormatted = tb.date.replace(/-/g, '');
    const startFormatted = tb.startTime.replace(/:/g, '') + '00';
    const endFormatted = tb.endTime.replace(/:/g, '') + '00';

    ics.push('BEGIN:VEVENT');
    ics.push(`UID:task-${t.id}@workflowsync.local`);
    ics.push(`DTSTAMP:${dateFormatted}T000000Z`);
    ics.push(`DTSTART:${dateFormatted}T${startFormatted}`);
    ics.push(`DTEND:${dateFormatted}T${endFormatted}`);
    ics.push(`SUMMARY:[Task] ${t.title}`);
    ics.push(`DESCRIPTION:Priority: ${t.priority}\\nStatus: ${t.status}\\n${t.description.replace(/\n/g, '\\n')}`);
    ics.push(`CATEGORIES:TASK,${t.category.toUpperCase()}`);
    ics.push('END:VEVENT');
  });

  ics.push('END:VCALENDAR');
  return ics.join('\r\n');
}

export function parseICS(icsContent: string): Partial<CalendarEvent>[] {
  const events: Partial<CalendarEvent>[] = [];
  const lines = icsContent.split(/\r\n|\n|\r/);
  let currentEvent: Partial<CalendarEvent> | null = null;

  for (let line of lines) {
    line = line.trim();
    if (line === 'BEGIN:VEVENT') {
      currentEvent = {
        id: `ics-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        category: 'meeting',
        color: '#4f46e5',
      };
    } else if (line === 'END:VEVENT' && currentEvent) {
      if (currentEvent.title && currentEvent.date && currentEvent.startTime && currentEvent.endTime) {
        events.push(currentEvent);
      }
      currentEvent = null;
    } else if (currentEvent) {
      if (line.startsWith('SUMMARY:')) {
        currentEvent.title = line.substring(8);
      } else if (line.startsWith('DESCRIPTION:')) {
        currentEvent.description = line.substring(12).replace(/\\n/g, '\n');
      } else if (line.startsWith('LOCATION:')) {
        currentEvent.locationOrUrl = line.substring(9);
      } else if (line.startsWith('DTSTART')) {
        const value = line.split(':')[1] || '';
        if (value.length >= 8) {
          const y = value.substring(0, 4);
          const m = value.substring(4, 6);
          const d = value.substring(6, 8);
          currentEvent.date = `${y}-${m}-${d}`;
          if (value.includes('T') && value.length >= 13) {
            const timePart = value.split('T')[1];
            currentEvent.startTime = `${timePart.substring(0, 2)}:${timePart.substring(2, 4)}`;
          } else {
            currentEvent.startTime = '09:00';
          }
        }
      } else if (line.startsWith('DTEND')) {
        const value = line.split(':')[1] || '';
        if (value.length >= 8) {
          if (value.includes('T') && value.length >= 13) {
            const timePart = value.split('T')[1];
            currentEvent.endTime = `${timePart.substring(0, 2)}:${timePart.substring(2, 4)}`;
          } else {
            currentEvent.endTime = '10:00';
          }
        }
      }
    }
  }

  return events;
}
