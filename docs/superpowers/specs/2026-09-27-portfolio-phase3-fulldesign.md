# Portfolio Phase 3: Tech Arsenal, About, Contact Form, Footer

## Overview

**Goal:** Complete the portfolio with skills showcase, personal section, working contact form, and footer.

**Success criteria:**
- Tech Arsenal cards animate on scroll with 3D tilt effect
- About section shows personal background
- Contact form validates and shows success state
- Footer with social links
- Mobile responsive
- Build passes

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
- Mono: JetBrains Mono (code elements)

---

## Component 1: Tech Arsenal

### Layout Structure

```
Desktop (≥1024px):
┌─────────────────────────────────────────────────────────────┐
│  TECH ARSENAL                                               │
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │ React   │  │ Next.js │  │ Node.js │  │ TypeScript│   │
│  │ ★★★★★  │  │ ★★★★☆  │  │ ★★★★★  │  │ ★★★★★  │     │
│  │ 4+ yrs │  │ 3+ yrs  │  │ 4+ yrs  │  │ 3+ yrs   │   │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │ PostgreSQL│ │ AWS    │  │ Docker │  │ GitLab  │     │
│  │ ★★★★☆  │  │ ★★★☆☆  │  │ ★★★★☆  │  │ ★★★★★  │     │
│  │ 2+ yrs │  │ 2+ yrs  │  │ 2+ yrs │  │ 4+ yrs  │     │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Data Structure

```typescript
const TECH_STACK = [
  {
    name: "React",
    category: "Frontend",
    rating: 5,
    years: "4+",
    icon: "code", // lucide icon name
    color: "cyan",
  },
  {
    name: "Next.js",
    category: "Frontend",
    rating: 4,
    years: "3+",
    icon: "globe",
    color: "cyan",
  },
  {
    name: "Node.js",
    category: "Backend",
    rating: 5,
    years: "4+",
    icon: "server",
    color: "emerald",
  },
  {
    name: "TypeScript",
    category: "Language",
    rating: 5,
    years: "3+",
    icon: "file-code",
    color: "violet",
  },
  {
    name: "PostgreSQL",
    category: "Database",
    rating: 4,
    years: "2+",
    icon: "database",
    color: "emerald",
  },
  {
    name: "AWS",
    category: "Cloud",
    rating: 3,
    years: "2+",
    icon: "cloud",
    color: "violet",
  },
  {
    name: "Docker",
    category: "DevOps",
    rating: 4,
    years: "2+",
    icon: "box",
    color: "cyan",
  },
  {
    name: "GitLab CI",
    category: "DevOps",
    rating: 5,
    years: "4+",
    icon: "git-branch",
    color: "emerald",
  },
] as const;
```

### Animation Behavior

- Cards use Framer Motion `useMotionValue` for mouse tracking
- On hover: `rotateX`, `rotateY` based on mouse position (-10° to 10°)
- `perspective: 1000` on container
- Glow intensifies on hover
- Cards stagger in on scroll: 0.05s delay each

### File Structure

```
app/components/
├── tech/
│   ├── TechArsenalSection.tsx  # Container
│   ├── TechCard.tsx            # Individual card with tilt
│   └── TechArsenalGrid.tsx    # Grid layout
```

---

## Component 2: About Section

### Layout Structure

```
Desktop (≥1024px):
┌─────────────────────────────────────────────────────────────┐
│  ABOUT                                                     │
│                                                             │
│  ┌──────────────────────┐  ┌────────────────────────────┐   │
│  │                      │  │                          │   │
│  │    [Profile Photo]   │  │  The Builder's Mindset   │   │
│  │                      │  │                          │   │
│  │                      │  │  I believe in clean      │   │
│  │                      │  │  architecture, type-     │   │
│  │                      │  │  safe code, and          │   │
│  │                      │  │  performance-first       │   │
│  │                      │  │  engineering.            │   │
│  │                      │  │                          │   │
│  │                      │  │  Beyond code, I'm        │   │
│  │                      │  │  exploring startup        │   │
│  │                      │  │  culture in Vietnam.     │   │
│  │                      │  │                          │   │
│  └──────────────────────┘  └────────────────────────────┘   │
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                    │
│  │ Hanoi   │  │ 🇻🇳      │  │ ⚡     │                    │
│  │ Based   │  │ Vietnam  │  │ Fast   │                    │
│  └─────────┘  └─────────┘  └─────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

