import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

// POST /api/admin/blog — create a new blog post
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const { title, slug, excerpt, content, category, author, published } = body as Record<string, unknown>;

    if (!title || !slug || !excerpt || !content || !category) {
      return NextResponse.json(
        { error: "title, slug, excerpt, content, and category are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.blogPost.findUnique({ where: { slug: String(slug) } });
    if (existing) {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
    }

    const post = await prisma.blogPost.create({
      data: {
        title: String(title),
        slug: String(slug),
        excerpt: String(excerpt),
        content: String(content),
        category: String(category),
        author: author ? String(author) : undefined,
        published: Boolean(published),
        publishedAt: published ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/blog error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
