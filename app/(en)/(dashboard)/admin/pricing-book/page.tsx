import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PricingBookClient } from "./PricingBookClient";

export const metadata: Metadata = { title: "Pricing Book | Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminPricingBookPage() {
  const entries = await prisma.priceBookEntry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#F5F0E8]">Pricing Book</h1>
          <p className="text-[#A1A1A6] mt-1 text-sm">
            {entries.length} quoted prices saved. Every route + vehicle price you&apos;ve given a
            client, in one lookup table — so the next quote for the same route is consistent.
          </p>
        </div>
        <Link
          href="/admin/pricing-book/routes"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:underline w-fit"
        >
          Route Review &amp; Approval <ArrowRight className="h-3.5 w-3.5" />
        </Link>
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
          routeFamily: e.routeFamily,
          crossBorder: e.crossBorder,
          priceKind: e.priceKind,
          createdAt: e.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
