import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { BLOG_POSTS_DATA } from '@/lib/data/blog-posts';

export async function GET() {
  try {
    const createdPosts = await Promise.all(
      BLOG_POSTS_DATA.map(async (post) => {
        return db.blogPost.upsert({
          where: { slug: post.slug },
          update: post,
          create: post,
        });
      })
    );

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${createdPosts.length} blog posts.`,
      posts: createdPosts,
    });
  } catch (error) {
    console.error('Error seeding blog posts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to seed blog posts.', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
