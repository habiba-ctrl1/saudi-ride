import { Metadata } from "next";
import { PasteClient } from "./PasteClient";

export const metadata: Metadata = { title: "Paste New Enquiry | Admin Dashboard" };

export default function PastePage() {
  return <PasteClient />;
}
