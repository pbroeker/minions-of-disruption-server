const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  tokenId: {type: Number, required: true},
  boardData: String,
  name: String,
  players: String,
  id: Number,
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;