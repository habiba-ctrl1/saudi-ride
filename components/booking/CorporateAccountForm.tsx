"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

// Corporate account request — /api/contact se email jati hai (admin + auto-reply).
// Pehle yeh form dead tha (button ka koi handler nahi tha).
export function CorporateAccountForm() {
  const pathname = usePathname();
  const [form, setForm] = useState({
    company: "",
    contact: "",
    email: "",
    phone: "",
    trips: "1-10",
    requirements: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const inputCls =
    "input";
  const labelCls = "field-label block";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.contact,
          email: form.email,
          phone: form.phone,
          service: "Corporate Account Request",
          message: `Company: ${form.company}\nEstimated monthly trips: ${form.trips}\nRequirements: ${form.requirements || "—"}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      trackEvent("lead_captured", {
        source: "corporate_account_form",
        tripType: form.trips,
        locale: pathname?.startsWith("/ar") ? "ar" : "en",
      });
      setDone(true);
      toast.success("Request received! Our B2B team will contact you within 24 hours.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong — please contact us on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-10 space-y-3">
        <p className="font-heading text-xl font-bold text-[#16A34A]">Request received ✓</p>
        <p className="text-sm text-[#6B7280]">Our B2B team will contact you within 24 hours with your corporate account details.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className={labelCls}>Company Name *</label>
          <input type="text" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputCls} />
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Contact Person *</label>
          <input type="text" required value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className={inputCls} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className={labelCls}>Corporate Email *</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Phone Number *</label>
          <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} />
        </div>
      </div>

      <div className="space-y-2">
        <label className={labelCls}>Estimated Monthly Trips</label>
        <select value={form.trips} onChange={(e) => setForm({ ...form, trips: e.target.value })} className={`${inputCls} appearance-none`}>
          <option value="1-10">1 - 10 Trips</option>
          <option value="11-50">11 - 50 Trips</option>
          <option value="50+">50+ Trips</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className={labelCls}>Additional Requirements</label>
        <textarea rows={4} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} className={inputCls} placeholder="Tell us about your specific transport needs..." />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary btn-lg btn-block mt-4"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Submit Application
      </button>
      <p className="text-center text-[0.65rem] text-[#6B7280] mt-4">By submitting, you agree to our B2B terms of service.</p>
    </form>
  );
}
