import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { id?: string } | undefined;

    if (!sessionUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const driver = await prisma.driver.findFirst({ where: { userId: sessionUser.id } });
    if (!driver) {
      return NextResponse.json({ error: "Driver profile not found" }, { status: 404 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      select: { id: true, driverId: true, status: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }
    if (booking.driverId !== driver.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (booking.status !== "DRIVER_ASSIGNED" && booking.status !== "CONFIRMED") {
      return NextResponse.json({ error: "Trip cannot be started from its current status" }, { status: 400 });
    }

    const [updated] = await prisma.$transaction([
      prisma.booking.update({
        where: { id },
        data: { status: "IN_PROGRESS" },
        select: { id: true, bookingRef: true, status: true },
      }),
      prisma.driver.update({
        where: { id: driver.id },
        data: { status: "ON_TRIP" },
      }),
    ]);

    return NextResponse.json({ success: true, trip: updated });
  } catch (error) {
    console.error("PATCH /api/drivers/trips/[id]/start error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
