import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone build for containerized deployments
  output: "standalone",

  // Disable ESLint during builds (run separately in CI)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript errors during builds (run separately in CI)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
