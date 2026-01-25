import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // Hash passwords for all users
  const adminPassword = await bcrypt.hash('Admin123!', 10)
  const depotMgrPassword = await bcrypt.hash('Depot123!', 10)
  const fieldTechPassword = await bcrypt.hash('Field123!', 10)
  const viewerPassword = await bcrypt.hash('Viewer123!', 10)

  // Create or update users
  const users = [
    {
      username: 'admin',
      email: 'admin@rimss.mil',
      first_name: 'System',
      last_name: 'Administrator',
      role: 'ADMIN',
      password_hash: adminPassword,
      active: true,
    },
    {
      username: 'depot_mgr',
      email: 'depot_mgr@rimss.mil',
      first_name: 'Jane',
      last_name: 'Depot',
      role: 'DEPOT_MANAGER',
      password_hash: depotMgrPassword,
      active: true,
    },
    {
      username: 'field_tech',
      email: 'field_tech@rimss.mil',
      first_name: 'Bob',
      last_name: 'Field',
      role: 'FIELD_TECHNICIAN',
      password_hash: fieldTechPassword,
      active: true,
    },
    {
      username: 'viewer',
      email: 'viewer@rimss.mil',
      first_name: 'Sam',
      last_name: 'Viewer',
      role: 'VIEWER',
      password_hash: viewerPassword,
      active: true,
    },
  ]

  for (const userData of users) {
    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { username: userData.username }
    })

    if (existingUser) {
      // Update existing user
      await prisma.users.update({
        where: { user_id: existingUser.user_id },
        data: {
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role,
          password_hash: userData.password_hash,
          active: userData.active,
          chg_by: 'seeder',
          chg_date: new Date(),
        }
      })
      console.log(`✓ Updated user: ${userData.username}`)
    } else {
      // Create new user
      const newUser = await prisma.users.create({
        data: {
          ...userData,
          ins_by: 'seeder',
        }
      })
      console.log(`✓ Created user: ${userData.username} (ID: ${newUser.user_id})`)
    }
  }

  // Assign programs and locations to admin user
  const adminUser = await prisma.users.findUnique({
    where: { username: 'admin' }
  })

  if (adminUser) {
    // Get all programs
    const programs = await prisma.program.findMany()

    // Assign all programs to admin
    for (let i = 0; i < programs.length; i++) {
      const existingAssignment = await prisma.userProgram.findUnique({
        where: {
          user_id_pgm_id: {
            user_id: adminUser.user_id,
            pgm_id: programs[i].pgm_id
          }
        }
      })

      if (!existingAssignment) {
        await prisma.userProgram.create({
          data: {
            user_id: adminUser.user_id,
            pgm_id: programs[i].pgm_id,
            is_default: i === 0,
            ins_by: 'seeder'
          }
        })
        console.log(`  ✓ Assigned program ${programs[i].pgm_cd} to admin`)
      }
    }

    // Get all active locations
    const locations = await prisma.location.findMany({
      where: { active: true }
    })

    // Assign all locations to admin
    for (let i = 0; i < locations.length; i++) {
      const existingAssignment = await prisma.userLocation.findUnique({
        where: {
          user_id_loc_id: {
            user_id: adminUser.user_id,
            loc_id: locations[i].loc_id
          }
        }
      })

      if (!existingAssignment) {
        await prisma.userLocation.create({
          data: {
            user_id: adminUser.user_id,
            loc_id: locations[i].loc_id,
            is_default: i === 0,
            ins_by: 'seeder'
          }
        })
        console.log(`  ✓ Assigned location ${locations[i].display_name} to admin`)
      }
    }
  }

  console.log('\n✅ Database seeding completed!')
  console.log('\nDefault users:')
  console.log('  Username: admin        Password: Admin123!')
  console.log('  Username: depot_mgr    Password: Depot123!')
  console.log('  Username: field_tech   Password: Field123!')
  console.log('  Username: viewer       Password: Viewer123!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
