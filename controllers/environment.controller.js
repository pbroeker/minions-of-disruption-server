const raiseEmissions = (socket) => () => {
  // TODO set boardStateEmissions
  console.log('raising emissions');
  socket.emit('raise-global-emissions');
}

module.exports = { raiseEmissions }