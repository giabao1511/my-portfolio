"use client";

import { motion } from "framer-motion";
import { MapPin, Zap, Heart } from "lucide-react";
import { cn } from "../../lib/utils";

const values = ["Clean Architecture", "Type-Safe Code", "Performance First"];

const interests = [
  "Open Source",
  "Distributed Systems",
  "Developer Experience",
  "Startup Culture",
];

const colorClasses = {
  cyan: "border-accent-cyan/30 text-accent-cyan",
  violet: "border-accent-violet/30 text-accent-violet",
  emerald: "border-accent-emerald/30 text-accent-emerald",
};

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-4">
            About
          </h2>
          <p className="text-zinc-400 text-lg">The person behind the code</p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-square max-w-md mx-auto rounded-2xl bg-gradient-to-br from-accent-cyan/20 via-accent-violet/20 to-accent-emerald/20 border border-zinc-800 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-accent-cyan to-accent-violet flex items-center justify-center mb-4">
                  <span className="text-5xl font-bold text-zinc-950">GB</span>
                </div>
                <p className="text-zinc-400">Chau Gia Bao</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Bio */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-zinc-50 mb-4">
              The Builder&apos;s Mindset
            </h3>
            <p className="text-zinc-300 leading-relaxed mb-6">
              I believe in clean architecture, type-safe code, and
              performance-first engineering. Beyond code, I&apos;m exploring the
              startup culture in Vietnam and building things that matter.
            </p>

            {/* Values */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">
                Core Values
              </h4>
              <div className="flex flex-wrap gap-2">
                {values.map((value, i) => (
                  <motion.span
                    key={value}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm border",
                      colorClasses.cyan,
                    )}
                  >
                    {value}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">
                Interests
              </h4>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, i) => (
                  <motion.span
                    key={interest}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm border",
                      colorClasses.violet,
                    )}
                  >
                    {interest}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent-cyan" />
                <span>Ho Chi Minh City, Vietnam</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent-emerald" />
                <span>Open to opportunities</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
