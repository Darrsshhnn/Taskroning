import React, { useState, useEffect } from 'react';
import { FocusZone, FocusHistoryItem } from '../../types';
import { 
  INITIAL_FOCUS_ZONES, 
  INITIAL_FOCUS_HISTORY 
} from '../../data/initialData';
import { audioManager } from '../../utils/audioUtils';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Flame, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const FocusModeView: React.FC = () => {
  const [focusStyleIndex, setFocusStyleIndex] = useState(0);
  const focusStyles = ['Liquid Wave', 'Concentric Ring', 'Digital Neon'];
  
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [activeSound, setActiveSound] = useState<'binaural' | 'brown' | 'pink' | 'none'>('none');

  const [scheduledZones, setScheduledZones] = useState<FocusZone[]>(INITIAL_FOCUS_ZONES);
  const [historyItems, setHistoryItems] = useState<FocusHistoryItem[]>(INITIAL_FOCUS_HISTORY);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            audioManager.playChime('success');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleSound = (sound: 'binaural' | 'brown' | 'pink') => {
    if (activeSound === sound) {
      audioManager.stopSoundscape();
      setActiveSound('none');
    } else {
      audioManager.playSoundscape(sound);
      setActiveSound(sound);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimerSeconds(25 * 60);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1600px] mx-auto space-y-6 select-none">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: Focus Styles Liquid Meter (4 cols)           */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 taskroning-card p-5 flex flex-col justify-between space-y-6">
          
          {/* Header with Style Switcher */}
          <div className="flex items-center justify-between">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
              Focus Styles
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button 
                onClick={() => setFocusStyleIndex(prev => (prev === 0 ? focusStyles.length - 1 : prev - 1))}
                className="p-1 hover:text-cyan-400 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-semibold text-slate-300 px-1">
                {focusStyles[focusStyleIndex]}
              </span>
              <button 
                onClick={() => setFocusStyleIndex(prev => (prev + 1) % focusStyles.length)}
                className="p-1 hover:text-cyan-400 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Meter Display Area */}
          <div className="my-6 flex flex-col items-center justify-center gap-4">
            
            {focusStyleIndex === 0 && (
              /* Style 1: Liquid Wave */
              <div className="relative w-44 h-44 rounded-full border-2 border-cyan-400/60 bg-[#08121E] overflow-hidden shadow-[0_0_30px_rgba(0,245,196,0.3)] flex items-center justify-center">
                <div 
                  className="liquid-wave bg-gradient-to-t from-cyan-600/80 via-teal-500/60 to-cyan-400/50" 
                  style={{ top: '45%' }}
                />
                <div 
                  className="liquid-wave-fast bg-gradient-to-t from-emerald-600/60 via-cyan-500/50 to-teal-300/40" 
                  style={{ top: '48%' }}
                />
                <div className="relative z-10 text-center">
                  <span className="text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight">
                    55%
                  </span>
                </div>
              </div>
            )}

            {focusStyleIndex === 1 && (
              /* Style 2: Concentric Ring */
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="#101E30" strokeWidth="6" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#00F5C4"
                    strokeWidth="6"
                    strokeDasharray="264"
                    strokeDashoffset="118"
                    strokeLinecap="round"
                    fill="none"
                    className="shadow-[0_0_12px_#00F5C4]"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-black text-cyan-400">55%</span>
                </div>
              </div>
            )}

            {focusStyleIndex === 2 && (
              /* Style 3: Digital Neon */
              <div className="w-44 h-44 rounded-2xl bg-[#08121E] border-2 border-cyan-400/50 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(0,245,196,0.3)]">
                <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">Deep Work</span>
                <span className="text-4xl font-black text-white font-mono my-1">55%</span>
                <span className="text-[10px] text-slate-400">Efficiency</span>
              </div>
            )}

            <button
              onClick={() => setFocusStyleIndex(prev => (prev + 1) % focusStyles.length)}
              className="px-4 py-1.5 rounded-lg border border-cyan-400/80 text-cyan-400 hover:bg-cyan-950/40 text-xs font-bold transition cursor-pointer shadow-sm"
            >
              Update Style
            </button>
          </div>

          {/* Bottom Progress Bar */}
          <div className="space-y-2 pt-3 border-t border-[#142337]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">Progress Bar</span>
              <span className="text-cyan-400 font-mono text-[11px]">Today's Goal: 01:20 Hr (done)</span>
            </div>

            <div className="w-full bg-[#070D16] h-2 rounded-full overflow-hidden border border-[#16273C]">
              <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full w-[57%] shadow-[0_0_6px_#00F5C4]" />
            </div>

            <div className="text-right text-[10px] text-slate-400">
              Target: 02:20 Hr (to min)
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* MIDDLE COLUMN: Countdown Timer & Scheduled Zones (4 cols) */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main Digital Clock Card */}
          <div className="taskroning-card p-5 flex flex-col items-center justify-between space-y-5">
            
            <div className="w-full flex items-center justify-between">
              <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                Timer
              </div>

              {/* Preset selectors */}
              <div className="flex items-center gap-1">
                {[15, 25, 50].map(mins => (
                  <button
                    key={mins}
                    onClick={() => {
                      setIsRunning(false);
                      setTimerSeconds(mins * 60);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
                      timerSeconds === mins * 60
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Big LED Numbers */}
            <div className="my-2 py-4 px-6 rounded-2xl bg-[#08121E] border border-cyan-500/40 shadow-[0_0_25px_-5px_rgba(0,245,196,0.3)]">
              <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-cyan-400 drop-shadow-[0_0_12px_rgba(0,245,196,0.7)]">
                {formatTimer(timerSeconds)}
              </span>
            </div>

            {/* Controls: Play/Pause/Reset */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg ${
                  isRunning
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                    : 'bg-gradient-to-r from-cyan-500 to-teal-400 hover:brightness-110 text-slate-950 shadow-cyan-500/30'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Session</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-[#0E1B2E] border border-[#1E3654] text-slate-400 hover:text-white transition cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Soundscape presets */}
            <div className="w-full pt-3 border-t border-[#142337] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ambient Audio</span>
                </span>
                <span className="text-[10px] text-cyan-400 font-mono capitalize">{activeSound}</span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => toggleSound('binaural')}
                  className={`p-1.5 rounded-lg text-[10px] font-bold border transition cursor-pointer text-center ${
                    activeSound === 'binaural'
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/60'
                      : 'bg-[#08121E] text-slate-400 border-[#15253A] hover:text-slate-200'
                  }`}
                >
                  Binaural
                </button>
                <button
                  onClick={() => toggleSound('brown')}
                  className={`p-1.5 rounded-lg text-[10px] font-bold border transition cursor-pointer text-center ${
                    activeSound === 'brown'
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/60'
                      : 'bg-[#08121E] text-slate-400 border-[#15253A] hover:text-slate-200'
                  }`}
                >
                  Brown Noise
                </button>
                <button
                  onClick={() => toggleSound('pink')}
                  className={`p-1.5 rounded-lg text-[10px] font-bold border transition cursor-pointer text-center ${
                    activeSound === 'pink'
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/60'
                      : 'bg-[#08121E] text-slate-400 border-[#15253A] hover:text-slate-200'
                  }`}
                >
                  Pink Noise
                </button>
              </div>
            </div>

          </div>

          {/* Scheduled Zones Card */}
          <div className="taskroning-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#142337] pb-2">
              <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
                Scheduled Zones
              </div>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {scheduledZones.map(zone => (
                <div 
                  key={zone.id}
                  className="p-2 rounded-lg bg-[#08121E] border border-[#162C47] flex items-center justify-between text-xs"
                >
                  <span className="font-mono text-slate-400 text-[11px]">{zone.date}</span>
                  <span className="font-semibold text-slate-200 text-[11px]">{zone.sessionTitle}</span>
                  <span className="font-mono text-cyan-400 text-[11px] font-bold">{zone.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: History Table (4 cols)                      */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 taskroning-card p-5 space-y-4">
          
          <div className="flex items-center justify-between border-b border-[#142337] pb-3">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0E1B2E] border border-[#1E3654] text-xs font-bold text-slate-200">
              History
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-medium border-b border-[#142337] text-[11px]">
                  <th className="py-2 px-1">Day</th>
                  <th className="py-2 px-1">Focused</th>
                  <th className="py-2 px-1 text-right">Timings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#122033]">
                {historyItems.map(h => (
                  <tr key={h.id} className="hover:bg-[#0E1928] transition">
                    <td className="py-2.5 px-1 font-medium text-slate-200 text-[11px]">
                      {h.day}
                    </td>
                    <td className="py-2.5 px-1 font-mono text-cyan-400 font-bold text-[11px]">
                      {h.focused}
                    </td>
                    <td className="py-2.5 px-1 font-mono text-slate-400 text-[10px] text-right">
                      {h.timings}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
};
