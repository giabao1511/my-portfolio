"use client";

import { useEffect, useRef, useState } from "react";

const CHARS =
  "!@#$%^&*()_+-=[]{}|;':\",./<>?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

interface UseTextScrambleOptions {
  duration?: number;
  scrambleSpeed?: number;
}

export function useTextScramble(
  text: string,
  isActive: boolean,
  options: UseTextScrambleOptions = {},
): string {
  const { duration = 1000, scrambleSpeed = 30 } = options;
  const [displayText, setDisplayText] = useState(text);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional reset on deactivation
      setDisplayText(text);
      return;
    }

    let startTime: number;
    let frame = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Build result string
      let result = "";
      const revealCount = Math.floor(progress * text.length);

      for (let i = 0; i < text.length; i++) {
        if (i < revealCount) {
          result += text[i];
        } else if (text[i] === " ") {
          result += " ";
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }

      setDisplayText(result);

      if (progress < 1) {
        frame++;
        const speedFactor = Math.max(1, Math.floor(frame / 3));
        timeoutRef.current = setTimeout(() => {
          rafRef.current = requestAnimationFrame(animate);
        }, scrambleSpeed * speedFactor);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, isActive, duration, scrambleSpeed]);

  return displayText;
}
