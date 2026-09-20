import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PricingBookClient } from "./PricingBookClient";

export const metadata: Metadata = { title: "Pricing Book | Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminPricingBookPage() {
  const entries = await prisma.priceBookEntry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-[#F5F0E8]">Pricing Book</h1>
        <p className="text-[#A1A1A6] mt-1 text-sm">
          {entries.length} quoted prices saved. Every route + vehicle price you&apos;ve given a
          client, in one lookup table — so the next quote for the same route is consistent.
        </p>
      </div>
      <PricingBookClient
        entries={entries.map((e) => ({
          id: e.id,
          fromCity: e.fromCity,
          toCity: e.toCity,
          vehicleType: e.vehicleType,
          price: e.price,
          currency: e.currency,
          tripType: e.tripType,
          notes: e.notes,
          source: e.source,
          isActive: e.isActive,
          createdAt: e.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
