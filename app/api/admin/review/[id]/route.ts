import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { resolveFlag } from "@/lib/ops/review";

// PATCH { resolution } — record the operator's decision on a flag. Status changes (complete/cancel) are separate, explicit calls.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const b = (await request.json().catch(() => null)) as { resolution?: string } | null;
  try {
    await resolveFlag(id, b?.resolution ?? "", auth.email);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not resolve" }, { status: 400 });
  }
}
