import Database from 'better-sqlite3';
const db = new Database('./features.db');

const row = db.prepare("SELECT * FROM features WHERE id = 459").get();
if (row) {
  console.log(JSON.stringify(row, null, 2));
} else {
  console.log('Feature 459 not found');
}

db.close();
