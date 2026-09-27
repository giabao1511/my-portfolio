# Awwwards-Caliber Creative Portfolio — Design Specification

## 1. Overview & Goals

Transform the existing Next.js TypeScript portfolio into an award-winning, Awwwards-caliber creative portfolio with:

- Extreme visual depth via 3D/WebGL
- Cutting-edge micro-interactions
- High-end scroll-driven animations
- Optional audio-visual immersion

**Success criteria:**
- 60+ FPS across all animations
- Zero layout shift from animations
- Graceful degradation if WebGL is unavailable
- All interactions feel premium and responsive

---

## 2. Tech Stack

### Dependencies to Add

| Package | Version | Purpose |
|---------|---------|---------|
| `@studio-freight/lenis` | ^1.x | Ultra-smooth inertia scrolling |
| `gsap` | ^3.x | Scroll animations, timeline orchestration |
| `@react-three/postprocessing` | ^2.x | Bloom, ChromaticAberration, Noise, Vignette |
| `postprocessing` | ^6.x | Peer dependency for postprocessing |

### Existing Dependencies to Retain

- `@react-three/fiber` ^9.x
- `@react-three/drei` ^10.x
- `three` ^0.186.x
- `framer-motion` ^13.x

---

## 3. Architecture

### File Structure

```
app/
├── components/
│   ├── canvas/
│   │   ├── Scene.tsx              # Main R3F Canvas wrapper (fixed background)
│   │   ├── ShaderPlane.tsx         # GLSL noise displacement background
│   │   ├── FloatingParticles.tsx  # Volumetric dust with DOF
│   │   ├── FloatingCards.tsx      # 3D skill/stats cards
│   │   └── Effects.tsx            # Post-processing pipeline
│   ├── scroll/
│   │   ├── LenisProvider.tsx      # Smooth scroll wrapper (client)
│   │   ├── ScrollReveal.tsx       # GSAP-powered section reveals
│   │   └── HorizontalSection.tsx  # Pinned horizontal scrub for Experience
│   ├── effects/
│   │   ├── TextScramble.tsx        # Terminal-style text scramble hook
│   │   ├── BentoCard.tsx           # Spotlight + 3D tilt card
│   │   ├── Cursor.tsx              # Enhanced magnetic cursor (upgrades existing)
│   │   └── GlowBorder.tsx          # Mouse-tracking radial glow
│   ├── audio/
│   │   ├── AudioEngine.tsx         # Web Audio API controller
│   │   └── SoundToggle.tsx         # Animated audio toggle button
│   └── layout/
│       └── SmoothScroll.tsx        # Lenis + GSAP integration wrapper
├── hooks/
│   ├── useTextScramble.ts          # Text scramble animation hook
│   ├── useMousePosition.ts         # Normalized mouse position
│   ├── useLenis.ts                 # Lenis instance access
│   └── useAudioEngine.ts           # Audio context management
└── lib/
    └── shaders/
        ├── vertex.glsl             # Noise displacement vertex shader
        └── fragment.glsl           # Fluid distortion fragment shader

public/
└── audio/
    ├── ambient.mp3                 # Subtle ambient loop (optional)
    ├── hover.wav                  # Soft hover sound
    └── click.wav                  # Click feedback sound
```

---

## 4. Phase 1: Lenis + GSAP Scroll Foundation

### 4.1 LenisProvider (`app/components/scroll/LenisProvider.tsx`)

**Purpose:** Wrap the app in Lenis smooth scroll, sync with GSAP.

**Implementation:**
- Client component (`"use client"`)
- Import `Lenis` from `@studio-freight/lenis`
- Initialize in `useEffect`, cleanup in return
- Expose instance via React Context for child components
- RAF loop: `lenis.raf(time)` called every frame
- Stop native scroll: `lenis.stop()` on mount, `lenis.start()` on cleanup

**Props:** None (global provider)

**Context:**
```typescript
interface LenisContextValue {
  lenis: Lenis | null;
  scrollY: number;
}
```

### 4.2 GSAP Integration

- `ScrollTrigger.create({ scroller: lenisElement })` for all scroll animations
- After Lenis init, call `ScrollTrigger.refresh()` once
- GSAP ticker drives Lenis RAF: `lenis.raf(time)` in `gsap.ticker.add()`

### 4.3 ScrollReveal (`app/components/scroll/ScrollReveal.tsx`)

**Purpose:** Reusable component for scroll-triggered fade + translate animations.

