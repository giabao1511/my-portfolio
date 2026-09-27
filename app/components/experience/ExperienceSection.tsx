"use client";

import { motion } from "framer-motion";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { HorizontalSection } from "../scroll/HorizontalSection";

export function ExperienceSection() {
  return (
    <section id="experience" className="relative">
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-24 md:pt-32">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-4">
            Experience
          </h2>
          <p className="text-zinc-400 text-lg">
            Building impactful products across industries
          </p>
        </motion.div>
      </div>

      {/* Horizontal scroll container */}
      <HorizontalSection className="pb-24 md:pb-32">
        <div className="w-[calc(50vw-2rem)] flex-shrink-0 md:w-[400px]">
          <div className="h-full flex items-center">
            <p className="text-zinc-500 text-sm uppercase tracking-wider">
              Scroll to explore →
            </p>
          </div>
        </div>
        <ExperienceTimeline />
      </HorizontalSection>
    </section>
  );
}
