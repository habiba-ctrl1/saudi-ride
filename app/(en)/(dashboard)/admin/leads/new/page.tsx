import { Metadata } from "next";
import { NewLeadClient } from "./NewLeadClient";

export const metadata: Metadata = { title: "Add Lead | Admin Dashboard" };

export default function NewLeadPage() {
  return <NewLeadClient />;
}
