import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { cpus: 1 },
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
