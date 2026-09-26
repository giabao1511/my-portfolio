"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const position = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Hide on touch devices
    if ("ontouchstart" in window) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const onEnter = () => setIsVisible(true);
    const onLeave = () => setIsVisible(false);

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onHoverStart = (e: MouseEvent) => {
      const hoveredTarget = e.target as HTMLElement;
      if (hoveredTarget.closest("a, button, [data-magnetic]")) {
        setIsHovering(true);
      }
    };

    const onHoverEnd = () => setIsHovering(false);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onHoverStart);
    document.addEventListener("mouseout", onHoverEnd);

    let rafId: number;
    const animate = () => {
      // Lerp for smooth trailing
      position.current.x += (target.current.x - position.current.x) * 0.15;
      position.current.y += (target.current.y - position.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${position.current.x}px, ${position.current.y}px) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onHoverStart);
      document.removeEventListener("mouseout", onHoverEnd);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  return (
    <div
      ref={cursorRef}
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-[9999] rounded-full transition-all duration-150",
        "bg-accent-cyan/20 border border-accent-cyan/50",
        isVisible ? "opacity-100" : "opacity-0",
        isHovering ? "w-12 h-12 bg-accent-cyan/30" : "w-3 h-3",
        isClicking && "scale-75",
        "hidden md:block" // Hidden on mobile
      )}
    />
  );
}
