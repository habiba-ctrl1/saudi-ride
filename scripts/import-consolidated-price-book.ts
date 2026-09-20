/**
 * Imports data/pricing-book-consolidated.json (built by
 * scripts/consolidate_price_book.py) into the live database:
 *   1. Backfills routeFamily/crossBorder/priceKind on the 83 existing
 *      PriceBookEntry rows (Source A - matched by id, never overwrites price).
 *   2. Inserts the Naimatullah vendor-rate evidence (Source B) as NEW
 *      PriceBookEntry rows - both the raw VENDOR_COST rows and the
 *      DERIVED_SUGGESTED (cost + SAR 100 margin) rows, clearly tagged.
 *   3. Upserts one RoutePriceApproval row per (routeFamily, tripType,
 *      vehicleCategory) with the observed lowest/highest/sourceCount/status.
 *      finalApprovedPrice/approvalNotes are left untouched on existing rows -
 *      this script never sets or clears an approval.
 *
 * Run:  npx tsx --env-file=.env.local scripts/import-consolidated-price-book.ts
 */
import { prisma } from "../lib/prisma";
import { readFileSync } from "node:fs";
import { join } from "node:path";

type Evidence = {
  entryId: string | null;
  routeFamily: string;
  crossBorder: boolean;
  countryFrom: string;
  countryTo: string;
  vehicleCategory: string;
  vehicleRaw: string;
  price: number;
  currency: string;
  tripType: string;
  pickup: string;
  dropoff: string;
  source: string;
  notes: string;
  isVendorCost: boolean;
  priceKind: "CLIENT_OBSERVED" | "VENDOR_COST" | "DERIVED_SUGGESTED";
};

type RouteFamilyAgg = {
  routeFamily: string;
  tripType: string;
  crossBorder: boolean;
  countryFrom: string;
  countryTo: string;
  vehicles: Record<string, { lowest: number; highest: number; sourceCount: number; status: string }>;
};

async function main() {
  const raw = readFileSync(join(process.cwd(), "data", "pricing-book-consolidated.json"), "utf8");
  const data = JSON.parse(raw) as { routeFamilies: RouteFamilyAgg[]; evidence: Evidence[] };

  // 1) Backfill Source A rows
  let backfilled = 0;
  for (const e of data.evidence) {
    if (!e.entryId) continue;
    await prisma.priceBookEntry.update({
      where: { id: e.entryId },
      data: { routeFamily: e.routeFamily, crossBorder: e.crossBorder, priceKind: "CLIENT_OBSERVED" },
    });
    backfilled++;
  }
  console.log(`Backfilled routeFamily/crossBorder on ${backfilled} existing (Source A) rows`);

  // 2) Insert Source B (Naimatullah) rows - skip if an identical row already exists (idempotent re-run)
  const sourceB = data.evidence.filter((e) => !e.entryId);
  let inserted = 0;
  let skipped = 0;
  for (const e of sourceB) {
    const existing = await prisma.priceBookEntry.findFirst({
      where: {
        fromCity: e.pickup,
        toCity: e.dropoff,
        vehicleType: e.vehicleRaw,
        price: e.price,
        priceKind: e.priceKind,
      },
    });
    if (existing) {
      skipped++;
      continue;
    }
    await prisma.priceBookEntry.create({
      data: {
        fromCity: e.pickup,
        toCity: e.dropoff,
        vehicleType: e.vehicleRaw,
        price: e.price,
        currency: e.currency,
        tripType: e.tripType,
        notes: e.notes,
        source: "vendor_rate_card_naimatullah",
        routeFamily: e.routeFamily,
        crossBorder: e.crossBorder,
        priceKind: e.priceKind,
      },
    });
    inserted++;
  }
  console.log(`Inserted ${inserted} new Source B rows (${skipped} already existed, skipped)`);

  // 3) Upsert RoutePriceApproval aggregates - never touch finalApprovedPrice/approvalNotes
  let upserted = 0;
  for (const rf of data.routeFamilies) {
    for (const [vehicleCategory, agg] of Object.entries(rf.vehicles)) {
      const pricingStatus =
        agg.status === "Conflicting Prices" ? "CONFLICTING" :
        agg.status === "Multiple Sources" ? "MULTIPLE_SOURCES" :
        "SINGLE_SOURCE";

      await prisma.routePriceApproval.upsert({
        where: {
          routeFamily_tripType_vehicleCategory: {
            routeFamily: rf.routeFamily,
            tripType: rf.tripType,
            vehicleCategory,
          },
        },
        create: {
          routeFamily: rf.routeFamily,
          tripType: rf.tripType,
          vehicleCategory,
          crossBorder: rf.crossBorder,
          countryFrom: rf.countryFrom,
          countryTo: rf.countryTo,
          lowestObserved: agg.lowest,
          highestObserved: agg.highest,
          sourceCount: agg.sourceCount,
          pricingStatus,
        },
        update: {
          crossBorder: rf.crossBorder,
          countryFrom: rf.countryFrom,
          countryTo: rf.countryTo,
          lowestObserved: agg.lowest,
          highestObserved: agg.highest,
          sourceCount: agg.sourceCount,
          pricingStatus,
        },
      });
      upserted++;
    }
  }
  console.log(`Upserted ${upserted} RoutePriceApproval rows`);

  const totalEntries = await prisma.priceBookEntry.count();
  const totalApprovals = await prisma.routePriceApproval.count();
  console.log(`\nFinal counts: price_book_entries=${totalEntries}, route_price_approvals=${totalApprovals}`);
}

main()
  .catch((e) => {
    console.error("Import failed:", e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
