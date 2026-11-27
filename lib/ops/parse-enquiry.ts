// Deterministic enquiry extractor for pasted WhatsApp chats / emails / messages. Pure (no DB, no network).
// Rule: only report what the text actually says. Anything not found stays null and is listed in `missing`.
// The owner always reviews/edits the result before anything is saved.

export type ParsedEnquiry = {
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  language: string | null;
  pickup: string | null;
  dropoff: string | null;
  trip_date: string | null; // YYYY-MM-DD
  trip_time: string | null; // HH:MM 24h
  trip_type: string | null; // one_way | round_trip | airport_transfer | hourly
  passengers: number | null;
  luggage: string | null;
  vehicle: string | null; // sedan | suv | van | bus | limousine
  budget_text: string | null;
  prior_quote_text: string | null;
  preferences: string | null;
  missing: string[];
  warnings: string[];
};

export type ParseResult = {
  bookings: ParsedEnquiry[]; // >1 means the text seems to contain several trips
  conversation: string; // cleaned text, kept as history
};

const MONTHS: Record<string, number> = { jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4, may: 5, jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8, sep: 9, sept: 9, september: 9, oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12 };
const MONTH_RE = "jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?";

const pad = (n: number) => String(n).padStart(2, "0");

/** Ambiguity-safe ISO builder. Returns null for impossible dates. If no year given, uses the next occurrence on/after `today` and warns. */
function buildDate(d: number, m: number, y: number | null, today: Date, warnings: string[]): string | null {
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  let year = y;
  if (year === null) {
    year = today.getUTCFullYear();
    const cand = Date.UTC(year, m - 1, d);
    if (cand < Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())) year += 1;
    warnings.push(`Year not stated — assumed ${year}. Please confirm the date.`);
  } else if (year < 100) year += 2000;
  const dt = new Date(Date.UTC(year, m - 1, d));
  if (dt.getUTCMonth() !== m - 1) return null;
  return `${year}-${pad(m)}-${pad(d)}`;
}

