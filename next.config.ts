import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    // Purane /guides?id= duplicate URLs -> asli guide pages (301)
    const guideIdMap: Record<string, string> = {
      "jeddah-sim-guide": "/guides/jeddah-airport-sim-card",
      "meeqat-guide": "/guides/meeqat-locations",
      "riyal-cash-guide": "/guides/saudi-riyal-pilgrim-guide",
    };
    return Object.entries(guideIdMap).map(([id, destination]) => ({
      source: "/guides",
      has: [{ type: "query" as const, key: "id", value: id }],
      destination,
      permanent: true,
    }));
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  }
};

export default nextConfig;
