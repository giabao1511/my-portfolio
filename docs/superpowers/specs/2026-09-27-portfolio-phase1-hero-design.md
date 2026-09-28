# Portfolio Phase 1: Hero Section Design

## Overview

**Goal:** Build the complete hero section for Chau Gia Bao's portfolio — a full-viewport immersive experience with 3D centerpiece, animated typography, magnetic CTAs, and Bento stats grid.

**Success criteria:**

- 60+ FPS on desktop (Chrome, Firefox, Safari)
- No layout shift during load
- Graceful mobile degradation (simplified 3D, reduced motion)
- Accessible color contrast (WCAG AA for text)

---

## Design System

### Color Palette

```
Background:   #09090b (zinc-950)
Surface:      #18181b (zinc-900)
Border:       #27272a (zinc-800)
Text Primary: #fafafa (zinc-50)
Text Muted:   #a1a1aa (zinc-400)
Accent Blue:  #06b6d4 (cyan-500) — primary neon
Accent Violet:#8b5cf6 (violet-500) — secondary
Accent Emerald:#10b981 (emerald-500) — tertiary
Glow Blue:    rgba(6, 182, 212, 0.4)
Glow Violet:  rgba(139, 92, 246, 0.3)
```

### Typography

- **Display:** Inter (Google Fonts) — 700 weight for name, 400 for tagline
- **Mono:** JetBrains Mono — terminal, stats numbers
- **Scale:** 96px → 64px → 48px → 32px → 24px → 16px → 14px

### Spacing

- Base unit: 4px
- Section padding: 96px vertical (desktop), 48px (mobile)
- Component gaps: 24px standard, 16px tight, 48px loose

### Motion Philosophy

- **Entrance:** Staggered fade-up, 100ms delay between elements
- **Hover:** Scale 1.02-1.05, spring physics (stiffness: 300, damping: 20)
- **Scroll:** Smooth parallax, 0.5x-0.8x rate
- **3D:** 60fps target, reduced to 30fps on battery saver
- **Duration:** 300-500ms for UI, 1-2s for entrance sequences

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HERO SECTION (100vh)                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         3D PARTICLE SPHERE (background)              │   │
│  │                                                     │   │
│  │    CHAUC GIA BAO                                    │   │
│  │    Software Engineer                                │   │
│  │    Architecting high-performance...                 │   │
│  │                                                     │   │
│  │    [Explore Work]  [Get In Touch]                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ BENTO STATS GRID                                    │   │
│  │ ┌──────────┐ ┌──────────┐                         │   │
│  │ │ 4+ Years │ │ Sub-50ms │                         │   │
│  │ └──────────┘ └──────────┘                         │   │
│  │ ┌──────────┐ ┌──────────┐                         │   │
│  │ │ 10K+ SKU │ │ Zero Roll │                         │   │
│  │ └──────────┘ └──────────┘                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│                         ↓ scroll                            │
└─────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints

- **Desktop:** 1280px+ — full 3D, 2-column bento grid
- **Tablet:** 768px-1279px — simplified 3D, 2-column bento
- **Mobile:** <768px — static gradient fallback, stacked bento

---

## Components

### 1. Hero3DCanvas

**Purpose:** Background particle sphere reacting to mouse

**Technical approach:**

- `@react-three/fiber` Canvas with `dpr={[1, 2]}` for retina
- `@react-three/drei` for OrbitControls (disabled), Float, Points
- Custom particle geometry: 2000 points on sphere surface
- Vertex shader: displacement based on time + mouse velocity
- Mouse tracking via normalized coordinates (-1 to 1)
- Lerped mouse position for smooth trailing effect
- Color: gradient from cyan to violet based on particle distance from center

**Performance:**

- `useFrame` with delta time capping (max 0.05s)
- `useMemo` for geometry and material
- Dynamic import with `ssr: false`
- `Suspense` fallback with skeleton loader

**Fallback (mobile/Low power):**

- Static radial gradient background
- CSS-only particle simulation (optional enhancement)

---

### 2. MagneticCursor

**Purpose:** Custom cursor with magnetic attraction to interactive elements

**Technical approach:**

- Global cursor div positioned fixed, pointer-events: none
- Track mouse position with lerp (0.15 factor for trailing)
- On hover over magnetic elements: cursor scales, element scales slightly toward cursor
- CSS transforms only, no layout thrashing
- Hide on mobile (touch devices)

**States:**

- Default: 12px circle, semi-transparent
- Hovering interactive: 24px circle, full opacity, glow
- Clicking: scale down 0.8

---

### 3. HeroTypography

**Purpose:** Animated name, role, tagline with staggered entrance

