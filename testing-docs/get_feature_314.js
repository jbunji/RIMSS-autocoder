const Database = require('better-sqlite3');
const db = new Database('features.db');

const row = db.prepare(`
    SELECT id, category, name, description, steps, passes, in_progress, dependencies
    FROM features
    WHERE id = 314
`).get();

if (row) {
    console.log(`Feature #${row.id}`);
    console.log(`Category: ${row.category}`);
    console.log(`Name: ${row.name}`);
    console.log(`Description: ${row.description}`);
    console.log(`\nSteps:`);
    const steps = JSON.parse(row.steps);
    steps.forEach((step, i) => {
        console.log(`  ${i + 1}. ${step}`);
    });
    console.log(`\nPasses: ${row.passes}`);
    console.log(`In Progress: ${row.in_progress}`);
    console.log(`Dependencies: ${row.dependencies}`);
} else {
    console.log("Feature not found");
}

db.close();
