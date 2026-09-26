"use client";

import { motion } from "framer-motion";
import { TechArsenalGrid } from "./TechArsenalGrid";

export function TechArsenalSection() {
  return (
    <section id="tech" className="relative py-24 md:py-32">
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
            Tech Arsenal
          </h2>
          <p className="text-zinc-400 text-lg">
            Tools and technologies I work with
          </p>
        </motion.div>

        {/* Grid */}
        <TechArsenalGrid />
      </div>
    </section>
  );
}
