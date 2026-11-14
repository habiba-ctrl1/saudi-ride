const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const locations = await prisma.route.findMany({ take: 1 });
    console.log("DB Connection Success:", locations.length >= 0);
  } catch (e) {
    console.error("DB Connection Failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
