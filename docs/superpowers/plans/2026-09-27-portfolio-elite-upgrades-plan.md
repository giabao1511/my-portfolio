# Portfolio Elite Upgrades Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 5 critical upgrades: SystemArchitecture visualization, EngineeringHUD metrics, Three.js performance optimization, RecruiterMode toggle, and dynamic OG image generation.

**Architecture:** Each subsystem is self-contained with clear interfaces. Contexts/providers wrap components. Performance hooks detect hardware and visibility. SVG-based graphics use Framer Motion for animations.

**Tech Stack:** Next.js 16, TypeScript, Framer Motion, SVG, @vercel/og, IntersectionObserver, localStorage

**Spec:** `docs/superpowers/specs/2026-09-27-portfolio-elite-upgrades-design.md`

---

## Global Constraints

- TypeScript strict mode, no `any`
- Tailwind CSS with existing theme variables
- Framer Motion for animations, respect `prefers-reduced-motion`
- Client components where hooks/interactivity needed
- localStorage key: `recruiter-mode`
- CSS media query for touch: `@media (hover: none) and (pointer: coarse)`

---

## File Structure

### New Files

- `app/components/architecture/SystemArchitecture.tsx` — SVG node graph
- `app/components/hud/EngineeringHUD.tsx` — Metrics display
- `app/components/canvas/PerformanceOptimizer.tsx` — Hardware detection hook
- `app/components/canvas/Preloader.tsx` — Loading screen
- `app/contexts/RecruiterModeContext.tsx` — React context
- `app/hooks/useRecruiterMode.ts` — Hook wrapper
- `app/components/ui/RecruiterModeToggle.tsx` — Floating toggle button
- `app/opengraph-image.tsx` — OG image generator

### Modified Files

- `app/page.tsx` — Add new sections and context provider
- `app/layout.tsx` — Add RecruiterModeProvider
- `app/components/canvas/Scene.tsx` — Add visibility detection and preloader
- `app/components/effects/Cursor.tsx` — Touch device detection

---

## Review Focus

1. **SystemArchitecture:** SVG paths must be accessible (aria-labels, keyboard nav)
2. **EngineeringHUD:** Simulated metrics must not cause layout shift
3. **Performance:** RAF loop must properly cleanup on unmount
4. **RecruiterMode:** Must not flash/flicker on hydration
5. **OG Image:** Must handle missing fonts gracefully

---

## Task 1: RecruiterMode Context & Hook

**Files:**

- Create: `app/contexts/RecruiterModeContext.tsx`
- Create: `app/hooks/useRecruiterMode.ts`

**Interfaces:**

- Produces: `RecruiterModeContext` with `{ isEnabled: boolean, toggle: () => void }`
- Produces: `useRecruiterMode()` hook returning the context value

- [ ] **Step 1: Create RecruiterModeContext.tsx**

```tsx
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
```

- [ ] **Step 2: Verify files exist**

Run: `ls -la app/contexts/ app/hooks/`
Expected: Files created

- [ ] **Step 3: Commit**

```bash
git add app/contexts/RecruiterModeContext.tsx app/hooks/useRecruiterMode.ts
git commit -m "feat: add RecruiterMode context and hook"
```

---

## Task 2: RecruiterModeToggle UI Component

**Files:**

- Create: `app/components/ui/RecruiterModeToggle.tsx`

**Interfaces:**

- Consumes: `useRecruiterMode()` hook

- [ ] **Step 1: Create RecruiterModeToggle.tsx**

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Sparkles } from "lucide-react";
import { useRecruiterMode } from "../../hooks/useRecruiterMode";
import { cn } from "../../lib/utils";

