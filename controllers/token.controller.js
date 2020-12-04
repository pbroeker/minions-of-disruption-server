const Token = require('../model/token.model');
const { createCode } = require('../token.provider');

exports.createToken = async (req, res) => {
  try {
    const { game_id, language, game_version } = req.body;
    const code = createCode();
    if (!game_id || !language || !game_version ) res.sendStatus(500);
    const answer = await Token.create({ game_id: game_id, language: language, game_version: game_version, code: code });
    res.status(201);
    res.send(JSON.stringify(result));
  } catch (error) {
      console.log(error);
      res.status(500);
      res.send(error);
  }
}

exports.checkToken = async (req, res) => {
  try {
    const code = req.params.token;
    const answer = await Token.find({ code: code });
    console.log(answer);
    req.status(200);
    req.send(answer)
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
}