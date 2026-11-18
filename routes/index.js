const router = require('express').Router();
const games = require('../public/javascripts/games');
router.get('/', (req,res) => res.render('index', {title:'Миры CD PROJEKT RED | Игры и истории',isHome:true}));
games.forEach(game => {
 router.get('/'+game.id, (req,res) => {
  res.send('<h1>'+game.name+'</h1>');
 });
});
module.exports = router;
