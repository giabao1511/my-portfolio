"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface RecruiterModeContextType {
  isEnabled: boolean;
  toggle: () => void;
}

const RecruiterModeContext = createContext<
  RecruiterModeContextType | undefined
>(undefined);

const STORAGE_KEY = "recruiter-mode";

export function RecruiterModeProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydration-safe: read from localStorage only after mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setIsEnabled(true);
    }
    setMounted(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, String(isEnabled));
    }
  }, [isEnabled, mounted]);

  const toggle = () => setIsEnabled((prev) => !prev);

  return (
    <RecruiterModeContext.Provider value={{ isEnabled, toggle }}>
      {children}
    </RecruiterModeContext.Provider>
  );
}

export function useRecruiterMode() {
  const context = useContext(RecruiterModeContext);
  if (context === undefined) {
    throw new Error(
      "useRecruiterMode must be used within RecruiterModeProvider",
    );
  }
  return context;
}
