import { Metadata } from "next";
import { NewQuotationClient } from "./NewQuotationClient";

export const metadata: Metadata = { title: "New Quotation | Admin Dashboard" };
export const dynamic = "force-dynamic";

export default function NewQuotationPage() {
  return <NewQuotationClient />;
}
