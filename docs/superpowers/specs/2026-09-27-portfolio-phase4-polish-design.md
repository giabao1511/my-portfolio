# Portfolio Phase 4: SEO, Sitemap, Analytics, PWA

## Overview

**Goal:** Polish the portfolio with proper SEO, sitemap, analytics, and PWA support.

**Success criteria:**
- Proper meta tags for SEO
- Working sitemap.xml and robots.txt
- Analytics tracking (Vercel Analytics)
- PWA manifest and service worker
- Build passes

---

## Component 1: SEO & Meta Tags

### Update layout.tsx

```typescript
export const metadata: Metadata = {
  title: {
    default: "Chau Gia Bao | Software Engineer",
    template: "%s | Chau Gia Bao",
  },
  description:
    "Software Engineer specializing in high-performance web platforms, TypeScript ecosystem, Next.js, and distributed systems. 4+ years experience in B2B SaaS, E-Commerce, and FinTech.",
  keywords: [
    "Software Engineer",
    "Full Stack Developer",
    "TypeScript",
    "Next.js",
    "React",
    "Vietnam",
    "Ho Chi Minh City",
  ],
  authors: [{ name: "Chau Gia Bao" }],
  creator: "Chau Gia Bao",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://giabao.dev",
    siteName: "Chau Gia Bao Portfolio",
    title: "Chau Gia Bao | Software Engineer",
    description:
      "Software Engineer specializing in high-performance web platforms, TypeScript ecosystem, Next.js, and distributed systems.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Chau Gia Bao Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chau Gia Bao | Software Engineer",
    description:
      "Software Engineer specializing in high-performance web platforms.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};
```

### Create OG Image

Add an Open Graph image at `public/og-image.png` (1200x630)

---

## Component 2: Sitemap & Robots

### Create app/sitemap.ts

```typescript
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://giabao.dev";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}#experience`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}#tech`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}#about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}#contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];
}
```

### Create app/robots.ts

```typescript
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://giabao.dev/sitemap.xml",
  };
}
```

---

## Component 3: Analytics

### Install Vercel Analytics

```bash
pnpm add @vercel/analytics
```

### Create components/analytics/index.tsx

```typescript
"use client";

import { Analytics } from "@vercel/analytics/react";

export function AnalyticsProvider() {
  return <Analytics />;
}
```

### Update layout.tsx

```typescript
import { AnalyticsProvider } from "./components/analytics";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <AnalyticsProvider />
      </body>
    </html>
  );
}
```

---

## Component 4: PWA Support

### Create public/manifest.json

```json
{
  "name": "Chau Gia Bao Portfolio",
  "short_name": "Gia Bao",
  "description": "Software Engineer specializing in high-performance web platforms",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#09090b",
  "theme_color": "#06b6d4",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Create app/service-worker.ts

```typescript
/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = "portfolio-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(["/"]))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request).then((response) => {
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      });
      return cached || fetchPromise;
    })
  );
});

export {};
```

### Create SVG icons

Create simple icons at:
- `public/icon-192.png` (192x192)
- `public/icon-512.png` (512x512)

---

## Implementation Tasks

1. Update metadata in layout.tsx
2. Create sitemap.ts
3. Create robots.ts
4. Install @vercel/analytics
5. Create AnalyticsProvider
6. Create manifest.json
7. Create service worker (optional - can be complex)
8. Verify build

---

## Verification Checklist

- [ ] SEO meta tags in HTML source
- [ ] /sitemap.xml returns valid sitemap
- [ ] /robots.txt returns robots rules
- [ ] Analytics script loads
- [ ] PWA manifest present
- [ ] Build passes
