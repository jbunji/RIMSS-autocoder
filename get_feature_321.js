const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./features.db');

db.get('SELECT id, category, name, description, steps, passes, in_progress FROM features WHERE id = 321', (err, row) => {
    if (err) {
        console.error('Error:', err);
        process.exit(1);
    }
    if (row) {
        console.log('ID:', row.id);
        console.log('Category:', row.category);
        console.log('Name:', row.name);
        console.log('Description:', row.description);
        console.log('\nSteps:');
        const steps = JSON.parse(row.steps);
        steps.forEach((step, i) => {
            console.log(`  ${i + 1}. ${step}`);
        });
        console.log('\nPasses:', row.passes);
        console.log('In Progress:', row.in_progress);
    } else {
        console.log('Feature #321 not found');
    }
    db.close();
});
