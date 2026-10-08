"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

interface LenisContextValue {
  lenis: Lenis | null;
  scrollY: number;
}

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  scrollY: 0,
});

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect -- Lenis requires DOM initialization, not derived state
    setLenis(lenisInstance);

    // Sync with GSAP ScrollTrigger
    lenisInstance.on("scroll", ScrollTrigger.update);

    // RAF loop with GSAP ticker
    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    // Also track scroll position for consumers
    lenisInstance.on("scroll", ({ scroll }: { scroll: number }) => {
      setScrollY(scroll);
    });

    // Refresh ScrollTrigger after init
    ScrollTrigger.refresh();

    // Handle anchor link navigation with smooth scroll
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href?.startsWith("#")) return;

      e.preventDefault();
      const element = document.querySelector(href);
      if (element && lenisInstance) {
        lenisInstance.scrollTo(element as HTMLElement, {
          duration: 1.2,
          offset: 0,
        });
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      gsap.ticker.remove((time) => {
        lenisInstance.raf(time * 1000);
      });
      lenisInstance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={{ lenis, scrollY }}>
      {children}
    </LenisContext.Provider>
  );
}

export function useLenis() {
  return useContext(LenisContext);
}
