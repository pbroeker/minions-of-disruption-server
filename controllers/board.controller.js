const Board = require('../model/board.model');

exports.saveBoard = async (req, res) => {
 try {
   const { boardData, players } = req.body;
   if (!boardData || !players) res.sendStatus(500);
   else {
     const answer = await Board.create({ boardData: boardData, players: players});
     res.status(201);
     res.send(answer);
   }
 } catch (error) {
  console.log(error);
  res.status(500);
  res.send(error);
 }
}

exports.loadBoard = async (req, res) => {
  try {
    const id = req.params.id;
    const answer = await Board.findById(id);
    console.log(answer);
    res.status(200);  
    res.send(answer);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
}

exports.updateBoard = async (req, res) => {
  try {
    const id = req.params.id;
    const { boardData, players } = req.body;
    if (!boardData || !players || !id) res.sendStatus(500);
    else {
      const answer = await Board.findByIdAndUpdate(
        id, 
        { boardData: boardData, players: players }, 
        {new: true});
      res.status(201);
      res.send(answer);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);   
  }
}