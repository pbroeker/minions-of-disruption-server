const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;