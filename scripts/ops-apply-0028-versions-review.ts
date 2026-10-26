/** Apply 0028 (quotation versions + review flags) and baseline a version 1 for every quotation that already has a price.
 *  Baseline = "what the record says now" (history before today was never stored, and is NOT invented).
 *  Additive + idempotent. Run: npx tsx --env-file=.env.local scripts/ops-apply-0028-versions-review.ts */
import { prisma } from "../lib/prisma";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { captureVersion } from "../lib/ops/versions";

async function main() {
  const sql = readFileSync(join(process.cwd(), "supabase/migrations/0028_versions_review.sql"), "utf8");
  for (const s of sql.split("\n").filter((l) => !l.trim().startsWith("--")).join("\n").split(/;\s*\n/).map((x) => x.trim()).filter(Boolean)) await prisma.$executeRawUnsafe(s);
  const qs = await prisma.$queryRawUnsafe<{ id: string }[]>(`SELECT id::text FROM quotations WHERE quoted_price IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quotation_versions v WHERE v.quotation_id=quotations.id)`);
  let made = 0;
  for (const q of qs) { const r = await captureVersion(q.id, "baseline", "migration 0028"); if (r?.created) made++; }
  const tot = await prisma.$queryRawUnsafe<{ n: number; q: number }[]>(`SELECT count(*)::int n, count(DISTINCT quotation_id)::int q FROM quotation_versions`);
  console.log("RES baseline versions created:", made, "| total:", tot[0]);
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
