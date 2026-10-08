"use client";

import { useState, useRef, useEffect, type SubmitEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  executeCommand,
  getWelcomeMessage,
  type CommandOutput,
} from "./terminal-commands";

interface TerminalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

interface HistoryEntry {
  input: string;
  outputs: CommandOutput[];
}

export function Terminal({ isOpen, onClose }: TerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  // Initialize with welcome message and focus input
  useEffect(() => {
    if (isOpen) {
      // Only initialize once when terminal opens
      if (!isInitializedRef.current) {
        setHistory([{ input: "", outputs: getWelcomeMessage() }]);
        isInitializedRef.current = true;
      }
      // Focus with a small delay to ensure DOM is ready
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Reset state when closed (deferred to avoid synchronous setState)
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setHistory([]);
        setInput("");
        isInitializedRef.current = false;
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Scroll to bottom of history
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput && trimmedInput !== "clear") {
      setHistory((prev) => [...prev, { input: "", outputs: [] }]);
      setInput("");
      return;
    }

    const outputs = executeCommand(trimmedInput);

    // Check for exit command
    if (outputs.some((o) => o.type === "exit")) {
      setTimeout(onClose, 100);
      setHistory([]);
      setInput("");
      return;
    }

    // Check for clear command
    if (outputs.some((o) => o.type === "clear")) {
      setHistory([]);
      setInput("");
      return;
    }

    // Check for download command
    const downloadOutput = outputs.find((o) => o.type === "download");
    if (downloadOutput) {
      // Trigger file download
      const link = document.createElement("a");
      link.href = downloadOutput.text;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setHistory((prev) => [...prev, { input: trimmedInput, outputs }]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60"
            onClick={onClose}
          />

          {/* Terminal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-[61]"
            onKeyDown={handleKeyDown}
          >
            <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
              {/* Title Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-zinc-800/50 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm text-zinc-400 font-mono">
                  bao@portfolio:~
                </span>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-zinc-700 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-400" />
                </button>
              </div>

              {/* Terminal Content */}
              <div className="p-4 h-96 overflow-y-auto font-mono text-sm">
                {/* History */}
                {history.map((entry, i) => (
                  <div key={i} className="mb-4">
                    {entry.input && (
                      <div className="flex gap-2">
                        <span className="text-accent-cyan">$</span>
                        <span className="text-zinc-50">{entry.input}</span>
                      </div>
                    )}
                    {entry.outputs.map((output, j) => (
                      <div
                        key={j}
                        className={cn(
                          "whitespace-pre-wrap",
                          output.type === "error" && "text-red-400",
                          output.type === "success" && "text-accent-emerald",
                          output.type === "output" && "text-zinc-300",
                        )}
                      >
                        {output.text}
                      </div>
                    ))}
                  </div>
                ))}

                {/* Input */}
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <span className="text-accent-cyan">$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-zinc-50 caret-accent-cyan"
                    autoFocus
                    spellCheck={false}
                  />
                </form>
                <div ref={historyEndRef} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
