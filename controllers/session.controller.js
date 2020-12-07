const session = require('express-session');
const Board = require('../model/board.model');

exports.checkSession = async (req, res) => {
  try {
    const loggedIn = req.session.loggedIn;
    const gameId = req.session.gameId;
    res.status(200);
    res.send({loggedIn, gameId});
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
}