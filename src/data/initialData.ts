import { 
  Task, 
  CalendarEvent, 
  TimelinePhase, 
  DepartmentUpdate, 
  AchievementItem, 
  ChatContact, 
  ChatMessage, 
  AppNotification, 
  UserProfile,
  FocusZone,
  FocusHistoryItem
} from '../types';
import { getTodayKey, formatDateKey } from '../utils/dateUtils';

export function getInitialCalendarEvents(): CalendarEvent[] {
  const todayKey = getTodayKey();

  return [
    {
      id: 'ev-1',
      title: 'Interaction 5,7,8 updation : Project 2P',
      description: 'Review interactive motion states and component interactions for Project 2P.',
      date: todayKey,
      startTime: '10:15',
      endTime: '11:15',
      category: 'deep_work',
      color: '#00f5c4',
      locationOrUrl: 'Design Studio 2P',
      attendees: ['Darshan S.', 'Ankit', 'UI Team'],
      reminderMinutes: 10,
    },
    {
      id: 'ev-2',
      title: 'Prototype - Module 1 : Project 2P',
      description: 'Sprint planning and user-flow validation on prototype module 1.',
      date: todayKey,
      startTime: '11:30',
      endTime: '12:00',
      category: 'review',
      color: '#3b82f6',
      locationOrUrl: 'Google Meet',
      attendees: ['Product Leads', 'Lead Designer'],
      reminderMinutes: 10,
    },
    {
      id: 'ev-3',
      title: 'Meeting with new team - Offline : New',
      description: 'Kickoff meeting with newly onboarded frontend engineers & QA.',
      date: todayKey,
      startTime: '12:00',
      endTime: '13:00',
      category: 'meeting',
      color: '#ef4444',
      locationOrUrl: 'Conference Room Alpha',
      attendees: ['Engineering Pod 3', 'Product Manager'],
      reminderMinutes: 15,
    },
    {
      id: 'ev-4',
      title: 'Lunch Break & Reset',
      description: 'Midday recharge and recovery interval.',
      date: todayKey,
      startTime: '13:00',
      endTime: '13:30',
      category: 'personal',
      color: '#10b981',
      locationOrUrl: 'Cafeteria',
      reminderMinutes: 5,
    },
    {
      id: 'ev-5',
      title: 'Prototype - Module 2 : Project 2P',
      description: 'Prototyping the second module/screens and testing the spring motion on client project 2P.',
      date: todayKey,
      startTime: '13:30',
      endTime: '15:15',
      category: 'deep_work',
      color: '#00f5c4',
      locationOrUrl: 'Figma Workspace',
      attendees: ['Designer Group 2'],
      reminderMinutes: 10,
    },
    {
      id: 'ev-6',
      title: 'Discussion for new Project : New',
      description: 'Scoping and timeline estimations for upcoming Q4 client initiatives.',
      date: todayKey,
      startTime: '15:15',
      endTime: '17:00',
      category: 'meeting',
      color: '#f59e0b',
      locationOrUrl: 'Room 204',
      attendees: ['Client Stakeholders', 'VP Product'],
      reminderMinutes: 15,
    },
    {
      id: 'ev-7',
      title: 'Evening Break',
      description: '15-minute mental break & coffee recharge.',
      date: todayKey,
      startTime: '17:00',
      endTime: '17:30',
      category: 'personal',
      color: '#10b981',
      locationOrUrl: 'Lounge',
      reminderMinutes: 5,
    },
    {
      id: 'ev-8',
      title: 'Project Update (EOD) : Project 2P',
      description: 'End-of-day async briefing and handoff sync to design leads.',
      date: todayKey,
      startTime: '17:30',
      endTime: '18:00',
      category: 'standup',
      color: '#8b5cf6',
      locationOrUrl: 'Slack / Teams',
      attendees: ['Team 2P'],
      reminderMinutes: 10,
    }
  ];
}

