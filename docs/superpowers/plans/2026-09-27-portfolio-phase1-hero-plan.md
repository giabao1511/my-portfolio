# Portfolio Phase 1: Hero Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build complete hero section with 3D particle sphere, animated typography, magnetic CTAs, and Bento stats grid.

**Architecture:** Client-side React components with Next.js App Router. 3D scene uses R3F with dynamic imports. Animations via Framer Motion. Mobile detection for simplified fallback.

**Tech Stack:** Next.js 16, Tailwind CSS 4, React Three Fiber, @react-three/drei, Framer Motion, Lucide React, clsx, tailwind-merge

**Spec:** `docs/superpowers/specs/2026-09-27-portfolio-phase1-hero-design.md`

---

## Global Constraints

- Target 60+ FPS on desktop
- No layout shift during 3D load
- Mobile fallback: static gradient (no 3D errors)
- WCAG AA contrast for text
- Colors verbatim from spec: bg zinc-950 (#09090b), accent cyan-500 (#06b6d4), violet-500 (#8b5cf6), emerald-500 (#10b981)
- Fonts: Inter (display), JetBrains Mono (mono)

---

## File Structure

```
app/
├── page.tsx                    # Main page (server)
├── layout.tsx                  # Root layout with fonts
├── globals.css                 # Tailwind + custom styles
├── components/
│   ├── hero/
│   │   ├── HeroSection.tsx     # Container client component
│   │   ├── Hero3DCanvas.tsx    # R3F canvas (dynamic, ssr:false)
│   │   ├── HeroTypography.tsx   # Animated text
│   │   ├── MagneticButton.tsx   # Reusable CTA button
│   │   ├── BentoStats.tsx      # Stats grid
│   │   └── ScrollIndicator.tsx  # Down arrow
│   └── ui/
│       ├── MagneticCursor.tsx   # Global cursor
│       └── Card3D.tsx           # Glass card wrapper
├── lib/
│   ├── constants.ts            # Stats data, colors
│   └── utils.ts                # cn() helper
tailwind.config.ts              # Extended theme
```

---

## Review Focus

1. **3D performance** — `useFrame` delta capping prevents frame drops on slow devices
2. **Mobile fallback** — 3D canvas must not render on mobile; static gradient shows instead
3. **Reduced motion** — `prefers-reduced-motion` media query disables animations
4. **CLS prevention** — Canvas has explicit width/height, skeleton shown during load
5. **Touch device cursor** — MagneticCursor must not show on touch devices

---

## Tasks

### Task 1: Install Dependencies

**Files:** (none)

- [ ] **Step 1: Install core dependencies**

Run: `pnpm add @react-three/fiber @react-three/drei three framer-motion lucide-react clsx tailwind-merge`

- [ ] **Step 2: Install type definitions**

Run: `pnpm add -D @types/three`

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "deps: add R3F, drei, framer-motion, lucide"
```

---

### Task 2: Configure Tailwind Theme

**Files:**
- Create: `app/globals.css`
- Modify: `tailwind.config.ts`

**Interfaces:**
- Consumes: Design tokens from spec
- Produces: Custom CSS variables and Tailwind theme extension

- [ ] **Step 1: Create globals.css with custom properties**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Background */
  --bg-primary: #09090b;
  --bg-surface: #18181b;
  --border: #27272a;

  /* Text */
  --text-primary: #fafafa;
  --text-muted: #a1a1aa;

  /* Accents */
  --accent-cyan: #06b6d4;
  --accent-violet: #8b5cf6;
  --accent-emerald: #10b981;

  /* Glows */
  --glow-cyan: rgba(6, 182, 212, 0.4);
  --glow-violet: rgba(139, 92, 246, 0.3);
}

@layer base {
  body {
    @apply bg-zinc-950 text-zinc-50 antialiased;
  }
}

@layer utilities {
  .glow-cyan {
    box-shadow: 0 0 20px var(--glow-cyan), 0 0 40px rgba(6, 182, 212, 0.2);
  }

  .glow-violet {
    box-shadow: 0 0 20px var(--glow-violet), 0 0 40px rgba(139, 92, 246, 0.2);
  }

  .text-glow-cyan {
    text-shadow: 0 0 20px var(--glow-cyan);
  }
}
```

- [ ] **Step 2: Update tailwind.config.ts**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        surface: "#18181b",
        border: "#27272a",
        accent: {
          cyan: "#06b6d4",
          violet: "#8b5cf6",
          emerald: "#10b981",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
      boxShadow: {
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(6, 182, 212, 0.2)",
        "glow-violet": "0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.2)",
        "glow-emerald": "0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.2)",
      },
    },
  },
};

