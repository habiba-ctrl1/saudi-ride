/**
 * Finds exact duplicate price_book_entries rows (same from/to/vehicle/price/
 * trip type/currency) and deletes all but the oldest of each group.
 * Run:  npx tsx --env-file=.env.local scripts/dedupe-pricing-book.ts
 */
import { prisma } from "../lib/prisma";

async function main() {
  const all = await prisma.priceBookEntry.findMany({ orderBy: { createdAt: "asc" } });

  const seen = new Map<string, string>(); // key -> id to keep
  const toDelete: string[] = [];

  for (const e of all) {
    const key = [e.fromCity, e.toCity, e.vehicleType, e.price, e.tripType, e.currency]
      .join("||")
      .toLowerCase();
    if (seen.has(key)) {
      toDelete.push(e.id);
      console.log("DUPLICATE ->", e.fromCity, "→", e.toCity, e.vehicleType, e.price, e.currency, e.tripType, `(id ${e.id}, keeping ${seen.get(key)})`);
    } else {
      seen.set(key, e.id);
    }
  }

  if (toDelete.length === 0) {
    console.log("No exact duplicates found.");
  } else {
    await prisma.priceBookEntry.deleteMany({ where: { id: { in: toDelete } } });
    console.log(`\nDeleted ${toDelete.length} duplicate row(s).`);
  }

  const count = await prisma.priceBookEntry.count();
  console.log(`price_book_entries rows remaining = ${count}`);
}

main()
  .catch((e) => {
    console.error("Dedupe failed:", e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
