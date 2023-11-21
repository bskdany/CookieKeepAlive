const express = require('express');
const {getContext} = require('./start-persistent-context.js');
 const app = express();

// // Define a route that handles the ID and returns the URL
app.get('/get-page/:id', async (req, res) => {
  const pageId = req.params.id;

  // Replace the next line with your own logic to determine the URL based on the ID

    // const port = await startContext(pageId);
    
  // Send the URL as the response
    // console.log("got port " + port)
    res.send(await getContext(pageId));
});

// Set the port for the server to listen on
const PORT = 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});