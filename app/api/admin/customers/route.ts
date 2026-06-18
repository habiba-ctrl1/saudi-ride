import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const nationality = searchParams.get("nationality");
    const lang = searchParams.get("lang");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "25")));
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      role: "CUSTOMER",
      ...(nationality ? { nationality: { equals: nationality, mode: "insensitive" as Prisma.QueryMode } } : {}),
      ...(lang ? { preferredLang: lang.toUpperCase() as "EN" | "AR" | "UR" } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
              { email: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
              { phone: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
            ],
          }
        : {}),
    };

    const [total, customers] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          nationality: true,
          preferredLang: true,
          loyaltyPoints: true,
          createdAt: true,
          _count: { select: { bookings: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({ success: true, total, page, limit, total_pages: Math.ceil(total / limit), customers });
  } catch (error) {
    console.error("GET /api/admin/customers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
