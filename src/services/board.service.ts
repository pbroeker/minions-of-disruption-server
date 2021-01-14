import Board from '../model/board.model';
import { BoardCreation } from '../Interfaces/Server.types';
import { BoardModel } from '../Interfaces/Model.types';

const insertMany = async (rooms: BoardCreation[]): Promise<BoardModel[]> => {
  return Board.insertMany(rooms);
};

const findById = async (id: string): Promise<BoardModel | null> => {
  return Board.findById(id);
};

const findByIdAndUpdate = async (id: string, boardData: string, players: string): Promise<BoardModel | null> => {
  return Board.findByIdAndUpdate(id, { boardData, players }, { new: true });
};

const findByTokenId = async (id: number): Promise<BoardModel[] | null> => {
  return Board.find({ tokenId: id });
};

export { insertMany, findByTokenId, findByIdAndUpdate, findById };
