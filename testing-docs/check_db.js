const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./assistant.db');

db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
    if (err) {
        console.error('Error:', err);
        process.exit(1);
    }
    console.log('Tables in assistant.db:');
    rows.forEach(row => console.log(' -', row.name));
    db.close();
});
