"use client";

import { useEffect, useRef, useState } from "react";
import { useTextScramble } from "../../hooks/useTextScramble";
import { cn } from "../../lib/utils";

interface TextScrambleProps {
  text: string;
  className?: string;
  duration?: number;
  scrambleSpeed?: number;
  triggerOnce?: boolean;
}

export function TextScramble({
  text,
  className,
  duration = 1000,
  scrambleSpeed = 30,
  triggerOnce = true,
}: TextScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
            setIsActive(true);
            setHasTriggered(true);
          }
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [triggerOnce, hasTriggered]);

  const scrambledText = useTextScramble(text, isActive, {
    duration,
    scrambleSpeed,
  });

  return (
    <span ref={ref} className={cn("inline-block font-mono", className)}>
      {scrambledText}
      {isActive && scrambledText !== text && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
}
