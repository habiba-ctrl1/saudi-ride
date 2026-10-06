import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getQuotationWithDriver } from "@/lib/supabase/quotations";
import { listComms } from "@/lib/ops/comms";
import { listAssignable } from "@/lib/ops/drivers";
import { getPkrRate } from "@/lib/ops/money";
import { getTimeline, lifecycleState } from "@/lib/ops/events";
import { isConvertedToBooking } from "@/lib/ops/quote-stage";
import { prisma } from "@/lib/prisma";
import { QuotationDetailClient } from "./QuotationDetailClient";

export const metadata: Metadata = { title: "Booking Record | Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function QuotationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { row, error } = await getQuotationWithDriver(id);
  if (error || !row) notFound();

  const [comms, drivers, pkrRate, docs, timeline] = await Promise.all([
    listComms(id),
    listAssignable(),
    getPkrRate(),
    prisma.$queryRawUnsafe<{ id: string; kind: string; number: string; amount: number | null; created_at: string }[]>(
      `SELECT id::text, kind, number, amount::float, created_at::text FROM documents WHERE quotation_id=$1::uuid ORDER BY created_at DESC`, id),
    getTimeline(id, row.created_at),
  ]);

  const converted = isConvertedToBooking(row.status);
  const completed = row.status === "completed";
  const paid = row.payment_status === "paid" && (row.actual_amount_paid ?? 0) > 0;
  const lifecycle = lifecycleState({
    quoted: row.quoted_price != null,
    accepted: row.quote_stage === "accepted" || converted,
    confirmed: converted,
    driverAssigned: !!(row.partner_id || row.driver_name || row.assigned_driver_id),
    pickupSent: comms.some((c) => c.template === "pickup" && c.status === "sent"),
    completed,
    paid: completed && paid,
    receipt: docs.some((d) => d.kind === "receipt"),
    financialsClosed: completed && paid && row.financial_status === "confirmed",
  });

  return <QuotationDetailClient q={row} comms={comms} drivers={drivers} pkrRate={pkrRate} docs={docs} timeline={timeline} lifecycle={lifecycle} />;
}
