# Awwwards-Caliber Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the portfolio into an Awwwards-caliber creative portfolio with 3D/WebGL effects, smooth Lenis scrolling, GSAP scroll-driven animations, micro-interactions, and optional audio.

**Architecture:** Four-phase implementation. Phase 1 installs dependencies and builds the Lenis + GSAP scroll foundation. Phase 2 adds a fixed R3F canvas with shader background, floating particles, and 3D floating cards. Phase 3 implements BentoCard with spotlight + 3D tilt, upgrades the cursor, and adds horizontal scroll sections. Phase 4 adds synthesized Web Audio API sounds with a toggle. All animations respect `prefers-reduced-motion`.

**Tech Stack:** Next.js 16 App Router, TypeScript, @react-three/fiber, @react-three/drei, @react-three/postprocessing, three, gsap, @studio-freight/lenis, framer-motion

**Spec:** `docs/superpowers/specs/2026-09-27-awwwards-portfolio-design.md`

---

## Global Constraints

- TypeScript strict mode — no `any` except where unavoidable
- All animations use only `transform` and `opacity` (compositor-friendly)
- `will-change: transform` set only during active animation, removed after completion
- `prefers-reduced-motion`: disable all non-essential animations
- R3F canvas: `pointer-events: none`, fixed-position background layer
- Audio context created lazily on first user interaction

---

## Review Focus

- WebGL unavailability: R3F canvas degrades to static gradient; no crashes
- Performance under heavy scroll: Lenis RAF loop must not drop frames
- Audio policy compliance: context created only after user gesture
- Mobile/touch: cursor hidden, scroll works without GSAP pin
- Memory leaks: all RAF loops, event listeners, and Three.js resources disposed on unmount

---

## Phase 1: Lenis + GSAP Scroll Foundation

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: (none)
- Produces: (none — just installs packages)

- [ ] **Step 1: Add dependencies to package.json**

Add these to `dependencies`:

```json
"@studio-freight/lenis": "^1.0.42",
"gsap": "^3.12.5",
"@react-three/postprocessing": "^2.16.0",
"postprocessing": "^6.36.3"
```

Add these to `devDependencies`:

```json
"@types/three": "^0.186.0"
```

Run: `pnpm install`

---

### Task 2: Create LenisProvider

**Files:**
- Create: `app/components/scroll/LenisProvider.tsx`
- Create: `app/hooks/useLenis.ts`

**Interfaces:**
- Consumes: (none)
- Produces:
  - `LenisProvider`: React component (wraps children in Lenis context)
  - `useLenis()`: hook returning `{ lenis: Lenis | null; scrollY: number }`

- [ ] **Step 1: Create app/components/scroll/LenisProvider.tsx**

```tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

    setLenis(lenisInstance);

    // Sync Lenis RAF with GSAP ticker
    lenisInstance.on("scroll", ({ scroll }: { scroll: number }) => {
      setScrollY(scroll);
    });

    function raf(time: number) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    // Refresh ScrollTrigger after init
    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(rafId);
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
```

- [ ] **Step 2: Verify file compiles**

Run: `pnpm tsc --noEmit app/components/scroll/LenisProvider.tsx app/hooks/useLenis.ts`
Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add package.json app/components/scroll/LenisProvider.tsx app/hooks/useLenis.ts
git commit -m "feat: add Lenis smooth scroll provider with GSAP sync

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Create useMousePosition Hook

**Files:**
- Create: `app/hooks/useMousePosition.ts`

**Interfaces:**
- Consumes: (none)
- Produces:
  - `useMousePosition()`: hook returning `{ x: number; y: number; vx: number; vy: number }`
  - `x`, `y`: normalized position (-1 to 1)
  - `vx`, `vy`: velocity (pixels per frame)

