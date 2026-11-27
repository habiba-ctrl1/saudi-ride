import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { updateFollowUp, deleteFollowUp } from "@/lib/ops/followups";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  const b = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  try { await updateFollowUp(id, b); return NextResponse.json({ success: true }); }
  catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Update failed" }, { status: 400 }); }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  try { await deleteFollowUp(id); return NextResponse.json({ success: true }); }
  catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Delete failed" }, { status: 400 }); }
}
