import { getSupabaseAnonClient, getSupabaseServerClient } from "./server";

export type DriverStatus = "pending" | "approved" | "rejected" | "suspended" | "blacklisted";
export type DriverVehicleType = "sedan" | "suv" | "van" | "bus" | "limousine";

export type DriverRow = {
  id: string;
  full_name: string;
  phone: string;
  whatsapp_number: string | null;
  city: string;
  coverage_areas: string[];
  vehicle_type: DriverVehicleType;
  vehicle_model: string | null;
  vehicle_year: number | null;
  vehicle_plate_number: string | null;
  license_number: string;
  license_expiry_date: string | null;
  iqama_number: string;
  iqama_expiry_date: string | null;
  istimara_number: string | null;
  istimara_expiry_date: string | null;
  insurance_expiry_date: string | null;
  years_experience: number | null;
  languages_spoken: string[];
  availability: "full_time" | "part_time";
  availability_days: string[];
  availability_hours: string | null;
  profile_photo_url: string | null;
  license_doc_url: string | null;
  iqama_doc_url: string | null;
  istimara_doc_url: string | null;
  status: DriverStatus;
  suspension_reason: string | null;
  expiring_soon: boolean;
  rating: number | null;
  total_trips_completed: number;
  terms_accepted: boolean;
  terms_accepted_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  approved_by: string | null;
};

export type DriverFilters = {
  status?: DriverStatus;
  city?: string;            // matches home city OR coverage_areas
  vehicleType?: DriverVehicleType;
  expiringDocs?: boolean;   // docs expiring within 30 days
  sortByRating?: "highest" | "lowest";
  search?: string;          // name / phone / iqama number
  page?: number;
  limit?: number;
};

export type DriverRegistrationInput = {
  full_name: string;
  phone: string;
  whatsapp_number?: string | null;
  city: string;
  vehicle_type: DriverVehicleType;
  vehicle_model?: string | null;
  license_number: string;
  iqama_number: string;
  years_experience?: number | null;
};

/** Public driver application — security-definer RPC (0009). Inserts with
 *  forced status='pending' + terms_accepted=true and returns only the id. */
export async function registerDriver(input: DriverRegistrationInput) {
  const supabase = getSupabaseAnonClient();
  if (!supabase) return { row: null, error: "Supabase not configured" };

  const { data, error } = await supabase
    .rpc("register_driver_application", {
      p_full_name: input.full_name,
      p_phone: input.phone,
      p_whatsapp: input.whatsapp_number ?? null,
      p_city: input.city,
      p_vehicle_type: input.vehicle_type,
      p_vehicle_model: input.vehicle_model ?? null,
      p_license_number: input.license_number,
      p_iqama_number: input.iqama_number,
      p_years_experience: input.years_experience ?? null,
    })
    .single();

  return { row: data as Pick<DriverRow, "id"> | null, error: error?.message ?? null };
}

export async function listDrivers(filters: DriverFilters = {}) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { rows: [] as DriverRow[], total: 0, error: "Supabase not configured" };

  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, filters.limit ?? 25);

  let q = supabase.from("drivers").select("*", { count: "exact" });

  if (filters.status) q = q.eq("status", filters.status);
  if (filters.vehicleType) q = q.eq("vehicle_type", filters.vehicleType);
  if (filters.expiringDocs) q = q.eq("expiring_soon", true);
  if (filters.city) q = q.or(`city.ilike.%${filters.city}%,coverage_areas.cs.{${filters.city}}`);
  if (filters.search) {
    const s = filters.search.replace(/[%,()]/g, "");
    q = q.or(`full_name.ilike.%${s}%,phone.ilike.%${s}%,iqama_number.ilike.%${s}%`);
  }

  q = filters.sortByRating
    ? q.order("rating", { ascending: filters.sortByRating === "lowest", nullsFirst: filters.sortByRating === "lowest" })
    : q.order("created_at", { ascending: false });

  const { data, count, error } = await q.range((page - 1) * limit, page * limit - 1);
  return { rows: (data ?? []) as DriverRow[], total: count ?? 0, error: error?.message ?? null };
}

/** Status change through the audit-logged RPC (records adminId in audit_logs). */
export async function updateDriverStatus(id: string, status: DriverStatus, adminId: string, reason?: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { row: null, error: "Supabase not configured" };
  const { data, error } = await supabase.rpc("admin_update_driver_status", {
    p_id: id, p_status: status, p_admin: adminId, p_reason: reason ?? null,
  });
  return { row: (data ?? null) as DriverRow | null, error: error?.message ?? null };
}

/** Admin enters a 1-5 rating after a completed trip; driver's average auto-updates via trigger. */
export async function rateDriver(driverId: string, rating: number, quotationId?: string, feedback?: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { error: "Supabase not configured" };
  const { error } = await supabase.from("driver_ratings").insert({
    driver_id: driverId, rating, quotation_id: quotationId ?? null, feedback: feedback ?? null,
  });
  return { error: error?.message ?? null };
}

/** Signed URL for a private driver document (bucket: driver-documents). */
export async function getDriverDocumentUrl(path: string, expiresInSeconds = 3600) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { url: null, error: "Supabase not configured" };
  const { data, error } = await supabase.storage.from("driver-documents").createSignedUrl(path, expiresInSeconds);
  return { url: data?.signedUrl ?? null, error: error?.message ?? null };
}

/** Upload a driver document server-side; returns the storage path to save on the driver row. */
export async function uploadDriverDocument(file: File | Blob, path: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { path: null, error: "Supabase not configured" };
  const { data, error } = await supabase.storage.from("driver-documents").upload(path, file, { upsert: true });
  return { path: data?.path ?? null, error: error?.message ?? null };
}
