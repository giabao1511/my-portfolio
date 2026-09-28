# Portfolio Phase 2: Experience Timeline + Interactive Terminal

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build Experience Timeline with scroll-triggered animations and Interactive Terminal with keyboard shortcuts.

**Architecture:** Client-side React components. Timeline uses Framer Motion `useInView`. Terminal is a modal overlay with global keyboard listeners.

**Tech Stack:** Next.js, Tailwind CSS, Framer Motion, Lucide React, clsx, tailwind-merge

**Spec:** `docs/superpowers/specs/2026-09-27-portfolio-phase2-timeline-terminal-design.md`

---

## Global Constraints

- Mobile: timeline stacks vertically, terminal accessible via button only
- Keyboard shortcut `` ` `` only active when no input is focused
- Terminal close via `Escape` key or close button
- Colors from Phase 1: accent-cyan (#06b6d4), accent-violet (#8b5cf6), accent-emerald (#10b981)
- Build must pass with no errors

---

## Review Focus

1. **Accessibility** — Keyboard shortcuts don't interfere with form inputs
2. **Mobile** — Terminal button visible on mobile, no `` ` `` shortcut
3. **Animation performance** — `useInView` with `once: true` prevents re-animation
4. **Terminal state** — Cleanup event listeners on unmount
5. **TypeScript** — No implicit `any`, proper types for commands

---

## Tasks

### Task 1: Add Experience Data to Constants

**Files:**

- Modify: `app/lib/constants.ts`

**Interfaces:**

- Consumes: None
- Produces: `EXPERIENCE` array export

- [ ] **Step 1: Add EXPERIENCE constant**

Add to `app/lib/constants.ts`:

```typescript
export const EXPERIENCE = [
  {
    id: "keyloop",
    company: "Keyloop",
    period: "Jan 2025 – Present",
    role: "Software Engineer",
    color: "cyan" as const,
    achievements: [
      "Saleshub multi-tenant automotive SaaS platform (serving BMW, VW, Honda)",
      "Real-time Financial/Insurance calculation engine with sub-50ms client-side latency",
      "Automated E2E & API regression suites using Playwright integrated into GitLab CI/CD",
    ],
  },
  {
    id: "vongxanh",
    company: "Vongxanh / Blue Circle",
    period: "Sep 2023 – Jan 2025",
    role: "Fullstack Engineer",
    color: "emerald" as const,
    achievements: [
      "Modular Nest.js RESTful APIs & high-concurrency marathon registration engines",
      "Active.vn luxury e-commerce & real-time analytics CMS using Next.js & Recharts",
    ],
  },
  {
    id: "mangoads",
    company: "MangoAds",
    period: "Jan 2023 – Sep 2023",
    role: "Frontend Developer",
    color: "violet" as const,
    achievements: [
      "Digital banking portals for Tier-1 institutions (Cake by VPBank, Eximbank)",
      "Achieved 95+ Lighthouse performance scores",
    ],
  },
  {
    id: "keppelland",
    company: "Keppel Land",
    period: "Sep 2022 – Dec 2022",
    role: "Software Developer Intern",
    color: "cyan" as const,
    achievements: [
      "Reward+ Loyalty CMS dashboards for Saigon Centre Mall tenants",
    ],
  },
] as const;
```

- [ ] **Step 2: Commit**

```bash
git add app/lib/constants.ts
git commit -m "feat: add EXPERIENCE constant data"
```

---

### Task 2: Create ExperienceCard Component

**Files:**

- Create: `app/components/experience/ExperienceCard.tsx`

**Interfaces:**

- Consumes: Single experience object, color variant
- Produces: Animated card element

- [ ] **Step 1: Create ExperienceCard.tsx**

