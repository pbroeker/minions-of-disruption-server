import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  code: { type: Number, required: true, unique: true },
  language: String,
  game_version: String,
  boardIds: [String],
});

const Token = mongoose.model('Token', tokenSchema);

export default Token;
