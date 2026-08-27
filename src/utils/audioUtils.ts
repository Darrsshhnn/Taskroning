// Web Audio API ambient focus sound generator & completion chime

let audioCtx: AudioContext | null = null;
let activeNoiseNode: AudioNode | null = null;
let activeGainNode: GainNode | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playCompletionChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Harmonic pleasant chime chords: C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz), C6 (1046.50Hz)
    const frequencies = [523.25, 659.25, 783.99, 1046.50];
    
    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);

      gain.gain.setValueAtTime(0, now + index * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, now + index * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 1.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 1.8);
    });
  } catch (e) {
    console.warn('Audio chime failed to play:', e);
  }
}

export function startAmbientSound(type: 'binaural' | 'brown_noise' | 'pink_noise' | 'zen_waves', volume = 0.2) {
  stopAmbientSound();
  try {
    const ctx = getAudioContext();
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.5);
    gainNode.connect(ctx.destination);
    activeGainNode = gainNode;

    if (type === 'binaural') {
      // Alpha/Beta frequency binaural beats (Carrier ~ 210Hz, Beat ~ 10Hz for flow state)
      const oscLeft = ctx.createOscillator();
      const oscRight = ctx.createOscillator();
      const merger = ctx.createChannelMerger(2);

      oscLeft.type = 'sine';
      oscLeft.frequency.value = 210;
      oscRight.type = 'sine';
      oscRight.frequency.value = 220; // 10Hz alpha wave difference

      oscLeft.connect(merger, 0, 0);
      oscRight.connect(merger, 0, 1);
      merger.connect(gainNode);

      oscLeft.start();
      oscRight.start();

      activeNoiseNode = {
        disconnect: () => {
          try {
            oscLeft.stop();
            oscRight.stop();
            oscLeft.disconnect();
            oscRight.disconnect();
            merger.disconnect();
          } catch (_) {}
        }
      } as any;
    } else {
      // Brown or Pink noise buffer synthesis
      const bufferSize = ctx.sampleRate * 3; // 3 second loop
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      let lastOut = 0.0;
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'brown_noise' || type === 'zen_waves') {
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; // Gain compensation
        } else {
          // Pink noise filter
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11;
          b6 = white * 0.115926;
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter for warmth
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = type === 'zen_waves' ? 400 : 800;

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      whiteNoise.start();

      activeNoiseNode = {
        disconnect: () => {
          try {
            whiteNoise.stop();
            whiteNoise.disconnect();
            filter.disconnect();
          } catch (_) {}
        }
      } as any;
    }
  } catch (e) {
    console.warn('Ambient sound failed:', e);
  }
}

export function stopAmbientSound() {
  if (activeGainNode && audioCtx) {
    try {
      activeGainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      setTimeout(() => {
        if (activeNoiseNode) {
          activeNoiseNode.disconnect();
          activeNoiseNode = null;
        }
        if (activeGainNode) {
          activeGainNode.disconnect();
          activeGainNode = null;
        }
      }, 600);
    } catch (_) {
      if (activeNoiseNode) activeNoiseNode.disconnect();
      activeNoiseNode = null;
      activeGainNode = null;
    }
  }
}

export const audioManager = {
  playChime: () => playCompletionChime(),
  startAmbient: (type: 'binaural' | 'brown' | 'pink' | 'none', volume = 0.2) => {
    if (type === 'none') {
      stopAmbientSound();
      return;
    }
    const mappedType = type === 'brown' ? 'brown_noise' : type === 'pink' ? 'pink_noise' : 'binaural';
    startAmbientSound(mappedType as any, volume);
  },
  stopAmbient: () => stopAmbientSound(),
};

