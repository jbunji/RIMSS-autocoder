import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      programs: {
        include: {
          program: true
        }
      }
    }
  });

  // Find a user with only CRIIS program
  const criisOnlyUser = users.find(u =>
    u.programs.length === 1 &&
    u.programs[0].program.name === 'CRIIS'
  );

  if (criisOnlyUser) {
    console.log('CRIIS-only user found:');
    console.log('Username:', criisOnlyUser.username);
    console.log('Programs:', criisOnlyUser.programs.map(p => p.program.name).join(', '));
  } else {
    console.log('No CRIIS-only user found');
    console.log('Available users:');
    users.forEach(u => {
      console.log(`- ${u.username} (role: ${u.role}): ${u.programs.map(p => p.program.name).join(', ')}`);
    });
  }

  await prisma.$disconnect();
}

main();
