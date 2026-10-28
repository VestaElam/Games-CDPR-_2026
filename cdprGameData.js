const games = require('./public/javascripts/games');

// Данные каталога CD PROJEKT RED для посева MongoDB.
const data = games.map(function(game) {
  return {
    gameId: game.id,
    title: game.name,
    world: game.world,
    cover: '/images/' + game.id + '.jpg',
    description: game.text,
    year: Number(game.year),
    tags: game.facts
  };
});

module.exports.data = data;
