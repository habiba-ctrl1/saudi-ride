/**
 * One-off seed: real prices quoted to clients, pasted in chat 2026-09-20 (batch 7).
 * Covers Jubail-Dammam Airport, Al Khobar-Doha, Dhahran-Makkah, Riyadh(W KAFD)-
 * Doha (booked), Makkah-Jeddah Airport (3 vehicle tiers), Radisson Olaya-Riyadh
 * Airport (booked), Madinah-AlUla day trip, Riyadh-Hail Jawazat, Doha-Dammam,
 * Hail-Riyadh, Riyadh-Doha x2 separate clients, Al Khobar-Manama Airport,
 * Madinah-Riyadh (4-tier menu), Dammam-Qatar.
 * Run:  npx tsx --env-file=.env.local scripts/seed-pricing-book-2026-09-20g.ts
 */
import { prisma } from "../lib/prisma";

async function main() {
  const entries = [
    {
      fromCity: "Jubail",
      toCity: "Dammam Airport",
      vehicleType: "SUV/Van",
      price: 370,
      tripType: "ONE_WAY",
      notes: "5 pax, 3 cabin bags; trip 14 Sept 2:20pm; vehicle comes from Dammam; client declined as too expensive",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Al Khobar",
      toCity: "Doha (Qatar)",
      vehicleType: "Unspecified",
      price: 1300,
      tripType: "ONE_WAY",
      notes: "2 pax, small bags; trip 15.09.2026 10am; vehicle not specified in chat",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Dhahran",
      toCity: "Makkah",
      vehicleType: "Sedan",
      price: 1600,
      tripType: "ONE_WAY",
      notes: "3 pax; trip Dec 2; ~13 hour drive; initial quote",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Dhahran",
      toCity: "Makkah",
      vehicleType: "Sedan",
      price: 1550,
      tripType: "ONE_WAY",
      notes: "Final discounted price, same trip as the 1,600 SAR quote",
      source: "whatsapp_chat",
    },
    {
      fromCity: "W KAFD, Riyadh",
      toCity: "Doha (Qatar)",
      vehicleType: "Sedan",
      price: 1900,
      tripType: "ONE_WAY",
      notes: "1 pax, 1 bag; trip 17 Sept 5pm; all-inclusive, door-to-door, electronic receipt offered; CONFIRMED booking",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Makkah (Pullman Zamzam)",
      toCity: "Jeddah Airport (JED)",
      vehicleType: "Sedan",
      price: 300,
      tripType: "ONE_WAY",
      notes: "1 pax; pickup midnight 22 Sept, flight 4am; initial quote, client compared to train fare",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Makkah (Pullman Zamzam)",
      toCity: "Jeddah Airport (JED)",
      vehicleType: "Sedan",
      price: 250,
      tripType: "ONE_WAY",
      notes: "Discounted offer, same trip as the 300 SAR quote; client still declined at this price",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Makkah (Pullman Zamzam)",
      toCity: "Jeddah Airport (JED)",
      vehicleType: "Van",
      price: 350,
      tripType: "ONE_WAY",
      notes: "Hyundai Staria; held price for client Mohamed, same 22 Sept trip as the 300/250 SAR sedan quotes, offered as alt. alongside GMC Yukon XL; booking ultimately cancelled by client (plans changed)",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Radisson Olaya, Riyadh",
      toCity: "Riyadh Airport Terminal 5",
      vehicleType: "Sedan",
      price: 250,
      tripType: "ONE_WAY",
      notes: "Ford Taurus 2025, smallest available; 1 pax, 1 luggage; trip 15/09/2026 23:00; CONFIRMED & booked (guest Andrea); card payment adds 15% VAT",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Madinah",
      toCity: "Al-Ula (round trip day tour)",
      vehicleType: "Sedan",
      price: 1200,
      tripType: "ROUND_TRIP",
      notes: "Toyota Camry or similar; 2 pax; itinerary: Hegra, Old Town, Elephant Rock; fuel+tolls+driver incl.; trip 30-31 Oct 2026, early morning start",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Riyadh",
      toCity: "Hail Jawazat Office",
      vehicleType: "Sedan",
      price: 1000,
      tripType: "ONE_WAY",
      notes: "1 pax; trip 16 Sept 8pm; incl. fuel and tolls; client declined",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Doha (Qatar)",
      toCity: "Dammam",
      vehicleType: "SUV",
      price: 1600,
      tripType: "ONE_WAY",
      notes: "Fortuner or GMC; 1 adult + 2 kids; trip 17 Sept 4pm; client declined",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Doha (Qatar)",
      toCity: "Dammam",
      vehicleType: "Van",
      price: 1200,
      tripType: "ONE_WAY",
      notes: "Toyota Innova; cheaper alt. offered after decline, same trip",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Hail",
      toCity: "Riyadh",
      vehicleType: "Sedan",
      price: 800,
      tripType: "ONE_WAY",
      notes: "1 pax; 2025/2026 model sedan; client said he'd confirm later",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Riyadh",
      toCity: "Doha (Qatar)",
      vehicleType: "SUV",
      price: 1800,
      tripType: "ONE_WAY",
      notes: "GMC; booking ref TSA-2026-131821; trip 22 Sept 9pm; client declined, will use another time",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Al Khobar",
      toCity: "Manama Airport (Bahrain)",
      vehicleType: "Sedan",
      price: 400,
      tripType: "ONE_WAY",
      notes: "2 bags; trip Sunday 20 Sept 4pm",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Madinah",
      toCity: "Riyadh",
      vehicleType: "Sedan",
      price: 1100,
      tripType: "ONE_WAY",
      notes: "4 adults + 2 children + 6 luggage; trip 18 Oct 2026; fixed-price menu, all-inclusive no meter/surge",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Madinah",
      toCity: "Riyadh",
      vehicleType: "SUV",
      price: 1400,
      tripType: "ONE_WAY",
      notes: "Same fixed-price menu/trip as the 1,100 SAR sedan option",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Madinah",
      toCity: "Riyadh",
      vehicleType: "Van",
      price: 1400,
      tripType: "ONE_WAY",
      notes: "Same fixed-price menu/trip; van tier priced equal to SUV tier",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Madinah",
      toCity: "Riyadh",
      vehicleType: "SUV",
      price: 1800,
      tripType: "ONE_WAY",
      notes: "GMC Yukon, premium tier of the same fixed-price menu/trip",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Dammam",
      toCity: "Qatar",
      vehicleType: "Sedan",
      price: 1350,
      tripType: "ONE_WAY",
      notes: "3 pax; trip 1 Oct 2026; incl. private car, driver, and border crossing assistance; client said will update later",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Riyadh",
      toCity: "Doha (Qatar)",
      vehicleType: "SUV",
      price: 1800,
      tripType: "ONE_WAY",
      notes: "GMC; client Rauff, 3 pax; initial quote, recommended for the long cross-border route",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Riyadh",
      toCity: "Doha (Qatar)",
      vehicleType: "Sedan",
      price: 1400,
      tripType: "ONE_WAY",
      notes: "Ford Taurus; same client (Rauff)/trip as the 1,800 SAR GMC quote, alternative sedan option",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Riyadh",
      toCity: "Doha (Qatar)",
      vehicleType: "SUV",
      price: 1700,
      tripType: "ONE_WAY",
      notes: "GMC; special discounted price after client (Rauff) found a competitor's Toyota Innova at ~1,000 QAR",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Riyadh",
      toCity: "Doha (Qatar)",
      vehicleType: "Sedan",
      price: 1350,
      tripType: "ONE_WAY",
      notes: "Ford Taurus; final best price for client Rauff, same negotiation as the 1,700 SAR GMC discount",
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
