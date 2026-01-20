const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMultiProgramUsers() {
  try {
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

    console.log('=== USERS AND THEIR PROGRAMS ===\n');

    for (const user of users) {
      const programCount = user.userPrograms.length;
      console.log(`${user.username} (${user.role}): ${programCount} program(s)`);

      if (user.userPrograms.length > 0) {
        user.userPrograms.forEach(up => {
          console.log(`  - ${up.program.pgm_cd}: ${up.program.pgm_name}${up.is_default ? ' (DEFAULT)' : ''}`);
        });
      } else {
        console.log(`  - No programs assigned`);
      }
      console.log('');
    }

    // Find multi-program users
    const multiProgramUsers = users.filter(u => u.userPrograms.length > 1);
    console.log(`\n=== MULTI-PROGRAM USERS (${multiProgramUsers.length}) ===`);
    multiProgramUsers.forEach(u => {
      console.log(`  ${u.username}: ${u.userPrograms.map(up => up.program.pgm_cd).join(', ')}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkMultiProgramUsers();
