import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createFollowUp, type NewFollowUp } from "@/lib/ops/followups";

// POST /api/admin/follow-ups — track a customer who has been given a price.
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const b = (await request.json().catch(() => null)) as NewFollowUp | null;
  if (!b) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  try {
    const id = await createFollowUp(b);
    return NextResponse.json({ success: true, id });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not save" }, { status: 400 });
  }
}
