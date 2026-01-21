const https = require('http');

const token = Buffer.from('{"userId":1,"username":"admin","role":"ADMIN"}').toString('base64');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/locations',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const parsed = JSON.parse(data);
    console.log('Total locations:', parsed.locations.length);
    console.log('\nFirst 10 locations:');
    parsed.locations.slice(0, 10).forEach((loc, i) => {
      console.log(`${i + 1}. ${loc.display_name} (ID: ${loc.loc_id})`);
    });
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();
