var express = require('express');
var games = require('../public/javascripts/games');
var router = express.Router();
router.get('/', function(req, res) {
  res.render('index', { title: 'Миры CD PROJEKT RED | Игры и истории', isHome: true });
});

router.get('/cyberpunk', function(req, res) {
  var game = games.find(function(item) { return item.id === 'cyberpunk'; });
  res.render('game', { title: game.name, picture: '/images/cyberpunk.jpg', desc: game.text, game: game });
});

router.get('/witcher3', function(req, res) {
  var game = games.find(function(item) { return item.id === 'witcher3'; });
  res.render('game', { title: game.name, picture: '/images/witcher3.jpg', desc: game.text, game: game });
});

router.get('/gwent', function(req, res) {
  var game = games.find(function(item) { return item.id === 'gwent'; });
  res.render('game', { title: game.name, picture: '/images/gwent.jpg', desc: game.text, game: game });
});

module.exports = router;