```typescript
"use client";

import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface ExperienceCardProps {
  company: string;
  period: string;
  role: string;
  color: "cyan" | "violet" | "emerald";
  achievements: readonly string[];
  index: number;
}

const colorClasses = {
  cyan: {
    border: "border-accent-cyan/30 hover:border-accent-cyan/60",
    glow: "hover:shadow-glow-cyan",
    text: "text-accent-cyan",
  },
  violet: {
    border: "border-accent-violet/30 hover:border-accent-violet/60",
    glow: "hover:shadow-glow-violet",
    text: "text-accent-violet",
  },
  emerald: {
    border: "border-accent-emerald/30 hover:border-accent-emerald/60",
    glow: "hover:shadow-glow-emerald",
    text: "text-accent-emerald",
  },
};

export function ExperienceCard({
  company,
  period,
  role,
  color,
  achievements,
  index,
}: ExperienceCardProps) {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
      className={cn(
        "relative p-6 rounded-2xl",
        "bg-zinc-900/50 backdrop-blur-sm",
        "border border-zinc-800",
        "transition-all duration-300",
        colors.border,
        colors.glow
      )}
    >
      {/* Timeline node indicator */}
      <div
        className={cn(
          "absolute -left-3 top-8 w-6 h-6 rounded-full",
          "border-2 border-zinc-800 bg-zinc-950",
          colors.text,
          "shadow-[0_0_15px_var(--glow-cyan)]"
        )}
        style={{
          boxShadow: color === "cyan" ? "0 0 15px rgba(6,182,212,0.5)" :
                      color === "violet" ? "0 0 15px rgba(139,92,246,0.5)" :
                      "0 0 15px rgba(16,185,129,0.5)"
        }}
      />

      {/* Company & Period */}
      <div className="mb-4">
        <span className={cn("text-xs font-medium tracking-wider uppercase", colors.text)}>
          {period}
        </span>
      </div>

      {/* Role */}
      <h3 className="text-xl font-bold text-zinc-50 mb-1">
        {role}
      </h3>

      {/* Company */}
      <p className="text-sm text-zinc-400 mb-4">
        {company}
      </p>

      {/* Achievements */}
      <ul className="space-y-2">
        {achievements.map((achievement, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
            <span className={cn("mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0", colors.text)} />
            {achievement}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/experience/ExperienceCard.tsx
git commit -m "feat: add ExperienceCard component"
```

---

### Task 3: Create ExperienceTimeline Component

**Files:**

- Create: `app/components/experience/ExperienceTimeline.tsx`

**Interfaces:**

- Consumes: `EXPERIENCE` from constants
- Produces: Timeline layout with nodes

- [ ] **Step 1: Create ExperienceTimeline.tsx**

```typescript
"use client";

import { ExperienceCard } from "./ExperienceCard";
import { EXPERIENCE } from "../../lib/constants";

export function ExperienceTimeline() {
  return (
    <div className="relative">
      {/* Timeline vertical line */}
      <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-accent-cyan/50 via-accent-violet/50 to-accent-emerald/50" />

      {/* Desktop: 2-column grid */}
      <div className="hidden lg:block">
        <div className="space-y-12">
          {EXPERIENCE.map((exp, index) => (
            <div key={exp.id} className="relative pl-12">
              {/* Row connector */}
              {index % 2 === 0 && (
                <div className="absolute top-1/2 left-12 right-1/2 h-px bg-zinc-800" />
              )}
              <ExperienceCard
                company={exp.company}
                period={exp.period}
                role={exp.role}
                color={exp.color}
                achievements={exp.achievements}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical stack */}
      <div className="lg:hidden space-y-8 pl-8">
        {EXPERIENCE.map((exp, index) => (
          <ExperienceCard
            key={exp.id}
            company={exp.company}
            period={exp.period}
            role={exp.role}
            color={exp.color}
            achievements={exp.achievements}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/experience/ExperienceTimeline.tsx
git commit -m "feat: add ExperienceTimeline layout"
```

---

### Task 4: Create ExperienceSection Container

**Files:**

- Create: `app/components/experience/ExperienceSection.tsx`

**Interfaces:**

- Consumes: ExperienceTimeline
- Produces: Full section with section header

- [ ] **Step 1: Create ExperienceSection.tsx**

```typescript
"use client";

import { motion } from "framer-motion";
import { ExperienceTimeline } from "./ExperienceTimeline";

export function ExperienceSection() {
  return (
    <section id="experience" className="relative py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
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

        {/* Timeline */}
        <ExperienceTimeline />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/experience/ExperienceSection.tsx
git commit -m "feat: add ExperienceSection container"
```

---

### Task 5: Create Terminal Commands

**Files:**

- Create: `app/components/terminal/terminal-commands.ts`

**Interfaces:**

- Consumes: Command string
- Produces: Array of output lines

- [ ] **Step 1: Create terminal-commands.ts**

```typescript
export interface CommandOutput {
  type: "input" | "output" | "error" | "success";
  text: string;
}

const HELP_TEXT = `Available commands:
  help        - Show this help message
  about       - About bao
  skills      - View tech skills
  contact     - Contact information
  download-cv - Download CV (coming soon)
  clear       - Clear terminal
  exit        - Close terminal`;

const ABOUT_TEXT = `Chau Gia Bao
Software Engineer specializing in high-performance web platforms,
TypeScript ecosystem, Next.js, and distributed systems.
4+ years of hands-on experience across B2B SaaS, E-Commerce, and FinTech.`;

const SKILLS_TEXT = `Tech Arsenal:
  Languages: TypeScript, JavaScript, HTML5, CSS3
  Frontend: React, Next.js, TanStack Query, Redux Toolkit
  Backend: Node.js, Nest.js, RESTful APIs, Microservices
  Data: MongoDB, PostgreSQL, Redis
  Cloud: AWS (S3, CloudFront), Vercel
  DevOps: GitLab CI/CD, Docker, Kubernetes
  Testing: Playwright, Jest, React Testing Library`;

const CONTACT_TEXT = `Email:    giabao712411@gmail.com
Phone:    +84 339 253 073
Location: Ho Chi Minh City, Vietnam
LinkedIn: https://linkedin.com/in/giabao4123
GitHub:   https://github.com/giabao4123`;

