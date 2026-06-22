import { ImageResponse } from "next/og";

// Site-wide default Open Graph / Twitter card image.
// Any page without its own opengraph-image inherits this branded card,
// so social shares (WhatsApp, Facebook, X, LinkedIn) always render a preview.
export const runtime = "edge";
export const alt = "Taxi Saudi Arabia — Airport Transfers, Umrah & Intercity Rides";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0A0A0A 0%, #1a1407 100%)",
          color: "#F5F0E8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 4, color: "#C9A227" }}>
          TAXI SAUDI ARABIA
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.1, marginTop: 24 }}>
          Airport Transfers, Umrah &amp; Intercity Rides
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#B8B0A1", marginTop: 28 }}>
          Fixed prices · Licensed drivers · 24/7 across the Kingdom
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#C9A227", marginTop: 40 }}>
          ★ 4.9 rating · 5,000+ trips · taxisaudiarabia.com
        </div>
      </div>
    ),
    { ...size }
  );
}
