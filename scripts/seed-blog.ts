import { PrismaClient } from '@prisma/client';
import { BLOG_POSTS_DATA } from '../lib/data/blog-posts';
import { BLOG_AUTHOR } from '../lib/data/blog/types';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ${BLOG_POSTS_DATA.length} blog posts...`);
  for (const p of BLOG_POSTS_DATA) {
    // Map the file-based model (lib/data/blog) onto the DB columns.
    const post = {
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: p.coverImage,
      category: p.category,
      author: BLOG_AUTHOR,
      published: p.published !== false,
      publishedAt: new Date(p.publishedAt),
    };
    const postRes = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
    console.log(`Upserted post: ${postRes.slug}`);
  }
  console.log('Blog seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
