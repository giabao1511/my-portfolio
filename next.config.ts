import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack alias note: @/ path alias from tsconfig.json is used automatically
  // but resolveAlias override is not yet working in Next.js 16.3.6
};

export default nextConfig;
