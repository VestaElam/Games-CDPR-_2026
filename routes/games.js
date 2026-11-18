const router = require('express').Router();
const createError = require('http-errors');
const { CDPRGame } = require('../models/cdprGame');
router.get('/', (req,res) => res.send('Маршрутизатор каталога игр CD PROJEKT RED'));
router.get('/:gameId', async (req,res,next) => {
  try {
    const record = await CDPRGame.findOne({gameId:req.params.gameId}).lean();
    if (!record) return next(createError(404, 'Игра не найдена в каталоге CD PROJEKT RED'));
    const game = { id:record.gameId, name:record.title, title:record.subtitle, tag:record.tag,
      year:record.year, text:record.desc, detail:record.detail, facts:record.facts || [] };
    res.render('game', {title:record.title, picture:record.cover, desc:record.desc, game});
  } catch (error) { next(error); }
});
module.exports = router;
