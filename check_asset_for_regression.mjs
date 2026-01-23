import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const assets = await prisma.asset.findMany({
    where: {
      OR: [
        { serno: { contains: 'TEST-PMI' } },
        { serno: { contains: 'TEST' } }
      ]
    },
    select: {
      asset_id: true,
      serno: true,
      name: true,
      status_cd: true,
      pgm_id: true
    }
  });

  console.log('Assets in database:');
  console.log(JSON.stringify(assets, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
