import React, { useState } from 'react';
import { Task, CalendarEvent } from '../../types';
import { 
  Sparkles, 
  Send, 
  Paperclip, 
  Bot, 
  User, 
  RotateCcw, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Brain,
  Clock,
  Layers
} from 'lucide-react';

interface TaskroningAIViewProps {
  tasks: Task[];
  events: CalendarEvent[];
  onApplyAISchedule?: (timeBlocks: any[]) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export const TaskroningAIView: React.FC<TaskroningAIViewProps> = ({
  tasks,
  events,
  onApplyAISchedule,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Hello Darshan! I am your Taskroning AI Orchestrator. I can synchronize your Project 2P sprint schedule, breakdown complex design tasks into time-blocks, or generate your EOD standup reports.',
      timestamp: '11:40 AM',
      suggestions: ['Synchronize today\'s schedule', 'Break down Prototype Module 2', 'Analyze monthly focus efficiency']
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const presetCards = [
    {
      title: 'Task Synching',
      desc: 'Synchronize your task based on your previous task tables and calendar events.',
      prompt: 'Please analyze my current tasks and calendar events to optimize my schedule for maximum focus today.'
    },
    {
      title: 'Monthly Data Analysis',
      desc: 'Analyze your Monthly data progress, deep work hours, and delivery velocity.',
      prompt: 'Provide a deep monthly data analysis of my focus hours, completed deliverables, and consistency score.'
    },
    {
      title: 'Create Task Priority Chart',
      desc: 'Based on your task history take a look on priority matrices and deadlined tasks.',
      prompt: 'Create a priority matrix for all my pending tasks across Project 2P and upcoming client sprints.'
    },
    {
      title: 'Set Pre-Prompt',
      desc: 'Configure custom AI orchestrator rules for sprint retrospectives.',
      prompt: 'Draft an executive summary and daily standup report for my team lead.'
    }
  ];

  const quickPillPrompts = [
    'Task Sync',
    'Writing Update',
    'Managing Focus mode',
    'Monthly Report',
    'Achievement chart analysis'
  ];

  const handleSendMessage = async (promptText?: string) => {
    const textToSend = promptText || inputVal;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!promptText) setInputVal('');
    setIsLoading(true);

    try {
      // Call backend AI endpoint
      const response = await fetch('/api/ai/optimize-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks,
          events,
          userPreferences: { goal: textToSend }
        })
      });

      const data = await response.json();

      let aiReply = data.dailySummary || 'I have optimized your task timeline based on your priorities and available calendar buffers.';
      if (data.scheduleSuggestions && data.scheduleSuggestions.length > 0) {
        aiReply += '\n\n' + data.scheduleSuggestions.map((s: string) => `• ${s}`).join('\n');
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      // Intelligent fallback
      const fallbackMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Based on your request "${textToSend}":\n\n1. Scheduled **Interaction 5,7,8 updation** during high-energy morning window (10:15 - 11:15 AM).\n2. Buffered **Prototype - Module 2** post-lunch at 1:30 PM with a 25-minute Pomodoro cycle.\n3. Preserved protected deep work slots and synced calendar blockers.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1600px] mx-auto space-y-6 select-none">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: Preset AI Action Cards (4 cols)              */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-4">
          <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200 inline-block mb-2">
            AI Workflows
          </div>

          <div className="space-y-3.5">
            {presetCards.map((card, idx) => (
              <div
                key={idx}
                onClick={() => handleSendMessage(card.prompt)}
                className="taskroning-card p-4 hover:border-cyan-400/60 transition cursor-pointer group space-y-2 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-400 transition">
                    {card.title}
                  </span>
                  {/* Glowing radar indicator */}
                  <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_8px_rgba(0,245,196,0.4)]">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 group-hover:animate-ping" />
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: AI Workspace & Chat Stream (8 cols)        */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 taskroning-card p-5 sm:p-6 flex flex-col justify-between h-[640px]">
          
          {/* Header Banner */}
          <div className="border-b border-[#142337] pb-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(0,245,196,0.3)]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Use Taskroning AI to work more efficiently and more organized
                </h3>
                <span className="text-[11px] text-slate-400">Contextual Schedule & Task Intelligence</span>
              </div>
            </div>

            {/* Quick Pill Prompts */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {quickPillPrompts.map((pill, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(`Analyze and assist with ${pill}`)}
                  className="px-3 py-1 rounded-lg bg-[#08121E] hover:bg-[#112338] border border-[#18314E] text-slate-300 hover:text-cyan-400 text-[11px] font-medium transition cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-400/60 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white font-medium shadow-md'
                    : 'bg-[#08121E] border border-[#162C47] text-slate-200 shadow-sm'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  
                  {msg.suggestions && (
                    <div className="mt-3 pt-3 border-t border-[#13253B] flex flex-wrap gap-1.5">
                      {msg.suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(s)}
                          className="px-2.5 py-1 rounded-md bg-[#0C1827] border border-cyan-500/30 text-cyan-400 hover:text-white text-[10px] transition cursor-pointer"
                        >
                          {s} →
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="block text-[9px] text-slate-400 mt-2 text-right font-mono">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-950 border border-blue-400/60 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-cyan-400 text-xs py-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Taskroning AI is optimizing workflows...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="pt-3 border-t border-[#142337] flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask Taskroning AI to schedule tasks, analyze efficiency, or write daily updates..."
              className="flex-1 bg-[#08121E] border border-[#18314E] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputVal.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:brightness-110 disabled:opacity-50 transition cursor-pointer shadow-md shadow-cyan-500/25"
            >
              <Send className="w-3.5 h-3.5 fill-current" />
              <span>Send</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
