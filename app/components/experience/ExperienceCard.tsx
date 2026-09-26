"use client";

import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface ExperienceCardProps {
  company: string;
  period: string;
  role: string;
  color: "cyan" | "violet" | "emerald";
  achievements: readonly string[];
  index: number;
}

const colorClasses = {
  cyan: {
    border: "border-accent-cyan/30 hover:border-accent-cyan/60",
    glow: "hover:shadow-glow-cyan",
    text: "text-accent-cyan",
  },
  violet: {
    border: "border-accent-violet/30 hover:border-accent-violet/60",
    glow: "hover:shadow-glow-violet",
    text: "text-accent-violet",
  },
  emerald: {
    border: "border-accent-emerald/30 hover:border-accent-emerald/60",
    glow: "hover:shadow-glow-emerald",
    text: "text-accent-emerald",
  },
};

export function ExperienceCard({
  company,
  period,
  role,
  color,
  achievements,
  index,
}: ExperienceCardProps) {
  const colors = colorClasses[color];

  const glowColor =
    color === "cyan"
      ? "rgba(6,182,212,0.5)"
      : color === "violet"
      ? "rgba(139,92,246,0.5)"
      : "rgba(16,185,129,0.5)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
      className={cn(
        "relative p-6 rounded-2xl",
        "bg-zinc-900/50 backdrop-blur-sm",
        "border border-zinc-800",
        "transition-all duration-300",
        colors.border,
        colors.glow
      )}
    >
      {/* Timeline node indicator */}
      <div
        className={cn(
          "absolute -left-3 top-8 w-6 h-6 rounded-full",
          "border-2 border-zinc-800 bg-zinc-950",
          colors.text
        )}
        style={{
          boxShadow: `0 0 15px ${glowColor}`,
        }}
      />

      {/* Company & Period */}
      <div className="mb-4">
        <span className={cn("text-xs font-medium tracking-wider uppercase", colors.text)}>
          {period}
        </span>
      </div>

      {/* Role */}
      <h3 className="text-xl font-bold text-zinc-50 mb-1">
        {role}
      </h3>

      {/* Company */}
      <p className="text-sm text-zinc-400 mb-4">
        {company}
      </p>

      {/* Achievements */}
      <ul className="space-y-2">
        {achievements.map((achievement, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
            <span className={cn("mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0", colors.text)} />
            {achievement}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
