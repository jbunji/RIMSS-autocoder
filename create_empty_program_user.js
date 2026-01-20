const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Creating test user for empty program testing...\n');

  // Find the ACTS program (which has no data)
  const actsProgram = await prisma.program.findUnique({
    where: { pgm_cd: 'ACTS' }
  });

  if (!actsProgram) {
    console.error('ACTS program not found!');
    return;
  }

  console.log(`Found program: ${actsProgram.pgm_cd} - ${actsProgram.pgm_name}`);
  console.log(`Program ID: ${actsProgram.pgm_id}\n`);

  // Check if test user already exists
  const existingUser = await prisma.user.findUnique({
    where: { username: 'acts_viewer' }
  });

  if (existingUser) {
    console.log('Test user "acts_viewer" already exists!');
    console.log(`User ID: ${existingUser.user_id}`);

    // Check if already assigned to ACTS
    const existingAssignment = await prisma.userProgram.findUnique({
      where: {
        user_id_pgm_id: {
          user_id: existingUser.user_id,
          pgm_id: actsProgram.pgm_id
        }
      }
    });

    if (existingAssignment) {
      console.log('User already assigned to ACTS program ✓');
    } else {
      console.log('Assigning user to ACTS program...');
      await prisma.userProgram.create({
        data: {
          user_id: existingUser.user_id,
          pgm_id: actsProgram.pgm_id,
          is_default: true,
          ins_by: 'system'
        }
      });
      console.log('User assigned to ACTS program ✓');
    }
  } else {
    // Create new user
    const passwordHash = await bcrypt.hash('test123', 10);

    const newUser = await prisma.user.create({
      data: {
        username: 'acts_viewer',
        password_hash: passwordHash,
        email: 'acts_viewer@test.com',
        first_name: 'ACTS',
        last_name: 'Viewer',
        role: 'VIEWER',
        active: true,
        ins_by: 'system'
      }
    });

    console.log(`Created user: ${newUser.username} (ID: ${newUser.user_id})`);

    // Assign to ACTS program
    await prisma.userProgram.create({
      data: {
        user_id: newUser.user_id,
        pgm_id: actsProgram.pgm_id,
        is_default: true,
        ins_by: 'system'
      }
    });

    console.log('Assigned user to ACTS program ✓');
  }

  console.log('\n✅ Test user ready for Feature #369 testing!');
  console.log('Username: acts_viewer');
  console.log('Password: test123');
  console.log('Program: ACTS (empty - no data)');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