export default config;
```

- [ ] **Step 3: Commit**

```bash
git add app/globals.css tailwind.config.ts
git commit -m "config: add custom theme, animations, and glow utilities"
```

---

### Task 3: Create Utilities and Constants

**Files:**
- Create: `app/lib/utils.ts`
- Create: `app/lib/constants.ts`

**Interfaces:**
- Consumes: None
- Produces: `cn()` export, `STATS` array, `COLORS` object

- [ ] **Step 1: Create utils.ts**

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Create constants.ts with stats data**

```typescript
import { Code2, Zap, Package, Shield } from "lucide-react";

export const STATS = [
  {
    id: "experience",
    value: "4+",
    unit: "Years",
    label: "Hands-on Experience",
    icon: Code2,
    color: "cyan",
  },
  {
    id: "latency",
    value: "Sub-50ms",
    unit: "",
    label: "Latency Calculation Engines",
    icon: Zap,
    color: "emerald",
  },
  {
    id: "skus",
    value: "10K+",
    unit: "",
    label: "SKUs Optimized (2.5s LCP)",
    icon: Package,
    color: "violet",
  },
  {
    id: "uptime",
    value: "Zero",
    unit: "",
    label: "Deployment Rollbacks",
    icon: Shield,
    color: "cyan",
  },
] as const;

export const COLORS = {
  background: "#09090b",
  surface: "#18181b",
  border: "#27272a",
  textPrimary: "#fafafa",
  textMuted: "#a1a1aa",
  accentCyan: "#06b6d4",
  accentViolet: "#8b5cf6",
  accentEmerald: "#10b981",
} as const;

export const PROFILE = {
  name: "Chau Gia Bao",
  role: "Software Engineer",
  tagline:
    "Architecting high-performance web platforms across B2B SaaS, E-Commerce, and FinTech domains with the end-to-end TypeScript ecosystem.",
  ctas: {
    primary: "Explore Work",
    secondary: "Get In Touch",
  },
} as const;
```

- [ ] **Step 3: Commit**

```bash
git add app/lib/utils.ts app/lib/constants.ts
git commit -m "feat: add utilities and constants"
```

---

### Task 4: Create Hero3DCanvas (3D Particle Sphere)

**Files:**
- Create: `app/components/hero/Hero3DCanvas.tsx`

**Interfaces:**
- Consumes: Mouse position (internal state)
- Produces: R3F Canvas with particle sphere

- [ ] **Step 1: Create Hero3DCanvas.tsx**

```typescript
"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface ParticleSphereProps {
  mousePosition: { x: number; y: number };
}

