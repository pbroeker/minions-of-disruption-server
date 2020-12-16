import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  code: { type: Number, required: true, unique: true },
  language: { type: String, required: true },
  game_version: { type: String, required: true },
  boardIds: [String],
});

const Token = mongoose.model('Token', tokenSchema);

export default Token;
