import { RelatedGuides } from "@/components/blog/RelatedGuides";

// Shared wrapper for routes / airports / services / events / locations / distance.
// Only adds the blog "Travel guides" strip (renders nothing on paths without
// mapped guides — see lib/data/blog/inbound.ts). Added 2026-10-02.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <RelatedGuides />
    </>
  );
}
