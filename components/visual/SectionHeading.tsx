import type { LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";

/**
 * Canonical section header — eyebrow chip + title + optional lead paragraph.
 *
 * One component for every "band" intro on the site so eyebrow styling, title
 * scale (`.text-section-title`), measure and spacing stay identical across
 * page types. Pairs with <Reveal> for a consistent entrance.
 *
 * `align` controls centring; `tone="onDark"` switches colours for use inside
 * `.premium-dark-section` bands.
 */
export function SectionHeading({
  eyebrow,
  icon: Icon,
  title,
  lead,
  align = "center",
  tone = "onLight",
  className = "",
  as: TitleTag = "h2",
}: {
  eyebrow?: string;
  icon?: LucideIcon;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "center" | "start";
  tone?: "onLight" | "onDark";
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const alignCls = align === "center" ? "items-center text-center mx-auto" : "items-start text-start";
  const leadColor = tone === "onDark" ? "text-white/80" : "text-[#4B5563]";
  const titleColor = tone === "onDark" ? "text-white" : "text-[#0F172A]";

  return (
    <Reveal className={`flex flex-col ${alignCls} max-w-2xl ${className}`}>
      {eyebrow && (
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-5 text-eyebrow ${
            tone === "onDark"
              ? "border-[#FACC15]/40 bg-[#FACC15]/10 text-[#FACC15]"
              : "border-[#16A34A]/25 bg-[#16A34A]/[0.07] text-[#16A34A]"
          }`}
        >
          {Icon && <Icon className="h-3.5 w-3.5" />}
          {eyebrow}
        </span>
      )}
      <TitleTag className={`text-section-title ${titleColor}`}>{title}</TitleTag>
      {lead && <p className={`mt-4 text-body-lg ${leadColor}`}>{lead}</p>}
    </Reveal>
  );
}
