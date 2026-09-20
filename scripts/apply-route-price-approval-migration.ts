/**
 * Applies supabase/migrations/0018_route_price_approval.sql against the
 * database. Additive + idempotent.
 *
 * Run:  npx tsx --env-file=.env.local scripts/apply-route-price-approval-migration.ts
 */
import { prisma } from "../lib/prisma";
import { readFileSync } from "node:fs";
import { join } from "node:path";

async function main() {
  const sql = readFileSync(
    join(process.cwd(), "supabase", "migrations", "0018_route_price_approval.sql"),
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

  const count = await prisma.routePriceApproval.count();
  console.log(`\nTables ready. route_price_approvals rows=${count}`);
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
