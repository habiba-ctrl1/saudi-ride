import Link from "next/link";
import {
  Plane, CarFront, MapPin, Ship, PlaneTakeoff, Zap, BedDouble, Palmtree, Info, MessageCircle, CheckCircle2,
} from "lucide-react";
import {
  BADGE_LABEL, RSI_IMPORTANT_NOTICE, RSI_RATE_DISCLAIMER, RSI_RATE_LABEL, RSI_TRANSFER_RATES,
  rsiWhatsApp, sar, type RsiRateKey, type TransferBadge,
} from "@/lib/data/red-sea-cluster";

// Shared visual kit for the Red Sea International Airport (RSI) cluster:
// hero art, route illustrations, journey diagram, rate table, badges, notice.
// Server components, inline SVG + CSS only (no JS animation, no new deps).
// Every animation is disabled under prefers-reduced-motion.

const CSS = `
.rs-draw{stroke-dasharray:var(--len,700);stroke-dashoffset:var(--len,700);animation:rs-draw 2.4s ease-out .3s forwards}
@keyframes rs-draw{to{stroke-dashoffset:0}}
.rs-ride{offset-rotate:0deg;animation:rs-ride 5.5s ease-in-out .6s both}
@keyframes rs-ride{from{offset-distance:0%}to{offset-distance:100%}}
.rs-pulse{transform-box:fill-box;transform-origin:center;animation:rs-pulse 2.6s ease-out infinite}
@keyframes rs-pulse{0%{transform:scale(.6);opacity:.7}100%{transform:scale(2.2);opacity:0}}
.rs-leg{animation:rs-legx 900ms ease-out both}
@keyframes rs-legx{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes rs-legy{from{clip-path:inset(0 0 100% 0)}to{clip-path:inset(0 0 0 0)}}
@media (max-width:767px){.rs-leg{animation-name:rs-legy}}
.rs-float{animation:rs-float 6s ease-in-out infinite alternate}
@keyframes rs-float{from{transform:translateY(0)}to{transform:translateY(-4px)}}
@media (prefers-reduced-motion:reduce){
.rs-draw,.rs-ride,.rs-pulse,.rs-leg,.rs-float{animation:none!important}
.rs-draw{stroke-dashoffset:0!important}
.rs-ride{offset-distance:100%!important}
}
`;

export function RsiStyles() {
  return <style dangerouslySetInnerHTML={{ __html: CSS }} />;
}

// ── Badges ───────────────────────────────────────────────────────────────────
const BADGE_STYLE: Record<TransferBadge, string> = {
  land: "bg-[#ECFDF5] text-[#047857] ring-[#10B981]/30",
  "land-boat": "bg-[#ECFEFF] text-[#0E7490] ring-[#06B6D4]/35",
  "land-seaplane": "bg-[#EFF6FF] text-[#1D4ED8] ring-[#3B82F6]/30",
  quote: "bg-[#FEFCE8] text-[#854D0E] ring-[#FACC15]/50",
};

