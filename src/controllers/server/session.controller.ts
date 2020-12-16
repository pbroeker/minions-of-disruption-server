// import session from 'express-session';
// import { Request, Response } from 'express';
// // const Board = require('../model/board.model');

// exports.checkSession = async (req: Request, res: Response) => {
//   try {
//     const loggedIn: boolean | undefined = req.session.loggedIn;
//     const gameId: boolean | undefined = req.session.gameId;
//     res.status(200);
//     res.send({ loggedIn, gameId });
//   } catch (error) {
//     console.log(error);
//     res.status(500);
//     res.send(error);
//   }
// };
