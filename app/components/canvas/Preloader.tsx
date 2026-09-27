"use client";

import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const { progress, active } = useProgress();

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          {/* Logo/brand mark */}
          <motion.div
            className="w-16 h-16 mb-8 rounded-full border-2 border-accent-cyan flex items-center justify-center"
            animate={{
              boxShadow: [
                "0 0 20px rgba(6, 182, 212, 0.2)",
                "0 0 40px rgba(6, 182, 212, 0.4)",
                "0 0 20px rgba(6, 182, 212, 0.2)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xl font-mono font-bold text-accent-cyan">
              GB
            </span>
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-cyan to-accent-violet"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Percentage */}
          <p className="mt-4 font-mono text-sm text-zinc-500">
            Initializing... {Math.round(progress)}%
          </p>

          {/* Animated dots */}
          <div className="flex gap-1 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-accent-cyan"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