export function getInitialTasks(): Task[] {
  const todayKey = getTodayKey();

  return [
    {
      id: 'task-1',
      title: 'Interaction 5,7,8 updation : Project 2P',
      description: 'Update the home page interaction, button states, and micro-animations for Project 2P.',
      priority: 'p1_urgent',
      status: 'in_progress',
      category: 'Design',
      dueDate: todayKey,
      dueTime: '10:15',
      estimatedMinutes: 60,
      progress: 85,
      energyLevel: 'high_focus',
      tags: ['Project 2P', 'Interactions', 'UI'],
      subtasks: [
        { id: 'st-1', title: 'Audit current interaction lag in prototype', completed: true, estimatedMinutes: 20 },
        { id: 'st-2', title: 'Implement spring curve 500ms easing', completed: true, estimatedMinutes: 25 },
        { id: 'st-3', title: 'Export animation specs for developers', completed: false, estimatedMinutes: 15 },
      ],
      createdAt: todayKey,
      pomodoroCount: 3,
      isStarred: true,
      timeBlock: {
        date: todayKey,
        startTime: '10:15',
        endTime: '11:15'
      }
    },
    {
      id: 'task-2',
      title: 'Prototype - Module 1 : Project 2P',
      description: 'Finalize navigation transitions and mobile responsive breakpoints on Module 1.',
      priority: 'p2_high',
      status: 'in_progress',
      category: 'Design',
      dueDate: todayKey,
      dueTime: '11:30',
      estimatedMinutes: 45,
      progress: 55,
      energyLevel: 'high_focus',
      tags: ['Project 2P', 'Module 1', 'Prototype'],
      subtasks: [
        { id: 'st-4', title: 'Connect frame transitions in Figma', completed: true, estimatedMinutes: 25 },
        { id: 'st-5', title: 'Review with senior design lead', completed: false, estimatedMinutes: 20 },
      ],
      createdAt: todayKey,
      pomodoroCount: 2,
      isStarred: true,
      timeBlock: {
        date: todayKey,
        startTime: '11:30',
        endTime: '12:00'
      }
    },
    {
      id: 'task-3',
      title: 'Meeting with new team - Offline : New',
      description: 'Cross-functional alignment and developer handoff for the new design system components.',
      priority: 'p1_urgent',
      status: 'scheduled',
      category: 'Operations',
      dueDate: todayKey,
      dueTime: '12:00',
      estimatedMinutes: 60,
      progress: 40,
      energyLevel: 'medium',
      tags: ['New Project', 'Handoff', 'Offline'],
      subtasks: [
        { id: 'st-6', title: 'Prepare slide deck & demo tokens', completed: true, estimatedMinutes: 30 },
        { id: 'st-7', title: 'Conduct live walkthrough with QA', completed: false, estimatedMinutes: 30 },
      ],
      createdAt: todayKey,
      pomodoroCount: 1,
      isStarred: false,
      timeBlock: {
        date: todayKey,
        startTime: '12:00',
        endTime: '13:00'
      }
    },
    {
      id: 'task-4',
      title: 'Prototype - Module 2 : Project 2P',
      description: 'Prototyping the second module/screens and testing the spring motion on client project 2P.',
      priority: 'p2_high',
      status: 'in_progress',
      category: 'Design',
      dueDate: todayKey,
      dueTime: '13:30',
      estimatedMinutes: 90,
      progress: 70,
      energyLevel: 'high_focus',
      tags: ['Project 2P', 'Module 2', 'Spring Motion'],
      subtasks: [
        { id: 'st-8', title: 'Structure nested component variants', completed: true, estimatedMinutes: 40 },
        { id: 'st-9', title: 'Validate touch targets and contrast ratio', completed: true, estimatedMinutes: 30 },
        { id: 'st-10', title: 'Generate interactive preview link', completed: false, estimatedMinutes: 20 },
      ],
      createdAt: todayKey,
      pomodoroCount: 4,
      isStarred: true,
      timeBlock: {
        date: todayKey,
        startTime: '13:30',
        endTime: '15:15'
      }
    },
    {
      id: 'task-5',
      title: 'Discussion for new Project : New',
      description: 'Brainstorm client roadmap, budget thresholds, and tech stack architecture.',
      priority: 'p3_medium',
      status: 'scheduled',
      category: 'Product',
      dueDate: todayKey,
      dueTime: '15:15',
      estimatedMinutes: 60,
      progress: 30,
      energyLevel: 'medium',
      tags: ['New Project', 'Strategy'],
      subtasks: [
        { id: 'st-11', title: 'Draft feature breakdown matrix', completed: false, estimatedMinutes: 35 },
        { id: 'st-12', title: 'Estimate story points with leads', completed: false, estimatedMinutes: 25 },
      ],
      createdAt: todayKey,
      pomodoroCount: 1,
      isStarred: false,
      timeBlock: {
        date: todayKey,
        startTime: '15:15',
        endTime: '17:00'
      }
    },
    {
      id: 'task-6',
      title: 'Project Update (EOD) : Project 2P',
      description: 'Write end of day async status update with client deliverables and next day targets.',
      priority: 'p2_high',
      status: 'backlog',
      category: 'Client',
      dueDate: todayKey,
      dueTime: '17:30',
      estimatedMinutes: 30,
      progress: 20,
      energyLevel: 'quick_win',
      tags: ['Project 2P', 'EOD Update'],
      subtasks: [
        { id: 'st-13', title: 'Compile completed Figma frames link', completed: false, estimatedMinutes: 15 },
        { id: 'st-14', title: 'Post to #project-2p-updates channel', completed: false, estimatedMinutes: 15 },
      ],
      createdAt: todayKey,
      pomodoroCount: 0,
      isStarred: false,
      timeBlock: {
        date: todayKey,
        startTime: '17:30',
        endTime: '18:00'
      }
    }
  ];
}

