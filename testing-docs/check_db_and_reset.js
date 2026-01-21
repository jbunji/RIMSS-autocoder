const { PrismaClient } = require('./backend/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client');
const bcrypt = require('./backend/node_modules/.pnpm/bcryptjs@2.4.3/node_modules/bcryptjs');

// Set DATABASE_URL to match backend
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/rimss_dev';

const prisma = new PrismaClient();

async function checkAndReset() {
  console.log('Connecting to:', process.env.DATABASE_URL);

  // Check current user
  const user = await prisma.user.findUnique({ where: { username: 'admin' } });
  if (!user) {
    console.log('Admin user not found!');
    await prisma.$disconnect();
    return;
  }

  console.log('Found admin user:', user.username, user.email);
  console.log('Current password hash:', user.password_hash.substring(0, 20) + '...');

  // Hash new password
  const newPassword = await bcrypt.hash('password123', 10);
  console.log('New password hash:', newPassword.substring(0, 20) + '...');

  // Test if current hash matches
  const matches = await bcrypt.compare('password123', user.password_hash);
  console.log('Current password already matches password123:', matches);

  if (!matches) {
    // Update password
    const updated = await prisma.user.update({
      where: { username: 'admin' },
      data: { password_hash: newPassword }
    });

    console.log('\n✓ Password reset successful!');
    console.log('Username: admin');
    console.log('Password: password123');
  } else {
    console.log('\n✓ Password is already set to password123');
  }

  await prisma.$disconnect();
}

checkAndReset().catch(console.error);
