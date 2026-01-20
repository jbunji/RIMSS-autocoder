import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Find all sorties ordered by creation date
  const recentSorties = await prisma.sortie.findMany({
    include: {
      asset: {
        select: {
          serno: true,
          tail_no: true,
          part: {
            select: {
              program: true
            }
          }
        }
      }
    },
    orderBy: {
      ins_date: 'desc'
    },
    take: 10
  });

  console.log('Most Recent Sorties:');
  console.log('='.repeat(80));
  console.log(`\nTotal sorties: ${await prisma.sortie.count()}\n`);
  console.log('Last 10 sorties:');

  recentSorties.forEach((sortie, index) => {
    console.log(`\n${index + 1}. Mission ID: ${sortie.mission_id}`);
    console.log(`   Asset: ${sortie.asset.serno}`);
    console.log(`   Date: ${sortie.sortie_date?.toISOString().split('T')[0]}`);
    console.log(`   Effect: ${sortie.sortie_effect}`);
    console.log(`   Range: ${sortie.range || 'N/A'}`);
    console.log(`   Created: ${sortie.ins_date?.toISOString()}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
