import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { id?: string } | undefined;

    if (!sessionUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        status: true,
        review: { select: { id: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.userId !== sessionUser.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (booking.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Reviews can only be submitted for completed bookings" },
        { status: 400 }
      );
    }

    if (booking.review) {
      return NextResponse.json(
        { error: "A review for this booking already exists" },
        { status: 409 }
      );
    }

    const body = await request.json();
    const { rating, comment } = body as { rating?: number; comment?: string };

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be an integer between 1 and 5" },
        { status: 400 }
      );
    }

    if (!comment || comment.trim().length < 3) {
      return NextResponse.json(
        { error: "Comment must be at least 3 characters" },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        userId: sessionUser.id,
        bookingId: id,
        rating: Math.round(rating),
        comment: comment.trim(),
        approved: false,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        approved: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { success: true, message: "Review submitted and pending approval.", review },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/bookings/[id]/review error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
