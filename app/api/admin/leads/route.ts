import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createLead, findDuplicates, type NewLeadInput } from "@/lib/ops/leads";

// POST /api/admin/leads — create one or several leads (manual entry or reviewed paste). Body: { leads: NewLeadInput[], group?: boolean }
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const b = (await request.json().catch(() => null)) as { leads?: NewLeadInput[]; group?: boolean } | null;
  if (!b?.leads?.length || b.leads.length > 20) return NextResponse.json({ error: "Provide 1–20 leads" }, { status: 400 });
  const groupKey = b.group && b.leads.length > 1 ? `grp-${Date.now().toString(36)}` : null;
  const created: { id: string; reference: string }[] = [];
  try {
    for (const l of b.leads) created.push(await createLead({ ...l, group_key: groupKey }, auth.email));
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not save lead", created }, { status: 400 });
  }
  const first = b.leads[0];
  const duplicates = await findDuplicates(first.customer_phone, first.customer_email, created[0]?.id);
  return NextResponse.json({ success: true, created, duplicates });
}
