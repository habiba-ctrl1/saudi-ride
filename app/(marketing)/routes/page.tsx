import { db } from "@/lib/db";
import RoutesClient from "./RoutesClient";
import { ROUTES_DATA } from "@/lib/data/routes";

export const revalidate = 86400; // static + refresh daily (was force-dynamic = slow on every request)

const TITLE = "Taxi Routes in Saudi Arabia | Fixed Prices — Taxi Saudi Arabia";
const DESCRIPTION = `Browse ${ROUTES_DATA.length}+ taxi routes across Saudi Arabia and the GCC. Fixed-price rides between Makkah, Madinah, Riyadh, Jeddah, Dammam, and more. Book online or on WhatsApp.`;

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://taxisaudiarabia.com/routes" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://taxisaudiarabia.com/routes",
    siteName: "Taxi Saudi Arabia",
    images: [{ url: "https://taxisaudiarabia.com/opengraph-image", width: 1200, height: 630, alt: TITLE }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default async function RoutesPage() {
  let routes = [];
  try {
    routes = await db.route.findMany({
      orderBy: {
        popular: 'desc',
      },
    });

    if (!routes || routes.length === 0) {
      console.warn("⚠️ Routes table is empty. Using seed fallback.");
      routes = ROUTES_DATA.map((r, index) => ({
        id: `fallback-route-${index}`,
        ...r,
        priceOnRequest: r.priceOnRequest ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    }
  } catch (error) {
    console.error("❌ Routes database fetch failed. Using fallback data.", error);
    routes = ROUTES_DATA.map((r, index) => ({
      id: `fallback-route-${index}`,
      ...r,
      priceOnRequest: r.priceOnRequest ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }

  return (
    <div>
      <RoutesClient initialRoutes={routes} />
    </div>
  );
}
