"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "./ContactForm";

export function ContactSection() {
  return (
    <section id="contact" className="relative py-24 md:py-32">
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
            Get In Touch
          </h2>
          <p className="text-zinc-400 text-lg">
            Have a project in mind? Let&apos;s talk.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-zinc-50">
              Let&apos;s Connect
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              I&apos;m always interested in hearing about new projects and opportunities.
              Whether you have a question or just want to say hi, I&apos;ll try my best
              to get back to you!
            </p>

            <div className="space-y-4">
              <a
                href="mailto:giabao712411@gmail.com"
                className="flex items-center gap-4 text-zinc-300 hover:text-accent-cyan transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-accent-cyan" />
                </div>
                <span>giabao712411@gmail.com</span>
              </a>

              <div className="flex items-center gap-4 text-zinc-500">
                <div className="w-12 h-12 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-zinc-500" />
                </div>
                <span>+84 339 253 073</span>
              </div>

              <div className="flex items-center gap-4 text-zinc-500">
                <div className="w-12 h-12 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-zinc-500" />
                </div>
                <span>Ho Chi Minh City, Vietnam</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8">
              <ContactForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
