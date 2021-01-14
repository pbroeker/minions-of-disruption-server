import { Document } from 'mongoose';

export interface BoardModel extends Document {
  tokenId: number;
  boardData: string;
  name: string;
  players: string;
  id: string | undefined;
}

export interface TokenModel extends Document {
  code: number;
  language: string;
  game_version: string;
  boardIds?: string[];
}
