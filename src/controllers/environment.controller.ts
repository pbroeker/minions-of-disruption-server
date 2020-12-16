const raiseEmissions = (socket: SocketIO.Namespace) => (): void => {
  console.log('raising emissions');
  socket.emit('raise-global-emissions');
};

export { raiseEmissions };
