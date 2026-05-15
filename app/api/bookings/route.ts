import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { bookingFormSchema } from "@/lib/validators/booking";

const bookingPayloadSchema = bookingFormSchema.extend({
  locale: z.enum(["en", "ar"])
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bookingPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid booking payload",
          issues: parsed.error.issues
        },
        { status: 400 }
      );
    }

    const bookingId = `BK-${Date.now()}`;
    const booking = parsed.data;
    const supabase = getSupabaseServerClient();

    if (supabase) {
      const tableName = process.env.SUPABASE_BOOKINGS_TABLE || "bookings";
      const { error } = await supabase.from(tableName).insert({
        booking_id: bookingId,
        pickup: booking.pickup,
        dropoff: booking.dropoff,
        travel_date: booking.travelDate,
        travel_time: booking.travelTime,
        passengers: booking.passengers,
        locale: booking.locale,
        source: "website"
      });

      if (error) {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to save booking in Supabase"
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        bookingId,
        stored: Boolean(supabase)
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to process booking" }, { status: 500 });
  }
}
