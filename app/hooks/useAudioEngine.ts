"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface AudioEngine {
  isEnabled: boolean;
  isMuted: boolean;
  toggle: () => void;
  playHover: () => void;
  playClick: () => void;
}

export function useAudioEngine(): AudioEngine {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Initialize audio context lazily
  const initAudio = useCallback(() => {
    if (audioContextRef.current) return audioContextRef.current;

    const ctx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.value = 0; // Start muted

    audioContextRef.current = ctx;
    masterGainRef.current = masterGain;

    return ctx;
  }, []);

  const toggle = useCallback(() => {
    const ctx = initAudio();

    if (isMuted) {
      // Resume context if suspended
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      setIsMuted(false);
      if (masterGainRef.current) {
        masterGainRef.current.gain.setTargetAtTime(0.3, ctx.currentTime, 0.1);
      }
    } else {
      setIsMuted(true);
      if (masterGainRef.current) {
        masterGainRef.current.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
      }
    }
    setIsEnabled(true);
  }, [isMuted, initAudio]);

  const playHover = useCallback(() => {
    if (isMuted || !audioContextRef.current || !masterGainRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(masterGainRef.current);

    osc.start(now);
    osc.stop(now + 0.1);
  }, [isMuted]);

  const playClick = useCallback(() => {
    if (isMuted || !audioContextRef.current || !masterGainRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.03);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(masterGainRef.current);

    osc.start(now);
    osc.stop(now + 0.06);
  }, [isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return { isEnabled, isMuted, toggle, playHover, playClick };
}

// Webkit AudioContext fallback
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
