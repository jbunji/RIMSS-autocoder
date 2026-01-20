const { PrismaClient } = require('./backend/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.user.count();
    console.log('Total users in database:', userCount);

    if (userCount > 0) {
      const users = await prisma.user.findMany({
        select: { id: true, username: true, role: true, program: true }
      });
      console.log('\nUsers:');
      users.forEach(u => {
        console.log(`  - ${u.username} (${u.role}) - Program: ${u.program}`);
      });
    } else {
      console.log('No users found in database. Database needs to be seeded.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main().finally(() => prisma.$disconnect());
