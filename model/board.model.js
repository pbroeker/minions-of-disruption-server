const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  boardData: String,
  players: String,
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;