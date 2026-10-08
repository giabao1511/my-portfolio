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
  const [isEnabled, setIsEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) === "true";
    }
    return false;
  });
  const toggle = () => setIsEnabled((prev) => !prev);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isEnabled));
  }, [isEnabled]);

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