- [ ] **Step 1: Create app/hooks/useMousePosition.ts**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const prevPosition = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // Normalized -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      // Calculate velocity
      velocity.current.x = e.clientX - prevPosition.current.x;
      velocity.current.y = e.clientY - prevPosition.current.y;
      prevPosition.current.x = e.clientX;
      prevPosition.current.y = e.clientY;

      setPosition({ x, y });
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return {
    x: position.x,
    y: position.y,
    vx: velocity.current.x,
    vy: velocity.current.y,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add app/hooks/useMousePosition.ts
git commit -m "feat: add useMousePosition hook with velocity tracking

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Create TextScramble Hook and Component

**Files:**
- Create: `app/hooks/useTextScramble.ts`
- Create: `app/components/effects/TextScramble.tsx`

**Interfaces:**
- Consumes: (none)
- Produces:
  - `useTextScramble(text: string, isActive: boolean): string`
  - `TextScramble`: React component with props `text`, `className`, `duration`, `triggerOnce`

- [ ] **Step 1: Create app/hooks/useTextScramble.ts**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

interface UseTextScrambleOptions {
  duration?: number;
  scrambleSpeed?: number;
}

export function useTextScramble(
  text: string,
  isActive: boolean,
  options: UseTextScrambleOptions = {}
): string {
  const { duration = 1000, scrambleSpeed = 30 } = options;
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) {
      setDisplayText(text);
      return;
    }

    let startTime: number;
    let frame = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Build result string
      let result = "";
      const revealCount = Math.floor(progress * text.length);

      for (let i = 0; i < text.length; i++) {
        if (i < revealCount) {
          result += text[i];
        } else if (text[i] === " ") {
          result += " ";
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }

      setDisplayText(result);

      if (progress < 1) {
        frame++;
        const speedFactor = Math.max(1, Math.floor(frame / 3));
        intervalRef.current = setTimeout(
          () => requestAnimationFrame(animate),
          scrambleSpeed * speedFactor
        );
      }
    };

    requestAnimationFrame(animate);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [text, isActive, duration, scrambleSpeed]);

  return displayText;
}
```

- [ ] **Step 2: Create app/components/effects/TextScramble.tsx**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useTextScramble } from "../../hooks/useTextScramble";
import { cn } from "../../lib/utils";

interface TextScrambleProps {
  text: string;
  className?: string;
  duration?: number;
  scrambleSpeed?: number;
  triggerOnce?: boolean;
}

export function TextScramble({
  text,
  className,
  duration = 1000,
  scrambleSpeed = 30,
  triggerOnce = true,
}: TextScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
            setIsActive(true);
            setHasTriggered(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [triggerOnce, hasTriggered]);

  const scrambledText = useTextScramble(text, isActive, { duration, scrambleSpeed });

  return (
    <span ref={ref} className={cn("inline-block font-mono", className)}>
      {scrambledText}
      {isActive && scrambledText !== text && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
}
```

- [ ] **Step 3: Verify compilation**

Run: `pnpm tsc --noEmit`
Expected: No TypeScript errors

- [ ] **Step 4: Commit**

```bash
git add app/hooks/useTextScramble.ts app/components/effects/TextScramble.tsx
git commit -m "feat: add TextScramble hook and component for kinetic typography

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Integrate LenisProvider into Layout

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `LenisProvider` from `app/components/scroll/LenisProvider`
- Produces: (modifies layout)

- [ ] **Step 1: Update app/layout.tsx**

Add import and wrap body content:

```tsx
import { LenisProvider } from "./components/scroll/LenisProvider";
```

Wrap `{children}` in the body:

```tsx
<body className="font-sans antialiased">
  <LenisProvider>
    {children}
  </LenisProvider>
  <AnalyticsProvider />
</body>
```

- [ ] **Step 2: Verify compilation**

Run: `pnpm tsc --noEmit`
Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: integrate LenisProvider into root layout

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

## Phase 2: 3D/WebGL Scene

### Task 6: Create GLSL Shaders

**Files:**
- Create: `app/lib/shaders/noise.glsl` (shared noise functions)
- Create: `app/lib/shaders/background.vert` (vertex shader)
- Create: `app/lib/shaders/background.frag` (fragment shader)

**Interfaces:**
- Consumes: (none)
- Produces: GLSL shader strings exported as `noiseGLSL`, `backgroundVertexShader`, `backgroundFragmentShader`

- [ ] **Step 1: Create app/lib/shaders/noise.glsl**

```glsl
// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 5; i++) {
    value += amplitude * snoise(p * frequency);
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return value;
}
```

- [ ] **Step 2: Create app/lib/shaders/background.vert**

```glsl
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uVelocity;
uniform float uIntensity;

varying vec2 vUv;
varying float vElevation;

