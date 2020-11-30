const { captureRejectionSymbol } = require('events');
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



let users = [];
let rooms = [
  { name: 'room1', id: 1, players: [] },
  { name: 'room2', id: 2, players: [] },
  { name: 'room3', id: 3, players: [] },
];

io.on('connection', (socket) => { 
  socket.emit('send-rooms', rooms);

  socket.on('join-room', ({ player, roomNumber }) => {
    console.log(`Player ${player.name} joined room ${roomNumber}`);
    
    let newRooms = [...rooms];
    let oldPlayersInRoom = Array.from(rooms[roomNumber-1].players);
    let newPlayersInRoom = oldPlayersInRoom.filter((oldPlayer) => oldPlayer.name !== player.name);
    newPlayersInRoom.push(player);
    newRooms[roomNumber-1].players = newPlayersInRoom;
    socket.join(`room${roomNumber}`);
    io.emit('send-rooms', newRooms);
    io.in(`room${roomNumber}`).emit('player-joined-a-room' ,`Player ${player.name} joined this room`);
  });

  socket.on('leave-room', ({ player, roomNumber }) => {
    console.log(`Player ${player.name} left room ${roomNumber}`);
    
    let newRooms = [...rooms];
    let oldPlayersInRoom = Array.from(rooms[roomNumber-1].players);
    let newPlayersInRoom = oldPlayersInRoom.filter((oldPlayer) => oldPlayer.name !== player.name);
    newRooms[roomNumber-1].players = newPlayersInRoom;
    socket.leave(`room${roomNumber}`);
    io.emit('send-rooms', rooms);
    io.in(`room${roomNumber}`).emit('player-left-a-room' ,`Player ${player.name} joined this room`);
  });

  socket.on('disconnect', () => {
    console.log(`user disconnected: ${socket.id}`);
  });

  socket.on('send-user-message', ({ player, message}) => {
    console.log(`sending message ${message} from ${player.name} to ${player.designatedRoom}.`);
    io.in(`room${player.designatedRoom}`).emit('user-chat-message', { player:player, message: message });
  });

  socket.on('admin-action', (message) => {
    io.emit('send-user-message', { player: { name: 'Admin' } ,message: message });
  });

  socket.on('update-players', (player) => {
    const newPlayers = users.filter((oldPlayer) => oldPlayer.name !== player.name)
    newPlayers.push(player);
    users = newPlayers;
    io.emit('update-state-players', users);
  });
})

server.listen(PORT, () => {
  console.log(`listening on ${PORT}.`)
})
