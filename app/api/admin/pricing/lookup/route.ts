import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { lookupPricing } from "@/lib/pricing/lookup";

// GET /api/admin/pricing/lookup?pickup=&drop=&vehicle=sedan|suv|van&tripType=one_way|round_trip
// Read-only. Returns the Pricing Book match (range / recommended / min / cost / margin) or an
// honest "no rule" state. Never sends or applies a price by itself.
export async function GET(request: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const sp = new URL(request.url).searchParams;
    const pickup = sp.get("pickup")?.trim() ?? "";
    const drop = sp.get("drop")?.trim() ?? "";
    if (!pickup || !drop) return NextResponse.json({ error: "pickup and drop are required" }, { status: 400 });
    const result = await lookupPricing({ pickup, drop, vehicle: sp.get("vehicle"), tripType: sp.get("tripType") });
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("GET /api/admin/pricing/lookup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
