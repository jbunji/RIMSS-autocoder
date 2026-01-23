/**
 * Script to import loc_set data from legacy CSV
 *
 * The loc_set table maps locations to programs via set_name patterns like:
 * - ACTS_LOC, ACTS_SPARE_LOCATIONS, ACTS_DEPOT_LOC
 * - CRIIS_LOC, CRIIS_SPARE_LOCATIONS
 * - ARDS_LOC, ARDS_SPARE_LOCATIONS
 * - 236_LOC, 236_SPARE_LOCATIONS
 *
 * Run with: cd backend && npx tsx scripts/import-loc-set.ts
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// ESM compatibility - __dirname is not available in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Initialize Prisma client
const prisma = new PrismaClient()

// Pattern to extract program code from set_name
function extractProgramCode(setName: string): string | null {
  // Match patterns like ACTS_LOC, ACTS_SPARE_LOCATIONS, ACTS_DEPOT_LOC
  const match = setName.match(/^([A-Z0-9]+)_(?:LOC|SPARE_LOCATIONS|DEPOT_LOC|NETWORK)/)
  if (match) {
    return match[1]
  }
  return null
}

// Parse the CSV line - format: SET_ID|SET_NAME|LOC_ID|INS_BY|INS_DATE|A|DISPLAY_NAME
function parseCSVLine(line: string): {
  set_id: number
  set_name: string
  loc_id: number
  ins_by: string | null
  ins_date: string | null
  active: boolean
  display_name: string | null
} | null {
  // Skip header lines
  if (line.includes('SET_ID') || line.startsWith('-')) {
    return null
  }

  const parts = line.split('|')
  if (parts.length < 7) {
    return null
  }

  const set_id = parseInt(parts[0].trim(), 10)
  const set_name = parts[1].trim()
  const loc_id = parseInt(parts[2].trim(), 10)
  const ins_by = parts[3].trim() || null
  const ins_date = parts[4].trim() || null
  const active = parts[5].trim() === 'Y'
  const display_name = parts[6].trim() || null

  if (isNaN(set_id) || isNaN(loc_id) || !set_name) {
    return null
  }

  return { set_id, set_name, loc_id, ins_by, ins_date, active, display_name }
}

async function main() {
  console.log('='.repeat(80))
  console.log('IMPORTING LOC_SET DATA')
  console.log('='.repeat(80))

  // Path to the CSV file - when run with `cd backend && npx tsx scripts/import-loc-set.ts`
  // __dirname is backend/scripts, so go up 3 levels to reach RIMSS folder
  const csvPath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'RIMSSv2.13.0',
    'rimss-modern',
    'backend',
    'scripts',
    'oracle-extractor',
    'output',
    'data',
    'loc_set.csv'
  )

  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found: ${csvPath}`)
    console.error(`Script directory: ${__dirname}`)
    process.exit(1)
  }

  console.log(`Reading CSV from: ${csvPath}`)

  const content = fs.readFileSync(csvPath, 'utf-8')
  const lines = content.split('\n')

  console.log(`Found ${lines.length} lines in CSV`)

  // Get location ID mapping (Oracle -> PostgreSQL) - in backend folder
  const idMappingsPath = path.resolve(__dirname, '..', 'id-mappings-v2.json')
  let locationMappings: Record<string, number> = {}

  if (fs.existsSync(idMappingsPath)) {
    const mappings = JSON.parse(fs.readFileSync(idMappingsPath, 'utf-8'))
    locationMappings = mappings.location || {}
    console.log(`Loaded ${Object.keys(locationMappings).length} location ID mappings`)
  } else {
    console.warn('No ID mappings file found - will use original IDs')
  }

  // Get existing programs from database
  const programs = await prisma.program.findMany({
    where: { active: true },
    select: { pgm_id: true, pgm_cd: true }
  })

  const programCodeToId: Record<string, number> = {}
  for (const p of programs) {
    programCodeToId[p.pgm_cd.toUpperCase()] = p.pgm_id
  }
  console.log(`Found ${programs.length} programs in database:`, programCodeToId)

  // Get existing locations from database
  const locations = await prisma.location.findMany({
    where: { active: true },
    select: { loc_id: true }
  })
  const validLocationIds = new Set(locations.map(l => l.loc_id))
  console.log(`Found ${validLocationIds.size} active locations in database`)

  // Parse and filter records
  const records: Array<{
    set_name: string
    pgm_id: number
    loc_id: number
    display_name: string | null
    active: boolean
    ins_by: string | null
  }> = []

  let skippedNoProgram = 0
  let skippedNoLocation = 0
  let skippedInvalid = 0

  for (const line of lines) {
    const parsed = parseCSVLine(line)
    if (!parsed) {
      skippedInvalid++
      continue
    }

    // Extract program code from set_name
    const programCode = extractProgramCode(parsed.set_name)
    if (!programCode) {
      skippedNoProgram++
      continue
    }

    const pgm_id = programCodeToId[programCode]
    if (!pgm_id) {
      skippedNoProgram++
      continue
    }

    // Map Oracle location ID to PostgreSQL ID
    const oracleLocId = String(parsed.loc_id)
    const postgresLocId = locationMappings[oracleLocId] || parsed.loc_id

    // Verify location exists
    if (!validLocationIds.has(postgresLocId)) {
      skippedNoLocation++
      continue
    }

    records.push({
      set_name: parsed.set_name,
      pgm_id,
      loc_id: postgresLocId,
      display_name: parsed.display_name,
      active: parsed.active,
      ins_by: parsed.ins_by,
    })
  }

  console.log(`\nParsed ${records.length} valid records`)
  console.log(`Skipped ${skippedInvalid} invalid lines`)
  console.log(`Skipped ${skippedNoProgram} records with no matching program`)
  console.log(`Skipped ${skippedNoLocation} records with no matching location`)

  // Group by program for summary
  const byProgram: Record<string, number> = {}
  for (const r of records) {
    const pgmCode = Object.keys(programCodeToId).find(k => programCodeToId[k] === r.pgm_id) || 'UNKNOWN'
    byProgram[pgmCode] = (byProgram[pgmCode] || 0) + 1
  }
  console.log('\nRecords by program:', byProgram)

  // Delete existing loc_set data
  console.log('\nDeleting existing loc_set data...')
  const deleteResult = await prisma.locSet.deleteMany({})
  console.log(`Deleted ${deleteResult.count} existing records`)

  // Insert new records
  console.log('\nInserting new records...')
  let inserted = 0
  let duplicates = 0

  for (const record of records) {
    try {
      await prisma.locSet.create({
        data: {
          set_name: record.set_name,
          pgm_id: record.pgm_id,
          loc_id: record.loc_id,
          display_name: record.display_name,
          active: record.active,
          ins_by: record.ins_by,
        }
      })
      inserted++
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Unique constraint violation - duplicate set_name + loc_id
        duplicates++
      } else {
        console.error(`Error inserting record:`, record, error.message)
      }
    }
  }

  console.log(`\nInserted ${inserted} records`)
  console.log(`Skipped ${duplicates} duplicates`)

  // Verify
  const finalCount = await prisma.locSet.count()
  console.log(`\nFinal loc_set count: ${finalCount}`)

  // Show sample data
  const samples = await prisma.locSet.findMany({
    take: 10,
    include: {
      location: { select: { loc_id: true, display_name: true } },
      program: { select: { pgm_id: true, pgm_cd: true } }
    }
  })

  console.log('\nSample records:')
  for (const s of samples) {
    console.log(`  ${s.set_name} -> ${s.program.pgm_cd} / ${s.display_name || s.location.display_name || 'No name'}`)
  }

  console.log('\n' + '='.repeat(80))
  console.log('IMPORT COMPLETE')
  console.log('='.repeat(80))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
