import { getSupabaseServerClient } from "@/lib/supabase/server";

export type AdminBookingRow = {
  id: number;
  booking_id: string;
  pickup: string;
  dropoff: string;
  travel_date: string;
  travel_time: string;
  passengers: number;
  locale: "en" | "ar" | string;
  source: string;
  created_at: string;
};

export async function getRecentBookings(limit = 50): Promise<{
  rows: AdminBookingRow[];
  error: string | null;
  configured: boolean;
}> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { rows: [], error: null, configured: false };
  }

  const tableName = process.env.SUPABASE_BOOKINGS_TABLE || "bookings";
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return { rows: [], error: error.message, configured: true };
  }

  return { rows: (data as AdminBookingRow[]) ?? [], error: null, configured: true };
}
