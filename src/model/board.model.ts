import mongoose, { Schema } from 'mongoose';
import { BoardModel } from '../Interfaces/Model.types';

const boardSchema: Schema = new mongoose.Schema({
  tokenId: { type: Number, required: true },
  boardData: String,
  name: String,
  players: String,
  id: String,
});

const Board = mongoose.model<BoardModel>('Board', boardSchema);

export default Board;
