/**
 * RIMSS Location Distribution Fix Script
 * =======================================
 * Analyzes and optionally fixes location distribution for assets.
 *
 * Usage:
 *   npx tsx fix-location-distribution.ts --analyze        # Just analyze, no changes
 *   npx tsx fix-location-distribution.ts --fix            # Apply fixes
 *   npx tsx fix-location-distribution.ts --distribute     # Distribute test assets across locations
 */

import { PrismaClient } from "../backend/node_modules/@prisma/client";

const prisma = new PrismaClient();

async function analyzeLocationDistribution() {
  console.log("\\n=== LOCATION DISTRIBUTION ANALYSIS ===\\n");

  // 1. Check how many unique locations have assets
  const assetsByAssignedLoc = await prisma.$queryRaw<Array<{loc_id: number, display_name: string, count: bigint}>>`
    SELECT l.loc_id, l.display_name, COUNT(a.asset_id) as count
    FROM asset a
    LEFT JOIN location l ON a.loc_ida = l.loc_id
    WHERE a.active = true
    GROUP BY l.loc_id, l.display_name
    ORDER BY count DESC
    LIMIT 20
  `;

  console.log("Assets by ASSIGNED location (loc_ida):");
  console.log("-".repeat(60));
  let totalAssigned = 0n;
  for (const row of assetsByAssignedLoc) {
    console.log(`  ${(row.display_name || "NULL").padEnd(35)} ${row.count.toString().padStart(10)}`);
    totalAssigned += row.count;
  }
  console.log(`  ${"TOTAL".padEnd(35)} ${totalAssigned.toString().padStart(10)}`);

  const assetsByCurrentLoc = await prisma.$queryRaw<Array<{loc_id: number, display_name: string, count: bigint}>>`
    SELECT l.loc_id, l.display_name, COUNT(a.asset_id) as count
    FROM asset a
    LEFT JOIN location l ON a.loc_idc = l.loc_id
    WHERE a.active = true
    GROUP BY l.loc_id, l.display_name
    ORDER BY count DESC
    LIMIT 20
  `;

  console.log("\\nAssets by CURRENT location (loc_idc):");
  console.log("-".repeat(60));
  let totalCurrent = 0n;
  for (const row of assetsByCurrentLoc) {
    console.log(`  ${(row.display_name || "NULL").padEnd(35)} ${row.count.toString().padStart(10)}`);
    totalCurrent += row.count;
  }
  console.log(`  ${"TOTAL".padEnd(35)} ${totalCurrent.toString().padStart(10)}`);

  // 2. Check assets where assigned != current (in-transit or moved)
  const movedAssets = await prisma.$queryRaw<Array<{count: bigint}>>`
    SELECT COUNT(*) as count
    FROM asset
    WHERE loc_ida IS NOT NULL 
      AND loc_idc IS NOT NULL 
      AND loc_ida != loc_idc
      AND active = true
  `;

  console.log(`\\nAssets where assigned != current location: ${movedAssets[0].count}`);

  // 3. Check in-transit assets
  const inTransitAssets = await prisma.$queryRaw<Array<{count: bigint}>>`
    SELECT COUNT(*) as count
    FROM asset
    WHERE in_transit = true AND active = true
  `;

  console.log(`Assets marked in-transit: ${inTransitAssets[0].count}`);

  // 4. Check assets with shipping info
  const shippedAssets = await prisma.$queryRaw<Array<{count: bigint}>>`
    SELECT COUNT(*) as count
    FROM asset
    WHERE ship_date IS NOT NULL AND active = true
  `;

  console.log(`Assets with ship_date set: ${shippedAssets[0].count}`);

  // 5. Check available locations
  const locations = await prisma.location.findMany({
    where: { active: true },
    orderBy: { display_name: "asc" },
    select: { loc_id: true, display_name: true, site_cd: true, unit_cd: true }
  });

  console.log(`\\nAvailable locations: ${locations.length}`);
  
  // 6. Check program-location mapping
  const programLocs = await prisma.programLocation.findMany({
    include: { program: true, location: true }
  });

  console.log(`\\nProgram-Location mappings: ${programLocs.length}`);
  
  const byProgram = new Map<string, string[]>();
  for (const pl of programLocs) {
    const pgm = pl.program.pgm_cd;
    if (!byProgram.has(pgm)) byProgram.set(pgm, []);
    byProgram.get(pgm)!.push(pl.location.display_name);
  }
  
  for (const [pgm, locs] of byProgram) {
    console.log(`  ${pgm}: ${locs.length} locations`);
  }

  return { locations, programLocs };
}

