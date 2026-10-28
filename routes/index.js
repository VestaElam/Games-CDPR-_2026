var express = require('express');
var games = require('../public/javascripts/games');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: 'Миры CD PROJEKT RED | Игры и истории', isHome: true });
});

// Каждая игра из каталога получает страницу через общий шаблон game.ejs.
games.forEach(function(game) {
  router.get('/' + game.id, function(req, res) {
    res.render('game', {
      title: game.name,
      picture: '/images/' + game.id + '.jpg',
      desc: game.text,
      game: game
    });
  });
});

module.exports = router;
