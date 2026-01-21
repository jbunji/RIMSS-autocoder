const fs = require('fs');
const content = fs.readFileSync('/Users/justinbundrick/.claude/projects/-Users-justinbundrick-Documents-ALAESolutions-RIMSS-RIMSS-autocoder/0cc50178-25c0-4951-8ddf-02bea8acea7a/tool-results/mcp-playwright-browser_click-1769006250880.txt', 'utf8');

// Parse the JSON
const data = JSON.parse(content);
const yamlText = data[0].text;

// Look for Save Changes button
const lines = yamlText.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Save Changes') || lines[i].includes('button') && lines[i].includes('Save')) {
    console.log(`Line ${i}: ${lines[i]}`);
  }
}
