/**
 * Exercises the REAL /api/leads POST handler (validation + Prisma write) without
 * a running server, then deletes the test row. Proves a homepage-quote lead lands
 * in the DB.  Run: npx tsx --env-file=.env.local scripts/verify-leads-endpoint.ts
 */
import { POST } from "../app/api/leads/route";
import { prisma } from "../lib/prisma";

async function main() {
  const before = await prisma.lead.count();

  const req = new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      origin: "Jeddah Airport (JED)",
      destination: "Makkah Haram",
      tripDate: "2026-08-10T09:00",
      vehicleType: "SUV",
      quotedPrice: 249,
      currency: "SAR",
      locale: "en",
      source: "price_calculator",
      pageUrl: "http://localhost/#booking-console",
      utm: { utm_source: "verify", utm_medium: "script", utm_campaign: "phase1a" },
    }),
  });

  const res = await POST(req);
  const body = (await res.json()) as { success?: boolean; id?: string };
  const after = await prisma.lead.count();

  console.log("HTTP status :", res.status);
  console.log("Response    :", body);
  console.log(`leads count : ${before} -> ${after}`);

  if (body.id) {
    await prisma.lead.delete({ where: { id: body.id } });
    console.log("Cleanup     : test row deleted, count back to", await prisma.lead.count());
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
