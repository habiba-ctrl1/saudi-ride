import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

export interface BlogCardData {
  href: string;
  title: string;
  excerpt: string;
  categoryKey: string;
  categoryLabel: string;
  image: string;
  alt: string;
  dateLabel: string;
  readLabel: string;
}

// One card used by the blog index, the related-articles row and the Arabic
// blog. The whole card is one link (single tab stop, one crawlable anchor).
export function BlogCard({ post, readLabel, priority = false }: { post: BlogCardData; readLabel: string; priority?: boolean }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#0F172A]/[0.07] bg-white transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#16A34A]/30 hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#F1F5F2]">
        <Image
          src={post.image}
          alt={post.alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute start-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[0.68rem] font-bold tracking-wide text-[#15803D] shadow-sm">
          {post.categoryLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-[1.08rem] font-bold leading-snug text-[#0F172A] transition-colors group-hover:text-[#15803D]">
          <Link href={post.href} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#64748B]">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs font-medium text-[#64748B]">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#16A34A]" aria-hidden />
            {post.readLabel} · {post.dateLabel}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-[#15803D]" aria-hidden>
            {readLabel} <ArrowRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
          </span>
        </div>
      </div>
    </article>
  );
}
