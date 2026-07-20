import { Metadata } from "next";
import { listQuotations, type QuotationFilters, type QuotationStatus, type LeadSource, type QuotationPaymentStatus } from "@/lib/supabase/quotations";
import { listDrivers } from "@/lib/supabase/drivers";
import { QuotationsClient } from "./QuotationsClient";

export const metadata: Metadata = {
  title: "Quotations | Admin Dashboard",
};

export const dynamic = "force-dynamic";

const STATUSES: QuotationStatus[] = ["new", "quoted", "confirmed", "assigned", "completed", "cancelled"];
const SOURCES: LeadSource[] = ["website", "whatsapp", "referral", "event_management"];
const PAYMENT_STATUSES: QuotationPaymentStatus[] = ["unpaid", "partial", "paid"];

export default async function AdminQuotationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;

  const filters: QuotationFilters = {
    status: STATUSES.includes(sp.status as QuotationStatus) ? (sp.status as QuotationStatus) : undefined,
    source: SOURCES.includes(sp.source as LeadSource) ? (sp.source as LeadSource) : undefined,
    paymentStatus: PAYMENT_STATUSES.includes(sp.paymentStatus as QuotationPaymentStatus)
      ? (sp.paymentStatus as QuotationPaymentStatus)
      : undefined,
    dateFrom: sp.dateFrom || undefined,
    dateTo: sp.dateTo || undefined,
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
