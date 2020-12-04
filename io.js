const socketIo = require('socket.io');
const { emitNextPlayer, updateStateInRoom, updateGameStatus, startGame, joinRoom, adminSendMessage, sendRooms, leaveRoom, sendUserMessage, updatePlayers, adminCreateRooms, updatePlayersInRoom } = require('./controllers/setup.controllers');

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
    console.log('An admin logged in.');
    socket.on('send-game-status', updateGameStatus(playerNamespace, socket))
    socket.on('admin-create-rooms', adminCreateRooms);
    socket.on('admin-sends-to-all', adminSendMessage(io));
    socket.on('join-room', joinRoom(io, socket));
    socket.on('leave-room', leaveRoom(io, socket));
    socket.on('update-players', updatePlayers(io));
    socket.on('start-game', startGame(playerNamespace, socket));
    socket.on('disconnect',() => {
      console.log(`admin disconnected: ${socket.id}.`)
    })
  });
  playerNamespace.on('connection', (socket) => { 
    console.log('Player connected' + socket.client.id);
    socket.emit('send-rooms', sendRooms());
    socket.on('join-room', joinRoom(adminNamespace, socket));
    socket.on('leave-room', leaveRoom(adminNamespace, socket));
    socket.on('send-user-message', sendUserMessage(adminNamespace, socket));
    socket.on('update-players', updatePlayers(adminNamespace, socket));
    socket.on('update-players-in-room', updatePlayersInRoom(adminNamespace, socket));
    socket.on('update-state-in-room', updateStateInRoom(adminNamespace, socket));
    socket.on('update-next-player', emitNextPlayer(socket));

    socket.on('disconnect', () => {
      console.log(`user disconnected: ${socket.id}.`);
    });
  })
}

module.exports = sio;