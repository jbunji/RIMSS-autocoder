import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkCNDMUsage() {
  try {
    // Check if any assets use CNDM status
    const cndmAssets = await prisma.asset.count({
      where: {
        status_cd: 'CNDM'
      }
    })

    console.log(`Assets with CNDM status: ${cndmAssets}`)

    // Get total assets for context
    const totalAssets = await prisma.asset.count()
    console.log(`Total assets: ${totalAssets}`)

    // Get all unique status codes in use
    const uniqueStatuses = await prisma.$queryRaw`
      SELECT DISTINCT status_cd, COUNT(*) as count
      FROM asset
      GROUP BY status_cd
      ORDER BY count DESC
    `

    console.log('\nCurrent status code usage:')
    console.table(uniqueStatuses)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkCNDMUsage()
