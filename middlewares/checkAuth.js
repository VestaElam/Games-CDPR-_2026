module.exports = function(req,res,next) {
  if (!req.session.user_id || !res.locals.user) return res.redirect('/');
  next();
};
