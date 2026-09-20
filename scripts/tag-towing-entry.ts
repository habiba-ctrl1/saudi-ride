import { prisma } from "../lib/prisma";

async function main() {
  const r = await prisma.priceBookEntry.findFirst({ where: { vehicleType: "Recovery/Tow Truck" } });
  if (r) {
    await prisma.priceBookEntry.update({
      where: { id: r.id },
      data: { routeFamily: "Ras Tanura -> Safwa (car towing, not a taxi fare)", crossBorder: false },
    });
    console.log("tagged", r.id);
  } else {
    console.log("none found");
  }
}

main().finally(() => prisma.$disconnect());
