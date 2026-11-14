/**
 * One-off seed: real prices quoted to clients, pasted in chat 2026-09-20 (batch 6).
 * Large multi-conversation dump: Dammam-Doha, Riyadh-Dammam, Abha-Rijal Almaa,
 * Jordan border crossings (x2 separate clients), Madinah-Tabuk, Dammam Airport
 * -Doha, Abha Airport-Braira, Riyadh-Riyadh Airport, Riyadh-Makkah,
 * Madinah-AlUla, Al Khobar-Manama, an AlUla resort transfer (USD), Bahrain-
 * Dhahran, and a Jeddah airport transfer.
 * Run:  npx tsx --env-file=.env.local scripts/seed-pricing-book-2026-09-20f.ts
 */
import { prisma } from "../lib/prisma";

async function main() {
  const entries = [
    {
      fromCity: "Dammam",
      toCity: "Doha (Qatar)",
      vehicleType: "Unspecified",
      price: 1500,
      tripType: "ONE_WAY",
      notes: "1 passenger; vehicle likely Toyota Fortuner or Ford Taurus depending on date/time availability; client's date/time not confirmed",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Riyadh",
      toCity: "Dammam",
      vehicleType: "SUV",
      price: 1100,
      tripType: "ONE_WAY",
      notes: "GMC; 2 luggage; trip 2 Sept 2026",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Riyadh",
      toCity: "Dammam",
      vehicleType: "Sedan",
      price: 650,
      tripType: "ONE_WAY",
      notes: "Alternative option, same client/trip as the 1,100 SAR GMC quote; trip 2 Sept 2026",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Abha",
      toCity: "Rijal Almaa (round trip)",
      vehicleType: "Sedan",
      price: 650,
      tripType: "ROUND_TRIP",
      notes: "1 passenger only; same-day round trip with waiting time incl.; date 23 Sept, depart after 4pm; client declined, used Uber instead",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Saudi side of Jordan border (near Aqaba)",
      toCity: "Tabuk",
      vehicleType: "Sedan",
      price: 1000,
      tripType: "ONE_WAY",
      notes: "2 pax, 2 hand luggage; driver drives Tabuk->border->Tabuk; pickup only from Saudi side, not Aqaba itself; quoted date 25 Dec",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Tabuk",
      toCity: "Aqaba (Jordan)",
      vehicleType: "Sedan",
      price: 1800,
      tripType: "ONE_WAY",
      notes: "Direct transfer incl. Saudi-Jordan border crossing; offered as alternative to the border-only-pickup option; same client as the 1,000 SAR border-only quote",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Tabuk",
      toCity: "Aqaba (Jordan)",
      vehicleType: "SUV",
      price: 2200,
      tripType: "ONE_WAY",
      notes: "GMC; direct transfer incl. border crossing; same client/thread as the 1,800 SAR sedan option",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Madinah",
      toCity: "Tabuk",
      vehicleType: "Sedan",
      price: 850,
      tripType: "ONE_WAY",
      notes: "1 pax; trip 2026-09-06 12pm; initial quote",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Madinah",
      toCity: "Tabuk",
      vehicleType: "Sedan",
      price: 450,
      tripType: "ONE_WAY",
      notes: "2025/2026 Hyundai Sonata or similar; discounted after client compared to Uber pricing; same trip as the 850 SAR quote",
      source: "whatsapp_chat",
    },
    {
      fromCity: "King Fahd International Airport (Dammam)",
      toCity: "Hyatt Regency Oryx Doha",
      vehicleType: "Sedan",
      price: 1300,
      tripType: "ONE_WAY",
      notes: "1 pax, 1 luggage; trip 9 Sept 11am; initial quote, corporate client discussing reimbursement",
      source: "whatsapp_chat",
    },
    {
      fromCity: "King Fahd International Airport (Dammam)",
      toCity: "Hyatt Regency Oryx Doha",
      vehicleType: "Sedan",
      price: 1200,
      tripType: "ONE_WAY",
      notes: "Final best offer after client's 1,000 SAR budget; payment: cash after trip w/ receipt, or bank transfer 50% advance/50% after; client ultimately declined",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Abha Airport",
      toCity: "Braira Abha Hotel",
      vehicleType: "Sedan",
      price: 300,
      tripType: "ONE_WAY",
      notes: "2 pax, 3 luggage; trip 11 Sept 5:30pm",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Al-Irqah District, Riyadh",
      toCity: "Riyadh Airport",
      vehicleType: "SUV",
      price: 400,
      tripType: "ONE_WAY",
      notes: "GMC Yukon; client had specifically requested a Cadillac, offered this as the available alternative at this price",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Riyadh",
      toCity: "Makkah",
      vehicleType: "SUV",
      price: 2000,
      tripType: "ONE_WAY",
      notes: "GMC Yukon XL; 4 adults + 2 kids w/ luggage; trip 21 Sept; client declined on price",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Riyadh",
      toCity: "Makkah",
      vehicleType: "Van",
      price: 1700,
      tripType: "ONE_WAY",
      notes: "Staria; alternative option, same client/trip as the 2,000 SAR GMC quote",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Madinah",
      toCity: "Al-Ula (round trip)",
      vehicleType: "Van",
      price: 1100,
      tripType: "ROUND_TRIP",
      notes: "Staria van; Umrah pilgrim client; initial best offer before further discount",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Madinah",
      toCity: "Al-Ula (round trip)",
      vehicleType: "Van",
      price: 1000,
      tripType: "ROUND_TRIP",
      notes: "Staria van; FINAL special rate, client agreed to proceed; trip 4 October; stops incl. Old Town AlUla, Maraya; driver-only service, permit/entrance tickets (e.g. Hegra) paid separately by client; fuel + driver included",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Al Khobar",
      toCity: "Manama (Bahrain)",
      vehicleType: "Sedan",
      price: 400,
      tripType: "ONE_WAY",
      notes: "Toyota Veloz; initial quote",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Al Khobar",
      toCity: "Manama (Bahrain)",
      vehicleType: "Sedan",
      price: 350,
      tripType: "ONE_WAY",
      notes: "Toyota Veloz; final discounted rate after client said fare was the concern",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Desert Rock Resort (AlUla)",
      toCity: "Six Senses Southern Dunes (AlUla)",
      vehicleType: "Unspecified",
      price: 100,
      currency: "USD",
      tripType: "ONE_WAY",
      notes: "Hyundai (exact model/category not specified); BOOKED & completed; client-proposed price accepted as-is; Fri 11 Sept 12:00pm pickup; driver Amir, vehicle plate 8775 SSA",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Tabuk",
      toCity: "Aqaba (Jordan)",
      vehicleType: "SUV",
      price: 1100,
      tripType: "ONE_WAY",
      notes: "GMC; different client/thread than the other Tabuk-Aqaba quotes; trip October (exact date pending)",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Tabuk",
      toCity: "Aqaba (Jordan, round trip)",
      vehicleType: "SUV",
      price: 2150,
      tripType: "ROUND_TRIP",
      notes: "GMC/Toyota Fortuner; round-trip total, return 6 days later; same client as the 1,100 SAR one-way GMC quote",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Tabuk",
      toCity: "Aqaba (Jordan, round trip)",
      vehicleType: "Sedan",
      price: 1800,
      tripType: "ROUND_TRIP",
      notes: "Ford Taurus; round-trip total alternative, return 6 days later; same client/thread",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Bahrain",
      toCity: "Dhahran",
      vehicleType: "Sedan",
      price: 400,
      tripType: "ONE_WAY",
      notes: "Toyota Veloz; trip on the 18th (month ~Sept 2026); client did not confirm",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Adani Bar Al-Rawda, Jeddah",
      toCity: "Jeddah International Airport",
      vehicleType: "Sedan",
      price: 150,
      tripType: "ONE_WAY",
      notes: "1 pax; trip 2026-09-14 06:15; client declined, some negotiation room was offered but not taken up",
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
