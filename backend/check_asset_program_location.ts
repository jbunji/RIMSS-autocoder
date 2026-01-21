import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking if program-location relationship can be inferred from assets...\n');

  // Check if assets link programs to locations
  const assetSample = await prisma.$queryRaw`
    SELECT
      a.asset_id,
      pl.pgm_id,
      p.pgm_cd,
      p.pgm_name,
      a.loc_ida as admin_location_id,
      la.display_name as admin_location,
      a.loc_idc as custodial_location_id,
      lc.display_name as custodial_location
    FROM asset a
    LEFT JOIN part_list pl ON a.partno_id = pl.partno_id
    LEFT JOIN program p ON pl.pgm_id = p.pgm_id
    LEFT JOIN location la ON a.loc_ida = la.loc_id
    LEFT JOIN location lc ON a.loc_idc = lc.loc_id
    WHERE a.active = true
    LIMIT 20;
  ` as any[];

  console.log('Sample assets with program and location data:');
  console.log(JSON.stringify(assetSample, null, 2));

  // Get unique program-location combinations
  const programLocationCombos = await prisma.$queryRaw`
    SELECT DISTINCT
      pl.pgm_id,
      p.pgm_cd,
      p.pgm_name,
      COALESCE(a.loc_ida, a.loc_idc) as loc_id,
      l.display_name
    FROM asset a
    JOIN part_list pl ON a.partno_id = pl.partno_id
    JOIN program p ON pl.pgm_id = p.pgm_id
    LEFT JOIN location l ON COALESCE(a.loc_ida, a.loc_idc) = l.loc_id
    WHERE a.active = true
    AND COALESCE(a.loc_ida, a.loc_idc) IS NOT NULL
    ORDER BY p.pgm_cd, l.display_name
    LIMIT 50;
  ` as any[];

  console.log('\n\nUnique program-location combinations from assets:');
  console.log(JSON.stringify(programLocationCombos, null, 2));

  // Count locations per program
  const locationsPerProgram = await prisma.$queryRaw`
    SELECT
      p.pgm_cd,
      COUNT(DISTINCT COALESCE(a.loc_ida, a.loc_idc)) as location_count
    FROM asset a
    JOIN part_list pl ON a.partno_id = pl.partno_id
    JOIN program p ON pl.pgm_id = p.pgm_id
    WHERE a.active = true
    AND COALESCE(a.loc_ida, a.loc_idc) IS NOT NULL
    GROUP BY p.pgm_cd
    ORDER BY p.pgm_cd;
  ` as any[];

  console.log('\n\nLocation count per program:');
  console.log(JSON.stringify(locationsPerProgram, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
