import { Metadata } from "next";
import { listQuotations, type QuotationFilters, type QuotationStatus, type LeadSource, type QuotationPaymentStatus } from "@/lib/supabase/quotations";
import { listDrivers } from "@/lib/supabase/drivers";
import { QuotationsClient } from "./QuotationsClient";

export const metadata: Metadata = {
  title: "Quotations | Admin Dashboard",
};

export const dynamic = "force-dynamic";

const SOURCES: LeadSource[] = ["website", "whatsapp", "referral", "event_management"];
const PAYMENT_STATUSES: QuotationPaymentStatus[] = ["unpaid", "partial", "paid"];

// UI-level stage groups over the DB status enum — "in_progress" merges
// confirmed+assigned so the owner can filter without losing per-row precision.
const STAGE_STATUS_MAP: Record<string, QuotationStatus[]> = {
  pending: ["new"],
  quoted: ["quoted"],
  in_progress: ["confirmed", "assigned"],
  completed: ["completed"],
  cancelled: ["cancelled"],
};

// Riyadh (UTC+3) date string, since trip dates are booked in local KSA time
// regardless of where this server process runs.
function riyadhDateString(offsetDays = 0): string {
  const now = new Date(Date.now() + 3 * 60 * 60 * 1000 + offsetDays * 24 * 60 * 60 * 1000);
  return now.toISOString().slice(0, 10);
}

export default async function AdminQuotationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;

  let dateFrom = sp.dateFrom || undefined;
  let dateTo = sp.dateTo || undefined;
  if (sp.datePreset === "today") {
    dateFrom = dateTo = riyadhDateString(0);
  } else if (sp.datePreset === "tomorrow") {
    dateFrom = dateTo = riyadhDateString(1);
  } else if (sp.datePreset === "week") {
    dateFrom = riyadhDateString(0);
    dateTo = riyadhDateString(6);
  }

  const filters: QuotationFilters = {
    status: sp.stage && STAGE_STATUS_MAP[sp.stage] ? STAGE_STATUS_MAP[sp.stage] : undefined,
    source: SOURCES.includes(sp.source as LeadSource) ? (sp.source as LeadSource) : undefined,
    paymentStatus: PAYMENT_STATUSES.includes(sp.paymentStatus as QuotationPaymentStatus)
      ? (sp.paymentStatus as QuotationPaymentStatus)
      : undefined,
    dateFrom,
    dateTo,
    search: sp.search || undefined,
    sort: sp.sort === "oldest" ? "oldest" : "newest",
    page: sp.page ? Math.max(1, Number(sp.page) || 1) : 1,
    limit: 25,
  };

  const [{ rows, total, error }, { rows: approvedDrivers }] = await Promise.all([
    listQuotations(filters),
    listDrivers({ status: "approved", limit: 100 }),
  ]);

  const drivers = approvedDrivers.map((d) => ({
    id: d.id,
    name: d.full_name,
    city: d.city,
    vehicleType: d.vehicle_type,
  }));

  return (
    <QuotationsClient
      quotations={rows}
      total={total}
      page={filters.page ?? 1}
      limit={filters.limit ?? 25}
      drivers={drivers}
      loadError={error}
    />
  );
}
