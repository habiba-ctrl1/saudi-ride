import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // PDF invoice route reads Arabic font files at runtime (path.join(process.cwd(), ...))
  // rather than importing them, so Next's file tracer needs an explicit hint to bundle
  // them into the serverless function — otherwise it 404/ENOENTs on Vercel.
  outputFileTracingIncludes: {
    "/api/quotations/[id]/invoice": ["./lib/pdf/fonts/**"],
  },
  async redirects() {
    // Purane /guides?id= duplicate URLs -> asli guide pages (301)
    const guideIdMap: Record<string, string> = {
      "jeddah-sim-guide": "/guides/jeddah-airport-sim-card",
      "meeqat-guide": "/guides/meeqat-locations",
      "riyal-cash-guide": "/guides/saudi-riyal-pilgrim-guide",
    };
    const guideRedirects = Object.entries(guideIdMap).map(([id, destination]) => ({
      source: "/guides",
      has: [{ type: "query" as const, key: "id", value: id }],
      destination,
      permanent: true,
    }));

    // Dammam sub-area "al-khobar" duplicated the standalone /locations/alkhobar
    // city page (same city, competing content) — consolidate into one URL.
    const dedupeRedirects = [
      {
        source: "/locations/dammam/al-khobar",
        destination: "/locations/alkhobar",
        permanent: true,
      },
    ];

    return [...guideRedirects, ...dedupeRedirects];
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
