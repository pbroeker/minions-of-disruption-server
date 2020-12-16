import rfdc from 'rfdc';
import { Namespace, Server, Socket } from 'socket.io';
import { User, Room, Player } from '../Interfaces/Server.types';

const clone = rfdc();
let rooms: Room[] = [];
let users: User[] = [];

interface ChangeRoomTypes {
  user: User;
  roomId: number;
}

const joinRoom = (adminNamespace: Namespace, io: Server, socket: SocketIO.Socket) => ({
  user,
  roomId,
}: ChangeRoomTypes): void => {
  const newRooms = clone(rooms);
  newRooms[roomId].players.push(user);
  rooms = newRooms;

  // console.log('users original', users)
  const newUsers = users.filter((el) => el.name !== user.name);
  users = [...newUsers];
  // console.log('users array after upd', users);
  // console.log('new users array', newUsers);

  users.push(user);
  socket.join(`room${roomId}`);
  io.emit('send-rooms', newRooms);
  adminNamespace.emit('send-rooms', newRooms);
  socket.in(`room${roomId}`).emit('player-joined-a-room', `Player ${user.name} joined this room`);
};

const sendRooms = (): Room[] => {
  return rooms;
};

const leaveRoom = ({ adminNamespace, io, socket }: { adminNamespace: Namespace; io: Server; socket: Socket }) => ({
  user,
  roomId,
}: ChangeRoomTypes): void => {
  users = users.filter((player) => player.name != user.name);
  console.log(`user ${user} left room ${roomId}`);
  const newRooms = clone(rooms);
  const newRoomPlayers = newRooms[roomId].players.filter((player: User) => player.name !== user.name);
  newRooms[roomId].players = newRoomPlayers;
  rooms = newRooms;
  socket.leave(`room${roomId}`);
  io.emit('send-rooms', newRooms);
  adminNamespace.emit('send-rooms', newRooms);
  socket.in(`room${roomId}`).emit('player-left-a-room', `Player ${user.name} joined  this room`);
};

const updatePlayers = ({
  adminNamespace,
  playerNamespace,
}: {
  adminNamespace: Namespace;
  playerNamespace: Namespace;
}) => (player: User): void => {
  const newPlayers = users.filter((oldPlayer) => oldPlayer.name !== player.name);
  newPlayers.push(player);
  users = newPlayers;
  adminNamespace.emit('update-state-players', users);
  playerNamespace.emit('update-state-players', users);
};

const adminCreateRooms = (roomObjects: Room[]): void => {
  rooms = roomObjects;
};

const updateGameStatus = ({ playerNamespace, socket }: { playerNamespace: Namespace; socket: Socket }) => (
  status: boolean
): void => {
  playerNamespace.emit('update-game-status', status);
  socket.emit('update-game-status', status);
};

const startGame = (playerNamespace: Namespace) => (): void => {
  const colors = ['blue', 'red', 'green', 'orange'];
  const updatedUsers = users
    .map((user) => {
      if (user.designatedRoom !== undefined) {
        const defaultRole = {
          id: 10,
          name: 'default',
          description: '',
          color: colors[user.seat],
          power: '',
          image: '',
        };
        return {
          ...user,
          position: 1,
          role: defaultRole,
          hand: [],
          remainingActions: 0,
          boardId: rooms[user.designatedRoom]._id,
        };
      }
    })
    .filter((el) => el !== undefined || el !== false);
  rooms.forEach((room) => {
    playerNamespace.in(`room${room.id}`).emit(
      'start-the-game',
      updatedUsers.filter((user) => user?.designatedRoom === room.id)
    );
  });
};

interface UpdatePlayersTypes {
  players: Player;
  room: Room;
}

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

// Global disruptions
const globalDisruptionTrigger = ({ adminNamespace, socket }: { adminNamespace: Namespace; socket: Socket }) => ({
  roomID,
  left,
}: {
  roomID: number;
  left: boolean;
}): void => {
  let toRoom;
  if (left) {
    roomID === 0 ? (toRoom = rooms.length - 1) : (toRoom = roomID - 1);
  } else {
    roomID === rooms.length - 1 ? (toRoom = 0) : (toRoom = roomID + 1);
  }
  socket.to(`room${toRoom}`).emit('global-disruption-trigger', { from: toRoom, to: roomID });
  adminNamespace.emit('global-disruption-trigger', { roomID, toRoom });
};

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

interface PermissionType {
  answerSeat: number;
  answer: boolean;
  position: number;
  room: number | undefined;
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

const theGrandAllianceTrigger = (io: Server, playerNamespace: SocketIO.Namespace) => ({
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

const tutorialReady = (playerNamespace: Namespace) => ({ room }: { room: Room }): void => {
  console.log('tutorial ready backend');
  playerNamespace.to(`room${room}`).emit('tutorial-ready', room);
};

const resetUsers = (): void => {
  console.log('resetting users. Users before: ', users);
  users = [];
  console.log('resetting users. Users after: ', users);
};

export {
  sendPermission,
  askForPermission,
  globalDisruptionAfterChoice,
  globalDisruptionResponse,
  globalDisruptionTrigger,
  updateStateInRoom,
  startGame,
  updateGameStatus,
  joinRoom,
  sendRooms,
  leaveRoom,
  updatePlayers,
  adminCreateRooms,
  updatePlayersInRoom,
  theGrandAllianceTrigger,
  theGrandAllianceOffer,
  theGrandAllianceFinal,
  tutorialReady,
  resetUsers,
};
