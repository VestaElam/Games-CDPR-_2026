const router = require('express').Router();
const { CDPRGame } = require('../models/cdprGame');
router.get('/', async (req,res,next) => {
  try {
    req.session.greeting = 'Welcome to CD PROJEKT RED';
    res.cookie('cdprGreeting', 'Welcome to CD PROJEKT RED', {sameSite:'lax'});
    const records = await CDPRGame.find().sort({created:1,_id:1}).lean();
    const games = records.map(record => ({ id:record.gameId, name:record.title, title:record.subtitle,
      world:record.world, cover:record.cover, tag:record.tag, year:record.year, text:record.desc,
      detail:record.detail, facts:record.facts || [] }));
    const gamesJSON = JSON.stringify(games).replace(/</g, '\u003c');
    res.render('index', {title:'Миры CD PROJEKT RED | Игры и истории', isHome:true, catalog:games, gamesJSON});
  } catch(error) { next(error); }
});
module.exports = router;
