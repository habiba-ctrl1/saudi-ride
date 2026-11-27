import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { headingId } from "@/lib/data/blog";

function textOf(children: React.ReactNode): string {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(textOf).join("");
  if (children && typeof children === "object" && "props" in children) {
    return textOf((children as { props: { children?: React.ReactNode } }).props.children);
  }
  return "";
}

/**
 * Article body renderer. Headings get stable ids (TOC anchors), internal links
 * use next/link (crawlable <a>, client navigation), tables scroll inside their
 * own box instead of the page, and blockquotes render as callouts.
 * `localizeHref` lets the Arabic article swap /x → /ar/x where an Arabic page exists.
 */
export function BlogMarkdown({
  content,
  localizeHref = (h: string) => h,
}: {
  content: string;
  localizeHref?: (href: string) => string;
}) {
  const components: Components = {
    h2: ({ children }) => <h2 id={headingId(textOf(children))}>{children}</h2>,
    h3: ({ children }) => <h3 id={headingId(textOf(children))}>{children}</h3>,
    a: ({ href = "", children }) =>
      href.startsWith("/") ? (
        <Link href={localizeHref(href)}>{children}</Link>
      ) : href.startsWith("#") ? (
        <a href={href}>{children}</a>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ),
    table: ({ children }) => (
      <div className="blog-table not-prose">
        <table>{children}</table>
      </div>
    ),
    blockquote: ({ children }) => <aside className="blog-callout">{children}</aside>,
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
