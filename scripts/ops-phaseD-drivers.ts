/**
 * Phase D data: apply 0022 and load the driver list from the owner's "Saudi rides.docx" (tables at the end).
 *  - Main drivers (tagged "main drivers" by owner): Naimat, Sheraz, Ajmal, Bilal, Faisal
 *  - Local drivers (not worked with yet): Sohrab Hossain, Malik Nisar
 * Only what the document states is stored. Share % for new people is NOT assumed (0, note says terms not set).
 * Idempotent. Run: npx tsx --env-file=.env.local scripts/ops-phaseD-drivers.ts
 */
import { prisma } from "../lib/prisma";
import { readFileSync } from "node:fs";
import { join } from "node:path";
const q = (sql: string, ...p: unknown[]) => prisma.$executeRawUnsafe(sql, ...p);

type P = { name: string; kind: "main" | "local"; phone: string; vehicle: string; routes?: string; city?: string; nationality?: string; licence?: string; note?: string; share?: number };
const people: P[] = [
  { name: "Naimat", kind: "main", phone: "+966 57 420 5462", vehicle: "Sedan — Camry", routes: "Makkah, Madinah, Jeddah", note: "Listed as 'Naimtullah' in owner's document." },
  { name: "Sheraz", kind: "main", phone: "+966 59 894 7503", vehicle: "Staria VIP", routes: "Makkah, Madinah, Taif, Jeddah — all routes" },
  { name: "Ajmal", kind: "main", phone: "+966 54 910 0151", vehicle: "GMC, sedan, Veloz — depends on requirement", routes: "Cross-border: Saudi to UAE, Qatar, Bahrain and others", share: 0, note: "Profit-share terms not set yet." },
  { name: "Bilal", kind: "main", phone: "+966 55 436 5871", vehicle: "3 vehicles (Sonata, Toyota Camry and similar)", routes: "Tabuk, Madinah — all", note: "" },
  { name: "Faisal", kind: "main", phone: "+966 56 619 4955", vehicle: "Lexus sedan", routes: "AlUla — whole area", city: "AlUla", share: 0, note: "Did Fer Palacios AlUla ride via Sheraz. Profit-share terms not set yet." },
  { name: "Sohrab Hossain", kind: "local", phone: "+966 51 010 6474", vehicle: "Toyota Veloz 2024", city: "Al Ahsa", nationality: "Bangladeshi", licence: "Private licence", share: 0, note: "Local driver — not worked with yet (try for local rides)." },
  { name: "Malik Nisar", kind: "local", phone: "+92 333 5621695", vehicle: "Toyota Yaris 2023", city: "Khobar", nationality: "Pakistani", licence: "Not stated", share: 0, note: "Local driver — not worked with yet (try for local rides). Number as given (Pakistan format)." },
];

async function main() {
  const sql = readFileSync(join(process.cwd(), "supabase/migrations/0022_drivers_documents.sql"), "utf8");
  for (const s of sql.split("\n").filter((l) => !l.trim().startsWith("--")).join("\n").split(";").map((x) => x.trim()).filter(Boolean)) await q(s);

  for (const p of people) {
    await q(
      `INSERT INTO partners (name, kind, phone, vehicle_info, routes, city, nationality, licence_note, default_share_pct, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::numeric,$10)
       ON CONFLICT (name) DO UPDATE SET kind=EXCLUDED.kind, phone=EXCLUDED.phone, vehicle_info=EXCLUDED.vehicle_info, routes=EXCLUDED.routes,
         city=COALESCE(EXCLUDED.city, partners.city), nationality=COALESCE(EXCLUDED.nationality, partners.nationality),
         licence_note=COALESCE(EXCLUDED.licence_note, partners.licence_note),
         notes=CASE WHEN EXCLUDED.notes <> '' THEN EXCLUDED.notes ELSE partners.notes END`,
      p.name, p.kind, p.phone, p.vehicle, p.routes ?? null, p.city ?? null, p.nationality ?? null, p.licence ?? null, p.share ?? 0, p.note ?? "",
    );
  }
  // Keep previously confirmed share defaults for existing vendors (ON CONFLICT does not touch default_share_pct).
  // Rides done by these vendors: copy phone onto the ride record so the booking page shows it.
  await q(`UPDATE quotations q SET driver_phone=p.phone FROM partners p WHERE q.partner_id=p.id AND q.driver_phone IS NULL AND q.quote_reference <> 'TSA-2026-0012'`);

  console.table(await prisma.$queryRawUnsafe(`SELECT name, kind, phone, default_share_pct::float share, vehicle_info, routes, city FROM partners ORDER BY kind, name`));
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
