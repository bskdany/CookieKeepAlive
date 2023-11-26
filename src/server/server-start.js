const express = require('express');
const {getContext} = require('./start-persistent-context.js');
const {makeNotReloadable, makeReloadable} = require('../database/db-controller.js')
const app = express();

app.get('/get-page', async (req, res) => {
    const pageId = req.query.pageId;
    console.log(`Requested page with id ${pageId}`)
    const contextPort = await getContext(pageId);
    console.log(`For page id ${pageId} got context port ${contextPort.port}`)
    res.send(contextPort);
});

app.get('/return-page', async (req, res) => {
  const pageId = req.query.pageId;
  console.log(`Returned page with id ${pageId}`)
  makeReloadable(pageId)
  res.sendStatus(200)
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