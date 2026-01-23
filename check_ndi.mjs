import Database from 'better-sqlite3';

const db = new Database('backend/prisma/dev.db', { readonly: true });

const asset = db.prepare(`
  SELECT asset_id, serno, next_ndi_date, chg_date
  FROM asset
  WHERE asset_id = 907793
`).get();

console.log(JSON.stringify(asset, null, 2));

db.close();
