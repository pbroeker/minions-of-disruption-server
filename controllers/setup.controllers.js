let rooms = [
  { name: 'room1', id: 1, players: [] },
  { name: 'room2', id: 2, players: [] },
  { name: 'room3', id: 3, players: [] },
];

let users = [];

const joinRoom = (io, socket) => ({ player, roomId }) => {
  console.log(`Player ${player.name} joined room ${roomId}`);
  let newRooms = [...rooms];
  let oldPlayersInRoom = Array.from(rooms[roomId].players);
  let newPlayersInRoom = oldPlayersInRoom.filter((oldPlayer) => oldPlayer.name !== player.name);
  newPlayersInRoom.push(player);
  newRooms[roomId].players = newPlayersInRoom;
  socket.join(`room${roomId}`);
  io.emit('send-rooms', newRooms);
  io.in(`room${roomId}`).emit('player-joined-a-room' ,`Player ${player.name} joined this room`);
} 

const sendRooms = () => {
  return rooms;
}

const leaveRoom = (io, socket) => ({ player, roomId }) => {
  console.log(`Player ${player.name} left room ${roomId}`);
  let newRooms = [...rooms];
  let oldPlayersInRoom = Array.from(rooms[roomId].players);
  let newPlayersInRoom = oldPlayersInRoom.filter((oldPlayer) => oldPlayer.name !== player.name);
  newRooms[roomId].players = newPlayersInRoom;
  socket.leave(`room${roomId}`);
  io.emit('send-rooms', rooms);
  io.in(`room${roomId}`).emit('player-left-a-room' ,`Player ${player.name} joined this room`);
}

const sendUserMessage = (io) => ({ player, message}) => {
  console.log(`sending message ${message} from ${player.name} to ${player.designatedRoom}.`);
  io.in(`room${player.designatedRoom}`).emit('user-chat-message', { player:player, message: message });
}

const updatePlayers = (io) => (player) => {
  const newPlayers = users.filter((oldPlayer) => oldPlayer.name !== player.name)
  newPlayers.push(player);
  users = newPlayers;
  io.emit('update-state-players', users);
}

const adminCreateRooms = (roomObjects) => {
  rooms = roomObjects;
}

module.exports = { joinRoom ,sendRooms, leaveRoom, sendUserMessage, updatePlayers, adminCreateRooms };
