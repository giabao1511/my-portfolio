"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { Terminal } from "./Terminal";

interface TerminalContextValue {
  openTerminal: () => void;
}

const TerminalContext = createContext<TerminalContextValue>({
  openTerminal: () => {},
});

export function useTerminal() {
  return useContext(TerminalContext);
}

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const openTerminal = useCallback(() => setIsTerminalOpen(true), []);
  const closeTerminal = useCallback(() => setIsTerminalOpen(false), []);
  const toggleTerminal = useCallback(
    () => setIsTerminalOpen((prev) => !prev),
    [],
  );

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if we're in an input field
      const target = e.target as HTMLElement;
      const isInputField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Open terminal with backtick (only if not in input)
      if (e.key === "`" && !isInputField) {
        e.preventDefault();
        toggleTerminal();
      }

      // Close terminal with Escape
      if (e.key === "Escape" && isTerminalOpen) {
        closeTerminal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTerminalOpen, toggleTerminal, closeTerminal]);

  return (
    <TerminalContext.Provider value={{ openTerminal }}>
      {children}
      <Terminal isOpen={isTerminalOpen} onClose={closeTerminal} />
    </TerminalContext.Provider>
  );
}