**Technical approach:**

- Framer Motion `motion.span` with staggered children
- Text split into words/lines for per-word animation
- `viewport={{ once: true }}` for entrance trigger
- Spring physics for natural feel

**Animation sequence:**

1. Name fades up (0-300ms)
2. Role fades up (200-500ms)
3. Tagline fades up (400-800ms)
4. CTAs fade up (600-1000ms)

**Mobile:** Reduce to essential animations only

---

### 4. MagneticButton

**Purpose:** CTA buttons with magnetic hover effect

**Technical approach:**

- Framer Motion for scale and position transforms
- `whileHover` with spring physics
- Text stays readable during deformation
- Glow effect on hover using box-shadow

**Variants:**

- Primary: Cyan border/text, filled on hover
- Secondary: Violet border, ghost style

---

### 5. BentoStats

**Purpose:** Grid of stat cards with hover physics

**Layout:** CSS Grid with variable span sizes

```
Desktop:  [ 2fr ] [ 1fr ]      [ 1fr ] [ 2fr ]
          [ 1fr ] [ 1fr 1fr ]  [ 2fr ] [ 1fr ]
```

**Card anatomy:**

```
┌─────────────────────────┐
│  [Icon]                  │
│  4+                      │  ← Large number (mono font)
│  Years of                │  ← Label
│  Experience              │
│  ─────────────────────   │
│  Hover: subtle glow      │
│  Scale: 1.02             │
└─────────────────────────┘
```

**Technical approach:**

- Framer Motion `motion.div` with stagger container
- `useInView` trigger for entrance animation
- Hover: `whileHover={{ scale: 1.02 }}` with spring
- Glow: `boxShadow` transition on hover

**Stats data:**

1. **4+ Years** — Hands-on Experience (icon: Code2)
2. **Sub-50ms** — Latency Calculation Engines (icon: Zap)
3. **10K+ SKUs** — Under 2.5s LCP & 150ms INP (icon: Package)
4. **Zero** — Deployment Rollbacks (icon: Shield)

---

## File Structure

```
app/
├── page.tsx                    # Main page (server component)
├── layout.tsx                  # Root layout with fonts
├── globals.css                 # Tailwind + custom styles
├── components/
│   ├── hero/
│   │   ├── HeroSection.tsx     # Container (client)
│   │   ├── Hero3DCanvas.tsx    # R3F canvas (dynamic import)
│   │   ├── HeroTypography.tsx  # Animated text
│   │   ├── MagneticButton.tsx  # Reusable CTA button
│   │   ├── BentoStats.tsx      # Stats grid
│   │   └── ScrollIndicator.tsx # Down arrow
│   ├── ui/
│   │   ├── MagneticCursor.tsx  # Custom cursor
│   │   └── Card3D.tsx          # Glass card wrapper
│   └── providers/
│       └── MotionProvider.tsx   # Framer Motion client wrapper
├── lib/
│   ├── constants.ts            # Stats data, colors, config
│   └── utils.ts                # cn(), format utilities
tailwind.config.ts              # Extended theme + animations
```

---

## Dependencies to Install

```bash
pnpm add @react-three/fiber @react-three/drei three framer-motion lucide-react clsx tailwind-merge
pnpm add -D @types/three
```

---

## Implementation Order

1. **Setup:** Install dependencies, configure Tailwind extensions
2. **Constants:** Define colors, stats data, typography config
3. **Utils:** `cn()` helper with clsx + tailwind-merge
4. **Hero3DCanvas:** 3D particle sphere (core complexity)
5. **MagneticCursor:** Global cursor component
6. **HeroTypography:** Staggered text animation
7. **MagneticButton:** Reusable CTA component
8. **BentoStats:** Grid with hover physics
9. **ScrollIndicator:** Animated down arrow
10. **HeroSection:** Compose all components
11. **Integration:** Add to page.tsx, verify mobile fallback
12. **Performance:** Check FPS, fix any jank
13. **Testing:** Visual verification on desktop + mobile

---

## Verification Checklist

- [ ] 60+ FPS in Chrome DevTools Performance panel
- [ ] No CLS during 3D load
- [ ] Mobile: particle fallback visible, no 3D errors
- [ ] Keyboard navigation works (Tab through CTAs)
- [ ] Reduced motion: animations respect `prefers-reduced-motion`
- [ ] All text readable (WCAG AA contrast)
- [ ] Scroll indicator visible on desktop
- [ ] Magnetic cursor hidden on touch devices

---

## Open Questions for Phase 2

- Contact form design and validation approach?
- Terminal interaction model (what commands, how to trigger)?
- Experience timeline animation details?
- About section or go straight to work showcase?
