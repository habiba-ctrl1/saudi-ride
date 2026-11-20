/** Apply 0027 (payments ledger) + verify the backfill reconciles with quotations. Additive + idempotent.
 *  Run: npx tsx --env-file=.env.local scripts/ops-apply-0027-payments.ts */
import { prisma } from "../lib/prisma";
import { readFileSync } from "node:fs";
import { join } from "node:path";

async function main() {
  const before = await prisma.$queryRawUnsafe<{ n: number; s: number }[]>(`SELECT count(*)::int n, COALESCE(SUM(actual_amount_paid),0)::float s FROM quotations WHERE actual_amount_paid > 0`);
  const sql = readFileSync(join(process.cwd(), "supabase/migrations/0027_payments.sql"), "utf8");
  for (const s of sql.split("\n").filter((l) => !l.trim().startsWith("--")).join("\n").split(/;\s*\n/).map((x) => x.trim()).filter(Boolean)) await prisma.$executeRawUnsafe(s);
  const after = await prisma.$queryRawUnsafe<{ n: number; s: number }[]>(`SELECT count(*)::int n, COALESCE(SUM(amount),0)::float s FROM payments WHERE voided_at IS NULL`);
  const mism = await prisma.$queryRawUnsafe<{ quote_reference: string; a: number; p: number }[]>(
    `SELECT q.quote_reference, q.actual_amount_paid::float a, COALESCE(SUM(p.amount),0)::float p FROM quotations q LEFT JOIN payments p ON p.quotation_id=q.id AND p.voided_at IS NULL
      WHERE q.actual_amount_paid > 0 GROUP BY q.id HAVING q.actual_amount_paid <> COALESCE(SUM(p.amount),0)`);
  const closes = await prisma.$queryRawUnsafe<{ quote_reference: string; quoted: number | null; paid: number }[]>(
    `SELECT q.quote_reference, q.quoted_price::float quoted, p.amount::float paid FROM payments p JOIN quotations q ON q.id=p.quotation_id WHERE p.closes_balance`);
  console.log("RES quotations with paid>0:", before[0], "| ledger:", after[0], "| mismatches:", mism, "| closes_balance (paid < fare, status paid):", closes);
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
