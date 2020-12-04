const express = require('express');
const router = express.Router();
// const { adminLogin, landingPage } = require('./controllers/login.controller');
const { checkToken, createToken } = require('./controllers/token.controller');
const { saveBoard, loadBoard, updateBoard } = require('./controllers/board.controller');
const { checkSession } = require('./controllers/session.controller');
// router.get('/check', landingPage);

// router.post('/login', adminLogin);
  
router.get('/token/:token', checkToken);
router.post('/token', createToken);

router.post('/board', saveBoard);
router.get('/board/:id', loadBoard);
router.put('/board/:id', updateBoard);

router.get('/checksession', checkSession)

module.exports = router;