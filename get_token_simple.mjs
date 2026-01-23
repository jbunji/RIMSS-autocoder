import http from 'http';

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/login',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log(result.token);
    } catch (e) {
      console.error('Failed to parse response:', data);
    }
  });
});

req.on('error', (err) => {
  console.error('Request failed:', err.message);
});

req.write(JSON.stringify({ username: 'admin', password: 'admin123' }));
req.end();
