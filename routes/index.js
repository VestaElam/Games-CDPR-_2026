const router = require('express').Router();
const { CDPRPlayer } = require('../models/cdprPlayer');
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
router.post('/logreg', async (req,res,next) => {
  const username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
  const password = req.body.password;
  const form = (status,error) => res.status(status).render('logreg', {title:'Вход в CD PROJEKT RED',username,error,notice:null});
  if (!/^[\p{L}\p{N}_. -]{2,40}$/u.test(username) || typeof password !== 'string' || password.length < 8 || password.length > 128) {
    return form(400,'Проверь имя игрока и пароль: имя от 2 до 40 допустимых символов, пароль от 8 до 128 символов.');
  }
  try {
    await CDPRPlayer.init();
    let player = await CDPRPlayer.findOne({username}).select('+hashedPassword +salt');
    if (!player) {
      try { player = await CDPRPlayer.create({username,password}); }
      catch(error) {
        if(error.code !== 11000) throw error;
        player = await CDPRPlayer.findOne({username}).select('+hashedPassword +salt');
        if (!player || !player.checkPassword(password)) return form(401,'Неверный пароль. Попробуй ещё раз.');
      }
    } else if (!player.checkPassword(password)) return form(401,'Неверный пароль. Попробуй ещё раз.');
    // Новый SID после входа исключает сохранение анонимного идентификатора сессии.
    await new Promise((resolve,reject)=>req.session.regenerate(error=>error?reject(error):resolve()));
    req.session.user_id = player._id.toString();
    await new Promise((resolve,reject)=>req.session.save(error=>error?reject(error):resolve()));
    res.redirect('/');
  } catch(error) {next(error);}
});
router.post('/logout', (req,res,next) => {
  req.session.destroy(error => {
    if(error) return next(error);
    res.clearCookie('connect.sid', {path:'/',httpOnly:true,sameSite:'lax'});
    res.locals.user = null;
    res.redirect('/');
  });
});
module.exports = router;