void main() {
  vUv = uv;

  vec3 pos = position;

  // Multi-octave noise for organic movement
  float noise1 = snoise(vec2(pos.x * 2.0 + uTime * 0.1, pos.y * 2.0 + uTime * 0.08));
  float noise2 = fbm(vec2(pos.x * 1.5 + uTime * 0.05, pos.y * 1.5 - uTime * 0.06));

  // Combine noise layers
  float elevation = noise1 * 0.3 + noise2 * 0.2;

  // Mouse influence - ripple effect
  vec2 mousePos = vec2(uMouse.x * 2.0, uMouse.y * 2.0);
  float dist = distance(vec2(pos.x, pos.y), mousePos);
  float mouseInfluence = smoothstep(1.5, 0.0, dist);
  float velocityMag = length(uVelocity) * 0.01;
  elevation += mouseInfluence * (0.3 + velocityMag) * sin(dist * 3.0 - uTime * 2.0);

  pos.z += elevation * uIntensity;
  vElevation = elevation;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

- [ ] **Step 3: Create app/lib/shaders/background.frag**

```glsl
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

varying vec2 vUv;
varying float vElevation;

void main() {
  // Base gradient
  vec3 color = mix(uColor1, uColor2, vUv.y);

  // Iridescent overlay based on elevation
  float iridescence = sin(vElevation * 5.0 + uTime) * 0.5 + 0.5;
  color = mix(color, uColor3, iridescence * 0.3);

  // Mouse proximity glow
  vec2 mousePos = (uMouse + 1.0) * 0.5;
  float dist = distance(vUv, mousePos);
  float glow = smoothstep(0.5, 0.0, dist) * 0.15;
  color += vec3(glow * 0.5, glow * 0.8, glow);

  // Subtle vignette
  float vignette = 1.0 - smoothstep(0.3, 0.9, length(vUv - 0.5) * 1.2);
  color *= 0.8 + vignette * 0.2;

  gl_FragColor = vec4(color, 0.6);
}
```

- [ ] **Step 4: Create app/lib/shaders/index.ts**

```ts
export const noiseGLSL = `
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 5; i++) {
    value += amplitude * snoise(p * frequency);
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return value;
}
`;

export const backgroundVertexShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uVelocity;
uniform float uIntensity;

varying vec2 vUv;
varying float vElevation;

void main() {
  vUv = uv;
  vec3 pos = position;

  float noise1 = snoise(vec2(pos.x * 2.0 + uTime * 0.1, pos.y * 2.0 + uTime * 0.08));
  float noise2 = fbm(vec2(pos.x * 1.5 + uTime * 0.05, pos.y * 1.5 - uTime * 0.06));

  float elevation = noise1 * 0.3 + noise2 * 0.2;

  vec2 mousePos = vec2(uMouse.x * 2.0, uMouse.y * 2.0);
  float dist = distance(vec2(pos.x, pos.y), mousePos);
  float mouseInfluence = smoothstep(1.5, 0.0, dist);
  float velocityMag = length(uVelocity) * 0.01;
  elevation += mouseInfluence * (0.3 + velocityMag) * sin(dist * 3.0 - uTime * 2.0);

  pos.z += elevation * uIntensity;
  vElevation = elevation;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const backgroundFragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

varying vec2 vUv;
varying float vElevation;

void main() {
  vec3 color = mix(uColor1, uColor2, vUv.y);

  float iridescence = sin(vElevation * 5.0 + uTime) * 0.5 + 0.5;
  color = mix(color, uColor3, iridescence * 0.3);

  vec2 mousePos = (uMouse + 1.0) * 0.5;
  float dist = distance(vUv, mousePos);
  float glow = smoothstep(0.5, 0.0, dist) * 0.15;
  color += vec3(glow * 0.5, glow * 0.8, glow);

  float vignette = 1.0 - smoothstep(0.3, 0.9, length(vUv - 0.5) * 1.2);
  color *= 0.8 + vignette * 0.2;

  gl_FragColor = vec4(color, 0.6);
}
`;
```

- [ ] **Step 5: Commit**

```bash
git add app/lib/shaders/noise.glsl app/lib/shaders/background.vert app/lib/shaders/background.frag app/lib/shaders/index.ts
git commit -m "feat: add GLSL shaders for noise displacement background

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Create ShaderPlane Component

**Files:**
- Create: `app/components/canvas/ShaderPlane.tsx`

**Interfaces:**
- Consumes: `useMousePosition` from `app/hooks/useMousePosition`, shaders from `app/lib/shaders`
- Produces: `ShaderPlane` — R3F mesh component with custom shader material

- [ ] **Step 1: Create app/components/canvas/ShaderPlane.tsx**

```tsx
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { backgroundVertexShader, backgroundFragmentShader, noiseGLSL } from "../../lib/shaders";
import { useMousePosition } from "../../hooks/useMousePosition";

export function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { x, y, vx, vy } = useMousePosition();

  const velocityRef = useRef({ x: 0, y: 0 });
  const smoothVelocity = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uVelocity: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: 0.5 },
      uColor1: { value: new THREE.Color("#09090b") },
      uColor2: { value: new THREE.Color("#18181b") },
      uColor3: { value: new THREE.Color("#06b6d4") },
    }),
    []
  );

  // Prepend noise functions to vertex shader
  const vertexShader = useMemo(() => noiseGLSL + backgroundVertexShader, []);
  const fragmentShader = useMemo(() => noiseGLSL + backgroundFragmentShader, []);

  useFrame((state) => {
    if (!materialRef.current) return;

    // Smooth velocity
    velocityRef.current.x = vx;
    velocityRef.current.y = vy;
    smoothVelocity.current.x += (velocityRef.current.x - smoothVelocity.current.x) * 0.1;
    smoothVelocity.current.y += (velocityRef.current.y - smoothVelocity.current.y) * 0.1;

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uMouse.value.set(x, y);
    materialRef.current.uniforms.uVelocity.value.set(smoothVelocity.current.x, smoothVelocity.current.y);
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 4, 0, 0]} position={[0, 0, -5]}>
      <planeGeometry args={[15, 15, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/canvas/ShaderPlane.tsx
git commit -m "feat: add ShaderPlane component with GLSL noise displacement

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Create FloatingParticles Component

**Files:**
- Create: `app/components/canvas/FloatingParticles.tsx`

**Interfaces:**
- Consumes: (none)
- Produces: `FloatingParticles` — R3F Points with twinkling effect

- [ ] **Step 1: Create app/components/canvas/FloatingParticles.tsx**

```tsx
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Particle {
  position: THREE.Vector3;
  scale: number;
  speed: number;
  phase: number;
}

