import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { RideRegisterClient, type RegisterRow } from "./RideRegisterClient";

export const metadata: Metadata = { title: "Ride Register | Admin Dashboard" };
export const dynamic = "force-dynamic";

const ISO = /^\d{4}-\d{2}-\d{2}$/;

// Read-only listing of rides by trip date (default 1–15 Oct 2026). Nothing here sends or changes anything by itself —
// every action is a button on a row.
export default async function RideRegisterPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const from = sp.from && ISO.test(sp.from) ? sp.from : "2026-10-01";
  const to = sp.to && ISO.test(sp.to) ? sp.to : "2026-10-15";
  const rows = await prisma.$queryRawUnsafe<RegisterRow[]>(
    `SELECT id::text, quote_reference, customer_name, customer_phone, customer_email, pickup_location, drop_location, trip_date::text, left(trip_time::text,5) trip_time,
        vehicle_type_requested::text vehicle, status::text, quoted_price::float, actual_amount_paid::float, currency, payment_method_used,
        COALESCE(driver_name,'') driver_name, receipt_sent_at::text,
        EXISTS (SELECT 1 FROM communication_log l WHERE l.quotation_id=x.id AND l.template='receipt' AND l.status='sent') receipt_emailed
       FROM quotations x WHERE NOT is_test AND trip_date BETWEEN $1::date AND $2::date ORDER BY trip_date, trip_time NULLS LAST`, from, to);
  return <RideRegisterClient rows={rows} from={from} to={to} />;
}
