import socketIo, { Namespace, Socket } from 'socket.io';
import {
  globalDisruptionTrigger,
  startGame,
  joinRoom,
  sendRooms,
  leaveRoom,
  updatePlayers,
  adminCreateRooms,
  resetUsers,
} from './controllers/setup.controllers';
import { globalDisruptionAfterChoice, globalDisruptionResponse } from './controllers/globalevents.socket.controller';
import {
  theGrandAllianceFinal,
  theGrandAllianceOffer,
  theGrandAllianceTrigger,
} from './controllers/grandAlliance.socket.controller';
import { setTutorial, tutorialReady } from './controllers/tutorial.socket.controller';
import {
  sendPermission,
  askForPermission,
  updateGameStatus,
  updatePlayersInRoom,
  updateStateInRoom,
} from './controllers/boardlogic.socket.controller';
import { sendUserMessage } from './controllers/chat.socket.controller';
import { raiseEmissions } from './controllers/environment.controller';
import { Server } from 'http';

async function sio(server: Server): Promise<void> {
  const io = new socketIo.Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  const adminNamespace: Namespace = io.of('/admin');
  const playerNamespace: Namespace | Server = io.of('');

  adminNamespace.on('connection', (socket: Socket) => {
    console.log('An admin logged in.');
    socket.on('send-game-status', updateGameStatus({ playerNamespace, socket }));
    socket.on('admin-create-rooms', adminCreateRooms);
    socket.on('update-players', updatePlayers({ adminNamespace, playerNamespace }));
    socket.on('start-game', startGame(playerNamespace));
    socket.on('send-user-message', sendUserMessage({ adminNamespace, playerNamespace }));
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
    socket.on('leave-room', leaveRoom({ adminNamespace, io, socket }));
    socket.on('send-user-message', sendUserMessage({ adminNamespace, playerNamespace }));
    socket.on('update-players', updatePlayers({ adminNamespace, playerNamespace }));
    socket.on('update-players-in-room', updatePlayersInRoom({ adminNamespace, socket }));
    socket.on('update-state-in-room', updateStateInRoom({ adminNamespace, socket }));
    socket.on('global-disruption-trigger', globalDisruptionTrigger({ adminNamespace, socket }));
    socket.on('global-disruption-response', globalDisruptionResponse({ adminNamespace, socket }));
    socket.on('global-disruption-choice', globalDisruptionAfterChoice({ adminNamespace, socket }));
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
