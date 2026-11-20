"""Build privacy-safe, consistently framed fleet showcase images.

Run from the taxidriver root:  python scripts/build-fleet-showcase.py

For every vehicle on /fleet this writes public/fleet/showcase/<slug>.webp:
  * 16:10 frame centred on the vehicle (bbox measured by hand per source),
    so portrait phone photos and tight stock shots all present the same way;
  * where the frame is larger than the source, the gap is filled with a soft,
    darkened blur of the same photo (no invented imagery);
  * every visible number / dealer plate is pixelated + blurred at source, so
    it stays unreadable at any rendered size.
Original files are never modified.
"""
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import os

OUT = "public/fleet/showcase"
RATIO = 1.6
MAX_W = 1600

# slug: (source, vehicle bbox x0,y0,x1,y1, [plate boxes], padding factor)
VEHICLES = {
    "toyota-camry": ("/fleet/toyota-camry.webp", (40, 140, 1880, 880), [(1600, 630, 1770, 740)], 0.04),
    "toyota-veloz": ("/fleet/toyota-veloz.webp", (55, 390, 560, 690), [(444, 520, 498, 566)], 0.08),
    "gmc-yukon-xl": ("/fleet/gmc-yukon-xl.webp", (220, 159, 1074, 700), [], 0.08),
    "hyundai-staria": ("/fleet/real/hyundai-staria-exterior-2.webp", (71, 507, 640, 996), [(303, 872, 420, 934)], 0.08),
    "executive-vip-van": ("/gallery/partner-vip-van-4.webp", (60, 0, 1140, 675), [], 0.0),
    "cadillac-escalade": ("/fleet/cadillac-escalade.webp", (121, 235, 1155, 671), [], 0.06),
    "mercedes-s-class": ("/fleet/real/mercedes-s-class-exterior-night.webp", (11, 462, 950, 956), [(722, 830, 868, 893)], 0.06),
    "mercedes-maybach-s-class": ("/fleet/mercedes-maybach.webp", (25, 192, 578, 410), [(44, 322, 102, 348)], 0.06),
    "range-rover-autobiography": ("/fleet/range-rover-autobiography.webp", (105, 60, 625, 350), [], 0.06),
    "lexus-lx-600": ("/fleet/lexus-lx-600.webp", (30, 160, 410, 355), [(54, 268, 108, 294)], 0.06),
    "bmw-7-series": ("/fleet/bmw-7-series.webp", (126, 137, 1155, 616), [(244, 427, 431, 483)], 0.05),
    "genesis-g80": ("/fleet/genesis-g80.webp", (148, 131, 1107, 612), [(940, 444, 1052, 502)], 0.05),
    "ford-taurus": ("/fleet/ford-taurus.webp", (60, 60, 565, 318), [(424, 228, 514, 262)], 0.05),
    "mercedes-v-class": ("/fleet/real/mercedes-v-class-fleet-lineup.webp", (178, 476, 1060, 740),
                         [(268, 660, 338, 702), (714, 620, 770, 654), (944, 599, 991, 628)], 0.08),
    "mercedes-sprinter": ("/fleet/real/mercedes-sprinter-vip-exterior.webp", (102, 334, 782, 868), [(182, 768, 266, 838)], 0.07),
    "hyundai-starex": ("/fleet/hyundai-starex.webp", (64, 253, 1223, 789), [(108, 620, 234, 672)], 0.04),
    "toyota-hiace": ("/fleet/toyota-hiace.webp", (92, 102, 1216, 889), [(1040, 656, 1150, 746)], 0.03),
    "toyota-coaster": ("/fleet/toyota-coaster.webp", (0, 7, 1273, 704), [(180, 575, 272, 638)], 0.0),
    "luxury-bus": ("/fleet/luxury-bus.webp", (107, 416, 1131, 896), [(972, 838, 1008, 878)], 0.05),
}

# Source-specific safe area (excludes third-party frame/branding).
SAFE = {"luxury-bus": (34, 300, 1166, 1166)}


