# Chau Gia Bao — Interactive Engineering Portfolio

> A high-performance, WebGL-enhanced creative portfolio demonstrating distributed system architectures, micro-interactions, and strict 60+ FPS lifecycle optimizations.

[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-orange?style=flat-square&logo=three.js)](https://threejs.org)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.4.4-fc0?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**Quick Links:** [Live Demo](https://giabao.dev) · [Interactive System Flow](#core-architectural-pillars) · [Recruiter Mode](#dual-state-accessibility-recruiter-mode) · [Download Resume](#getting-started)

---

## Table of Contents

- [Core Architectural Pillars](#core-architectural-pillars)
- [Tech Stack Matrix](#tech-stack-matrix)
- [Interactive Terminal](#interactive-terminal)
- [Getting Started](#getting-started)
- [Performance Optimizations](#performance-optimizations)

---

## Core Architectural Pillars

### Zero-Jank WebGL Lifecycle Management

The portfolio implements a sophisticated render loop pausing mechanism to prevent idle CPU/GPU consumption:

```typescript
// PerformanceOptimizer.tsx — hooks into tab focus and viewport visibility
useEffect(() => {
  // Intersection Observer for viewport visibility
  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => setIsVisible(entry.isIntersecting));
  };

  // Visibility change for tab focus
  const handleVisibilityChange = () => {
    setIsTabActive(!document.hidden);
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
}, []);
```

**Hardware Capability Tiering:** The system detects device capabilities (`navigator.hardwareConcurrency`, `navigator.deviceMemory`) and gracefully degrades for low-core/mobile devices by disabling post-processing effects and reducing particle density.

### Standalone SVG Architecture Diagram

Built with pure SVG + Framer Motion instead of heavy graph libraries like `@xyflow/react`, keeping the JavaScript bundle lean while supporting:

- Interactive node states with hover/click animations
- Dynamic pulse wave shaders along connection paths
- Real-time latency badges per service layer

```typescript
// Animated pulse effect along architecture connections
<motion.line
  animate={{
    x1: [x1, x2],
    x2: [x1 + 40, x2 + 40],
    opacity: [0, 1, 0],
  }}
  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
/>
```

### Dual-State Accessibility ("Recruiter Mode")

A state synchronization pattern using `localStorage` that bypasses Three.js canvases, Lenis smooth-scroll, and kinetic physics to deliver:

- Clean, ATS/recruiter-friendly view
- Sub-second Time to Interactive (TTI)
- Zero visual distraction

```typescript
// RecruiterModeContext.tsx
const STORAGE_KEY = "recruiter-mode";

useEffect(() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "true") setIsEnabled(true);
}, []);

useEffect(() => {
  if (mounted) localStorage.setItem(STORAGE_KEY, String(isEnabled));
}, [isEnabled, mounted]);
```

### SSR/SSG & Hydration Strategy

Clean separation of server and client components with dynamic imports for 3D bundles:

- **Server Components:** SEO metadata, layout, static content
- **Client Components:** Three.js canvases, animations, interactive elements
- **Dynamic Imports:** `ssr: false` for WebGL bundles ensuring zero hydration mismatches

---

## Tech Stack Matrix

### Core / Framework

| Technology                                   | Version | Purpose                           |
| -------------------------------------------- | ------- | --------------------------------- |
| [Next.js](https://nextjs.org)                | 16.3.6  | App Router, SSR/SSG, API Routes   |
| [React](https://react.dev)                   | 19.2.8  | UI Library, Server Components     |
| [TypeScript](https://www.typescriptlang.org) | 5       | Type Safety, Developer Experience |

### Styling & Design System

| Technology                              | Purpose                       |
| --------------------------------------- | ----------------------------- |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS, Dark theme |
| [Lucide React](https://lucide.dev)      | Icon library                  |
| CSS Custom Properties                   | Design tokens, Color system   |

### Creative & 3D

| Technology                                                   | Purpose                                  |
| ------------------------------------------------------------ | ---------------------------------------- |
| [Three.js](https://threejs.org)                              | WebGL rendering                          |
| [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) | React renderer for Three.js              |
| [@react-three/drei](https://github.com/pmndrs/drei)          | Helpers, abstractions                    |
| [GSAP ScrollTrigger](https://greensock.com/scrolltrigger/)   | Scroll-driven animations                 |
| [Lenis](https://lenis.studio)                                | Smooth scrolling                         |
| Custom GLSL Shaders                                          | Noise functions, FBM, Background effects |

### Animation & Motion

| Technology                                      | Purpose                           |
| ----------------------------------------------- | --------------------------------- |
| [Framer Motion](https://www.framer.com/motion/) | Declarative animations            |
| SVG + Framer Motion                             | Architecture diagram, Pulse waves |

### Form & Serverless

| Technology                                     | Purpose               |
| ---------------------------------------------- | --------------------- |
| [React Hook Form](https://react-hook-form.com) | Form state management |
| [Zod](https://zod.dev)                         | Schema validation     |
| [Resend](https://resend.com)                   | Email delivery API    |
| [Sonner](https://sonner.dev)                   | Toast notifications   |

### System & Visualization

| Technology           | Purpose                           |
| -------------------- | --------------------------------- |
| Custom Audio Engine  | Web Audio API, Hover/Click sounds |
| Canvas-based Effects | Floating particles, Shaders       |

### Monitoring & Analytics

| Technology                                                  | Purpose                    |
| ----------------------------------------------------------- | -------------------------- |
| [@vercel/analytics](https://vercel.com/analytics)           | Visitor analytics          |
| [@vercel/speed-insights](https://vercel.com/speed-insights) | Core Web Vitals monitoring |

---

## Interactive Terminal

Easter egg developer terminal with the following commands:

| Command       | Description                   |
| ------------- | ----------------------------- |
| `help`        | Show available commands       |
| `about`       | View bio and expertise        |
| `skills`      | Display tech stack matrix     |
| `contact`     | Show contact information      |
| `download-cv` | Download resume (coming soon) |
| `clear`       | Clear terminal output         |
| `exit`        | Close terminal                |

**Usage:** Click the terminal icon in the bottom-right corner or use keyboard shortcut.

---

## Getting Started

### Prerequisites

- **Node.js:** 20.x or later
- **Package Manager:** pnpm 9.x (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/giabao4123/portfolio.git
cd portfolio

# Install dependencies (pnpm recommended)
pnpm install

# Copy environment variables
cp .env.local.example .env.local

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

### Environment Variables

```env
# .env.local

# Resend API Key (https://resend.com)
RESEND_API_KEY=re_your_api_key_here

# Email address to receive contact form submissions
CONTACT_EMAIL=your@email.com
```

### Available Scripts

| Command          | Description              |
| ---------------- | ------------------------ |
| `pnpm dev`       | Start development server |
| `pnpm build`     | Build for production     |
| `pnpm start`     | Start production server  |
| `pnpm lint`      | Run ESLint               |
| `pnpm typecheck` | Run TypeScript checks    |
| `pnpm format`    | Format with Prettier     |

---

## Performance Optimizations

### 60+ FPS Target

- **Render Loop Pausing:** Canvas only renders when visible and tab is active
- **Hardware Tiering:** Automatic quality adjustments based on device capabilities
- **Delta Capping:** Prevents frame drops from background tab returns

```typescript
// Cap delta to prevent jumps on tab return
const cappedDelta = Math.min(delta, 0.05);
```

### Bundle Optimization

- **Dynamic Imports:** Three.js loaded client-side only
- **Tree Shaking:** Selective Lucide icon imports
- **Font Optimization:** `display: swap` via next/font

### Lighthouse Scores (Target)

| Metric         | Target |
| -------------- | ------ |
| Performance    | 95+    |
| Accessibility  | 95+    |
| Best Practices | 100    |
| SEO            | 100    |

---

## License

MIT © Chau Gia Bao

---

Built with precision engineering and creative passion.
