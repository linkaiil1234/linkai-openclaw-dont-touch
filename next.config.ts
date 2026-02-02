import { NextConfig } from "next";

import { RemotePattern } from "next/dist/shared/lib/image-config";

const allowedImageDomains: RemotePattern[] = [
  {
    protocol: "https",
    hostname: "**",
  },
  {
    protocol: "https",
    hostname: "lh3.googleusercontent.com",
  },
  {
    protocol: "https",
    hostname: "*.googleusercontent.com",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: allowedImageDomains,
    unoptimized: true,
  },
  devIndicators: false,
  reactStrictMode: false,
};

export default nextConfig;
