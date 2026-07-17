#!/usr/bin/env python3
"""
Taxi Saudi Arabia - daily ops automation (stdlib only, no pip installs).

Usage (run from taxidriver/):
  python scripts/ops.py report            # new quotations, pending drivers, follow-ups
  python scripts/ops.py export            # CSV backup of quotations + drivers -> exports/
  python scripts/ops.py health            # ping site pages + APIs (local or --base URL)
  python scripts/ops.py health --base https://taxisaudiarabia.com

Reads .env.local for NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
(falls back to NEXT_PUBLIC_SUPABASE_ANON_KEY - anon key can insert but not
read protected rows, so report/export need the service key).
"""

import argparse
import csv
import json
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import urllib.error
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXPORTS = ROOT / "exports"


def load_env(path: Path) -> dict:
    env = {}
    if not path.exists():
        return env
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        env[key.strip()] = val.strip().strip('"').strip("'")
    return env


ENV = load_env(ROOT / ".env.local")
SUPABASE_URL = ENV.get("SUPABASE_URL") or ENV.get("NEXT_PUBLIC_SUPABASE_URL", "")
SERVICE_KEY = ENV.get("SUPABASE_SERVICE_ROLE_KEY", "")
ANON_KEY = ENV.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
API_KEY = SERVICE_KEY or ANON_KEY


def rest(path: str, params: str = "") -> tuple[list | dict | None, str | None]:
    """GET Supabase REST endpoint. Returns (data, error)."""
    if not SUPABASE_URL or not API_KEY:
        return None, "Supabase URL/key missing in .env.local"
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    if params:
        url += f"?{params}"
    req = urllib.request.Request(url, headers={
        "apikey": API_KEY,
        "Authorization": f"Bearer {API_KEY}",
        "Prefer": "count=exact",
    })
    try:
        with urllib.request.urlopen(req, timeout=30) as res:
            return json.loads(res.read().decode()), None
    except urllib.error.HTTPError as e:
        return None, f"HTTP {e.code}: {e.read().decode()[:200]}"
    except Exception as e:  # network / timeout
        return None, str(e)


def cmd_report() -> int:
    if not SERVICE_KEY:
        print("! SUPABASE_SERVICE_ROLE_KEY missing in .env.local - report needs it (RLS blocks anon reads).")
        return 1
    checks = [
        ("New quotations (need pricing)", "quotations", "status=eq.new&select=quote_reference,customer_name,customer_phone,pickup_location,drop_location,trip_date&order=created_at.desc&limit=20"),
        ("Follow-up flagged quotations", "quotations", "followup_flagged=eq.true&select=quote_reference,customer_name,status&limit=20"),
        ("Pending driver approvals", "drivers", "status=eq.pending&select=full_name,phone,city,vehicle_type,created_at&order=created_at.desc&limit=20"),
        ("Docs expiring soon (drivers)", "drivers", "expiring_soon=eq.true&select=full_name,phone,license_expiry_date,iqama_expiry_date&limit=20"),
        (f"Today's confirmed trips ({date.today()})", "quotations", f"status=in.(confirmed,assigned)&trip_date=eq.{date.today()}&select=quote_reference,customer_name,pickup_location,trip_time"),
    ]
    exit_code = 0
    for title, table, params in checks:
        rows, err = rest(table, params)
        if err:
            print(f"\nX {title}: {err}")
            exit_code = 1
            continue
        print(f"\n# {title}: {len(rows)}")
        for r in rows:
            print("   " + " | ".join(str(v) for v in r.values()))
    print()
    return exit_code


def cmd_export() -> int:
    if not SERVICE_KEY:
        print("! SUPABASE_SERVICE_ROLE_KEY missing - export needs it.")
        return 1
    EXPORTS.mkdir(exist_ok=True)
    ok = True
    for table in ("quotations", "drivers"):
        rows, err = rest(table, "select=*&order=created_at.desc&limit=5000")
        if err or rows is None:
            print(f"X {table}: {err}")
            ok = False
            continue
        out = EXPORTS / f"{table}-{date.today()}.csv"
        if not rows:
            print(f"# {table}: 0 rows (skipped)")
            continue
        with out.open("w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
            writer.writeheader()
            writer.writerows(rows)
        print(f"OK {table}: {len(rows)} rows -> {out.relative_to(ROOT)}")
    return 0 if ok else 1


def cmd_health(base: str) -> int:
    pages = ["/", "/locations", "/routes", "/fleet", "/contact", "/partners/driver-registration"]
    apis = [("/api/quotations", "POST-form endpoint (405/401 on GET without admin = alive)")]
    failures = 0
    for p in pages:
        try:
            req = urllib.request.Request(base + p, headers={"User-Agent": "ops-health/1.0"})
            with urllib.request.urlopen(req, timeout=30) as res:
                status = res.status
            mark = "OK" if status < 400 else "X"
            if status >= 400:
                failures += 1
            print(f"{mark} {status} {p}")
        except Exception as e:
            failures += 1
            print(f"X ERR {p} - {e}")
    for p, note in apis:
        try:
            req = urllib.request.Request(base + p, headers={"User-Agent": "ops-health/1.0"})
            with urllib.request.urlopen(req, timeout=30) as res:
                print(f"OK {res.status} {p}")
        except urllib.error.HTTPError as e:
            # 401 means the route exists and auth guard works
            mark = "OK" if e.code in (401, 405) else "X"
            if mark == "X":
                failures += 1
            print(f"{mark} {e.code} {p} ({note})")
        except Exception as e:
            failures += 1
            print(f"X ERR {p} - {e}")
    print(f"\n{'ALL OK' if failures == 0 else f'{failures} FAILURES'}")
    return 0 if failures == 0 else 1


def main() -> int:
    parser = argparse.ArgumentParser(description="Taxi Saudi Arabia ops automation")
    parser.add_argument("command", choices=["report", "export", "health"])
    parser.add_argument("--base", default="http://localhost:3000", help="site base URL for health checks")
    args = parser.parse_args()

    if args.command == "report":
        return cmd_report()
    if args.command == "export":
        return cmd_export()
    return cmd_health(args.base.rstrip("/"))


if __name__ == "__main__":
    sys.exit(main())
