const http = require('http');
const fs = require('fs');

const token = Buffer.from('{"userId":1,"username":"admin","role":"ADMIN"}').toString('base64');
const postData = fs.readFileSync('create_admin_user.json', 'utf8');

// First delete the user if it exists
const deleteOptions = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/users/6',
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

const deleteReq = http.request(deleteOptions, () => {
  console.log('Previous user deleted (if existed)');

  // Now create the user
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/users',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      const parsed = JSON.parse(data);
      if (parsed.user) {
        console.log('\n✅ Admin user created successfully!');
        console.log('Username:', parsed.user.username);
        console.log('Role:', parsed.user.role);
        console.log('Total locations assigned:', parsed.user.locations.length);
        console.log('First 3 locations:', parsed.user.locations.slice(0, 3).map(l => l.display_name));
        console.log('Last 3 locations:', parsed.user.locations.slice(-3).map(l => l.display_name));
        console.log('\n🎉 SUCCESS: All', parsed.user.locations.length, 'locations were automatically assigned to the admin user!');
      } else {
        console.error('Error:', parsed);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Error:', error);
  });

  req.write(postData);
  req.end();
});

deleteReq.on('error', () => {
  // Ignore delete errors
});

deleteReq.end();
