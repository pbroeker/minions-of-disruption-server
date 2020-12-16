const setTutorial = (io: SocketIO.Server) => (tutorialBool: boolean): void => {
  io.sockets.emit('set-Tutorial', tutorialBool);
};

export { setTutorial };
