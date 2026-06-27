import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DriversClient } from "./DriversClient";

export const metadata: Metadata = {
  title: "Driver Management | Admin Dashboard",
};

export const dynamic = "force-dynamic";

export default async function AdminDriversPage() {
  const rows = await prisma.driver.findMany({
    include: {
      user: { select: { name: true, email: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Serialize dates so the client component receives plain strings.
  const drivers = rows.map((d) => ({
    id: d.id,
    licenseNumber: d.licenseNumber,
    licenseExpiry: d.licenseExpiry.toISOString(),
    rating: d.rating,
    totalTrips: d.totalTrips,
    status: d.status,
    tgaCertified: d.tgaCertified,
    ihramStatus: d.ihramStatus,
    languages: d.languages,
    user: d.user,
  }));

  return <DriversClient drivers={drivers} />;
}
