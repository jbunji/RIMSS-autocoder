const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/rimss'
    }
  }
});

async function main() {
  const tctoAssets = await prisma.tctoAsset.findMany({
    include: {
      tcto: true,
      asset: { include: { part: true } },
      repair: { include: { event: true } }
    },
    take: 5
  });
  console.log(JSON.stringify(tctoAssets, null, 2));
  await prisma.$disconnect();
}

main().catch(console.error);
