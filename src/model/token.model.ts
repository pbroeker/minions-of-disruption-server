import mongoose, { Document } from 'mongoose';

interface iToken extends Document {
  code: number;
  language: string;
  game_version: string;
  boardIds?: string[];
}

const tokenSchema = new mongoose.Schema({
  code: { type: Number, required: true, unique: true },
  language: { type: String, required: true },
  game_version: { type: String, required: true },
  boardIds: [String],
});

const Token = mongoose.model<iToken>('Token', tokenSchema);

export default Token;