function ParticleSphere({ mousePosition }: ParticleSphereProps) {
  const meshRef = useRef<THREE.Points>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });

  const { viewport } = useThree();

  // Generate sphere geometry
  const particles = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Fibonacci sphere distribution
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const radius = 2;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Color gradient: cyan to violet
      const t = (i / count) * 0.5 + 0.25;
      colors[i * 3] = 0.024 + t * 0.525; // R: 0.024 → 0.549
      colors[i * 3 + 1] = 0.714 - t * 0.471; // G: 0.714 → 0.243
      colors[i * 3 + 2] = 0.831; // B: constant 0.831
    }

    return { positions, colors, count };
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Cap delta to prevent jumps
    const cappedDelta = Math.min(delta, 0.05);

    // Lerp mouse position for smooth trailing
    mouseTarget.current.x += (mousePosition.x * viewport.width * 0.3 - mouseTarget.current.x) * 0.05;
    mouseTarget.current.y += (mousePosition.y * viewport.height * 0.3 - mouseTarget.current.y) * 0.05;

    // Rotate based on time and mouse
    meshRef.current.rotation.y += cappedDelta * 0.2;
    meshRef.current.rotation.x = mouseTarget.current.y * 0.3;
    meshRef.current.rotation.z = mouseTarget.current.x * 0.1;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.count}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.count}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </Float>
  );
}

export function Hero3DCanvas({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#09090b"]} />
        <ParticleSphere mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/hero/Hero3DCanvas.tsx
git commit -m "feat: add Hero3DCanvas with particle sphere"
```

---

### Task 5: Create MagneticCursor

**Files:**
- Create: `app/components/ui/MagneticCursor.tsx`

**Interfaces:**
- Consumes: None (uses window events)
- Produces: Global cursor element

- [ ] **Step 1: Create MagneticCursor.tsx**

```typescript
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const position = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Hide on touch devices
    if ("ontouchstart" in window) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const onEnter = () => setIsVisible(true);
    const onLeave = () => setIsVisible(false);

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-magnetic]")) {
        setIsHovering(true);
      }
    };

    const onHoverEnd = () => setIsHovering(false);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onHoverStart);
    document.addEventListener("mouseout", onHoverEnd);

    let rafId: number;
    const animate = () => {
      // Lerp for smooth trailing
      position.current.x += (target.current.x - position.current.x) * 0.15;
      position.current.y += (target.current.y - position.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${position.current.x}px, ${position.current.y}px) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onHoverStart);
      document.removeEventListener("mouseout", onHoverEnd);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  return (
    <div
      ref={cursorRef}
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-[9999] rounded-full transition-all duration-150",
        "bg-accent-cyan/20 border border-accent-cyan/50",
        isVisible ? "opacity-100" : "opacity-0",
        isHovering ? "w-12 h-12 bg-accent-cyan/30" : "w-3 h-3",
        isClicking && "scale-75",
        "hidden md:block" // Hidden on mobile
      )}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/ui/MagneticCursor.tsx
git commit -m "feat: add MagneticCursor with lerped trailing"
```

---

### Task 6: Create HeroTypography

**Files:**
- Create: `app/components/hero/HeroTypography.tsx`

**Interfaces:**
- Consumes: `PROFILE` from constants
- Produces: Animated text elements

- [ ] **Step 1: Create HeroTypography.tsx**

```typescript
"use client";

import { motion } from "framer-motion";
import { PROFILE } from "@/lib/constants";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function HeroTypography() {
  const words = PROFILE.tagline.split(" ");

  return (
    <motion.div
      className="relative z-10 flex flex-col items-center gap-6 text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Name */}
      <motion.h1
        variants={itemVariants}
        className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-glow-cyan"
      >
        {PROFILE.name}
      </motion.h1>

      {/* Role */}
      <motion.p
        variants={itemVariants}
        className="text-lg md:text-xl lg:text-2xl text-accent-cyan font-medium tracking-wide"
      >
        {PROFILE.role}
      </motion.p>

      {/* Tagline */}
      <motion.div
        variants={itemVariants}
        className="max-w-3xl px-4"
      >
        <p className="text-sm md:text-base lg:text-lg text-zinc-400 leading-relaxed">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.03 }}
              className="inline-block mr-2"
            >
              {word}
            </motion.span>
          ))}
        </p>
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/hero/HeroTypography.tsx
git commit -m "feat: add HeroTypography with staggered animation"
```

---

### Task 7: Create MagneticButton

**Files:**
- Create: `app/components/hero/MagneticButton.tsx`

**Interfaces:**
- Consumes: Props (children, variant, href)
- Produces: Reusable CTA button

- [ ] **Step 1: Create MagneticButton.tsx**

```typescript
"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
  className?: string;
}

