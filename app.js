const express = require('express');
const http = require('http');
const PORT = process.env.PORT || 3005;
const routes = require('./routes');
require('dotenv').config();
const sio = require('./io');
const app = express();
app.use(routes);

const server = http.createServer(app);

sio(server);

server.listen(PORT, () => {
  console.log(`🍍🍍 listening on ${PORT}. 🍕🍕`)
})
