import express from 'express';
const router = express.Router();
import { checkToken, createToken, updateToken, getAllTokens } from './controllers/server/token.controller';
import { saveBoard, loadBoard, updateBoard, getBoards } from './controllers/server/board.controller';
import { restartServer } from './controllers/server/admin.controller';
import path from 'path';

router.get('/api/token/:token', checkToken);
router.post('/api/token', createToken);
router.put('/api/token/:token', updateToken);
router.get('/api/tokens', getAllTokens);

router.post('/api/board', saveBoard);
router.get('/api/board/:id', loadBoard);
router.put('/api/board/:id', updateBoard);
router.get('/api/boards/:token', getBoards);

router.get('/api/system/reboot', restartServer);

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

export default router;
