const mongoose = require('mongoose');
const { CDPRGame } = require('./models/cdprGame');
const { data } = require('./cdprGameData');

mongoose.connect('mongodb://127.0.0.1:27017/cdpr_worlds_2026')
  .then(async function() {
    const source = data[0];
    const game = new CDPRGame(source);
    await game.validate();
    console.log('Validated CDPR game:', game.title, game.gameId);
  })
  .catch(console.error)
  .finally(() => mongoose.disconnect());
