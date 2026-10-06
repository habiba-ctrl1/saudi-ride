/**
 * Phase B: apply 0020, classify rules into categories, and recompute observed ranges from
 * ACTIVE CLIENT_OBSERVED evidence only (Naimat rate card was deactivated 2026-10-06).
 * Never touches final_approved_price / owner-entered fields. Idempotent.
 * Run: npx tsx --env-file=.env.local scripts/ops-phaseB-pricing.ts
 */
import { prisma } from "../lib/prisma";
import { readFileSync } from "node:fs";
import { join } from "node:path";
const q = (sql: string) => prisma.$executeRawUnsafe(sql);

async function main() {
  const sql = readFileSync(join(process.cwd(), "supabase/migrations/0020_pricing_rules.sql"), "utf8");
  for (const s of sql.split("\n").filter((l) => !l.trim().startsWith("--")).join("\n").split(";").map((x) => x.trim()).filter(Boolean)) await q(s);

  await q(`UPDATE route_price_approvals SET category = CASE
      WHEN cross_border THEN 'border'
      WHEN route_family LIKE 'Riyadh (local%' THEN 'riyadh'
      WHEN route_family LIKE '%(local / airport%' THEN 'airport_city'
      WHEN route_family LIKE '%Ziyarat' THEN 'ziyarat'
      ELSE 'intercity' END WHERE category IS NULL`);

  await q(`WITH e AS (
      SELECT route_family, CASE WHEN trip_type='ROUND_TRIP' THEN 'Round-trip' ELSE 'One-way' END tt,
        CASE WHEN vehicle_type='Sedan' THEN 'Sedan' WHEN vehicle_type='Staria' THEN 'Staria'
             WHEN vehicle_type IN ('SUV','GMC Yukon XL','SUV/Van') THEN 'GMC/SUV' ELSE vehicle_type END vc, price
      FROM price_book_entries WHERE route_family IS NOT NULL AND is_active AND price_kind='CLIENT_OBSERVED'),
    agg AS (SELECT a.id, min(e.price) lo, max(e.price) hi, count(e.price)::int n
      FROM route_price_approvals a LEFT JOIN e ON e.route_family=a.route_family AND e.vc=a.vehicle_category AND e.tt=a.trip_type GROUP BY a.id)
    UPDATE route_price_approvals a SET lowest_observed=agg.lo, highest_observed=agg.hi, source_count=agg.n, updated_at=now(),
      pricing_status = CASE WHEN a.pricing_status='APPROVED' THEN 'APPROVED'
        WHEN agg.n=0 THEN 'NEEDS_CONFIRMATION'
        WHEN agg.n=1 THEN 'SINGLE_SOURCE'
        WHEN agg.hi/NULLIF(agg.lo,0) >= 1.25 THEN 'CONFLICTING'
        ELSE 'MULTIPLE_SOURCES' END
    FROM agg WHERE agg.id=a.id AND (a.lowest_observed IS DISTINCT FROM agg.lo OR a.highest_observed IS DISTINCT FROM agg.hi OR a.source_count<>agg.n)`);

  const rows: any[] = await prisma.$queryRawUnsafe(`SELECT category, pricing_status, count(*)::int n FROM route_price_approvals GROUP BY 1,2 ORDER BY 1,2`);
  console.table(rows);
  const conf: any[] = await prisma.$queryRawUnsafe(`SELECT route_family, vehicle_category, trip_type, lowest_observed, highest_observed FROM route_price_approvals WHERE pricing_status='CONFLICTING'`);
  console.table(conf);
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
