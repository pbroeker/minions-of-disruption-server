import { Request, Response } from 'express';

exports.adminLogin = (req: Request, res: Response) => {
  if (req.body.username === 'admin' && req.body.password === '123') {
    // req.session.admin = true;
    // req.session.loggedIn = true;
    res.send({ enabledAdmin: true });
  } else res.status(409);
};
