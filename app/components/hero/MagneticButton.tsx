"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
  className?: string;
}

export function MagneticButton({
  children,
  variant = "primary",
  href = "#",
  className,
}: MagneticButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyles = cn(
    "relative px-8 py-3 rounded-full font-medium text-sm md:text-base tracking-wide",
    "transition-all duration-300 ease-out",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
    variant === "primary" && [
      "border border-accent-cyan text-accent-cyan",
      "hover:bg-accent-cyan hover:text-zinc-950 hover:shadow-glow-cyan",
    ],
    variant === "secondary" && [
      "border border-accent-violet text-accent-violet",
      "hover:bg-accent-violet hover:text-zinc-950 hover:shadow-glow-violet",
    ],
    className,
  );

  return (
    <motion.a
      href={href}
      className={baseStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <span className="relative z-10">{children}</span>

      {/* Glow effect on hover */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full opacity-0 transition-opacity duration-300",
          variant === "primary" ? "bg-accent-cyan/10" : "bg-accent-violet/10",
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />
    </motion.a>
  );
}
