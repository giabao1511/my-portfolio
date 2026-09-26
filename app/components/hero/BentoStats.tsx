"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "../../lib/utils";
import { STATS } from "../../lib/constants";

const colorClasses = {
  cyan: "border-accent-cyan/30 hover:border-accent-cyan/60 hover:shadow-glow-cyan",
  violet: "border-accent-violet/30 hover:border-accent-violet/60 hover:shadow-glow-violet",
  emerald: "border-accent-emerald/30 hover:border-accent-emerald/60 hover:shadow-glow-emerald",
};

const iconColorClasses = {
  cyan: "text-accent-cyan",
  violet: "text-accent-violet",
  emerald: "text-accent-emerald",
};

export function BentoStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-8"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {STATS.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              className={cn(
                "relative p-6 md:p-8 rounded-2xl",
                "bg-zinc-900/50 backdrop-blur-sm",
                "border border-zinc-800",
                "transition-all duration-300",
                colorClasses[stat.color]
              )}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  },
                },
              }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Icon */}
              <div className="mb-4">
                <Icon className={cn("w-6 h-6 md:w-8 md:h-8", iconColorClasses[stat.color])} />
              </div>

              {/* Value */}
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl md:text-4xl lg:text-5xl font-bold font-mono text-zinc-50">
                  {stat.value}
                </span>
                {stat.unit && (
                  <span className="text-lg md:text-xl text-zinc-400">{stat.unit}</span>
                )}
              </div>

              {/* Label */}
              <p className="text-sm md:text-base text-zinc-400">{stat.label}</p>

              {/* Subtle gradient overlay */}
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                  stat.color === "cyan" && "bg-gradient-to-br from-accent-cyan/5 to-transparent",
                  stat.color === "violet" && "bg-gradient-to-br from-accent-violet/5 to-transparent",
                  stat.color === "emerald" && "bg-gradient-to-br from-accent-emerald/5 to-transparent"
                )}
              />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
