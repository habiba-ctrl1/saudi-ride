import type { LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";

/**
 * Canonical section header — eyebrow + title + optional lead paragraph.
 *
 * One component for every "band" intro on the site so eyebrow styling, title
 * scale, measure and spacing stay identical across page types (see
 * `.t-eyebrow` / `.t-h2` / `.t-lead` in app/design-system.css).
 *
 * `align` controls centring; `tone="onDark"` switches colours for use inside
 * green / dark bands. `action` renders a trailing link/button on the
 * opposite edge for start-aligned headers (e.g. "View all routes →").
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
  action,
}: {
  eyebrow?: string;
  icon?: LucideIcon;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "center" | "start";
  tone?: "onLight" | "onDark";
  className?: string;
  as?: "h1" | "h2" | "h3";
  action?: React.ReactNode;
}) {
  const onDark = tone === "onDark";
  const head = (
    <div className={`section-head ${align === "center" ? "is-center" : ""} ${onDark ? "on-dark" : ""}`}>
      {eyebrow && (
        <span className={`t-eyebrow ${Icon ? "is-plain" : ""} ${onDark ? "on-dark" : ""}`}>
          {Icon && <Icon className="h-3.5 w-3.5" aria-hidden />}
          {eyebrow}
        </span>
      )}
      <TitleTag className={`t-h2 ${onDark ? "!text-[#FFFFFF]" : ""}`}>{title}</TitleTag>
      {lead && <p className={`t-lead ${onDark ? "!text-white/80" : ""}`}>{lead}</p>}
    </div>
  );

  if (action && align === "start") {
    return (
      <Reveal className={`flex flex-col gap-5 md:flex-row md:items-end md:justify-between ${className}`}>
        {head}
        <div className="shrink-0">{action}</div>
      </Reveal>
    );
  }

  return <Reveal className={className}>{head}</Reveal>;
}
