import { PrismaClient } from '@prisma/client';
import { ROUTES_DATA } from '../lib/data/routes';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ${ROUTES_DATA.length} routes...`);
  for (const route of ROUTES_DATA) {
    const routeRes = await prisma.route.upsert({
      where: { slug: route.slug },
      update: route,
      create: route,
    });
    console.log(`Upserted route: ${routeRes.slug}`);
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
