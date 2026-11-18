const mongoose = require('mongoose');
const { CDPRPlayer } = require('../models/cdprPlayer');
module.exports = async function(req,res,next) {
  res.locals.user = null;
  const id = req.session.user_id;
  if (!id) return next();
  if (typeof id !== 'string' || !mongoose.isObjectIdOrHexString(id)) {delete req.session.user_id;return next();}
  try {
    // findById возвращает один документ, а не массив. Хеш и соль не выбираются.
    res.locals.user = await CDPRPlayer.findById(id).select('username created').lean();
    if (!res.locals.user) delete req.session.user_id;
    next();
  } catch(error) {next(error);}
};
