import { getSupabaseAnonClient, getSupabaseServerClient } from "./server";
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

export type NewQuotationInput = {
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  pickup_location: string;
  drop_location: string;
  trip_type?: TripType;
  trip_date: string;            // YYYY-MM-DD
  trip_time?: string | null;    // HH:MM
  return_date?: string | null;
  passengers_count?: number | null;
  luggage_notes?: string | null;
  vehicle_type_requested?: DriverVehicleType | null;
  source?: LeadSource;
};

/** Public quotation request — security-definer RPC (0009). Anon key cannot
 *  SELECT rows back, so the RPC inserts (forced status='new', source='website')
 *  and returns only the id + TSA-YYYY-NNNN quote_reference. */
export async function createQuotation(input: NewQuotationInput) {
  const supabase = getSupabaseAnonClient();
  if (!supabase) return { row: null, error: "Supabase not configured" };

  const { data, error } = await supabase
    .rpc("request_quotation", {
      p_customer_name: input.customer_name,
      p_customer_phone: input.customer_phone,
      p_customer_email: input.customer_email ?? null,
      p_pickup: input.pickup_location,
      p_drop: input.drop_location,
      p_trip_type: input.trip_type ?? "one_way",
      p_trip_date: input.trip_date,
      p_trip_time: input.trip_time ?? null,
      p_return_date: input.return_date ?? null,
      p_passengers: input.passengers_count ?? null,
      p_luggage_notes: input.luggage_notes ?? null,
      p_vehicle_type: input.vehicle_type_requested ?? null,
    })
    .single();

  return { row: data as Pick<QuotationRow, "id" | "quote_reference"> | null, error: error?.message ?? null };
}

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

export type QuotationDetailsInput = Partial<{
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
  admin_notes: string | null;
  followup_flagged: boolean;
}>;

/** Edit customer/trip details through the audit-logged, lock-enforcing RPC
 *  (0010). Locked once status is completed/cancelled — only admin_notes and
 *  followup_flagged are still accepted then; the RPC raises otherwise. */
export async function updateQuotationDetails(id: string, adminId: string, details: QuotationDetailsInput) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { row: null, error: "Supabase not configured" };
  const { data, error } = await supabase.rpc("admin_update_quotation_details", {
    p_id: id,
    p_admin: adminId,
    p_customer_name: details.customer_name ?? null,
    p_customer_phone: details.customer_phone ?? null,
    p_customer_email: details.customer_email ?? null,
    p_pickup: details.pickup_location ?? null,
    p_drop: details.drop_location ?? null,
    p_trip_type: details.trip_type ?? null,
    p_trip_date: details.trip_date ?? null,
    p_trip_time: details.trip_time ?? null,
    p_return_date: details.return_date ?? null,
    p_passengers: details.passengers_count ?? null,
    p_luggage_notes: details.luggage_notes ?? null,
    p_vehicle_type: details.vehicle_type_requested ?? null,
    p_admin_notes: details.admin_notes ?? null,
    p_followup_flagged: details.followup_flagged ?? null,
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
