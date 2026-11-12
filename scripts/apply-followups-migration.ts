/** Applies supabase/migrations/0032_quote_followups.sql. Additive + idempotent.
 *  Run: npx tsx --env-file=.env.local scripts/apply-followups-migration.ts */
import { prisma } from "../lib/prisma";
import { readFileSync } from "node:fs";
import { join } from "node:path";

async function main() {
  const sql = readFileSync(join(process.cwd(), "supabase", "migrations", "0032_quote_followups.sql"), "utf8");
  const statements = sql.split("\n").filter((l) => !l.trim().startsWith("--")).join("\n").split(";").map((s) => s.trim()).filter(Boolean);
  for (const stmt of statements) { await prisma.$executeRawUnsafe(stmt); console.log("ok:", stmt.split("\n")[0].slice(0, 70)); }
}
main().catch((e) => { console.error("Migration failed:", e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
