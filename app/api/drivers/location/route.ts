import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { id?: string } | undefined;

    if (!sessionUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { lat, lng } = body as { lat?: number; lng?: number };

    if (lat === undefined || lng === undefined) {
      return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
    }

    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }

    const driver = await prisma.driver.findFirst({
      where: { userId: sessionUser.id },
    });

    if (!driver) {
      return NextResponse.json({ error: "Driver profile not found" }, { status: 404 });
    }

    await prisma.driver.update({
      where: { id: driver.id },
      data: { currentLat: lat, currentLng: lng, updatedAt: new Date() },
    });

    return NextResponse.json({ success: true, location: { lat, lng } });
  } catch (error) {
    console.error("PATCH /api/drivers/location error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
