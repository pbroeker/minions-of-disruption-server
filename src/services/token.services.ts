import Token from '../model/token.model';
import { TokenModel } from '../Interfaces/Model.types';

const create = async (language: string, game_version: string, code: number): Promise<TokenModel | null> => {
  return Token.create({ language, game_version, code });
};

const update = async (code: number, boardIds: string[]): Promise<TokenModel | null> => {
  return Token.findOneAndUpdate({ code: code }, { $set: { boardIds: boardIds } }, { new: true });
};

const check = async (code: number): Promise<TokenModel | null> => {
  return Token.findOne({ code: code });
};
const getAll = async (): Promise<TokenModel[] | null> => {
  return Token.find({});
};

export { create, update, check, getAll };
