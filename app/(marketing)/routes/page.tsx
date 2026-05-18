import { db } from "@/lib/db";
import RoutesClient from "./RoutesClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Premium Chauffeur Routes | Fixed Prices Across Saudi Arabia & GCC",
  description: "Browse 50+ premium chauffeur routes across Saudi Arabia and the GCC. Fixed-rate luxury transfers between Makkah, Madinah, Riyadh, Jeddah, and more.",
};

export default async function RoutesPage() {
  const routes = await db.route.findMany({
    orderBy: {
      popular: 'desc',
    },
  });

  return (
    <main>
      <RoutesClient initialRoutes={routes} />
    </main>
  );
}
