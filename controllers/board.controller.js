const Board = require('../model/board.model');

exports.saveBoard = async (req, res) => {
 try {
   const { boardData, players, room, tokenId } = req.body;
   if (!boardData || !players || room === undefined || room === null || !tokenId) {
    res.sendStatus(500);
   }
   else {
     const answer = await Board.create({
       tokenId: tokenId,
       boardData: boardData,
       players: players,
       room: room});
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