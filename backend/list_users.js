import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      user_id: true,
      username: true,
      role: true,
      userPrograms: {
        include: {
          program: true
        }
      }
    }
  });

  console.log('Users in database:');
  users.forEach(u => {
    const programs = u.userPrograms.map(up => up.program.pgm_name).join(', ');
    console.log(`- ${u.username} (${u.role}): ${programs || 'No programs'}`);
  });

  await prisma.$disconnect();
}

main();
