const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('='.repeat(80));
  console.log('CHECKING PROGRAMS AND DATA');
  console.log('='.repeat(80));

  // Get all programs
  const programs = await prisma.program.findMany({
    include: {
      _count: {
        select: {
          partLists: true,
          cfgSets: true,
          sorties: true,
          tctos: true,
          spares: true,
        }
      }
    }
  });

  console.log('\nPrograms and their data counts:');
  for (const program of programs) {
    console.log(`\n${program.pgm_cd} - ${program.pgm_name}`);
    console.log(`  Part Lists: ${program._count.partLists}`);
    console.log(`  Config Sets: ${program._count.cfgSets}`);
    console.log(`  Sorties: ${program._count.sorties}`);
    console.log(`  TCTOs: ${program._count.tctos}`);
    console.log(`  Spares: ${program._count.spares}`);

    // Total up
    const total = program._count.partLists + program._count.cfgSets +
                  program._count.sorties + program._count.tctos + program._count.spares;
    console.log(`  TOTAL: ${total}`);

    if (total === 0) {
      console.log('  ✅ THIS PROGRAM HAS NO DATA - Perfect for testing!');
    }
  }

  // Get all users and their programs
  console.log('\n' + '='.repeat(80));
  console.log('USERS AND THEIR PROGRAMS');
  console.log('='.repeat(80));

  const users = await prisma.user.findMany({
    include: {
      userPrograms: {
        include: {
          program: true
        }
      }
    }
  });

  for (const user of users) {
    console.log(`\n${user.username} (${user.role})`);
    if (user.userPrograms.length === 0) {
      console.log('  No programs assigned');
    } else {
      user.userPrograms.forEach(up => {
        const isDefault = up.is_default ? ' (default)' : '';
        console.log(`  - ${up.program.pgm_cd} - ${up.program.pgm_name}${isDefault}`);
      });
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
