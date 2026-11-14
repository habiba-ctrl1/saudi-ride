import { Metadata } from "next";
import { CorporateInvoiceForm } from "./CorporateInvoiceForm";

export const metadata: Metadata = { title: "Corporate Invoice | Admin Dashboard" };

export default function CorporateInvoicePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-[#F5F0E8]">Corporate VAT Proforma Invoice</h1>
        <p className="text-[#A1A1A6] mt-1 text-sm">
          Generate a branded proforma invoice for Path B corporate clients, with Arabian Eagle Eyes&apos; VAT billing details.
        </p>
      </div>
      <CorporateInvoiceForm />
    </div>
  );
}
