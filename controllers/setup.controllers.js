let rooms = [
  { name: 'room1', id: 0, players: [] },
  { name: 'room2', id: 1, players: [] },
  { name: 'room3', id: 2, players: [] },
];

let users = [];

const joinRoom = (adminNamespace, socket) => ({ user, roomId }) => {
  // Add to users
  users.push(user);
  console.log('Users', users)
  // Add to room
  let newRooms = [...rooms];
  let oldPlayersInRoom = Array.from(rooms[roomId].players);
  let newPlayersInRoom = oldPlayersInRoom.filter((oldPlayer) => oldPlayer.name !== user.name);
  newPlayersInRoom.push(user);
  newRooms[roomId].players = newPlayersInRoom;
  socket.join(`room${roomId}`);
  socket.emit('send-rooms', newRooms);
  adminNamespace.emit('send-rooms', newRooms);
  socket.in(`room${roomId}`).emit('player-joined-a-room' ,`Player ${user.name} joined this room`);
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
  const colors = ['blue', 'red', 'green', 'orange'];
  const updatedUsers = users.map((user) => {
    const defaultRole = { name: 'default', description: '', color: colors[user.seat], power: '', image: '' };
    return {...user, position: 1, role: defaultRole, hand: [], remainingActions: 0 };
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

const updateStateInRoom = (adminNamespace, playerNamespace) => ( { boardState, roomID } ) => {
  const updState = { state: boardState, room: roomID }
  playerNamespace.to(`room${roomID}`).emit('update-state-in-room', boardState);
  adminNamespace.emit('update-state-in-room', updState);
}

const emitNextPlayer = (playerNamespace) => ({ seat, room }) => {
  playerNamespace.to(`room${room}`).emit('update-next-player', seat);
  console.log('Emit update player fired with', room, seat);
} 



module.exports = { emitNextPlayer, updateStateInRoom, startGame, updateGameStatus, adminSendMessage, joinRoom ,sendRooms, leaveRoom, sendUserMessage, updatePlayers, adminCreateRooms, updatePlayersInRoom};
