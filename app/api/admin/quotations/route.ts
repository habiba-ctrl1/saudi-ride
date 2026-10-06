import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createOpsQuotation, type NewQuotationInput } from "@/lib/ops/quotations";

// POST /api/admin/quotations — create a quotation as Draft or Ready. Never emails or messages the client.
export async function POST(request: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const b = (await request.json().catch(() => null)) as Partial<NewQuotationInput> | null;
    if (!b) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    for (const f of ["customer_name", "customer_phone", "pickup_location", "drop_location", "trip_date"] as const) {
      if (!b[f] || !String(b[f]).trim()) return NextResponse.json({ error: `${f} is required` }, { status: 400 });
    }
    const num = (v: unknown) => (v === undefined || v === null || v === "" ? null : Number(v));
    const price = num(b.quoted_price), est = num(b.est_driver_cost), pax = num(b.passengers_count);
    for (const n of [price, est, pax]) if (n !== null && (!Number.isFinite(n) || n < 0)) return NextResponse.json({ error: "Invalid number" }, { status: 400 });

    const created = await createOpsQuotation({
      ...(b as NewQuotationInput),
      trip_type: b.trip_type || "one_way",
      quoted_price: price, est_driver_cost: est, passengers_count: pax,
      stage: b.stage === "ready" ? "ready" : "draft",
    });
    return NextResponse.json({ success: true, ...created });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not create quotation" }, { status: 400 });
  }
}