export function MagneticButton({
  children,
  variant = "primary",
  href = "#",
  className,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const baseStyles = cn(
    "relative px-8 py-3 rounded-full font-medium text-sm md:text-base tracking-wide",
    "transition-all duration-300 ease-out",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
    variant === "primary" && [
      "border border-accent-cyan text-accent-cyan",
      "hover:bg-accent-cyan hover:text-zinc-950 hover:shadow-glow-cyan",
    ],
    variant === "secondary" && [
      "border border-accent-violet text-accent-violet",
      "hover:bg-accent-violet hover:text-zinc-950 hover:shadow-glow-violet",
    ],
    className
  );

  return (
    <motion.a
      ref={buttonRef}
      href={href}
      className={baseStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <span className="relative z-10">{children}</span>

      {/* Glow effect on hover */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full opacity-0 transition-opacity duration-300",
          variant === "primary" ? "bg-accent-cyan/10" : "bg-accent-violet/10"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />
    </motion.a>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/hero/MagneticButton.tsx
git commit -m "feat: add MagneticButton with hover glow"
```

---

### Task 8: Create BentoStats

**Files:**
- Create: `app/components/hero/BentoStats.tsx`

**Interfaces:**
- Consumes: `STATS` from constants
- Produces: Grid of stat cards

- [ ] **Step 1: Create BentoStats.tsx**

```typescript
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { STATS } from "@/lib/constants";

const colorClasses = {
  cyan: "border-accent-cyan/30 hover:border-accent-cyan/60 hover:shadow-glow-cyan",
  violet: "border-accent-violet/30 hover:border-accent-violet/60 hover:shadow-glow-violet",
  emerald: "border-accent-emerald/30 hover:border-accent-emerald/60 hover:shadow-glow-emerald",
};

const iconColorClasses = {
  cyan: "text-accent-cyan",
  violet: "text-accent-violet",
  emerald: "text-accent-emerald",
};

export function BentoStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-8"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {STATS.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              className={cn(
                "relative p-6 md:p-8 rounded-2xl",
                "bg-zinc-900/50 backdrop-blur-sm",
                "border border-zinc-800",
                "transition-all duration-300",
                colorClasses[stat.color]
              )}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  },
                },
              }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Icon */}
              <div className="mb-4">
                <Icon className={cn("w-6 h-6 md:w-8 md:h-8", iconColorClasses[stat.color])} />
              </div>

              {/* Value */}
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl md:text-4xl lg:text-5xl font-bold font-mono text-zinc-50">
                  {stat.value}
                </span>
                {stat.unit && (
                  <span className="text-lg md:text-xl text-zinc-400">{stat.unit}</span>
                )}
              </div>

              {/* Label */}
              <p className="text-sm md:text-base text-zinc-400">{stat.label}</p>

              {/* Subtle gradient overlay */}
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                  stat.color === "cyan" && "bg-gradient-to-br from-accent-cyan/5 to-transparent",
                  stat.color === "violet" && "bg-gradient-to-br from-accent-violet/5 to-transparent",
                  stat.color === "emerald" && "bg-gradient-to-br from-accent-emerald/5 to-transparent"
                )}
              />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/hero/BentoStats.tsx
