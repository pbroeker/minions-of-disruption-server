import rfdc from 'rfdc';
import { Namespace, Server, Socket } from 'socket.io';
import { User, Room } from '../../Interfaces/Server.types';

const clone = rfdc();
let rooms: Room[] = [];
let users: User[] = [];

interface ChangeRoomTypes {
  user: User;
  roomId: number;
}

const resetUsers = (): void => {
  users = [];
};

const sendRooms = (): Room[] => {
  return rooms;
};

const adminCreateRooms = (roomObjects: Room[]): void => {
  rooms = roomObjects;
};

const joinRoom = (adminNamespace: Namespace, io: Server, socket: SocketIO.Socket) => ({
  user,
  roomId,
}: ChangeRoomTypes): void => {
  const newRooms = clone(rooms);
  newRooms[roomId].players.push(user);
  rooms = newRooms;

  const newUsers = users.filter((el) => el.name !== user.name);
  users = [...newUsers];

  users.push(user);
  socket.join(`room${roomId}`);
  io.emit('send-rooms', newRooms);
  adminNamespace.emit('send-rooms', newRooms);
  socket.in(`room${roomId}`).emit('player-joined-a-room', `Player ${user.name} joined this room`);
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

// TODO Move to other controller after rooms are dynamic
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

export {
  globalDisruptionTrigger,
  startGame,
  joinRoom,
  sendRooms,
  leaveRoom,
  updatePlayers,
  adminCreateRooms,
  resetUsers,
};
