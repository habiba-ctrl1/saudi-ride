import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { FLEET_VEHICLES } from "@/lib/fleet-data";

const DOMAIN = "https://riyadhtaxi.com";

// Base static pages with their priorities
const STATIC_PAGES = [
  { path: "", priority: 1.0 },
  { path: "/about", priority: 0.9 },
  { path: "/contact", priority: 0.9 },
  { path: "/faq", priority: 0.9 },
  { path: "/gallery", priority: 0.9 },
  { path: "/fleet", priority: 0.9 },
  { path: "/routes", priority: 0.9 },
  { path: "/services", priority: 0.9 },
  { path: "/services/airport-transfers", priority: 0.9 },
  { path: "/services/border-crossings", priority: 0.9 },
  { path: "/services/corporate", priority: 0.9 },
  { path: "/services/intercity", priority: 0.9 },
  { path: "/services/tourism", priority: 0.9 },
  { path: "/services/umrah-transport", priority: 0.9 },
];

const LOCATIONS = [
  "makkah",
  "madinah",
  "riyadh",
  "jeddah",
  "dammam",
  "alkhobar",
  "yanbu",
  "alula",
  "neom",
  "taif",
  "abha",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1. Generate Static Pages
  const staticItems = STATIC_PAGES.map((page) => ({
    url: `${DOMAIN}${page.path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: page.priority,
    alternates: {
      languages: {
        en: `${DOMAIN}${page.path}`,
        ar: `${DOMAIN}/ar${page.path}`,
        ur: `${DOMAIN}/ur${page.path}`,
      },
    },
  }));

  // 2. Generate Locations Pages
  const locationItems = LOCATIONS.map((loc) => ({
    url: `${DOMAIN}/locations/${loc}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    alternates: {
      languages: {
        en: `${DOMAIN}/locations/${loc}`,
        ar: `${DOMAIN}/ar/locations/${loc}`,
        ur: `${DOMAIN}/ur/locations/${loc}`,
      },
    },
  }));

  // 3. Generate Dynamic Routes Pages
  let routeItems: MetadataRoute.Sitemap = [];
  try {
    const routes = await db.route.findMany({ select: { slug: true } });
    routeItems = routes.map((route) => ({
      url: `${DOMAIN}/routes/${route.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${DOMAIN}/routes/${route.slug}`,
          ar: `${DOMAIN}/ar/routes/${route.slug}`,
          ur: `${DOMAIN}/ur/routes/${route.slug}`,
        },
      },
    }));
  } catch (error) {
    console.error("Error fetching routes for sitemap:", error);
  }

  // 4. Generate Fleet Vehicles Pages
  const fleetItems = FLEET_VEHICLES.map((vehicle) => ({
    url: `${DOMAIN}/fleet/${vehicle.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    alternates: {
      languages: {
        en: `${DOMAIN}/fleet/${vehicle.slug}`,
        ar: `${DOMAIN}/ar/fleet/${vehicle.slug}`,
        ur: `${DOMAIN}/ur/fleet/${vehicle.slug}`,
      },
    },
  }));

  return [...staticItems, ...locationItems, ...routeItems, ...fleetItems];
}