def obscure_plates(img, plates):
    img = img.copy()
    for (x0, y0, x1, y1) in plates:
        w, h = x1 - x0, y1 - y0
        region = img.crop((x0, y0, x1, y1))
        # Pixelate to ~6 cells across, then blur: unreadable at any zoom.
        small = region.resize((max(2, w // max(1, w // 6)), max(2, h // max(1, h // 3))), Image.BILINEAR)
        region = small.resize((w, h), Image.NEAREST).filter(ImageFilter.GaussianBlur(max(2, h * 0.18)))
        mask = Image.new("L", (w, h), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, w - 1, h - 1), radius=max(2, h // 5), fill=255)
        mask = mask.filter(ImageFilter.GaussianBlur(1.2))
        img.paste(region, (x0, y0), mask)
    return img


def remove_teal_swoosh(img):
    """luxury-bus source carries a third-party teal frame graphic in the
    bottom-left; replace those pixels with the road texture beside them."""
    px = img.load()
    W, H = img.size
    for y in range(700, H):
        row_mask = [False] * W
        for x in range(0, min(W, 420)):
            r, g, b = px[x, y]
            row_mask[x] = b > r + 45 and g > r + 25
        last = max((x for x in range(min(W, 420)) if row_mask[x]), default=-1)
        if last < 0:
            continue
        for x in range(last + 1):
            if row_mask[x]:
                src = min(W - 1, last + 1 + (last - x) % 40)
                px[x, y] = px[src, y]
    return img


def frame(img, bbox, pad, safe):
    W, H = img.size
    x0, y0, x1, y1 = bbox
    bw, bh = x1 - x0, y1 - y0
    bw2, bh2 = bw * (1 + 2 * pad), bh * (1 + 2.6 * pad)
    if bw2 / bh2 < RATIO:
        bw2 = bh2 * RATIO
    else:
        bh2 = bw2 / RATIO
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2 - bh * 0.03
    sx0, sy0, sx1, sy1 = safe
    # Shift the frame to stay inside the safe area where it fits.
    fx0 = cx - bw2 / 2
    fy0 = cy - bh2 / 2
    if bw2 <= sx1 - sx0:
        fx0 = min(max(fx0, sx0), sx1 - bw2)
    if bh2 <= sy1 - sy0:
        fy0 = min(max(fy0, sy0), sy1 - bh2)
    fw, fh = int(round(bw2)), int(round(bh2))
    fx0, fy0 = int(round(fx0)), int(round(fy0))

    # Backdrop: same photo, cover-scaled, blurred + dimmed (only visible where
    # the frame extends past the safe source area).
    src_safe = img.crop(safe)
    s = max(fw / src_safe.width, fh / src_safe.height)
    back = src_safe.resize((int(src_safe.width * s) + 2, int(src_safe.height * s) + 2), Image.LANCZOS)
    back = back.crop(((back.width - fw) // 2, (back.height - fh) // 2, (back.width - fw) // 2 + fw, (back.height - fh) // 2 + fh))
    back = back.filter(ImageFilter.GaussianBlur(max(fw, fh) / 40))
    back = ImageEnhance.Brightness(back).enhance(0.82)
    canvas = back.copy()

    # Paste the real pixels that fall inside the frame, feathered at any edge
    # that meets the backdrop.
    ix0, iy0 = max(fx0, sx0), max(fy0, sy0)
    ix1, iy1 = min(fx0 + fw, sx1), min(fy0 + fh, sy1)
    part = img.crop((ix0, iy0, ix1, iy1))
    mask = Image.new("L", part.size, 255)
    feather = int(max(fw, fh) * 0.03)
    d = ImageDraw.Draw(mask)
    edges = {"l": ix0 > fx0, "t": iy0 > fy0, "r": ix1 < fx0 + fw, "b": iy1 < fy0 + fh}
    for i in range(feather):
        a = int(255 * (i + 1) / (feather + 1))
        if edges["l"]: d.line([(i, 0), (i, part.height)], fill=a)
        if edges["r"]: d.line([(part.width - 1 - i, 0), (part.width - 1 - i, part.height)], fill=a)
        if edges["t"]: d.line([(0, i), (part.width, i)], fill=a)
        if edges["b"]: d.line([(0, part.height - 1 - i), (part.width, part.height - 1 - i)], fill=a)
    canvas.paste(part, (ix0 - fx0, iy0 - fy0), mask)
    return canvas


def main():
    os.makedirs(OUT, exist_ok=True)
    for slug, (src, bbox, plates, pad) in VEHICLES.items():
        img = Image.open("public" + src).convert("RGB")
        if slug == "luxury-bus":
            img = remove_teal_swoosh(img)
        img = obscure_plates(img, plates)
        safe = SAFE.get(slug, (0, 0, img.width, img.height))
        out = frame(img, bbox, pad, safe)
        w = min(MAX_W, max(960, out.width))
        out = out.resize((w, int(round(w / RATIO))), Image.LANCZOS)
        out.save(f"{OUT}/{slug}.webp", "WEBP", quality=84, method=6)
        print(f"{slug:28} {out.size}")


if __name__ == "__main__":
    main()
