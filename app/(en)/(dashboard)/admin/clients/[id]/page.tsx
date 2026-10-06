import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClientDetail } from "@/lib/ops/clients";
import { getPkrRate } from "@/lib/ops/money";
import { ClientDetailClient } from "./ClientDetailClient";

export const metadata: Metadata = { title: "Client | Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [detail, rate] = await Promise.all([getClientDetail(id), getPkrRate()]);
  if (!detail) notFound();
  return <ClientDetailClient detail={detail} pkrRate={rate} />;
}
