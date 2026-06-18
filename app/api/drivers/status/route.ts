import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { id?: string; role?: string } | undefined;

    if (!sessionUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body as { status?: string };

    const validStatuses = ["AVAILABLE", "OFFLINE", "ON_TRIP"];
    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return NextResponse.json(
        { error: `Status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const driver = await prisma.driver.findFirst({
      where: { userId: sessionUser.id },
    });

    if (!driver) {
      return NextResponse.json({ error: "Driver profile not found" }, { status: 404 });
    }

    if (driver.status === "SUSPENDED") {
      return NextResponse.json(
        { error: "Suspended drivers cannot change status" },
        { status: 403 }
      );
    }

    const updated = await prisma.driver.update({
      where: { id: driver.id },
      data: { status: status.toUpperCase() as "AVAILABLE" | "OFFLINE" | "ON_TRIP" },
      select: { id: true, status: true, updatedAt: true },
    });

    return NextResponse.json({ success: true, driver: updated });
  } catch (error) {
    console.error("PATCH /api/drivers/status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
