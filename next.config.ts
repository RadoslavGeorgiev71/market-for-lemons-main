import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Ignore ESLint during builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
