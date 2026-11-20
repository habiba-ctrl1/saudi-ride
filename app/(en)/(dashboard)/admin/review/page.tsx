import { Metadata } from "next";
import { listOpenReview, scanForReview } from "@/lib/ops/review";
import { ReviewClient } from "./ReviewClient";

export const metadata: Metadata = { title: "Needs Review | Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  // Scanning only raises flags (idempotent); it never edits a booking.
  const scan = await scanForReview().catch(() => null);
  const items = await listOpenReview();
  return <ReviewClient items={items} raised={scan?.raised ?? 0} scanFailed={scan === null} />;
}
