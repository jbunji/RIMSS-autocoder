import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkLocations() {
  const locations = await prisma.location.findMany({
    take: 5,
    where: { active: true }
  });

  console.log(JSON.stringify(locations, null, 2));

  await prisma.$disconnect();
}

checkLocations();
