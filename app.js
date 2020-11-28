const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const PORT = process.env.PORT || 3005;
const routes = require('./routes');
require('dotenv').config();

const app = express();
app.use(routes);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    // TODO: Change to the client
    // TODO: Add credentials: true and headers on deployment
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log (`New user connected: ${socket.id}`);

  socket.on('join-room', (player) => {
    console.log(player)
    socket.join(`room${player.room}`);
    console.log(`Player ${player.name} joined room ${player.room}`);
    socket.emit('player-joined-a-room', player);
    socket.to(`room${player.room}`).emit(`Player ${player.name} joined this room`);
  })

  socket.on('disconnect', () => {
    console.log(`user disconnected: ${socket.id}`);
  })

  socket.on('send-user-message', message => {
    socket.broadcast.emit('user-chat-message', message);
  })

})

server.listen(PORT, () => {
  console.log(`listening on ${PORT}.`)
})


// Helperfunctions
const createRoom = (roomNumber) => {
  const room = io.of(`/room${roomNumber}`);
  return room;
}