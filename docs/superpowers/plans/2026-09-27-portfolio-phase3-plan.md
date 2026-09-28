# Portfolio Phase 3: Tech Arsenal, About, Contact Form, Footer

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the portfolio with Tech Arsenal, About section, Contact Form, and Footer.

**Architecture:** Client-side React components with Framer Motion animations.

**Tech Stack:** Next.js, Tailwind CSS, Framer Motion, Lucide React, clsx, tailwind-merge

**Spec:** `docs/superpowers/specs/2026-09-27-portfolio-phase3-fulldesign.md`

---

## Global Constraints

- Mobile: single column layout, all sections stack
- Colors from Phase 1: accent-cyan (#06b6d4), accent-violet (#8b5cf6), accent-emerald (#10b981)
- Build must pass with no errors

---

## Tasks

### Task 1: Add Tech Stack Data to Constants

**Files:**

- Modify: `app/lib/constants.ts`

- [ ] **Step 1: Add TECH_STACK constant**

```typescript
export const TECH_STACK = [
  {
    name: "React",
    category: "Frontend",
    rating: 5,
    years: "4+",
    icon: "Code",
    color: "cyan",
  },
  {
    name: "Next.js",
    category: "Frontend",
    rating: 4,
    years: "3+",
    icon: "Globe",
    color: "cyan",
  },
  {
    name: "Node.js",
    category: "Backend",
    rating: 5,
    years: "4+",
    icon: "Server",
    color: "emerald",
  },
  {
    name: "TypeScript",
    category: "Language",
    rating: 5,
    years: "3+",
    icon: "FileCode",
    color: "violet",
  },
  {
    name: "PostgreSQL",
    category: "Database",
    rating: 4,
    years: "2+",
    icon: "Database",
    color: "emerald",
  },
  {
    name: "AWS",
    category: "Cloud",
    rating: 3,
    years: "2+",
    icon: "Cloud",
    color: "violet",
  },
  {
    name: "Docker",
    category: "DevOps",
    rating: 4,
    years: "2+",
    icon: "Box",
    color: "cyan",
  },
  {
    name: "GitLab CI",
    category: "DevOps",
    rating: 5,
    years: "4+",
    icon: "GitBranch",
    color: "emerald",
  },
] as const;
```

```bash
git add app/lib/constants.ts
git commit -m "feat: add TECH_STACK constant data"
```

---

### Task 2: Create TechCard Component

**Files:**

- Create: `app/components/tech/TechCard.tsx`

**Features:**

- 3D tilt effect on hover (mouse tracking)
- Glow effect based on color
- Star rating display

```bash
git add app/components/tech/TechCard.tsx
git commit -m "feat: add TechCard with 3D tilt"
```

---

### Task 3: Create TechArsenalGrid Component

**Files:**

- Create: `app/components/tech/TechArsenalGrid.tsx`

**Features:**

- Responsive grid (4 cols desktop, 2 cols tablet, 1 col mobile)
- Staggered scroll animation

```bash
git add app/components/tech/TechArsenalGrid.tsx
git commit -m "feat: add TechArsenalGrid layout"
```

---

### Task 4: Create TechArsenalSection Component

**Files:**

- Create: `app/components/tech/TechArsenalSection.tsx`

**Features:**

- Section header
- Imports TechArsenalGrid

```bash
git add app/components/tech/TechArsenalSection.tsx
git commit -m "feat: add TechArsenalSection container"
```

---

### Task 5: Create AboutSection Component

**Files:**

- Create: `app/components/about/AboutSection.tsx`

**Features:**

- Two-column layout (photo + bio)
- Value badges
- Scroll animation

```bash
git add app/components/about/AboutSection.tsx
git commit -m "feat: add AboutSection"
```

---

### Task 6: Create ContactForm Component

**Files:**

- Create: `app/components/contact/ContactForm.tsx`

**Features:**

- Form fields: name, email, subject, message
- Validation with error messages
- Success state
- "Sending" state

```bash
git add app/components/contact/ContactForm.tsx
git commit -m "feat: add ContactForm with validation"
```

---

### Task 7: Create ContactSection Component

**Files:**

- Create: `app/components/contact/ContactSection.tsx`

**Features:**

- Section header
- Imports ContactForm
- Alternative contact info

```bash
git add app/components/contact/ContactSection.tsx
git commit -m "feat: add ContactSection container"
```

---

### Task 8: Create Footer Component

**Files:**

- Create: `app/components/footer/Footer.tsx`

**Features:**

- Navigation links
- Social icons (GitHub, LinkedIn, Email)
- Copyright

```bash
git add app/components/footer/Footer.tsx
git commit -m "feat: add Footer component"
```

---

### Task 9: Update Page with All Sections

**Files:**

- Modify: `app/page.tsx`

**Add:**

- TechArsenalSection
- AboutSection
- ContactSection
- Footer

```bash
git add app/page.tsx
git commit -m "feat: add Tech Arsenal, About, Contact, Footer sections"
```

---

### Task 10: Verify Build

```bash
pnpm build
git add -A
git commit -m "chore: verify Phase 3 functionality"
```

---

## Summary

**Tasks:** 10 total
**Dependencies:** Sequential — each task builds on the previous

**Next steps after Phase 3:**

- Phase 4: SEO, sitemap, analytics, PWA
- Polish: Accessibility audit, performance optimization
