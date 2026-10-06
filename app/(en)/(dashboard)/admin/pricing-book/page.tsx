import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PricingRulesClient } from "./PricingRulesClient";
import { PricingLookupPanel } from "./PricingLookupPanel";

export const metadata: Metadata = { title: "Pricing Book | Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminPricingBookPage() {
  const rows = await prisma.routePriceApproval.findMany({
    orderBy: [{ routeFamily: "asc" }, { tripType: "asc" }, { vehicleCategory: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#F5F0E8]">Pricing Book</h1>
          <p className="text-[#A1A1A6] mt-1 text-sm">
            {rows.length} pricing rules (route × vehicle × trip type). Every quotation reads from here — set the recommended price,
            minimum, estimated cost and range once.
          </p>
        </div>
        <Link href="/admin/pricing-book/evidence" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:underline w-fit">
          Quote evidence log <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <PricingLookupPanel />
      <PricingRulesClient
        rows={rows.map((r) => ({
          id: r.id,
          routeFamily: r.routeFamily,
          tripType: r.tripType,
          vehicleCategory: r.vehicleCategory,
          category: r.category,
          crossBorder: r.crossBorder,
          countryFrom: r.countryFrom,
          countryTo: r.countryTo,
          lowestObserved: r.lowestObserved,
          highestObserved: r.highestObserved,
          sourceCount: r.sourceCount,
          pricingStatus: r.pricingStatus,
          finalApprovedPrice: r.finalApprovedPrice,
          rangeLow: r.rangeLow,
          rangeHigh: r.rangeHigh,
          priceMin: r.priceMin,
          estCost: r.estCost,
          borderFee: r.borderFee,
          approvalNotes: r.approvalNotes,
        }))}
      />
    </div>
  );
}
