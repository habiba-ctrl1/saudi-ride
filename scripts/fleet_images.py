#!/usr/bin/env python3
"""
Fleet image pipeline — automates adding car photos to the fleet.

Drop a car photo (any name / any format: jpg, png, avif, webp) into
public/fleet/, then run:

    python scripts/fleet_images.py

It will, for each loose file:
  1. Detect which car it belongs to (fuzzy-match the filename to a slug).
  2. Convert it to optimised WebP (<=1280px wide, quality 82).
  3. Save it as the correct  <slug>.webp  (overwrites if you're replacing).
  4. Delete the original / junk (.crdownload, 0-byte, duplicates).
  5. Point lib/fleet-data.ts at  /fleet/<slug>.webp.
Finally it prints a report of which cars have an image and which are missing.

Flags:
  --dry        show what would happen, change nothing
  --no-data    skip updating fleet-data.ts
"""
from __future__ import annotations
import re, sys
from pathlib import Path
from PIL import Image, ImageOps

# Windows consoles default to cp1252 and choke on emoji — force UTF-8 output.
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = Path(__file__).resolve().parents[1]
FLEET_DIR = ROOT / "public" / "fleet"
DATA_FILE = ROOT / "lib" / "fleet-data.ts"

MAX_WIDTH = 1280
WEBP_QUALITY = 82
IMG_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic", ".heif", ".gif", ".bmp"}
JUNK_EXTS = {".crdownload", ".part", ".tmp", ".download"}

DRY = "--dry" in sys.argv
UPDATE_DATA = "--no-data" not in sys.argv

# Distinctive keyword -> slug. Filename is normalised to lowercase a-z0-9
# (all spaces/punctuation removed) before checking 'keyword in filename'.
# Order matters: more specific keys first.
KEYWORD_SLUG = [
    ("camry", "toyota-camry"),
    ("denali", "gmc-yukon-xl"),
    ("yukon", "gmc-yukon-xl"),
    ("staria", "hyundai-staria"),
    ("starex", "hyundai-starex"),
    ("escalade", "cadillac-escalade"),
    ("sclass", "mercedes-s-class"),
    ("7series", "bmw-7-series"),
    ("bmw7", "bmw-7-series"),
    ("g80", "genesis-g80"),
    ("genesis", "genesis-g80"),
    ("taurus", "ford-taurus"),
    ("tarus", "ford-taurus"),        # common misspelling
    ("vito", "mercedes-vito"),
    ("sprinter", "mercedes-sprinter"),
    ("hiace", "toyota-hiace"),
    ("coaster", "toyota-coaster"),
    ("luxurious", "luxury-bus"),
    ("luxurybus", "luxury-bus"),
    ("coachbus", "luxury-bus"),
    ("coach", "luxury-bus"),
]


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", s.lower())


def valid_slugs() -> list[str]:
    text = DATA_FILE.read_text(encoding="utf-8")
    return re.findall(r'slug:\s*"([^"]+)"', text)


def match_slug(filename: str, slugs: set[str]) -> str | None:
    n = norm(filename)
    for kw, slug in KEYWORD_SLUG:
        if kw in n and slug in slugs:
            return slug
    return None


def to_webp(src: Path, dst: Path) -> int:
    im = Image.open(src)
    im = ImageOps.exif_transpose(im)          # respect camera/phone rotation
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
    else:
        im = im.convert("RGB")
    if im.width > MAX_WIDTH:
        h = round(im.height * MAX_WIDTH / im.width)
        im = im.resize((MAX_WIDTH, h), Image.LANCZOS)
    dst.parent.mkdir(parents=True, exist_ok=True)
    im.save(dst, "WEBP", quality=WEBP_QUALITY, method=6)
    return dst.stat().st_size


def safe_delete(p: Path) -> bool:
    if DRY:
        return True
    try:
        p.unlink()
        return True
    except OSError:
        return False  # likely locked by dev server


def update_data(slugs_done: set[str]) -> int:
    if not (UPDATE_DATA and slugs_done) or DRY:
        return 0
    text = DATA_FILE.read_text(encoding="utf-8")
    changed = 0
    for slug in slugs_done:
        new = f'/fleet/{slug}.webp'
        pat = re.compile(r'/fleet/' + re.escape(slug) + r'\.(?:jpg|jpeg|png|avif|webp)')
        text, n = pat.subn(new, text)
        changed += n
    DATA_FILE.write_text(text, encoding="utf-8")
    return changed


def main() -> None:
    if not FLEET_DIR.exists():
        sys.exit(f"Not found: {FLEET_DIR}")
    slugs = valid_slugs()
    slugset = set(slugs)
    have: set[str] = set()
    processed, deleted, junk, unmatched, locked = [], [], [], [], []

    for f in sorted(FLEET_DIR.iterdir()):
        if not f.is_file():
            continue
        ext = f.suffix.lower()
        stem = f.stem

        # already correctly named slug.webp -> done
        if ext == ".webp" and stem in slugset:
            have.add(stem)
            continue
        # junk / incomplete downloads / empty
        if ext in JUNK_EXTS or f.stat().st_size < 100:
            junk.append(f.name)
            safe_delete(f)
            continue
        # not an image we handle
        if ext not in IMG_EXTS:
            unmatched.append(f.name + "  (not an image)")
            continue

        slug = match_slug(f.name, slugset)
        if not slug:
            unmatched.append(f.name + "  (car not recognised)")
            continue

        dst = FLEET_DIR / f"{slug}.webp"
        if DRY:
            processed.append(f"{f.name}  ->  {slug}.webp  (dry-run)")
            have.add(slug)
            continue
        try:
            size = to_webp(f, dst)
        except Exception as e:                 # noqa: BLE001
            unmatched.append(f"{f.name}  (convert failed: {e})")
            continue
        have.add(slug)
        processed.append(f"{f.name}  ->  {slug}.webp  ({size // 1024} KB)")
        # remove the source (different name than the slug.webp we just wrote)
        if f.name != dst.name:
            (deleted if safe_delete(f) else locked).append(f.name)

    data_changes = update_data(have)
    missing = [s for s in slugs if s not in have]

    # ---- report ----
    print("=" * 60)
    print(f"FLEET IMAGE PIPELINE{'  (DRY RUN)' if DRY else ''}")
    print("=" * 60)
    if processed:
        print(f"\n✅ Processed ({len(processed)}):")
        for p in processed: print("   " + p)
    if junk:
        print(f"\n🗑️  Junk removed ({len(junk)}): " + ", ".join(junk))
    if deleted:
        print(f"\n🧹 Originals cleaned ({len(deleted)}): " + ", ".join(deleted))
    if locked:
        print(f"\n🔒 Could not delete (locked by dev server) ({len(locked)}): " + ", ".join(locked))
    if unmatched:
        print(f"\n⚠️  Needs attention ({len(unmatched)}):")
        for u in unmatched: print("   " + u)
    if UPDATE_DATA and not DRY:
        print(f"\n📝 fleet-data.ts paths updated: {data_changes}")
    print(f"\n📊 Images: {len(have)}/{len(slugs)} cars have a photo.")
    if missing:
        print("   ⏳ Still missing: " + ", ".join(missing))
    else:
        print("   🎉 All cars have images!")
    print()


if __name__ == "__main__":
    main()
