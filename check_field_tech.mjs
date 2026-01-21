import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.users.findMany({
    where: { role: 'FIELD_TECHNICIAN' },
    select: { username: true, role: true, name: true }
  });
  console.log('Field Technician Users:');
  console.log(JSON.stringify(users, null, 2));
  await prisma.$disconnect();
}

checkUsers();
