#!/bin/bash
cat <<'SCRIPT' | node
const fs = require('fs');
const buffer = fs.readFileSync('features.db');
// Simple SQLite reader - find table with id=470
const data = buffer.toString('utf8');
// Look for the feature text around id 470
const match = data.match(/470[^}]*name[^}]*description[^}]*steps[^}]*\[[^\]]*\]/);
if (match) {
  console.log("Feature ID: 470");
  // Extract key fields
  const nameMatch = data.match(/470[^}]*name[^"]*"([^"]+)"/);
  const descMatch = data.match(/470[^}]*description[^"]*"([^"]+)"/);
  if (nameMatch) console.log("Name:", nameMatch[1]);
  if (descMatch) console.log("Description:", descMatch[1]);
} else {
  console.log("Could not find feature 470");
}
SCRIPT