export const INITIAL_TIMELINE_PHASES: TimelinePhase[] = [
  { id: 'p-1', name: 'Research', startDay: 9, endDay: 13, status: 'completed', progress: 100, color: '#00f5c4' },
  { id: 'p-2', name: 'UX Research', startDay: 12, endDay: 20, status: 'completed', progress: 100, color: '#22d3ee' },
  { id: 'p-3', name: 'Content', startDay: 16, endDay: 20, status: 'completed', progress: 100, color: '#10b981' },
  { id: 'p-4', name: 'UI', startDay: 17, endDay: 26, status: 'ongoing', progress: 65, color: '#2563eb' },
  { id: 'p-5', name: 'Initial Development', startDay: 20, endDay: 26, status: 'upcoming', progress: 25, color: '#3b82f6' },
];

export const INITIAL_DEPARTMENT_UPDATES: DepartmentUpdate[] = [
  {
    id: 'dept-1',
    department: 'Research Team 1',
    updates: [
      { id: 'u-1', task: 'Depth Research on Customer', status: 'Started...' },
      { id: 'u-2', task: 'Depth Research on Customer', status: 'Pending' },
      { id: 'u-3', task: 'Depth Research on Customer', status: 'Pending' },
    ],
    clientInsights: [
      { id: 'ci-1', task: 'Depth Research on Customer', status: 'Approved.' }
    ]
  },
  {
    id: 'dept-2',
    department: 'UI/UX Team',
    updates: [
      { id: 'u-4', task: 'Depth Research on Customer', status: 'Started...' }
    ],
    clientInsights: [
      { id: 'ci-2', task: 'Depth Research on Customer', status: 'Pending' },
      { id: 'ci-3', task: 'Depth Research on Customer', status: 'Pending' }
    ]
  },
  {
    id: 'dept-3',
    department: 'Developers T-2',
    updates: [
      { id: 'u-5', task: 'Depth Research on Customer', status: 'Pending' },
      { id: 'u-6', task: 'Depth Research on Customer', status: 'Pending' }
    ],
    clientInsights: [
      { id: 'ci-4', task: 'Depth Research on Customer', status: 'Approved.' }
    ]
  },
  {
    id: 'dept-4',
    department: 'Testing Dept',
    updates: [
      { id: 'u-7', task: 'Depth Research on Customer', status: 'Pending' }
    ],
    clientInsights: [
      { id: 'ci-5', task: 'Depth Research on Customer', status: 'Pending' },
      { id: 'ci-6', task: 'Depth Research on Customer', status: 'Pending' }
    ]
  },
  {
    id: 'dept-5',
    department: 'Project Manager',
    updates: [
      { id: 'u-8', task: 'Depth Research on Customer', status: 'Approved.' }
    ],
    clientInsights: []
  }
];

