# Portfolio Phase 4: SEO, Sitemap, Analytics, PWA

> **For agentic workers:** Execute tasks sequentially.

**Goal:** Polish the portfolio with SEO, sitemap, analytics, and PWA support.

---

## Tasks

### Task 1: Update Metadata

**Files:**
- Modify: `app/layout.tsx`

```bash
git add app/layout.tsx
git commit -m "feat: update metadata with SEO tags"
```

---

### Task 2: Create Sitemap

**Files:**
- Create: `app/sitemap.ts`

```bash
git add app/sitemap.ts
git commit -m "feat: add sitemap for SEO"
```

---

### Task 3: Create Robots.txt

**Files:**
- Create: `app/robots.ts`

```bash
git add app/robots.ts
git commit -m "feat: add robots.txt"
```

---

### Task 4: Install Analytics

**Files:**
- Install: `@vercel/analytics`

```bash
pnpm add @vercel/analytics
git add package.json pnpm-lock.yaml
git commit -m "deps: add @vercel/analytics"
```

---

### Task 5: Create Analytics Provider

**Files:**
- Create: `app/components/analytics/index.tsx`
- Modify: `app/layout.tsx`

```bash
git add app/components/analytics/index.tsx app/layout.tsx
git commit -m "feat: add Vercel Analytics"
```

---

### Task 6: Create PWA Manifest

**Files:**
- Create: `public/manifest.json`

```bash
git add public/manifest.json
git commit -m "feat: add PWA manifest"
```

---

### Task 7: Create Service Worker (optional)

**Files:**
- Create: `app/service-worker.ts`

```bash
git add app/service-worker.ts
git commit -m "feat: add service worker for offline support"
```

---

### Task 8: Verify Build

```bash
pnpm build
git add -A
git commit -m "chore: verify Phase 4 functionality"
```

---

## Summary

**Tasks:** 8 total
**Dependencies:** Sequential