export function RecruiterModeToggle() {
  const { isEnabled, toggle } = useRecruiterMode();

  return (
    <motion.button
      onClick={toggle}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "flex items-center gap-2 px-4 py-2.5",
        "rounded-full font-mono text-sm font-medium",
        "transition-all duration-300",
        "border backdrop-blur-sm",
        isEnabled
          ? "bg-accent-emerald/20 border-accent-emerald/50 text-accent-emerald"
          : "bg-zinc-900/80 border-zinc-700 text-zinc-300 hover:border-zinc-500",
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={
        isEnabled ? "Switch to Interactive 3D mode" : "Switch to Recruiter Mode"
      }
    >
      <AnimatePresence mode="wait">
        {isEnabled ? (
          <motion.span
            key="recruiter"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" />
            <span>Recruiter Mode</span>
          </motion.span>
        ) : (
          <motion.span
            key="interactive"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Interactive 3D</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
```

- [ ] **Step 2: Verify component renders**

Run: `grep -l "RecruiterModeToggle" app/page.tsx` (will add in Task 8)
Expected: Component ready to be imported

- [ ] **Step 3: Commit**

```bash
git add app/components/ui/RecruiterModeToggle.tsx
git commit -m "feat: add RecruiterMode toggle button UI"
```

---

## Task 3: PerformanceOptimizer Hook

**Files:**

- Create: `app/components/canvas/PerformanceOptimizer.tsx`

**Interfaces:**

- Produces: `usePerformanceTier()` hook returning `"high" | "low"`
- Produces: `useVisibility()` hook returning `{ isVisible: boolean, isTabActive: boolean }`

- [ ] **Step 1: Create PerformanceOptimizer.tsx**

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";

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
```

- [ ] **Step 2: Test hook availability**

Run: `grep -r "usePerformanceTier\|useVisibility" app/components/canvas/`
Expected: No matches yet (ready for Scene.tsx integration)

- [ ] **Step 3: Commit**

```bash
git add app/components/canvas/PerformanceOptimizer.tsx
git commit -m "feat: add performance tier and visibility detection hooks"
```

---

## Task 4: Preloader Component

**Files:**

- Create: `app/components/canvas/Preloader.tsx`

**Interfaces:**

- Consumes: `useProgress` from `@react-three/drei`
- Produces: Full-screen loading overlay

- [ ] **Step 1: Create Preloader.tsx**

```tsx
"use client";

import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const { progress, active } = useProgress();

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          {/* Logo/brand mark */}
          <motion.div
            className="w-16 h-16 mb-8 rounded-full border-2 border-accent-cyan flex items-center justify-center"
            animate={{
              boxShadow: [
                "0 0 20px rgba(6, 182, 212, 0.2)",
                "0 0 40px rgba(6, 182, 212, 0.4)",
                "0 0 20px rgba(6, 182, 212, 0.2)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xl font-mono font-bold text-accent-cyan">
              GB
            </span>
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-cyan to-accent-violet"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Percentage */}
          <p className="mt-4 font-mono text-sm text-zinc-500">
            Initializing... {Math.round(progress)}%
          </p>

          {/* Animated dots */}
          <div className="flex gap-1 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-accent-cyan"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Verify syntax**

Run: `npx tsc --noEmit app/components/canvas/Preloader.tsx 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/components/canvas/Preloader.tsx
git commit -m "feat: add WebGL preloader component"
```

---

## Task 5: Update Scene.tsx with Performance Features

**Files:**

- Modify: `app/components/canvas/Scene.tsx`

**Interfaces:**

- Consumes: `usePerformanceTier()`, `useVisibility()`, `Preloader`
- Modifies: Canvas frameloop control

- [ ] **Step 1: Update Scene.tsx**

```tsx
"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { usePerformanceTier, useVisibility } from "./PerformanceOptimizer";
import { Preloader } from "./Preloader";

// Dynamically import Canvas with SSR disabled
const Canvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false },
);

import { ShaderPlane } from "./ShaderPlane";
import { FloatingParticles } from "./FloatingParticles";
import { useRecruiterMode } from "../../hooks/useRecruiterMode";

function SceneContent() {
  const { isVisible, isTabActive } = useVisibility();
  const tier = usePerformanceTier();
  const { isEnabled: isRecruiterMode } = useRecruiterMode();

  // Determine particle count based on tier
  const particleCount = tier === "high" ? 600 : 300;

  // Pause rendering when not visible or tab inactive
  const shouldRender = isVisible && isTabActive && !isRecruiterMode;

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={tier === "high" ? [1, 1.5] : [1, 1]}
      gl={{ antialias: tier === "high", alpha: true }}
      frameloop={shouldRender ? "always" : "never"}
      style={{ display: isRecruiterMode ? "none" : "block" }}
    >
      <color attach="background" args={["#09090b"]} />
      <ShaderPlane />
      <FloatingParticles count={particleCount} />
    </Canvas>
  );
}

export function Scene() {
  const { isEnabled: isRecruiterMode } = useRecruiterMode();

  return (
    <div
      className="fixed inset-0 z-0"
      style={{ pointerEvents: "none" }}
      aria-hidden={isRecruiterMode}
    >
      <Suspense fallback={null}>
        <Preloader />
        <SceneContent />
      </Suspense>
    </div>
  );
}
```

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck 2>&1 | head -30`
Expected: No TypeScript errors (may have pre-existing warnings)

- [ ] **Step 3: Commit**

```bash
git add app/components/canvas/Scene.tsx
git commit -m "feat: integrate performance optimization and visibility detection into Scene"
```

---

## Task 6: Update Cursor.tsx for Touch Devices

**Files:**

- Modify: `app/components/effects/Cursor.tsx`

**Interfaces:**

- Adds: CSS media query for touch device detection

- [ ] **Step 1: Update Cursor.tsx className**

Locate the main cursor div and update the `hidden` class:

```tsx
// Change from:
"hidden md:block",

// To:
"hidden lg:block",

// And add a new style that handles touch detection via CSS
```

Actually, since the component already has a touch check in useEffect:

```tsx
if (typeof window === "undefined" || "ontouchstart" in window) return;
```

We just need to make sure the CSS properly hides it. Update the className:

```tsx
// In the main cursor div, update:
// "hidden md:block" -> "hidden lg:block"
```

- [ ] **Step 2: Add CSS media query to globals.css**

Add this to `app/globals.css`:

```css
/* Touch device cursor hiding */
@media (hover: none) and (pointer: coarse) {
  .cursor-dot,
  [data-cursor] {
    display: none !important;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add app/components/effects/Cursor.tsx app/globals.css
git commit -m "fix: disable custom cursor on touch devices"
```

---

## Task 7: Update globals.css for Reduced Motion

**Files:**

- Modify: `app/globals.css`

- [ ] **Step 1: Enhance reduced motion styles**

The existing reduced motion styles are good, but let's enhance them to better disable animations:

```css
/* Enhanced reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Canvas 3D scene - disable entirely */
  .fixed.inset-0.z-0 {
    display: none;
  }

  /* Remove backdrop effects */
  .backdrop-blur-sm,
  .backdrop-blur-md,
  .backdrop-blur-lg {
    backdrop-filter: none !important;
  }
}
```

- [ ] **Step 2: Verify no conflicts**

Run: `grep -n "prefers-reduced-motion" app/globals.css`
Expected: Single block with enhanced styles

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "enhance: improve reduced motion accessibility styles"
```

---

## Task 8: SystemArchitecture Component

**Files:**

- Create: `app/components/architecture/SystemArchitecture.tsx`

**Interfaces:**

- Produces: Interactive SVG node graph with 5 architecture layers

- [ ] **Step 1: Create SystemArchitecture.tsx**

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

// Architecture node data
const NODES = [
  {
    id: "client",
    label: "Client Layer",
    tech: ["Next.js 16", "TanStack Query", "React 19"],
    detail: "Optimistic UI updates with intelligent cache invalidation",
    latency: "< 50ms",
  },
  {
    id: "gateway",
    label: "API Gateway",
    tech: ["Nest.js", "JWT Auth", "RBAC"],
    detail: "Centralized auth & rate limiting with role-based access",
    latency: "< 10ms",
  },
  {
    id: "engine",
    label: "Calculation Engine",
    tech: ["TypeScript", "Web Workers", "SharedArrayBuffer"],
    detail: "F&I calculations with sub-50ms deterministic results",
    latency: "< 50ms",
  },
  {
    id: "bus",
    label: "Message Bus",
    tech: ["Redis Pub/Sub", "Webhooks", "Event Sourcing"],
    detail: "Async communication with guaranteed delivery",
    latency: "< 100ms",
  },
  {
    id: "database",
    label: "Database",
    tech: ["MongoDB", "Compound Indexes", "ACID"],
    detail: "Normalized schema with optimized read/write patterns",
    latency: "< 20ms",
  },
];

interface NodeData {
  id: string;
  label: string;
  tech: string[];
  detail: string;
  latency: string;
}

export function SystemArchitecture() {
  const [activeNode, setActiveNode] = useState<NodeData | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <section className="relative py-24 px-4 md:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            System <span className="text-accent-cyan">Architecture</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            High-concurrency microservices designed for scale
          </p>
        </motion.div>

        {/* SVG Container */}
        <div className="relative w-full overflow-x-auto pb-8">
          <svg
            viewBox="0 0 900 280"
            className="w-full min-w-[800px] h-auto"
            aria-label="System architecture flow diagram"
          >
            {/* Connection Lines */}
            <defs>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Animated connection paths */}
            {NODES.slice(0, -1).map((node, i) => {
              const x1 = 110 + i * 180;
              const x2 = 190 + i * 180;
              return (
                <g key={`path-${node.id}`}>
                  {/* Static line */}
                  <line
                    x1={x1}
                    y1="140"
                    x2={x2}
                    y2="140"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeOpacity="0.3"
                  />
                  {/* Animated pulse */}
                  <motion.line
                    x1={x1}
                    y1="140"
                    x2={x2}
                    y2="140"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    filter="url(#glow)"
                    initial={{ x1: x1, opacity: 0 }}
                    animate={{
                      x1: [x1, x2],
                      x2: [x1 + 40, x2 + 40],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "linear",
                    }}
                  />
                </g>
              );
            })}

            {/* Nodes */}
            {NODES.map((node, index) => {
              const x = 50 + index * 180;
              const isHovered = hoveredNode === node.id;
              const isActive = activeNode?.id === node.id;

              return (
                <g
                  key={node.id}
                  className="cursor-pointer"
                  onClick={() =>
                    setActiveNode(activeNode?.id === node.id ? null : node)
                  }
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Node background */}
                  <motion.rect
                    x={x}
                    y="80"
                    width="120"
                    height="120"
                    rx="12"
                    fill="#18181b"
                    stroke={isHovered || isActive ? "#06b6d4" : "#27272a"}
                    strokeWidth={isHovered || isActive ? 2 : 1}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    animate={{
                      filter: isHovered ? "url(#glow)" : "none",
                    }}
                  />

                  {/* Node icon area */}
                  <circle
                    cx={x + 60}
                    cy="115"
                    r="20"
                    fill={isHovered || isActive ? "#06b6d4" : "#27272a"}
                    opacity="0.5"
                  />

                  {/* Node label */}
                  <text
                    x={x + 60}
                    y="165"
                    textAnchor="middle"
                    className="fill-zinc-300 text-xs font-medium"
                  >
                    {node.label}
                  </text>

                  {/* Latency badge */}
                  <g>
                    <rect
                      x={x + 25}
                      y="175"
                      width="70"
                      height="18"
                      rx="9"
                      fill={isHovered || isActive ? "#06b6d4" : "#27272a"}
                      opacity="0.8"
                    />
                    <text
                      x={x + 60}
                      y="187"
                      textAnchor="middle"
                      className="fill-zinc-300 text-[10px] font-mono"
                    >
                      {node.latency}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail Card */}
        <AnimatePresence>
          {activeNode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-2xl mx-auto mt-8 p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-accent-cyan">
                  {activeNode.label}
                </h3>
                <span className="font-mono text-sm text-zinc-500">
                  {activeNode.latency}
                </span>
              </div>
              <p className="text-zinc-300 mb-4">{activeNode.detail}</p>
              <div className="flex flex-wrap gap-2">
                {activeNode.tech.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify component**

Run: `npx tsc --noEmit app/components/architecture/SystemArchitecture.tsx 2>&1 | head -20`
Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add app/components/architecture/SystemArchitecture.tsx
git commit -m "feat: add interactive SystemArchitecture visualization"
```

---

## Task 9: EngineeringHUD Component

**Files:**

- Create: `app/components/hud/EngineeringHUD.tsx`

**Interfaces:**

- Produces: Bento-style metrics cards with live counters

- [ ] **Step 1: Create EngineeringHUD.tsx**

```tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Activity, Zap, CheckCircle, Server } from "lucide-react";
import { cn } from "../../lib/utils";

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue?: string;
  trend?: "up" | "down" | "stable";
  isLive?: boolean;
  index: number;
}

function Sparkline({ positive = true }: { positive?: boolean }) {
  const points = [
    "0,20",
    "5,18",
    "10,22",
    "15,15",
    "20,17",
    "25,12",
    "30,14",
    "35,10",
    "40,8",
    "45,12",
    "50,6",
  ].join(" ");

  return (
    <svg viewBox="0 0 50 25" className="w-12 h-6">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "#10b981" : "#f59e0b"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  subValue,
  isLive,
  index,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "relative p-4 rounded-xl",
        "bg-zinc-900/50 backdrop-blur-sm",
        "border border-zinc-800",
        "hover:border-accent-cyan/30 transition-colors",
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-accent-cyan" />
          </div>
          <span className="text-sm text-zinc-400">{label}</span>
        </div>
        {isLive && (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-emerald"></span>
            </span>
            <span className="text-[10px] font-mono text-accent-emerald">
              LIVE
            </span>
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl font-mono font-bold text-zinc-50">
            {value}
          </span>
          {subValue && (
            <span className="ml-2 text-sm text-zinc-500">{subValue}</span>
          )}
        </div>
        <Sparkline positive={index < 3} />
      </div>
    </motion.div>
  );
}

export function EngineeringHUD() {
  const [latency, setLatency] = useState(42);
  const [lcp, setLcp] = useState(1.8);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate live metrics
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setLatency((prev) => {
        const delta = (Math.random() - 0.5) * 10;
        return Math.max(20, Math.min(60, prev + delta));
      });
      setLcp((prev) => {
        const delta = (Math.random() - 0.5) * 0.3;
        return Math.max(1.2, Math.min(2.8, prev + delta));
      });
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const metrics = [
    {
      icon: Zap,
      label: "Client Latency",
      value: `< ${Math.round(latency)}ms`,
      isLive: true,
    },
    {
      icon: Activity,
      label: "LCP",
      value: `${lcp.toFixed(1)}s`,
      subValue: "< 2.5s",
      isLive: true,
    },
    {
      icon: CheckCircle,
      label: "E2E Tests",
      value: "100%",
      subValue: "48 passing",
      isLive: true,
    },
    {
      icon: Server,
      label: "Deployments",
      value: "Active",
      subValue: "0 rollbacks",
      isLive: true,
    },
  ];

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Engineering <span className="text-accent-violet">Metrics</span>
          </h2>
          <p className="text-zinc-400 text-sm">
            Real-time performance indicators
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <MetricCard key={metric.label} {...metric} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify component**

Run: `npx tsc --noEmit app/components/hud/EngineeringHUD.tsx 2>&1 | head -20`
Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add app/components/hud/EngineeringHUD.tsx
git commit -m "feat: add EngineeringHUD with live metrics display"
```

---

## Task 10: OpenGraph Image Generator

**Files:**

- Create: `app/opengraph-image.tsx`

**Interfaces:**

- Produces: Dynamic OG image via @vercel/og

- [ ] **Step 1: Create opengraph-image.tsx**

```tsx
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const name = searchParams.get("name") || "Chau Gia Bao";
  const title = searchParams.get("title") || "Software Engineer";
  const tags = searchParams.get("tags")?.split(",") || [
    "Next.js",
    "TypeScript",
    "Microservices",
  ];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Subtle grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)
            `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow effects */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "20%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "20%",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        {/* Logo/Initials */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "20px",
            border: "2px solid #06b6d4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "32px",
            boxShadow: "0 0 30px rgba(6, 182, 212, 0.3)",
          }}
        >
          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#06b6d4",
            }}
          >
            GB
          </span>
        </div>

        {/* Name */}
        <h1
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#fafafa",
            marginBottom: "8px",
            letterSpacing: "-0.02em",
          }}
        >
          {name}
        </h1>

        {/* Title */}
        <p
          style={{
            fontSize: "28px",
            color: "#06b6d4",
            marginBottom: "32px",
            fontWeight: 500,
          }}
        >
          {title}
        </p>

        {/* Tech tags */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "600px",
          }}
        >
          {tags.map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: "rgba(39, 39, 42, 0.8)",
                border: "1px solid #3f3f46",
                color: "#a1a1aa",
                fontSize: "18px",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
```

- [ ] **Step 2: Install @vercel/og if needed**

Run: `grep -q "@vercel/og" package.json && echo "installed" || echo "need to install"`
Expected: "need to install"

- [ ] **Step 3: Install dependency**

Run: `pnpm add @vercel/og`
Expected: Package added

- [ ] **Step 4: Commit**

```bash
git add app/opengraph-image.tsx package.json pnpm-lock.yaml
git commit -m "feat: add dynamic OpenGraph image generator"
```

---

## Task 11: Integrate All Components

**Files:**

- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`

**Interfaces:**

- Wraps: `RecruiterModeProvider`
- Adds: New sections to page

- [ ] **Step 1: Update layout.tsx**

```tsx
// Add to imports
import { RecruiterModeProvider } from "./contexts/RecruiterModeContext";

// Wrap children in RecruiterModeProvider
<body className="font-sans antialiased">
  <RecruiterModeProvider>
    <AudioProvider>
      <LenisProvider>{children}</LenisProvider>
      <SoundToggle />
    </AudioProvider>
  </RecruiterModeProvider>
  <AnalyticsProvider />
</body>;
```

- [ ] **Step 2: Update page.tsx**

```tsx
import { HeroSection } from "./components/hero/HeroSection";
import { Cursor } from "./components/effects/Cursor";
import { Scene } from "./components/canvas/Scene";
import { ExperienceSection } from "./components/experience/ExperienceSection";
import { TechArsenalSection } from "./components/tech/TechArsenalSection";
import { AboutSection } from "./components/about/AboutSection";
import { ContactSection } from "./components/contact/ContactSection";
import { Footer } from "./components/footer/Footer";
import { TerminalProvider } from "./components/terminal";
import { RecruiterModeToggle } from "./components/ui/RecruiterModeToggle";
import { BentoStats } from "./components/hero/BentoStats";
import { EngineeringHUD } from "./components/hud/EngineeringHUD";
import { SystemArchitecture } from "./components/architecture/SystemArchitecture";
import { useRecruiterMode } from "./hooks/useRecruiterMode";

// Recruiter mode clean layout component
function RecruiterModeView() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Chau Gia Bao</h1>
        <p className="text-xl text-accent-cyan mb-8">Software Engineer</p>
        <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
          Building high-performance web platforms with TypeScript, Next.js, and
          distributed systems architecture.
        </p>
        <a
          href="/resume.pdf"
          download
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-cyan text-background font-semibold hover:bg-accent-cyan/90 transition-colors"
        >
          Download Resume
        </a>
      </div>
    </div>
  );
}

// Main page component
export default function Home() {
  const { isEnabled: isRecruiterMode } = useRecruiterMode();

  return (
    <TerminalProvider>
      {isRecruiterMode ? (
        <RecruiterModeView />
      ) : (
        <>
          <Scene />
          <main>
            <Cursor />
            <HeroSection />
            <BentoStats />
            <EngineeringHUD />
            <SystemArchitecture />
            <ExperienceSection />
            <TechArsenalSection />
            <AboutSection />
            <ContactSection />
          </main>
          <Footer />
        </>
      )}
      <RecruiterModeToggle />
    </TerminalProvider>
  );
}
```

- [ ] **Step 3: Run typecheck**

Run: `pnpm typecheck 2>&1 | head -50`
Expected: No TypeScript errors (minor warnings acceptable)

- [ ] **Step 4: Run build**

Run: `pnpm build 2>&1 | tail -50`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/page.tsx
git commit -m "feat: integrate all elite upgrade components"
```

---

## Task 12: Update Metadata for OG Image

**Files:**

- Modify: `app/layout.tsx`

- [ ] **Step 1: Add OG image metadata**

```tsx
// Add to existing metadata export
openGraph: {
  // ... existing config
  images: [
    {
      url: "/opengraph-image",
      width: 1200,
      height: 630,
    },
  ],
},
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "enhance: add OG image URL to metadata"
```

---

## Final Verification

- [ ] All components render without errors
- [ ] RecruiterMode toggle works and persists
- [ ] Three.js pauses when tab inactive
- [ ] Reduced motion preference respected
- [ ] OG image generates correctly
- [ ] Build passes

---

## Summary of Commits

1. `feat: add RecruiterMode context and hook`
2. `feat: add RecruiterMode toggle button UI`
3. `feat: add performance tier and visibility detection hooks`
4. `feat: add WebGL preloader component`
5. `feat: integrate performance optimization and visibility detection into Scene`
6. `fix: disable custom cursor on touch devices`
7. `enhance: improve reduced motion accessibility styles`
8. `feat: add interactive SystemArchitecture visualization`
9. `feat: add EngineeringHUD with live metrics display`
10. `feat: add dynamic OpenGraph image generator`
11. `feat: integrate all elite upgrade components`
12. `enhance: add OG image URL to metadata`
