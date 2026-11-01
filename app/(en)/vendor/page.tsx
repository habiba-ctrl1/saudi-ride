import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import VendorClient from "./VendorClient";

export const metadata: Metadata = { title: "Vendor Portal", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function VendorPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN" && role !== "VENDOR") redirect("/vendor/login");
  return <VendorClient role={role} />;
}
