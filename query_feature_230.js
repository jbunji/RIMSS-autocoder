const fetch = require('node-fetch');

async function getFeature() {
  try {
    const response = await fetch('http://localhost:3456/features/230');
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getFeature();
