const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== Users in database ===');
  const users = await prisma.user.findMany({
    select: {
      user_id: true,
      username: true,
      email: true,
      role: true,
      first_name: true,
      last_name: true,
    }
  });

  users.forEach(user => {
    console.log(`ID: ${user.user_id}, Username: ${user.username}, Role: ${user.role}, Name: ${user.first_name} ${user.last_name}`);
  });

  await prisma.$disconnect();
}

main().catch(console.error);