### Content

```typescript
const ABOUT = {
  name: "Chau Gia Bao",
  title: "Software Engineer",
  values: [
    "Clean Architecture",
    "Type-Safe Code",
    "Performance First",
  ],
  bio: "I believe in clean architecture, type-safe code, and performance-first engineering. Beyond code, I'm exploring the startup culture in Vietnam and building things that matter.",
  interests: [
    "Open Source",
    "Distributed Systems",
    "Developer Experience",
    "Startup Culture",
  ],
  location: "Ho Chi Minh City, Vietnam",
  availability: "Open to opportunities",
} as const;
```

### Animation

- Photo fades in from left
- Bio text fades in from right
- Value badges stagger in from bottom

### File Structure

```
app/components/
├── about/
│   └── AboutSection.tsx
```

---

## Component 3: Contact Form

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  CONTACT                                                   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Name *                                    [       ] │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Email *                                  [       ] │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Subject                                  [       ] │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Message *                                          │  │
│  │                                                     │  │
│  │                                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│                      [Send Message]                         │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  Or reach me directly: giabao712411@gmail.com             │
└─────────────────────────────────────────────────────────────┘
```

### Form Fields

| Field | Type | Validation | Required |
|-------|------|-----------|----------|
| Name | text | min 2 chars | Yes |
| Email | email | valid email format | Yes |
| Subject | text | min 3 chars | No |
| Message | textarea | min 10 chars | Yes |

### States

1. **Default** — Empty form, "Send Message" button
2. **Typing** — Field focused, label floats up
3. **Error** — Red border, error message below field
4. **Submitting** — Button disabled, spinner
5. **Success** — Form replaced with success message + checkmark

### Animation

- Form slides up on scroll
- Success message fades in with checkmark
- Button has press effect

### File Structure

```
app/components/
├── contact/
│   ├── ContactSection.tsx   # Container
│   ├── ContactForm.tsx      # Form with validation
│   └── ContactSuccess.tsx  # Success state
```

---

## Component 4: Footer

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                 │
│  │ Chau Gia Bao    │  │ Navigation      │                 │
│  │ Software Eng.   │  │ Experience      │                 │
│  │ giabao@...      │  │ Tech Arsenal    │                 │
│  │                  │  │ About          │                 │
│  │                  │  │ Contact        │                 │
│  └─────────────────┘  └─────────────────┘                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┤
│  │  GitHub  LinkedIn  Twitter  Email                       │
│  └─────────────────────────────────────────────────────────┤
│                                                             │
│  © 2024 Chau Gia Bao. Built with Next.js + Tailwind CSS   │
└─────────────────────────────────────────────────────────────┘
```

### Social Links

```typescript
const SOCIAL_LINKS = [
  {
    name: "GitHub",
    url: "https://github.com/giabao4123",
    icon: "github",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/giabao4123",
    icon: "linkedin",
  },
  {
    name: "Email",
    url: "mailto:giabao712411@gmail.com",
    icon: "mail",
  },
] as const;
```

### File Structure

```
app/components/
├── footer/
│   └── Footer.tsx
```

---

## Implementation Order

1. **Tech Stack Data** — Add to constants
2. **TechCard** — Card with 3D tilt
3. **TechArsenalGrid** — Responsive grid
4. **TechArsenalSection** — Container
5. **AboutSection** — Personal section
6. **ContactForm** — Form with validation
7. **ContactSection** — Container
8. **Footer** — Social links
9. **Update Page** — Add all sections
10. **Verify Build**

---

## Dependencies

No new dependencies required — using existing:
- Framer Motion (animations, tilt)
- Lucide React (icons)
- clsx + tailwind-merge (classes)
- React Hook Form or native validation

---

## Verification Checklist

- [ ] Tech cards have 3D tilt on hover
- [ ] Tech cards stagger in on scroll
- [ ] About section animates on scroll
- [ ] Contact form validates all fields
- [ ] Contact form shows success on submit
- [ ] Footer social links work
- [ ] Mobile: all sections stack properly
- [ ] Build passes

---

## Open Questions for Phase 4 (Polish)

- SEO meta tags?
- Sitemap.xml?
- Analytics?
- PWA support?
- Dark/light mode toggle?
