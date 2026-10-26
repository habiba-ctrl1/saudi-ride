import { Font, Image, Path, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";
import path from "path";
import { readFileSync } from "node:fs";
import { contactConfig } from "@/lib/config/contact";

// Shared look for every TSA customer document (quotation, receipt, invoice). Reproduces the approved client PDFs
// (client-quotations/Quoted/TSA-2026-0041-… and Completed/TSA-2026-0052-…): green header band with the TSA logo,
// grey rounded cards, green table header, yellow payment card. CSS px are converted to PDF pt (×0.75).

export const C = { green: "#16A34A", yellow: "#FACC15", ink: "#111827", muted: "#6B7280", line: "#E5E7EB", soft: "#F9FAFB", amber: "#B45309", pay: "#FFFDF3" };
export const px = (n: number) => n * 0.75;
const MM = 2.8346; // pt per mm
export const SIDE = 16 * MM;

const f = (name: string) => path.join(process.cwd(), "lib/pdf/fonts", name);
Font.register({
  family: "OpenSans",
  fonts: [
    { src: f("OpenSans_400Regular.ttf"), fontWeight: 400 },
    { src: f("OpenSans_600SemiBold.ttf"), fontWeight: 600 },
    { src: f("OpenSans_700Bold.ttf"), fontWeight: 700 },
    { src: f("OpenSans_800ExtraBold.ttf"), fontWeight: 800 },
  ],
});
Font.register({
  family: "ArabicSans",
  fonts: [
    { src: f("Tajawal_400Regular.ttf"), fontWeight: 400 },
    { src: f("Tajawal_700Bold.ttf"), fontWeight: 700 },
  ],
});
// Breaking words at hyphens/slashes makes long route names ugly; keep default word breaking.
Font.registerHyphenationCallback((w) => [w]);

export const LOGO = { data: readFileSync(path.join(process.cwd(), "lib/pdf/tsa-logo-green.png")), format: "png" as const };

export const s = StyleSheet.create({
  page: { fontFamily: "OpenSans", fontSize: px(12), color: C.ink, paddingBottom: 18 },
  head: { backgroundColor: C.green, paddingVertical: px(20), paddingHorizontal: SIDE, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { flexDirection: "row", alignItems: "center" },
  logo: { height: px(58), width: (px(58) * 948) / 650, marginRight: px(14) },
  name: { fontSize: px(22), fontWeight: 800, color: C.yellow, letterSpacing: 0.3 },
  tag: { fontSize: px(9.5), color: "#EAFBE9", letterSpacing: 1.05, textTransform: "uppercase", marginTop: px(4) },
  contact: { fontSize: px(10), color: "#D9F5D7", marginTop: px(4) },
  doc: { alignItems: "flex-end" },
  docT: { fontSize: px(24), fontWeight: 800, color: "#FFFFFF", letterSpacing: 1.5 },
  docAr: { fontFamily: "ArabicSans", fontSize: px(12), color: "#EAFBE9", marginTop: 4 },
  badge: { marginTop: px(8), backgroundColor: C.yellow, paddingVertical: px(4), paddingHorizontal: px(9), borderRadius: px(5), flexDirection: "row", alignItems: "center" },
  badgeT: { color: "#111111", fontSize: px(9.5), fontWeight: 700, letterSpacing: 0.2 },
  body: { paddingTop: px(22), paddingHorizontal: SIDE },
  parties: { flexDirection: "row" },
  party: { flex: 1, backgroundColor: C.soft, borderWidth: 0.75, borderColor: C.line, borderRadius: px(10), paddingVertical: px(14), paddingHorizontal: px(16) },
  partyGap: { width: px(16) },
  h3: { fontSize: px(11), fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.45, color: C.green, marginBottom: px(10) },
  nm: { fontSize: px(14), fontWeight: 700 },
  nmAr: { fontFamily: "ArabicSans", fontSize: px(12), color: C.muted, textAlign: "right", marginTop: 4, marginBottom: px(6) },
  kv: { flexDirection: "row", marginTop: px(3) },
  k: { width: px(86), color: C.muted, fontSize: px(12) },
  v: { flex: 1, fontSize: px(12) },
  strip: { flexDirection: "row", marginTop: px(16), borderWidth: 0.75, borderColor: C.line, borderRadius: px(10), overflow: "hidden" },
  cell: { flex: 1, paddingVertical: px(11), paddingHorizontal: px(16) },
  cellDiv: { borderLeftWidth: 0.75, borderLeftColor: C.line },
  cellK: { color: C.muted, fontSize: px(10.5), textTransform: "uppercase", letterSpacing: 0.3 },
  cellV: { fontWeight: 600, fontSize: px(12), marginTop: px(3) },
  veh: { backgroundColor: C.soft, borderWidth: 0.75, borderColor: C.line, borderRadius: px(12), paddingVertical: px(14), paddingHorizontal: px(18) },
  vehH: { fontSize: px(16), fontWeight: 700, color: C.green, marginBottom: px(4) },
  vehP: { fontSize: px(12.5), color: C.muted, lineHeight: 1.6, marginTop: px(6) },
  plate: { alignSelf: "flex-start", marginTop: px(8), paddingVertical: px(5), paddingHorizontal: px(12), borderWidth: 1.5, borderColor: C.ink, borderRadius: px(7), flexDirection: "row", alignItems: "center" },
  plateK: { fontSize: px(10), color: C.muted, marginRight: px(8) },
  plateV: { fontSize: px(15), fontWeight: 800, letterSpacing: 0.75 },
  th: { backgroundColor: C.green, flexDirection: "row", paddingVertical: px(11), paddingHorizontal: px(14) },
  thT: { color: "#FFFFFF", fontSize: px(11), fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 },
  tr: { flexDirection: "row", paddingVertical: px(13), paddingHorizontal: px(14), borderBottomWidth: 0.75, borderBottomColor: C.line },
  cDesc: { flex: 1, paddingRight: px(10) },
  cRate: { width: px(86), textAlign: "right" },
  cQty: { width: px(52), textAlign: "right" },
  cAmt: { width: px(86), textAlign: "right" },
  descMain: { fontSize: px(12.5), fontWeight: 600 },
  descSub: { fontSize: px(11.5), color: C.muted, marginTop: px(4), lineHeight: 1.5 },
  num: { fontSize: px(12.5) },
  totals: { width: px(280), marginLeft: "auto", marginTop: px(10) },
  tRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: px(5) },
  tRowK: { fontSize: px(13), color: C.muted },
  tRowV: { fontSize: px(13), color: C.ink },
  grand: { marginTop: px(8), paddingVertical: px(12), paddingHorizontal: px(14), backgroundColor: C.green, borderRadius: px(10), flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  grandT: { color: "#FFFFFF", fontSize: px(15), fontWeight: 700 },
  pay: { marginTop: px(14), borderWidth: 0.75, borderColor: C.yellow, backgroundColor: C.pay, borderRadius: px(10), paddingVertical: px(10), paddingHorizontal: px(16) },
  payH: { fontSize: px(11), fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.45, color: C.amber, marginBottom: px(8) },
  payAfter: { marginTop: px(8), fontSize: px(11.5), color: C.amber },
  terms: { marginTop: px(12) },
  li: { flexDirection: "row", marginBottom: px(2) },
  liDot: { width: px(14), color: C.muted, fontSize: px(11.5) },
  liT: { flex: 1, color: C.muted, fontSize: px(11.5), lineHeight: 1.6 },
  foot: { marginTop: px(8), paddingTop: px(6), borderTopWidth: 0.75, borderTopColor: C.line },
  footT: { fontSize: px(10.5), color: C.muted, lineHeight: 1.6 },
  footAr: { fontFamily: "ArabicSans", fontSize: px(10.5), color: C.muted, lineHeight: 1.6, textAlign: "right" },
  stamp: { position: "absolute", left: 20 * MM, top: 163 * MM, borderWidth: 3, borderRadius: px(10), paddingVertical: px(6), paddingHorizontal: px(22), alignItems: "center", transform: "rotate(-5deg)", opacity: 0.85 },
  stampMain: { fontSize: px(34), fontWeight: 800, letterSpacing: px(6) },
  stampSub: { fontSize: px(11), fontWeight: 700, letterSpacing: px(1) },
});

export function Arrow({ size = 9, color = C.green }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={{ marginRight: 3 }}>
      <Path d="M4 12 H18 M13 6 L19 12 L13 18" stroke={color} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
export function Tick({ size = 9, color = "#111111" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={{ marginLeft: 3 }}>
      <Path d="M4 12.5 L9.5 18 L20 6.5" stroke={color} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function Header({ title, titleAr, badge, tick }: { title: string; titleAr: string; badge?: string; tick?: boolean }) {
  return (
    <View style={s.head}>
      <View style={s.brand}>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt prop */}
        <Image src={LOGO} style={s.logo} />
        <View>
          <Text style={s.name}>Taxi Saudi Arabia</Text>
          <Text style={s.tag}>Premium Chauffeur & Transportation</Text>
          <Text style={s.contact}>www.taxisaudiarabia.com  |  Booking via WhatsApp</Text>
        </View>
      </View>
      <View style={s.doc}>
        <Text style={s.docT}>{title}</Text>
        <Text style={s.docAr}>{titleAr}</Text>
        {badge ? <View style={s.badge}><Text style={s.badgeT}>{badge}</Text>{tick ? <Tick /> : null}</View> : null}
      </View>
    </View>
  );
}

export const KV = ({ k, v }: { k: string; v: string }) => <View style={s.kv}><Text style={s.k}>{k}</Text><Text style={s.v}>{v}</Text></View>;

export function Party({ title, name, nameAr, rows }: { title: string; name: string; nameAr?: string; rows: [string, string][] }) {
  return (
    <View style={s.party}>
      <Text style={s.h3}>{title}</Text>
      <Text style={s.nm}>{name}</Text>
      {nameAr ? <Text style={s.nmAr}>{nameAr}</Text> : <View style={{ height: px(8) }} />}
      {rows.map(([k, v]) => <KV key={k} k={k} v={v} />)}
    </View>
  );
}

export function Strip({ service, dates, route }: { service: string; dates: string; route: [string, string] }) {
  return (
    <View style={s.strip}>
      <View style={s.cell}><Text style={s.cellK}>Service</Text><Text style={s.cellV}>{service}</Text></View>
      <View style={[s.cell, s.cellDiv]}><Text style={s.cellK}>Dates</Text><Text style={s.cellV}>{dates}</Text></View>
      <View style={[s.cell, s.cellDiv]}>
        <Text style={s.cellK}>Route</Text>
        <Text style={s.cellV}>{route[0]}</Text>
        <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 1 }}><View style={{ marginTop: 2 }}><Arrow /></View><Text style={[s.cellV, { marginTop: 0, flex: 1 }]}>{route[1]}</Text></View>
      </View>
    </View>
  );
}

export function VehicleCard({ name, desc, plate, marginTop }: { name: string; desc: string; plate?: string | null; marginTop: number }) {
  return (
    <View style={[s.veh, { marginTop }]}>
      <Text style={s.vehH}>{name}</Text>
      <Text style={s.vehP}>{desc}</Text>
      {plate ? <View style={s.plate}><Text style={s.plateK}>Assigned plate</Text><Text style={s.plateV}>{plate}</Text></View> : null}
    </View>
  );
}

export type Item = { desc: string; sub?: string; rate: string; qty: string; amount: string };
export function ItemsTable({ items, marginTop }: { items: Item[]; marginTop: number }) {
  return (
    <View style={{ marginTop }}>
      <View style={s.th}>
        <Text style={[s.thT, s.cDesc]}>Description</Text><Text style={[s.thT, s.cRate]}>Rate</Text><Text style={[s.thT, s.cQty]}>Qty</Text><Text style={[s.thT, s.cAmt]}>Amount</Text>
      </View>
      {items.map((it, i) => (
        <View key={i} style={s.tr} wrap={false}>
          <View style={s.cDesc}><Text style={s.descMain}>{it.desc}</Text>{it.sub ? <Text style={s.descSub}>{it.sub}</Text> : null}</View>
          <Text style={[s.num, s.cRate]}>{it.rate}</Text><Text style={[s.num, s.cQty]}>{it.qty}</Text><Text style={[s.num, s.cAmt]}>{it.amount}</Text>
        </View>
      ))}
    </View>
  );
}

export function Totals({ rows, grandLabel, grandValue, marginTop }: { rows?: [string, string][]; grandLabel: string; grandValue: string; marginTop: number }) {
  return (
    <View style={[s.totals, { marginTop }]} wrap={false}>
      {rows?.map(([k, v]) => <View key={k} style={s.tRow}><Text style={s.tRowK}>{k}</Text><Text style={s.tRowV}>{v}</Text></View>)}
      <View style={s.grand}><Text style={s.grandT}>{grandLabel}</Text><Text style={s.grandT}>{grandValue}</Text></View>
    </View>
  );
}

export function PayCard({ rows, after, marginTop, padV }: { rows: [string, string][]; after?: string; marginTop: number; padV?: number }) {
  return (
    <View style={[s.pay, { marginTop }, padV ? { paddingVertical: padV } : {}]} wrap={false}>
      <Text style={s.payH}>Payment</Text>
      {rows.map(([k, v]) => <KV key={k} k={k} v={v} />)}
      {after ? <Text style={s.payAfter}>{after}</Text> : null}
    </View>
  );
}

export function Terms({ items, marginTop }: { items: string[]; marginTop: number }) {
  return (
    <View style={[s.terms, { marginTop }]} wrap={false}>
      <Text style={s.h3}>Terms</Text>
      {items.map((t, i) => <View key={i} style={s.li}><Text style={s.liDot}>•</Text><Text style={s.liT}>{t}</Text></View>)}
    </View>
  );
}

export function Foot({ en, ar, marginTop, contact = true }: { en: string; ar: string; marginTop: number; contact?: boolean }) {
  return (
    <View style={[s.foot, { marginTop }]} wrap={false}>
      <Text style={s.footT}>{en}</Text>
      <Text style={s.footAr}>{ar}</Text>
      {contact ? <Text style={[s.footT, { marginTop: 2 }]}>{contactConfig.primaryPhoneDisplay} · {contactConfig.email}</Text> : null}
    </View>
  );
}

export const money = (n: number) => (Number.isInteger(n) ? n.toLocaleString("en-US") : n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
export const fmtDate = (d: string | Date) => new Date(typeof d === "string" ? `${d.slice(0, 10)}T12:00:00` : d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
export const fmtDow = (d: string) => new Date(`${d.slice(0, 10)}T12:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
