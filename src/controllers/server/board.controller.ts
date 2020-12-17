import { Request, Response } from 'express';
import Board from '../../model/board.model';

const saveBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roomNumber, tokenId } = req.body;
    if (!roomNumber || !tokenId) {
      res.sendStatus(500);
    } else {
      const rooms = [];
      const roomNames = shuffleNames(roomNamesInit);
      for (let i = 0; i < roomNumber; i++) {
        rooms.push({
          boardData: JSON.stringify(mockBoard),
          name: roomNames[i],
          players: JSON.stringify([]),
          id: i,
          tokenId: tokenId,
        });
      }
      const answer = await Board.insertMany(rooms);
      res.status(201);
      res.send(answer);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
};

const loadBoard = async (req: Request, res: Response): Promise<void> => {
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
};

const updateBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const { boardData, players } = req.body;
    if (!boardData || !players || !id) res.sendStatus(500);
    else {
      const answer = await Board.findByIdAndUpdate(id, { boardData, players }, { new: true });
      res.status(201);
      res.send(answer);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
};

const getBoards = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.params.token;
    if (!token) res.sendStatus(500);
    else {
      const answer = await Board.find({ tokenId: token });
      res.status(201);
      res.send(answer);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
};

export { getBoards, saveBoard, updateBoard, loadBoard };

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

function shuffleNames(list: string[]) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}
