import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendSMS, sendEmail } from "@/lib/notifications";

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
      select: { id: true, driverId: true, status: true, customerPhone: true, customerEmail: true, bookingRef: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }
    if (booking.driverId !== driver.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (booking.status !== "IN_PROGRESS") {
      return NextResponse.json({ error: "Only in-progress trips can be completed" }, { status: 400 });
    }

    const [updated] = await prisma.$transaction([
      prisma.booking.update({
        where: { id },
        data: { status: "COMPLETED", completedAt: new Date() },
        select: { id: true, bookingRef: true, status: true, completedAt: true },
      }),
      prisma.driver.update({
        where: { id: driver.id },
        data: { status: "AVAILABLE", totalTrips: { increment: 1 } },
      }),
    ]);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://saudi-ride.vercel.app";

    await Promise.allSettled([
      sendSMS(
        booking.customerPhone,
        `Your Taxi Saudi Arabia trip ${booking.bookingRef} is complete. Rate your experience: ${siteUrl}/track-booking?ref=${booking.bookingRef}`
      ),
      booking.customerEmail
        ? sendEmail(
            booking.customerEmail,
            `Trip Completed — ${booking.bookingRef}`,
            `<p>Your trip <strong>${booking.bookingRef}</strong> has been completed. Thank you for riding with Riyadh Luxe Taxi.</p>
             <p><a href="${siteUrl}/track-booking?ref=${booking.bookingRef}">Leave a review</a></p>`
          )
        : Promise.resolve(),
    ]);

    return NextResponse.json({ success: true, trip: updated });
  } catch (error) {
    console.error("PATCH /api/drivers/trips/[id]/complete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
