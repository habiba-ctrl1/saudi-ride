import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
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
    sitemap: "https://taxisaudiarabia.com/sitemap.xml",
  };
}
