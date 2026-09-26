"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "../../lib/utils";
import {
  Code,
  Globe,
  Server,
  FileCode,
  Database,
  Cloud,
  Box,
  GitBranch,
} from "lucide-react";

interface TechCardProps {
  name: string;
  category: string;
  rating: number;
  years: string;
  color: "cyan" | "violet" | "emerald";
  index: number;
}

const iconMap: Record<string, React.ElementType> = {
  Code,
  Globe,
  Server,
  FileCode,
  Database,
  Cloud,
  Box,
  GitBranch,
};

const colorClasses = {
  cyan: {
    border: "border-accent-cyan/30 hover:border-accent-cyan/60",
    glow: "hover:shadow-glow-cyan",
    text: "text-accent-cyan",
    bg: "bg-accent-cyan/5",
  },
  violet: {
    border: "border-accent-violet/30 hover:border-accent-violet/60",
    glow: "hover:shadow-glow-violet",
    text: "text-accent-violet",
    bg: "bg-accent-violet/5",
  },
  emerald: {
    border: "border-accent-emerald/30 hover:border-accent-emerald/60",
    glow: "hover:shadow-glow-emerald",
    text: "text-accent-emerald",
    bg: "bg-accent-emerald/5",
  },
};

export function TechCard({ name, category, rating, years, color, index }: TechCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(x, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const Icon = iconMap[name] || Code;
  const colors = colorClasses[color];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative p-6 rounded-2xl cursor-pointer",
        "bg-zinc-900/50 backdrop-blur-sm",
        "border border-zinc-800",
        "transition-all duration-300",
        colors.border,
        colors.glow
      )}
    >
      {/* Glow effect on hover */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300",
          colors.bg,
          isHovered && "opacity-100"
        )}
      />

      <div style={{ transform: "translateZ(20px)" }}>
        {/* Icon */}
        <div className={cn("mb-4", colors.text)}>
          <Icon className="w-8 h-8" />
        </div>

        {/* Name */}
        <h3 className="text-lg font-bold text-zinc-50 mb-1">
          {name}
        </h3>

        {/* Category */}
        <p className="text-xs text-zinc-500 mb-3">
          {category}
        </p>

        {/* Rating */}
        <div className="flex gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "text-lg",
                i < rating ? colors.text : "text-zinc-700"
              )}
            >
              ★
            </span>
          ))}
        </div>

        {/* Years */}
        <p className="text-sm text-zinc-400">
          {years} years
        </p>
      </div>
    </motion.div>
  );
}
