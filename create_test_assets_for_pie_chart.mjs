import Database from 'better-sqlite3';

const db = new Database('./backend/rimss.db');

// Get program ID for ACTS
const program = db.prepare('SELECT pgm_id FROM programs WHERE pgm_cd = ?').get('ACTS');
if (!program) {
  console.error('ACTS program not found');
  process.exit(1);
}

const programId = program.pgm_id;

// Get a valid admin location
const adminLoc = db.prepare('SELECT loc_id FROM locations WHERE pgm_id = ? AND loc_type = ? LIMIT 1').get(programId, 'ADMIN');
if (!adminLoc) {
  console.error('No admin location found for ACTS program');
  process.exit(1);
}

const adminLocId = adminLoc.loc_id;

// Get a valid custodial location
const custLoc = db.prepare('SELECT loc_id FROM locations WHERE pgm_id = ? AND loc_type = ? LIMIT 1').get(programId, 'CUSTODIAL');
if (!custLoc) {
  console.error('No custodial location found for ACTS program');
  process.exit(1);
}

const custLocId = custLoc.loc_id;

console.log(`Using program ID: ${programId}, admin loc: ${adminLocId}, cust loc: ${custLocId}`);

// Create test assets with different statuses
const testAssets = [
  { sn: 'TEST_F454_001', pn: 'TEST-PN-FMC-001', status: 'FMC', name: 'Test FMC Asset 1' },
  { sn: 'TEST_F454_002', pn: 'TEST-PN-FMC-002', status: 'FMC', name: 'Test FMC Asset 2' },
  { sn: 'TEST_F454_003', pn: 'TEST-PN-FMC-003', status: 'FMC', name: 'Test FMC Asset 3' },
  { sn: 'TEST_F454_004', pn: 'TEST-PN-PMC-001', status: 'PMC', name: 'Test PMC Asset 1' },
  { sn: 'TEST_F454_005', pn: 'TEST-PN-PMC-002', status: 'PMCM', name: 'Test PMCM Asset 2' },
  { sn: 'TEST_F454_006', pn: 'TEST-PN-NMC-001', status: 'NMCM', name: 'Test NMCM Asset 1' },
  { sn: 'TEST_F454_007', pn: 'TEST-PN-NMC-002', status: 'NMCB', name: 'Test NMCB Asset 2' },
];

const insertAsset = db.prepare(`
  INSERT INTO assets (
    asset_sn, asset_pn, asset_name, status_cd, pgm_id,
    admin_loc_id, cust_loc_id, uii, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`);

let created = 0;
for (const asset of testAssets) {
  try {
    const result = insertAsset.run(
      asset.sn,
      asset.pn,
      asset.name,
      asset.status,
      programId,
      adminLocId,
      custLocId,
      `TEST-UII-${asset.sn}`
    );
    console.log(`✓ Created asset: ${asset.sn} - ${asset.status} - ID: ${result.lastInsertRowid}`);
    created++;
  } catch (error) {
    console.error(`✗ Failed to create asset ${asset.sn}:`, error.message);
  }
}

console.log(`\nCreated ${created} test assets for pie chart testing`);

// Count assets by status
const counts = db.prepare(`
  SELECT status_cd, COUNT(*) as count
  FROM assets
  WHERE pgm_id = ?
  GROUP BY status_cd
  ORDER BY status_cd
`).all(programId);

console.log('\nCurrent asset counts by status:');
counts.forEach(c => {
  console.log(`  ${c.status_cd}: ${c.count}`);
});

db.close();
