import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateDriverStatus, type DriverStatus } from "@/lib/supabase/drivers";

const STATUSES: DriverStatus[] = ["pending", "approved", "rejected", "suspended", "blacklisted"];

// Admin: approve/reject/suspend a driver application (audit-logged RPC)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { role?: string; email?: string } | undefined;
  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const status = body.status as DriverStatus;
  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { row, error } = await updateDriverStatus(id, status, user.email ?? "admin", body.reason ? String(body.reason) : undefined);

  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ success: true, row });
}
