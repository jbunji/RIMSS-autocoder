const fs = require('fs');

const filePath = '/Users/justinbundrick/.claude/projects/-Users-justinbundrick-Documents-ALAESolutions-RIMSS-RIMSS-autocoder/79237d75-4aaa-417b-8094-8af785464040/tool-results/mcp-features-feature_get_graph-1768925056520.txt';

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const graph = JSON.parse(data.result);

const feature353 = graph.nodes.find(node => node.id === 353);

if (feature353) {
  console.log(JSON.stringify(feature353, null, 2));
} else {
  console.log('Feature #353 not found in graph');
}
