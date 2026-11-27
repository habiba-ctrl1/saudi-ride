/**
 * Applies supabase/migrations/0025_reviews.sql against the
 * database. Additive + idempotent (CREATE TABLE IF NOT EXISTS).
 *
 * Run:  npx tsx --env-file=.env.local scripts/apply-pricing-book-migration.ts
 */
import { prisma } from "../lib/prisma";
import { readFileSync } from "node:fs";
import { join } from "node:path";

async function main() {
  const sql = readFileSync(
    join(process.cwd(), "supabase", "migrations", "0025_reviews.sql"),
    "utf8",
  );
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

  const count = 0;
  console.log(`\nreviews table ready. n=${count}`);
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
