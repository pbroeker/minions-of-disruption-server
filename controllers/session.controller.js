const session = require('express-session');
const Board = require('../model/board.model');

exports.checkSession = async (req, res) => {
  try {
    const loggedIn = session.loggedIn;
    const gameId = session.gameId;
    //  Test-id: '5fca716e356c397e3e8cdd19';
    res.status(200);
    res.send({loggedIn, gameId});
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
}

// TODO: Testing, unique even if several boards with similar rooms exist?
exports.assignBoardId = async (req, res) => {
  try {
    const { roomId, name } = req.body;
    const board = Board.findOne({ room: roomId});
    req.session.gameId = (await board)._id.toString();
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
}