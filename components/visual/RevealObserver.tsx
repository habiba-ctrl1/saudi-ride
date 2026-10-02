"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-wide, zero-dependency scroll choreography for the public site.
 *
 * 1. Scroll reveal — every top-level <section> inside <main.tsa-public>
 *    (except the first, which is the hero) plus anything carrying `.rv`
 *    fades/rises in once as it enters the viewport. Children of a
 *    `[data-stagger]` container cascade with a small per-item delay.
 *    Content is only hidden after this runs (`html.rv-ready`), so crawlers,
 *    no-JS and reduced-motion users always get the static page.
 * 2. Selective parallax — elements with `data-parallax="0.08"` drift by that
 *    factor relative to viewport centre. Desktop only, rAF-throttled,
 *    transform-only (no layout), and disabled for reduced motion.
 *
 * Server components opt in with plain class names / data attributes; no
 * per-page client JS is needed.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;

    const main = document.querySelector("main.tsa-public");
    if (!main) return;

    const targets = new Set<HTMLElement>();
    const sections = Array.from(main.querySelectorAll<HTMLElement>("section")).filter(
      (s) => !s.parentElement?.closest("section") && !s.closest("[data-no-reveal]"),
    );
    sections.slice(1).forEach((s) => targets.add(s));
    main.querySelectorAll<HTMLElement>(".rv, .tsa-steps, .tsa-route").forEach((el) => targets.add(el));
    main.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
      Array.from(group.children).forEach((child, i) => {
        const el = child as HTMLElement;
        el.style.setProperty("--rv-delay", `${Math.min(i, 8) * 70}ms`);
        targets.add(el);
      });
    });

    const vh = window.innerHeight;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("rv-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    targets.forEach((el) => {
      el.classList.add("rv");
      // Already on screen at scan time → show immediately, no flash.
      if (el.getBoundingClientRect().top < vh * 0.95) el.classList.add("rv-in");
      else io.observe(el);
    });
    root.classList.add("rv-ready");

    // ── Parallax ──
    const layers = Array.from(main.querySelectorAll<HTMLElement>("[data-parallax]"));
    let raf = 0;
    const update = () => {
      raf = 0;
      if (window.innerWidth < 768) {
        layers.forEach((l) => l.style.removeProperty("--py"));
        return;
      }
      const h = window.innerHeight;
      layers.forEach((l) => {
        const speed = parseFloat(l.dataset.parallax || "0.08");
        const r = (l.parentElement ?? l).getBoundingClientRect();
        if (r.bottom < -200 || r.top > h + 200) return;
        const delta = (r.top + r.height / 2 - h / 2) * -speed;
        l.style.setProperty("--py", `${delta.toFixed(1)}px`);
        l.style.setProperty("--ps", "1.08");
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    if (layers.length) {
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      targets.forEach((el) => el.classList.remove("rv", "rv-in"));
    };
  }, [pathname]);

  return null;
}
