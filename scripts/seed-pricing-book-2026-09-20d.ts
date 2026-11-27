/**
 * One-off seed: real prices quoted to clients, pasted in chat 2026-09-20 (batch 4).
 * Run:  npx tsx --env-file=.env.local scripts/seed-pricing-book-2026-09-20d.ts
 */
import { prisma } from "../lib/prisma";

async function main() {
  const entries = [
    {
      fromCity: "Makkah",
      toCity: "Madinah",
      vehicleType: "SUV",
      price: 950,
      tripType: "ONE_WAY",
      notes:
        "2026 GMC Yukon XL; final best offer, but client had a competitor quote at 800 SAR (also claimed 2026 model) and went with them. General reference: our reliable premium options for this route usually run SAR 1,000+ during busy periods.",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Riyadh (Al Khuzama)",
      toCity: "Dubai",
      vehicleType: "SUV",
      price: 3000,
      tripType: "ONE_WAY",
      notes:
        "GMC Yukon XL 2025 model; 2 passengers; cross-border, one-way only; pay-after-trip (no upfront payment) confirmed to client. A generic 1,000 SAR/day baseline was floated before the route was known, then corrected to this route-specific price.",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Riyadh",
      toCity: "Manama (Bahrain)",
      vehicleType: "Sedan",
      price: 850,
      tripType: "ONE_WAY",
      notes: "1 passenger; private ride only (no shared/pooled option offered); pickup ~2 days out, morning or night flexible",
      source: "whatsapp_chat",
    },
  ];

  for (const e of entries) {
    const created = await prisma.priceBookEntry.create({ data: e });
    console.log("✓", created.fromCity, "→", created.toCity, created.vehicleType, created.price, created.currency, created.tripType);
  }
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
