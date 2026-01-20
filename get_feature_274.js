const Database = require('better-sqlite3');
const db = new Database('features.db', { readonly: true });

const feature = db.prepare('SELECT id, category, name, description, steps, passes, in_progress FROM features WHERE id = ?').get(274);

if (feature) {
    console.log('ID:', feature.id);
    console.log('Category:', feature.category);
    console.log('Name:', feature.name);
    console.log('Description:', feature.description);
    console.log('Steps:', feature.steps);
    console.log('Passes:', feature.passes);
    console.log('In Progress:', feature.in_progress);
} else {
    console.log('Feature #274 not found');
}

db.close();
