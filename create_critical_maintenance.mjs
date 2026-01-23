import Database from 'better-sqlite3';
const db = new Database('rimss.db');

// Check if there are any critical maintenance events
const criticalCount = db.prepare(`
  SELECT COUNT(*) as count FROM maintenance_events
  WHERE priority = 'Critical' AND status = 'open'
`).get();

console.log('Critical maintenance events:', criticalCount.count);

// Check PMI data
const pmiData = db.prepare(`
  SELECT
    COUNT(*) as total,
    SUM(CASE WHEN days_until_due < 0 THEN 1 ELSE 0 END) as overdue,
    SUM(CASE WHEN days_until_due <= 7 THEN 1 ELSE 0 END) as red,
    SUM(CASE WHEN days_until_due > 7 AND days_until_due <= 30 THEN 1 ELSE 0 END) as yellow,
    SUM(CASE WHEN days_until_due > 30 THEN 1 ELSE 0 END) as green
  FROM pmi
`).get();

console.log('PMI Data:', pmiData);

// Check parts data
const partsData = db.prepare(`
  SELECT
    COUNT(*) as total,
    SUM(CASE WHEN priority = 'critical' THEN 1 ELSE 0 END) as critical,
    SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as urgent,
    SUM(CASE WHEN priority = 'routine' THEN 1 ELSE 0 END) as routine
  FROM parts_orders
`).get();

console.log('Parts Data:', partsData);

db.close();
