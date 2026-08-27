import { Task, CalendarEvent } from '../types';
import { getTodayKey, formatDateKey } from '../utils/dateUtils';

export function getInitialCalendarEvents(): CalendarEvent[] {
  const today = new Date();
  const todayKey = getTodayKey();

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowKey = formatDateKey(tomorrow);

  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);
  const dayAfterKey = formatDateKey(dayAfter);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterday);

  return [
    {
      id: 'ev-1',
      title: 'Engineering Daily Standup',
      description: 'Quick 15-min sync on sprint blockers, PR reviews, and daily goals.',
      date: todayKey,
      startTime: '09:30',
      endTime: '09:45',
      category: 'standup',
      color: '#3b82f6', // blue
      locationOrUrl: 'https://meet.google.com/eng-standup',
      attendees: ['Alex Morgan', 'Sarah Chen', 'Dev Team'],
      recurring: 'weekdays',
      reminderMinutes: 10,
    },
    {
      id: 'ev-2',
      title: 'Q3 Product Roadmap & Milestone Review',
      description: 'Review high-level timelines, feature dependencies, and deadline commitments.',
      date: todayKey,
      startTime: '11:00',
      endTime: '12:00',
      category: 'meeting',
      color: '#8b5cf6', // purple
      locationOrUrl: 'Conference Room B / Google Meet',
      attendees: ['Product Leads', 'Tech Leads', 'Design Directors'],
      reminderMinutes: 15,
    },
    {
      id: 'ev-3',
      title: 'Deep Work: Focused Architecture Design',
      description: 'Protected calendar focus block for database indexing and latency optimization.',
      date: todayKey,
      startTime: '13:30',
      endTime: '15:00',
      category: 'deep_work',
      color: '#10b981', // emerald
      locationOrUrl: 'Do Not Disturb / Desk',
      reminderMinutes: 5,
    },
    {
      id: 'ev-4',
      title: 'Enterprise Client Architecture Sync',
      description: 'Demonstrating single sign-on integration and webhook security specs.',
      date: todayKey,
      startTime: '16:00',
      endTime: '16:45',
      category: 'client_call',
      color: '#f59e0b', // amber
      locationOrUrl: 'https://meet.google.com/client-sync-492',
      attendees: ['Acme Corp Solutions Architect', 'Account Exec'],
      reminderMinutes: 15,
    },
    {
      id: 'ev-5',
      title: 'Weekly 1-on-1 with Engineering Manager',
      description: 'Career growth, workload balance, feedback and upcoming quarterly goals.',
      date: tomorrowKey,
      startTime: '10:00',
      endTime: '10:45',
      category: 'review',
      color: '#06b6d4', // cyan
      locationOrUrl: 'https://meet.google.com/mgr-1on1',
      attendees: ['Elena Rostova (EM)'],
      recurring: 'weekly',
      reminderMinutes: 15,
    },
    {
      id: 'ev-6',
      title: 'Design System & Accessibility Critique',
      description: 'Reviewing WCAG 2.1 AA color contrast updates and responsive drawer interactions.',
      date: tomorrowKey,
      startTime: '14:00',
      endTime: '15:00',
      category: 'meeting',
      color: '#ec4899', // pink
      locationOrUrl: 'Design Lab / Virtual',
      attendees: ['UX Team', 'Design Guild'],
      reminderMinutes: 10,
    },
    {
      id: 'ev-7',
      title: 'Sprint Demo & Retrospective',
      description: 'Review completed deliverables and identify process bottlenecks.',
      date: dayAfterKey,
      startTime: '15:00',
      endTime: '16:30',
      category: 'review',
      color: '#6366f1', // indigo
      locationOrUrl: 'Town Hall Room / Zoom',
      attendees: ['All Hands Engineering'],
      reminderMinutes: 15,
    },
    {
      id: 'ev-8',
      title: 'Cross-functional Product Sync',
      description: 'Aligning on customer onboarding metrics and release train schedule.',
      date: yesterdayKey,
      startTime: '14:00',
      endTime: '15:00',
      category: 'meeting',
      color: '#64748b',
    }
  ];
}

