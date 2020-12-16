import { Server } from 'socket.io';

const setTutorial = (io: Server) => (tutorialBool: boolean): void => {
  io.sockets.emit('set-Tutorial', tutorialBool);
};

export { setTutorial };