export function executeCommand(input: string): CommandOutput[] {
  const cmd = input.trim().toLowerCase();

  switch (cmd) {
    case "help":
      return [{ type: "output", text: HELP_TEXT }];
    case "about":
      return [{ type: "output", text: ABOUT_TEXT }];
    case "skills":
    case "skill":
      return [{ type: "output", text: SKILLS_TEXT }];
    case "contact":
      return [{ type: "output", text: CONTACT_TEXT }];
    case "download-cv":
    case "cv":
      return [
        { type: "success", text: "CV download link will be available soon!" },
      ];
    case "clear":
      return [{ type: "clear", text: "" }];
    case "exit":
    case "quit":
      return [{ type: "exit", text: "" }];
    case "":
      return [];
    default:
      return [
        { type: "error", text: `Command not found: ${cmd}` },
        { type: "output", text: "Type 'help' for available commands" },
      ];
  }
}

export function getWelcomeMessage(): CommandOutput[] {
  return [
    { type: "success", text: "Welcome to bao's interactive terminal" },
    { type: "output", text: "Type 'help' for available commands" },
    { type: "output", text: "" },
  ];
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/terminal/terminal-commands.ts
git commit -m "feat: add terminal command handlers"
```

---

### Task 6: Create Terminal Component

**Files:**

- Create: `app/components/terminal/Terminal.tsx`

**Interfaces:**

- Consumes: `isOpen`, `onClose` props
- Produces: Interactive terminal modal

- [ ] **Step 1: Create Terminal.tsx**

```typescript
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Square } from "lucide-react";
import { cn } from "../../lib/utils";
import { executeCommand, getWelcomeMessage, type CommandOutput } from "./terminal-commands";

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HistoryEntry {
  input: string;
  outputs: CommandOutput[];
}

