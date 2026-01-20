import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkPrograms() {
  // Get all programs
  const programs = await prisma.program.findMany();

  console.log('Programs:');
  console.log('=========');
  programs.forEach(p => {
    console.log(`${p.pgm_cd}: ${p.pgm_name}`);
  });

  // Get all users with their programs
  const users = await prisma.user.findMany({
    include: {
      userPrograms: {
        include: {
          program: true
        }
      }
    }
  });

  console.log('\n\nUsers:');
  console.log('======');
  users.forEach(u => {
    const progs = u.userPrograms.map(up => up.program.pgm_cd).join(', ');
    console.log(`${u.username} (${u.role}): ${progs || 'no programs'}`);
  });

  // Check if ACTS or ARDS or 236 have any spares
  for (const prog of programs) {
    const spareCount = await prisma.spare.count({
      where: { pgm_id: prog.pgm_id }
    });
    console.log(`\n${prog.pgm_cd} has ${spareCount} spares`);
  }

  await prisma.$disconnect();
}

checkPrograms().catch(console.error);
