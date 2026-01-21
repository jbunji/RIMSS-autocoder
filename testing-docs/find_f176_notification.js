const Database = require('better-sqlite3');
const db = new Database('features.db');

// First, let's read the backend index.ts to find the notifications array
const fs = require('fs');
const path = require('path');

// Read backend index.ts and look for notifications with TEST_176
const backendPath = path.join(__dirname, 'backend', 'src', 'index.ts');
const content = fs.readFileSync(backendPath, 'utf8');

// Find the notifications array initialization
const notificationsMatch = content.match(/const notifications: Notification\[\] = \[([\s\S]*?)\];/);

if (notificationsMatch) {
  console.log('Found notifications array initialization');
  console.log('Looking for TEST_176 notifications...');

  // Parse to find TEST_176 notifications
  const notificationsSection = notificationsMatch[1];
  if (notificationsSection.includes('TEST_176')) {
    console.log('Found TEST_176 notification in code!');
    // Extract the relevant section
    const lines = notificationsSection.split('\n');
    let inTest176 = false;
    let notification = [];
    for (const line of lines) {
      if (line.includes('TEST_176')) {
        inTest176 = true;
      }
      if (inTest176) {
        notification.push(line);
        if (line.includes('},')) {
          break;
        }
      }
    }
    console.log(notification.join('\n'));
  } else {
    console.log('TEST_176 notification not in initial array - it was created via API');
    console.log('The notification exists in memory only (in-memory array)');
  }
}

db.close();
