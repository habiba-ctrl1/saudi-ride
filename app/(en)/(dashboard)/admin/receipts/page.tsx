import { Metadata } from "next";
import { getReceiptCenter } from "@/lib/ops/receipts";
import { ReceiptsClient } from "./ReceiptsClient";
import { TRUSTPILOT_REVIEW_URL } from "@/lib/reviews";

export const metadata: Metadata = { title: "Receipts | Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function ReceiptsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const sp = await searchParams;
  const { ready, issued } = await getReceiptCenter();
  const tab = sp.tab === "sent" || sp.tab === "all" ? sp.tab : "tosend";
  return <ReceiptsClient ready={ready} issued={issued} tab={tab} reviewUrl={TRUSTPILOT_REVIEW_URL} />;
}
