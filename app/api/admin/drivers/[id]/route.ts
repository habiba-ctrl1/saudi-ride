import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/admin/drivers/[id] — update driver details
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const driver = await prisma.driver.findUnique({ where: { id } });
    if (!driver) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 });
    }

    const {
      licenseNumber,
      licenseExpiry,
      motLicense,
      tgaCertified,
      ihramStatus,
      languages,
      vehicleId,
      status,
    } = body as {
      licenseNumber?: string;
      licenseExpiry?: string;
      motLicense?: string;
      tgaCertified?: boolean;
      ihramStatus?: boolean;
      languages?: string[];
      vehicleId?: string;
      status?: string;
    };

    const updated = await prisma.driver.update({
      where: { id },
      data: {
        ...(licenseNumber !== undefined ? { licenseNumber } : {}),
        ...(licenseExpiry !== undefined ? { licenseExpiry: new Date(licenseExpiry) } : {}),
        ...(motLicense !== undefined ? { motLicense } : {}),
        ...(tgaCertified !== undefined ? { tgaCertified } : {}),
        ...(ihramStatus !== undefined ? { ihramStatus } : {}),
        ...(languages !== undefined ? { languages } : {}),
        ...(vehicleId !== undefined ? { vehicleId } : {}),
        ...(status !== undefined ? { status: status.toUpperCase() as "AVAILABLE" | "ON_TRIP" | "OFFLINE" | "SUSPENDED" } : {}),
      },
    });

    return NextResponse.json({ success: true, driver: updated });
  } catch (error) {
    console.error("PATCH /api/admin/drivers/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/drivers/[id] — suspend (soft-delete) a driver
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const driver = await prisma.driver.findUnique({ where: { id } });
    if (!driver) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 });
    }

    await prisma.driver.update({
      where: { id },
      data: { status: "SUSPENDED" },
    });

    return NextResponse.json({ success: true, message: "Driver suspended successfully" });
  } catch (error) {
    console.error("DELETE /api/admin/drivers/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
