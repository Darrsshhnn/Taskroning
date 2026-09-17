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
import { TaskroningLogo } from './components/TaskroningLogo';
import { 
  subscribeToUserTasks, 
  saveUserTask, 
  deleteUserTask, 
  toggleUserTaskCompletion 
} from './services/taskService';

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
import { AdminView } from './components/views/AdminView';

import { TaskModal } from './components/TaskModal';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const { isAuthenticated, isLoading, firebaseUser, isAdmin } = useAuth();

  // -------------------------------------------------------------
  // Persistent Task & Event State from Firestore
  // -------------------------------------------------------------
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);

  // Main UI Navigation State with URL / hash detection
  const [currentTab, setCurrentTab] = useState<MainNavTab>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || hash === '#admin') return 'admin';
      if (path === '/profile' || hash === '#profile') return 'profile';
      if (path === '/calendar' || hash === '#calendar') return 'calendar';
      if (path === '/tasks' || hash === '#tasks') return 'taskroning';
    }
    return 'dashboard';
  });

  // Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [activeTaskForModal, setActiveTaskForModal] = useState<Task | null>(null);
  const [modalDefaultDueDate, setModalDefaultDueDate] = useState<string | undefined>(undefined);

  // Subscribe to real-time user tasks from Firestore
  useEffect(() => {
    if (!firebaseUser?.uid) return;

    const unsubscribe = subscribeToUserTasks(
      firebaseUser.uid,
      (userTasks) => {
        setTasks(userTasks);
      },
      (error) => {
        console.warn('Firestore tasks subscription error:', error);
      }
    );

    return () => unsubscribe();
  }, [firebaseUser?.uid]);

  // Handle URL change / back button navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || hash === '#admin') setCurrentTab('admin');
      else if (path === '/profile' || hash === '#profile') setCurrentTab('profile');
      else if (path === '/calendar' || hash === '#calendar') setCurrentTab('calendar');
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Show clean cyber loading screen while Firebase verifies persisted session
  if (isLoading) {
    return (
      <div className="min-h-screen w-screen bg-[#060B12] text-slate-100 flex flex-col items-center justify-center space-y-4 select-none">
        <div className="relative p-4 rounded-2xl bg-[#091524] border border-cyan-500/40 shadow-[0_0_30px_rgba(0,245,196,0.3)] animate-pulse">
          <TaskroningLogo className="w-16 h-16" />
        </div>
        <div className="flex items-center gap-2.5 text-cyan-400 text-xs font-mono">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
          <span>Synchronizing Security Context...</span>
        </div>
      </div>
    );
  }

  // If not authenticated with real Google account, show Google Sign-In screen
  if (!isAuthenticated) {
    return <GoogleLoginScreen />;
  }

  // -------------------------------------------------------------
  // TASK CRUD & ACTIONS (Persisting directly to Cloud Firestore)
  // -------------------------------------------------------------
  const handleOpenTaskModal = (task?: Task, defaultDueDate?: string) => {
    setActiveTaskForModal(task || null);
    setModalDefaultDueDate(defaultDueDate);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (savedTask: Task) => {
    if (!firebaseUser?.uid) return;
    
    // Optimistic local update
    const exists = tasks.some(t => t.id === savedTask.id);
    if (exists) {
      setTasks(tasks.map(t => (t.id === savedTask.id ? savedTask : t)));
    } else {
      setTasks([savedTask, ...tasks]);
    }
    audioManager.playChime('neutral');

    // Cloud Firestore persistence
    try {
      await saveUserTask(firebaseUser.uid, savedTask);
    } catch (err) {
      console.error('Error saving task to Firestore:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!firebaseUser?.uid) return;

    // Optimistic update
    setTasks(tasks.filter(t => t.id !== taskId));

    // Cloud Firestore deletion
    try {
      await deleteUserTask(firebaseUser.uid, taskId);
    } catch (err) {
      console.error('Error deleting task from Firestore:', err);
    }
  };

  const handleToggleTaskComplete = async (taskId: string) => {
    if (!firebaseUser?.uid) return;

    const target = tasks.find(t => t.id === taskId);
    if (!target) return;

    const isNowCompleted = target.status !== 'completed';
    if (isNowCompleted) {
      audioManager.playChime('success');
    }

    // Optimistic update
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: (isNowCompleted ? 'completed' : 'in_progress') as TaskStatus,
          progress: isNowCompleted ? 100 : (t.progress || 50),
          completedAt: isNowCompleted ? new Date().toISOString() : undefined,
        };
      }
      return t;
    }));

    // Cloud Firestore toggle
    try {
      await toggleUserTaskCompletion(firebaseUser.uid, target);
    } catch (err) {
      console.error('Error toggling task completion in Firestore:', err);
    }
  };

  const handleToggleTaskStar = async (taskId: string) => {
    if (!firebaseUser?.uid) return;

    const target = tasks.find(t => t.id === taskId);
    if (!target) return;

    const updatedTask = { ...target, isStarred: !target.isStarred };

    // Optimistic update
    setTasks(tasks.map(t => (t.id === taskId ? updatedTask : t)));

    // Cloud Firestore save
    try {
      await saveUserTask(firebaseUser.uid, updatedTask);
    } catch (err) {
      console.error('Error updating task star in Firestore:', err);
    }
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
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="h-full"
          >
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
                onToggleTaskComplete={handleToggleTaskComplete}
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

            {currentTab === 'admin' && (
              <AdminView />
            )}
          </motion.div>
        </main>

      </div>

      {/* Task Creation & Editing Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSaveTask={handleSaveTask}
        onDeleteTask={handleDeleteTask}
        initialTask={activeTaskForModal}
        defaultDueDate={modalDefaultDueDate}
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
