const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        programs: true
      }
    });

    console.log('Available users:');
    users.forEach(u => {
      console.log(`- ${u.username} (${u.role}) - Programs: ${u.programs.join(', ')}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
})();
