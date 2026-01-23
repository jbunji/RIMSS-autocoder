import { PrismaClient } from './backend/node_modules/@prisma/client/index.js';

const prisma = new PrismaClient();

async function checkUser() {
  const user = await prisma.users.findFirst({
    where: { username: 'admin' }
  });
  console.log('Admin user:', user ? { id: user.id, username: user.username, role: user.role, password_hash: user.password_hash?.substring(0, 20) + '...' } : 'NOT FOUND');

  // List all users
  const allUsers = await prisma.users.findMany({
    select: { id: true, username: true, role: true }
  });
  console.log('All users:', allUsers);

  await prisma.$disconnect();
}

checkUser().catch(console.error);
