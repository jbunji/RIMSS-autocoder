import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    // Get config 77 details
    const config = await prisma.cfgSet.findUnique({
      where: { cfg_set_id: 77 },
      include: {
        program: true,
        part: true,
      },
    });

    console.log('Config 77:', JSON.stringify(config, null, 2));

    // Get all programs and their config counts
    const programs = await prisma.program.findMany({
      include: {
        _count: { select: { cfgSets: true } }
      }
    });

    console.log('\nPrograms with config counts:');
    programs.forEach(p => {
      console.log(`  - ${p.pgm_id}: ${p.pgm_cd} (${p.pgm_name}) - ${p._count.cfgSets} configs`);
    });

    // Get configs with bom items
    const configsWithBom = await prisma.cfgSet.findMany({
      where: {
        cfgLists: {
          some: { active: true }
        }
      },
      include: {
        program: true,
        _count: { select: { cfgLists: true } }
      },
      take: 10
    });

    console.log('\nConfigs with BOM items:');
    configsWithBom.forEach(c => {
      console.log(`  - ${c.cfg_set_id}: ${c.cfg_name} (${c.program?.pgm_cd || 'N/A'}) - ${c._count.cfgLists} BOM items`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