function findDate(text: string, today: Date, warnings: string[]): string | null {
  // 15 October 2026 / 15th Oct / 15-Oct-26
  let m = text.match(new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?[\\s\\-/]*(?:of\\s+)?(${MONTH_RE})\\.?(?:[\\s,\\-/]*(\\d{4}|\\d{2}))?\\b`, "i"));
  if (m) return buildDate(+m[1], MONTHS[m[2].toLowerCase()], m[3] ? +m[3] : null, today, warnings);
  // October 15(th), 2026
  m = text.match(new RegExp(`\\b(${MONTH_RE})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s*(\\d{4}))?\\b`, "i"));
  if (m) return buildDate(+m[2], MONTHS[m[1].toLowerCase()], m[3] ? +m[3] : null, today, warnings);
  // 15/10/2026 — day-first (Saudi / UK usage). Flag when day <= 12 because it could be read month-first.
  m = text.match(/\b(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4}|\d{2})\b/);
  if (m) {
    if (+m[1] <= 12 && +m[2] <= 12 && +m[1] !== +m[2]) warnings.push(`Date "${m[0]}" read as day/month/year — please confirm.`);
    return buildDate(+m[1], +m[2], +m[3], today, warnings);
  }
  return null;
}

function findTime(text: string): string | null {
  let m = text.match(/\b(\d{1,2})[:.](\d{2})\s*(am|pm|a\.m\.|p\.m\.)\b/i) ?? text.match(/\b(\d{1,2})()\s*(am|pm)\b/i);
  if (m) {
    let h = +m[1];
    const min = m[2] ? +m[2] : 0;
    const pm = /^p/i.test(m[3]);
    if (h < 1 || h > 12 || min > 59) return null;
    if (pm && h < 12) h += 12;
    if (!pm && h === 12) h = 0;
    return `${pad(h)}:${pad(min)}`;
  }
  m = text.match(/\b(?:at|time|pickup|pick up|pick-up|@)\s*:?\s*([01]?\d|2[0-3]):([0-5]\d)\b/i) ?? text.match(/\b([01]\d|2[0-3]):([0-5]\d)\b/);
  if (m) return `${pad(+m[1])}:${m[2]}`;
  return null;
}

const VEHICLES: [RegExp, string][] = [
  [/\b(?:limousine|limo|vip|executive)\b/i, "limousine"],
  [/\b(?:bus|coaster|coach|minibus)\b/i, "bus"],
  [/\b(?:van|staria|hiace|minivan|mpv|family car|7[\s-]?seat(?:er)?)\b/i, "van"],
  [/\b(?:suv|gmc|yukon|tahoe|suburban|4x4|land cruiser|full[\s-]?size)\b/i, "suv"],
  [/\b(?:sedan|camry|sonata|accord|economy car|normal car)\b/i, "sedan"],
];

const CLEAN_PLACE = (s: string) =>
  s.replace(/\s+/g, " ").replace(/^[\s:,\-–]+|[\s.,;:!?\-–]+$/g, "").replace(/\s+(?:on|at|for|by|with|around|about|please|pls|and)\b.*$/i, "").trim();

function findRoute(text: string): { pickup: string | null; dropoff: string | null } {
  const label = (names: string) => {
    const m = text.match(new RegExp(`(?:^|\\n|[,;]\\s*)\\s*(?:${names})\\s*(?:location|point|address)?\\s*[:\\-–]\\s*([^\\n,;]{3,80})`, "i"));
    return m ? CLEAN_PLACE(m[1]) : null;
  };
  const pickup = label("pick\\s*-?\\s*up|from|origin|start");
  const dropoff = label("drop\\s*-?\\s*off|drop|to|destination|dest");
  if (pickup && dropoff) return { pickup, dropoff };
  // "from X to Y"
  let m = text.match(/\bfrom\s+(.{3,60}?)\s+(?:to|towards|till|until)\s+(.{3,60}?)(?=[\n.,;!?]|\s+(?:on|at|for|by|with|around|please|pls|\d)\b|$)/i);
  if (m) return { pickup: pickup ?? CLEAN_PLACE(m[1]), dropoff: dropoff ?? CLEAN_PLACE(m[2]) };
  // "X to Y" with arrows / "->"
  m = text.match(/([A-Za-z][\w &'./()\-]{2,50}?)\s*(?:->|→|=>|–>)\s*([A-Za-z][\w &'./()\-]{2,50})/);
  if (m) return { pickup: pickup ?? CLEAN_PLACE(m[1]), dropoff: dropoff ?? CLEAN_PLACE(m[2]) };
  // "taxi/transfer/ride/car <anything>? to Y" — only drop-off reliably known, plus optional "X to Y" on one line
  m = text.match(/\b(?:transfer|taxi|ride|car|cab|drive|pickup|pick up)\s+(?:from\s+)?(.{3,50}?)\s+to\s+(.{3,50}?)(?=[\n.,;!?]|\s+(?:on|at|for|by|with|around|please|pls|\d)\b|$)/i);
  if (m) return { pickup: pickup ?? CLEAN_PLACE(m[1]), dropoff: dropoff ?? CLEAN_PLACE(m[2]) };
  return { pickup, dropoff };
}

/** WhatsApp export line: "[12/10/2026, 3:45 pm] Name: text" or "12/10/2026, 15:45 - Name: text" */
const WA_LINE = /^\s*\[?\d{1,2}[\/.]\d{1,2}[\/.]\d{2,4},?\s+\d{1,2}[:.]\d{2}(?::\d{2})?\s*(?:[ap]\.?m\.?)?\]?\s*(?:-\s*)?([^:]{1,40}):\s?(.*)$/i;

function splitSenders(text: string): { sender: string | null; body: string }[] {
  const out: { sender: string | null; body: string }[] = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(WA_LINE);
    if (m) out.push({ sender: m[1].trim(), body: m[2] });
    else if (out.length) out[out.length - 1].body += "\n" + line;
    else out.push({ sender: null, body: line });
  }
  return out;
}

function parseOne(text: string, customerSender: string | null, today: Date): ParsedEnquiry {
  const warnings: string[] = [];
  const flat = text.replace(/[ \t]+/g, " ");

  const email = flat.match(/[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/i)?.[0] ?? null;
  const phoneM = flat.match(/(?:\+|00)\s?\d[\d\s\-().]{7,17}\d/) ?? flat.match(/\b05\d{8}\b/) ?? flat.match(/\b5\d{8}\b/);
  let phone = phoneM ? phoneM[0].replace(/[^\d+]/g, "") : null;
  if (phone?.startsWith("00")) phone = "+" + phone.slice(2);
  if (!phone && customerSender && /^\+?[\d\s\-()]{9,18}$/.test(customerSender)) phone = customerSender.replace(/[^\d+]/g, "");
  if (phone && /^05\d{8}$/.test(phone)) { warnings.push("Saudi mobile written without country code — +966 assumed."); phone = "+966" + phone.slice(1); }

  let name = customerSender;
  const nameM = flat.match(/\b(?:my name is|i am|i'm|this is|name)\s*[:\-]?\s*([A-Z][A-Za-z.'\-]+(?:\s+[A-Z][A-Za-z.'\-]+){0,3})/);
  if (nameM) nameM[1] = nameM[1].replace(/[.'\-]+$/, "");
  if (nameM && !/^(?:Looking|Interested|Travelling|Traveling|Coming|Arriving|Planning)\b/.test(nameM[1])) name = nameM[1];
  if (name && /^\+?[\d\s\-]+$/.test(name)) name = null; // WhatsApp shows the number when contact isn't saved

  const route = findRoute(flat);
  const trip_date = findDate(flat, today, warnings);
  const trip_time = findTime(flat);

  let passengers: number | null = null;
  const pax = flat.match(/\b(\d{1,2})\s*(?:pax|passengers?|persons?|people|adults?|guests?|travell?ers?|members?)\b/i) ?? flat.match(/\b(?:pax|passengers?|persons?|people)\s*[:=\-]?\s*(\d{1,2})\b/i);
  if (pax) { const n = +pax[1]; if (n >= 1 && n <= 60) passengers = n; }

  const lug = flat.match(/\b(\d{1,2})\s*(?:big|large|small|medium|cabin|check-?in)?\s*(?:bags?|suitcases?|luggage|baggage|cases|trolleys?)\b/i) ?? flat.match(/\b(?:luggage|baggage|bags?)\s*[:=\-]?\s*(\d{1,2}[^\n.]{0,30})/i);
  const luggage = lug ? lug[0].trim() : null;

  let vehicle: string | null = null;
  for (const [re, v] of VEHICLES) if (re.test(flat)) { vehicle = v; break; }

  let trip_type: string | null = null;
  if (/\b(?:round[\s-]?trip|return (?:trip|journey)|and back|come back|two[\s-]?way|2[\s-]?way)\b/i.test(flat)) trip_type = "round_trip";
  else if (/\b(?:per hour|hourly|by the hour|\d+\s*hours? (?:hire|rental|tour)|full day|half day|day rental)\b/i.test(flat)) trip_type = "hourly";
  else if (/\b(?:airport|flight|arrival|arriving|terminal)\b/i.test(flat)) trip_type = "airport_transfer";
  else if (/\bone[\s-]?way\b/i.test(flat) || (route.pickup && route.dropoff)) trip_type = "one_way";

  const bud = flat.match(/\b(?:budget|max|up to|around|can pay|willing to pay)\s*(?:is|of|:)?\s*((?:sar|sr|riyals?|usd|\$|aed)?\s*\d[\d,]*(?:\.\d+)?\s*(?:sar|sr|riyals?|usd|aed)?)/i);
  const budget_text = bud ? bud[0].trim() : null;

  // Prices already quoted in the chat (any amount tagged SAR/SR/riyal that is not the stated budget).
  const prices = [...flat.matchAll(/(?:(?:sar|sr|rs\.?)\s*(\d[\d,]*)|(\d[\d,]*)\s*(?:sar|sr|riyals?))/gi)].map((x) => x[0].trim());
  const prior_quote_text = prices.filter((p) => !budget_text || !budget_text.includes(p)).slice(0, 6).join("; ") || null;

  const prefM = flat.match(/\b(?:prefer(?:s|red)?|require[sd]?|must have|child seat|baby seat|wheelchair|female driver|english[- ]speaking|arabic[- ]speaking|wifi|water)\b[^\n.]{0,80}/gi);
  const preferences = prefM ? [...new Set(prefM.map((s) => s.trim()))].slice(0, 5).join("; ") : null;

  const language = /[؀-ۿ]{3,}/.test(flat) ? "ar" : flat.trim().length > 15 ? "en" : null;

  const out: ParsedEnquiry = {
    customer_name: name, customer_phone: phone, customer_email: email, language,
    pickup: route.pickup, dropoff: route.dropoff, trip_date, trip_time, trip_type, passengers, luggage, vehicle,
    budget_text, prior_quote_text, preferences, missing: [], warnings,
  };
  const required: [keyof ParsedEnquiry, string][] = [["customer_name", "name"], ["customer_phone", "phone / WhatsApp"], ["pickup", "pickup"], ["dropoff", "drop-off"], ["trip_date", "date"], ["trip_time", "time"], ["passengers", "passengers"], ["vehicle", "vehicle"]];
  out.missing = required.filter(([k]) => out[k] === null || out[k] === "").map(([, label]) => label);
  return out;
}

/** Split into several trips only when the text contains multiple distinct explicit "from X to Y" routes. */
function splitTrips(text: string): string[] {
  const routeRe = /\bfrom\s+.{3,60}?\s+to\s+.{3,60}?(?=[\n.,;!?]|\s+(?:on|at|for|by|with|around|please|pls|\d)\b|$)|[A-Za-z][\w &'./()\-]{2,50}?\s*(?:->|→|=>)\s*[A-Za-z][\w &'./()\-]{2,50}/gi;
  const hits = [...text.matchAll(routeRe)];
  const key = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");
  const distinct = new Map<string, number>();
  for (const h of hits) if (!distinct.has(key(h[0]))) distinct.set(key(h[0]), h.index ?? 0);
  if (distinct.size < 2) return [text];
  const starts = [...distinct.values()].sort((a, b) => a - b);
  // cut at the start of the line holding each route so date/time on the same line stay with it
  const lineStart = (i: number) => text.lastIndexOf("\n", i) + 1;
  const cuts = starts.map(lineStart);
  const uniq = [...new Set(cuts)];
  if (uniq.length < 2) return [text];
  return uniq.map((c, i) => text.slice(c, uniq[i + 1] ?? text.length));
}

export function parseEnquiry(raw: string, today: Date = new Date()): ParseResult {
  const text = raw.replace(/‎|‏/g, "").trim();
  const turns = splitSenders(text);
  const senders = [...new Set(turns.map((t) => t.sender).filter((s): s is string => !!s))];
  // Customer = the sender who is not the business. We cannot know which side is the owner, so if exactly one
  // sender looks like an unsaved number or the only sender, use it; with two senders leave name to be confirmed.
  let customerSender: string | null = null;
  if (senders.length === 1) customerSender = senders[0];
  else if (senders.length === 2) {
    const own = senders.find((s) => /taxi|saudi|tsa|support|admin|driver/i.test(s));
    customerSender = senders.find((s) => s !== own) ?? null;
  }
  const customerText = senders.length >= 2 && customerSender
    ? turns.filter((t) => t.sender === customerSender).map((t) => t.body).join("\n")
    : turns.map((t) => t.body).join("\n");

  const parts = splitTrips(customerText);
  const bookings = parts.map((p) => parseOne(p, customerSender, today));
  // Contact details usually appear once — share them across trips from the same chat.
  const shared = bookings.find((b) => b.customer_phone || b.customer_email);
  for (const b of bookings) {
    b.customer_phone ??= shared?.customer_phone ?? null;
    b.customer_email ??= shared?.customer_email ?? null;
    if (!b.customer_name) b.customer_name = bookings.find((x) => x.customer_name)?.customer_name ?? null;
    if (!b.prior_quote_text && senders.length >= 2) {
      const ownText = turns.filter((t) => t.sender !== customerSender).map((t) => t.body).join("\n");
      const p = [...ownText.matchAll(/(?:(?:sar|sr)\s*(\d[\d,]*)|(\d[\d,]*)\s*(?:sar|sr|riyals?))/gi)].map((x) => x[0].trim());
      b.prior_quote_text = p.slice(0, 6).join("; ") || null;
    }
    b.missing = b.missing.filter((m) => !(m === "name" && b.customer_name) && !(m === "phone / WhatsApp" && b.customer_phone));
  }
  return { bookings, conversation: text };
}
