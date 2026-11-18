const { CDPRGame } = require('../models/cdprGame');
module.exports = async function(req,res,next) {
  res.locals.nav = [];
  try {
    res.locals.nav = await CDPRGame.find({}, {_id:0,title:1,gameId:1}).sort({created:1,_id:1}).lean();
    next();
  } catch(error) { next(error); }
};
