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
router.get('/logreg', (req,res) => res.render('logreg', {title:'Вход в миры CD PROJEKT RED', username:'', error:null, notice:null}));
router.post('/logreg', (req,res) => {
  const username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
  const password = req.body.password;
  if (!username || typeof password !== 'string' || password.length < 8 || password.length > 128) {
    return res.status(400).render('logreg', {title:'Вход в CD PROJEKT RED', username, error:null, notice:'Проверь имя игрока и длину пароля.'});
  }
  // Проверка получения формы. Сам пароль не отображается и не записывается в журнал.
  res.render('logreg', {title:'Вход в CD PROJEKT RED', username, error:null, notice:'Данные игрока '+username+' получены сервером.'});
});
module.exports = router;
