import { Metadata } from "next";
import { listQuotations } from "@/lib/supabase/quotations";
import { listDrivers } from "@/lib/supabase/drivers";
import { QuotationsClient } from "./QuotationsClient";

export const metadata: Metadata = {
  title: "Quotations | Admin Dashboard",
};

export const dynamic = "force-dynamic";

export default async function AdminQuotationsPage() {
  const [{ rows, error }, { rows: approvedDrivers }] = await Promise.all([
    listQuotations({ limit: 100 }),
    listDrivers({ status: "approved", limit: 100 }),
  ]);

  const drivers = approvedDrivers.map((d) => ({
    id: d.id,
    name: d.full_name,
    city: d.city,
    vehicleType: d.vehicle_type,
  }));

  return <QuotationsClient quotations={rows} drivers={drivers} loadError={error} />;
}
