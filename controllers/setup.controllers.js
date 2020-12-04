const clone = require('rfdc')()

let rooms = [
  { name: 'room1', id: 0, players: [] },
  { name: 'room2', id: 1, players: [] },
  { name: 'room3', id: 2, players: [] },
];

let users = [];

const joinRoom = (adminNamespace, io, socket) => ({ user, roomId }) => {
  console.log(`joinroom called with roomId ${roomId} and user`, user);
  const newRooms = clone(rooms);
  newRooms[roomId].players.push(user);
  rooms = newRooms;
  console.log('rooms: ',rooms);
  users.push(user);
  console.log('Users', users)
  
  socket.join(`room${roomId}`);
  io.emit('send-rooms', newRooms);
  adminNamespace.emit('send-rooms', newRooms);
  socket.in(`room${roomId}`).emit('player-joined-a-room' ,`Player ${user.name} joined this room`);
} 

const sendRooms = () => {
  return rooms;
}

const adminSendMessage = (io, socket) => (adminMessage) => {
  console.log(`Admin: Sending message ${adminMessage.message} from ${adminMessage.admin.name}`);
  io.emit('send-user-message', { user: adminMessage.admin, message: adminMessage.message });
  // socket.emit('user-chat-message-to-admin', { user: adminMessage.admin, message: adminMessage.message });
  // io.emit('user-chat-message', { player: { name: 'Admin' }, message: message })
}

const leaveRoom = (adminNamespace, io, socket) => ({ user, roomId }) => {
  users = users.filter(player => player.name != user.name)
  console.log(users);
  console.log(`Player ${user.name} left room ${roomId}`);
  const newRooms = clone(rooms);
  console.log('oldrooms in leavroom: ', newRooms);
  const newRoomPlayers = newRooms[roomId].players.filter(player => player.name !== user.name);
  newRooms[roomId].players = newRoomPlayers;
  rooms = newRooms;
  console.log('newRooms without this user');
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
    const defaultRole = { name: 'default', description: '', color: colors[user.seat], power: '' };
    return {...user, position: 1, role: defaultRole, hand: [] };
  })
  rooms.forEach((room) => {
    playerNamespace.in(`room${room.id}`).emit('start-the-game', updatedUsers.filter((user) => user.designatedRoom === room.id));
  })
}

const updatePlayersInRoom = (adminNamespace, playerNamespace) => (players) => {
  const roomId = players[0].designatedRoom;
  console.log('players array received:', players);
  console.log('room', roomId);
  playerNamespace.to(`room${roomId}`).emit('update-players-in-room', players);
  adminNamespace.emit('update-players-in-room', players);
}

// const updatePlayersInRoom = (adminNamespace, playerNamespace) => (players) => {
//   const roomId = players[0].designatedRoom;
//   playerNamespace.to(`room${roomId}`).emit('update-players-in-room', players);
//   adminNamespace.emit('update-players-in-room', players);
// }

// const updateStateInRoom = (adminNamespace, playerNamespace) => ( {boardState, roomID } ) => {
//   console.log('state received:', boardState);
//   console.log('room', roomID);
//   const updState = { state: boardState, room: roomID }
//   playerNamespace.to(`room${roomID}`).emit('update-state-in-room', boardState);
//   adminNamespace.emit('update-state-in-room', updState);
// }

module.exports = { startGame, updateGameStatus, adminSendMessage, joinRoom ,sendRooms, leaveRoom, sendUserMessage, updatePlayers, adminCreateRooms, updatePlayersInRoom};
