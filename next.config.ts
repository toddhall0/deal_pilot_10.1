import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone build for containerized deployments
  output: "standalone",

  // Disable TypeScript errors during builds (run separately in CI)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
