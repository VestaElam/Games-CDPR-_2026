var express = require('express');
var router = express.Router();
router.get('/', function(req, res) {
  res.render('index', { title: 'Миры CD PROJEKT RED | Игры и истории', isHome: true });
});

router.get('/cyberpunk', function(req, res) {
  res.send('<h1>Cyberpunk 2077</h1>');
});

router.get('/witcher3', function(req, res) {
  res.send('<h1>Ведьмак 3: Дикая Охота</h1>');
});

router.get('/gwent', function(req, res) {
  res.send('<h1>ГВИНТ: Ведьмак. Карточная игра</h1>');
});

module.exports = router;
