import { NextResponse } from "next/server";
import { loadLedger, requireVendorOrAdmin } from "@/lib/vendor/ledger";

export const dynamic = "force-dynamic";

export async function GET() {
  const a = await requireVendorOrAdmin();
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: a.status });
  return NextResponse.json({ role: a.role, ...(await loadLedger()) });
}
