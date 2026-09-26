"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { HeroTypography } from "./HeroTypography";
import { MagneticButton } from "./MagneticButton";
import { BentoStats } from "./BentoStats";
import { ScrollIndicator } from "./ScrollIndicator";
import { PROFILE } from "../../lib/constants";

// Dynamic import for 3D canvas (no SSR)
const Hero3DCanvas = dynamic(
  () => import("./Hero3DCanvas").then((mod) => mod.Hero3DCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
    ),
  }
);

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Detect mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Detect reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      // Normalized coordinates (-1 to 1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      mediaQuery.removeEventListener("change", handleMotionChange);
      if (!isMobile) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [isMobile]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background: 3D Canvas or gradient fallback */}
      {isMobile || isReducedMotion ? (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
      ) : (
        <Hero3DCanvas mousePosition={mousePosition} />
      )}

      {/* Radial gradient overlay for better text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 0%, rgba(9,9,11,0.5) 50%, rgba(9,9,11,1) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-16 md:gap-24 px-4 py-24 w-full max-w-6xl mx-auto">
        {/* Typography + CTAs */}
        <div className="flex flex-col items-center gap-8 md:gap-12">
          <HeroTypography />

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <MagneticButton variant="primary" href="#work">
              {PROFILE.ctas.primary}
            </MagneticButton>
            <MagneticButton variant="secondary" href="#contact">
              {PROFILE.ctas.secondary}
            </MagneticButton>
          </div>
        </div>

        {/* Bento Stats Grid */}
        <BentoStats />

        {/* Scroll Indicator */}
        <div className="mt-8 md:mt-16">
          <ScrollIndicator />
        </div>
      </div>
    </section>
  );
}