export const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  { id: 'ach-1', name: 'First Achiever', tag: '#First Achiever', iconName: 'Trophy', unlocked: true, progress: 100, category: 'all', description: 'Complete your first sprint milestone ahead of schedule.' },
  { id: 'ach-2', name: 'Timekeeper', tag: '#Time-keeper', iconName: 'Clock', unlocked: true, progress: 100, category: 'all', description: 'Log over 10 hours of focused deep work in a single sprint week.' },
  { id: 'ach-3', name: 'Blackflags', tag: '#Blackflags', iconName: 'Flag', unlocked: true, progress: 100, category: 'all', description: 'Identify and resolve critical blockers before team standup.' },
  { id: 'ach-4', name: 'Overdraft', tag: '#Overdraft', iconName: 'Layers', unlocked: true, progress: 100, category: 'all', description: 'Execute 5 multi-stage project deliverables in tandem.' },
  { id: 'ach-5', name: 'Pre-sched', tag: '#Pre-sched', iconName: 'Hourglass', unlocked: false, progress: 65, category: 'all', description: 'Time-block 100% of tasks at least 24 hours in advance.' },
  { id: 'ach-6', name: 'Bullseye', tag: '#Bullseye', iconName: 'Target', unlocked: true, progress: 100, category: 'all', description: 'Achieve 95%+ completion accuracy on scheduled deliverables.' },
  { id: 'ach-7', name: '103Sched', tag: '#103Sched', iconName: 'Calendar', unlocked: false, progress: 40, category: 'all', description: 'Maintain continuous calendar synchronization for 30 days.' },
  { id: 'ach-8', name: 'Bug Finder', tag: '#Bug Finder', iconName: 'Bug', unlocked: false, progress: 75, category: 'all', description: 'Catch and document edge case design bugs during QA review.' },
  { id: 'ach-9', name: 'Project-2/10', tag: '#Project-2/10', iconName: 'Users', unlocked: false, progress: 50, category: 'all', description: 'Lead cross-functional collaboration across 2 core client teams.' },
  { id: 'ach-10', name: 'BrainNeedle', tag: '#BrainNeedle', iconName: 'Brain', unlocked: false, progress: 80, category: 'all', description: 'Complete 3 deep work cycles with 0 external context interruptions.' },
  { id: 'ach-11', name: 'FocusTarget', tag: '#FocusTarget', iconName: 'Crosshair', unlocked: false, progress: 45, category: 'all', description: 'Hit daily focus goal of 3.5 hours for 5 consecutive workdays.' },
  { id: 'ach-12', name: 'Costant Growth', tag: '#Costant Growth', iconName: 'TrendingUp', unlocked: true, progress: 100, category: 'all', description: 'Increase sprint deliverable velocity by 25% month-over-month.' },
  { id: 'ach-13', name: 'Communicator', tag: '#Communicator', iconName: 'MessageSquare', unlocked: true, progress: 100, category: 'project', description: 'Maintain active team updates and synchronous design feedback.' }
];

