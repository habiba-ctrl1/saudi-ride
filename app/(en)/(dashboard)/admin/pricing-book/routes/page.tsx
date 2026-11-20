import { redirect } from "next/navigation";

// Route Review was merged into the Pricing Book (rules table) — keep old links working.
export default function AdminRouteReviewRedirect() {
  redirect("/admin/pricing-book");
}
