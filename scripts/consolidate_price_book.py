# -*- coding: utf-8 -*-
"""
Consolidates all Price Book sources into one master approval workbook.

Source A: data/pricing-book-source-a-export.json (83 WhatsApp-chat-observed
          client prices, exported from the live PriceBookEntry table)
Source B: drivers/naimatullah/price sheet.xlsx (vendor/driver COST rate
          card). Per owner instruction 2026-09-20: vendor cost + SAR 100
          flat margin = suggested client price, kept clearly labeled as
          DERIVED, never blended silently with real observed client quotes.

Outputs:
  - TAXI-SAUDI-PRICE-BOOK-APPROVAL.xlsx  (4-sheet approval workbook)
  - data/pricing-book-consolidated.json  (machine-readable aggregates, for
    the follow-up TS script that upserts RoutePriceApproval rows)

Run: python scripts/consolidate_price_book.py
"""
import json
import datetime
from pathlib import Path
from openpyxl.utils.datetime import to_excel

ROOT = Path(r"C:\Users\786\Documents\WEBSITES\project\taxidriver")
SOURCE_A_JSON = ROOT / "data" / "pricing-book-source-a-export.json"
SOURCE_B_XLSX = ROOT / "drivers" / "naimatullah" / "price sheet.xlsx"
OUT_XLSX = ROOT / "TAXI-SAUDI-PRICE-BOOK-APPROVAL.xlsx"
OUT_JSON = ROOT / "data" / "pricing-book-consolidated.json"

VENDOR_MARGIN = 100  # SAR, flat margin added to Naimatullah vendor cost -> suggested client price, per owner instruction

# ---------------------------------------------------------------------------
# Normalization tables
# ---------------------------------------------------------------------------

CITY_KEYWORDS = [
    # (canonical city, [substrings to match, lowercase])
    ("Riyadh", ["riyadh"]),
    ("Jeddah", ["jeddah"]),
    ("Makkah", ["makkah", "mecca"]),
    ("Madinah", ["madinah", "madina"]),
    ("Dammam", ["dammam"]),
    ("Khobar", ["khobar"]),
    ("Dhahran", ["dhahran"]),
    ("Jubail", ["jubail"]),
    ("Abha", ["abha"]),
    ("Taif", ["taif"]),
    ("Yanbu", ["yanbu"]),
    ("Al-Ula", ["al-ula", "alula", "al ula"]),
    ("Tabuk", ["tabuk"]),
    ("NEOM/Oxagon", ["neom", "oxagon"]),
    ("Hail", ["hail", "ha'il"]),
    ("Al Qasim", ["qasim", "qassim"]),
    ("Jazan", ["jazan"]),
    ("Rijal Almaa", ["rijal"]),
    ("Ras Tanura", ["ras tanura"]),
    ("Safwa", ["safwa"]),
    ("Hanak", ["hanak"]),
    ("Dubai", ["dubai"]),
    ("Doha/Qatar", ["doha", "qatar"]),
    ("Bahrain", ["bahrain", "manama"]),
    ("Aqaba/Jordan", ["aqaba", "jordan"]),
    ("Kuwait", ["kuwait"]),
]

COUNTRY_OF = {
    "Riyadh": "SA", "Jeddah": "SA", "Makkah": "SA", "Madinah": "SA", "Dammam": "SA",
    "Khobar": "SA", "Dhahran": "SA", "Jubail": "SA", "Abha": "SA", "Taif": "SA",
    "Yanbu": "SA", "Al-Ula": "SA", "Tabuk": "SA", "NEOM/Oxagon": "SA", "Hail": "SA",
    "Al Qasim": "SA", "Jazan": "SA", "Rijal Almaa": "SA", "Ras Tanura": "SA",
    "Safwa": "SA", "Hanak": "SA",
    "Dubai": "AE", "Doha/Qatar": "QA", "Bahrain": "BH", "Aqaba/Jordan": "JO",
    "Kuwait": "KW",
}

# Non-taxi service lines to exclude entirely from route/vehicle pricing structure
EXCLUDE_VEHICLE_TYPES = {"recovery/tow truck"}


def normalize_city(raw: str) -> str:
    if not raw:
        return "Unknown"
    low = raw.lower()
    for canon, keywords in CITY_KEYWORDS:
        if any(k in low for k in keywords):
            return canon
    return raw.strip()


def vehicle_category(raw: str) -> str:
    """Maps a raw vehicleType string to one of: Sedan, GMC/SUV, Staria, Luxury, Other"""
    if not raw:
        return "Other"
    low = raw.lower().strip()
    if low in EXCLUDE_VEHICLE_TYPES:
        return "Exclude"
    if low == "sedan":
        return "Sedan"
    if low == "suv":
        return "GMC/SUV"
    if low == "van":
        return "Staria"
    if low == "suv/van":
        return "Ambiguous SUV/Van"
    if low == "luxury":
        return "Luxury"
    if low == "gmc yukon xl":
        return "GMC/SUV"
    if low == "staria":
        return "Staria"
    if low == "unspecified":
        return "Unspecified"
    return "Other"


