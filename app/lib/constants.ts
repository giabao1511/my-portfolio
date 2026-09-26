import { Code2, Zap, Package, Shield } from "lucide-react";

export const STATS = [
  {
    id: "experience",
    value: "4+",
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
