import Link from "next/link";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/locations", label: "Locations" },
  { href: "/routes", label: "Routes" },
  { href: "/fleet", label: "Fleet" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e8e4dc] bg-[#f8f8f6]/95 backdrop-blur">
      <div className="section-container flex items-center justify-between py-4">
        <Link href="/" className="text-sm font-semibold tracking-[0.2em] text-[#121417]">
          RIYADH LUXE TAXI
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-[#3f4650] transition hover:text-[#121417]">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/#booking"
          className="rounded-full border border-[#c7a66b] px-4 py-2 text-xs font-semibold tracking-[0.05em] text-[#121417]"
        >
          Book Now
        </Link>
      </div>
    </header>
  );
}
