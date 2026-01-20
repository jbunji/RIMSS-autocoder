const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getUsers() {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, full_name: true, role: true }
  });
  console.log('Available users:');
  users.forEach(u => console.log(`  - ${u.username} (${u.full_name}) - Role: ${u.role}`));
  await prisma.$disconnect();
}

getUsers().catch(console.error);
