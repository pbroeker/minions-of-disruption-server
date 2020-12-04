const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  code: {type: Number, required: true, unique: true},
  language: String,
  game_version: String
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;