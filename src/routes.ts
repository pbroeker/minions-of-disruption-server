import express from 'express';
const router = express.Router();
import { checkToken, createToken, updateToken, getAllTokens } from './controllers/server/token.controller';
import { saveBoard, loadBoard, updateBoard, getBoards } from './controllers/server/board.controller';

// TODOS: Todo for session implementation
// import { checkSession } from './controllers/session.controller';
// const { adminLogin, landingPage } = require('./controllers/login.controller');
// router.get('/check', landingPage);
// router.post('/login', adminLogin);
// router.get('/checksession', checkSession);

router.get('/token/:token', checkToken);
router.post('/token', createToken);
router.put('/token/:token', updateToken);
router.get('/tokens', getAllTokens);

router.post('/board', saveBoard);
router.get('/board/:id', loadBoard);
router.put('/board/:id', updateBoard);
router.get('/boards/:token', getBoards);

export default router;
