import React, { useState, useEffect } from 'react';
import { 
  Task, 
  CalendarEvent, 
  MainViewTab, 
  PriorityLevel, 
  TaskStatus, 
  AIScheduleOptimization 
} from './types';
import { INITIAL_TASKS, INITIAL_EVENTS } from './data/initialData';
import { getTodayKey, isDueToday } from './utils/dateUtils';
import confetti from 'canvas-confetti';
import { audioManager } from './utils/audioUtils';

import { Header } from './components/Header';
import { DailyPlanner } from './components/DailyPlanner';
import { CalendarView } from './components/CalendarView';
import { PriorityMatrix } from './components/PriorityMatrix';
import { KanbanBoard } from './components/KanbanBoard';
import { TaskList } from './components/TaskList';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';

import { TaskModal } from './components/TaskModal';
import { EventModal } from './components/EventModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { FocusTimerModal } from './components/FocusTimerModal';
import { CalendarSyncModal } from './components/CalendarSyncModal';

const STORAGE_KEY_TASKS = 'workflowsync_tasks_v1';
const STORAGE_KEY_EVENTS = 'workflowsync_events_v1';

export default function App() {
  // Persistence Loading
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EVENTS);
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  // Save to LocalStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [events]);

  // Main UI Navigation State
  const [currentTab, setCurrentTab] = useState<MainViewTab>('planner');
  const [currentDateKey, setCurrentDateKey] = useState<string>(getTodayKey());
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [activeTaskForModal, setActiveTaskForModal] = useState<Task | null>(null);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [activeEventForModal, setActiveEventForModal] = useState<CalendarEvent | null>(null);
  const [initialEventDate, setInitialEventDate] = useState<string | undefined>();
  const [initialEventStartTime, setInitialEventStartTime] = useState<string | undefined>();

  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isFocusTimerOpen, setIsFocusTimerOpen] = useState(false);
  const [focusTimerTask, setFocusTimerTask] = useState<Task | null>(null);

  const [isCalendarSyncOpen, setIsCalendarSyncOpen] = useState(false);

  // -------------------------------------------------------------
  // TASK CRUD & ACTIONS
  // -------------------------------------------------------------
  const handleSaveTask = (savedTask: Task) => {
    const exists = tasks.some(t => t.id === savedTask.id);
    if (exists) {
      setTasks(tasks.map(t => (t.id === savedTask.id ? savedTask : t)));
    } else {
      setTasks([savedTask, ...tasks]);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleToggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const isNowCompleted = t.status !== 'completed';
        if (isNowCompleted) {
          // Play celebratory audio chime & trigger confetti
          audioManager.playChime();
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 },
            });
          } catch (e) {
            console.log(e);
          }
        }
        return {
          ...t,
          status: isNowCompleted ? 'completed' : 'in_progress',
          completedAt: isNowCompleted ? getTodayKey() : undefined,
        };
      }
      return t;
    }));
  };

  const handleToggleTaskStar = (taskId: string) => {
    setTasks(tasks.map(t => (t.id === taskId ? { ...t, isStarred: !t.isStarred } : t)));
  };

  const handleChangeTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(t => (t.id === taskId ? { ...t, status: newStatus } : t)));
  };

  const handleChangeTaskPriority = (taskId: string, newPriority: PriorityLevel) => {
    setTasks(tasks.map(t => (t.id === taskId ? { ...t, priority: newPriority } : t)));
  };

  const handleTimeBlockTask = (taskId: string, date: string, startTime: string, endTime: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: t.status === 'backlog' ? 'scheduled' : t.status,
          timeBlock: { date, startTime, endTime },
        };
      }
      return t;
    }));
  };

  const handleRecordPomodoro = (taskId: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          pomodoroCount: (t.pomodoroCount || 0) + 1,
        };
      }
      return t;
    }));
  };

  // -------------------------------------------------------------
  // EVENT CRUD & ACTIONS
  // -------------------------------------------------------------
  const handleSaveEvent = (savedEvent: CalendarEvent) => {
    const exists = events.some(e => e.id === savedEvent.id);
    if (exists) {
      setEvents(events.map(e => (e.id === savedEvent.id ? savedEvent : e)));
    } else {
      setEvents([...events, savedEvent]);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const handleImportEvents = (importedEvents: CalendarEvent[]) => {
    setEvents([...events, ...importedEvents]);
  };

  // -------------------------------------------------------------
  // AI OPTIMIZATION APPLICATION
  // -------------------------------------------------------------
  const handleApplyScheduleOptimization = (timeBlocks: AIScheduleOptimization['timeBlocks']) => {
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        const matchingBlock = timeBlocks.find(b => b.taskId === task.id || b.taskTitle === task.title);
        if (matchingBlock) {
          return {
            ...task,
            status: task.status === 'backlog' ? 'scheduled' : task.status,
            timeBlock: {
              date: currentDateKey,
              startTime: matchingBlock.startTime,
              endTime: matchingBlock.endTime,
            },
          };
        }
        return task;
      });
    });
  };

  // -------------------------------------------------------------
  // QUICK MODAL OPENERS
  // -------------------------------------------------------------
  const handleOpenNewTask = () => {
    setActiveTaskForModal(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenNewTaskWithPriority = (priority: PriorityLevel) => {
    setActiveTaskForModal({
      id: `task-${Date.now()}`,
      title: '',
      description: '',
      priority,
      status: 'backlog',
      category: 'Engineering',
      dueDate: currentDateKey,
      estimatedMinutes: 45,
      energyLevel: 'high_focus',
      subtasks: [],
      createdAt: getTodayKey(),
    });
    setIsTaskModalOpen(true);
  };

  const handleOpenNewTaskWithStatus = (status: TaskStatus) => {
    setActiveTaskForModal({
      id: `task-${Date.now()}`,
      title: '',
      description: '',
      priority: 'p2_high',
      status,
      category: 'Engineering',
      dueDate: currentDateKey,
      estimatedMinutes: 45,
      energyLevel: 'medium',
      subtasks: [],
      createdAt: getTodayKey(),
    });
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setActiveTaskForModal(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenNewEvent = (initialDate?: string, initialStartTime?: string) => {
    setActiveEventForModal(null);
    setInitialEventDate(initialDate || currentDateKey);
    setInitialEventStartTime(initialStartTime || '10:00');
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (event: CalendarEvent) => {
    setActiveEventForModal(event);
    setIsEventModalOpen(true);
  };

  const handleStartFocusOnTask = (task: Task) => {
    setFocusTimerTask(task);
    setIsFocusTimerOpen(true);
  };

  // Metrics summary
  const taskCounts = {
    total: tasks.length,
    pending: tasks.filter(t => t.status !== 'completed').length,
    today: tasks.filter(t => isDueToday(t.dueDate) && t.status !== 'completed').length,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Header with Navigation and Quick Actions */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenNewTask={handleOpenNewTask}
        onOpenNewEvent={() => handleOpenNewEvent(currentDateKey)}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        onOpenFocusTimer={() => {
          setFocusTimerTask(null);
          setIsFocusTimerOpen(true);
        }}
        onOpenCalendarSync={() => setIsCalendarSyncOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        taskCount={taskCounts}
      />

      {/* Main View Body */}
      <main className="flex-1 pb-16">
        {currentTab === 'planner' && (
          <DailyPlanner
            currentDateKey={currentDateKey}
            onDateChange={setCurrentDateKey}
            tasks={tasks}
            events={events}
            onToggleTaskComplete={handleToggleTaskComplete}
            onOpenTaskModal={handleOpenEditTask}
            onOpenEventModal={handleOpenEditEvent}
            onTimeBlockTask={handleTimeBlockTask}
            onOpenNewTask={handleOpenNewTask}
            onOpenNewEvent={() => handleOpenNewEvent(currentDateKey)}
            onOpenAIOptimizer={() => setIsAIAssistantOpen(true)}
            onStartFocusOnTask={handleStartFocusOnTask}
          />
        )}

        {currentTab === 'calendar' && (
          <CalendarView
            currentDateKey={currentDateKey}
            onDateChange={setCurrentDateKey}
            events={events}
            tasks={tasks}
            onOpenEventModal={handleOpenEditEvent}
            onOpenTaskModal={handleOpenEditTask}
            onOpenNewEvent={handleOpenNewEvent}
          />
        )}

        {currentTab === 'matrix' && (
          <PriorityMatrix
            tasks={tasks}
            onToggleTaskComplete={handleToggleTaskComplete}
            onOpenTaskModal={handleOpenEditTask}
            onOpenNewTaskWithPriority={handleOpenNewTaskWithPriority}
            onChangeTaskPriority={handleChangeTaskPriority}
            onOpenFocusOnTask={handleStartFocusOnTask}
          />
        )}

        {currentTab === 'kanban' && (
          <KanbanBoard
            tasks={tasks}
            onToggleTaskComplete={handleToggleTaskComplete}
            onOpenTaskModal={handleOpenEditTask}
            onOpenNewTaskWithStatus={handleOpenNewTaskWithStatus}
            onChangeTaskStatus={handleChangeTaskStatus}
            onStartFocusOnTask={handleStartFocusOnTask}
          />
        )}

        {currentTab === 'list' && (
          <TaskList
            tasks={tasks}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleTaskComplete={handleToggleTaskComplete}
            onToggleTaskStar={handleToggleTaskStar}
            onDeleteTask={handleDeleteTask}
            onOpenTaskModal={handleOpenEditTask}
            onOpenNewTask={handleOpenNewTask}
            onStartFocusOnTask={handleStartFocusOnTask}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsDashboard
            tasks={tasks}
            events={events}
          />
        )}
      </main>

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        task={activeTaskForModal}
        onClose={() => {
          setIsTaskModalOpen(false);
          setActiveTaskForModal(null);
        }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />

      {/* Calendar Event Creation & Edit Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        event={activeEventForModal}
        tasks={tasks}
        initialDate={initialEventDate}
        initialStartTime={initialEventStartTime}
        onClose={() => {
          setIsEventModalOpen(false);
          setActiveEventForModal(null);
        }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />

      {/* AI Assistant Modal (Schedule Optimizer & Standup Briefing) */}
      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        tasks={tasks}
        events={events}
        currentDateKey={currentDateKey}
        onApplyScheduleOptimization={handleApplyScheduleOptimization}
      />

      {/* Pomodoro Focus Room Modal */}
      <FocusTimerModal
        isOpen={isFocusTimerOpen}
        onClose={() => {
          setIsFocusTimerOpen(false);
          setFocusTimerTask(null);
        }}
        tasks={tasks}
        initialTask={focusTimerTask}
        onCompleteTask={handleToggleTaskComplete}
        onRecordPomodoro={handleRecordPomodoro}
      />

      {/* Calendar Sync & ICS Export Modal */}
      <CalendarSyncModal
        isOpen={isCalendarSyncOpen}
        onClose={() => setIsCalendarSyncOpen(false)}
        events={events}
        tasks={tasks}
        onImportEvents={handleImportEvents}
      />

    </div>
  );
}
