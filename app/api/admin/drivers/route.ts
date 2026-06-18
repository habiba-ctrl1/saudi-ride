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

// POST /api/admin/drivers — create a driver profile for an existing user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      licenseNumber,
      licenseExpiry,
      motLicense,
      tgaCertified = false,
      ihramStatus = false,
      languages = ["en"],
      vehicleId,
    } = body as {
      userId?: string;
      licenseNumber?: string;
      licenseExpiry?: string;
      motLicense?: string;
      tgaCertified?: boolean;
      ihramStatus?: boolean;
      languages?: string[];
      vehicleId?: string;
    };

    if (!userId || !licenseNumber || !licenseExpiry) {
      return NextResponse.json(
        { error: "userId, licenseNumber, and licenseExpiry are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existing = await prisma.driver.findUnique({ where: { userId } });
    if (existing) {
      return NextResponse.json({ error: "Driver profile already exists for this user" }, { status: 409 });
    }

    // Promote user role to DRIVER
    const [driver] = await prisma.$transaction([
      prisma.driver.create({
        data: {
          userId,
          licenseNumber,
          licenseExpiry: new Date(licenseExpiry),
          motLicense: motLicense ?? null,
          tgaCertified,
          ihramStatus,
          languages,
          vehicleId: vehicleId ?? null,
        },
      }),
      prisma.user.update({ where: { id: userId }, data: { role: "DRIVER" } }),
    ]);

    return NextResponse.json({ success: true, driver }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/drivers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