export function Terminal({ isOpen, onClose }: TerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && history.length === 0) {
      setHistory([{ input: "", outputs: getWelcomeMessage() }]);
    }
  }, [isOpen]);

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Scroll to bottom of history
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput && trimmedInput !== "clear") {
      // Just add empty line for enter
      setHistory((prev) => [...prev, { input: "", outputs: [] }]);
      setInput("");
      return;
    }

    const outputs = executeCommand(trimmedInput);

    // Check for exit command
    if (outputs.some((o) => o.type === "exit")) {
      onClose();
      setHistory([]);
      setInput("");
      return;
    }

    // Check for clear command
    if (outputs.some((o) => o.type === "clear")) {
      setHistory([]);
      setInput("");
      return;
    }

    setHistory((prev) => [...prev, { input: trimmedInput, outputs }]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Terminal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50"
            onKeyDown={handleKeyDown}
          >
            <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
              {/* Title Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-zinc-800/50 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm text-zinc-400 font-mono">
                  bao@portfolio:~
                </span>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-zinc-700 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-400" />
                </button>
              </div>

              {/* Terminal Content */}
              <div className="p-4 h-96 overflow-y-auto font-mono text-sm">
                {/* History */}
                {history.map((entry, i) => (
                  <div key={i} className="mb-4">
                    {entry.input && (
                      <div className="flex gap-2">
                        <span className="text-accent-cyan">$</span>
                        <span className="text-zinc-50">{entry.input}</span>
                      </div>
                    )}
                    {entry.outputs.map((output, j) => (
                      <div
                        key={j}
                        className={cn(
                          "whitespace-pre-wrap",
                          output.type === "error" && "text-red-400",
                          output.type === "success" && "text-accent-emerald",
                          output.type === "output" && "text-zinc-300"
                        )}
                      >
                        {output.text}
                      </div>
                    ))}
                  </div>
                ))}

                {/* Input */}
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <span className="text-accent-cyan">$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-zinc-50 caret-accent-cyan"
                    autoFocus
                    spellCheck={false}
                  />
                </form>
                <div ref={historyEndRef} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/terminal/Terminal.tsx
git commit -m "feat: add Terminal component"
```

---

### Task 7: Create TerminalOpener Component (Button)

**Files:**

- Create: `app/components/terminal/TerminalOpener.tsx`

- [ ] **Step 1: Create TerminalOpener.tsx**

```typescript
"use client";

import { Terminal as TerminalIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface TerminalOpenerProps {
  onClick: () => void;
  className?: string;
}

export function TerminalOpener({ onClick, className }: TerminalOpenerProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-6 py-3 rounded-full",
        "border border-accent-violet text-accent-violet",
        "hover:bg-accent-violet hover:text-zinc-950 hover:shadow-glow-violet",
        "transition-all duration-300 font-medium",
        className
      )}
    >
      <TerminalIcon className="w-5 h-5" />
      Open Terminal
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/terminal/TerminalOpener.tsx
git commit -m "feat: add TerminalOpener button"
```

---

### Task 8: Create TerminalProvider (Global State)

**Files:**

- Create: `app/components/terminal/TerminalProvider.tsx`

**Interfaces:**

- Consumes: Children
- Produces: Terminal context + global keyboard listener

- [ ] **Step 1: Create TerminalProvider.tsx**

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import { Terminal } from "./Terminal";

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const openTerminal = useCallback(() => setIsTerminalOpen(true), []);
  const closeTerminal = useCallback(() => setIsTerminalOpen(false), []);
  const toggleTerminal = useCallback(
    () => setIsTerminalOpen((prev) => !prev),
    []
  );

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if we're in an input field
      const target = e.target as HTMLElement;
      const isInputField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Open terminal with backtick (only if not in input)
      if (e.key === "`" && !isInputField) {
        e.preventDefault();
        toggleTerminal();
      }

      // Close terminal with Escape
      if (e.key === "Escape" && isTerminalOpen) {
        closeTerminal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTerminalOpen, toggleTerminal, closeTerminal]);

  return (
    <>
      {children}
      <Terminal isOpen={isTerminalOpen} onClose={closeTerminal} />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/terminal/TerminalProvider.tsx
git commit -m "feat: add TerminalProvider with global keyboard shortcut"
```

---

### Task 9: Integrate Components into Page

**Files:**

- Modify: `app/page.tsx`
- Create: `app/components/terminal/index.ts` (barrel export)

- [ ] **Step 1: Update page.tsx**

```typescript
import { HeroSection } from "./components/hero/HeroSection";
import { MagneticCursor } from "./components/ui/MagneticCursor";
import { ExperienceSection } from "./components/experience/ExperienceSection";
import { TerminalProvider, TerminalOpener } from "./components/terminal";
import { useState } from "react";

export default function Home() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  return (
    <TerminalProvider>
      <main>
        <MagneticCursor />
        <HeroSection />
        <ExperienceSection />

        {/* Terminal Button Section */}
        <section id="contact" className="py-24 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-zinc-50 mb-4">
              Get In Touch
            </h2>
            <p className="text-zinc-400 mb-8">
              Interested in working together? Let's connect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:giabao712411@gmail.com"
                className="px-8 py-3 rounded-full bg-accent-cyan text-zinc-950 font-medium hover:shadow-glow-cyan transition-all"
              >
                Email Me
              </a>
              <TerminalOpener
                onClick={() => setIsTerminalOpen(true)}
                className="md:hidden"
              />
            </div>
            {/* Desktop: show terminal opener separately */}
            <div className="hidden md:block mt-4">
              <TerminalOpener
                onClick={() => setIsTerminalOpen(true)}
              />
            </div>
          </div>
        </section>
      </main>
    </TerminalProvider>
  );
}
```

- [ ] **Step 2: Create barrel export**

```typescript
export { Terminal } from "./Terminal";
export { TerminalProvider } from "./TerminalProvider";
export { TerminalOpener } from "./TerminalOpener";
```

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx app/components/terminal/index.ts
git commit -m "feat: integrate Experience and Terminal into page"
```

---

### Task 10: Verify Build and Test

**Files:** (none)

- [ ] **Step 1: Run build**

Run: `pnpm build`
Expected: Successful build

- [ ] **Step 2: Test terminal keyboard shortcut**

1. Open dev server: `pnpm dev`
2. Press `` ` `` to open terminal
3. Type `help` and press Enter
4. Verify output
5. Press `Escape` to close

- [ ] **Step 3: Test scroll animations**

1. Open page
2. Scroll to Experience section
3. Verify cards animate in on scroll

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: verify Phase 2 functionality"
```

---

## Summary

**Tasks:** 10 total
**Dependencies:** Tasks 1→2→3→4 are sequential; Terminal tasks 5→6→7→8→9 are sequential; both tracks can run in parallel after Task 1

**Next steps after Phase 2:**

- Phase 3: Tech Arsenal cards, Contact form, About section, Footer
- Polish: SEO, accessibility audit, performance optimization