export function getInitialTasks(): Task[] {
  const today = new Date();
  const todayKey = getTodayKey();

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowKey = formatDateKey(tomorrow);

  const inThreeDays = new Date(today);
  inThreeDays.setDate(today.getDate() + 3);
  const inThreeDaysKey = formatDateKey(inThreeDays);

  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const nextWeekKey = formatDateKey(nextWeek);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterday);

  return [
    {
      id: 'task-1',
      title: 'Finalize Auth API Security Patch & Token Refresh',
      description: 'Resolve session token edge-case expiration and apply rate-limiting headers for production compliance.',
      priority: 'p1_urgent',
      status: 'in_progress',
      category: 'Engineering',
      dueDate: todayKey,
      dueTime: '17:00',
      estimatedMinutes: 60,
      energyLevel: 'high_focus',
      timeBlock: {
        date: todayKey,
        startTime: '10:00',
        endTime: '11:00',
      },
      subtasks: [
        { id: 'st-1-1', title: 'Audit JWT token payload expiration logic', completed: true, estimatedMinutes: 15 },
        { id: 'st-1-2', title: 'Implement Redis token blocklist verification', completed: true, estimatedMinutes: 25 },
        { id: 'st-1-3', title: 'Add regression tests for concurrency edge cases', completed: false, estimatedMinutes: 20 },
      ],
      tags: ['Security', 'Backend', 'Release-Critical'],
      createdAt: yesterdayKey,
      isStarred: true,
      pomodoroCount: 2,
    },
    {
      id: 'task-2',
      title: 'Prepare Technical Slides for Enterprise Client Sync',
      description: 'Draft diagrams showing SSO SAML flow and role-based permissions matrix for the 4 PM meeting.',
      priority: 'p1_urgent',
      status: 'scheduled',
      category: 'Client',
      dueDate: todayKey,
      dueTime: '15:30',
      estimatedMinutes: 45,
      energyLevel: 'high_focus',
      timeBlock: {
        date: todayKey,
        startTime: '15:00',
        endTime: '15:45',
      },
      subtasks: [
        { id: 'st-2-1', title: 'Export high-res architecture dataflow diagram', completed: true, estimatedMinutes: 15 },
        { id: 'st-2-2', title: 'Highlight enterprise SLA guarantees & failover logic', completed: false, estimatedMinutes: 30 },
      ],
      tags: ['Client', 'Architecture', 'Demo'],
      createdAt: yesterdayKey,
      isStarred: true,
    },
    {
      id: 'task-3',
      title: 'Benchmark PostgreSQL Query Indexing for Dashboard Analytics',
      description: 'Optimize high-traffic metrics aggregation query from 420ms down to under 45ms using composite B-tree indexes.',
      priority: 'p2_high',
      status: 'in_progress',
      category: 'Engineering',
      dueDate: tomorrowKey,
      dueTime: '18:00',
      estimatedMinutes: 90,
      energyLevel: 'high_focus',
      timeBlock: {
        date: todayKey,
        startTime: '13:30',
        endTime: '15:00',
      },
      subtasks: [
        { id: 'st-3-1', title: 'Run EXPLAIN ANALYZE on slow query execution paths', completed: true, estimatedMinutes: 20 },
        { id: 'st-3-2', title: 'Generate migration script for partial index on active tenant records', completed: false, estimatedMinutes: 40 },
        { id: 'st-3-3', title: 'Validate memory impact on staging cluster', completed: false, estimatedMinutes: 30 },
      ],
      tags: ['Database', 'Performance', 'Backend'],
      createdAt: todayKey,
    },
    {
      id: 'task-4',
      title: 'Audit WCAG 2.1 AA Contrast Ratios in Dark Mode Theme',
      description: 'Ensure all primary buttons, neutral borders, and secondary text labels meet 4.5:1 minimum contrast ratios.',
      priority: 'p2_high',
      status: 'backlog',
      category: 'Design',
      dueDate: tomorrowKey,
      dueTime: '16:00',
      estimatedMinutes: 45,
      energyLevel: 'medium',
      subtasks: [
        { id: 'st-4-1', title: 'Run automated Axe accessibility scan on all applet routes', completed: false, estimatedMinutes: 15 },
        { id: 'st-4-2', title: 'Adjust slate-400 muted text tokens in Tailwind config', completed: false, estimatedMinutes: 30 },
      ],
      tags: ['Accessibility', 'DesignSystem', 'UI'],
      createdAt: todayKey,
    },
    {
      id: 'task-5',
      title: 'Review Pull Request #418: Webhook Retry Exponential Backoff',
      description: 'Examine jitter algorithm, dead-letter queue routing, and unit test coverage for third-party webhook dispatcher.',
      priority: 'p3_medium',
      status: 'in_review',
      category: 'Engineering',
      dueDate: todayKey,
      dueTime: '17:30',
      estimatedMinutes: 30,
      energyLevel: 'medium',
      subtasks: [
        { id: 'st-5-1', title: 'Review code diff & verify error handling edge cases', completed: true, estimatedMinutes: 15 },
        { id: 'st-5-2', title: 'Post constructive PR feedback and approve workflow', completed: false, estimatedMinutes: 15 },
      ],
      tags: ['CodeReview', 'Reliability'],
      createdAt: todayKey,
    },
    {
      id: 'task-6',
      title: 'Consolidate Weekly Productivity & Sprint Velocity Metrics',
      description: 'Compile completed epics, burndown velocity, and team capacity estimates for Friday sprint retrospective.',
      priority: 'p3_medium',
      status: 'backlog',
      category: 'Product',
      dueDate: inThreeDaysKey,
      estimatedMinutes: 40,
      energyLevel: 'quick_win',
      subtasks: [
        { id: 'st-6-1', title: 'Export Jira/Linear completed story point summary', completed: false, estimatedMinutes: 15 },
        { id: 'st-6-2', title: 'Draft key wins and friction areas for team review', completed: false, estimatedMinutes: 25 },
      ],
      tags: ['Sprint', 'Metrics', 'Agile'],
      createdAt: todayKey,
    },
    {
      id: 'task-7',
      title: 'Draft Q4 Infrastructure Cost Optimization Proposal',
      description: 'Analyze Cloud Run auto-scaling metrics, idle container timeouts, and reserve instance savings potential.',
      priority: 'p4_low',
      status: 'backlog',
      category: 'Operations',
      dueDate: nextWeekKey,
      estimatedMinutes: 90,
      energyLevel: 'medium',
      subtasks: [
        { id: 'st-7-1', title: 'Pull 30-day GCP billing report breakdown by SKU', completed: false, estimatedMinutes: 30 },
        { id: 'st-7-2', title: 'Calculate projected 18% savings with committed use discounts', completed: false, estimatedMinutes: 60 },
      ],
      tags: ['Cloud', 'DevOps', 'Budget'],
      createdAt: todayKey,
    },
    {
      id: 'task-8',
      title: 'Update Team Onboarding Documentation for Environment Setup',
      description: 'Add instructions for Docker container bootstrapping and local environment secrets management.',
      priority: 'p4_low',
      status: 'completed',
      category: 'Operations',
      dueDate: yesterdayKey,
      estimatedMinutes: 30,
      energyLevel: 'quick_win',
      subtasks: [
        { id: 'st-8-1', title: 'Update README setup steps for Node 22 runtime', completed: true, estimatedMinutes: 15 },
        { id: 'st-8-2', title: 'Verify npm script execution on fresh clone', completed: true, estimatedMinutes: 15 },
      ],
      tags: ['Docs', 'Onboarding'],
      createdAt: yesterdayKey,
      completedAt: yesterdayKey,
      pomodoroCount: 1,
    }
  ];
}

export const INITIAL_EVENTS: CalendarEvent[] = getInitialCalendarEvents();
export const INITIAL_TASKS: Task[] = getInitialTasks();

