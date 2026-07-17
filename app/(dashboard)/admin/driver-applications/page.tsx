import { Metadata } from "next";
import { listDrivers } from "@/lib/supabase/drivers";
import { DriverApplicationsClient } from "./DriverApplicationsClient";

export const metadata: Metadata = {
  title: "Driver Applications | Admin Dashboard",
};

export const dynamic = "force-dynamic";

export default async function AdminDriverApplicationsPage() {
  const { rows, error } = await listDrivers({ limit: 100 });
  return <DriverApplicationsClient drivers={rows} loadError={error} />;
}
