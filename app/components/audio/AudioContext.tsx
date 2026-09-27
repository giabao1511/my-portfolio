"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAudioEngine } from "../../hooks/useAudioEngine";

interface AudioContextValue {
  isEnabled: boolean;
  isMuted: boolean;
  toggle: () => void;
  playHover: () => void;
  playClick: () => void;
}

const AudioContext = createContext<AudioContextValue>({
  isEnabled: false,
  isMuted: true,
  toggle: () => {},
  playHover: () => {},
  playClick: () => {},
});

export function AudioProvider({ children }: { children: ReactNode }) {
  const audio = useAudioEngine();

  return (
    <AudioContext.Provider value={audio}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}
