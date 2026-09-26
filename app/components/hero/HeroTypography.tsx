"use client";

import { motion } from "framer-motion";
import { PROFILE } from "@/lib/constants";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function HeroTypography() {
  const words = PROFILE.tagline.split(" ");

  return (
    <motion.div
      className="relative z-10 flex flex-col items-center gap-6 text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Name */}
      <motion.h1
        variants={itemVariants}
        className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-glow-cyan"
      >
        {PROFILE.name}
      </motion.h1>

      {/* Role */}
      <motion.p
        variants={itemVariants}
        className="text-lg md:text-xl lg:text-2xl text-accent-cyan font-medium tracking-wide"
      >
        {PROFILE.role}
      </motion.p>

      {/* Tagline */}
      <motion.div
        variants={itemVariants}
        className="max-w-3xl px-4"
      >
        <p className="text-sm md:text-base lg:text-lg text-zinc-400 leading-relaxed">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.03 }}
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
