const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const bcrypt = require('./backend/node_modules/bcryptjs');
const prisma = new PrismaClient();

async function createUsers() {
  // Hash password for all users
  const password = await bcrypt.hash('password123', 10);

  // Create programs first
  const programs = await prisma.program.createMany({
    data: [
      { pgm_cd: 'CRIIS', pgm_name: 'CRIIS Program', pgm_desc: 'Common Remotely Operated Integrated Reconnaissance System' },
      { pgm_cd: 'ACTS', pgm_name: 'ACTS Program', pgm_desc: 'Advanced Targeting Capability System' },
      { pgm_cd: 'ARDS', pgm_name: 'ARDS Program', pgm_desc: 'Airborne Reconnaissance Data System' },
      { pgm_cd: '236', pgm_name: 'Program 236', pgm_desc: 'Program identifier 236' }
    ],
    skipDuplicates: true
  });

  // Get program IDs
  const criis = await prisma.program.findUnique({ where: { pgm_cd: 'CRIIS' } });
  const acts = await prisma.program.findUnique({ where: { pgm_cd: 'ACTS' } });

  // Create users
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      password_hash: password,
      email: 'admin@rimss.mil',
      first_name: 'John',
      last_name: 'Admin',
      role: 'ADMIN',
      userPrograms: {
        create: [
          { pgm_id: criis.pgm_id, is_default: true }
        ]
      }
    }
  });

  const viewer = await prisma.user.create({
    data: {
      username: 'viewer',
      password_hash: password,
      email: 'viewer@rimss.mil',
      first_name: 'Sam',
      last_name: 'Viewer',
      role: 'VIEWER',
      userPrograms: {
        create: [
          { pgm_id: criis.pgm_id, is_default: true }
        ]
      }
    }
  });

  const fieldTech = await prisma.user.create({
    data: {
      username: 'field_tech',
      password_hash: password,
      email: 'field@rimss.mil',
      first_name: 'Bob',
      last_name: 'Field',
      role: 'FIELD_TECHNICIAN',
      userPrograms: {
        create: [
          { pgm_id: criis.pgm_id, is_default: true }
        ]
      }
    }
  });

  const depotMgr = await prisma.user.create({
    data: {
      username: 'depot_mgr',
      password_hash: password,
      email: 'depot@rimss.mil',
      first_name: 'Jane',
      last_name: 'Depot',
      role: 'DEPOT_MANAGER',
      userPrograms: {
        create: [
          { pgm_id: criis.pgm_id, is_default: true }
        ]
      }
    }
  });

  console.log('Created users:');
  console.log('- admin (John Admin) - ADMIN');
  console.log('- viewer (Sam Viewer) - VIEWER');
  console.log('- field_tech (Bob Field) - FIELD_TECHNICIAN');
  console.log('- depot_mgr (Jane Depot) - DEPOT_MANAGER');
  console.log('\nAll users have password: password123');

  await prisma.$disconnect();
}

createUsers().catch(console.error);