export const INITIAL_CHAT_CONTACTS: ChatContact[] = [
  { id: 'c-group', name: 'Project 2p Designer group 2', role: 'Active Group', avatar: '🐕', lastMessage: 'The text can be change @contentwriter2 Make to more crisp.', lastTime: '11:42 PM', unreadCount: 3, status: 'online', isGroup: true },
  { id: 'c-1', name: 'Amish', role: 'Content Lead', avatar: '🔵', lastMessage: 'Send the content', lastTime: '12:38 A.M.', status: 'online' },
  { id: 'c-2', name: 'Lalit', role: 'Frontend Dev', avatar: '🔵', lastMessage: 'Last link was Updated', lastTime: '11:47 A.M.', status: 'online' },
  { id: 'c-3', name: 'Roshni', role: 'UI Designer', avatar: '🔵', lastMessage: 'Change in p4', lastTime: '11:45 A.M.', status: 'online' },
  { id: 'c-4', name: 'Group - 2', role: 'Dev Team', avatar: '🔵', lastMessage: 'Last link was Updated', lastTime: '11:45 A.M.', status: 'offline' },
  { id: 'c-5', name: 'Mithilesh', role: 'QA Lead', avatar: '🔵', lastMessage: 'Last link was Updated', lastTime: '11:37 A.M.', status: 'busy' },
  { id: 'c-6', name: 'Raj - Sir', role: 'Design Director', avatar: '🔵', lastMessage: 'Last link was Updated', lastTime: '11:08 A.M.', status: 'online' },
  { id: 'c-7', name: 'Group - 3A', role: 'Backend Pod', avatar: '🔵', lastMessage: 'Last link was Updated', lastTime: '11:04 A.M.', status: 'offline' },
  { id: 'c-8', name: 'Mithali', role: 'Product Manager', avatar: '🔵', lastMessage: 'Last link was Updated', lastTime: '11:00 A.M.', status: 'online' },
  { id: 'c-9', name: 'Prijesh', role: 'Mobile Dev', avatar: '🔵', lastMessage: 'Last link was Updated', lastTime: '10:37 A.M.', status: 'online' },
  { id: 'c-10', name: 'Mohan', role: 'DevOps', avatar: '🔵', lastMessage: 'Completed review', lastTime: '11:43 P.M.', status: 'offline' },
  { id: 'c-11', name: 'Aisha', role: 'UX Researcher', avatar: '🔵', lastMessage: 'Started new project', lastTime: '11:42 P.M.', status: 'online' },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm-1',
    senderId: 'c-group',
    senderName: 'Senior Designer - Ankit',
    text: 'The given update looks too messy, try to make it more visually appealing with more colors And also don\'t change the visual graph.',
    timestamp: '11:35 PM',
    isMe: false,
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'm-2',
    senderId: 'me',
    senderName: 'Darshan',
    text: 'I think this looks good, with more changes it will be cluttered!',
    timestamp: '11:39 PM',
    isMe: true,
  },
  {
    id: 'm-3',
    senderId: 'c-group',
    senderName: 'Lead Dev - Lalit',
    text: 'The text can be change @contentwriter2 Make to more crisp.',
    timestamp: '11:42 PM',
    isMe: false,
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Senior Designer - Ankit',
    subtitle: '(Project 2p - Designer group 2)',
    description: "Updating the Home page UI based on the client's updates by 23/04/2026 morning.",
    time: '11:45 AM',
    dateGroup: 'recent',
    type: 'designer',
    avatar: '🐕',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Focus Mode',
    description: "Congratulations. Today's Goal completed!! How about pushing yourself a bit more by additioning 30 minutes.",
    time: '10:20 AM',
    dateGroup: 'recent',
    type: 'focus',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Bug Killer (Achievements)',
    description: "Complete your today's task to unlock another achievement and you will be in 10% of the people.",
    time: '09:15 AM',
    dateGroup: 'recent',
    type: 'achievement',
    read: true,
  },
  {
    id: 'notif-4',
    title: 'Intern - Shubhash',
    subtitle: '(Project 2p - Designer group 2)',
    description: 'Completed the onboarding flow for new users. Please Review it.',
    time: 'Yesterday 04:30 PM',
    dateGroup: 'yesterday',
    type: 'intern',
    avatar: '🐕',
    read: true,
  },
  {
    id: 'notif-5',
    title: 'Focus Mode (78%)',
    description: 'Very tiring day, still you beat your average!!',
    time: 'Yesterday 06:15 PM',
    dateGroup: 'yesterday',
    type: 'focus',
    read: true,
  },
  {
    id: 'notif-6',
    title: 'Senior Designer - Ankit',
    subtitle: '(Project 2p - Designer group 2)',
    description: 'Merged component variants into production branch.',
    time: 'Yesterday 02:10 PM',
    dateGroup: 'yesterday',
    type: 'designer',
    avatar: '🐕',
    read: true,
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Darshan Solanki',
  email: 'sdarshan1163@gmail.com',
  dob: '14 / 08 / 1998',
  role: 'Lead UI/UX & System Architect',
  gender: 'Male',
  timeZone: '02:42 Hr (PST / IST)',
  address: 'Design Studio 2P, Tech Innovation Park',
  description: 'Enterprise systems architect and UI/UX designer responsible for micro-interactions, responsive design frameworks, component libraries, and end-to-end task orchestration.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  phoneNumber: '+1 (555) 349-2819',
  skills: ['UI/UX', 'PRO', 'DEV+', 'Figma', 'System Architecture'],
  leaves: [
    { id: 'l-1', dates: '09/03', type: 'Sick Leave', status: 'previous' },
    { id: 'l-2', dates: '25, 26, 27/03', type: 'Going on a trip', status: 'previous' },
    { id: 'l-3', dates: '08/04', type: 'Going on a trip', status: 'upcoming' },
    { id: 'l-4', dates: '20/04', type: 'Going on a trip', status: 'upcoming' },
  ]
};

