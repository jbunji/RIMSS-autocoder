// Script to update notification dates via API
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001';
const USERNAME = 'admin';
const PASSWORD = 'admin123';

async function login() {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD })
  });
  const data = await response.json();
  return data.token;
}

async function getNotifications(token) {
  const response = await fetch(`${API_URL}/api/notifications`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
}

async function updateNotification(token, msgId, updates) {
  const response = await fetch(`${API_URL}/api/notifications/${msgId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  return await response.json();
}

(async () => {
  try {
    console.log('Logging in...');
    const token = await login();
    console.log('Token received');

    console.log('\nFetching all notifications...');
    const notifs = await getNotifications(token);
    console.log(`Found ${notifs.length} notifications`);

    // Find the test notification by checking in-memory (it might not show due to date filtering)
    // We'll need to look at the backend console or use a different approach

    console.log('\nVisible notifications:');
    notifs.forEach(n => {
      console.log(`- ID: ${n.msg_id}, Text: ${n.msg_text.substring(0, 50)}..., Start: ${n.start_date}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
})();