**Props:**
```typescript
interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;       // ms delay before animation (default: 0)
  direction?: "up" | "down" | "left" | "right"; // default: "up"
  duration?: number;   // animation duration in seconds (default: 0.8)
  distance?: number;   // translate distance in px (default: 60)
  threshold?: number;  // 0-1, viewport trigger point (default: 0.2)
  once?: boolean;      // only animate once (default: true)
}
```

**Behavior:**
- Uses IntersectionObserver for lightweight trigger
- On intersect: GSAP animates from offset position to 0
- `will-change: transform` set before, removed after animation complete

### 4.4 TextScramble (`app/components/effects/TextScramble.tsx` + `useTextScramble.ts`)

**Purpose:** Terminal/hacker text-decoding effect on heading reveals.

**Hook API (`useTextScramble.ts`):**
```typescript
function useTextScramble(text: string, isActive: boolean): string;
// Returns current scrambled/decoded string
```

**Algorithm:**
- Charset: `!@#$%^&*()_+-=[]{}|;':\",./<>?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`
- On activate: start cycling random chars
- Over `duration` ms, progressively reveal actual characters left-to-right
- Each character "resolves" at staggered intervals
- Final state: exact original string

**Component API (`TextScramble.tsx`):**
```typescript
interface TextScrambleProps {
  text: string;
  className?: string;
  duration?: number;    // total scramble duration in ms (default: 1000)
  scrambleSpeed?: number; // ms between frame updates (default: 30)
  triggerOnce?: boolean;
}
```

**Behavior:**
- Uses IntersectionObserver to trigger on viewport enter
- Wraps children in `<span>` with monospace font override
- Subtle cursor blink at end while scrambling

---

## 5. Phase 2: 3D/WebGL Scene

### 5.1 Scene Wrapper (`app/components/canvas/Scene.tsx`)

**Purpose:** Fixed-position R3F Canvas covering the entire viewport.

**Implementation:**
- Client component with `position: fixed`, `inset: 0`, `z-index: 0`
- `pointer-events: none` so it doesn't block interactions
- `frameloop="demand"` for performance
- Transparent background (alpha: true)
- Contains: ShaderPlane, FloatingParticles, FloatingCards

### 5.2 ShaderPlane (`app/components/canvas/ShaderPlane.tsx`)

**Purpose:** Full-screen GLSL noise displacement mesh that reacts to mouse velocity.

**Visual:**
- Large plane filling the viewport
- Animated Perlin/Simplex noise displacement in Z-axis
- Subtle iridescent/gradient coloring
- Mouse drag creates fluid wave ripples radiating from cursor

**Shader Uniforms:**
```glsl
uniform float uTime;
uniform vec2 uMouse;       // normalized -1 to 1
uniform vec2 uVelocity;    // mouse velocity
uniform float uIntensity;  // displacement strength (default: 0.5)
```

**Vertex Shader Logic:**
- Sample 2D noise at `uv * 3.0 + uTime * 0.1`
- Displace vertex.z by noise * uIntensity
- Mouse influence: `smoothstep(distance, 0.0, 1.0)` falloff from cursor
- Velocity adds to displacement strength (faster = bigger waves)

**Fragment Shader Logic:**
- Base color: deep navy/charcoal gradient
- Iridescent overlay: color shifts based on noise value
- Mouse proximity adds subtle glow

**Performance:**
- PlaneGeometry with 64x64 segments (sufficient detail)
- `DoubleSide` rendering
- No shadows

### 5.3 FloatingParticles (`app/components/canvas/FloatingParticles.tsx`)

**Purpose:** Depth-of-field volumetric dust/particles with bloom.

**Visual:**
- 500-1000 small glowing points
- Random distribution across 3D space (depth: -10 to 10)
- Slow upward drift animation
- Varying sizes (0.01 to 0.05)
- Some particles twinkle (opacity oscillation)

**Implementation:**
- `Points` geometry with `PointsMaterial`
- Custom shader for twinkling (vertex shader: modulate point size)
- Add `<EffectComposer>` with:
  - `<Bloom>`: intensity 0.5, luminanceThreshold 0.6
  - `<ChromaticAberration>`: offset 0.002 (subtle)
  - `<Vignette>`: darkness 0.3, offset 0.1

### 5.4 FloatingCards (`app/components/canvas/FloatingCards.tsx`)

**Purpose:** 3D floating skill/stat cards with spring-based physics.

**Data:** Map existing BentoStats data:
```typescript
const skills = [
  { label: "4+", unit: "Years", desc: "of professional experience" },
  { label: "20+", unit: "Projects", desc: "successfully shipped" },
  { label: "99%", unit: "Uptime", desc: "for production systems" },
  // ... more cards
];
```

