import { Metadata } from "next";
import { listLocalDrivers, listMainDrivers } from "@/lib/ops/drivers";
import { getPkrRate } from "@/lib/ops/money";
import { DriversClient } from "./DriversClient";

export const metadata: Metadata = { title: "Drivers | Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDriversPage() {
  const [main, local, rate] = await Promise.all([listMainDrivers(), listLocalDrivers(), getPkrRate()]);
  return <DriversClient main={main} local={local} pkrRate={rate} />;
}