def route_family(from_raw: str, to_raw: str) -> str:
    fc, tc = normalize_city(from_raw), normalize_city(to_raw)
    if fc == tc:
        # Same city on both ends (e.g. a district -> that city's airport) -
        # label as a local/airport transfer rather than the confusing "X -> X".
        return f"{fc} (local / airport transfer)"
    return f"{fc} → {tc}"


def is_cross_border(from_raw: str, to_raw: str) -> bool:
    fc = COUNTRY_OF.get(normalize_city(from_raw), "SA")
    tc = COUNTRY_OF.get(normalize_city(to_raw), "SA")
    return fc != tc


def excel_serial_to_number(v):
    if isinstance(v, datetime.datetime):
        return int(round(to_excel(v)))
    return v


# ---------------------------------------------------------------------------
# Load Source A (WhatsApp chat evidence, already in DB)
# ---------------------------------------------------------------------------

with open(SOURCE_A_JSON, "r", encoding="utf-8") as f:
    source_a_raw = json.load(f)

evidence = []  # unified evidence list feeding both sheets

for row in source_a_raw:
    vcat = vehicle_category(row["vehicleType"])
    if vcat == "Exclude":
        continue
    evidence.append({
        "entryId": row["id"],
        "routeFamily": route_family(row["fromCity"], row["toCity"]),
        "crossBorder": is_cross_border(row["fromCity"], row["toCity"]),
        "countryFrom": COUNTRY_OF.get(normalize_city(row["fromCity"]), "SA"),
        "countryTo": COUNTRY_OF.get(normalize_city(row["toCity"]), "SA"),
        "vehicleCategory": vcat,
        "vehicleRaw": row["vehicleType"],
        "price": row["price"],
        "currency": row["currency"],
        "tripType": row["tripType"],
        "pickup": row["fromCity"],
        "dropoff": row["toCity"],
        "source": "WhatsApp Chat (client-observed)",
        "sourceRef": "data/pricing-book.md / price_book_entries id " + row["id"],
        "date": row["createdAt"][:10],
        "notes": row.get("notes") or "",
        "isDerived": False,
        "isVendorCost": False,
        "priceKind": "CLIENT_OBSERVED",
    })

# ---------------------------------------------------------------------------
# Load Source B (Naimatullah vendor rate card)
# ---------------------------------------------------------------------------

import openpyxl
wb_b = openpyxl.load_workbook(SOURCE_B_XLSX, data_only=True)
ws = wb_b["All Rates"]  # Vehicle, Route/Service, Visa Type, Vendor Rate (SAR)

naimatullah_rows = []
for row in ws.iter_rows(min_row=2, values_only=True):
    if not row[0]:
        continue
    vehicle_raw, route_raw, visa_type, rate = row
    rate = excel_serial_to_number(rate)
    naimatullah_rows.append((vehicle_raw, route_raw, visa_type, rate))

VEHICLE_SHEET_MAP = {"Sedan": "Sedan", "Staria": "Staria", "GMC Yukon XL": "GMC/SUV"}

for vehicle_raw, route_raw, visa_type, vendor_cost in naimatullah_rows:
    vcat = VEHICLE_SHEET_MAP.get(vehicle_raw, "Other")
    # Naimatullah's "Route / Service" values are things like "Jeddah -> Makkah",
    # "Makkah Ziyarat" (local sightseeing package, not point-to-point).
    if "→" in route_raw or "->" in route_raw:
        parts = route_raw.replace("->", "→").split("→")
        frm, to = parts[0].strip(), parts[1].strip()
        rf = route_family(frm, to)
        cb = is_cross_border(frm, to)
        cfrom = COUNTRY_OF.get(normalize_city(frm), "SA")
        cto = COUNTRY_OF.get(normalize_city(to), "SA")
        pickup, dropoff = frm, to
    else:
        # Local package (Ziyarat tours) - not a point-to-point corridor
        rf = route_raw.strip()
        cb = False
        cfrom = cto = "SA"
        pickup, dropoff = route_raw.strip(), route_raw.strip()

    visa_note = f"; visa type: {visa_type}" if visa_type and visa_type != "Any" else ""

    # 1) raw vendor cost (reference only, NOT blended into client price range)
    evidence.append({
        "entryId": None,
        "routeFamily": rf, "crossBorder": cb, "countryFrom": cfrom, "countryTo": cto,
        "vehicleCategory": vcat, "vehicleRaw": vehicle_raw,
        "price": vendor_cost, "currency": "SAR", "tripType": "ONE_WAY",
        "pickup": pickup, "dropoff": dropoff,
        "source": "Vendor Rate Card (Naimatullah) - COST, not client price",
        "sourceRef": "drivers/naimatullah/price sheet.xlsx",
        "date": "2026-08-14",  # file mtime
        "notes": f"Raw vendor/driver cost{visa_note}. Reference only - excluded from client price range.",
        "isDerived": False,
        "isVendorCost": True,
        "priceKind": "VENDOR_COST",
    })
    # 2) derived suggested client price = vendor cost + flat margin (owner instruction 2026-09-20)
    evidence.append({
        "entryId": None,
        "routeFamily": rf, "crossBorder": cb, "countryFrom": cfrom, "countryTo": cto,
        "vehicleCategory": vcat, "vehicleRaw": vehicle_raw,
        "price": vendor_cost + VENDOR_MARGIN, "currency": "SAR", "tripType": "ONE_WAY",
        "pickup": pickup, "dropoff": dropoff,
        "source": f"Vendor cost + SAR {VENDOR_MARGIN} margin (derived, not an actual client charge)",
        "sourceRef": "drivers/naimatullah/price sheet.xlsx",
        "date": "2026-08-14",
        "notes": f"Derived: vendor cost SAR {vendor_cost} + SAR {VENDOR_MARGIN} flat margin per owner instruction 2026-09-20{visa_note}.",
        "isDerived": True,
        "isVendorCost": False,
        "priceKind": "DERIVED_SUGGESTED",
    })