export function TransferBadges({ badges, className = "" }: { badges: TransferBadge[]; className?: string }) {
  return (
    <span className={`flex flex-wrap gap-1.5 ${className}`}>
      {badges.map((b) => (
        <span key={b} className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wider ring-1 ${BADGE_STYLE[b]}`}>
          {BADGE_LABEL[b]}
        </span>
      ))}
    </span>
  );
}

// ── Important notice (land vs marine) ────────────────────────────────────────
export function IslandTransferNotice({ className = "" }: { className?: string }) {
  return (
    <aside role="note" className={`flex gap-3 rounded-2xl border border-[#06B6D4]/30 bg-[#ECFEFF] p-4 sm:p-5 ${className}`}>
      <Info aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-[#0E7490]" />
      <p className="text-sm leading-relaxed text-[#134E4A]">
        <strong className="font-bold text-[#0E7490]">Important. </strong>
        {RSI_IMPORTANT_NOTICE}
      </p>
    </aside>
  );
}

// ── Journey diagram ──────────────────────────────────────────────────────────
type Leg = "land" | "marine" | "air" | "shuttle";
interface Step { icon: typeof Plane; title: string; sub: string; tag: string; leg?: Leg }

function stepsFor(kind: "mainland" | "island" | "shura", dest?: string): Step[] {
  const TSA = "Covered by TSA land rate";
  if (kind === "island") {
    return [
      { icon: Plane, title: "RSI Airport", sub: "Arrive and meet your driver", tag: TSA, leg: "land" },
      { icon: CarFront, title: "Private vehicle", sub: "Sedan or SUV by road", tag: TSA, leg: "land" },
      { icon: MapPin, title: "Turtle Bay / transfer point", sub: "Where the road ends", tag: TSA, leg: "marine" },
      { icon: Ship, title: "Boat or seaplane", sub: "Arranged with the resort", tag: "Arranged separately", leg: "marine" },
      { icon: Palmtree, title: dest ?? "Island resort", sub: "Your island arrival", tag: "Resort", },
    ];
  }
  if (kind === "shura") {
    return [
      { icon: Plane, title: "RSI Airport", sub: "Arrive and meet your driver", tag: TSA, leg: "land" },
      { icon: CarFront, title: "Private vehicle", sub: "Sedan or SUV by road", tag: TSA, leg: "land" },
      { icon: MapPin, title: "Shura access / parking / causeway", sub: "Where the car stops", tag: TSA, leg: "shuttle" },
      { icon: Zap, title: "Property electric transfer", sub: "The resort's final leg", tag: "Property's own transfer", leg: "shuttle" },
      { icon: BedDouble, title: dest ?? "Your hotel", sub: "Check in on the island", tag: "Property", },
    ];
  }
  return [
    { icon: Plane, title: "RSI Airport", sub: "Arrive and meet your driver", tag: TSA, leg: "land" },
    { icon: CarFront, title: "Private vehicle", sub: "Sedan or SUV by road", tag: TSA, leg: "land" },
    { icon: MapPin, title: dest ?? "Destination", sub: "Mainland drop-off", tag: TSA },
  ];
}

const LEG_STYLE: Record<Leg, { md: string; sm: string }> = {
  land: { md: "h-[3px] w-full bg-[#16A34A]", sm: "w-[3px] h-full bg-[#16A34A]" },
  marine: {
    md: "h-[3px] w-full bg-[repeating-linear-gradient(90deg,#06B6D4_0_8px,transparent_8px_14px)]",
    sm: "w-[3px] h-full bg-[repeating-linear-gradient(180deg,#06B6D4_0_8px,transparent_8px_14px)]",
  },
  air: {
    md: "h-[3px] w-full bg-[repeating-linear-gradient(90deg,#3B82F6_0_3px,transparent_3px_9px)]",
    sm: "w-[3px] h-full bg-[repeating-linear-gradient(180deg,#3B82F6_0_3px,transparent_3px_9px)]",
  },
  shuttle: {
    md: "h-[3px] w-full bg-[repeating-linear-gradient(90deg,#FACC15_0_10px,transparent_10px_16px)]",
    sm: "w-[3px] h-full bg-[repeating-linear-gradient(180deg,#FACC15_0_10px,transparent_10px_16px)]",
  },
};

export function JourneyDiagram({
  kind, destination, tone = "light", label,
}: { kind: "mainland" | "island" | "shura"; destination?: string; tone?: "light" | "dark"; label: string }) {
  const steps = stepsFor(kind, destination);
  const dark = tone === "dark";
  return (
    <figure aria-label={label} className="m-0">
      <ol className="flex flex-col md:flex-row md:items-start">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const last = i === steps.length - 1;
          const leg = s.leg;
          return (
            <li key={s.title} className="flex gap-4 md:flex-1 md:flex-col md:items-start md:gap-3">
              <div className="flex flex-col items-center md:w-full md:flex-row">
                <span
                  className={`relative z-[1] flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ${
                    dark ? "bg-[#0B2A33] text-[#99F6E4] ring-[#99F6E4]/30" : "bg-[#FFFFFF] text-[#0E7490] ring-[#0E7490]/20 shadow-sm"
                  }`}
                >
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                {!last && leg && (
                  <span aria-hidden className="rs-leg block min-h-10 w-[3px] flex-1 md:min-h-0 md:h-[3px] md:w-auto md:flex-1 md:self-center" style={{ animationDelay: `${i * 260}ms` }}>
                    <span className={`block md:hidden ${LEG_STYLE[leg].sm}`} />
                    <span className={`hidden md:block ${LEG_STYLE[leg].md}`} />
                  </span>
                )}
              </div>
              <div className="min-w-0 pb-5 md:pb-0 md:pe-3">
                <p className={`text-sm font-bold ${dark ? "text-[#FFFFFF]" : "text-[#0F172A]"}`}>{s.title}</p>
                <p className={`text-xs ${dark ? "text-[#CBD5E1]" : "text-[#64748B]"}`}>{s.sub}</p>
                <p className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider ${
                  s.tag === TSA_TAG ? (dark ? "bg-[#16A34A]/25 text-[#86EFAC]" : "bg-[#F0FDF4] text-[#15803D]")
                    : (dark ? "bg-[#FFFFFF]/10 text-[#E2E8F0]" : "bg-[#F1F5F9] text-[#475569]")
                }`}>{s.tag}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <figcaption className={`mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.7rem] ${dark ? "text-[#CBD5E1]" : "text-[#64748B]"}`}>
        <span className="inline-flex items-center gap-1.5"><i className="inline-block h-[3px] w-5 bg-[#16A34A]" /> Road</span>
        {kind === "island" && <span className="inline-flex items-center gap-1.5"><i className="inline-block h-[3px] w-5 bg-[repeating-linear-gradient(90deg,#06B6D4_0_5px,transparent_5px_9px)]" /> Boat or seaplane</span>}
        {kind === "shura" && <span className="inline-flex items-center gap-1.5"><i className="inline-block h-[3px] w-5 bg-[repeating-linear-gradient(90deg,#FACC15_0_6px,transparent_6px_10px)]" /> Electric transfer</span>}
      </figcaption>
    </figure>
  );
}
const TSA_TAG = "Covered by TSA land rate";

// ── Rates ────────────────────────────────────────────────────────────────────
export interface RateRow { key: RsiRateKey; title: string; scope: string; waDestination: string; href?: string; badges: TransferBadge[] }

export function RateTable({ rows, heading }: { rows: RateRow[]; heading: string }) {
  return (
    <div>
      <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#0E7490]">{RSI_RATE_LABEL}</p>
      <h3 className="font-heading mt-1 text-xl font-bold text-[#0F172A]">{heading}</h3>
      {/* Desktop: comparison table */}
      <div className="mt-4 hidden overflow-hidden rounded-2xl border border-[#0E7490]/15 bg-white md:block">
        <table className="w-full text-start text-sm">
          <thead className="bg-[#ECFEFF] text-xs uppercase tracking-wider text-[#0E7490]">
            <tr>
              <th scope="col" className="px-4 py-3 text-start">Route</th>
              <th scope="col" className="px-4 py-3 text-start">Sedan</th>
              <th scope="col" className="px-4 py-3 text-start">SUV</th>
              <th scope="col" className="px-4 py-3"><span className="sr-only">Quote</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-t border-[#0E7490]/10 align-top">
                <th scope="row" className="px-4 py-4 text-start">
                  {r.href ? <Link href={r.href} className="font-bold text-[#0F172A] hover:text-[#15803D]">{r.title}</Link> : <span className="font-bold text-[#0F172A]">{r.title}</span>}
                  <span className="mt-0.5 block text-xs font-normal text-[#64748B]">{r.scope}</span>
                  <TransferBadges badges={r.badges} className="mt-2" />
                </th>
                <td className="px-4 py-4 text-lg font-extrabold text-[#0F172A]">{sar(RSI_TRANSFER_RATES[r.key].sedan)}</td>
                <td className="px-4 py-4 text-lg font-extrabold text-[#0F172A]">{sar(RSI_TRANSFER_RATES[r.key].suv)}</td>
                <td className="px-4 py-4 text-end">
                  <a href={rsiWhatsApp(r.waDestination)} target="_blank" rel="noopener noreferrer" aria-label={`Get quote: RSI to ${r.waDestination}`} className="btn btn-primary">
                    <MessageCircle aria-hidden className="h-4 w-4" /> Get Quote
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile: stacked cards */}
      <ul className="mt-4 space-y-3 md:hidden">
        {rows.map((r) => (
          <li key={r.key} className="rounded-2xl border border-[#0E7490]/15 bg-white p-4">
            <p className="font-bold text-[#0F172A]">{r.href ? <Link href={r.href} className="hover:text-[#15803D]">{r.title}</Link> : r.title}</p>
            <p className="text-xs text-[#64748B]">{r.scope}</p>
            <TransferBadges badges={r.badges} className="mt-2" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-[#F8FAFC] p-3"><p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#64748B]">Sedan</p><p className="text-lg font-extrabold">{sar(RSI_TRANSFER_RATES[r.key].sedan)}</p></div>
              <div className="rounded-xl bg-[#F8FAFC] p-3"><p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#64748B]">SUV</p><p className="text-lg font-extrabold">{sar(RSI_TRANSFER_RATES[r.key].suv)}</p></div>
            </div>
            <a href={rsiWhatsApp(r.waDestination)} target="_blank" rel="noopener noreferrer" aria-label={`Get quote: RSI to ${r.waDestination}`} className="btn btn-primary btn-block mt-3">
              <MessageCircle aria-hidden className="h-4 w-4" /> Get Quote
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-[#475569]">{RSI_RATE_DISCLAIMER}</p>
    </div>
  );
}

/** Two vehicle price cards for a single route page. */
export function RouteRateCards({ rateKey, scope, destination }: { rateKey: RsiRateKey; scope: string; destination: string }) {
  const rate = RSI_TRANSFER_RATES[rateKey];
  const items = [
    { v: "Sedan", price: rate.sedan, fit: "Best for 1–3 passengers, couples and lighter luggage" },
    { v: "SUV", price: rate.suv, fit: "Best for families, more luggage and extra comfort" },
  ];
  return (
    <div>
      <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#0E7490]">{RSI_RATE_LABEL}</p>
      <p className="mt-1 text-sm text-[#475569]">{scope}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((i) => (
          <div key={i.v} className="rounded-2xl border border-[#0E7490]/15 bg-white p-5">
            <p className="text-[0.7rem] font-bold uppercase tracking-wider text-[#64748B]">{i.v}</p>
            <p className="font-heading text-3xl font-extrabold text-[#0F172A]">{sar(i.price)}</p>
            <p className="text-xs text-[#64748B]">Private transfer</p>
            <p className="mt-2 text-sm leading-relaxed text-[#475569]">{i.fit}</p>
            <a
              href={rsiWhatsApp(destination, undefined, i.v)}
              target="_blank" rel="noopener noreferrer"
              aria-label={`Get quote: RSI to ${destination}, ${i.v}`}
              className="btn btn-primary btn-block mt-4"
            >
              <MessageCircle aria-hidden className="h-4 w-4" /> Get Quote
            </a>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-[#475569]">{RSI_RATE_DISCLAIMER}</p>
    </div>
  );
}

export function IncludedList({ className = "" }: { className?: string }) {
  const items = [
    { icon: CarFront, t: "Private vehicle", d: "A private vehicle reserved for your transfer." },
    { icon: PlaneTakeoff, t: "Airport meet & greet", d: "Meet & greet at arrivals, included." },
    { icon: CheckCircle2, t: "Luggage assistance", d: "Assistance with luggage at pickup." },
  ];
  return (
    <ul className={`grid gap-3 sm:grid-cols-3 ${className}`}>
      {items.map(({ icon: Icon, t, d }) => (
        <li key={t} className="rounded-2xl border border-[#0E7490]/15 bg-white p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFEFF] text-[#0E7490]"><Icon aria-hidden className="h-5 w-5" /></span>
          <p className="mt-3 font-bold text-[#0F172A]">{t}</p>
          <p className="mt-1 text-sm leading-relaxed text-[#475569]">{d}</p>
        </li>
      ))}
    </ul>
  );
}

// ── SVG art ──────────────────────────────────────────────────────────────────
function Suv({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 22 L7 9 Q9 5 15 5 H40 Q46 5 50 10 L58 19 Q63 20 63 25 V30 H0 Z" fill="#0F172A" />
      <path d="M12 9 H24 V19 H8 Z M27 9 H40 Q43 9 45 12 L50 19 H27 Z" fill="#99F6E4" opacity=".85" />
      <circle cx="15" cy="30" r="6" fill="#0B1220" stroke="#CBD5E1" strokeWidth="1.5" />
      <circle cx="49" cy="30" r="6" fill="#0B1220" stroke="#CBD5E1" strokeWidth="1.5" />
    </g>
  );
}
function Terminal({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 40 Q30 8 70 14 Q110 8 140 40 Z" fill="#FFFFFF" opacity=".95" />
      <rect x="0" y="40" width="140" height="10" fill="#E2E8F0" />
      <rect x="112" y="-6" width="9" height="46" fill="#F8FAFC" />
      <rect x="108" y="-14" width="17" height="9" rx="2" fill="#99F6E4" />
      <path d="M20 40 V30 M45 40 V24 M95 40 V24" stroke="#94A3B8" strokeWidth="2" />
    </g>
  );
}
function Boat({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 12 H46 L38 24 H8 Z" fill="#FFFFFF" />
      <path d="M12 12 V2 H30 V12" fill="#E2E8F0" />
      <rect x="16" y="4" width="10" height="5" fill="#0E7490" />
    </g>
  );
}
function Seaplane({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 10 Q4 4 14 4 H34 L44 8 L34 12 H12 Z" fill="#F8FAFC" />
      <path d="M16 4 L22 -6 H28 L26 4 Z M14 12 L22 20 H28 L26 12 Z" fill="#E2E8F0" />
      <path d="M6 18 H38 M10 22 H34" stroke="#99F6E4" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}
function Palm({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke="#14532D" strokeLinecap="round">
      <path d="M0 0 Q2 -10 0 -20" strokeWidth="2" fill="none" />
      <path d="M0 -20 Q-10 -24 -14 -16 M0 -20 Q10 -24 14 -16 M0 -20 Q-6 -30 -12 -28 M0 -20 Q6 -30 12 -28" strokeWidth="2" fill="none" />
    </g>
  );
}
const T = (p: { x: number; y: number; children: string; anchor?: "start" | "middle" | "end"; c?: string }) => (
  <text x={p.x} y={p.y} textAnchor={p.anchor ?? "middle"} fontSize="12" fontWeight="700" fill={p.c ?? "#FFFFFF"} fontFamily="system-ui, sans-serif">{p.children}</text>
);

/** Atmospheric hero backdrop: terminal, road, SUV and sea. Decorative. */
export function RsiHeroArt() {
  return (
    <svg viewBox="0 0 800 420" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden role="presentation">
      <defs>
        <linearGradient id="rsh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#062B33" /><stop offset=".55" stopColor="#0E7490" /><stop offset="1" stopColor="#5EEAD4" />
        </linearGradient>
        <linearGradient id="rsh-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#14B8A6" /><stop offset="1" stopColor="#0F766E" /></linearGradient>
      </defs>
      <rect width="800" height="420" fill="url(#rsh-sky)" />
      <circle cx="610" cy="110" r="44" fill="#FDE68A" opacity=".85" />
      <path d="M0 250 Q120 232 260 246 T520 244 T800 238 V300 H0 Z" fill="url(#rsh-sea)" opacity=".95" />
      <path d="M520 250 q22 -16 44 0 M590 262 q22 -16 44 0" stroke="#CCFBF1" strokeOpacity=".5" strokeWidth="2" fill="none" />
      <g><ellipse cx="660" cy="248" rx="38" ry="7" fill="#F5E6C8" /><Palm x={652} y={246} /><Palm x={670} y={247} /></g>
      <path d="M0 300 Q160 270 340 296 T800 290 V420 H0 Z" fill="#E7D3A8" />
      <path d="M0 360 Q200 330 420 356 T800 346 V420 H0 Z" fill="#D9BE86" />
      <Terminal x={70} y={236} scale={1.15} />
      <path className="rs-draw" style={{ ["--len" as string]: 520 }} d="M150 318 C260 330 340 304 470 322 S560 330 600 322" stroke="#FFFFFF" strokeOpacity=".75" strokeWidth="3" strokeDasharray="10 8" fill="none" />
      <g className="rs-ride" style={{ offsetPath: "path('M150 296 C260 308 340 282 470 300 S560 308 600 300')" } as React.CSSProperties}>
        <Suv x={-30} y={-10} scale={1.1} />
      </g>
      <circle cx="150" cy="318" r="6" fill="#FACC15" /><circle className="rs-pulse" cx="150" cy="318" r="6" fill="#FACC15" />
    </svg>
  );
}

type ArtKind = "turtle-bay" | "shura" | "nujuma" | "shebara";

/** Route illustration — each route page gets its own composition. */
export function RouteArt({ kind, alt }: { kind: ArtKind; alt: string }) {
  const dark = kind === "nujuma";
  return (
    <svg viewBox="0 0 800 300" className="h-auto w-full rounded-3xl" role="img" aria-label={alt}>
      <defs>
        <linearGradient id={`ra-sky-${kind}`} x1="0" y1="0" x2="0" y2="1">
          {dark ? (<><stop offset="0" stopColor="#040D1A" /><stop offset="1" stopColor="#12395A" /></>) : kind === "shura" ? (<><stop offset="0" stopColor="#0E7490" /><stop offset="1" stopColor="#A7F3D0" /></>) : kind === "shebara" ? (<><stop offset="0" stopColor="#1D4ED8" /><stop offset="1" stopColor="#BAE6FD" /></>) : (<><stop offset="0" stopColor="#0891B2" /><stop offset="1" stopColor="#FEF3C7" /></>)}
        </linearGradient>
      </defs>
      <rect width="800" height="300" fill={`url(#ra-sky-${kind})`} />
      {dark && (<g fill="#FFFFFF" opacity=".8"><circle cx="90" cy="40" r="1.6" /><circle cx="200" cy="64" r="1.2" /><circle cx="330" cy="30" r="1.6" /><circle cx="480" cy="52" r="1.2" /><circle cx="610" cy="36" r="1.6" /><circle cx="720" cy="70" r="1.2" /><circle cx="740" cy="38" r="14" fill="#FEF9C3" opacity=".95" /></g>)}
      {kind === "turtle-bay" && (
        <g>
          <path d="M0 200 H800 V300 H0 Z" fill="#E7D3A8" />
          <path d="M560 200 H800 V300 H560 Z" fill="#0F766E" opacity=".9" />
          <path d="M540 200 q40 -14 80 0 t80 0 t100 0" stroke="#CCFBF1" strokeWidth="2" fill="none" opacity=".6" />
          <Terminal x={40} y={150} />
          <path className="rs-draw" style={{ ["--len" as string]: 520 }} d="M180 214 C300 226 380 206 520 214" stroke="#0F172A" strokeWidth="4" strokeDasharray="12 9" fill="none" />
          <g className="rs-ride" style={{ offsetPath: "path('M180 192 C300 204 380 184 520 192')" } as React.CSSProperties}><Suv x={-30} y={-6} /></g>
          <rect x="520" y="186" width="70" height="14" rx="3" fill="#F8FAFC" /><rect x="526" y="164" width="58" height="24" rx="4" fill="#FFFFFF" /><rect x="534" y="172" width="42" height="8" fill="#99F6E4" />
          <Boat x={660} y={214} scale={1.2} />
          <T x={110} y={284} c="#0F172A">RSI Airport</T><T x={555} y={284} c="#0F172A">Turtle Bay</T><T x={700} y={284} c="#FFFFFF">Boat onward (separate)</T>
        </g>
      )}
      {kind === "shura" && (
        <g>
          <rect y="190" width="800" height="110" fill="#0F9D8E" />
          <path d="M0 210 q40 -12 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" stroke="#CCFBF1" strokeWidth="2" fill="none" opacity=".5" />
          <path d="M0 190 H250 V300 H0 Z" fill="#E7D3A8" />
          <Terminal x={30} y={140} />
          <path className="rs-draw" style={{ ["--len" as string]: 360 }} d="M160 204 H340" stroke="#0F172A" strokeWidth="4" strokeDasharray="12 9" fill="none" />
          <g className="rs-ride" style={{ offsetPath: "path('M160 184 H330')" } as React.CSSProperties}><Suv x={-30} y={-6} /></g>
          <rect x="250" y="176" width="330" height="9" fill="#F8FAFC" />
          <path d="M280 185 v22 M340 185 v22 M400 185 v22 M460 185 v22 M520 185 v22" stroke="#F8FAFC" strokeWidth="5" />
          <rect x="258" y="160" width="46" height="16" rx="3" fill="#FACC15" /><T x={281} y={172} c="#0F172A">P</T>
          <ellipse cx="680" cy="196" rx="110" ry="22" fill="#F5E6C8" /><Palm x={640} y={190} /><Palm x={690} y={192} /><Palm x={730} y={190} />
          <g transform="translate(560 160)"><rect width="34" height="16" rx="4" fill="#FACC15" /><circle cx="8" cy="19" r="4" fill="#0F172A" /><circle cx="26" cy="19" r="4" fill="#0F172A" /></g>
          <T x={95} y={284} c="#0F172A">RSI Airport</T><T x={281} y={230} c="#FFFFFF">Access / parking</T><T x={430} y={230} c="#FFFFFF">Causeway</T><T x={600} y={230} c="#FFFFFF">Property electric transfer</T>
        </g>
      )}
      {kind === "nujuma" && (
        <g>
          <rect y="205" width="800" height="95" fill="#0B2A4A" />
          <path d="M0 225 q40 -10 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" stroke="#7DD3FC" strokeWidth="2" fill="none" opacity=".35" />
          <path d="M0 205 H230 V300 H0 Z" fill="#1E293B" />
          <Terminal x={30} y={155} />
          <path className="rs-draw" style={{ ["--len" as string]: 220 }} d="M160 218 H300" stroke="#E2E8F0" strokeWidth="4" strokeDasharray="12 9" fill="none" />
          <g className="rs-ride" style={{ offsetPath: "path('M160 198 H290')" } as React.CSSProperties}><Suv x={-30} y={-6} /></g>
          <rect x="296" y="196" width="60" height="9" fill="#CBD5E1" />
          <Boat x={380} y={206} scale={1.1} />
          <path className="rs-draw" style={{ ["--len" as string]: 520, animationDelay: "1.4s" }} d="M330 190 C420 60 560 40 650 150" stroke="#FACC15" strokeWidth="3" strokeDasharray="4 8" fill="none" />
          <g className="rs-float"><Seaplane x={470} y={52} scale={1.2} /></g>
          <ellipse cx="690" cy="206" rx="90" ry="20" fill="#C9A86A" /><Palm x={660} y={200} /><Palm x={710} y={202} /><rect x="676" y="180" width="30" height="10" rx="2" fill="#F8FAFC" />
          <T x={95} y={290} c="#E2E8F0">RSI Airport</T><T x={330} y={230} c="#E2E8F0">Turtle Bay / transfer point</T><T x={440} y={290} c="#FACC15">Boat or seaplane (separate)</T><T x={690} y={238} c="#FDE68A">Nujuma</T>
        </g>
      )}
      {kind === "shebara" && (
        <g>
          <rect y="185" width="800" height="115" fill="#0891B2" />
          <path d="M0 205 q40 -12 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" stroke="#E0F2FE" strokeWidth="2" fill="none" opacity=".6" />
          <path d="M0 185 H300 V300 H0 Z" fill="#E7D3A8" />
          <Terminal x={30} y={135} />
          <path className="rs-draw" style={{ ["--len" as string]: 290 }} d="M160 200 H290" stroke="#0F172A" strokeWidth="4" strokeDasharray="12 9" fill="none" />
          <g className="rs-ride" style={{ offsetPath: "path('M160 178 H270')" } as React.CSSProperties}><Suv x={-30} y={-6} /></g>
          <path className="rs-draw" style={{ ["--len" as string]: 440, animationDelay: "1.2s" }} d="M300 220 C400 250 480 190 600 215" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="3 9" strokeLinecap="round" fill="none" />
          <Boat x={420} y={216} scale={1.2} />
          <path d="M160 140 C320 40 520 40 640 130" stroke="#FFFFFF" strokeOpacity=".7" strokeWidth="2" strokeDasharray="2 8" fill="none" />
          <g className="rs-float"><Seaplane x={380} y={44} scale={1} /></g>
          <ellipse cx="690" cy="215" rx="85" ry="18" fill="#F5E6C8" /><Palm x={665} y={210} /><Palm x={715} y={211} />
          <T x={95} y={270} c="#0F172A">RSI Airport</T><T x={300} y={250} c="#FFFFFF">Turtle Bay</T><T x={440} y={270} c="#FFFFFF">Boat (separate)</T><T x={690} y={250} c="#FFFFFF">Shebara</T><T x={410} y={36} c="#FFFFFF">Seaplane option (separate)</T>
        </g>
      )}
    </svg>
  );
}
