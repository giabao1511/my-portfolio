"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "../../lib/utils";

interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
  timestamp: number;
}

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const position = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const trail = useRef<TrailPoint[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const lastMoveTime = useRef(0);
  const velocity = useRef({ x: 0, y: 0 });

  const addTrailPoint = useCallback((x: number, y: number) => {
    trail.current.push({ x, y, opacity: 1, timestamp: Date.now() });
    if (trail.current.length > 8) {
      trail.current.shift();
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || "ontouchstart" in window) return;

    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = now - lastMoveTime.current;

      velocity.current.x = dt > 0 ? (e.clientX - target.current.x) / dt : 0;
      velocity.current.y = dt > 0 ? (e.clientY - target.current.y) / dt : 0;

      target.current.x = e.clientX;
      target.current.y = e.clientY;
      lastMoveTime.current = now;

      // Add trail on fast movement
      const speed = Math.sqrt(
        velocity.current.x ** 2 + velocity.current.y ** 2,
      );
      if (speed > 0.5) {
        addTrailPoint(e.clientX, e.clientY);
      }

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
    let trailRafId: number;

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

    // Trail animation
    const animateTrail = () => {
      const now = Date.now();
      trail.current = trail.current.filter((point) => {
        const age = now - point.timestamp;
        point.opacity = Math.max(0, 1 - age / 200);
        return point.opacity > 0;
      });

      if (trailRef.current) {
        const dots = trailRef.current.querySelectorAll("[data-trail-dot]");
        trail.current.forEach((point, i) => {
          if (dots[i]) {
            dots[i].setAttribute(
              "style",
              `transform: translate(${point.x}px, ${point.y}px) translate(-50%, -50%) scale(${point.opacity}); opacity: ${point.opacity}`,
            );
          }
        });
      }

      trailRafId = requestAnimationFrame(animateTrail);
    };
    trailRafId = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onHoverStart);
      document.removeEventListener("mouseout", onHoverEnd);
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(trailRafId);
    };
  }, [isVisible, addTrailPoint]);

  return (
    <>
      {/* Trail container */}
      <div
        ref={trailRef}
        data-cursor
        className="pointer-events-none fixed inset-0 z-[9998]"
        aria-hidden="true"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            data-trail-dot
            className="absolute w-1 h-1 rounded-full bg-accent-cyan"
            style={{
              opacity: 0,
              transform: "translate(-50%, -50%) scale(0)",
            }}
          />
        ))}
      </div>

      {/* Main cursor */}
      <div
        ref={cursorRef}
        data-cursor
        className={cn(
          "pointer-events-none fixed top-0 left-0 z-[9999] rounded-full",
          "mix-blend-difference transition-all duration-150",
          isVisible ? "opacity-100" : "opacity-0",
          // Default
          "bg-white",
          !isHovering && !isClicking && "w-3 h-3",
          // Hovering
          isHovering &&
            !isClicking &&
            "w-12 h-12 border-2 border-white bg-transparent",
          // Clicking
          isClicking && "w-8 h-8 scale-75",
          "hidden lg:block",
        )}
      />
    </>
  );
}
