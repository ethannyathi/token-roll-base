import { useRef, useCallback } from 'react';

export const useSoundEffects = () => {
  const audioContext = useRef<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext.current;
  }, []);

  const playSpinSound = useCallback(() => {
    const ctx = initAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  }, [initAudioContext]);

  const playReelStopSound = useCallback(() => {
    const ctx = initAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(150, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }, [initAudioContext]);

  const playWinSound = useCallback(() => {
    const ctx = initAudioContext();
    
    // Play a cheerful ascending melody
    const notes = [262, 330, 392, 523]; // C, E, G, high C
    const duration = 0.15;

    notes.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + index * duration);

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime + index * duration);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * duration + duration);

      oscillator.start(ctx.currentTime + index * duration);
      oscillator.stop(ctx.currentTime + index * duration + duration);
    });
  }, [initAudioContext]);

  const playJackpotSound = useCallback(() => {
    const ctx = initAudioContext();
    
    // Play an exciting fanfare
    const melody = [
      { freq: 523, time: 0 },      // C5
      { freq: 659, time: 0.1 },    // E5
      { freq: 784, time: 0.2 },    // G5
      { freq: 1047, time: 0.3 },   // C6
      { freq: 784, time: 0.4 },    // G5
      { freq: 1047, time: 0.5 },   // C6
      { freq: 1319, time: 0.7 },   // E6
      { freq: 1568, time: 0.9 },   // G6
    ];

    melody.forEach(({ freq, time }) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + time);

      gainNode.gain.setValueAtTime(0.4, ctx.currentTime + time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + time + 0.2);

      oscillator.start(ctx.currentTime + time);
      oscillator.stop(ctx.currentTime + time + 0.2);
    });

    // Add some sparkle effects
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(2000 + Math.random() * 1000, ctx.currentTime);

        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
      }, i * 100);
    }
  }, [initAudioContext]);

  return {
    playSpinSound,
    playReelStopSound,
    playWinSound,
    playJackpotSound,
  };
};
