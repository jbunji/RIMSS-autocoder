const Database = require('better-sqlite3');
const path = require('path');

// The database is features.db in the project directory
const dbPath = path.join(__dirname, 'features.db');
console.log('Looking for database at:', dbPath);

try {
    const db = new Database(dbPath, { readonly: true });

    const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(305);

    if (feature) {
        console.log('\n=== FEATURE #305 ===\n');
        console.log('ID:', feature.id);
        console.log('Priority:', feature.priority);
        console.log('Category:', feature.category);
        console.log('Name:', feature.name);
        console.log('Description:', feature.description);
        console.log('Steps:', feature.steps);
        console.log('Passes:', feature.passes);
        console.log('In Progress:', feature.in_progress);
        console.log('Dependencies:', feature.dependencies);
    } else {
        console.log('Feature 305 not found');
    }

    db.close();
} catch (err) {
    console.error('Error:', err.message);
}
