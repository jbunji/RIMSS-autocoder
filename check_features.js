const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('features.db');

db.serialize(() => {
    // Get stats
    db.get('SELECT COUNT(*) as count FROM features WHERE passes = 1', (err, row) => {
        if (err) {
            console.error('Error:', err);
            return;
        }
        console.log(`Passing: ${row.count}`);
    });

    db.get('SELECT COUNT(*) as count FROM features', (err, row) => {
        if (err) {
            console.error('Error:', err);
            return;
        }
        console.log(`Total: ${row.count}`);
    });

    db.get('SELECT COUNT(*) as count FROM features WHERE in_progress = 1', (err, row) => {
        if (err) {
            console.error('Error:', err);
            return;
        }
        console.log(`In Progress: ${row.count}`);
    });

    // Get a random passing feature
    db.get(`
        SELECT id, category, name, description, steps
        FROM features
        WHERE passes = 1 AND in_progress = 0
        ORDER BY RANDOM()
        LIMIT 1
    `, (err, row) => {
        if (err) {
            console.error('Error:', err);
            db.close();
            return;
        }

        if (row) {
            console.log('\n--- Random passing feature for testing ---');
            console.log(`ID: ${row.id}`);
            console.log(`Category: ${row.category}`);
            console.log(`Name: ${row.name}`);
            console.log(`Description: ${row.description}`);
            console.log(`Steps: ${row.steps}`);
        } else {
            console.log('\nNo passing features available for testing');
        }

        db.close();
    });
});
