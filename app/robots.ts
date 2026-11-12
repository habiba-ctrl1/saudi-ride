import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/vendor/",
          "/customer/",
          "/api/",
          // 2026-11-13: "/_next/" removed. It blocked Googlebot from the CSS, JS and
          // /_next/image files it needs to render pages and index images.
          "/static/",
          "/book?", // parameterized booking links (?pickup=...) — clean /book stays crawlable
        ],
      },
      // Explicitly welcome AI crawlers (GEO signal)
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "Bytespider", allow: "/" },
    ],
    sitemap: "https://taxisaudiarabia.com/sitemap.xml",
    host: "https://taxisaudiarabia.com",
  };
}
