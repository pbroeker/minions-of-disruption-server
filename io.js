const socketIo = require('socket.io');
const { joinRoom, sendRooms, leaveRoom, sendUserMessage, updatePlayers, adminCreateRooms } = require('./controllers/setup.controllers');

async function sio (server) {

  const io = socketIo(server, {
    cors: {
      // TODO: Change to the client
      // TODO: Add credentials: true and headers on deployment
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  const adminNamespace = io.of('/admin');
  const playerNamespace = io.of('');
  adminNamespace.on('connection', socket => {
    console.log('An admin logged in.')
    socket.on('admin-create-rooms', adminCreateRooms);
    io.on('join-room', joinRoom(adminNamespace, socket));
    io.on('leave-room', leaveRoom(adminNamespace, socket));
    io.on('update-players', updatePlayers(adminNamespace));
    socket.on('disconnect',() => {
      console.log(`admin disconnected: ${socket.id}.`)
    })
  });

  playerNamespace.on('connection', (socket) => { 
    console.log('Player connected');

    socket.emit('send-rooms', sendRooms());
  
    socket.on('join-room', joinRoom(io, socket));
  
    socket.on('leave-room', leaveRoom(io, socket));
  
    socket.on('send-user-message', sendUserMessage(io));
    
    socket.on('update-players', updatePlayers(io));
    
    socket.on('disconnect', () => {
      console.log(`user disconnected: ${socket.id}.`);
    });
  })
}

module.exports = sio;