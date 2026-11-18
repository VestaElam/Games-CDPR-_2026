const router = require('express').Router();
const games = require('../public/javascripts/games');
router.get('/', (req,res) => res.render('index', {title:'Миры CD PROJEKT RED | Игры и истории',isHome:true}));
games.forEach(game => {
 router.get('/'+game.id, (req,res) => {
  res.render('game', {title:game.name,picture:'/images/'+game.id+'.jpg',desc:game.text,game});
 });
});
module.exports = router;
