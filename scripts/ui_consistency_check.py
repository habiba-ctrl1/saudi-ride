# UI Consistency Checker — TaxiSaudiArabia brand (Green / White / Golden Yellow)
# Usage:  python scripts/ui_consistency_check.py
# Scans app/ + components/ for banned dark-theme / off-brand classes and
# likely invisible-text combos. Exit code 1 if violations found.
# Allowed intentional dark contexts: image overlays (from-black/xx over <Image>),
# footer (premium-dark-section), hero dark cards — listed in ALLOWED_FILES/notes.

import io
import re
import sys
from collections import Counter
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
SUMMARY = "--summary" in sys.argv

ROOT = Path(__file__).resolve().parents[1]
SCAN_DIRS = [ROOT / "app", ROOT / "components"]

# Files where dark styling is intentional (footer, dark hero cards etc.)
ALLOWED_FILES = {
    "components/layout/Footer.tsx",           # dark footer — intentional design
    "components/shared/WhatsAppButton.tsx",   # dark tooltip pill — intentional
    "components/shared/LanguageSwitcher.tsx", # green navbar par white text — sahi hai
}

# Banned patterns → what to use instead
BANNED = [
    (r"bg-\[#0A0A0A\]", "page dark bg — use bg-[#FAFAF7]"),
    (r"bg-\[#111\]?1?1?\](?!/)", "dark card — use bg-white + border-[#16A34A]/12"),
    (r"bg-\[#1A1A1A\]", "dark row/head — use bg-[#F0FDF4]"),
    (r"text-\[#F5F0E8\]", "cream text — use text-[#1C1C1C] (light bg) / text-white (on image)"),
    (r"text-\[#A1A1A6\]", "low-contrast gray — use text-[#6B7280]"),
    (r"text-\[#7C8088\]", "low-contrast gray — use text-[#6B7280]"),
    (r"(from|border|bg|text)-(blue|purple|rose|cyan|indigo|orange|sky|violet|fuchsia|pink|teal|lime)-\d{3}", "off-brand Tailwind hue — use green/#16A34A, gold/#C9A84C or yellow/#FACC15"),
    # NOTE: `from-[#111] to-transparent` OVER AN IMAGE (with text-white) is an
    # allowed overlay idiom (homepage fleet cards use the same) — not banned.
    (r"from-\[#1A1A1A\]|to-\[#111\]", "dark gradient card — use bg-white + shadow-lg"),
]

# Likely-invisible combos: dark text right after a dark image overlay block
INVISIBLE_HINT = re.compile(
    r"bg-gradient-to-t from-\[#111\][^\n]*\n(?:.*\n){0,4}?.*text-\[#1C1C1C\]"
)

violations = []
for d in SCAN_DIRS:
    for f in d.rglob("*.tsx"):
        rel = f.relative_to(ROOT).as_posix()
        if rel in ALLOWED_FILES:
            continue
        # Internal/admin UI — dark dashboard theme is intentional, not public brand
        if rel.startswith(("app/(dashboard)", "app/(auth)", "app/admin")):
            continue
        src = f.read_text(encoding="utf-8", errors="replace")
        for i, line in enumerate(src.splitlines(), 1):
            for pat, fix in BANNED:
                if re.search(pat, line):
                    violations.append((rel, i, line.strip()[:100], fix))
        m = INVISIBLE_HINT.search(src)
        if m:
            ln = src[: m.start()].count("\n") + 1
            violations.append((rel, ln, "dark image overlay + dark text nearby", "text over dark overlay must be text-white"))

if violations:
    print(f"FAIL — {len(violations)} violation(s)\n")
    if SUMMARY:
        counts = Counter(rel for rel, *_ in violations)
        for rel, n in counts.most_common():
            print(f"  {n:4d}  {rel}")
    else:
        for rel, ln, snippet, fix in violations:
            print(f"  {rel}:{ln}\n    {snippet}\n    fix: {fix}\n")
    sys.exit(1)
print("PASS — no off-brand / dark-theme violations found.")
