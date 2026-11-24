import { MessageCircle } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";
import { routeFromPriceText } from "@/lib/data/route-from-prices";

/** Estimated "from" fare + WhatsApp CTA. Renders nothing for routes without a real quote. */
export function RouteFromPrice({ slug, from, to, locale = "en" }: { slug: string; from: string; to: string; locale?: "en" | "ar" }) {
  const ar = locale === "ar";
  const p = routeFromPriceText(slug, ar);
  if (!p) return null;
  const text = ar
    ? `مرحبًا، أريد تأكيد السعر:\n• من: ${from}\n• إلى: ${to}\n• التاريخ والوقت: \n• عدد الركاب والحقائب: \n• نوع السيارة (سيدان / SUV / فان): `
    : `Hello, please confirm the fare for:\n• From: ${from}\n• To: ${to}\n• Date & time: \n• Passengers & luggage: \n• Vehicle (Sedan / SUV / Van): `;
  return (
    <aside
      aria-label={ar ? "السعر التقديري" : "Estimated fare"}
      className="flex flex-col gap-4 rounded-3xl border border-[#16A34A]/20 bg-[#F0FDF4] p-5 text-start sm:flex-row sm:items-center sm:justify-between sm:p-6"
    >
      <div className="min-w-0">
        <p className="text-xs font-semibold text-[#475569]">{ar ? "سعر تقديري، اتجاه واحد" : "Estimated one-way fare"}</p>
        <p className="mt-1 text-xl font-bold text-[#15803D]">{p.label}</p>
        <p className="mt-1 text-sm text-[#475569]">
          {ar
            ? `للسيارة كاملة. السعر النهائي حسب التاريخ والسيارة والعنوان، ويُؤكد عبر واتساب. آخر مراجعة: ${p.checked}.`
            : `For the whole vehicle. Final fare depends on date, vehicle and address, and is confirmed on WhatsApp. Prices checked ${p.checked}.`}
        </p>
      </div>
      <a
        href={`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(text)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary min-h-11 shrink-0 justify-center"
      >
        <MessageCircle className="h-4 w-4" aria-hidden /> {ar ? "أكّد السعر عبر واتساب" : "Confirm on WhatsApp"}
      </a>
    </aside>
  );
}
