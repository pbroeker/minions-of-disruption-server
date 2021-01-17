import { Request, Response } from 'express';
import { Room } from '../../Interfaces/Server.types';
import { createCode } from '../../Utils/token.provider';
import { create, update, check, getAll } from '../../services/token.services';

const createToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { language, game_version }: { language: string; game_version: string } = req.body;
    if (!language || !game_version) {
      res.sendStatus(500);
    } else {
      const code = createCode();
      const answer = await create(language, game_version, code);
      res.status(201);
      res.send(answer);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
};

const updateToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const code = parseInt(req.params.token);
    const { rooms } = req.body;
    const boardIds = rooms.map((room: Room) => {
      return room._id;
    });
    const answer = await update(code, boardIds);
    res.status(200);
    res.send(answer);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
};

const checkToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const code = parseInt(req.params.token);
    const answer = await check(code);
    res.status(200);
    res.send({ answer });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
};

const getAllTokens = async (req: Request, res: Response): Promise<void> => {
  try {
    const answer = await getAll();
    res.status(200);
    res.send({ answer });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
};

export { getAllTokens, createToken, updateToken, checkToken };
