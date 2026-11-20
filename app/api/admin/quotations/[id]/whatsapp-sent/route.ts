import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { recordWhatsAppSent } from "@/lib/ops/comms";
import { OPS_TEMPLATE_LABEL, type OpsTemplate } from "@/lib/email/ops-templates";

// POST /api/admin/quotations/[id]/whatsapp-sent { template } — operator sent it manually on WhatsApp; record it.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  const { template } = (await request.json().catch(() => ({}))) as { template?: OpsTemplate };
  if (!template || !(template in OPS_TEMPLATE_LABEL)) return NextResponse.json({ error: "Unknown template" }, { status: 400 });
  const res = await recordWhatsAppSent(id, template);
  if (!res.ok) return NextResponse.json({ error: res.error }, { status: 400 });
  return NextResponse.json({ success: true });
}
