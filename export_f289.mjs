import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(process.cwd(), 'assistant.db');

const db = new Database(dbPath);
const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(289);

if (feature) {
  console.log('='.repeat(80));
  console.log(`Feature #${feature.id}`);
  console.log('='.repeat(80));
  console.log(`Category: ${feature.category}`);
  console.log(`Name: ${feature.name}`);
  console.log(`Description: ${feature.description}`);
  console.log('\nSteps:');
  const steps = JSON.parse(feature.steps);
  steps.forEach((step, i) => {
    console.log(`  ${i + 1}. ${step}`);
  });
  console.log(`\nPasses: ${feature.passes}`);
  console.log(`In Progress: ${feature.in_progress}`);
  console.log('='.repeat(80));
} else {
  console.log('Feature #289 not found');
}

db.close();