async function distributeTestAssets() {
  console.log("\\n=== DISTRIBUTING TEST ASSETS ACROSS LOCATIONS ===\\n");
  
  // Get all active locations
  const locations = await prisma.location.findMany({
    where: { active: true },
    select: { loc_id: true, display_name: true }
  });

  if (locations.length === 0) {
    console.log("No locations found! Cannot distribute.");
    return;
  }

  // Get all active assets
  const assets = await prisma.asset.findMany({
    where: { active: true },
    select: { asset_id: true, serno: true, loc_ida: true, loc_idc: true }
  });

  console.log(`Found ${assets.length} active assets and ${locations.length} locations`);

  // Distribute evenly - assign each asset to a location based on its ID
  let updated = 0;
  const batchSize = 500;
  
  for (let i = 0; i < assets.length; i += batchSize) {
    const batch = assets.slice(i, i + batchSize);
    
    for (const asset of batch) {
      // Use modulo to distribute across locations
      const locIndex = asset.asset_id % locations.length;
      const newLoc = locations[locIndex];
      
      // Only update if different
      if (asset.loc_ida !== newLoc.loc_id || asset.loc_idc !== newLoc.loc_id) {
        await prisma.asset.update({
          where: { asset_id: asset.asset_id },
          data: {
            loc_ida: newLoc.loc_id,
            loc_idc: newLoc.loc_id  // Start with same assigned/current
          }
        });
        updated++;
      }
    }
    
    console.log(`  Processed ${Math.min(i + batchSize, assets.length)}/${assets.length} assets...`);
  }

  console.log(`\\nUpdated ${updated} assets with new locations`);
}

async function fixNullLocations() {
  console.log("\\n=== FIXING NULL LOCATIONS ===\\n");

  // Find default location (first active one)
  const defaultLoc = await prisma.location.findFirst({
    where: { active: true },
    orderBy: { loc_id: "asc" }
  });

  if (!defaultLoc) {
    console.log("No locations found!");
    return;
  }

  console.log(`Default location: ${defaultLoc.display_name} (ID: ${defaultLoc.loc_id})`);

  // Fix assets with null loc_ida
  const nullIdaCount = await prisma.asset.count({
    where: { loc_ida: null, active: true }
  });
  console.log(`Assets with null loc_ida: ${nullIdaCount}`);

  if (nullIdaCount > 0) {
    await prisma.asset.updateMany({
      where: { loc_ida: null, active: true },
      data: { loc_ida: defaultLoc.loc_id }
    });
    console.log(`  Fixed ${nullIdaCount} assets with null loc_ida`);
  }

  // Fix assets with null loc_idc (set to same as loc_ida)
  const nullIdcAssets = await prisma.asset.findMany({
    where: { loc_idc: null, loc_ida: { not: null }, active: true },
    select: { asset_id: true, loc_ida: true }
  });
  console.log(`Assets with null loc_idc (but valid loc_ida): ${nullIdcAssets.length}`);

  for (const asset of nullIdcAssets) {
    await prisma.asset.update({
      where: { asset_id: asset.asset_id },
      data: { loc_idc: asset.loc_ida }
    });
  }
  console.log(`  Fixed ${nullIdcAssets.length} assets`);
}

async function main() {
  const args = process.argv.slice(2);
  
  try {
    if (args.includes("--analyze") || args.length === 0) {
      await analyzeLocationDistribution();
    }
    
    if (args.includes("--fix")) {
      await fixNullLocations();
    }
    
    if (args.includes("--distribute")) {
      await distributeTestAssets();
    }

    if (args.includes("--analyze") || args.length === 0) {
      // Re-analyze after fixes
      if (args.includes("--fix") || args.includes("--distribute")) {
        console.log("\\n" + "=".repeat(60));
        console.log("POST-FIX ANALYSIS");
        console.log("=".repeat(60));
        await analyzeLocationDistribution();
      }
    }

  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
