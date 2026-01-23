import fs from 'fs';
const data = JSON.parse(fs.readFileSync('/Users/justinbundrick/.claude/projects/-Users-justinbundrick-Documents-ALAESolutions-RIMSS-RIMSS-autocoder/9737badf-21a8-4a6f-85b5-13f0a3b2b860/tool-results/mcp-features-feature_get_graph-1769055240570.txt'));
const result = JSON.parse(data.result);
const feature = result.nodes.find(n => n.id === 446);
console.log(JSON.stringify(feature, null, 2));
