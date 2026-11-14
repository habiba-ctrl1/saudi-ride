import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { prisma } from "@/lib/prisma";

// POST /api/admin/receipts/mark-sent { ids: string[], channels: ("whatsapp"|"email")[] }
// Records that the operator ALREADY sent the receipt themselves, outside the system (we cannot see WhatsApp or the personal mailbox).
// These are operator-attested records: email is stored as channel "email_manual" so it is never confused with a provider-confirmed send.
// Idempotent: a ride/channel that already has a sent log is skipped. Only completed + paid rides are accepted. Nothing is sent to anyone.
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const b = (await request.json().catch(() => ({}))) as { ids?: unknown; channels?: unknown };
  const ids = Array.isArray(b.ids) ? b.ids.filter((x): x is string => typeof x === "string" && /^[0-9a-f-]{36}$/i.test(x)) : [];
  const channels = Array.isArray(b.channels) ? b.channels.filter((c): c is "whatsapp" | "email" => c === "whatsapp" || c === "email") : [];
  if (ids.length === 0 || ids.length > 200) return NextResponse.json({ error: "Select between 1 and 200 rides" }, { status: 400 });
  if (channels.length === 0) return NextResponse.json({ error: "Choose WhatsApp, Email or both" }, { status: 400 });

  const rides = await prisma.$queryRawUnsafe<{ id: string; customer_phone: string; customer_email: string | null }[]>(
    `SELECT id::text, customer_phone, customer_email FROM quotations
      WHERE id = ANY($1::uuid[]) AND NOT is_test AND status='completed' AND payment_status='paid'`, ids);

  let added = 0, skipped = 0;
  for (const r of rides) {
    for (const ch of channels) {
      const logChannel = ch === "whatsapp" ? "whatsapp" : "email_manual";
      const exists = await prisma.$queryRawUnsafe<{ n: number }[]>(
        `SELECT count(*)::int n FROM communication_log WHERE quotation_id=$1::uuid AND template='receipt' AND status='sent' AND channel = ANY($2::text[])`,
        r.id, ch === "whatsapp" ? ["whatsapp"] : ["email", "email_manual"]);
      if (exists[0].n > 0) { skipped++; continue; }
      await prisma.$executeRawUnsafe(
        `INSERT INTO communication_log (quotation_id, channel, template, recipient, subject, status) VALUES ($1::uuid,$2,'receipt',$3,$4,'sent')`,
        r.id, logChannel, ch === "whatsapp" ? r.customer_phone : r.customer_email, `Marked as already sent manually on ${ch === "whatsapp" ? "WhatsApp" : "email"} by ${auth.email}`);
      added++;
    }
    await prisma.$executeRawUnsafe(`UPDATE quotations SET receipt_sent_at = COALESCE(receipt_sent_at, now()) WHERE id=$1::uuid`, r.id);
  }
  return NextResponse.json({ success: true, rides: rides.length, added, skipped, ignored: ids.length - rides.length });
}
