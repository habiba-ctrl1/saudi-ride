/** Apply 0026 (lead inbox). Additive + idempotent. Run: npx tsx --env-file=.env.local scripts/ops-apply-0026-lead-inbox.ts */
import { prisma } from "../lib/prisma";
import { readFileSync } from "node:fs";
import { join } from "node:path";

async function main() {
  const sql = readFileSync(join(process.cwd(), "supabase/migrations/0026_lead_inbox.sql"), "utf8");
  for (const s of sql.split("\n").filter((l) => !l.trim().startsWith("--")).join("\n").split(";").map((x) => x.trim()).filter(Boolean)) await prisma.$executeRawUnsafe(s);
  const n = await prisma.$queryRawUnsafe<{ n: number }[]>(`SELECT count(*)::int n FROM lead_inbox`);
  console.log("0026 applied. lead_inbox rows:", n[0].n);
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
