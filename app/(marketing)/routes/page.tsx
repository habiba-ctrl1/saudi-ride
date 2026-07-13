import { db } from "@/lib/db";
import RoutesClient from "./RoutesClient";
import { ROUTES_DATA } from "@/lib/data/routes";

export const revalidate = 86400; // static + refresh daily (was force-dynamic = slow on every request)

export const metadata = {
  title: "Taxi Routes in Saudi Arabia | Fixed Prices — Taxi Saudi Arabia",
  description: "Browse 50+ taxi routes across Saudi Arabia and the GCC. Fixed-price rides between Makkah, Madinah, Riyadh, Jeddah, Dammam, and more. Book online or on WhatsApp.",
  alternates: { canonical: "https://taxisaudiarabia.com/routes" },
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
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    }
  } catch (error) {
    console.error("❌ Routes database fetch failed. Using fallback data.", error);
    routes = ROUTES_DATA.map((r, index) => ({
      id: `fallback-route-${index}`,
      ...r,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }

  return (
    <main>
      <RoutesClient initialRoutes={routes} />
    </main>
  );
}
