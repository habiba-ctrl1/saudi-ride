import { Metadata } from "next";
import { listFollowUps, listCandidates } from "@/lib/ops/followups";
import FollowUpClient from "./FollowUpClient";

export const metadata: Metadata = { title: "Follow-ups | Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function FollowUpsPage() {
  const [rows, candidates] = await Promise.all([listFollowUps(), listCandidates()]);
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-[#F5F0E8]">Follow-ups</h1>
        <p className="text-xs text-[#7C8088]">
          Customers who were given a price and have not confirmed. You get an email 3 days before their travel date (and on the day if added late).
        </p>
      </div>
      <FollowUpClient rows={rows} candidates={candidates} />
    </div>
  );
}
