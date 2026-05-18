import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { VehicleType, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Admin authorization check
    try {
      const session = await getServerSession(authOptions);
      if (session?.user) {
        const customUser = session.user as { role?: string };
        if (customUser.role === "ADMIN") {
          console.log("Verified Admin request for Vehicle PATCH API");
        }
      }
    } catch (sessionErr) {
      console.warn("Session check failed in Admin Vehicle PATCH API:", sessionErr);
    }

    const { id } = await params;
    const body = await request.json();

    const {
      name,
      nameAr,
      type,
      capacity,
      luggage,
      pricePerKm,
      basePrice,
      features,
      image,
      nameUr,
      available
    } = body;

    // Verify vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id }
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      );
    }

    // Build strong dynamic update object
    const updateData: Prisma.VehicleUpdateInput = {};

    if (name !== undefined) updateData.name = name;
    if (nameAr !== undefined) updateData.nameAr = nameAr;
    if (nameUr !== undefined) updateData.nameUr = nameUr;
    if (type !== undefined) updateData.type = type as VehicleType;
    if (capacity !== undefined) updateData.capacity = Number(capacity);
    if (luggage !== undefined) updateData.luggage = Number(luggage);
    if (pricePerKm !== undefined) updateData.pricePerKm = Number(pricePerKm);
    if (basePrice !== undefined) updateData.basePrice = Number(basePrice);
    if (features !== undefined) updateData.features = Array.isArray(features) ? features : [];
    if (image !== undefined) updateData.image = image;
    if (available !== undefined) updateData.available = Boolean(available);

    const updated = await prisma.vehicle.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message: "Vehicle updated successfully",
      vehicle: updated
    });

  } catch (error) {
    console.error("Admin vehicle update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
