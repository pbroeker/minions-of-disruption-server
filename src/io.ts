import socketIo, { Namespace, Socket } from 'socket.io';
import * as setup from './controllers/sockets/setup.socket.controller';
import * as alliance from './controllers/sockets/grandAlliance.socket.controller';
import * as board from './controllers/sockets/boardlogic.socket.controller';
import * as globalDisr from './controllers/sockets/globalevents.socket.controller';
import { setTutorial, tutorialReady } from './controllers/sockets/tutorial.socket.controller';
import { sendUserMessage } from './controllers/sockets/chat.socket.controller';
import { raiseEmissions } from './controllers/sockets/environment.socket.controller';
import { Server } from 'http';

async function sio(server: Server): Promise<void> {
  const io = new socketIo.Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  const adminNamespace: Namespace = io.of('/adminsocket');
  const playerNamespace: Namespace | Server = io.of('');

  adminNamespace.on('connection', (socket: Socket) => {
    console.log('An admin logged in.');
    socket.on('update-players', setup.updatePlayers({ adminNamespace, playerNamespace }));
    socket.on('start-game', setup.startGame(playerNamespace));
    socket.on('reset-users', setup.resetUsers);
    socket.on('admin-create-rooms', setup.adminCreateRooms);
    socket.on('send-game-status', board.updateGameStatus({ playerNamespace, socket }));
    socket.on('send-user-message', sendUserMessage({ adminNamespace, playerNamespace }));
    socket.on('emission-raise', raiseEmissions(playerNamespace));
    socket.on('set-tutorial', setTutorial(io));
    socket.on('disconnect', () => {
      console.log(`admin disconnected: ${socket.id}.`);
    });
  });
  playerNamespace.on('connection', (socket) => {
    console.log('Player connected' + socket.client.id);
    socket.on('global-disruption-trigger', setup.globalDisruptionTrigger({ adminNamespace, socket }));
    socket.emit('send-rooms', setup.sendRooms());
    socket.on('join-room', setup.joinRoom(adminNamespace, io, socket));
    socket.on('leave-room', setup.leaveRoom({ adminNamespace, io, socket }));
    socket.on('update-players', setup.updatePlayers({ adminNamespace, playerNamespace }));
    socket.on('update-players-in-room', board.updatePlayersInRoom({ adminNamespace, socket }));
    socket.on('update-state-in-room', board.updateStateInRoom({ adminNamespace, socket }));
    socket.on('send-permission-to-move', board.sendPermission(socket));
    socket.on('ask-for-premission-to-move', board.askForPermission(socket));
    socket.on('global-disruption-response', globalDisr.globalDisruptionResponse({ adminNamespace, socket }));
    socket.on('global-disruption-choice', globalDisr.globalDisruptionAfterChoice({ adminNamespace, socket }));
    socket.on('grand-alliance-trigger', alliance.theGrandAllianceTrigger(io, socket));
    socket.on('grand-alliance-offer', alliance.theGrandAllianceOffer(socket));
    socket.on('grand-alliance-final', alliance.theGrandAllianceFinal(io));
    socket.on('send-user-message', sendUserMessage({ adminNamespace, playerNamespace }));
    socket.on('tutorial-ready', tutorialReady(socket));

    socket.on('disconnect', () => {
      console.log(`user disconnected: ${socket.id}.`);
    });
  });
}

export default sio;
