import React, { useState, useEffect, useRef } from 'react';
import { Task } from '../types';
import { audioManager } from '../utils/audioUtils';
import confetti from 'canvas-confetti';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Timer, 
  Sparkles,
  Waves,
  Music
} from 'lucide-react';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  initialTask?: Task | null;
  onCompleteTask: (taskId: string) => void;
  onRecordPomodoro: (taskId: string) => void;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  onClose,
  tasks,
  initialTask,
  onCompleteTask,
  onRecordPomodoro,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'focus_25' | 'deep_50' | 'break_5' | 'break_15'>('focus_25');
  const [totalSeconds, setTotalSeconds] = useState<number>(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(initialTask?.id || '');

  // Soundscape
  const [soundType, setSoundType] = useState<'none' | 'binaural' | 'brown' | 'pink'>('none');
  const [volume, setVolume] = useState<number>(0.3);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Set mode times
  const switchMode = (newMode: 'focus_25' | 'deep_50' | 'break_5' | 'break_15') => {
    setIsRunning(false);
    setMode(newMode);
    let sec = 25 * 60;
    if (newMode === 'focus_25') sec = 25 * 60;
    else if (newMode === 'deep_50') sec = 50 * 60;
    else if (newMode === 'break_5') sec = 5 * 60;
    else if (newMode === 'break_15') sec = 15 * 60;
    setTotalSeconds(sec);
    setSecondsLeft(sec);
  };

  // Timer Tick
  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, secondsLeft]);

  // Audio Engine synchronization
  useEffect(() => {
    if (isRunning && soundType !== 'none') {
      audioManager.startAmbient(soundType, volume);
    } else {
      audioManager.stopAmbient();
    }

    return () => {
      audioManager.stopAmbient();
    };
  }, [isRunning, soundType, volume]);

  const handleTimerComplete = () => {
    // Play completion chime
    audioManager.playChime();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.log('Confetti error:', e);
    }

    // Record pomodoro if task selected
    if (selectedTaskId && (mode === 'focus_25' || mode === 'deep_50')) {
      onRecordPomodoro(selectedTaskId);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPercent = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  const activeTask = tasks.find(t => t.id === selectedTaskId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Deep Work Focus Room</h2>
          </div>
          <button
            onClick={() => {
              audioManager.stopAmbient();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex flex-col items-center">
          
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => switchMode('focus_25')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                mode === 'focus_25' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              25m Focus
            </button>
            <button
              onClick={() => switchMode('deep_50')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                mode === 'deep_50' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              50m Deep Work
            </button>
            <button
              onClick={() => switchMode('break_5')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                mode === 'break_5' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              5m Break
            </button>
            <button
              onClick={() => switchMode('break_15')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                mode === 'break_15' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              15m Long Break
            </button>
          </div>

          {/* Circular Countdown Progress Ring */}
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-slate-800"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-emerald-500 transition-all duration-500"
                strokeWidth="6"
                strokeDasharray={276}
                strokeDashoffset={276 - (276 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-mono font-bold text-white tracking-tight">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
                {mode.includes('break') ? 'Break Time' : 'Focus Session'}
              </span>
            </div>
          </div>

          {/* Primary Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="p-3 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-700 transition cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition cursor-pointer"
            >
              {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
            </button>
          </div>

          {/* Attached Task Selector */}
          <div className="w-full bg-slate-800/60 border border-slate-700/80 p-3.5 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Attach Deliverable to this Session</span>
              {activeTask && activeTask.status !== 'completed' && (
                <button
                  onClick={() => {
                    onCompleteTask(activeTask.id);
                    audioManager.playChime();
                    confetti();
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Complete</span>
                </button>
              )}
            </div>

            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-850 border border-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">-- No specific task attached --</option>
              {tasks.map(t => (
                <option key={t.id} value={t.id}>
                  {t.status === 'completed' ? '✓ ' : ''}{t.title} ({t.category})
                </option>
              ))}
            </select>
          </div>

          {/* Ambient Sound Generator */}
          <div className="w-full bg-slate-800/60 border border-slate-700/80 p-3.5 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Music className="w-3.5 h-3.5 text-indigo-400" />
                <span>Web Audio Soundscapes</span>
              </div>

              <div className="flex items-center gap-1 bg-slate-850 p-0.5 rounded-lg border border-slate-700">
                <button
                  onClick={() => setSoundType('none')}
                  className={`px-2 py-1 text-[11px] font-medium rounded ${soundType === 'none' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                >
                  Mute
                </button>
                <button
                  onClick={() => setSoundType('binaural')}
                  className={`px-2 py-1 text-[11px] font-medium rounded ${soundType === 'binaural' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                >
                  Alpha Binaural
                </button>
                <button
                  onClick={() => setSoundType('brown')}
                  className={`px-2 py-1 text-[11px] font-medium rounded ${soundType === 'brown' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                >
                  Brown Noise
                </button>
                <button
                  onClick={() => setSoundType('pink')}
                  className={`px-2 py-1 text-[11px] font-medium rounded ${soundType === 'pink' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                >
                  Pink Noise
                </button>
              </div>
            </div>

            {soundType !== 'none' && (
              <div className="flex items-center gap-3 pt-1">
                <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-slate-700 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 font-mono w-8">{Math.round(volume * 100)}%</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
