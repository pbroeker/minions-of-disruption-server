import { Namespace, Socket } from 'socket.io';

// Global disruptions
// TODO: Take care of any in state
const globalDisruptionResponse = ({ adminNamespace, socket }: { adminNamespace: Namespace; socket: Socket }) => (
  state: any
): void => {
  socket.to(`room${state.to}`).emit('global-disruption-response', state);
};

const globalDisruptionAfterChoice = ({ adminNamespace, socket }: { adminNamespace: Namespace; socket: Socket }) => ({
  position,
  to,
}: {
  position: number;
  to: number;
}): void => {
  socket.to(`room${to}`).emit('global-disruption-choice', position);
};

export { globalDisruptionAfterChoice, globalDisruptionResponse };
