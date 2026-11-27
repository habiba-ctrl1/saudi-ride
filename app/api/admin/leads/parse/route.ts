import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { parseEnquiry } from "@/lib/ops/parse-enquiry";
import { findDuplicates } from "@/lib/ops/leads";

// POST /api/admin/leads/parse { text } — extract fields for the review form. Saves nothing.
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const b = (await request.json().catch(() => null)) as { text?: string } | null;
  const text = b?.text?.trim();
  if (!text) return NextResponse.json({ error: "Paste the enquiry text first" }, { status: 400 });
  if (text.length > 60000) return NextResponse.json({ error: "Text too long (max 60,000 characters)" }, { status: 400 });
  const result = parseEnquiry(text);
  const first = result.bookings[0];
  const duplicates = await findDuplicates(first?.customer_phone, first?.customer_email);
  return NextResponse.json({ success: true, ...result, duplicates });
}
