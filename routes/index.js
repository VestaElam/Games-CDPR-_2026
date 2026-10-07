var express = require('express');
var router = express.Router();
router.get('/', function(req, res) {
  res.render('index', { title: 'Миры CD PROJEKT RED | Игры и истории', isHome: true });
});

module.exports = router;
