import React, { useState, useEffect } from 'react';
import { 
  Task, 
  CalendarEvent, 
  MainNavTab, 
  PriorityLevel, 
  TaskStatus 
} from './types';
import { INITIAL_TASKS, INITIAL_EVENTS } from './data/initialData';
import { audioManager } from './utils/audioUtils';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GoogleLoginScreen } from './components/auth/GoogleLoginScreen';

import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';

import { DashboardView } from './components/views/DashboardView';
import { ProjectView } from './components/views/ProjectView';
import { TaskroningView } from './components/views/TaskroningView';
import { AnalystixView } from './components/views/AnalystixView';
import { FocusModeView } from './components/views/FocusModeView';
import { MonthlyCalendarView } from './components/views/MonthlyCalendarView';
import { AchievementsView } from './components/views/AchievementsView';
import { TaskroningAIView } from './components/views/TaskroningAIView';
import { ChatView } from './components/views/ChatView';
import { NotificationView } from './components/views/NotificationView';
import { ProfileView } from './components/views/ProfileView';

import { TaskModal } from './components/TaskModal';

const STORAGE_KEY_TASKS = 'taskroning_tasks_v2';
const STORAGE_KEY_EVENTS = 'taskroning_events_v2';

function AppContent() {
  const { isAuthenticated } = useAuth();

  // -------------------------------------------------------------
  // Persistent State Loading
  // -------------------------------------------------------------
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

  // Save to LocalStorage
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
  const [currentTab, setCurrentTab] = useState<MainNavTab>('dashboard');

  // Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [activeTaskForModal, setActiveTaskForModal] = useState<Task | null>(null);

  // If not authenticated with Google ID, strictly show Google Login Screen
  if (!isAuthenticated) {
    return <GoogleLoginScreen />;
  }

  // -------------------------------------------------------------
  // TASK CRUD & ACTIONS
  // -------------------------------------------------------------
  const handleOpenTaskModal = (task?: Task) => {
    setActiveTaskForModal(task || null);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (savedTask: Task) => {
    const exists = tasks.some(t => t.id === savedTask.id);
    if (exists) {
      setTasks(tasks.map(t => (t.id === savedTask.id ? savedTask : t)));
    } else {
      setTasks([savedTask, ...tasks]);
    }
    audioManager.playChime('neutral');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleToggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const isNowCompleted = t.status !== 'completed';
        if (isNowCompleted) {
          audioManager.playChime('success');
        }
        return {
          ...t,
          status: (isNowCompleted ? 'completed' : 'in_progress') as TaskStatus,
          progress: isNowCompleted ? 100 : (t.progress || 50),
          completedAt: isNowCompleted ? new Date().toISOString() : undefined,
        };
      }
      return t;
    }));
  };

  const handleToggleTaskStar = (taskId: string) => {
    setTasks(tasks.map(t => (t.id === taskId ? { ...t, isStarred: !t.isStarred } : t)));
  };

  return (
    <div className="flex h-screen w-screen bg-[#070C14] text-slate-100 overflow-hidden select-none font-sans">
      
      {/* 1. Left Vertical Dark Neon Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        unreadNotifsCount={2}
      />

      {/* 2. Main Content Stage */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header */}
        <TopHeader
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onOpenNewTask={() => handleOpenTaskModal()}
          unreadNotifsCount={2}
        />

        {/* Scrollable Views Container */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#070C14] via-[#080E17] to-[#070C14]">
          {currentTab === 'dashboard' && (
            <DashboardView
              tasks={tasks}
              events={events}
              onOpenTaskModal={handleOpenTaskModal}
              onSelectTab={setCurrentTab}
              onToggleTaskComplete={handleToggleTaskComplete}
              onToggleTaskStar={handleToggleTaskStar}
            />
          )}

          {(currentTab === 'project' || currentTab === 'project_updates') && (
            <ProjectView
              onSelectTab={setCurrentTab}
              onOpenTaskModal={() => handleOpenTaskModal()}
            />
          )}

          {currentTab === 'taskroning' && (
            <TaskroningView
              tasks={tasks}
              events={events}
              onOpenTaskModal={handleOpenTaskModal}
              onSelectTab={setCurrentTab}
              onToggleTaskComplete={handleToggleTaskComplete}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalystixView
              onSelectTab={setCurrentTab}
            />
          )}

          {currentTab === 'focus' && (
            <FocusModeView />
          )}

          {currentTab === 'calendar' && (
            <MonthlyCalendarView
              tasks={tasks}
              events={events}
              onOpenTaskModal={handleOpenTaskModal}
            />
          )}

          {currentTab === 'achievements' && (
            <AchievementsView />
          )}

          {currentTab === 'ai' && (
            <TaskroningAIView
              tasks={tasks}
              events={events}
            />
          )}

          {currentTab === 'chat' && (
            <ChatView />
          )}

          {currentTab === 'notification' && (
            <NotificationView
              onSelectTab={setCurrentTab}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileView
              onSelectTab={setCurrentTab}
            />
          )}
        </main>

      </div>

      {/* Task Creation & Editing Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSaveTask={handleSaveTask}
        onDeleteTask={handleDeleteTask}
        initialTask={activeTaskForModal}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

