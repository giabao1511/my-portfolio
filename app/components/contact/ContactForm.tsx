"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      toast.success("Message received!", {
        description: "I will get back to you within 24 hours.",
        duration: 5000,
      });

      setIsSuccess(true);
      reset();
    } catch (error) {
      toast.error("Failed to send message", {
        description: error instanceof Error ? error.message : "Please try again later.",
        duration: 5000,
      });
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent-emerald/20 flex items-center justify-center"
        >
          <CheckCircle className="w-8 h-8 text-accent-emerald" />
        </motion.div>
        <h3 className="text-2xl font-bold text-zinc-50 mb-2">Message Sent!</h3>
        <p className="text-zinc-400">
          Thanks for reaching out. I&apos;ll get back to you soon.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-zinc-300 mb-2"
        >
          Name <span className="text-accent-cyan">*</span>
        </label>
        <input
          type="text"
          id="name"
          {...register("name")}
          className={cn(
            "w-full px-4 py-3 rounded-xl bg-zinc-900/50 border text-zinc-50",
            "focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 transition-all",
            errors.name
              ? "border-red-500"
              : "border-zinc-800 focus:border-accent-cyan",
          )}
          placeholder="Your name"
        />
        <AnimatePresence>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.name.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-zinc-300 mb-2"
        >
          Email <span className="text-accent-cyan">*</span>
        </label>
        <input
          type="email"
          id="email"
          {...register("email")}
          className={cn(
            "w-full px-4 py-3 rounded-xl bg-zinc-900/50 border text-zinc-50",
            "focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 transition-all",
            errors.email
              ? "border-red-500"
              : "border-zinc-800 focus:border-accent-cyan",
          )}
          placeholder="your.email@example.com"
        />
        <AnimatePresence>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.email.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-zinc-300 mb-2"
        >
          Subject
        </label>
        <input
          type="text"
          id="subject"
          {...register("subject")}
          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-50 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:border-accent-cyan transition-all"
          placeholder="What's this about?"
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-zinc-300 mb-2"
        >
          Message <span className="text-accent-cyan">*</span>
        </label>
        <textarea
          id="message"
          {...register("message")}
          rows={5}
          className={cn(
            "w-full px-4 py-3 rounded-xl bg-zinc-900/50 border text-zinc-50 resize-none",
            "focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 transition-all",
            errors.message
              ? "border-red-500"
              : "border-zinc-800 focus:border-accent-cyan",
          )}
          placeholder="Tell me about your project..."
        />
        <AnimatePresence>
          {errors.message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.message.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
          "bg-accent-cyan text-zinc-950 hover:shadow-glow-cyan",
          isSubmitting && "opacity-70 cursor-not-allowed",
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
