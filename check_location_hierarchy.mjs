import { PrismaClient } from './backend/node_modules/.prisma/client/default.js'

const prisma = new PrismaClient()

async function main() {
  // Get sample locations with hierarchy data
  const locations = await prisma.location.findMany({
    where: { active: true },
    select: {
      loc_id: true,
      display_name: true,
      majcom_cd: true,
      site_cd: true,
      unit_cd: true,
      squad_cd: true,
    },
    take: 20,
    orderBy: [
      { majcom_cd: 'asc' },
      { site_cd: 'asc' },
      { unit_cd: 'asc' },
      { squad_cd: 'asc' },
    ]
  })

  console.log('Sample locations with hierarchy data:')
  console.log(JSON.stringify(locations, null, 2))

  // Get unique values for each level
  const majcoms = await prisma.location.findMany({
    where: { active: true, majcom_cd: { not: null } },
    select: { majcom_cd: true },
    distinct: ['majcom_cd'],
    orderBy: { majcom_cd: 'asc' }
  })

  console.log('\n\nUnique MAJCOMs:', majcoms.map(m => m.majcom_cd))

  await prisma.$disconnect()
}

main().catch(console.error)
