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
      ],
    },
    sitemap: "https://riyadhtaxi.com/sitemap.xml",
  };
}
