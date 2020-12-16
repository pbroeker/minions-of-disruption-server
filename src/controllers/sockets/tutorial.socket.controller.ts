import { Namespace, Server } from 'socket.io';
import { Room } from '../../Interfaces/Server.types';

const tutorialReady = (playerNamespace: Namespace) => ({ room }: { room: Room }): void => {
  playerNamespace.to(`room${room}`).emit('tutorial-ready', room);
};

const setTutorial = (io: Server) => (tutorialBool: boolean): void => {
  io.sockets.emit('set-Tutorial', tutorialBool);
};

export { tutorialReady, setTutorial };
