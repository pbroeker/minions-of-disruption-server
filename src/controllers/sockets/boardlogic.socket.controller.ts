import { Namespace, Socket } from 'socket.io';
import { Player, Room } from '../../Interfaces/Server.types';

interface PermissionType {
  answerSeat: number;
  answer: boolean;
  position: number;
  room: number | undefined;
}

interface AskForPermissionType extends PermissionType {
  askerSeat: number;
}

interface PermissionType {
  answerSeat: number;
  answer: boolean;
  position: number;
  room: number | undefined;
}

interface UpdatePlayersTypes {
  players: Player;
  room: Room;
}

interface AskForPermissionType extends PermissionType {
  askerSeat: number;
}

const askForPermission = (playerNamespace: Namespace) => ({
  askerSeat,
  answerSeat,
  position,
  room,
}: AskForPermissionType): void => {
  console.log('ask for permission hit backend --->', askerSeat, answerSeat, position, room);
  playerNamespace.to(`room${room}`).emit('ask-for-premission-to-move', { askerSeat, answerSeat, position });
};

const sendPermission = (playerNamespace: Namespace) => ({
  answerSeat,
  answer,
  position,
  room,
}: PermissionType): void => {
  console.log('send permission hit backend --->', answerSeat, answer, position, room);
  playerNamespace
    .to(`room${room}`)
    .emit('send-permission-to-move', { answerSeat: answerSeat, answer: answer, position: position });
};

const updateGameStatus = ({ playerNamespace, socket }: { playerNamespace: Namespace; socket: Socket }) => (
  status: boolean
): void => {
  playerNamespace.emit('update-game-status', status);
  socket.emit('update-game-status', status);
};

const updatePlayersInRoom = ({ adminNamespace, socket }: { adminNamespace: Namespace; socket: Socket }) => ({
  players,
  room,
}: UpdatePlayersTypes): void => {
  socket.to(`room${room}`).emit('update-players-in-room', players);
  adminNamespace.emit('update-players-in-room', players);
};

const updateStateInRoom = ({ adminNamespace, socket }: { adminNamespace: Namespace; socket: Socket }) => ({
  boardState,
  roomID,
}: {
  boardState: string;
  roomID: number;
}): void => {
  const updState = { state: boardState, room: roomID };
  socket.to(`room${roomID}`).emit('update-state-in-room', boardState);
  adminNamespace.emit('update-state-in-room', updState);
};

export { updateGameStatus, sendPermission, askForPermission, updatePlayersInRoom, updateStateInRoom };
