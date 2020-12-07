const socketIo = require('socket.io');
const {
  globalDisruptionAfterChoice,
  globalDisruptionResponse,
  globalDisruptionTrigger,
  updateStateInRoom,
  updateGameStatus,
  startGame,
  joinRoom,
  sendRooms,
  leaveRoom,
  updatePlayers,
  adminCreateRooms,
  updatePlayersInRoom
} = require('./controllers/setup.controllers');
const { sendUserMessage } = require('./controllers/chat.socket.controller');
const { raiseEmissions } = require('./controllers/environment.controller');
async function sio (server) {

  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  const adminNamespace = io.of('/admin');
  const playerNamespace = io.of('');

  adminNamespace.on('connection', socket => {
    console.log('An admin logged in.');
    socket.on('send-game-status', updateGameStatus(playerNamespace, socket))
    socket.on('admin-create-rooms', adminCreateRooms);
    socket.on('update-players', updatePlayers(io));
    socket.on('start-game', startGame(playerNamespace, socket));
    socket.on('send-user-message', sendUserMessage(socket, io));
    socket.on('emission-raise', raiseEmissions (playerNamespace));
    // socket.on('set-start-data', setStart);
    socket.on('disconnect',() => {
      console.log(`admin disconnected: ${socket.id}.`)
    })
  });
  playerNamespace.on('connection', (socket) => { 
    console.log('Player connected' + socket.client.id);
    socket.emit('send-rooms', sendRooms());
    socket.on('join-room', joinRoom(adminNamespace, io, socket));
    socket.on('leave-room', leaveRoom(adminNamespace, io, socket));
    socket.on('send-user-message', sendUserMessage(adminNamespace, io));
    socket.on('update-players', updatePlayers(adminNamespace, socket));
    socket.on('update-players-in-room', updatePlayersInRoom(adminNamespace, socket));
    socket.on('update-state-in-room', updateStateInRoom(adminNamespace, socket));
    socket.on('global-disruption-trigger', globalDisruptionTrigger(adminNamespace, socket));
    socket.on('global-disruption-response', globalDisruptionResponse(adminNamespace, socket));
    socket.on('global-disruption-choice', globalDisruptionAfterChoice(adminNamespace, socket));
    // socket.on('update-users', updateUsers(adminNamespace, socket));
    socket.on('disconnect', () => {
      console.log(`user disconnected: ${socket.id}.`);
    });
  })
}

module.exports = sio;