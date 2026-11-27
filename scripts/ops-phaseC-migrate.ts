/**
 * Phase C: apply 0021 and backfill quote_stage from existing status (no data guessed):
 *   new → draft · quoted → sent (sent_via left NULL: channel unknown) · confirmed/assigned/completed → accepted · cancelled → rejected
 * Idempotent (only touches rows still at the 'draft' default that need a different stage).
 * Run: npx tsx --env-file=.env.local scripts/ops-phaseC-migrate.ts
 */
import { prisma } from "../lib/prisma";
import { readFileSync } from "node:fs";
import { join } from "node:path";
const q = (sql: string) => prisma.$executeRawUnsafe(sql);

async function main() {
  const sql = readFileSync(join(process.cwd(), "supabase/migrations/0021_quotation_workflow.sql"), "utf8");
  for (const s of sql.split("\n").filter((l) => !l.trim().startsWith("--")).join("\n").split(";").map((x) => x.trim()).filter(Boolean)) await q(s);
  await q(`UPDATE quotations SET quote_stage = CASE status::text
      WHEN 'quoted' THEN 'sent' WHEN 'confirmed' THEN 'accepted' WHEN 'assigned' THEN 'accepted'
      WHEN 'completed' THEN 'accepted' WHEN 'cancelled' THEN 'rejected' ELSE 'draft' END
    WHERE quote_stage='draft' AND status::text <> 'new'`);
  console.table(await prisma.$queryRawUnsafe(`SELECT quote_stage, status::text status, count(*)::int n FROM quotations GROUP BY 1,2 ORDER BY 1,2`));
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
