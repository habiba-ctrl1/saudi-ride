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

    // Business decision (2026-08-02): we don't recruit drivers — the network
    // is already staffed — so the driver-jobs/chauffeur-jobs/taxi-driver-jobs
    // SEO pages are retired. Redirect each city to the closest real, relevant
    // page (its location page, its car-recovery page, or the homepage) so the
    // existing crawl trust lands somewhere useful instead of 404ing.
    const jobCityTarget: Record<string, string> = {
      riyadh: "/locations/riyadh",
      jeddah: "/locations/jeddah",
      makkah: "/locations/makkah",
      madinah: "/locations/madinah",
      dammam: "/locations/dammam",
      khobar: "/locations/alkhobar",
      taif: "/locations/taif",
      abha: "/locations/abha",
      yanbu: "/locations/yanbu",
      tabuk: "/services/car-recovery/tabuk",
      jubail: "/services/car-recovery/jubail",
      dhahran: "/locations/alkhobar",
      "khamis-mushait": "/locations/abha",
      buraidah: "/",
      "al-ahsa": "/",
      hail: "/",
      najran: "/",
      "al-qassim": "/",
    };
    const jobUrlBases = ["/driver-jobs", "/chauffeur-jobs", "/taxi-driver-jobs"];
    const jobCityRedirects = jobUrlBases.flatMap((base) =>
      Object.entries(jobCityTarget).map(([slug, destination]) => ({
        source: `${base}/${slug}`,
        destination,
        permanent: true,
      })),
    );
    const jobHubRedirects = jobUrlBases.map((base) => ({
      source: base,
      destination: "/services",
      permanent: true,
    }));

    return [...guideRedirects, ...dedupeRedirects, ...jobCityRedirects, ...jobHubRedirects];
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
