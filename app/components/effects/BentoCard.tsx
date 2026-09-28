"use client";

import { useRef, useState, type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "cyan" | "violet" | "emerald";
  tiltStrength?: number;
}

const glowMap = {
  cyan: {
    border: "border-accent-cyan/30 hover:border-accent-cyan/60",
    shadow: "hover:shadow-glow-cyan",
    spotlight:
      "radial-gradient(ellipse at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(6, 182, 212, 0.15) 0%, transparent 50%)",
  },
  violet: {
    border: "border-accent-violet/30 hover:border-accent-violet/60",
    shadow: "hover:shadow-glow-violet",
    spotlight:
      "radial-gradient(ellipse at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
  },
  emerald: {
    border: "border-accent-emerald/30 hover:border-accent-emerald/60",
    shadow: "hover:shadow-glow-emerald",
    spotlight:
      "radial-gradient(ellipse at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(16, 185, 129, 0.15) 0%, transparent 50%)",
  },
};

export function BentoCard({
  children,
  className,
  glowColor = "cyan",
  tiltStrength = 10,
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const glow = glowMap[glowColor];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Update spotlight position
    cardRef.current.style.setProperty("--mouse-x", `${x}%`);
    cardRef.current.style.setProperty("--mouse-y", `${y}%`);

    // Calculate tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY =
      ((e.clientX - rect.left - centerX) / centerX) * tiltStrength;
    const rotateX =
      ((centerY - (e.clientY - rect.top)) / centerY) * tiltStrength;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 md:p-8",
        "bg-zinc-900/50 backdrop-blur-md",
        "border border-zinc-800",
        "transition-all duration-300",
        glow.border,
        glow.shadow,
        isHovered && "scale-[1.02]",
        className,
      )}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isHovered
          ? "transform 0.1s ease-out"
          : "transform 0.5s ease-out",
        willChange: "transform",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spotlight overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: glow.spotlight,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Specular sheen */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300",
          "bg-gradient-to-br from-white/10 via-transparent to-transparent",
        )}
        style={{
          opacity: isHovered ? (Math.abs(tilt.y) / tiltStrength) * 0.3 : 0,
          transform: `translateX(${tilt.y * 0.5}px) translateY(${-tilt.x * 0.5}px)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
