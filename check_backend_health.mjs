import http from 'http';

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log('Health check status:', res.statusCode);
  res.on('data', (d) => {
    console.log('Response:', d.toString());
  });
});

req.on('error', (e) => {
  console.error('Health check failed:', e.message);
});

req.end();
