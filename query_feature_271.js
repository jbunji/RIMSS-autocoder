const { spawn } = require('child_process');
const readline = require('readline');

// Spawn the MCP features server
const mcp = spawn('python3', ['-m', 'features_mcp'], {
  cwd: __dirname,
  stdio: ['pipe', 'pipe', 'pipe']
});

// Create readline interface for line-by-line processing
const rl = readline.createInterface({
  input: mcp.stdout,
  crlfDelay: Infinity
});

let response = '';
let collectingResponse = false;

rl.on('line', (line) => {
  if (collectingResponse) {
    response += line + '\n';
  }
  if (line.trim().startsWith('{') && line.includes('"jsonrpc"')) {
    collectingResponse = true;
    response = line + '\n';
  }
});

// Wait for server to initialize
setTimeout(() => {
  // Send a request to get feature 271
  const request = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'feature_get_next',
      arguments: {}
    }
  };

  mcp.stdin.write(JSON.stringify(request) + '\n');

  // Wait for response
  setTimeout(() => {
    console.log('Response:', response);
    mcp.kill();
  }, 2000);
}, 1000);

mcp.stderr.on('data', (data) => {
  console.error('Error:', data.toString());
});
