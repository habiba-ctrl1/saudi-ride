/**
 * Applies supabase/migrations/0010_phase1a_leads_and_notification_failures.sql
 * against the database. Additive + idempotent (CREATE TABLE IF NOT EXISTS).
 *
 * Run:  npx tsx --env-file=.env.local scripts/apply-phase1a-migration.ts
 */
import { prisma } from "../lib/prisma";
import { readFileSync } from "node:fs";
import { join } from "node:path";

async function main() {
  const sql = readFileSync(
    join(process.cwd(), "supabase", "migrations", "0010_phase1a_leads_and_notification_failures.sql"),
    "utf8",
  );
  // Strip full-line SQL comments first, THEN split on statement boundaries
  // (a leading comment must not swallow the statement that follows it).
  const statements = sql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    await prisma.$executeRawUnsafe(stmt);
    console.log("✓", stmt.split("\n")[0].slice(0, 70));
  }

  const [leads, fails] = await Promise.all([prisma.lead.count(), prisma.notificationFailure.count()]);
  console.log(`\nTables ready. leads rows=${leads}, notification_failures rows=${fails}`);
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
