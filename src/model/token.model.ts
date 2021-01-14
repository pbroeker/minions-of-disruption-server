import mongoose, { Schema } from 'mongoose';
import { TokenModel } from '../Interfaces/Model.types';

const tokenSchema: Schema = new mongoose.Schema({
  code: { type: Number, required: true, unique: true },
  language: { type: String, required: true },
  game_version: { type: String, required: true },
  boardIds: [String],
});

const Token = mongoose.model<TokenModel>('Token', tokenSchema);

export default Token;