export function FloatingParticles({ count = 800 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particles = useRef<Particle[]>([]);

  const { positions, sizes, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Random position in a sphere
      const radius = 8 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      sizes[i] = Math.random() * 0.03 + 0.01;
      phases[i] = Math.random() * Math.PI * 2;

      particles.current.push({
        position: new THREE.Vector3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]),
        scale: sizes[i],
        speed: 0.1 + Math.random() * 0.2,
        phase: phases[i],
      });
    }

    return { positions: pos, sizes, phases };
  }, [count]);

  const positionAttribute = useMemo(
    () => new THREE.BufferAttribute(positions, 3),
    [positions]
  );

  const sizeAttribute = useMemo(
    () => new THREE.BufferAttribute(sizes, 1),
    [sizes]
  );

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    const geometry = pointsRef.current.geometry;
    const positionsAttr = geometry.attributes.position as THREE.BufferAttribute;

    // Slowly rotate and bob particles
    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;

    // Twinkle effect - modulate size
    const sizeAttr = geometry.attributes.aSize as THREE.BufferAttribute;
    if (sizeAttr) {
      for (let i = 0; i < count; i++) {
        const p = particles.current[i];
        const twinkle = Math.sin(time * p.speed + p.phase) * 0.5 + 0.5;
        sizeAttr.array[i] = p.scale * (0.5 + twinkle * 0.5);
      }
      sizeAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <primitive attach="attributes-position" object={positionAttribute} />
        <primitive attach="attributes-aSize" object={sizeAttribute} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#06b6d4"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/canvas/FloatingParticles.tsx
git commit -m "feat: add FloatingParticles component with twinkling effect

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Create Effects Pipeline (PostProcessing)

**Files:**
- Create: `app/components/canvas/Effects.tsx`

**Interfaces:**
- Consumes: `@react-three/postprocessing` effects
- Produces: `Effects` — EffectComposer with Bloom, ChromaticAberration, Noise, Vignette

- [ ] **Step 1: Create app/components/canvas/Effects.tsx**

```tsx
"use client";

import { Bloom, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";

export function Effects() {
  return (
    <>
      <Bloom
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        intensity={0.8}
        blendFunction={BlendFunction.ADD}
      />
      <ChromaticAberration
        offset={new Vector2(0.002, 0.002)}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise opacity={0.02} blendFunction={BlendFunction.OVERLAY} />
      <Vignette darkness={0.4} offset={0.2} />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/canvas/Effects.tsx
git commit -m "feat: add post-processing effects pipeline

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Create Scene Wrapper

**Files:**
- Create: `app/components/canvas/Scene.tsx`

**Interfaces:**
- Consumes: `ShaderPlane`, `FloatingParticles`, `Effects`
- Produces: `Scene` — fixed-position R3F Canvas covering viewport

- [ ] **Step 1: Create app/components/canvas/Scene.tsx**

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { ShaderPlane } from "./ShaderPlane";
import { FloatingParticles } from "./FloatingParticles";
import { Effects } from "./Effects";

export function Scene() {
  return (
    <div
      className="fixed inset-0 z-0"
      style={{ pointerEvents: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        frameloop="always"
      >
        <color attach="background" args={["#09090b"]} />
        <ShaderPlane />
        <FloatingParticles count={600} />
        <EffectComposer>
          <Effects />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Verify compilation**

Run: `pnpm tsc --noEmit`
Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add app/components/canvas/Scene.tsx
git commit -m "feat: add main 3D scene wrapper with canvas and effects

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: Integrate Scene into Page

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `Scene` from `app/components/canvas/Scene`
- Produces: (modifies page)

- [ ] **Step 1: Update app/page.tsx**

Add Scene to imports:

```tsx
import { Scene } from "./components/canvas/Scene";
```

Add `<Scene />` after `<TerminalProvider>`:

```tsx
<TerminalProvider>
  <Scene />
  <main>
    <MagneticCursor />
    {/* ... rest */}
  </main>
```

- [ ] **Step 2: Verify compilation**

Run: `pnpm tsc --noEmit`
Expected: No TypeScript errors

- [ ] **Step 3: Run dev server and verify 3D scene renders**

Run: `pnpm dev` (background)
Expected: Canvas with animated shader background visible

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: integrate 3D scene into main page

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

## Phase 3: Micro-Interactions

### Task 12: Create BentoCard Component

**Files:**
- Create: `app/components/effects/BentoCard.tsx`

**Interfaces:**
- Consumes: (none)
- Produces: `BentoCard` — glassmorphism card with spotlight and 3D tilt

- [ ] **Step 1: Create app/components/effects/BentoCard.tsx**

```tsx
"use client";

import { useRef, useState, type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "cyan" | "violet" | "emerald";
  tiltStrength?: number;
}

const glowMap = {
  cyan: {
    border: "border-accent-cyan/30 hover:border-accent-cyan/60",
    shadow: "hover:shadow-glow-cyan",
    spotlight: "radial-gradient(ellipse at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(6, 182, 212, 0.15) 0%, transparent 50%)",
  },
  violet: {
    border: "border-accent-violet/30 hover:border-accent-violet/60",
    shadow: "hover:shadow-glow-violet",
    spotlight: "radial-gradient(ellipse at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
  },
  emerald: {
    border: "border-accent-emerald/30 hover:border-accent-emerald/60",
    shadow: "hover:shadow-glow-emerald",
    spotlight: "radial-gradient(ellipse at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(16, 185, 129, 0.15) 0%, transparent 50%)",
  },
};

export function BentoCard({
  children,
  className,
  glowColor = "cyan",
  tiltStrength = 10,
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const glow = glowMap[glowColor];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Update spotlight position
    cardRef.current.style.setProperty("--mouse-x", `${x}%`);
    cardRef.current.style.setProperty("--mouse-y", `${y}%`);

    // Calculate tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((e.clientX - rect.left - centerX) / centerX) * tiltStrength;
    const rotateX = ((centerY - (e.clientY - rect.top)) / centerY) * tiltStrength;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 md:p-8",
        "bg-zinc-900/50 backdrop-blur-md",
        "border border-zinc-800",
        "transition-all duration-300",
        glow.border,
        glow.shadow,
        isHovered && "scale-[1.02]",
        className
      )}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
        willChange: "transform",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spotlight overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: glow.spotlight,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Specular sheen */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300",
          "bg-gradient-to-br from-white/10 via-transparent to-transparent"
        )}
        style={{
          opacity: isHovered ? Math.abs(tilt.y) / tiltStrength * 0.3 : 0,
          transform: `translateX(${tilt.y * 0.5}px) translateY(${-tilt.x * 0.5}px)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/effects/BentoCard.tsx
git commit -m "feat: add BentoCard component with spotlight and 3D tilt

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 13: Upgrade Cursor Component

**Files:**
- Modify: `app/components/ui/MagneticCursor.tsx` → move to `app/components/effects/Cursor.tsx`
- Delete: `app/components/ui/MagneticCursor.tsx`

**Interfaces:**
- Consumes: (none)
- Produces: `Cursor` — enhanced cursor with blend mode, trail, and magnetic snap

- [ ] **Step 1: Create app/components/effects/Cursor.tsx**

```tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "../../lib/utils";

interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
  timestamp: number;
}

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const position = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const trail = useRef<TrailPoint[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const lastMoveTime = useRef(0);
  const velocity = useRef({ x: 0, y: 0 });

  const addTrailPoint = useCallback((x: number, y: number) => {
    trail.current.push({ x, y, opacity: 1, timestamp: Date.now() });
    if (trail.current.length > 8) {
      trail.current.shift();
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || "ontouchstart" in window) return;

    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = now - lastMoveTime.current;

      velocity.current.x = dt > 0 ? (e.clientX - target.current.x) / dt : 0;
      velocity.current.y = dt > 0 ? (e.clientY - target.current.y) / dt : 0;

      target.current.x = e.clientX;
      target.current.y = e.clientY;
      lastMoveTime.current = now;

      // Add trail on fast movement
      const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);
      if (speed > 0.5) {
        addTrailPoint(e.clientX, e.clientY);
      }

      if (!isVisible) setIsVisible(true);
    };

    const onEnter = () => setIsVisible(true);
    const onLeave = () => setIsVisible(false);
    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onHoverStart = (e: MouseEvent) => {
      const hoveredTarget = e.target as HTMLElement;
      if (hoveredTarget.closest("a, button, [data-magnetic]")) {
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
    let trailRafId: number;

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

    // Trail animation
    const animateTrail = () => {
      const now = Date.now();
      trail.current = trail.current.filter((point) => {
        const age = now - point.timestamp;
        point.opacity = Math.max(0, 1 - age / 200);
        return point.opacity > 0;
      });

      if (trailRef.current && trail.current.length > 0) {
        const dots = trailRef.current.querySelectorAll("[data-trail-dot]");
        trail.current.forEach((point, i) => {
          if (dots[i]) {
            dots[i].setAttribute(
              "style",
              `transform: translate(${point.x}px, ${point.y}px) translate(-50%, -50%) scale(${point.opacity}); opacity: ${point.opacity}`
            );
          }
        });
      }

      trailRafId = requestAnimationFrame(animateTrail);
    };
    trailRafId = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onHoverStart);
      document.removeEventListener("mouseout", onHoverEnd);
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(trailRafId);
    };
  }, [isVisible, addTrailPoint]);

  return (
    <>
      {/* Trail container */}
      <div
        ref={trailRef}
        className="pointer-events-none fixed inset-0 z-[9998]"
        aria-hidden="true"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            data-trail-dot
            className="absolute w-1 h-1 rounded-full bg-accent-cyan"
            style={{
              opacity: 0,
              transform: "translate(-50%, -50%) scale(0)",
            }}
          />
        ))}
      </div>

      {/* Main cursor */}
      <div
        ref={cursorRef}
        className={cn(
          "pointer-events-none fixed top-0 left-0 z-[9999] rounded-full",
          "mix-blend-difference transition-all duration-150",
          isVisible ? "opacity-100" : "opacity-0",
          // Default
          "bg-white",
          !isHovering && !isClicking && "w-3 h-3",
          // Hovering
          isHovering && !isClicking && "w-12 h-12 border-2 border-white bg-transparent",
          // Clicking
          isClicking && "w-8 h-8 scale-75",
          "hidden md:block"
        )}
      />
    </>
  );
}
```

- [ ] **Step 2: Update imports in app/page.tsx**

Change:
```tsx
import { MagneticCursor } from "./components/ui/MagneticCursor";
```
To:
```tsx
import { Cursor } from "./components/effects/Cursor";
```

And in the JSX:
```tsx
<Cursor />
```

- [ ] **Step 3: Delete old file**

```bash
rm app/components/ui/MagneticCursor.tsx
```

- [ ] **Step 4: Verify compilation**

Run: `pnpm tsc --noEmit`
Expected: No TypeScript errors

- [ ] **Step 5: Commit**

```bash
git add app/components/effects/Cursor.tsx app/page.tsx
git rm app/components/ui/MagneticCursor.tsx
git commit -m "feat: upgrade cursor with blend mode and particle trail

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 14: Create HorizontalSection for Experience

