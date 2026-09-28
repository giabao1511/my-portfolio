"use client";

import { useAudio } from "./AudioContext";
import { cn } from "../../lib/utils";

export function SoundToggle() {
  const { isMuted, toggle } = useAudio();

  return (
    <button
      onClick={toggle}
      className={cn(
        "fixed bottom-8 right-8 z-50",
        "w-12 h-12 rounded-full",
        "flex items-center justify-center",
        "transition-all duration-300",
        "border backdrop-blur-sm",
        isMuted
          ? "bg-zinc-900/80 border-zinc-700 text-zinc-500"
          : "bg-accent-cyan/10 border-accent-cyan/50 text-accent-cyan",
        "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50",
      )}
      aria-label={isMuted ? "Enable sound" : "Mute sound"}
    >
      {isMuted ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <div className="flex items-center gap-0.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-0.5 rounded-full bg-accent-cyan animate-[soundWave_0.5s_ease-in-out_infinite]"
              style={{
                height: `${6 + i * 3}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}
    </button>
  );
}
