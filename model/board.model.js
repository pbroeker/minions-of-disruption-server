const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  tokenId: {type: Number, unique: true, required: true},
  boardData: String,
  players: String,
  room: Number,
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;