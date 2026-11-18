const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const mongoose = require('mongoose');
const { CDPRGame } = require('../models/cdprGame');
const { data } = require('../cdprGameData');
const database = 'cdpr_guide_test_' + randomUUID().replaceAll('-', '');
before(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017', { dbName: database });
  await CDPRGame.init();
});
after(async () => {
  if (mongoose.connection.name === database) await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
test('7.3: обязательный gameId отклоняет неполный документ', async () => {
  await assert.rejects(new CDPRGame({title:'Ведьмак 3'}).save(), error => Boolean(error.errors.gameId));
});
test('7.3: сохранение, дата, метод схемы и точное имя коллекции', async () => {
  const game = await CDPRGame.create(data[0]);
  assert.equal(CDPRGame.collection.name, 'cdpr_games');
  assert.ok(game.created instanceof Date);
  assert.match(game.describe(), /Cyberpunk 2077/);
  assert.equal((await CDPRGame.findOne({gameId:game.gameId})).title, game.title);
});
test('7.3: уникальность gameId обеспечивает индекс MongoDB', async () => {
  await assert.rejects(CDPRGame.create(data[0]), error => error.code === 11000);
});
test('6.3: повторный посев сохраняет шесть игр без дублей и не стирает правки', async () => {
  const { seedGames } = require('../seedCDPRGames');
  await seedGames(mongoose.connection.db);
  await CDPRGame.updateOne({gameId:'cyberpunk'}, {$set:{desc:'Описание игрока'}});
  await seedGames(mongoose.connection.db);
  assert.equal(await CDPRGame.countDocuments(), 6);
  assert.equal((await CDPRGame.findOne({gameId:'cyberpunk'})).desc, 'Описание игрока');
});
