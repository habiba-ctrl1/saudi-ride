import { RootDocument } from "@/components/layout/RootDocument";
import NotFoundContent from "@/components/layout/NotFoundContent";

// Global 404 for URLs that don't match any route segment. With multiple root
// layouts (the (en)/(ar) split), this file is NOT wrapped by a group root
// layout, so it must render its own <html>/<body> — we reuse the shared
// RootDocument shell (fonts, nav/footer, styling) so the branded 404 looks
// identical to before the split. Defaults to English.
export default function GlobalNotFound() {
  return (
    <RootDocument lang="en" dir="ltr">
      <NotFoundContent />
    </RootDocument>
  );
}