# ---------------------------------------------------------------------------
# Aggregate: routeFamily x vehicleCategory -> lowest/highest/sourceCount
# ---------------------------------------------------------------------------

CLIENT_PRICE_CATEGORIES = {"Sedan", "GMC/SUV", "Staria"}  # the 3 standard columns

def trip_label(t):
    return "Round-trip" if t == "ROUND_TRIP" else "One-way"


# IMPORTANT: group by (routeFamily, tripType, vehicleCategory) - NOT just
# (routeFamily, vehicleCategory). A one-way fare and a round-trip total are
# never comparable prices; blending them produced false "Conflicting Prices"
# flags (e.g. Dammam->Abha one-way 4,600 vs round-trip 9,500-10,000 is not a
# real conflict, it's two different products).
groups = {}  # (routeFamily, tripLabel, vehicleCategory) -> list of evidence dicts (client-price-eligible only)
for e in evidence:
    if e["isVendorCost"]:
        continue  # raw vendor cost never enters the client price range
    if e["vehicleCategory"] not in CLIENT_PRICE_CATEGORIES:
        continue  # Luxury/Unspecified/Ambiguous/Other tracked in source details only
    key = (e["routeFamily"], trip_label(e["tripType"]), e["vehicleCategory"])
    groups.setdefault(key, []).append(e)

route_families = {}  # (routeFamily, tripLabel) -> { crossBorder, countryFrom, countryTo, vehicles: {cat: agg} }
for (rf, trip, vcat), items in groups.items():
    prices = [it["price"] for it in items]
    lo, hi = min(prices), max(prices)
    n = len(items)
    spread_ratio = (hi - lo) / lo if lo else 0
    if n == 1:
        status = "Single Source"
    elif lo == hi:
        status = "Multiple Sources"
    elif spread_ratio > 0.4:
        status = "Conflicting Prices"
    else:
        status = "Multiple Sources"

    fkey = (rf, trip)
    rec = route_families.setdefault(fkey, {
        "routeFamily": rf,
        "tripType": trip,
        "crossBorder": items[0]["crossBorder"],
        "countryFrom": items[0]["countryFrom"],
        "countryTo": items[0]["countryTo"],
        "vehicles": {},
    })
    rec["vehicles"][vcat] = {
        "lowest": lo, "highest": hi, "sourceCount": n, "status": status,
        "sources": sorted(set(it["source"] for it in items)),
    }

# Vehicle categories present but outside the 3 standard columns, per (route, trip type) (for Notes)
other_notes_by_route = {}
for e in evidence:
    if e["isVendorCost"]:
        continue
    if e["vehicleCategory"] in CLIENT_PRICE_CATEGORIES:
        continue
    okey = (e["routeFamily"], trip_label(e["tripType"]))
    other_notes_by_route.setdefault(okey, set()).add(e["vehicleCategory"])

print(f"Loaded {len(source_a_raw)} Source A rows, {len(naimatullah_rows)} Source B vendor-rate rows")
print(f"Total evidence records: {len(evidence)}")
print(f"Unique route families: {len(route_families)}")

# ---------------------------------------------------------------------------
# Save consolidated JSON (for the TS import script)
# ---------------------------------------------------------------------------

consolidated = {
    "generatedAt": datetime.datetime.now().isoformat(),
    "vendorMargin": VENDOR_MARGIN,
    "routeFamilies": [
        {
            "routeFamily": data["routeFamily"],
            "tripType": data["tripType"],
            "crossBorder": data["crossBorder"],
            "countryFrom": data["countryFrom"],
            "countryTo": data["countryTo"],
            "vehicles": data["vehicles"],
            "otherVehicleNotes": sorted(other_notes_by_route.get(fkey, [])),
        }
        for fkey, data in sorted(route_families.items())
    ],
    "evidence": evidence,
}
with open(OUT_JSON, "w", encoding="utf-8") as f:
    json.dump(consolidated, f, indent=2, ensure_ascii=False)
print(f"Wrote {OUT_JSON}")
