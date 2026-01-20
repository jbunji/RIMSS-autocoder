const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, role: true }
  });
  console.log('Available users:');
  users.forEach(u => console.log(`  - ${u.username} (role: ${u.role})`));
}

main().finally(() => prisma.$disconnect());
