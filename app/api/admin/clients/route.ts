import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { searchClients } from "@/lib/ops/quotations";

// GET /api/admin/clients?q= — client picker for the quotation form
export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const q = new URL(request.url).searchParams.get("q") ?? "";
  return NextResponse.json({ success: true, clients: await searchClients(q) });
}
