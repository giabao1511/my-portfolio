# Portfolio Elite Upgrades — Design Specification

**Date:** 2026-09-27
**Author:** Claude Opus 5.5

---

## Overview

Transform the portfolio into a production-grade showcase with 5 critical upgrades: interactive architecture visualization, real-time metrics HUD, Three.js performance optimization, mobile fallbacks with RecruiterMode, and dynamic OG image generation.

---

## 1. SystemArchitecture Component

### Purpose
Interactive SVG-based system architecture visualization demonstrating microservices expertise.

### Design
- **Placement:** Standalone section below BentoStats, with generous vertical padding
- **Layout:** 5 horizontally-connected nodes with animated SVG connector lines
- **Nodes:**
  1. Client Layer (Next.js / TanStack Query)
  2. API Gateway & Auth (Nest.js / JWT & RBAC)
  3. Calculation Engine (F&I engine, sub-50ms)
  4. Async Message Bus & Webhooks
  5. Database Layer (MongoDB / compound indexes)
- **Animations:**
  - Pulsing glow on hover
  - Animated SVG dashes flowing along connector paths ("data packets")
  - Floating detail cards with tech breakdowns on click/hover
- **Framer Motion:** Spring animations for node interactions, staggered entry animations

### File
`app/components/architecture/SystemArchitecture.tsx`

---

## 2. EngineeringHUD Component

### Purpose
Real-time engineering metrics panel integrated as Bento cards.

### Design
- **Placement:** Bento grid section, inline with stats
- **Metrics displayed:**
  - Client Latency: < 50ms (live counter)
  - Core Web Vitals: LCP < 2.5s | INP < 150ms
  - Test Status: Playwright badge with pulsing green "Passing" state
  - Deployment: "Zero Rollbacks / CI/CD Active"
- **Visual treatment:**
  - Small pulsing status dots (green/cyan glow)
  - Animated sparklines using SVG paths
  - Monospace font for metrics (--font-mono)
  - Subtle gradient borders

### File
`app/components/hud/EngineeringHUD.tsx`

---

## 3. Three.js Performance Optimization

### Purpose
Smart render loop management to prevent battery drain and frame drops.

### Implementation
1. **Visibility Detection:**
   - `IntersectionObserver` to pause when canvas scrolls out of view
   - `document.visibilitychange` to pause when tab loses focus
2. **Adaptive Quality Tiers:**
   - Detect via `navigator.hardwareConcurrency` and `deviceMemory`
   - High: Full particles + post-processing (Bloom, Chromatic Aberration)
   - Low: Reduced particles (50%), disabled post-processing
3. **Preloader:**
   - Sleek sci-fi loading screen with percentage counter
   - Uses `@react-three/drei`'s `useProgress` hook
   - Unmounts gracefully once textures/shaders compiled

### Files
- `app/components/canvas/Scene.tsx` — Add visibility detection
- `app/components/canvas/PerformanceOptimizer.tsx` — Quality detection hook
- `app/components/canvas/Preloader.tsx` — Bootloader UI

---

## 4. RecruiterMode & Mobile Fallbacks

### Purpose
Accessibility and recruiter-friendly viewing mode.

### RecruiterMode Toggle
- **UI:** Floating pill badge, bottom-right corner
- **Icon:** Briefcase icon (Lucide)
- **Label:** "Recruiter Mode" / "Interactive 3D" (toggles based on state)
- **Persistence:** `localStorage` key `recruiter-mode`
- **When active:**
  - Collapses Three.js canvases (CSS `display: none`)
  - Stops Lenis smooth scrolling
  - Renders clean, readable layout
  - Shows prominent "Download CV" CTA

### Mobile/Touch Handling
- Disable custom cursor on touch devices via CSS media query
- Replace GSAP horizontal scroll with native swipe cards on mobile

### Accessibility
- Respect `prefers-reduced-motion` for all Framer Motion/GSAP
- Keyboard-navigable focus states

### Files
- `app/contexts/RecruiterModeContext.tsx`
- `app/hooks/useRecruiterMode.ts`
- `app/components/ui/RecruiterModeToggle.tsx`
- Update `app/components/effects/Cursor.tsx`
- Update `app/globals.css`

---

## 5. Dynamic OG Image Generation

### Purpose
Branded Open Graph preview image for social sharing.

### Implementation
- Use `@vercel/og` (ImageResponse) in `app/opengraph-image.tsx`
- Dark mode design with:
  - Name: "Chau Gia Bao"
  - Title: "Software Engineer"
  - Primary tech tags: Next.js, TypeScript, Microservices
  - Subtle gradient background matching brand colors
- Export as default from the file

### File
`app/opengraph-image.tsx`

---

## Integration Points

### Updated Files
- `app/page.tsx` — Add SystemArchitecture, EngineeringHUD, integrate RecruiterMode
- `app/layout.tsx` — Wrap with RecruiterModeProvider, update metadata
- `app/components/canvas/Scene.tsx` — Performance optimizations
- `app/components/effects/Cursor.tsx` — Touch device detection
- `app/globals.css` — Mobile/touch fallbacks, reduced motion

### New Files
1. `app/components/architecture/SystemArchitecture.tsx`
2. `app/components/hud/EngineeringHUD.tsx`
3. `app/components/canvas/PerformanceOptimizer.tsx`
4. `app/components/canvas/Preloader.tsx`
5. `app/contexts/RecruiterModeContext.tsx`
6. `app/hooks/useRecruiterMode.ts`
7. `app/components/ui/RecruiterModeToggle.tsx`
8. `app/opengraph-image.tsx`

---

## Testing Checklist

- [ ] SystemArchitecture renders all 5 nodes with SVG connectors
- [ ] Hover/click triggers pulse animations and detail cards
- [ ] EngineeringHUD shows live-updating metrics
- [ ] Tab visibility pauses/resumes Three.js render loop
- [ ] Low-end device detection reduces particle count
- [ ] RecruiterMode persists across page refresh
- [ ] RecruiterMode hides 3D canvas and shows clean layout
- [ ] Mobile touch devices don't show custom cursor
- [ ] prefers-reduced-motion disables heavy animations
- [ ] OG image generates correctly with @vercel/og
