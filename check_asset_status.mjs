import Database from 'better-sqlite3';

// Check asset status data
const db = new Database('./backend/prisma/dev.db');

// Get program counts
const programs = db.prepare('SELECT pgm_id, pgm_cd, pgm_name FROM Program').all();
console.log('Programs:', programs);

// Get asset counts by program and status
const assetCounts = db.prepare(`
  SELECT p.pgm_cd, a.status_cd, COUNT(*) as count
  FROM Asset a
  JOIN Program p ON a.pgm_id = p.pgm_id
  GROUP BY a.pgm_id, a.status_cd
  ORDER BY p.pgm_cd, a.status_cd
`).all();
console.log('\nAsset counts by program and status:', assetCounts);

// Get total assets by program
const totalByProgram = db.prepare(`
  SELECT p.pgm_cd, COUNT(*) as total
  FROM Asset a
  JOIN Program p ON a.pgm_id = p.pgm_id
  GROUP BY a.pgm_id
`).all();
console.log('\nTotal assets by program:', totalByProgram);

db.close();
