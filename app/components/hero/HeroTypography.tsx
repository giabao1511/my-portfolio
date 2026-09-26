"use client";

import { motion } from "framer-motion";
import { PROFILE } from "../../lib/constants";

export function HeroTypography() {
  const words = PROFILE.tagline.split(" ");

  return (
    <motion.div
      className="relative z-10 flex flex-col items-center gap-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
        className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-glow-cyan"
      >
        {PROFILE.name}
      </motion.h1>

      {/* Role */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
        className="text-lg md:text-xl lg:text-2xl text-accent-cyan font-medium tracking-wide"
      >
        {PROFILE.role}
      </motion.p>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
        className="max-w-3xl px-4"
      >
        <p className="text-sm md:text-base lg:text-lg text-zinc-400 leading-relaxed">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.03, duration: 0.3, ease: "easeOut" }}
              className="inline-block mr-2"
            >
              {word}
            </motion.span>
          ))}
        </p>
      </motion.div>
    </motion.div>
  );
}
