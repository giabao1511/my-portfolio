"use client";

import { useState, useEffect } from "react";

export type PerformanceTier = "high" | "low";

export function usePerformanceTier(): PerformanceTier {
  const [tier, setTier] = useState<PerformanceTier>("high");

  useEffect(() => {
    const detectPerformance = (): PerformanceTier => {
      // Check hardware concurrency
      const cores = navigator.hardwareConcurrency || 4;

      // Check device memory (Chrome only)
      const memory =
        (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 8;

      // Check for mobile/tablet
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      // Low tier: fewer cores, less memory, or mobile
      if (cores <= 4 || memory <= 4 || isMobile) {
        return "low";
      }

      return "high";
    };

    setTier(detectPerformance());
  }, []);

  return tier;
}

export function useVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  const [isTabActive, setIsTabActive] = useState(true);

  useEffect(() => {
    // Intersection Observer for viewport visibility
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        setIsVisible(entry.isIntersecting);
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });

    // Observe the canvas element
    const canvas = document.querySelector("canvas");
    if (canvas) {
      observer.observe(canvas);
    }

    // Visibility change for tab focus
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return { isVisible, isTabActive };
}
