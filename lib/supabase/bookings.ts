import { db } from "@/lib/db";

export type AdminBookingRow = {
  id: string;
  booking_id: string;
  pickup: string;
  dropoff: string;
  travel_date: string;
  travel_time: string;
  passengers: number;
  locale: "en" | "ar" | string;
  source: string;
  created_at: string;
  status: string;
};

export async function getRecentBookings(limit = 50): Promise<{
  rows: AdminBookingRow[];
  error: string | null;
  configured: boolean;
}> {
  try {
    const bookings = await db.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const rows: AdminBookingRow[] = bookings.map((b) => ({
      id: b.id,
      booking_id: b.bookingRef,
      pickup: b.pickupLocation,
      dropoff: b.dropoffLocation,
      travel_date: b.pickupDateTime.toISOString().split("T")[0],
      travel_time: b.pickupDateTime.toISOString().split("T")[1].slice(0, 5),
      passengers: b.passengers,
      locale: "en",
      source: "website",
      created_at: b.createdAt.toISOString(),
      status: b.status,
    }));

    return { rows, error: null, configured: true };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return { 
      rows: [], 
      error: error instanceof Error ? error.message : "An unknown error occurred", 
      configured: true 
    };
  }
}

