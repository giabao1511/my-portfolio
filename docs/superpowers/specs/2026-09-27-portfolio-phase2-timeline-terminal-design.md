# Portfolio Phase 2: Experience Timeline + Interactive Terminal

## Overview

**Goal:** Build the Experience Timeline section and Interactive Terminal for Chau Gia Bao's portfolio.

**Success criteria:**
- Timeline nodes animate on scroll (Framer Motion `useInView`)
- Terminal opens via button click or keyboard shortcut (`` ` ``)
- Terminal commands work: `--skills`, `--contact`, `--download-cv`
- Mobile responsive layout
- 60+ FPS animations

---

## Design System (Phase 1 carryover)

### Colors
- Background: #09090b (zinc-950)
- Surface: #18181b (zinc-900)
- Accent Cyan: #06b6d4
- Accent Violet: #8b5cf6
- Accent Emerald: #10b981
- Glow effects from Phase 1

### Typography
- Display: Inter
- Mono: JetBrains Mono (terminal)

---

## Component 1: Experience Timeline

### Layout Structure

```
Desktop (≥1024px):
┌─────────────────────────────────────────────────────────────┐
│  EXPERIENCE                                                │
│                                                             │
│  ●───────────────────────────────────────────────────●    │
│  │                                                        │
│  │  ┌─────────────────┐  ┌─────────────────┐             │
│  │  │ Keyloop        │  │  Vongxanh      │             │
│  │  │ Jan 2025      │  │  Sep 2023      │             │
│  │  │ Software Eng.  │  │  Fullstack Eng │             │
│  │  │ • Achievement  │  │  • Achievement  │             │
│  │  │ • Achievement  │  │  • Achievement  │             │
│  │  └─────────────────┘  └─────────────────┘             │
│  │                                                        │
│  ●───────────────────────────────────────────────────●    │
│  │                                                        │
│  │  ┌─────────────────┐  ┌─────────────────┐             │
│  │  │ MangoAds        │  │  Keppel Land   │             │
│  │  │ Jan 2023       │  │  Sep 2022      │             │
│  │  │ Frontend Dev   │  │  Intern        │             │
│  │  │ • Achievement  │  │  • Achievement │             │
│  │  └─────────────────┘  └─────────────────┘             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Mobile (<1024px):
Timeline vertical with nodes on left, cards on right
```

### Data Structure

```typescript
const EXPERIENCE = [
  {
    id: "keyloop",
    company: "Keyloop",
    period: "Jan 2025 – Present",
    role: "Software Engineer",
    color: "cyan", // accent color for glow
    achievements: [
      "Saleshub multi-tenant automotive SaaS platform (BMW, VW, Honda)",
      "Real-time Financial/Insurance engine with sub-50ms client latency",
      "Automated E2E & API regression suites with Playwright + GitLab CI/CD",
    ],
  },
  {
    id: "vongxanh",
    company: "Vongxanh / Blue Circle",
    period: "Sep 2023 – Jan 2025",
    role: "Fullstack Engineer",
    color: "emerald",
    achievements: [
      "Modular Nest.js RESTful APIs & marathon registration engines",
      "Active.vn luxury e-commerce with Next.js & Recharts analytics CMS",
    ],
  },
  {
    id: "mangoads",
    company: "MangoAds",
    period: "Jan 2023 – Sep 2023",
    role: "Frontend Developer",
    color: "violet",
    achievements: [
      "Digital banking portals for Tier-1 institutions (Cake, Eximbank)",
      "Achieved 95+ Lighthouse scores",
    ],
  },
  {
    id: "keppelland",
    company: "Keppel Land",
    period: "Sep 2022 – Dec 2022",
    role: "Software Developer Intern",
    color: "cyan",
    achievements: [
      "Reward+ Loyalty CMS dashboards for Saigon Centre Mall tenants",
    ],
  },
] as const;
```

### Animation Behavior

- Each card triggers `useInView` with `once: true, margin: "-50px"`
- Card fades from `opacity: 0, y: 40` to `opacity: 1, y: 0`
- Duration: 0.6s, ease: "easeOut"
- Stagger: 0.1s between cards in same row
- Node on timeline pulses with accent color glow on hover

### File Structure

```
app/components/
├── experience/
│   ├── ExperienceSection.tsx  # Container
│   ├── ExperienceTimeline.tsx   # Timeline with nodes
│   └── ExperienceCard.tsx       # Individual card
└── terminal/
    ├── Terminal.tsx            # Terminal container
    ├── TerminalInput.tsx        # Input handling
    └── TerminalOutput.tsx       # Output display
```

---

## Component 2: Interactive Terminal

### Terminal UI

```
┌─────────────────────────────────────────────────────────────┐
│ ● ○ ○  bao@portfolio:~                          [_] [□] [×] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Welcome to bao's interactive terminal                      │
│  Type 'help' for available commands                         │
│                                                             │
│  $ █                                                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [X] Close Terminal                                        │
└─────────────────────────────────────────────────────────────┘
```

### Commands

| Command | Output |
|---------|--------|
| `help` | List available commands |
| `about` | Short bio |
| `skills` | Tech stack summary |
| `contact` | Email, phone, location |
| `download-cv` | "CV download coming soon!" |
| `clear` | Clear terminal |
| `exit` / `quit` | Close terminal |

### Trigger Methods

1. **Button click** — "Open Terminal" button in contact section
2. **Keyboard shortcut** — Press `` ` `` (backtick) anywhere on page
3. **Escape to close** — Press `Escape` when terminal is open

### State Management

```typescript
// Global state for terminal visibility
const [isTerminalOpen, setIsTerminalOpen] = useState(false);

// Global keyboard listener for ` key
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "`" && !isInputFocused()) {
      e.preventDefault();
      setIsTerminalOpen(prev => !prev);
    }
    if (e.key === "Escape" && isTerminalOpen) {
      setIsTerminalOpen(false);
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [isTerminalOpen]);
```

### Animation

- Open: scale from 0.9 to 1, opacity 0 to 1, spring physics
- Close: reverse animation
- Input prompt blinks with cursor animation

### File Structure

```
app/components/
├── experience/
│   ├── ExperienceSection.tsx
│   ├── ExperienceTimeline.tsx
│   └── ExperienceCard.tsx
└── terminal/
    ├── Terminal.tsx         # Modal container
    ├── TerminalWindow.tsx    # Window chrome (title bar, buttons)
    ├── TerminalOutput.tsx    # History of commands/output
    ├── TerminalInput.tsx     # Input field with prompt
    └── terminal-commands.ts  # Command handlers
```

---

## Implementation Order

1. **Experience Data** — Add to `constants.ts`
2. **ExperienceCard** — Individual card component
3. **ExperienceTimeline** — Timeline layout with nodes
4. **ExperienceSection** — Container with scroll animations
5. **Terminal Commands** — Command handlers
6. **Terminal Window** — UI with macOS-style chrome
7. **Terminal State** — Global state + keyboard shortcuts
8. **Integration** — Add to page, add "Open Terminal" button

---

## Dependencies

No new dependencies required — using existing:
- Framer Motion (animations)
- Lucide React (terminal icons)
- clsx + tailwind-merge (classes)

---

## Verification Checklist

- [ ] Timeline cards animate on scroll (viewport trigger)
- [ ] Terminal opens via button click
- [ ] Terminal opens via `` ` `` keyboard shortcut
- [ ] Terminal closes via `Escape` or close button
- [ ] All terminal commands work correctly
- [ ] Mobile: timeline stacks vertically
- [ ] Mobile: terminal accessible via button only (no keyboard)
- [ ] Build passes

---

## Open Questions for Phase 3

- Contact form design?
- Tech Arsenal cards section?
- About section content?
- Footer with social links?
