import { getSupabaseServerClient } from "./server";
import type { DriverVehicleType } from "./drivers";

export type QuotationStatus = "new" | "quoted" | "confirmed" | "assigned" | "completed" | "cancelled";
export type QuotationPaymentStatus = "unpaid" | "partial" | "paid";
export type TripType = "one_way" | "round_trip" | "event" | "multi_day" | "airport_transfer" | "hourly";
export type LeadSource = "website" | "whatsapp" | "referral" | "event_management";

export type QuotationRow = {
  id: string;
  quote_reference: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  pickup_location: string;
  drop_location: string;
  trip_type: TripType;
  trip_date: string;
  trip_time: string | null;
  return_date: string | null;
  passengers_count: number | null;
  luggage_notes: string | null;
  vehicle_type_requested: DriverVehicleType | null;
  quoted_price: number | null;
  currency: string;
  price_notes: string | null;
  status: QuotationStatus;
  assigned_driver_id: string | null;
  payment_status: QuotationPaymentStatus;
  source: LeadSource;
  followup_flagged: boolean;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  confirmed_at: string | null;
};

export type QuotationFilters = {
  status?: QuotationStatus;
  tripType?: TripType;
  dateFrom?: string;        // trip_date >= (YYYY-MM-DD)
  dateTo?: string;          // trip_date <=
  paymentStatus?: QuotationPaymentStatus;
  source?: LeadSource;
  search?: string;          // customer name / phone / quote_reference
  sort?: "newest" | "oldest";
  page?: number;
  limit?: number;
};

export async function listQuotations(filters: QuotationFilters = {}) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { rows: [] as QuotationRow[], total: 0, error: "Supabase not configured" };

  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, filters.limit ?? 25);

  let q = supabase.from("quotations").select("*", { count: "exact" });

  if (filters.status) q = q.eq("status", filters.status);
  if (filters.tripType) q = q.eq("trip_type", filters.tripType);
  if (filters.paymentStatus) q = q.eq("payment_status", filters.paymentStatus);
  if (filters.source) q = q.eq("source", filters.source);
  if (filters.dateFrom) q = q.gte("trip_date", filters.dateFrom);
  if (filters.dateTo) q = q.lte("trip_date", filters.dateTo);
  if (filters.search) {
    const s = filters.search.replace(/[%,()]/g, "");
    q = q.or(`customer_name.ilike.%${s}%,customer_phone.ilike.%${s}%,quote_reference.ilike.%${s}%`);
  }

  // needs-follow-up rows always float to the top
  q = q
    .order("followup_flagged", { ascending: false })
    .order("created_at", { ascending: filters.sort === "oldest" });

  const { data, count, error } = await q.range((page - 1) * limit, page * limit - 1);
  return { rows: (data ?? []) as QuotationRow[], total: count ?? 0, error: error?.message ?? null };
}

/** Status change through the audit-logged RPC. Triggers enforce double-booking
 *  checks (confirmed/assigned) and bump total_trips_completed on 'completed'. */
export async function updateQuotationStatus(
  id: string,
  status: QuotationStatus,
  adminId: string,
  opts: { driverId?: string; quotedPrice?: number } = {}
) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { row: null, error: "Supabase not configured" };
  const { data, error } = await supabase.rpc("admin_update_quotation_status", {
    p_id: id, p_status: status, p_admin: adminId,
    p_driver: opts.driverId ?? null, p_price: opts.quotedPrice ?? null,
  });
  return { row: (data ?? null) as QuotationRow | null, error: error?.message ?? null };
}

export type DashboardSummary = {
  pending_driver_approvals: number;
  new_quotations: number;
  expiring_documents: number;
  todays_confirmed_trips: number;
  needs_followup: number;
};

export async function getDashboardSummary() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { summary: null, error: "Supabase not configured" };
  const { data, error } = await supabase.from("admin_dashboard_summary").select("*").single();
  return { summary: (data ?? null) as DashboardSummary | null, error: error?.message ?? null };
}
