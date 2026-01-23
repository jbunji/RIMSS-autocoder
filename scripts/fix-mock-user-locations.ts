/**
 * Script to fix mockUsers location assignments
 *
 * This script:
 * 1. Queries the database to find valid program-location combinations
 * 2. Outputs the SQL/data needed to update mockUsers in index.ts
 *
 * Run with: cd backend && npx tsx ../scripts/fix-mock-user-locations.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ProgramLocationInfo {
  pgm_id: number
  pgm_cd: string
  pgm_name: string
  locations: Array<{
    loc_id: number
    display_name: string | null
    majcom_cd: string | null
    site_cd: string | null
    unit_cd: string | null
    asset_count: number
  }>
}

async function main() {
  console.log('Finding valid program-location combinations...\n')

  // Get all active programs
  const programs = await prisma.program.findMany({
    where: { active: true },
    orderBy: { pgm_cd: 'asc' }
  })

  const results: ProgramLocationInfo[] = []

  for (const pgm of programs) {
    // Find top 10 locations with most assets for this program
    const locationsWithAssets = await prisma.$queryRaw<Array<{
      loc_id: number
      display_name: string | null
      majcom_cd: string | null
      site_cd: string | null
      unit_cd: string | null
      asset_count: bigint
    }>>`
      SELECT
        l.loc_id,
        l.display_name,
        l.majcom_cd,
        l.site_cd,
        l.unit_cd,
        COUNT(DISTINCT a.asset_id) as asset_count
      FROM asset a
      JOIN part_list pl ON a.partno_id = pl.partno_id
      LEFT JOIN location l ON a.loc_ida = l.loc_id
      WHERE pl.pgm_id = ${pgm.pgm_id}
        AND a.active = true
        AND a.loc_ida IS NOT NULL
      GROUP BY l.loc_id, l.display_name, l.majcom_cd, l.site_cd, l.unit_cd
      HAVING COUNT(DISTINCT a.asset_id) > 0
      ORDER BY asset_count DESC
      LIMIT 10
    `

    results.push({
      pgm_id: pgm.pgm_id,
      pgm_cd: pgm.pgm_cd,
      pgm_name: pgm.pgm_name || '',
      locations: locationsWithAssets.map(loc => ({
        ...loc,
        asset_count: Number(loc.asset_count)
      }))
    })
  }

  // Output the results
  console.log('='.repeat(80))
  console.log('PROGRAM-LOCATION MAPPING RESULTS')
  console.log('='.repeat(80))

  for (const pgmInfo of results) {
    console.log(`\n### ${pgmInfo.pgm_cd} (pgm_id: ${pgmInfo.pgm_id}) - ${pgmInfo.pgm_name} ###`)

    if (pgmInfo.locations.length === 0) {
      console.log('  NO LOCATIONS WITH ASSETS FOUND')
      continue
    }

    console.log('  Top locations:')
    for (const loc of pgmInfo.locations) {
      const displayName = loc.display_name || `${loc.majcom_cd}/${loc.site_cd}/${loc.unit_cd}`
      console.log(`    loc_id: ${loc.loc_id} - "${displayName}" (${loc.asset_count.toLocaleString()} assets)`)
    }
  }

  // Generate mockUsers update code
  console.log('\n\n' + '='.repeat(80))
  console.log('SUGGESTED MOCKUSERS UPDATE CODE')
  console.log('='.repeat(80))
  console.log('\nPaste this into backend/src/index.ts to update mockUsers locations:\n')

  // Find programs with locations to suggest
  const programsWithLocations = results.filter(p => p.locations.length > 0)

  if (programsWithLocations.length === 0) {
    console.log('// No programs found with location data!')
    return
  }

  // Suggest location assignments for common programs
  console.log('// Updated location assignments based on actual database data:')
  console.log('const mockUsers = [')
  console.log('  {')
  console.log('    user_id: 1,')
  console.log('    username: \'admin\',')
  console.log('    // ... other fields ...')
  console.log('    locations: [')

  // Admin gets top 2 locations from first program
  const firstProgram = programsWithLocations[0]
  if (firstProgram && firstProgram.locations.length > 0) {
    const loc1 = firstProgram.locations[0]
    const name1 = loc1.display_name || `${loc1.majcom_cd}/${loc1.site_cd}/${loc1.unit_cd}`
    console.log(`      { loc_id: ${loc1.loc_id}, display_name: '${name1}', is_default: true },`)

    if (firstProgram.locations.length > 1) {
      const loc2 = firstProgram.locations[1]
      const name2 = loc2.display_name || `${loc2.majcom_cd}/${loc2.site_cd}/${loc2.unit_cd}`
      console.log(`      { loc_id: ${loc2.loc_id}, display_name: '${name2}', is_default: false },`)
    }
  }

  console.log('    ],')
  console.log('  },')
  console.log('  // ... more users ...')
  console.log('];')

  // Summary
  console.log('\n\n' + '='.repeat(80))
  console.log('SUMMARY')
  console.log('='.repeat(80))
  console.log(`\nTotal programs found: ${programs.length}`)
  console.log(`Programs with assets: ${programsWithLocations.length}`)

  let totalLocations = 0
  let totalAssets = 0
  for (const p of programsWithLocations) {
    totalLocations += p.locations.length
    for (const l of p.locations) {
      totalAssets += l.asset_count
    }
  }
  console.log(`Total unique locations with assets: ${totalLocations}`)
  console.log(`Total assets mapped: ${totalAssets.toLocaleString()}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
