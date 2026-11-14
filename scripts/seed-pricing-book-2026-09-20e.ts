/**
 * One-off seed: real prices quoted to clients, pasted in chat 2026-09-20 (batch 5).
 * Covers: Tabuk-NEOM airports, Al Jubail-Kuwait border crossing, a Ras Tanura
 * car-towing job (not a taxi ride, kept for record), Hanak-Tabuk Airport
 * round trip with VAT invoice option, and Riyadh-Dammam sedan negotiation.
 * Run:  npx tsx --env-file=.env.local scripts/seed-pricing-book-2026-09-20e.ts
 */
import { prisma } from "../lib/prisma";

async function main() {
  const entries = [
    {
      fromCity: "Tabuk Airport",
      toCity: "NEOM Airport (Bay)",
      vehicleType: "Sedan",
      price: 500,
      tripType: "ONE_WAY",
      notes: "Camry/Elantra/Sonata; 1 pax, 2 small luggage; trip 2026-08-31 6:00am; client did not confirm at time of quote",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Al Jubail",
      toCity: "Al Khafji Border (Saudi side, outside border)",
      vehicleType: "Unspecified",
      price: 550,
      tripType: "ONE_WAY",
      notes: "Drop-off outside the border only, client crosses into Kuwait on own (has Kuwait visa); vehicle type not specified in chat",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Al Jubail",
      toCity: "Ar-Ruqi Border (Saudi side, outside border)",
      vehicleType: "Unspecified",
      price: 900,
      tripType: "ONE_WAY",
      notes: "Alternative border option (not chosen); drop-off outside border only; vehicle type not specified in chat",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Al Jubail",
      toCity: "Kuwait (driver crosses border)",
      vehicleType: "Unspecified",
      price: 1300,
      tripType: "ONE_WAY",
      notes: "Price if driver crosses the border into Kuwait with client, incl. driver's border fees and return; client declined and looked elsewhere; vehicle type not specified in chat",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Ras Tanura (Aden Restaurant)",
      toCity: "Safwa (Al Rajhi/Riyadh Bank)",
      vehicleType: "Recovery/Tow Truck",
      price: 300,
      tripType: "ONE_WAY",
      notes: "Car towing/recovery job, NOT a taxi ride — logged for record since it's the same client-pricing workflow. Client found a competitor at 70 SAR and cancelled.",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Hanak",
      toCity: "Tabuk Airport",
      vehicleType: "Unspecified",
      price: 1840,
      tripType: "ROUND_TRIP",
      notes: "Bank transfer option: 1,600 SAR + 15% VAT (240) = 1,840 total, official VAT invoice via partner Arabian Eagle Eyes. Departure 29 Aug 01:30, return 30 Aug 09:15. Vehicle type not specified.",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Hanak",
      toCity: "Tabuk Airport",
      vehicleType: "Unspecified",
      price: 1600,
      tripType: "ROUND_TRIP",
      notes: "Cash option (no VAT invoice), same trip as the 1,840 SAR bank-transfer quote; half paid at departure, half at return.",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Riyadh",
      toCity: "Dammam",
      vehicleType: "Sedan",
      price: 750,
      tripType: "ONE_WAY",
      notes: "1 pax, no luggage; trip 2026-08-30 9:30pm; initial quote",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Riyadh",
      toCity: "Dammam",
      vehicleType: "Sedan",
      price: 600,
      tripType: "ONE_WAY",
      notes: "Same trip as the 750 SAR quote; discounted follow-up offer for a light 1-passenger sedan booking",
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