export const INITIAL_FOCUS_ZONES: FocusZone[] = [
  { id: 'fz-1', date: '18 / 03 / 2026', sessionTitle: '(Pro-docking)', time: '01 : 32 P.M.' },
  { id: 'fz-2', date: '18 / 03 / 2026', sessionTitle: '(Pro-docking)', time: '02 : 15 P.M.' },
  { id: 'fz-3', date: '18 / 03 / 2026', sessionTitle: '(Pro-docking)', time: '03 : 00 P.M.' },
  { id: 'fz-4', date: '18 / 03 / 2026', sessionTitle: '(Pro-docking)', time: '03 : 45 P.M.' },
  { id: 'fz-5', date: '18 / 03 / 2026', sessionTitle: '(Pro-docking)', time: '04 : 30 P.M.' },
  { id: 'fz-6', date: '18 / 03 / 2026', sessionTitle: '(Pro-docking)', time: '05 : 15 P.M.' },
];

export const INITIAL_FOCUS_HISTORY: FocusHistoryItem[] = [
  { id: 'fh-1', day: '18 / 03 / 2026 (Wednesday)', focused: '02 : 04 Hr (Focused)', timings: '10:20 - 04:34 PM' },
  { id: 'fh-2', day: '19 / 03 / 2026 (Thursday)', focused: '03 : 15 Hr (Focused)', timings: '09:30 - 05:10 PM' },
  { id: 'fh-3', day: '20 / 03 / 2026 (Friday)', focused: '02 : 45 Hr (Focused)', timings: '10:00 - 04:00 PM' },
  { id: 'fh-4', day: '23 / 03 / 2026 (Monday)', focused: '04 : 21 Hr (Focused)', timings: '09:00 - 06:15 PM' },
  { id: 'fh-5', day: '24 / 03 / 2026 (Tuesday)', focused: '03 : 50 Hr (Focused)', timings: '10:15 - 05:30 PM' },
  { id: 'fh-6', day: '25 / 03 / 2026 (Wednesday)', focused: '02 : 40 Hr (Focused)', timings: '11:00 - 04:45 PM' },
  { id: 'fh-7', day: '26 / 03 / 2026 (Thursday)', focused: '03 : 10 Hr (Focused)', timings: '09:45 - 04:30 PM' },
];

export const INITIAL_EVENTS: CalendarEvent[] = getInitialCalendarEvents();
export const INITIAL_TASKS: Task[] = getInitialTasks();
