import { PrismaClient } from '@prisma/client';
import { BLOG_POSTS_DATA } from '../lib/data/blog-posts';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ${BLOG_POSTS_DATA.length} blog posts...`);
  for (const post of BLOG_POSTS_DATA) {
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
