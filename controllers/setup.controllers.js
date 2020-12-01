let rooms = [
  { name: 'room1', id: 0, players: [] },
  { name: 'room2', id: 1, players: [] },
  { name: 'room3', id: 2, players: [] },
];

let users = [];

const joinRoom = (adminNamespace, socket) => ({ player, roomId }) => {
  console.log(`Player ${player.name} joined room ${roomId}`);
  let newRooms = [...rooms];
  let oldPlayersInRoom = Array.from(rooms[roomId].players);
  let newPlayersInRoom = oldPlayersInRoom.filter((oldPlayer) => oldPlayer.name !== player.name);
  newPlayersInRoom.push(player);
  newRooms[roomId].players = newPlayersInRoom;
  socket.join(`room${roomId}`);
  socket.emit('send-rooms', newRooms);
  adminNamespace.emit('send-rooms', newRooms);
  socket.in(`room${roomId}`).emit('player-joined-a-room' ,`Player ${player.name} joined this room`);
} 

const sendRooms = () => {
  return rooms;
}

const adminSendMessage = (io) => (message) => {
  io.emit('user-chat-message', { player: { name: 'Admin' }, message: message })
}

const leaveRoom = (adminNamespace, socket) => ({ player, roomId }) => {
  console.log(`Player ${player.name} left room ${roomId}`);
  let newRooms = [...rooms];
  let oldPlayersInRoom = Array.from(rooms[roomId].players);
  let newPlayersInRoom = oldPlayersInRoom.filter((oldPlayer) => oldPlayer.name !== player.name);
  newRooms[roomId].players = newPlayersInRoom;
  socket.leave(`room${roomId}`);
  adminNamespace.emit('send-rooms', rooms);
  socket.emit('send-rooms', rooms);
  socket.in(`room${roomId}`).emit('player-left-a-room' ,`Player ${player.name} joined this room`);
}

const sendUserMessage = (adminNamespace, socket) => ({ player, message}) => {
  console.log(`sending message ${message} from ${player.name} to ${player.designatedRoom}.`);
  socket.in(`room${player.designatedRoom}`).emit('user-chat-message', { player:player, message: message });
  adminNamespace.emit('user-chat-message-to-admin', { player: player, message: message });
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
  console.log('game starting');
  rooms.forEach((room) => {
    playerNamespace.in(`room${room.id}`).emit('start-the-game', room.players);
  })
}
module.exports = { startGame, updateGameStatus, adminSendMessage, joinRoom ,sendRooms, leaveRoom, sendUserMessage, updatePlayers, adminCreateRooms };
