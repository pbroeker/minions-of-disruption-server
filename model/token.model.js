const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  game_id: String,
  code: Number,
  language: String,
  game_version: String
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;