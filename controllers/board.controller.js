const Board = require('../model/board.model');

exports.saveBoard = async (req, res) => {
  try {
    const { roomNumber, tokenId } = req.body;
    if (!roomNumber || !tokenId) {
      res.sendStatus(500);
    } 
    else {
      const rooms = [];
      const roomNames = shuffleNames(roomNamesInit);
      for (let i = 0; i < roomNumber; i++) {
        rooms.push({
          boardData : JSON.stringify(mockBoard),
          name: roomNames[i],
          players: JSON.stringify([]),
          id: i,
          tokenId: tokenId,
        })
      }
      console.log('rooms to be created: ', rooms);
      const answer = await Board.insertMany(rooms);
      console.log('anser should be: ', answer);
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
    console.log('finding game with id: ', id);
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

exports.getBoards = async (req, res) => {
  try {
    const token = req.params.token;
    console.log('token is:', token);
    if (!token) res.sendStatus(500);
    else {
      const answer = await Board.find({ tokenId : token });
      res.status(201);
      res.send(answer);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);   
  }
}

const mockBoard = {
  score: 0,
  escalation: 0,
  carbions: 3,
  climmies: 7,
  coins: 3,
  pathwayTokens: [],
  shields: [],
  initiativeDeck: [],
  discardedInitiativeCards: [],
  disruptionDeck: [],
  discardedDisruptionCards: [],
  hotspots: [],
  currentDisruption: undefined,
  activeSeat: 0,
  roundCount: 1,
};

const roomNamesInit = [
  'Community',
  'Ecstatic',
  'Sharing',
  'Eclectic',
  'Exquisite',
  'Giving',
  'Thriving',
  'Committed',
  'Enthusiastic',
  'Original',
  'Magical',
  'Glorious',
  'Thankful',
  'Enchanting',
  'Pure',
  'Dazzling',
  'Expansive',
  'Bountiful',
  'Adventurous',
  'Elated',
  'Humble',
  'Liberated',
  'Fortified',
  'Grateful',
  'Creative',
  'Awakening',
  'Harmonious',
  'Lovely',
  'Gentle',
  'Serene',
  'Kind',
  'Joyful',
  'Delighted',
];

function shuffleNames(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}