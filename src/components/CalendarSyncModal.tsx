import React, { useState } from 'react';
import { CalendarEvent, Task } from '../types';
import { generateICS, parseICS } from '../utils/dateUtils';
import { 
  X, 
  Download, 
  Upload, 
  CalendarSync, 
  Check, 
  Layers, 
  FileText, 
  ExternalLink 
} from 'lucide-react';

interface CalendarSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: CalendarEvent[];
  tasks: Task[];
  onImportEvents: (newEvents: CalendarEvent[]) => void;
}

export const CalendarSyncModal: React.FC<CalendarSyncModalProps> = ({
  isOpen,
  onClose,
  events,
  tasks,
  onImportEvents,
}) => {
  if (!isOpen) return null;

  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Download ICS file
  const handleExportICS = () => {
    const icsContent = generateICS(events, tasks);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `WorkFlowSync-Schedule-${new Date().toISOString().split('T')[0]}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import ICS file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const parsed = parseICS(content);
        if (parsed.length > 0) {
          onImportEvents(parsed);
          setImportStatus(`Successfully imported ${parsed.length} calendar events!`);
        } else {
          setImportStatus('No valid events found in the uploaded .ics file.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-2">
            <CalendarSync className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Calendar Synchronization & .ICS Export</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Export Section */}
          <div className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white">Export Calendar to iCal (.ics)</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Export all {events.length} calendar events and {tasks.filter(t => t.timeBlock).length} time-blocked tasks to Google Calendar, Apple Calendar, or Outlook.
                </p>
              </div>
            </div>

            <button
              onClick={handleExportICS}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download iCal (.ics) File</span>
            </button>
          </div>

          {/* Import Section */}
          <div className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-xl space-y-3">
            <div>
              <h3 className="text-xs font-bold text-white">Import Existing Calendar (.ics)</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Upload your company or team schedule exported from Google Calendar or Outlook.
              </p>
            </div>

            <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition bg-slate-850/50">
              <Upload className="w-6 h-6 text-indigo-400" />
              <span className="text-xs font-medium text-slate-300">Click or Drag & Drop .ics file here</span>
              <input
                type="file"
                accept=".ics,text/calendar"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {importStatus && (
              <div className="text-xs font-semibold text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 p-2.5 rounded-lg flex items-center gap-2">
                <Check className="w-3.5 h-3.5" />
                <span>{importStatus}</span>
              </div>
            )}
          </div>

          {/* Google Calendar Integration Note */}
          <div className="p-4 bg-slate-850 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-400">
            <h4 className="font-bold text-slate-300">Google Calendar Two-Way Live Sync</h4>
            <p className="text-[11px] leading-relaxed">
              To subscribe live in Google Calendar: Download the .ics file above, open <strong>Google Calendar → Settings → Import & Export</strong>, and import your WorkFlowSync agenda.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
