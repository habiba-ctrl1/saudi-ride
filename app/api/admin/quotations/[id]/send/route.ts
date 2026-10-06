import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { sendOpsEmail } from "@/lib/ops/comms";
import { OPS_TEMPLATE_LABEL, type OpsTemplate } from "@/lib/email/ops-templates";

export const runtime = "nodejs";

// POST /api/admin/quotations/[id]/send { template } — the ONLY way a client email goes out from the ops workflow.
// Operator-triggered; BCCs the internal record address; the outcome (sent / failed + error) is logged.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  const { template } = (await request.json().catch(() => ({}))) as { template?: OpsTemplate };
  if (!template || !(template in OPS_TEMPLATE_LABEL)) return NextResponse.json({ error: "Unknown template" }, { status: 400 });
  const res = await sendOpsEmail(id, template);
  if (!res.ok) return NextResponse.json({ success: false, error: res.error }, { status: 502 });
  return NextResponse.json({ success: true, recipient: res.recipient, bcc: res.bcc });
}
