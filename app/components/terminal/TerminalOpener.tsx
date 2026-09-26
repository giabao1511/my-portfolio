"use client";

import { Terminal as TerminalIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { useTerminal } from "./TerminalProvider";

interface TerminalOpenerProps {
  className?: string;
}

export function TerminalOpener({ className }: TerminalOpenerProps) {
  const { openTerminal } = useTerminal();

  return (
    <button
      onClick={openTerminal}
      className={cn(
        "flex items-center gap-2 px-6 py-3 rounded-full",
        "border border-accent-violet text-accent-violet",
        "hover:bg-accent-violet hover:text-zinc-950 hover:shadow-glow-violet",
        "transition-all duration-300 font-medium",
        className
      )}
    >
      <TerminalIcon className="w-5 h-5" />
      Open Terminal
    </button>
  );
}
