import { Namespace } from 'socket.io';

const raiseEmissions = (socket: Namespace) => (): void => {
  console.log('raising emissions');
  socket.emit('raise-global-emissions');
};

export { raiseEmissions };
