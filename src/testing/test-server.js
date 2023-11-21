const axios = require('axios');

async function getRemoteContext() {
  const apiUrl = 'http://localhost:3000/ping';

  try {
    const response = await axios.get(apiUrl);
    const responseData = response.data;

    console.log('API Response:', responseData);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

(async()=>{
    await getRemoteContext()
})()
