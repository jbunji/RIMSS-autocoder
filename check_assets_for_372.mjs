import http from 'http';

// Login to get token
const loginData = JSON.stringify({ username: 'admin', password: 'admin123' });

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const req = http.request(loginOptions, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const response = JSON.parse(body);
    const token = response.token;
    console.log('Token:', token ? 'Got token' : 'No token');

    // Now get assets
    const assetOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/assets?limit=10',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const assetReq = http.request(assetOptions, (assetRes) => {
      let assetBody = '';
      assetRes.on('data', chunk => assetBody += chunk);
      assetRes.on('end', () => {
        console.log('\nAssets response:', assetBody.substring(0, 500));
      });
    });

    assetReq.on('error', (e) => {
      console.error('Error getting assets:', e.message);
    });

    assetReq.end();
  });
});

req.on('error', (e) => {
  console.error('Error logging in:', e.message);
});

req.write(loginData);
req.end();
