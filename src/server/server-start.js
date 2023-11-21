const express = require('express');
const {getContext} = require('./start-persistent-context.js');
 const app = express();

// // Define a route that handles the ID and returns the URL
app.get('/get-page', async (req, res) => {
    const pageId = req.query.pageId;

    res.send(await getContext(pageId));
});


app.get('/ping', (req, res) => {
  res.send("Server Online")
})

// Set the port for the server to listen on
const PORT = 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});