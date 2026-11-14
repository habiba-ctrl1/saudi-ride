/**
 * Dumps all PriceBookEntry rows (Source A) to JSON for the consolidation
 * pipeline (scripts/consolidate-pricing-book.py). Read-only.
 * Run: npx tsx --env-file=.env.local scripts/export-pricing-book-json.ts
 */
import { prisma } from "../lib/prisma";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

async function main() {
  const entries = await prisma.priceBookEntry.findMany({ orderBy: { createdAt: "asc" } });
  const out = entries.map((e) => ({
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
  }));
  const outPath = join(process.cwd(), "data", "pricing-book-source-a-export.json");
  writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
  console.log(`Exported ${out.length} rows to ${outPath}`);
}

main()
  .catch((e) => {
    console.error("Export failed:", e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
