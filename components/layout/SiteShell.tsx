"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { RevealObserver } from "@/components/visual/RevealObserver";

// Renders Navbar/Footer only on public marketing pages.
// Admin and customer dashboard routes get a clean shell with no public chrome.
// `.tsa-public` scopes the v2 design-system behaviours (focus, reveal, field
// hygiene) to the public site — see app/design-system.css.
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDashboard =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/customer") ||
    pathname.startsWith("/dashboard");

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[100] focus:rounded-full focus:bg-[#0F172A] focus:px-4 focus:py-2 focus:text-sm focus:font-bold on-dark text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="tsa-public min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
      <RevealObserver />
    </>
  );
}
