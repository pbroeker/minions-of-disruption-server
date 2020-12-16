import socketIo from 'socket.io';
import {
  theGrandAllianceFinal,
  theGrandAllianceOffer,
  theGrandAllianceTrigger,
  sendPermission,
  askForPermission,
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
  updatePlayersInRoom,
  tutorialReady,
  resetUsers,
} from './controllers/setup.controllers';
import { sendUserMessage } from './controllers/chat.socket.controller';
import { raiseEmissions } from './controllers/environment.controller';
import { setTutorial } from './controllers/admin.socket.controller';
import { Server } from 'http';

async function sio(server: Server): Promise<void> {
  const io = new socketIo.Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  const adminNamespace: socketIo.Namespace = io.of('/admin');
  const playerNamespace: socketIo.Namespace = io.of('');

  adminNamespace.on('connection', (socket) => {
    console.log('An admin logged in.');
    socket.on('send-game-status', updateGameStatus(playerNamespace, socket));
    socket.on('admin-create-rooms', adminCreateRooms);
    socket.on('update-players', updatePlayers(io));
    socket.on('start-game', startGame(playerNamespace, socket));
    socket.on('send-user-message', sendUserMessage(socket, io));
    socket.on('emission-raise', raiseEmissions(playerNamespace));
    socket.on('set-tutorial', setTutorial(io));
    socket.on('reset-users', resetUsers);
    socket.on('disconnect', () => {
      console.log(`admin disconnected: ${socket.id}.`);
    });
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
    socket.on('ask-for-premission-to-move', askForPermission(socket));
    socket.on('send-permission-to-move', sendPermission(socket));
    socket.on('grand-alliance-trigger', theGrandAllianceTrigger(io, socket));
    socket.on('grand-alliance-offer', theGrandAllianceOffer(socket));
    socket.on('grand-alliance-final', theGrandAllianceFinal(io));
    socket.on('tutorial-ready', tutorialReady(socket));

    socket.on('disconnect', () => {
      console.log(`user disconnected: ${socket.id}.`);
    });
  });
}

export default sio;
