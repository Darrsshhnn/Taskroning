export type PriorityLevel = 'p1_urgent' | 'p2_high' | 'p3_medium' | 'p4_low';
export type TaskStatus = 'backlog' | 'in_progress' | 'in_review' | 'completed' | 'scheduled';
export type EnergyLevel = 'high_focus' | 'medium' | 'quick_win';
export type TaskCategory = 'Engineering' | 'Product' | 'Design' | 'Marketing' | 'Operations' | 'Client' | 'General';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  estimatedMinutes?: number;
}

export interface TaskTimeBlock {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  calendarEventId?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  status: TaskStatus;
  category: TaskCategory;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  estimatedMinutes: number;
  timeBlock?: TaskTimeBlock;
  subtasks: SubTask[];
  tags: string[];
  energyLevel: EnergyLevel;
  assignee?: string;
  createdAt: string;
  completedAt?: string;
  pomodoroCount?: number;
  isStarred?: boolean;
}

export type EventCategory = 'meeting' | 'deep_work' | 'client_call' | 'standup' | 'review' | 'deadline' | 'personal';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24h)
  endTime: string; // HH:mm (24h)
  category: EventCategory;
  color: string; // hex or Tailwind color token
  locationOrUrl?: string;
  attendees?: string[];
  isTaskTimeBlock?: boolean;
  linkedTaskId?: string;
  recurring?: 'none' | 'daily' | 'weekly' | 'weekdays';
  reminderMinutes?: number;
}

export type CalendarViewMode = 'day' | 'week' | 'month' | 'timeline';
export type MainViewTab = 'planner' | 'calendar' | 'matrix' | 'kanban' | 'list' | 'analytics';

export interface ScheduleBlockItem {
  taskId?: string | null;
  title: string;
  type: 'task' | 'meeting' | 'focus_block' | 'break' | 'buffer';
  startTime: string;
  endTime: string;
  durationMinutes: number;
  priority?: PriorityLevel | 'none';
  rationale?: string;
}

export interface OptimizedScheduleResponse {
  success: boolean;
  source: 'gemini' | 'fallback';
  summary: string;
  scheduledBlocks?: ScheduleBlockItem[];
  blocks?: ScheduleBlockItem[];
  productivityTips?: string[];
  deadlineRisks?: {
    taskTitle: string;
    riskLevel: 'high' | 'medium' | 'low';
    suggestion: string;
  }[];
}

export interface AIScheduleOptimization {
  dailySummary: string;
  scheduleSuggestions: string[];
  timeBlocks: {
    taskId?: string;
    taskTitle: string;
    startTime: string;
    endTime: string;
    reasoning?: string;
  }[];
}

export interface StandupReport {
  yesterdayDone: string[];
  todayPlan: string[];
  blockersAndRisks: string;
  executiveNotes: string;
}

export interface TaskFilterOptions {
  searchQuery: string;
  priority: PriorityLevel | 'all';
  category: TaskCategory | 'all';
  status: TaskStatus | 'all';
  energyLevel: EnergyLevel | 'all';
  onlyStarred: boolean;
  onlyTimeBlocked: boolean;
  dateFilter: 'all' | 'today' | 'upcoming' | 'overdue' | 'unscheduled';
}

export interface FocusSessionStats {
  totalFocusMinutesToday: number;
  completedPomodoros: number;
  currentStreakDays: number;
  tasksCompletedToday: number;
}
