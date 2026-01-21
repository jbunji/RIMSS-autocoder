const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        username: true,
        role_cd: true,
        first_name: true,
        last_name: true
      }
    });

    console.log('Available users:');
    users.forEach(u => {
      console.log(`  - ${u.username} (${u.role_cd}) - ${u.first_name} ${u.last_name}`);
    });

    await prisma.$disconnect();
  } catch (e) {
    console.error('Error:', e.message);
    await prisma.$disconnect();
  }
}

checkUsers();