**Visual:**
- Rounded rectangle mesh (BoxGeometry, very thin)
- Glassmorphism material: `MeshPhysicalMaterial` with transmission
- Text geometry (drei `Text`) on each card
- Cards float at varying Y positions, gently bobbing

**Physics:**
- On hover (raycaster): spring animation toward camera
- Spring config: `stiffness: 100, damping: 10`
- Subtle continuous rotation on Y axis
- Cards spread out in a loose arc formation

### 5.5 Effects Pipeline (`app/components/canvas/Effects.tsx`)

**Purpose:** Centralized post-processing configuration.

```tsx
<EffectComposer>
  <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} intensity={0.8} />
  <ChromaticAberration offset={[0.002, 0.002]} />
  <Noise opacity={0.02} />
  <Vignette darkness={0.4} offset={0.2} />
</EffectComposer>
```

---

## 6. Phase 3: Micro-Interactions

### 6.1 Cursor Upgrade (`app/components/effects/Cursor.tsx`)

**Purpose:** Upgrade existing MagneticCursor with particle trail + blend mode.

**Current state (from `MagneticCursor.tsx`):**
- CSS-based cursor follower with lag
- Simple scale on hover

**Upgrade:**
- **Blend mode:** `mix-blend-mode: difference` for high contrast on any background
- **Particle trail:** On fast movement, emit fading dots
  - Store last N positions, render as fading circles
  - Fade out over 200ms
- **Magnetic snap:** Within 100px of interactive elements, cursor accelerates toward center
- **Scale on interactive:** Scale to 1.5x on links/buttons, 2x on drag targets
- **Performance:** Use `transform` only, no layout properties

**Visual spec:**
- Default: 12px circle, white fill
- On interactive: 20px circle, hollow with border
- On dragging: 30px ring
- Trail: 5 fading circles, 4px each

### 6.2 BentoCard (`app/components/effects/BentoCard.tsx`)

**Purpose:** Reusable card component with spotlight + 3D tilt.

**Props:**
```typescript
interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";  // default: "md"
  glowColor?: string;          // default: theme accent
  tiltStrength?: number;       // max rotation in degrees (default: 10)
}
```

**Visual:**
- Glassmorphism: `backdrop-filter: blur(12px)`, semi-transparent background
- Dynamic spotlight: radial gradient following cursor within card bounds
- Glow border: `box-shadow` with glow color, opacity tied to cursor proximity

**3D Tilt Behavior:**
- Track `mousemove` on card
- Calculate `rotateX` and `rotateY` from cursor position relative to card center
- Clamp rotation to ±`tiltStrength` degrees
- Smooth interpolation: lerp current rotation toward target (factor: 0.1)

**Specular Sheen:**
- Pseudo-element `::after` with diagonal gradient
- Gradient position tied to cursor position
- Opacity increases toward edges, creates "glare" effect

**Implementation:**
- CSS custom properties `--tilt-x`, `--tilt-y`, `--mouse-x`, `--mouse-y`
- `transform: perspective(1000px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y))`
- `will-change: transform` on hover only

### 6.3 HorizontalSection (`app/components/scroll/HorizontalSection.tsx`)

**Purpose:** Convert Experience section to GSAP-pinned horizontal scrub.

**Behavior:**
- Container pinned at top of viewport
- Vertical scroll distance maps to horizontal translate
- Cards inside have parallax layers (background moves slower)
- Smooth deceleration on scroll release

**Implementation:**
- GSAP ScrollTrigger with `pin: true`, `scrub: 1`
- Inner flex container translates `-x` based on scroll progress
- Parallax: cards have `xPercent` offset based on position in carousel

**Fallback:** If scroll is too short (mobile), show as normal vertical stack

---

## 7. Phase 4: Audio-Visual Immersion

### 7.1 AudioEngine (`app/components/audio/AudioEngine.tsx`)

**Purpose:** Web Audio API controller with synthesized sounds.

**Initialization:**
- Create `AudioContext` lazily on first user interaction (browser policy)
- Context stored in React Context
- Master gain node for global mute

**Sound Types:**

| Sound | Type | Description |
|-------|------|-------------|
| Ambient | Loop | Low-frequency ambient drone (optional, via MP3) |
| Hover | Buffer | Soft sine wave blip, 50ms, 440Hz → 880Hz |
| Click | Buffer | Low thud, 30ms, 100Hz with quick decay |
| Tab switch | Buffer | Sci-fi whoosh, 150ms, filtered noise |

