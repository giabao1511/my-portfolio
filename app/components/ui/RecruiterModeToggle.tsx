"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Sparkles } from "lucide-react";
import { useRecruiterMode } from "../../contexts/RecruiterModeContext";
import { cn } from "../../lib/utils";

export function RecruiterModeToggle() {
  const { isEnabled, toggle } = useRecruiterMode();

  return (
    <motion.button
      onClick={toggle}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "flex items-center gap-2 px-4 py-2.5",
        "rounded-full font-mono text-sm font-medium",
        "transition-all duration-300",
        "border backdrop-blur-sm",
        isEnabled
          ? "bg-accent-emerald/20 border-accent-emerald/50 text-accent-emerald"
          : "bg-zinc-900/80 border-zinc-700 text-zinc-300 hover:border-zinc-500"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isEnabled ? "Switch to Interactive 3D mode" : "Switch to Recruiter Mode"}
    >
      <AnimatePresence mode="wait">
        {isEnabled ? (
          <motion.span
            key="recruiter"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" />
            <span>Recruiter Mode</span>
          </motion.span>
        ) : (
          <motion.span
            key="interactive"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Interactive 3D</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
