import { Request, Response } from 'express';
import Token from '../model/token.model';
import { createCode } from '../Utils/token.provider';
import { Room } from '../Interfaces/Server.types';

const createToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { language, game_version }: { language: string; game_version: string } = req.body;
    const code = createCode();
    if (!language || !game_version) {
      res.sendStatus(500);
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const answer = await Token.create({ language: language, game_version: game_version, code: code });
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
    const code = req.params.token;
    const { rooms } = req.body;
    const boardIds = rooms.map((room: Room) => {
      return room._id;
    });
    const answer = await Token.findOneAndUpdate({ code: code }, { $set: { boardIds: boardIds } }, { new: true });
    res.status(200);
    res.send({ answer });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
};

// TODO: Implement session
const checkToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const code = req.params.token;
    const answer = await Token.findOne({ code: code });
    // req.session.loggedIn = true;
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
    // const code = req.params.token;
    const answer = await Token.find({});
    res.status(200);
    res.send({ answer });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
};

export { getAllTokens, createToken, updateToken, checkToken };