**Files:**
- Create: `app/components/scroll/HorizontalSection.tsx`
- Modify: `app/components/experience/ExperienceSection.tsx`

**Interfaces:**
- Consumes: `useLenis` from `app/hooks/useLenis`
- Produces: `HorizontalSection` — pinned horizontal scroll wrapper

- [ ] **Step 1: Create app/components/scroll/HorizontalSection.tsx**

```tsx
"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "../../lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface HorizontalSectionProps {
  children: ReactNode;
  className?: string;
  cardWidth?: number;
}

export function HorizontalSection({
  children,
  className,
  cardWidth = 400,
}: HorizontalSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    // Count children to calculate total width
    const children = wrapper.children;
    const totalWidth = children.length * cardWidth + (children.length - 1) * 32; // gap

    // Check if there's enough scroll distance
    const viewportWidth = window.innerWidth;
    const scrollDistance = Math.max(0, totalWidth - viewportWidth + 200);

    // Skip on mobile or reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || scrollDistance <= 0 || viewportWidth < 768) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(wrapper, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${scrollDistance}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, container);

    return () => ctx.revert();
  }, [cardWidth]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      <div
        ref={wrapperRef}
        className="flex gap-8 pl-[max(2rem,calc((100vw-1400px)/2))]"
        style={{ width: "max-content" }}
      >
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update ExperienceSection to use HorizontalSection**

```tsx
"use client";

