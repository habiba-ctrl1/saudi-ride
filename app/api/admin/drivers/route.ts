import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET /api/admin/drivers — list all drivers with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const language = searchParams.get("language");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "25")));
    const skip = (page - 1) * limit;

    const where: Prisma.DriverWhereInput = {
      ...(status ? { status: status.toUpperCase() as "AVAILABLE" | "ON_TRIP" | "OFFLINE" | "SUSPENDED" } : {}),
      ...(language ? { languages: { has: language.toLowerCase() } } : {}),
      ...(search
        ? {
            OR: [
              { licenseNumber: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
              { user: { name: { contains: search, mode: "insensitive" as Prisma.QueryMode } } },
              { user: { phone: { contains: search, mode: "insensitive" as Prisma.QueryMode } } },
            ],
          }
        : {}),
    };

    const [total, drivers] = await Promise.all([
      prisma.driver.count({ where }),
      prisma.driver.findMany({
        where,
        include: {
          user: { select: { name: true, email: true, phone: true, image: true, nationality: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({ success: true, total, page, limit, total_pages: Math.ceil(total / limit), drivers });
  } catch (error) {
    console.error("GET /api/admin/drivers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/drivers — add a driver.
// Friendly mode: pass name + phone and we create the User automatically.
// Advanced mode: pass an existing userId to promote that user to DRIVER.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      name,
      phone,
      email,
      licenseNumber,
      licenseExpiry,
      motLicense,
      tgaCertified = false,
      ihramStatus = false,
      languages = ["en"],
      vehicleId,
    } = body as {
      userId?: string;
      name?: string;
      phone?: string;
      email?: string;
      licenseNumber?: string;
      licenseExpiry?: string;
      motLicense?: string;
      tgaCertified?: boolean;
      ihramStatus?: boolean;
      languages?: string[];
      vehicleId?: string;
    };

    if (!licenseNumber || !licenseExpiry) {
      return NextResponse.json(
        { error: "License number and license expiry are required." },
        { status: 400 }
      );
    }
    if (!userId && !name) {
      return NextResponse.json(
        { error: "Driver name is required." },
        { status: 400 }
      );
    }

    // Guard against duplicate license / phone before we write anything.
    const dupLicense = await prisma.driver.findUnique({ where: { licenseNumber } });
    if (dupLicense) {
      return NextResponse.json({ error: "A driver with this license number already exists." }, { status: 409 });
    }
    if (phone) {
      const dupPhone = await prisma.user.findUnique({ where: { phone } });
      if (dupPhone && dupPhone.id !== userId) {
        return NextResponse.json({ error: "This phone number is already registered." }, { status: 409 });
      }
    }

    // Resolve the user: either an existing one, or create a fresh DRIVER user.
    let resolvedUserId = userId;
    if (resolvedUserId) {
      const user = await prisma.user.findUnique({ where: { id: resolvedUserId } });
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
      const existing = await prisma.driver.findUnique({ where: { userId: resolvedUserId } });
      if (existing) {
        return NextResponse.json({ error: "Driver profile already exists for this user" }, { status: 409 });
      }
    } else {
      const newUser = await prisma.user.create({
        data: { name, phone: phone ?? null, email: email ?? null, role: "DRIVER" },
      });
      resolvedUserId = newUser.id;
    }

    const [driver] = await prisma.$transaction([
      prisma.driver.create({
        data: {
          userId: resolvedUserId,
          licenseNumber,
          licenseExpiry: new Date(licenseExpiry),
          motLicense: motLicense ?? null,
          tgaCertified,
          ihramStatus,
          languages,
          vehicleId: vehicleId ?? null,
        },
      }),
      prisma.user.update({ where: { id: resolvedUserId }, data: { role: "DRIVER" } }),
    ]);

    return NextResponse.json({ success: true, driver }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/drivers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
