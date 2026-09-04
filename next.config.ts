import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['stripe'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;