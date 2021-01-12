import { Request, Response } from 'express';

const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.body.username === 'admin' && req.body.password === '123') {
      res.send({ enabledAdmin: true });
    } else res.status(409);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
};

export { adminLogin };