import { motion } from "framer-motion";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { HorizontalSection } from "../scroll/HorizontalSection";

export function ExperienceSection() {
  return (
    <section id="experience" className="relative">
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-24 md:pt-32">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-4">
            Experience
          </h2>
          <p className="text-zinc-400 text-lg">
            Building impactful products across industries
          </p>
        </motion.div>
      </div>

      {/* Horizontal scroll container */}
      <HorizontalSection className="pb-24 md:pb-32">
        <div className="w-[calc(50vw-2rem)] flex-shrink-0 md:w-[400px]">
          <div className="h-full flex items-center">
            <p className="text-zinc-500 text-sm uppercase tracking-wider">
              Scroll to explore →
            </p>
          </div>
        </div>
        <ExperienceTimeline horizontal />
      </HorizontalSection>
    </section>
  );
}
```

- [ ] **Step 3: Update ExperienceTimeline to support horizontal mode**

Modify `app/components/experience/ExperienceTimeline.tsx` to accept a `horizontal` prop:

```tsx
interface ExperienceTimelineProps {
  horizontal?: boolean;
}

export function ExperienceTimeline({ horizontal = false }: ExperienceTimelineProps) {
  // Add horizontal class when prop is true
  return (
    <div className={cn("flex gap-8", horizontal && "flex-row items-start")}>
      {/* ... existing code ... */}
    </div>
  );
}
```

- [ ] **Step 4: Verify compilation**

Run: `pnpm tsc --noEmit`
Expected: No TypeScript errors

- [ ] **Step 5: Commit**

```bash
git add app/components/scroll/HorizontalSection.tsx app/components/experience/ExperienceSection.tsx app/components/experience/ExperienceTimeline.tsx
git commit -m "feat: add horizontal scroll section for experience

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

