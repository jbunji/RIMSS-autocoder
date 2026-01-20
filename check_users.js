import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany({
    where: { role: 'field_technician' },
    select: { username: true, full_name: true, role: true }
  });
  console.log('Field Technicians:', JSON.stringify(users, null, 2));
  await prisma.$disconnect();
}

checkUsers();
