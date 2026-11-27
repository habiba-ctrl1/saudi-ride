import { DoorOpen, ShieldCheck, CheckCircle2, Info } from "lucide-react";

// Door-to-door (default) vs border drop-off (lower fare). Border drop-off is
// owner-confirmed (2026-10-03) and only shown on corridors where it is offered
// (corridor.borderDrop) and for trips that start in Saudi Arabia. We make no
// claim about how passengers continue across — that depends on the crossing.
const AR = {
  h: "من الباب إلى الباب أم التوصيل إلى الحدود؟", p: "طريقتان لحجز هذه الرحلة، وكلتاهما بسعر ثابت مكتوب يُتفق عليه قبل السفر.", rec: "الخيار المفضل", d2d: "من الباب إلى الباب",
  d1: (d: string) => `السيارة والسائق نفسهما من بابك حتى عنوانك في ${d}`, d2: (c: string) => `رسوم عبور السيارة في ${c} مشمولة`, d3: "لا نقل للأمتعة ولا ترتيب مواصلات على الجانب الآخر",
  bd: "التوصيل إلى الحدود", cheaper: "· سعر أقل", b1: (c: string) => `نوصلك إلى الجانب السعودي من ${c}`, b2: "أقل تكلفة لأن سيارتنا لا تعبر الحدود", b3: "ترتّب مواصلاتك على الجانب الآخر بنفسك، وتتحقق من طريقة عبور الركاب في هذا المنفذ",
};

export function TripModes({ destination, crossing, locale = "en" }: { destination: string; crossing: string; locale?: "en" | "ar" }) {
  if (locale === "ar") {
    return (
      <section aria-labelledby="xb-modes">
        <h2 id="xb-modes" className="font-heading text-2xl font-bold sm:text-3xl">{AR.h}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6B7280]">{AR.p}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="relative rounded-3xl border-2 border-[#16A34A] bg-white p-6">
            <span className="absolute -top-3 start-6 rounded-full bg-[#16A34A] px-3 py-0.5 text-[0.65rem] font-bold text-[#FFFFFF]">{AR.rec}</span>
            <p className="flex items-center gap-2 text-lg font-bold"><DoorOpen className="h-5 w-5 text-[#16A34A]" aria-hidden /> {AR.d2d}</p>
            <ul className="mt-3 space-y-2 text-sm text-[#475569]">
              {[AR.d1(destination), AR.d2(crossing), AR.d3].map((x) => <li key={x} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden /> {x}</li>)}
            </ul>
          </div>
          <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-6">
            <p className="flex items-center gap-2 text-lg font-bold"><ShieldCheck className="h-5 w-5 text-[#A16207]" aria-hidden /> {AR.bd} <span className="text-sm font-semibold text-[#A16207]">{AR.cheaper}</span></p>
            <ul className="mt-3 space-y-2 text-sm text-[#475569]">
              {[AR.b1(crossing), AR.b2].map((x) => <li key={x} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#A16207]" aria-hidden /> {x}</li>)}
              <li className="flex gap-2"><Info className="mt-0.5 h-4 w-4 shrink-0 text-[#A16207]" aria-hidden /> {AR.b3}</li>
            </ul>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section aria-labelledby="xb-modes">
      <h2 id="xb-modes" className="font-heading text-2xl font-bold sm:text-3xl">Door-to-door or border drop-off?</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6B7280]">Two ways to book this trip. Both have one fixed fare agreed in writing before you travel.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="relative rounded-3xl border-2 border-[#16A34A] bg-white p-6">
          <span className="absolute -top-3 start-6 rounded-full bg-[#16A34A] px-3 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-[#FFFFFF]">Recommended</span>
          <p className="flex items-center gap-2 text-lg font-bold"><DoorOpen className="h-5 w-5 text-[#16A34A]" aria-hidden /> Door-to-door</p>
          <ul className="mt-3 space-y-2 text-sm text-[#475569]">
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden /> Same car and driver from your door to your address in {destination}</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden /> Vehicle crossing fees at {crossing} included</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden /> No luggage transfers, no arranging transport on the other side</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-6">
          <p className="flex items-center gap-2 text-lg font-bold"><ShieldCheck className="h-5 w-5 text-[#A16207]" aria-hidden /> Border drop-off <span className="text-sm font-semibold text-[#A16207]">· lower fare</span></p>
          <ul className="mt-3 space-y-2 text-sm text-[#475569]">
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#A16207]" aria-hidden /> We drive you to the Saudi side of {crossing}</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#A16207]" aria-hidden /> Cheaper, because our car does not cross</li>
            <li className="flex gap-2"><Info className="mt-0.5 h-4 w-4 shrink-0 text-[#A16207]" aria-hidden /> You arrange your own onward transport on the other side, and check how passengers continue at this crossing</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
