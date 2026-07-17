import { MetadataRoute } from "next";
import { ROUTES_DATA } from "@/lib/data/routes";
import { FLEET_VEHICLES } from "@/lib/fleet-data";
import { BLOG_POSTS_DATA } from "@/lib/data/blog-posts";
import { DRIVER_JOB_CITIES, JOB_VARIANTS } from "@/lib/data/driver-jobs";
import { GUIDES } from "@/lib/data/guides";
import { RECOVERY_CITIES } from "@/lib/data/recovery";

const DOMAIN = "https://taxisaudiarabia.com";

// NOTE (SEO):
// - /book, /track-booking, /partners/driver-registration are noindex → sitemap mein nahi.
// - Routes ab ROUTES_DATA (static) se — DB down ho to bhi 56 routes sitemap mein rahen.
// - /ar hreflang alternates hataye — Arabic pages abhi exist nahi kartin (sab 404 thin).
//   Jab /ar launch ho, alternates wapas add karna.

const STATIC_PAGES = [
  { path: "", priority: 1.0 },
  { path: "/about", priority: 0.6 },
  { path: "/contact", priority: 0.6 },
  { path: "/faq", priority: 0.7 },
  { path: "/gallery", priority: 0.5 },
  { path: "/fleet", priority: 0.9 },
  { path: "/routes", priority: 0.9 },
  { path: "/services", priority: 0.9 },
  { path: "/services/airport-transfers", priority: 0.9 },
  { path: "/services/border-crossings", priority: 0.8 },
  { path: "/services/corporate", priority: 0.8 },
  { path: "/services/intercity", priority: 0.9 },
  { path: "/services/tourism", priority: 0.8 },
  { path: "/services/umrah-transport", priority: 0.9 },
  { path: "/services/group-transport", priority: 0.8 },
  { path: "/services/hajj-transport", priority: 0.9 },
  { path: "/services/vip-luxury", priority: 0.8 },
  { path: "/services/madinah-ziyarat", priority: 0.9 },
  { path: "/services/makkah-ziyarat", priority: 0.9 },
  { path: "/services/business-executive", priority: 0.8 },
  { path: "/services/heritage-tours", priority: 0.8 },
  { path: "/services/car-recovery", priority: 0.9 },
  { path: "/pricing", priority: 0.7 },
  { path: "/guides", priority: 0.8 },
  { path: "/blog", priority: 0.8 },
  { path: "/driver-jobs", priority: 0.7 },
  { path: "/chauffeur-jobs", priority: 0.7 },
  { path: "/taxi-driver-jobs", priority: 0.7 },
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

const SUB_AREAS = [
  { city: "riyadh", subarea: "kafd" },
  { city: "riyadh", subarea: "olaya" },
  { city: "riyadh", subarea: "diplomatic-quarter" },
  { city: "riyadh", subarea: "al-malaz" },
  { city: "riyadh", subarea: "al-murabba" },
  { city: "riyadh", subarea: "diriyah" },
  { city: "jeddah", subarea: "al-balad" },
  { city: "jeddah", subarea: "corniche" },
  { city: "jeddah", subarea: "al-hamra" },
  { city: "jeddah", subarea: "obhur" },
  { city: "jeddah", subarea: "al-safaa" },
  { city: "jeddah", subarea: "al-rawdah" },
  { city: "jeddah", subarea: "al-shati" },
  { city: "jeddah", subarea: "al-salamah" },
  { city: "jeddah", subarea: "al-aziziyah-jeddah" },
  { city: "jeddah", subarea: "al-faisaliyah" },
  { city: "jeddah", subarea: "al-andalus" },
  { city: "jeddah", subarea: "city-tour" },
  { city: "makkah", subarea: "aziziyah" },
  { city: "makkah", subarea: "ajyad" },
  { city: "makkah", subarea: "al-awali-makkah" },
  { city: "makkah", subarea: "al-shubaikah" },
  { city: "makkah", subarea: "al-mansour" },
  { city: "makkah", subarea: "mina" },
  { city: "madinah", subarea: "al-markazia" },
  { city: "madinah", subarea: "qaba" },
  { city: "madinah", subarea: "uhud" },
  { city: "madinah", subarea: "al-awali-madinah" },
  { city: "madinah", subarea: "al-aqiq-madinah" },
  { city: "madinah", subarea: "sultanah" },
  { city: "dammam", subarea: "al-khobar" },
  { city: "dammam", subarea: "dhahran" },
  { city: "dammam", subarea: "half-moon-bay" },
  { city: "dammam", subarea: "qatif" },
];

const AIRPORTS = [
  "king-abdulaziz-jeddah",
  "prince-mohammad-madinah",
  "king-khalid-riyadh",
  "king-fahd-dammam",
  "taif-regional",
  "tabuk-regional",
  "alula",
  "abha-regional",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticItems = STATIC_PAGES.map((page) => ({
    url: `${DOMAIN}${page.path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: page.priority,
  }));

  const locationItems = LOCATIONS.map((loc) => ({
    url: `${DOMAIN}/locations/${loc}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const airportItems = AIRPORTS.map((airport) => ({
    url: `${DOMAIN}/airports/${airport}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const subAreaItems = SUB_AREAS.map((loc) => ({
    url: `${DOMAIN}/locations/${loc.city}/${loc.subarea}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const routeItems = ROUTES_DATA.map((route) => ({
    url: `${DOMAIN}/routes/${route.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const fleetItems = FLEET_VEHICLES.map((vehicle) => ({
    url: `${DOMAIN}/fleet/${vehicle.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogItems = BLOG_POSTS_DATA.filter((post) => post.published).map((post) => ({
    url: `${DOMAIN}/blog/${post.slug}`,
    lastModified: post.publishedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const driverJobItems = Object.values(JOB_VARIANTS).flatMap((v) =>
    DRIVER_JOB_CITIES.map((c) => ({
      url: `${DOMAIN}${v.urlBase}/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  );

  const recoveryItems = RECOVERY_CITIES.map((c) => ({
    url: `${DOMAIN}/services/car-recovery/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const guideItems = GUIDES.map((guide) => ({
    url: `${DOMAIN}/guides/${guide.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticItems,
    ...locationItems,
    ...subAreaItems,
    ...airportItems,
    ...routeItems,
    ...fleetItems,
    ...blogItems,
    ...driverJobItems,
    ...guideItems,
    ...recoveryItems,
  ];
}
