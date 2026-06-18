import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/reviews — list all reviews with approval filter
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const approved = searchParams.get("approved");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "25")));
    const skip = (page - 1) * limit;

    const where = {
      ...(approved !== null ? { approved: approved === "true" } : {}),
    };

    const [total, reviews] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        include: {
          user: { select: { name: true, email: true, phone: true } },
          booking: { select: { bookingRef: true, pickupLocation: true, dropoffLocation: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({ success: true, total, page, limit, total_pages: Math.ceil(total / limit), reviews });
  } catch (error) {
    console.error("GET /api/admin/reviews error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/admin/reviews — approve or reject a review
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, approved } = body as { id?: string; approved?: boolean };

    if (!id || approved === undefined) {
      return NextResponse.json({ error: "id and approved (boolean) are required" }, { status: 400 });
    }

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { approved },
      select: { id: true, approved: true, rating: true, comment: true },
    });

    return NextResponse.json({ success: true, review: updated });
  } catch (error) {
    console.error("PATCH /api/admin/reviews error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
