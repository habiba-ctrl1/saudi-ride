import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  return NextResponse.json({ post });
}

// PATCH /api/admin/blog/[id] — update a post
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, slug, excerpt, content, category, author, published } = body as Record<string, unknown>;

    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    if (slug !== undefined && String(slug) !== post.slug) {
      const existing = await prisma.blogPost.findUnique({ where: { slug: String(slug) } });
      if (existing) return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title: String(title) } : {}),
        ...(slug !== undefined ? { slug: String(slug) } : {}),
        ...(excerpt !== undefined ? { excerpt: String(excerpt) } : {}),
        ...(content !== undefined ? { content: String(content) } : {}),
        ...(category !== undefined ? { category: String(category) } : {}),
        ...(author !== undefined ? { author: String(author) } : {}),
        ...(published !== undefined
          ? { published: Boolean(published), publishedAt: Boolean(published) ? (post.publishedAt ?? new Date()) : null }
          : {}),
      },
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error("PATCH /api/admin/blog/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/blog/[id]
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/blog/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
