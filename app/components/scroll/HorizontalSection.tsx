"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "../../lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface HorizontalSectionProps {
  children: ReactNode;
  className?: string;
  cardWidth?: number;
}

export function HorizontalSection({
  children,
  className,
  cardWidth = 400,
}: HorizontalSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    // Count children to calculate total width
    const childrenArray = Array.from(wrapper.children);
    const totalWidth =
      childrenArray.length * cardWidth + (childrenArray.length - 1) * 32; // gap

    // Check if there's enough scroll distance
    const viewportWidth = window.innerWidth;
    const scrollDistance = Math.max(0, totalWidth - viewportWidth + 200);

    // Skip on mobile or reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion || scrollDistance <= 0 || viewportWidth < 768) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(wrapper, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${scrollDistance}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, container);

    return () => ctx.revert();
  }, [cardWidth]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      <div
        ref={wrapperRef}
        className="flex gap-8 pl-[max(2rem,calc((100vw-1400px)/2))]"
        style={{ width: "max-content" }}
      >
        {children}
      </div>
    </div>
  );
}
