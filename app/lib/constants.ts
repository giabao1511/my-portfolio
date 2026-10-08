import { Code2, Zap, Package, Shield } from "lucide-react";

export const STATS = [
  {
    id: "experience",
    value: "5+",
    unit: "Years",
    label: "Hands-on Experience",
    icon: Code2,
    color: "cyan" as const,
  },
  {
    id: "latency",
    value: "Sub-50ms",
    unit: "",
    label: "Latency Calculation Engines",
    icon: Zap,
    color: "emerald" as const,
  },
  {
    id: "skus",
    value: "10K+",
    unit: "",
    label: "SKUs Optimized (2.5s LCP)",
    icon: Package,
    color: "violet" as const,
  },
  {
    id: "uptime",
    value: "Zero",
    unit: "",
    label: "Deployment Rollbacks",
    icon: Shield,
    color: "cyan" as const,
  },
] as const;

export const COLORS = {
  background: "#09090b",
  surface: "#18181b",
  border: "#27272a",
  textPrimary: "#fafafa",
  textMuted: "#a1a1aa",
  accentCyan: "#06b6d4",
  accentViolet: "#8b5cf6",
  accentEmerald: "#10b981",
} as const;

export const PROFILE = {
  name: "Chau Gia Bao",
  role: "Software Engineer",
  tagline:
    "Architecting high-performance web platforms across B2B SaaS, E-Commerce, and FinTech domains with the end-to-end TypeScript ecosystem.",
  ctas: {
    primary: "Explore Work",
    secondary: "Get In Touch",
  },
} as const;

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
    period: "Jan 2022 – Sep 2023",
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
    period: "Sep 2021 – Dec 2021",
    role: "Software Developer Intern",
    color: "cyan" as const,
    achievements: [
      "Reward+ Loyalty CMS dashboards for Saigon Centre Mall tenants",
    ],
  },
] as const;

export const TECH_STACK = [
  {
    name: "React",
    category: "Frontend",
    rating: 5,
    years: "5+",
    icon: "Code",
    color: "cyan" as const,
  },
  {
    name: "Next.js",
    category: "Frontend",
    rating: 4,
    years: "5+",
    icon: "Globe",
    color: "cyan" as const,
  },
  {
    name: "Node.js",
    category: "Backend",
    rating: 5,
    years: "4+",
    icon: "Server",
    color: "emerald" as const,
  },
  {
    name: "TypeScript",
    category: "Language",
    rating: 5,
    years: "5+",
    icon: "FileCode",
    color: "violet" as const,
  },
  {
    name: "PostgreSQL",
    category: "Database",
    rating: 4,
    years: "2+",
    icon: "Database",
    color: "emerald" as const,
  },
  {
    name: "AWS",
    category: "Cloud",
    rating: 3,
    years: "2+",
    icon: "Cloud",
    color: "violet" as const,
  },
  {
    name: "Docker",
    category: "DevOps",
    rating: 4,
    years: "2+",
    icon: "Box",
    color: "cyan" as const,
  },
  {
    name: "GitLab CI",
    category: "DevOps",
    rating: 5,
    years: "5+",
    icon: "GitBranch",
    color: "emerald" as const,
  },
] as const;