**API:**
```typescript
interface AudioEngineValue {
  isEnabled: boolean;
  isMuted: boolean;
  toggle: () => void;
  playHover: () => void;
  playClick: () => void;
  playTabSwitch: () => void;
  setAmbient: (playing: boolean) => void;
}
```

### 7.2 SoundToggle (`app/components/audio/SoundToggle.tsx`)

**Purpose:** Animated toggle button for audio.

**Visual:**
- 40x40px circle button
- When muted: speaker icon with X
- When enabled: animated sound-wave bars
- Subtle pulse animation when audio is playing
- Position: fixed, bottom-right corner, above footer

**States:**
- `muted` (default): grey, no animation
- `enabled`: accent color, wave bars animate
- `playing`: subtle glow pulse

### 7.3 Audio Integration Points

- **Hover:** `onMouseEnter` on BentoCard, links, buttons
- **Click:** `onClick` on primary buttons, nav items
- **Tab switch:** IntersectionObserver on section enter
- **Ambient:** Toggle-controlled, default off

---

## 8. Performance Guidelines

### 8.1 Animation Performance

- All CSS transforms use `transform` and `opacity` only (compositor-friendly)
- `will-change` applied only during active animation, removed after
- R3F uses `frameloop="demand"` where possible
- GSAP `ScrollTrigger` batched for efficiency

### 8.2 Memory Management

- Lenis instance cleaned up on unmount
- GSAP ScrollTriggers killed on unmount
- Audio buffers released on unmount
- R3F dispose geometries/materials on unmount

### 8.3 Accessibility

- `prefers-reduced-motion`: disable all non-essential animations
- Audio toggle is keyboard accessible
- R3F canvas degrades gracefully if WebGL unavailable
- Scroll remains functional without JS (progressive enhancement)

### 8.4 Browser Support

- Target: modern evergreen browsers
- WebGL 2.0 required for 3D effects
- Fallback: static gradient background if WebGL fails

---

## 9. Implementation Order

1. **Install dependencies** — lenis, gsap, @react-three/postprocessing, postprocessing
2. **Phase 1: Lenis + GSAP foundation** — LenisProvider, ScrollReveal, TextScramble
3. **Phase 2: 3D/WebGL scene** — ShaderPlane, FloatingParticles, FloatingCards, Effects
4. **Phase 3: Micro-interactions** — Cursor upgrade, BentoCard, HorizontalSection
5. **Phase 4: Audio** — AudioEngine, SoundToggle, integration
6. **Polish: Performance + accessibility** — reduced motion, fallbacks

---

## 10. File Checklist

| File | Phase | Status |
|------|-------|--------|
| `package.json` | Setup | Add deps |
| `app/components/scroll/LenisProvider.tsx` | 1 | New |
| `app/components/scroll/ScrollReveal.tsx` | 1 | New |
| `app/hooks/useTextScramble.ts` | 1 | New |
| `app/hooks/useMousePosition.ts` | 1 | New |
| `app/hooks/useLenis.ts` | 1 | New |
| `app/components/canvas/Scene.tsx` | 2 | New |
| `app/components/canvas/ShaderPlane.tsx` | 2 | New |
| `app/components/canvas/FloatingParticles.tsx` | 2 | New |
| `app/components/canvas/FloatingCards.tsx` | 2 | New |
| `app/components/canvas/Effects.tsx` | 2 | New |
| `app/lib/shaders/vertex.glsl` | 2 | New |
| `app/lib/shaders/fragment.glsl` | 2 | New |
| `app/components/effects/TextScramble.tsx` | 1 | New |
| `app/components/effects/Cursor.tsx` | 3 | Upgrade existing |
| `app/components/effects/BentoCard.tsx` | 3 | New |
| `app/components/scroll/HorizontalSection.tsx` | 3 | New |
| `app/components/audio/AudioEngine.tsx` | 4 | New |
| `app/components/audio/SoundToggle.tsx` | 4 | New |
| `app/layout.tsx` | All | Update: wrap with providers |
| `app/page.tsx` | All | Update: integrate new components |

---

## 11. Dependencies Summary

```json
{
  "dependencies": {
    "@react-three/postprocessing": "^2.16.0",
    "@react-three/fiber": "^9.8.1",
    "@react-three/drei": "^10.7.9",
    "@studio-freight/lenis": "^1.0.42",
    "gsap": "^3.12.5",
    "postprocessing": "^6.36.3",
    "three": "^0.186.1"
  }
}
```
