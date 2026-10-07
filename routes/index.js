var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: 'ELECTRIC XTRA' });
});

/* Пункт 4.2: три самостоятельных маршрута по теме исходного сайта. */
router.get('/performance', function(req, res) {
  res.send('<h1>Lightning Fast Performance</h1>');
});

router.get('/security', function(req, res) {
  res.send('<h1>Military-Grade Security</h1>');
});

router.get('/network', function(req, res) {
  res.send('<h1>Global Neural Network</h1>');
});

module.exports = router;
