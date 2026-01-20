const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPrograms() {
  // Get all programs with asset counts
  const programs = await prisma.program.findMany({
    include: {
      _count: {
        select: {
          assets: true,
        }
      }
    }
  });

  console.log('Programs and their asset counts:');
  console.log('=================================');
  programs.forEach(p => {
    console.log(`${p.code} (${p.id}): ${p.name} - ${p._count.assets} assets`);
  });

  // Get all users
  const users = await prisma.user.findMany({
    include: {
      program: true
    }
  });

  console.log('\n\nUsers and their programs:');
  console.log('=========================');
  users.forEach(u => {
    console.log(`${u.username} (${u.role}) - Program: ${u.program?.code || 'none'}`);
  });

  await prisma.$disconnect();
}

checkPrograms();
