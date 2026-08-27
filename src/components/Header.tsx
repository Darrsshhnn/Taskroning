import React from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckSquare, 
  Grid3X3, 
  Kanban, 
  ListFilter, 
  BarChart3, 
  Sparkles, 
  Timer, 
  Plus, 
  Search,
  CalendarSync,
  Layers
} from 'lucide-react';
import { MainViewTab } from '../types';

interface HeaderProps {
  currentTab: MainViewTab;
  onTabChange: (tab: MainViewTab) => void;
  onOpenNewTask: () => void;
  onOpenNewEvent: () => void;
  onOpenAIAssistant: () => void;
  onOpenFocusTimer: () => void;
  onOpenCalendarSync: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  taskCount: { total: number; pending: number; today: number };
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenNewTask,
  onOpenNewEvent,
  onOpenAIAssistant,
  onOpenFocusTimer,
  onOpenCalendarSync,
  searchQuery,
  onSearchChange,
  taskCount
}) => {
  const tabs: { id: MainViewTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'planner', label: "Daily Planner", icon: <Layers className="w-4 h-4" />, badge: taskCount.today },
    { id: 'calendar', label: 'Calendar', icon: <CalendarIcon className="w-4 h-4" /> },
    { id: 'matrix', label: 'Priority Matrix', icon: <Grid3X3 className="w-4 h-4" /> },
    { id: 'kanban', label: 'Kanban', icon: <Kanban className="w-4 h-4" /> },
    { id: 'list', label: 'All Tasks', icon: <ListFilter className="w-4 h-4" />, badge: taskCount.pending },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top tier: Brand & Main Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Product Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-bold">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">WorkFlowSync</h1>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                  Calendar + Tasks
                </span>
              </div>
              <p className="text-xs text-slate-400">Employee Daily Workflow & Schedule Orchestrator</p>
            </div>
          </div>

          {/* Search and Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="search-tasks-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search tasks, meetings, tags..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* AI Assistant */}
            <button
              id="header-ai-optimize-btn"
              onClick={onOpenAIAssistant}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
              title="AI Daily Schedule Optimizer & Standup Briefing"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">AI Optimizer</span>
            </button>

            {/* Focus Timer */}
            <button
              id="header-focus-timer-btn"
              onClick={onOpenFocusTimer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
              title="Open Pomodoro Focus Timer with ambient sounds"
            >
              <Timer className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Focus Timer</span>
            </button>

            {/* Calendar Sync */}
            <button
              id="header-sync-btn"
              onClick={onOpenCalendarSync}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Sync or Import/Export iCal (.ics) Calendar"
            >
              <CalendarSync className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Sync</span>
            </button>

            {/* New Event Button */}
            <button
              id="header-new-event-btn"
              onClick={onOpenNewEvent}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Event</span>
            </button>

            {/* New Task Button */}
            <button
              id="header-new-task-btn"
              onClick={onOpenNewTask}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm shadow-indigo-600/30 rounded-lg transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Bottom tier: View Navigation Tabs */}
        <div className="mt-3 flex items-center space-x-1 border-t border-slate-800/80 pt-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-nav-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-semibold ${
                    isActive ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
