import { PrismaClient } from './backend/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js';
import { config } from 'dotenv';
config({ path: './backend/.env' });

const prisma = new PrismaClient();

const depotUser = await prisma.user.findUnique({
  where: { username: 'depot_mgr' },
  select: {
    user_id: true,
    username: true,
    role: true,
    email: true,
    first_name: true,
    last_name: true,
    password_hash: true
  }
});

console.log('Depot user details:', JSON.stringify(depotUser, null, 2));
await prisma.$disconnect();
