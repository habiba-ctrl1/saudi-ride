import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/customer/",
          "/api/",
          "/_next/",
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
