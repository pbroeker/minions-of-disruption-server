import { Server, Namespace } from 'socket.io';
import { Room } from '../Interfaces/Server.types';

// TODO: add theGrandAlliance from setupController

const theGrandAllianceTrigger = (io: Server, playerNamespace: Namespace) => ({
  room,
  amount,
}: {
  room: Room;
  amount: string;
}): void => {
  console.log('Grand Alliance triggered on backend with', room, amount);
  io.sockets.emit('grand-alliance-trigger', { room, amount });
};

const theGrandAllianceOffer = (playerNamespace: Namespace) => ({
  amount,
  room,
}: {
  room: Room;
  amount: string;
}): void => {
  playerNamespace.to(`room${room}`).emit('grand-alliance-offer', parseInt(amount));
};

const theGrandAllianceFinal = (io: Server) => ({ success }: { success: boolean }): void => {
  io.sockets.emit('grand-alliance-final', success);
};

export { theGrandAllianceTrigger, theGrandAllianceOffer, theGrandAllianceFinal };
