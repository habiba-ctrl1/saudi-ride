import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { RouteReviewClient } from "./RouteReviewClient";

export const metadata: Metadata = { title: "Route Review | Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminRouteReviewPage() {
  const rows = await prisma.routePriceApproval.findMany({
    orderBy: [{ routeFamily: "asc" }, { tripType: "asc" }, { vehicleCategory: "asc" }],
  });

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/pricing-book" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:underline mb-3">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Pricing Book
        </Link>
        <h1 className="font-heading text-3xl font-bold text-[#F5F0E8]">Route Review &amp; Approval</h1>
        <p className="text-[#A1A1A6] mt-1 text-sm">
          {rows.length} route + vehicle combinations, aggregated from every quote in the Pricing
          Book. Lowest/highest here is observed history only — nothing is a live operating price
          until you set a Final Approved Price below.
        </p>
      </div>
      <RouteReviewClient
        rows={rows.map((r) => ({
          id: r.id,
          routeFamily: r.routeFamily,
          tripType: r.tripType,
          vehicleCategory: r.vehicleCategory,
          crossBorder: r.crossBorder,
          countryFrom: r.countryFrom,
          countryTo: r.countryTo,
          lowestObserved: r.lowestObserved,
          highestObserved: r.highestObserved,
          sourceCount: r.sourceCount,
          pricingStatus: r.pricingStatus,
          finalApprovedPrice: r.finalApprovedPrice,
          approvalNotes: r.approvalNotes,
        }))}
      />
    </div>
  );
}
