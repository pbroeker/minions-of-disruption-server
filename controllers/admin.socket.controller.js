const setTutorial = (adminNamespace, io) => (tutorialBool) => {
  io.sockets.emit('set-Tutorial', tutorialBool);
}

module.exports = { setTutorial }