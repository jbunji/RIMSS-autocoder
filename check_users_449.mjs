import { PrismaClient } from './backend/node_modules/@prisma/client/index.js';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { user_id: true, username: true, role: true, first_name: true, last_name: true }
  });
  console.log('Users in database:');
  users.forEach(u => console.log(`  ${u.username} - ${u.role} (${u.first_name} ${u.last_name})`));
}

main().then(() => prisma.$disconnect());
