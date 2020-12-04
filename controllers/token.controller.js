const Token = require('../model/token.model');
const { createCode } = require('../services/token.provider');

exports.createToken = async (req, res) => {
  try {
    const { game_id, language, game_version } = req.body;
    const code = createCode();
    if (!game_id || !language || !game_version ) res.sendStatus(500);
    else {
      const answer = await Token.create({ 
        game_id: game_id, 
        language: language,
        game_version: game_version,
        code: code
      });
      res.status(201);
      res.send(JSON.stringify(answer));
    }
  } catch (error) {
      console.log(error);
      res.status(500);
      res.send(error);
  }
}

exports.checkToken = async (req, res) => {
  console.log(req.params.token);
  try {
    const code = req.params.token;
    const answer = await Token.findOne({ code: code });
    res.status(200);
    res.send(answer)
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
}