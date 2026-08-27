import React, { useState } from 'react';
import { 
  Task, 
  CalendarEvent, 
  AIScheduleOptimization 
} from '../types';
import { getTodayKey, formatTime12h, formatReadableDate } from '../utils/dateUtils';
import { 
  X, 
  Sparkles, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Copy, 
  Check, 
  AlertTriangle, 
  Clock, 
  Zap, 
  Layers, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  events: CalendarEvent[];
  currentDateKey: string;
  onApplyScheduleOptimization: (optimizations: AIScheduleOptimization['timeBlocks']) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  tasks,
  events,
  currentDateKey,
  onApplyScheduleOptimization,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'schedule' | 'standup' | 'risks'>('schedule');
  
  // Schedule Optimizer State
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<AIScheduleOptimization | null>(null);
  const [applied, setApplied] = useState(false);

  // Standup Generator State
  const [isGeneratingStandup, setIsGeneratingStandup] = useState(false);
  const [standupData, setStandupData] = useState<{
    yesterdayCompleted: string[];
    todayPlan: string[];
    blockers: string[];
    meetingNotes: string[];
    summaryText: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Schedule Optimizer API call
  const handleRunOptimizer = async () => {
    setIsOptimizing(true);
    setApplied(false);
    try {
      const res = await fetch('/api/ai/optimize-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: currentDateKey,
          tasks,
          events,
          workHours: { start: '08:30', end: '18:00' },
        }),
      });
      const data = await res.json();
      setOptimizationResult(data);
    } catch (e) {
      console.error('Schedule optimization error:', e);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Standup Briefing API call
  const handleGenerateStandup = async () => {
    setIsGeneratingStandup(true);
    try {
      const res = await fetch('/api/ai/standup-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: currentDateKey,
          tasks,
          events,
        }),
      });
      const data = await res.json();
      setStandupData(data);
    } catch (e) {
      console.error('Standup generation error:', e);
    } finally {
      setIsGeneratingStandup(false);
    }
  };

  // Apply timeblocks
  const handleApply = () => {
    if (!optimizationResult || !optimizationResult.timeBlocks) return;
    onApplyScheduleOptimization(optimizationResult.timeBlocks);
    setApplied(true);
  };

  // Copy standup to clipboard
  const handleCopyStandup = () => {
    if (!standupData) return;
    const text = `📋 Daily Standup - ${formatReadableDate(currentDateKey)}\n\n` +
      `✅ Yesterday / Completed:\n${standupData.yesterdayCompleted.map(i => `• ${i}`).join('\n') || '• Wrapped up prior sprints'}\n\n` +
      `🎯 Today's Focus:\n${standupData.todayPlan.map(i => `• ${i}`).join('\n') || '• No priority items'}\n\n` +
      `⚠️ Blockers & Risks:\n${standupData.blockers.map(i => `• ${i}`).join('\n') || '• None'}\n\n` +
      `📅 Key Meetings:\n${standupData.meetingNotes.map(i => `• ${i}`).join('\n') || '• No external calls'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Productivity Orchestrator</h2>
              <p className="text-xs text-slate-400">Time-blocking, schedule optimization & standup briefing engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 pt-2">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'schedule'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Schedule Optimizer</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('standup');
              if (!standupData) handleGenerateStandup();
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'standup'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Daily Standup Briefing</span>
          </button>

          <button
            onClick={() => setActiveTab('risks')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'risks'
                ? 'border-rose-400 text-rose-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Workload & Deadlines</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* ================= TAB 1: SCHEDULE OPTIMIZER ================= */}
          {activeTab === 'schedule' && (
            <div className="space-y-5">
              <div className="bg-slate-800/60 border border-slate-700/80 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Smart Time-Block Optimizer</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Analyzes calendar gaps, deadlines, priorities, and cognitive energy to structure an optimal day.
                  </p>
                </div>
                <button
                  onClick={handleRunOptimizer}
                  disabled={isOptimizing}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 disabled:opacity-50 shadow-md shadow-amber-500/20 transition cursor-pointer flex-shrink-0"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
                  <span>{isOptimizing ? 'Analyzing Schedule...' : 'Generate Optimized Plan'}</span>
                </button>
              </div>

              {optimizationResult && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Summary & Suggestions */}
                  <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>AI Schedule Rationale & Workflow Strategy</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {optimizationResult.dailySummary}
                    </p>
                    {optimizationResult.scheduleSuggestions && (
                      <ul className="list-disc list-inside text-xs text-slate-400 space-y-0.5 pt-1">
                        {optimizationResult.scheduleSuggestions.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Proposed Time Blocks */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Generated Focus Windows ({optimizationResult.timeBlocks.length} Task Slots)
                      </h4>
                      <span className="text-xs text-slate-400 font-mono">
                        Target Date: {currentDateKey}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {optimizationResult.timeBlocks.map((block, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-lg flex items-center justify-between"
                        >
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-slate-200">{block.taskTitle}</div>
                            <div className="text-[11px] text-slate-400">{block.reasoning}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-mono font-bold text-emerald-400">
                              {formatTime12h(block.startTime)} - {formatTime12h(block.endTime)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 1-Click Apply */}
                  <div className="pt-3 flex items-center justify-end gap-3">
                    <button
                      onClick={handleApply}
                      disabled={applied}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                        applied
                          ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{applied ? '✓ Schedule Applied to Calendar!' : 'Apply Time-Blocks to Calendar'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: STANDUP BRIEFING ================= */}
          {activeTab === 'standup' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Daily Standup Briefing</h3>
                  <p className="text-xs text-slate-400">Automatically drafted from your task completion and calendar agenda</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerateStandup}
                    disabled={isGeneratingStandup}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition cursor-pointer"
                  >
                    {isGeneratingStandup ? 'Refreshing...' : 'Regenerate'}
                  </button>
                  {standupData && (
                    <button
                      onClick={handleCopyStandup}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                    </button>
                  )}
                </div>
              </div>

              {standupData ? (
                <div className="space-y-3 p-4 bg-slate-800/60 border border-slate-700 rounded-xl">
                  {/* Summary Text */}
                  {standupData.summaryText && (
                    <p className="text-xs text-slate-300 italic border-b border-slate-700 pb-3">
                      "{standupData.summaryText}"
                    </p>
                  )}

                  {/* Section 1: Completed / Yesterday */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Yesterday / Completed</span>
                    </h4>
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-1">
                      {standupData.yesterdayCompleted.length > 0 ? (
                        standupData.yesterdayCompleted.map((item, i) => <li key={i}>{item}</li>)
                      ) : (
                        <li className="text-slate-500">No completed tasks recorded in previous window</li>
                      )}
                    </ul>
                  </div>

                  {/* Section 2: Today's Plan */}
                  <div className="space-y-1 pt-2">
                    <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Today's Focus & Deliverables</span>
                    </h4>
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-1">
                      {standupData.todayPlan.length > 0 ? (
                        standupData.todayPlan.map((item, i) => <li key={i}>{item}</li>)
                      ) : (
                        <li className="text-slate-500">No priority tasks scheduled for today</li>
                      )}
                    </ul>
                  </div>

                  {/* Section 3: Blockers */}
                  <div className="space-y-1 pt-2">
                    <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Risks & Blockers</span>
                    </h4>
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-1">
                      {standupData.blockers.length > 0 ? (
                        standupData.blockers.map((item, i) => <li key={i}>{item}</li>)
                      ) : (
                        <li className="text-slate-400">None identified</li>
                      )}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs">
                  <p>Click Generate to compile your automated standup briefing.</p>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 3: WORKLOAD RISKS ================= */}
          {activeTab === 'risks' && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">Workload Health & Risk Radar</h3>
                <p className="text-xs text-slate-400">Cognitive overload detection and deadline buffer analysis</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span>Meeting Load Distribution</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    You have {events.filter(e => e.date === currentDateKey).length} commitments scheduled today. 
                    Ensure at least a 2-hour contiguous deep work block is protected before 2:00 PM for peak cognitive efficiency.
                  </p>
                </div>

                <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Eisenhower Balance</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {tasks.filter(t => t.priority === 'p1_urgent' && t.status !== 'completed').length} Urgent (P1) tasks active.
                    Dedicate initial morning hours strictly to these items before opening async communication channels.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
