"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, MessageCircle, RotateCcw } from "lucide-react";
import { PLANNER_STOPS } from "@/lib/data/alula-cluster";
import { AR_PLANNER } from "@/lib/data/alula-cluster-ar";

const GROUPS = ["Heritage", "Architecture & culture", "Nature"] as const;
const GUIDED = ["hegra", "dadan", "jabal-ikmah", "sharaan"];

// مخطط المحطات بالعربية — أداة مساعدة لتوليد رسالة واتساب فقط، لا تحجز شيئاً.
export function JourneyPlannerAr({ whatsappLink }: { whatsappLink: string }) {
  const [start, setStart] = useState(AR_PLANNER.starts[0]);
  const [end, setEnd] = useState(AR_PLANNER.ends[0]);
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const chosen = PLANNER_STOPS.filter((s) => picked.includes(s.id));
  const name = (id: string) => AR_PLANNER.stops[id] ?? id;
  const guided = chosen.filter((s) => GUIDED.includes(s.id));

  const verdict = useMemo(() => {
    if (chosen.length === 0) return { title: "اختر محطاتك", body: "علّم الأماكن التي تريد زيارتها ونقترح عليك نوع الحجز المناسب.", href: "", cta: "" };
    if (chosen.length <= 2) return { title: "محطة أو محطتان: قد تكفي المشاوير", body: "رحلة ذهاب وعودة بسيارة تنتظرك أو مشاوير منفصلة تناسب غالباً. وإذا كانت الخطة قابلة للتغيير فالسائق الخاص أريح.", href: "/ar/locations/alula/private-driver", cta: "قارن مع السائق الخاص" };
    return { title: "ثلاث محطات فأكثر: احجز سائقاً خاصاً", body: "سيارة وسائق واحد لليوم ينتظر عند كل محطة ويحمل أمتعتك ويتيح لك تغيير الترتيب. هذه هي الحالة التي صُمم لها السائق الخاص.", href: "/ar/locations/alula/private-driver", cta: "كيف يعمل السائق الخاص في العلا" };
  }, [chosen.length]);

  const message = [
    "السلام عليكم، يوم سياحي في العلا بسيارة خاصة.",
    `• البداية: ${start}`,
    `• المحطات: ${chosen.length ? chosen.map((s) => name(s.id)).join(" ← ") : "(تُحدد لاحقاً)"}`,
    `• النهاية: ${end}`,
    "• التاريخ ووقت البدء: ",
    "• عدد الركاب: ",
    "• المركبة (سيدان تنفيذية / دفع رباعي / فان): ",
  ].join("\n");

  const selectCls = "min-h-[44px] w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm font-medium text-[#1C1C1C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]";

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_1fr] lg:gap-8" dir="rtl">
      <div className="space-y-6 rounded-3xl border border-[#E5E7EB] bg-white p-5 md:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-bold text-[#15803D]">
            1 · البداية
            <select value={start} onChange={(e) => setStart(e.target.value)} className={`mt-2 ${selectCls}`}>
              {AR_PLANNER.starts.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="block text-xs font-bold text-[#15803D]">
            3 · النهاية
            <select value={end} onChange={(e) => setEnd(e.target.value)} className={`mt-2 ${selectCls}`}>
              {AR_PLANNER.ends.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
        </div>

        <div>
          <p className="text-xs font-bold text-[#15803D]">2 · أضف المحطات</p>
          <div className="mt-3 space-y-5">
            {GROUPS.map((g) => (
              <fieldset key={g}>
                <legend className="mb-2 text-sm font-semibold text-[#1C1C1C]">{AR_PLANNER.groups[g]}</legend>
                <div className="flex flex-wrap gap-2">
                  {PLANNER_STOPS.filter((s) => s.group === g).map((s) => {
                    const on = picked.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(s.id)}
                        className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 active:scale-[0.97] ${
                          on ? "border-[#16A34A] bg-[#16A34A] text-[#FFFFFF]" : "border-[#E5E7EB] bg-white text-[#1C1C1C] hover:border-[#16A34A]/50 hover:bg-[#F0FDF4]"
                        }`}
                      >
                        {on && <Check className="h-4 w-4" aria-hidden="true" />}
                        {name(s.id)}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
        </div>
        {picked.length > 0 && (
          <button type="button" onClick={() => setPicked([])} className="inline-flex min-h-[44px] items-center gap-2 text-xs font-bold text-[#6B7280] hover:text-[#15803D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> مسح المحطات
          </button>
        )}
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-[#0B1F14] p-6 text-[#FFFFFF] md:p-7" aria-live="polite">
        <p className="text-xs font-bold text-[#FACC15]">{AR_PLANNER.heading}</p>
        <ol className="mt-4">
          {[start, ...chosen.map((s) => name(s.id)), end].map((label, i, arr) => (
            <li key={`${label}-${i}`} className="relative flex gap-3 pb-4 last:pb-0">
              {i < arr.length - 1 && <span aria-hidden="true" className="absolute right-[7px] top-4 h-full w-px bg-white/20" />}
              <span className={`relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${i === 0 || i === arr.length - 1 ? "border-[#FACC15] bg-[#FACC15]" : "border-[#16A34A] bg-[#0B1F14]"}`} />
              <span className="text-sm font-semibold">{label}</span>
            </li>
          ))}
        </ol>

        <div className="mt-5 rounded-2xl bg-white/10 p-4">
          <p className="font-heading text-base font-bold">{verdict.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-white/80">{verdict.body}</p>
          {verdict.href && (
            <Link href={verdict.href} className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-xs font-bold text-[#FACC15] hover:text-[#FDE047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15]">
              {verdict.cta} <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
        </div>

        {guided.length > 0 && (
          <p className="mt-4 text-xs leading-relaxed text-white/70">
            {guided.map((g) => name(g.id)).join("، ")} تُزار عبر تجارب «تجربة العلا». احجزها أولاً ونخطط أوقات الطريق حول مواعيدك. نقدم النقل فقط.
          </p>
        )}

        <a
          href={`${whatsappLink}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#FACC15] px-6 text-sm font-bold text-[#0B1F14] transition-colors hover:bg-[#FDE047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" /> أرسل هذه الخطة لطلب عرض سعر
        </a>
        <p className="mt-3 text-center text-[0.7rem] text-white/50">أداة تخطيط فقط — لا يُحجز شيء قبل تأكيدنا للسعر.</p>
      </div>
    </div>
  );
}
