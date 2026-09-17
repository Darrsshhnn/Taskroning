import React, { useState } from 'react';
import { 
  TimelinePhase, 
  DepartmentUpdate, 
  Task, 
  CalendarEvent, 
  MainNavTab 
} from '../../types';
import { 
  INITIAL_TIMELINE_PHASES, 
  INITIAL_DEPARTMENT_UPDATES, 
  INITIAL_CHAT_CONTACTS 
} from '../../data/initialData';
import { 
  ChevronDown, 
  Plus, 
  Lock, 
  Send, 
  MessageSquare, 
  Phone, 
  Video, 
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

interface ProjectViewProps {
  onSelectTab: (tab: MainNavTab) => void;
  onOpenTaskModal: () => void;
}

export const ProjectView: React.FC<ProjectViewProps> = ({
  onSelectTab,
  onOpenTaskModal,
}) => {
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [timelinePhases, setTimelinePhases] = useState<TimelinePhase[]>(INITIAL_TIMELINE_PHASES);
  const [departmentUpdates, setDepartmentUpdates] = useState<DepartmentUpdate[]>(INITIAL_DEPARTMENT_UPDATES);
  const [activeTab, setActiveTab] = useState<'timeline' | 'matrix'>('timeline');

  const daysHeader = [
    { num: 9, day: 'M' }, { num: 10, day: 'T' }, { num: 11, day: 'W' },
    { num: 12, day: 'T' }, { num: 13, day: 'F' }, { num: 14, day: 'S' },
    { num: 15, day: 'S' }, { num: 16, day: 'M' }, { num: 17, day: 'T' },
    { num: 18, day: 'W' }, { num: 19, day: 'T' }, { num: 20, day: 'F' },
    { num: 21, day: 'S' }, { num: 22, day: 'S' }, { num: 23, day: 'M' },
    { num: 24, day: 'T' }, { num: 25, day: 'W' }, { num: 26, day: 'T' }
  ];

  const projectTableUpdates = [
    { id: 1, task: 'Depth Research on XYZ', by: 'Client', date: '18/04 - 21/04', team: 'G1' },
    { id: 2, task: 'Depth Research on XYZ', by: 'Mithilesh - G2', date: '16/04 - 25/04', team: 'G2' },
    { id: 3, task: 'Depth Research on XYZ', by: 'Guru sir - G3', date: '15/04 - 24/04', team: 'G2&3' },
    { id: 4, task: 'Depth Research on XYZ', by: 'Client', date: '15/04 - 21/04', team: 'G2' },
    { id: 5, task: 'Depth Research on XYZ', by: 'Client', date: '12/04 - 18/04', team: 'G1&2' },
    { id: 6, task: 'Depth Research on XYZ', by: 'Priya - G2', date: '12/04 - 15/04', team: 'G2' },
    { id: 7, task: 'Depth Research on XYZ', by: 'Client', date: '10/03 - 25/04', team: 'G3' },
    { id: 8, task: 'Depth Research on XYZ', by: 'Amit sir - G2', date: '10/03 - 16/04', team: 'G2' },
    { id: 9, task: 'Depth Research on XYZ', by: 'Darshan - G2', date: '05/04 - 12/04', team: 'G2' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1600px] mx-auto space-y-6 select-none">
      
      {/* Sub-navigation bar */}
      <div className="flex items-center justify-between border-b border-[#142337] pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-[#0E1B2E] border border-cyan-500/50 text-cyan-400 shadow-[0_0_12px_rgba(0,245,196,0.2)]'
                : 'text-slate-400 hover:text-slate-200 bg-[#0A121E]'
            }`}
          >
            Gantt Timeline & Overview
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-[#0E1B2E] border border-cyan-500/50 text-cyan-400 shadow-[0_0_12px_rgba(0,245,196,0.2)]'
                : 'text-slate-400 hover:text-slate-200 bg-[#0A121E]'
            }`}
          >
            Department Updates Matrix
          </button>
        </div>

        <button
          onClick={() => onSelectTab('chat')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/40 text-blue-400 hover:text-white text-xs font-bold transition cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Open Team Chat</span>
        </button>
      </div>

      {activeTab === 'timeline' ? (
        <>
          {/* ======================================================== */}
          {/* TOP ROW: Timeline / Gantt Chart & Chatboxing Preview       */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Timeline & Gantt Card (8 cols) */}
            <div className="lg:col-span-8 taskroning-card p-5 space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                  Timeline
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-300 bg-[#0C1624] px-3 py-1 rounded-lg border border-[#19324F]">
                    <span>{selectedMonth}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>

                  {/* Team Avatars */}
                  <div className="flex -space-x-1.5">
                    <span className="w-6 h-6 rounded-full bg-cyan-400 border border-[#0B1320] shadow-[0_0_8px_rgba(0,245,196,0.4)]" />
                    <span className="w-6 h-6 rounded-full bg-teal-400 border border-[#0B1320]" />
                    <span className="w-6 h-6 rounded-full bg-blue-500 border border-[#0B1320]" />
                    <span className="w-6 h-6 rounded-full bg-indigo-600 border border-[#0B1320]" />
                  </div>
                </div>
              </div>

              {/* Gantt Matrix Chart */}
              <div className="overflow-x-auto pt-2 pb-4">
                <div className="min-w-[640px] space-y-3">
                  
                  {/* Days Column Header */}
                  <div className="grid grid-cols-18 gap-1 text-center font-mono text-[10px] text-slate-400 border-b border-[#142337] pb-2">
                    {daysHeader.map(d => (
                      <div key={d.num} className="space-y-0.5">
                        <span className="block text-slate-300 font-bold">{d.num}</span>
                        <span className="block text-[9px] text-slate-500">{d.day}</span>
                      </div>
                    ))}
                  </div>

                  {/* Gantt Phase Bars */}
                  <div className="relative py-2 space-y-3">
                    
                    {/* Background grid lines */}
                    <div className="absolute inset-0 grid grid-cols-18 gap-1 pointer-events-none opacity-10">
                      {daysHeader.map(d => (
                        <div key={d.num} className="border-r border-cyan-400 h-full" />
                      ))}
                    </div>

                    {/* Phase 1: Research (Days 9-13) */}
                    <div className="relative h-8 flex items-center">
                      <div 
                        className="h-7 rounded-lg bg-emerald-400/90 text-slate-950 font-bold text-xs px-3 flex items-center shadow-[0_0_12px_rgba(16,185,129,0.5)] transition hover:brightness-110"
                        style={{ marginLeft: '0%', width: '26%' }}
                      >
                        Research
                      </div>
                    </div>

                    {/* Phase 2: UX Research (Days 12-20) */}
                    <div className="relative h-8 flex items-center">
                      <div 
                        className="h-7 rounded-lg bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-bold text-xs px-3 flex items-center shadow-[0_0_12px_rgba(0,245,196,0.5)] transition hover:brightness-110"
                        style={{ marginLeft: '17%', width: '45%' }}
                      >
                        UX Research
                      </div>
                    </div>

                    {/* Phase 3: Content (Days 16-20) */}
                    <div className="relative h-8 flex items-center">
                      <div 
                        className="h-7 rounded-lg bg-emerald-400/90 text-slate-950 font-bold text-xs px-3 flex items-center shadow-[0_0_12px_rgba(16,185,129,0.5)] transition hover:brightness-110"
                        style={{ marginLeft: '39%', width: '23%' }}
                      >
                        Content
                      </div>
                    </div>

                    {/* Phase 4: UI (Days 17-26) */}
                    <div className="relative h-8 flex items-center">
                      <div 
                        className="h-7 rounded-lg bg-blue-600/90 text-white font-bold text-xs px-3 flex items-center border border-blue-400/40 shadow-[0_0_12px_rgba(37,99,235,0.5)] transition hover:brightness-110"
                        style={{ marginLeft: '45%', width: '55%' }}
                      >
                        UI
                      </div>
                    </div>

                    {/* Phase 5: Initial Development (Days 20-26) */}
                    <div className="relative h-8 flex items-center">
                      <div 
                        className="h-7 rounded-lg bg-blue-500/90 text-white font-bold text-xs px-3 flex items-center border border-blue-300/40 shadow-[0_0_12px_rgba(59,130,246,0.5)] transition hover:brightness-110"
                        style={{ marginLeft: '62%', width: '38%' }}
                      >
                        Initial Development
                      </div>
                    </div>

                  </div>

                </div>
              </div>

              {/* Status footer: On going vs Completed */}
              <div className="pt-3 border-t border-[#142337] flex flex-wrap items-center justify-between gap-4 text-xs">
                
                <div className="flex items-center gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">On going</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">UI</span>
                      <div className="w-20 bg-[#08111D] h-1.5 rounded-full overflow-hidden border border-[#19324F]">
                        <div className="h-full bg-blue-500 w-[65%]" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-transparent block font-semibold">.</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">Initial Development</span>
                      <div className="w-20 bg-[#08111D] h-1.5 rounded-full overflow-hidden border border-[#19324F]">
                        <div className="h-full bg-cyan-400 w-[25%]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Completed</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">Initial Research</span>
                    <div className="w-24 bg-[#08111D] h-1.5 rounded-full overflow-hidden border border-[#19324F]">
                      <div className="h-full bg-emerald-400 w-full" />
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Chatboxing Preview Card (4 cols) */}
            <div className="lg:col-span-4 taskroning-card p-5 flex flex-col justify-between">
              
              <div className="flex items-center justify-between border-b border-[#142337] pb-3">
                <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                  Chatboxing
                </div>
                <button
                  onClick={() => onSelectTab('chat')}
                  className="text-cyan-400 hover:text-white text-xs font-medium cursor-pointer"
                >
                  View All →
                </button>
              </div>

              <div className="divide-y divide-[#132338] my-2">
                {INITIAL_CHAT_CONTACTS.slice(0, 5).map(c => (
                  <div 
                    key={c.id} 
                    onClick={() => onSelectTab('chat')}
                    className="py-2.5 flex items-center justify-between hover:bg-[#0E1928] px-2 rounded-lg transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-cyan-500/30 border border-cyan-400/50 flex items-center justify-center text-xs text-cyan-300">
                        {c.name.charAt(0)}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">{c.name}</span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[140px] block">{c.lastMessage}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{c.lastTime}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#142337]">
                <button
                  onClick={() => onSelectTab('chat')}
                  className="w-full py-2 bg-[#0E1B2E] hover:bg-[#14273E] text-cyan-400 text-xs font-bold rounded-lg border border-cyan-500/30 transition cursor-pointer"
                >
                  Start Quick Huddle
                </button>
              </div>

            </div>

          </div>

          {/* ======================================================== */}
          {/* BOTTOM ROW: Project Report, New Project, Project Update  */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Project Report & New Project (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Project Report */}
              <div 
                onClick={() => onSelectTab('project_report')}
                className="taskroning-card p-5 space-y-4 cursor-pointer hover:border-cyan-400/70 transition-all duration-300 group"
                title="Open dedicated Project Report screen"
              >
                <div className="flex items-center justify-between">
                  <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200 group-hover:border-cyan-500/50 transition">
                    Project Report
                  </div>
                  <span className="text-[11px] text-cyan-400 font-semibold group-hover:translate-x-0.5 transition flex items-center gap-1">
                    <span>View Dedicated Screen</span>
                    <span>→</span>
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Progress</span>
                      <span className="text-2xl font-extrabold text-cyan-400 font-mono">56%</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Starting Date</span>
                      <span className="text-xs font-bold text-slate-200">09/03 Wed</span>
                    </div>
                  </div>

                  <div className="w-full bg-[#08121E] h-2 rounded-full overflow-hidden border border-[#19324F]">
                    <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full w-[56%] shadow-[0_0_8px_#00F5C4]" />
                  </div>

                  <div className="pt-2 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-slate-400">Deadline: </span>
                      <span className="font-bold text-slate-200">13/04/2026 (Monday)</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400">Admin Gated</span>
                  </div>
                </div>
              </div>

              {/* New Project (Admin Access Only) */}
              <div className="taskroning-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                    New Project
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#08121E] border border-[#19324F] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-slate-300">Admin Access Only</span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-400/60 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                    <div className="w-3 h-3 rounded-full bg-cyan-400" />
                  </div>
                </div>
              </div>

            </div>

            {/* Project Update Table (8 cols) */}
            <div className="lg:col-span-8 taskroning-card p-5 space-y-3">
              
              <div className="flex items-center justify-between border-b border-[#142337] pb-3">
                <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                  Project Update
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 font-medium border-b border-[#142337] text-[11px]">
                      <th className="py-2 px-2 w-8">No.</th>
                      <th className="py-2 px-2">Task</th>
                      <th className="py-2 px-2">Update by</th>
                      <th className="py-2 px-2">Date</th>
                      <th className="py-2 px-2 text-center">Team</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#122033]">
                    {projectTableUpdates.map(row => (
                      <tr key={row.id} className="hover:bg-[#0E1928] transition">
                        <td className="py-2 px-2 font-mono text-slate-400 text-[11px]">{row.id}</td>
                        <td className="py-2 px-2 text-slate-200 font-medium">{row.task}</td>
                        <td className="py-2 px-2 text-slate-300">{row.by}</td>
                        <td className="py-2 px-2 font-mono text-slate-400 text-[11px]">{row.date}</td>
                        <td className="py-2 px-2 text-center font-mono text-cyan-400 font-bold text-[11px]">{row.team}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        </>
      ) : (
        /* ======================================================== */
        /* DEPARTMENT UPDATES MATRIX VIEW (From Project Updates.png) */
        /* ======================================================== */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: New Updates */}
          <div className="taskroning-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#142337] pb-3">
              <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                New Updates
              </div>
              <button 
                onClick={onOpenTaskModal}
                className="w-7 h-7 rounded-full bg-cyan-950/40 border border-cyan-400 text-cyan-400 hover:text-white flex items-center justify-center shadow-[0_0_8px_rgba(0,245,196,0.3)] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {departmentUpdates.map(dept => (
                <div key={dept.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {/* Department Label */}
                  <div className="w-36 px-3 py-2 rounded-xl bg-[#0E1B2E] border border-[#19324F] text-xs font-bold text-slate-200 text-center shrink-0">
                    {dept.department}
                  </div>

                  {/* Updates cards */}
                  <div className="flex-1 flex flex-wrap gap-2">
                    {dept.updates.map(u => (
                      <div 
                        key={u.id}
                        className="px-3 py-2 rounded-xl bg-[#08121E] border border-cyan-500/30 text-[11px] space-y-0.5 shadow-sm min-w-[130px]"
                      >
                        <span className="block text-slate-200 font-semibold">{u.task}</span>
                        <span className={`block text-[10px] font-bold ${
                          u.status === 'Started...' ? 'text-emerald-400' :
                          u.status === 'Pending' ? 'text-cyan-400' : 'text-emerald-400'
                        }`}>
                          {u.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Client Insight */}
          <div className="taskroning-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#142337] pb-3">
              <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                Client Insight
              </div>
              <button 
                onClick={onOpenTaskModal}
                className="w-7 h-7 rounded-full bg-cyan-950/40 border border-cyan-400 text-cyan-400 hover:text-white flex items-center justify-center shadow-[0_0_8px_rgba(0,245,196,0.3)] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {departmentUpdates.map(dept => (
                <div key={dept.id} className="min-h-[50px] flex items-center">
                  <div className="flex-1 flex flex-wrap gap-2">
                    {dept.clientInsights.length > 0 ? (
                      dept.clientInsights.map(ci => (
                        <div 
                          key={ci.id}
                          className="px-3 py-2 rounded-xl bg-[#08121E] border border-cyan-500/30 text-[11px] space-y-0.5 shadow-sm min-w-[130px]"
                        >
                          <span className="block text-slate-200 font-semibold">{ci.task}</span>
                          <span className={`block text-[10px] font-bold ${
                            ci.status === 'Approved.' ? 'text-emerald-400' : 'text-cyan-400'
                          }`}>
                            {ci.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="w-full h-10 border border-dashed border-[#14253B] rounded-xl" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
