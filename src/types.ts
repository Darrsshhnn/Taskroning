export type PriorityLevel = 'p1_urgent' | 'p2_high' | 'p3_medium' | 'p4_low';
export type TaskStatus = 'backlog' | 'in_progress' | 'in_review' | 'completed' | 'scheduled';
export type EnergyLevel = 'high_focus' | 'medium' | 'quick_win';
export type TaskCategory = 'Engineering' | 'Product' | 'Design' | 'Marketing' | 'Operations' | 'Client' | 'General';

export type MainNavTab = 
  | 'dashboard'
  | 'project'
  | 'project_updates'
  | 'project_report'
  | 'day_overview'
  | 'taskroning'
  | 'analytics'
  | 'ai'
  | 'focus'
  | 'calendar'
  | 'achievements'
  | 'chat'
  | 'notification'
  | 'profile'
  | 'admin';

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
  progress?: number; // 0 - 100%
  timeBlock?: TaskTimeBlock;
  subtasks: SubTask[];
  tags: string[];
  energyLevel: EnergyLevel;
  assignee?: string;
  createdAt: string;
  completedAt?: string;
  pomodoroCount?: number;
  isStarred?: boolean;
  isDraft?: boolean;
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
  color: string;
  locationOrUrl?: string;
  attendees?: string[];
  isTaskTimeBlock?: boolean;
  linkedTaskId?: string;
  recurring?: 'none' | 'daily' | 'weekly' | 'weekdays';
  reminderMinutes?: number;
}

export interface TimelinePhase {
  id: string;
  name: string;
  startDay: number;
  endDay: number;
  status: 'completed' | 'ongoing' | 'upcoming';
  progress: number;
  color: string;
}

export interface DepartmentUpdate {
  id: string;
  department: string;
  updates: {
    id: string;
    task: string;
    status: 'Started...' | 'Pending' | 'Approved.';
  }[];
  clientInsights: {
    id: string;
    task: string;
    status: 'Started...' | 'Pending' | 'Approved.';
  }[];
}

export interface AchievementItem {
  id: string;
  name: string;
  tag: string; // e.g. '#First Achiever', '#Bullseye'
  iconName: string;
  unlocked: boolean;
  progress: number; // 0 - 100
  category: 'all' | 'project';
  description: string;
}

export interface ChatParticipant {
  uid: string;
  name: string;
  email?: string;
  photoURL?: string;
  role?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantDetails?: Record<string, {
    name?: string;
    email?: string;
    photoURL?: string;
    role?: string;
  }>;
  isGroup?: boolean;
  groupName?: string;
  groupAvatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageTimestamp?: number;
  lastSenderId?: string;
  lastSenderName?: string;
  unreadCount?: number;
  createdAt: number | string;
  updatedAt: number | string;
}

export interface ChatContact {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  lastMessage: string;
  lastTime: string;
  unreadCount?: number;
  status: 'online' | 'offline' | 'busy';
  isGroup?: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId?: string;
  senderId: string;
  senderName: string;
  senderPhotoURL?: string;
  text: string;
  timestamp: string;
  createdAt?: number;
  isMe?: boolean;
  imageUrl?: string;
  status?: 'sending' | 'sent' | 'read';
}

export interface AppNotification {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  time: string;
  dateGroup: 'recent' | 'yesterday';
  type: 'designer' | 'focus' | 'achievement' | 'intern';
  avatar?: string;
  read: boolean;
}

export interface UserProfile {
  name: string;
  email?: string;
  dob: string;
  role: string;
  gender: string;
  timeZone: string;
  address: string;
  description: string;
  avatarUrl: string;
  profileImageType?: 'upload' | 'avatar';
  phoneNumber?: string;
  skills: string[];
  leaves: {
    id: string;
    dates: string;
    type: string; // 'Sick Leave' | 'Going on a trip'
    status: 'upcoming' | 'previous';
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

export interface FocusZone {
  id: string;
  date: string;
  sessionTitle: string;
  time: string;
}

export interface FocusHistoryItem {
  id: string;
  day: string;
  focused: string;
  timings: string;
}

export interface AuthErrorInfo {
  code: string;
  message: string;
  title: string;
  resolution: string;
  currentDomain?: string;
  actionType?: 'domain' | 'redirect' | 'config' | 'retry';
  rawError?: string;
}

export interface GoogleAuthUser {
  id: string;
  uid: string;
  name: string;
  email: string;
  picture: string;
  photoURL: string;
  profileImageType?: 'upload' | 'avatar';
  role?: string;
  givenName?: string;
  familyName?: string;
  verifiedEmail?: boolean;
  hd?: string;
  accessToken?: string;
  idToken?: string;
  loginTimestamp: number;
  isAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
