/** Phase E: apply 0023 (booking_events). Idempotent. Run: npx tsx --env-file=.env.local scripts/ops-phaseE-migrate.ts */
import { prisma } from "../lib/prisma";
import { readFileSync } from "node:fs";
import { join } from "node:path";

async function main() {
  const sql = readFileSync(join(process.cwd(), "supabase/migrations/0023_booking_events.sql"), "utf8");
  for (const s of sql.split("\n").filter((l) => !l.trim().startsWith("--")).join("\n").split(";").map((x) => x.trim()).filter(Boolean)) await prisma.$executeRawUnsafe(s);
  console.log("0023 applied; booking_events rows:", (await prisma.$queryRawUnsafe<{ n: number }[]>(`SELECT count(*)::int n FROM booking_events`))[0].n);
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
