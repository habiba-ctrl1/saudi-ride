import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

// GET /api/admin/route-price-approvals — list route-level price approval rows
export async function GET() {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const rows = await prisma.routePriceApproval.findMany({
      orderBy: [{ routeFamily: "asc" }, { tripType: "asc" }, { vehicleCategory: "asc" }],
    });

    return NextResponse.json({ success: true, total: rows.length, rows });
  } catch (error) {
    console.error("GET /api/admin/route-price-approvals error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
