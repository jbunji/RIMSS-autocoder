/**
 * Diagnostic script to check asset-location mapping in the database
 *
 * This script queries the PostgreSQL database to find:
 * 1. What programs exist and their IDs
 * 2. What locations have assets for each program
 * 3. Sample assets at each location
 *
 * Run with: npx tsx scripts/check-location-mapping.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('='.repeat(80))
  console.log('RIMSS Asset-Location Mapping Diagnostic')
  console.log('='.repeat(80))

  // 1. List all programs
  console.log('\n--- PROGRAMS ---')
  const programs = await prisma.program.findMany({
    where: { active: true },
    orderBy: { pgm_cd: 'asc' }
  })

  console.log(`Found ${programs.length} active programs:`)
  for (const pgm of programs) {
    console.log(`  [${pgm.pgm_id}] ${pgm.pgm_cd} - ${pgm.pgm_name}`)
  }

  // 2. For each program, find locations that have assets
  console.log('\n--- LOCATIONS WITH ASSETS BY PROGRAM ---')

  for (const pgm of programs) {
    console.log(`\n### Program: ${pgm.pgm_cd} (ID: ${pgm.pgm_id}) ###`)

    // Get distinct locations for assets in this program
    const locationsWithAssets = await prisma.$queryRaw<Array<{
      loc_id: number,
      display_name: string | null,
      majcom_cd: string | null,
      site_cd: string | null,
      unit_cd: string | null,
      asset_count: bigint
    }>>`
      SELECT
        l.loc_id,
        l.display_name,
        l.majcom_cd,
        l.site_cd,
        l.unit_cd,
        COUNT(a.asset_id) as asset_count
      FROM asset a
      JOIN part_list pl ON a.partno_id = pl.partno_id
      JOIN location l ON (a.loc_ida = l.loc_id OR a.loc_idc = l.loc_id)
      WHERE pl.pgm_id = ${pgm.pgm_id}
        AND a.active = true
        AND l.active = true
      GROUP BY l.loc_id, l.display_name, l.majcom_cd, l.site_cd, l.unit_cd
      ORDER BY asset_count DESC
      LIMIT 20
    `

    if (locationsWithAssets.length === 0) {
      console.log('  No assets found for this program')
      continue
    }

    console.log(`  Found ${locationsWithAssets.length} locations with assets:`)
    for (const loc of locationsWithAssets) {
      const name = loc.display_name || `${loc.majcom_cd}/${loc.site_cd}/${loc.unit_cd}`
      console.log(`    loc_id=${loc.loc_id}: ${name} (${loc.asset_count.toString()} assets)`)
    }
  }

  // 3. Show sample assets with their locations
  console.log('\n--- SAMPLE ASSETS WITH LOCATIONS ---')

  const sampleAssets = await prisma.asset.findMany({
    where: {
      active: true,
      loc_ida: { not: null }
    },
    include: {
      part: {
        select: {
          partno: true,
          noun: true,
          pgm_id: true
        }
      },
      adminLoc: {
        select: {
          loc_id: true,
          display_name: true,
          majcom_cd: true,
          site_cd: true,
          unit_cd: true
        }
      },
      custodialLoc: {
        select: {
          loc_id: true,
          display_name: true
        }
      }
    },
    take: 20,
    orderBy: { asset_id: 'asc' }
  })

  console.log(`\nFirst 20 assets with locations:`)
  for (const asset of sampleAssets) {
    const adminLocName = asset.adminLoc?.display_name ||
      `${asset.adminLoc?.majcom_cd}/${asset.adminLoc?.site_cd}/${asset.adminLoc?.unit_cd}` ||
      'N/A'
    const custLocName = asset.custodialLoc?.display_name || 'N/A'

    console.log(`  Asset ${asset.asset_id}: ${asset.serno}`)
    console.log(`    Part: ${asset.part?.partno} (pgm_id: ${asset.part?.pgm_id})`)
    console.log(`    Admin Location (loc_ida): ${asset.loc_ida} - ${adminLocName}`)
    console.log(`    Custodial Location (loc_idc): ${asset.loc_idc} - ${custLocName}`)
    console.log()
  }

  // 4. Check for assets without valid locations
  console.log('\n--- ASSETS WITH NULL OR INVALID LOCATIONS ---')

  const assetsWithNullLoc = await prisma.asset.count({
    where: {
      active: true,
      loc_ida: null,
      loc_idc: null
    }
  })

  const totalAssets = await prisma.asset.count({
    where: { active: true }
  })

  console.log(`Total active assets: ${totalAssets}`)
  console.log(`Assets with null loc_ida AND loc_idc: ${assetsWithNullLoc}`)

  // Check for assets where loc_ida doesn't exist in location table
  const assetsWithInvalidLoc = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*) as count
    FROM asset a
    WHERE a.active = true
      AND a.loc_ida IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM location l WHERE l.loc_id = a.loc_ida)
  `

  console.log(`Assets with loc_ida not in location table: ${assetsWithInvalidLoc[0]?.count || 0}`)

  // 5. List all locations (just first 50)
  console.log('\n--- FIRST 50 LOCATIONS ---')
  const locations = await prisma.location.findMany({
    where: { active: true },
    orderBy: { loc_id: 'asc' },
    take: 50
  })

  for (const loc of locations) {
    console.log(`  [${loc.loc_id}] ${loc.display_name || 'N/A'} (majcom: ${loc.majcom_cd}, site: ${loc.site_cd}, unit: ${loc.unit_cd})`)
  }

  console.log('\n' + '='.repeat(80))
  console.log('Diagnostic complete!')
  console.log('='.repeat(80))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
