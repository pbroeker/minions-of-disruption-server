require('dotenv').config();
const express = require('express');
const http = require('http');
const PORT = process.env.PORT || 3005;
const db = require('./model/index');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const sio = require('./io');
const { json } = require('express');
const router = require('./routes');
const app = express();

const server = http.createServer(app);
sio(server);

app.use(json());
app.use(cookieparser());
app.use(cors({
  credentials: true,
  origin:'http://localhost:3000',
  methods: ['GET', 'PUT', 'POST']
}
));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));

app.use(router);

// (async function () {
//   await db;
server.listen(PORT, () => {
  console.log(`🍍🍕 listening on ${PORT}. 🍕🍍`)
})
// })
