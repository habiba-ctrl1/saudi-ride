import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { scanForReview } from "@/lib/ops/review";

// POST — look for records whose status the data cannot prove. Only raises flags; never edits a booking.
export async function POST() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    return NextResponse.json({ success: true, ...(await scanForReview()) });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Scan failed" }, { status: 500 });
  }
}
