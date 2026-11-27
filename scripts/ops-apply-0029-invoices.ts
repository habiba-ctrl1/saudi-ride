/** Apply 0029 (invoices). Additive + idempotent. Run: npx tsx --env-file=.env.local scripts/ops-apply-0029-invoices.ts */
import { prisma } from "../lib/prisma";
import { readFileSync } from "node:fs";
import { join } from "node:path";

async function main() {
  const sql = readFileSync(join(process.cwd(), "supabase/migrations/0029_invoices.sql"), "utf8");
  for (const s of sql.split("\n").filter((l) => !l.trim().startsWith("--")).join("\n").split(/;\s*\n/).map((x) => x.trim()).filter(Boolean)) await prisma.$executeRawUnsafe(s);
  console.log("RES 0029 applied; invoices:", (await prisma.$queryRawUnsafe<{ n: number }[]>(`SELECT count(*)::int n FROM invoices`))[0].n);
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
