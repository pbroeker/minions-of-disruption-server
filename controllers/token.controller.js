const Token = require('../model/token.model');
const { createCode } = require('../services/token.provider');

exports.createToken = async (req, res) => {
  try {
    const { language, game_version } = req.body;
    const code = createCode();
    if (!language || !game_version ) {
      res.sendStatus(500);
    }
    else {
      const answer = await Token.create({ 
        language: language,
        game_version: game_version,
        code: code
      });
      res.status(201);
      res.send(answer);
    }
  } catch (error) {
      console.log(error);
      res.status(500);
      res.send(error);
  }
}

exports.updateToken = async (req, res) => {
  try {
    const code = req.params.token;
    const boardId = req.params.boardId;
    const answer = await Token.findOneAndUpdate({ code: code }, {$push: { boardIds: boardId}}, {new: true});
    res.status(201);
    res.send({answer})
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
}

exports.checkToken = async (req, res) => {
  try {
    const code = req.params.token;
    const answer = await Token.findOne({ code: code });
    req.session.loggedIn = true;
    // req.session.token = answer.code;
    res.status(200);
    res.send({answer})
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
}

exports.getAllTokens = async (req, res) => {
  try {
    const code = req.params.token;
    const answer = await Token.find({});
    res.status(200);
    res.send({answer})
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
}