git commit -m "feat: add BentoStats with hover physics"
```

---

### Task 9: Create ScrollIndicator

**Files:**
- Create: `app/components/hero/ScrollIndicator.tsx`

- [ ] **Step 1: Create ScrollIndicator.tsx**

```typescript
"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function ScrollIndicator() {
  return (
    <motion.div
      className="relative z-10 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
    >
      <span className="text-xs text-zinc-500 mb-2 tracking-widest uppercase">
        Scroll
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <ChevronDown className="w-5 h-5 text-zinc-500" />
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/hero/ScrollIndicator.tsx
git commit -m "feat: add ScrollIndicator with bounce animation"
```

---

### Task 10: Create HeroSection Container

**Files:**
- Create: `app/components/hero/HeroSection.tsx`

**Interfaces:**
- Consumes: All hero sub-components
- Produces: Complete hero section with mouse tracking

- [ ] **Step 1: Create HeroSection.tsx**

```typescript
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { HeroTypography } from "./HeroTypography";
import { MagneticButton } from "./MagneticButton";
import { BentoStats } from "./BentoStats";
import { ScrollIndicator } from "./ScrollIndicator";
import { PROFILE } from "@/lib/constants";

// Dynamic import for 3D canvas (no SSR)
const Hero3DCanvas = dynamic(
  () => import("./Hero3DCanvas").then((mod) => mod.Hero3DCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
    ),
  }
);

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Detect mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Detect reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      // Normalized coordinates (-1 to 1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      mediaQuery.removeEventListener("change", handleMotionChange);
      if (!isMobile) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [isMobile]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background: 3D Canvas or gradient fallback */}
      {isMobile || isReducedMotion ? (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
      ) : (
        <Hero3DCanvas mousePosition={mousePosition} />
      )}

      {/* Radial gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-zinc-950/50 to-zinc-950 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-16 md:gap-24 px-4 py-24 w-full max-w-6xl mx-auto">
        {/* Typography + CTAs */}
        <div className="flex flex-col items-center gap-8 md:gap-12">
          <HeroTypography />

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <MagneticButton variant="primary" href="#work">
              {PROFILE.ctas.primary}
            </MagneticButton>
            <MagneticButton variant="secondary" href="#contact">
              {PROFILE.ctas.secondary}
            </MagneticButton>
          </div>
        </div>

        {/* Bento Stats Grid */}
        <BentoStats />

        {/* Scroll Indicator */}
        <div className="mt-8 md:mt-16">
          <ScrollIndicator />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/hero/HeroSection.tsx
git commit -m "feat: add HeroSection container with mouse tracking"
```

---

### Task 11: Update Layout and Page

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: HeroSection, MagneticCursor
- Produces: Complete page with fonts and hero

- [ ] **Step 1: Update app/layout.tsx**

```typescript
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chau Gia Bao | Software Engineer",
  description:
    "Software Engineer specializing in high-performance web platforms, TypeScript ecosystem, Next.js, and distributed systems.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Update app/page.tsx**

```typescript
import { HeroSection } from "@/components/hero/HeroSection";
import { MagneticCursor } from "@/components/ui/MagneticCursor";

export default function Home() {
  return (
    <main>
      <MagneticCursor />
      <HeroSection />
    </main>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx app/page.tsx
git commit -m "feat: update layout with fonts and add hero to page"
```

---

### Task 12: Verify Build and Performance

**Files:** (none)

- [ ] **Step 1: Run build to verify no errors**

Run: `pnpm build`
Expected: Successful build with no TypeScript or lint errors

- [ ] **Step 2: Run dev server and verify**

Run: `pnpm dev`
Expected: Hero section loads, 3D canvas renders, no console errors

- [ ] **Step 3: Test mobile fallback**

In browser DevTools, set viewport to mobile (375px) and verify:
- No 3D canvas errors
- Static gradient background shows
- Content is readable and stacked

- [ ] **Step 4: Test reduced motion**

Run: Enable "Reduce motion" in OS accessibility settings
Expected: Animations disabled or minimized

- [ ] **Step 5: Commit final verification**

```bash
git add -A
git commit -m "chore: verify build and runtime"
```

---

## Summary

**Tasks:** 12 total
**Estimated time:** 2-5 minutes per task
**Dependencies:** Task 4 requires Task 3, Task 7 requires Task 6, Task 10 requires Tasks 4-9

**Next steps after Phase 1:**
- Phase 2: Experience Timeline, Interactive Terminal, About Section
- Polish: Performance optimization, accessibility audit, SEO
