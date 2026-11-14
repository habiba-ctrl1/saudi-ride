/**
 * Phase A: apply 0019 + safe backfill of confirmed owner facts (2026-10-06).
 * Idempotent. Run: npx tsx --env-file=.env.local scripts/ops-phaseA-backfill.ts
 * Only values the owner stated are written. Unknown costs stay NULL / 'required'.
 */
import { prisma } from "../lib/prisma";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const q = (sql: string, ...p: unknown[]) => prisma.$executeRawUnsafe(sql, ...p);
const r = <T = any>(sql: string, ...p: unknown[]) => prisma.$queryRawUnsafe<T[]>(sql, ...p);

async function main() {
  const sql = readFileSync(join(process.cwd(), "supabase/migrations/0019_ops_foundation.sql"), "utf8");
  for (const s of sql.split("\n").filter((l) => !l.trim().startsWith("--")).join("\n").split(";").map((x) => x.trim()).filter(Boolean)) {
    await q(s);
  }
  console.log("✓ migration 0019 applied");

  await q(`INSERT INTO partners (name, default_share_pct, notes) VALUES ('Naimat', 50, '50/50 profit and loss share on shared rides') ON CONFLICT (name) DO NOTHING`);
  const [{ id: naimat }] = await r<{ id: string }>(`SELECT id FROM partners WHERE name='Naimat'`);

  // Quote-number clash: DB 0015 is Fer Palacios (issued PDF = 0017); Hayley Reid owns 0015.
  await q(`UPDATE quotations SET quote_reference='TSA-2026-0017' WHERE quote_reference='TSA-2026-0015' AND customer_name='Fer Palacios'
           AND NOT EXISTS (SELECT 1 FROM quotations WHERE quote_reference='TSA-2026-0017')`);

  type Ins = { ref: string; name: string; phone: string; email?: string; pickup: string; drop: string; type: string; date: string; time?: string; ret?: string;
    pax?: number; veh: string; price: number; status: string; pay: string; paid?: number; method?: string; src: string; notes: string };
  const rows: Ins[] = [
    { ref: "TSA-2026-0013", name: "Alaa Fares", phone: "+966 56 650 9459", email: "alaa@lightech.com.sa", pickup: "Red Sea International Airport (RSI)", drop: "AMAALA",
      type: "one_way", date: "2026-09-16", time: "12:30", pax: 2, veh: "sedan", price: 500, status: "completed", pay: "paid", paid: 500, method: "Cash", src: "website",
      notes: "Pickup 12:30 confirmed by owner 2026-10-06. Also exists as legacy Prisma Booking TSA-2026-596718 (10:29pm was the original, superseded)." },
    { ref: "TSA-2026-0015", name: "Hayley Reid", phone: "+966 50 269 1338", email: "Hayloreid@gmail.com", pickup: "Hampton by Hilton Sharma, NEOM Community 1", drop: "Red Sea International Airport (RSI)",
      type: "one_way", date: "2026-10-01", time: "05:00", veh: "sedan", price: 600, status: "quoted", pay: "unpaid", src: "whatsapp",
      notes: "Backfilled from client-quotations/Quoted. Date passed - outcome unknown (needs owner)." },
    { ref: "TSA-2026-0016", name: "Julia", phone: "+61 435 899 340", email: "jsun.paraplanning@gmail.com", pickup: "Red Sea International Airport (RSI)", drop: "Four Seasons Resort Shura Island (3-leg itinerary)",
      type: "multi_day", date: "2026-10-06", ret: "2026-10-11", veh: "sedan", price: 2050, status: "confirmed", pay: "unpaid", src: "whatsapp",
      notes: "3 legs: 6 Oct RSI to AMAALA SAR 600; 8 Oct AMAALA to Our Habitas AlUla SAR 700; 10-11 Oct AlUla to Four Seasons Shura Island SAR 750. Upcoming - number kept as issued." },
    { ref: "TSA-2026-0018", name: "Habib Thabeer", phone: "+966 57 830 0520", pickup: "Jeddah Train Station", drop: "Yanbu",
      type: "one_way", date: "2026-10-04", time: "20:00", pax: 6, veh: "van", price: 600, status: "completed", pay: "paid", paid: 600, method: "Cash", src: "whatsapp",
      notes: "Hyundai Staria. Receipt issued (client-quotations/Completed)." },
  ];
  for (const x of rows) {
    const n = await q(
      `INSERT INTO quotations (quote_reference, customer_name, customer_phone, customer_email, pickup_location, drop_location, trip_type, trip_date, trip_time, return_date,
         passengers_count, vehicle_type_requested, quoted_price, status, payment_status, actual_amount_paid, payment_method_used, source, admin_notes, price_notes)
       SELECT $1,$2,$3,$4,$5,$6,$7::trip_type,$8::date,$9::time,$10::date,$11::int,$12::driver_vehicle_type,$13::numeric,$14::quotation_status,$15::quotation_payment_status,$16::numeric,$17,$18::lead_source,$19,$19
       WHERE NOT EXISTS (SELECT 1 FROM quotations WHERE quote_reference=$1)`,
      x.ref, x.name, x.phone, x.email ?? null, x.pickup, x.drop, x.type, x.date, x.time ?? null, x.ret ?? null, x.pax ?? null, x.veh, x.price, x.status, x.pay, x.paid ?? null, x.method ?? null, x.src, x.notes,
    );
    console.log(n ? "+ inserted" : ". exists", x.ref);
  }

  await q(`UPDATE quotations SET is_test=false WHERE quote_reference='TSA-2026-0011'`);

  // Owner-confirmed financials 2026-10-06: [ref, customer paid, driver cost, note]. Naimat 50/50.
  const fin: [string, number, number, string][] = [
    ["TSA-2026-0003", 275, 225, "Owner 2026-10-06: margin 50 (25/25). Customer-paid assumed = quoted 275 (confirm)."],
    ["TSA-2026-0008", 200, 150, "Owner 2026-10-06: margin 50 (25/25). Paid 200 cash."],
    ["TSA-2026-0012", 350, 200, "Owner 2026-10-06: margin 150 (75/75). Paid 350 cash."],
    ["TSA-2026-0013", 500, 400, "Owner 2026-10-06: margin 100 (50/50). Customer-paid assumed 500 cash (not 575 card) - confirm."],
    ["TSA-2026-0011", 0, 100, "Owner 2026-10-06: one-way only completed, customer did NOT pay, driver paid 100 = loss 100 (50 owner / 50 Naimat). Quote was 450 round trip."],
  ];
  for (const [ref, paid, cost, note] of fin) {
    await q(
      `UPDATE quotations SET driver_cost=$2::numeric, actual_amount_paid=$3::numeric, extra_cost=0, partner_id=$4::uuid, partner_share_pct=50,
         financial_status='confirmed',
         financial_note=$5 || CASE WHEN profit IS NOT NULL AND profit<>($3::numeric-$2::numeric) THEN ' (previous profit field: '||profit||')' ELSE '' END,
         payment_status=CASE WHEN $3::numeric>0 THEN 'paid'::quotation_payment_status ELSE 'unpaid'::quotation_payment_status END,
         profit=$3::numeric-$2::numeric
       WHERE quote_reference=$1`, ref, cost, paid, naimat, note);
  }
  await q(`UPDATE quotations SET driver_name='Amir', driver_phone='+966 53 972 8663', vehicle_plate='8775 SSA', vehicle_detail='Hyundai sedan' WHERE quote_reference='TSA-2026-0012'`);
  await q(`UPDATE quotations SET financial_status='required' WHERE status='completed' AND financial_status='n/a'`);
  await q(`UPDATE quote_ref_counters SET counter=GREATEST(counter,18) WHERE year=2026`);

  await q(`INSERT INTO clients (name, phone, email)
           SELECT DISTINCT ON (regexp_replace(customer_phone,'[^0-9+]','','g')) trim(customer_name), regexp_replace(customer_phone,'[^0-9+]','','g'), customer_email
           FROM quotations WHERE regexp_replace(customer_phone,'[^0-9+]','','g') <> ''
           ORDER BY regexp_replace(customer_phone,'[^0-9+]','','g'), created_at
           ON CONFLICT DO NOTHING`);
  await q(`UPDATE quotations qn SET client_id=c.id FROM clients c WHERE qn.client_id IS NULL AND c.phone=regexp_replace(qn.customer_phone,'[^0-9+]','','g')`);

  const out = await r(`SELECT quote_reference ref, customer_name, status, payment_status pay, trip_date::text d, quoted_price::float q, actual_amount_paid::float paid, driver_cost::float cost,
      (COALESCE(actual_amount_paid,0)-COALESCE(driver_cost,0)-extra_cost)::float margin, financial_status fs, client_id IS NOT NULL has_client FROM quotations ORDER BY quote_reference`);
  console.table(out);
  const sh = await r(`SELECT SUM((COALESCE(actual_amount_paid,0)-driver_cost-extra_cost)*partner_share_pct/100)::float s FROM quotations WHERE financial_status='confirmed'`);
  console.log("Owner share total (confirmed rides):", sh[0].s, "| clients:", (await r(`SELECT count(*)::int c FROM clients`))[0].c);
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
