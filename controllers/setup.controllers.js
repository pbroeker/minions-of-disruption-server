const clone = require('rfdc')()

let rooms = [
  { name: 'room1', id: 0, players: [] },
  { name: 'room2', id: 1, players: [] },
  { name: 'room3', id: 2, players: [] },
];

let users = [];

const joinRoom = (adminNamespace, io, socket) => ({ user, roomId, boardId }) => {
  console.log(`user ${user} joined room ${roomId}`);
  const newRooms = clone(rooms);
  newRooms[roomId].players.push(user);
  rooms = newRooms;
  users.push(user);  
  socket.join(`room${roomId}`);
  io.emit('send-rooms', newRooms);
  adminNamespace.emit('send-rooms', newRooms);
  socket.in(`room${roomId}`).emit('player-joined-a-room' ,`Player ${user.name} joined this room`);
} 

const sendRooms = () => {
  return rooms;
}

const adminSendMessage = (io) => (adminMessage) => {
  console.log(`Admin: Sending message ${adminMessage.message} from ${adminMessage.admin.name}`);
  io.emit('send-user-message', { user: adminMessage.admin, message: adminMessage.message });
  // socket.emit('user-chat-message-to-admin', { user: adminMessage.admin, message: adminMessage.message });
  // io.emit('user-chat-message', { player: { name: 'Admin' }, message: message })
}

const leaveRoom = (adminNamespace, io, socket) => ({ user, roomId }) => {
  users = users.filter(player => player.name != user.name)
  console.log(`user ${user} left room ${roomId}`);
  const newRooms = clone(rooms);
  const newRoomPlayers = newRooms[roomId].players.filter(player => player.name !== user.name);
  newRooms[roomId].players = newRoomPlayers;
  rooms = newRooms;
  socket.leave(`room${roomId}`);
  io.emit('send-rooms', newRooms);
  adminNamespace.emit('send-rooms', newRooms);
  socket.in(`room${roomId}`).emit('player-left-a-room' ,`Player ${user.name} joined  this room`);
}

const sendUserMessage = (adminNamespace, io) => ({ user, message}) => {
  console.log(`User: sending message ${message} from ${user.name} to ${user.designatedRoom}.`);
  io.to(`room${user.designatedRoom}`).emit('send-user-message', { user:user, message: message });
  adminNamespace.emit('send-user-message', { user: user, message: message });
};

const updatePlayers = (adminNamespace, socket) => (player) => {
  const newPlayers = users.filter((oldPlayer) => oldPlayer.name !== player.name)
  newPlayers.push(player);
  users = newPlayers;
  adminNamespace.emit('update-state-players', users);
  socket.emit('update-state-players', users);
}

const adminCreateRooms = (roomObjects) => {
  rooms = roomObjects;
}

const updateGameStatus = (playerNamespace, socket) => (status) => {
  playerNamespace.emit('update-game-status', status);
  socket.emit('update-game-status', status);
}

const startGame = (playerNamespace) => () => {
  const colors = ['blue', 'red', 'green', 'orange'];
  const updatedUsers = users.map((user) => {
    const defaultRole = { name: 'default', description: '', color: colors[user.seat], power: '', image: '' };
    return {...user, position: 1, role: defaultRole, hand: [], remainingActions: 0, boardId : rooms[user.designatedRoom].boardId };
  })
  rooms.forEach((room) => {
    playerNamespace.in(`room${room.id}`).emit('start-the-game', updatedUsers.filter((user) => user.designatedRoom === room.id));
  })
}

const updatePlayersInRoom = (adminNamespace, playerNamespace) => ({ players, room }) => {
  // const roomId = players[0].designatedRoom;
  playerNamespace.to(`room${room}`).emit('update-players-in-room', players);
  adminNamespace.emit('update-players-in-room', players);
}

const updateStateInRoom = (adminNamespace, playerNamespace) => ( {boardState, roomID } ) => {
  const updState = { state: boardState, room: roomID }
  playerNamespace.to(`room${roomID}`).emit('update-state-in-room', boardState);
  adminNamespace.emit('update-state-in-room', updState);
}

// Global disruptions
const globalDisruptionTrigger = (adminNamespace, playerNamespace) => ({ roomID, left } ) => {
  let toRoom;
  if (left) {
    (roomID === 0) ? toRoom = rooms.length - 1 : toRoom = roomID - 1;
  } else {
    (roomID === rooms.length - 1) ? toRoom = 0 : toRoom = roomID + 1;
  }
  playerNamespace.to(`room${toRoom}`).emit('global-disruption-trigger', {from: toRoom, to: roomID});
  adminNamespace.emit('global-disruption-trigger', { roomID, toRoom });
};

const globalDisruptionResponse = (adminNamespace, playerNamespace) => (state) => {
  playerNamespace.to(`room${state.to}`).emit('global-disruption-response', state);
}

const globalDisruptionAfterChoice = (adminNamespace, playerNamespace) => ({ position, to }) => {
  playerNamespace.to(`room${to}`).emit('global-disruption-choice', position);
}

module.exports = { globalDisruptionAfterChoice, globalDisruptionResponse, globalDisruptionTrigger, updateStateInRoom, startGame, updateGameStatus, adminSendMessage, joinRoom ,sendRooms, leaveRoom, sendUserMessage, updatePlayers, adminCreateRooms, updatePlayersInRoom};
