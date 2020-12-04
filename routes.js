const express = require('express');
const router = express.Router();
const { adminLogin, landingPage } = require('./controllers/login.controller');
const { checkToken, createToken } = require('./controllers/token.controller');
const { saveBoard } = require('./controllers/board.controller');

router.get('/check', landingPage);

router.post('/login', adminLogin);
  
router.get('/token/:token', checkToken);
router.post('/token', createToken);

router.post('/save', saveBoard);

module.exports = router;