## Phase 4: Audio-Visual Immersion

### Task 15: Create AudioEngine Hook

**Files:**
- Create: `app/hooks/useAudioEngine.ts`

**Interfaces:**
- Consumes: (none)
- Produces:
  - `useAudioEngine()`: hook returning `{ isEnabled, isMuted, toggle, playHover, playClick }`

- [ ] **Step 1: Create app/hooks/useAudioEngine.ts**

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface AudioEngine {
  isEnabled: boolean;
  isMuted: boolean;
  toggle: () => void;
  playHover: () => void;
  playClick: () => void;
}

export function useAudioEngine(): AudioEngine {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Initialize audio context lazily
  const initAudio = useCallback(() => {
    if (audioContextRef.current) return audioContextRef.current;

    const ctx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.value = 0; // Start muted

    audioContextRef.current = ctx;
    masterGainRef.current = masterGain;

    return ctx;
  }, []);

  const toggle = useCallback(() => {
    const ctx = initAudio();

    if (isMuted) {
      // Resume context if suspended
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      setIsMuted(false);
      if (masterGainRef.current) {
        masterGainRef.current.gain.setTargetAtTime(0.3, ctx.currentTime, 0.1);
      }
    } else {
      setIsMuted(true);
      if (masterGainRef.current) {
        masterGainRef.current.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
      }
    }
    setIsEnabled(true);
  }, [isMuted, initAudio]);

  const playHover = useCallback(() => {
    if (isMuted || !audioContextRef.current || !masterGainRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(masterGainRef.current);

    osc.start(now);
    osc.stop(now + 0.1);
  }, [isMuted]);

  const playClick = useCallback(() => {
    if (isMuted || !audioContextRef.current || !masterGainRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.03);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(masterGainRef.current);

    osc.start(now);
    osc.stop(now + 0.06);
  }, [isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return { isEnabled, isMuted, toggle, playHover, playClick };
}
```

- [ ] **Step 2: Create AudioContext type extension**

Add to `app/hooks/useAudioEngine.ts`:

```ts
// Webkit AudioContext fallback
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
```

- [ ] **Step 3: Create app/components/audio/AudioContext.tsx**

```tsx
"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAudioEngine } from "../../hooks/useAudioEngine";

interface AudioContextValue {
  isEnabled: boolean;
  isMuted: boolean;
  toggle: () => void;
  playHover: () => void;
  playClick: () => void;
}

const AudioContext = createContext<AudioContextValue>({
  isEnabled: false,
  isMuted: true,
  toggle: () => {},
  playHover: () => {},
  playClick: () => {},
});

export function AudioProvider({ children }: { children: ReactNode }) {
  const audio = useAudioEngine();

  return (
    <AudioContext.Provider value={audio}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}
```

- [ ] **Step 4: Create app/components/audio/SoundToggle.tsx**

```tsx
"use client";

import { useAudio } from "./AudioContext";
import { cn } from "../../lib/utils";

export function SoundToggle() {
  const { isEnabled, isMuted, toggle } = useAudio();

  return (
    <button
      onClick={toggle}
      className={cn(
        "fixed bottom-8 right-8 z-50",
        "w-12 h-12 rounded-full",
        "flex items-center justify-center",
        "transition-all duration-300",
        "border backdrop-blur-sm",
        isMuted
          ? "bg-zinc-900/80 border-zinc-700 text-zinc-500"
          : "bg-accent-cyan/10 border-accent-cyan/50 text-accent-cyan",
        "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50"
      )}
      aria-label={isMuted ? "Enable sound" : "Mute sound"}
    >
      {isMuted ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <div className="flex items-center gap-0.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "w-0.5 bg-accent-cyan rounded-full",
                "animate-[soundWave_0.5s_ease-in-out_infinite]",
                isEnabled && !isMuted && `animate-delay-${i * 100}`
              )}
              style={{
                height: `${6 + i * 3}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}
    </button>
  );
}
```

Add to `app/globals.css`:

```css
@keyframes soundWave {
  0%, 100% { transform: scaleY(0.5); }
  50% { transform: scaleY(1); }
}
```

- [ ] **Step 5: Integrate AudioProvider and SoundToggle**

Update `app/layout.tsx`:

```tsx
import { AudioProvider } from "./components/audio/AudioContext";
import { SoundToggle } from "./components/audio/SoundToggle";
```

Wrap in AudioProvider:

```tsx
<body className="font-sans antialiased">
  <AudioProvider>
    <LenisProvider>
      {children}
    </LenisProvider>
    <SoundToggle />
  </AudioProvider>
  <AnalyticsProvider />
</body>
```

- [ ] **Step 6: Verify compilation**

Run: `pnpm tsc --noEmit`
Expected: No TypeScript errors

- [ ] **Step 7: Commit**

```bash
git add app/hooks/useAudioEngine.ts app/components/audio/AudioContext.tsx app/components/audio/SoundToggle.tsx app/globals.css app/layout.tsx
git commit -m "feat: add audio engine with Web Audio API and sound toggle

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

## Phase 5: Polish and Accessibility

### Task 16: Add Reduced Motion Support

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: (none)
- Produces: (enhanced globals.css)

- [ ] **Step 1: Ensure reduced motion support exists and is comprehensive**

Verify the existing `@media (prefers-reduced-motion: reduce)` block handles all animations:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Add additional reduced motion overrides for canvas and 3D elements:

```css
/* Canvas 3D scene - disable heavy effects */
@media (prefers-reduced-motion: reduce) {
  .fixed.inset-0.z-0 canvas {
    display: none;
  }

  body::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 0;
    background: linear-gradient(135deg, #09090b 0%, #18181b 100%);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat: add comprehensive reduced motion support

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 17: Final Verification

**Files:**
- (all modified files)

- [ ] **Step 1: Run full TypeScript check**

Run: `pnpm tsc --noEmit`
Expected: No TypeScript errors

- [ ] **Step 2: Run lint check**

Run: `pnpm lint`
Expected: No lint errors

- [ ] **Step 3: Run build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 4: Run dev server and manual verification**

Run: `pnpm dev` and open browser:
- [ ] 3D shader background animates smoothly
- [ ] Particles twinkle with bloom effect
- [ ] Lenis smooth scroll works
- [ ] TextScramble triggers on heading visibility
- [ ] Cursor has blend mode and trail
- [ ] BentoCard has spotlight and tilt
- [ ] Sound toggle works (click to enable, hover to test)
- [ ] Horizontal scroll section works on Experience
- [ ] All animations respect reduced motion

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete awwwards-caliber portfolio implementation

- 3D/WebGL scene with shader displacement and particles
- Lenis smooth scroll with GSAP integration
- Micro-interactions: spotlight cards, cursor trail, 3D tilt
- Audio engine with Web Audio API
- Accessibility: reduced motion support

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

## Summary

| Task | Component | Files Created/Modified |
|------|-----------|------------------------|
| 1 | Install deps | `package.json` |
| 2 | LenisProvider | `LenisProvider.tsx`, `useLenis.ts` |
| 3 | useMousePosition | `useMousePosition.ts` |
| 4 | TextScramble | `useTextScramble.ts`, `TextScramble.tsx` |
| 5 | Layout integration | `layout.tsx` |
| 6 | GLSL shaders | `noise.glsl`, `*.vert`, `*.frag`, `index.ts` |
| 7 | ShaderPlane | `ShaderPlane.tsx` |
| 8 | FloatingParticles | `FloatingParticles.tsx` |
| 9 | Effects pipeline | `Effects.tsx` |
| 10 | Scene wrapper | `Scene.tsx` |
| 11 | Page integration | `page.tsx` |
| 12 | BentoCard | `BentoCard.tsx` |
| 13 | Cursor upgrade | `Cursor.tsx`, remove `MagneticCursor.tsx` |
| 14 | HorizontalSection | `HorizontalSection.tsx`, `ExperienceSection.tsx` |
| 15 | Audio engine | `useAudioEngine.ts`, `AudioContext.tsx`, `SoundToggle.tsx` |
| 16 | Reduced motion | `globals.css` |
| 17 | Final verification | (all files) |

**Total: 17 tasks, ~4 phases**
