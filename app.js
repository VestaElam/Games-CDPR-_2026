var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const { mongoUrl } = require('./config/database');


var indexRouter = require('./routes/index');

const session = require('express-session');
const MongoStore = require('connect-mongo');
var app = express();
app.locals.ready = mongoose.connect(mongoUrl, {serverSelectionTimeoutMS:5000});
app.engine('ejs', require('ejs-locals'));
app.locals.isHome = false;
app.locals.nav = [];
app.locals.user = null;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({ extended: false, limit:'16kb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.locals.sessionStore = MongoStore.create({mongoUrl, collectionName:'cdpr_sessions', mongoOptions:{serverSelectionTimeoutMS:5000}});
app.locals.sessionStore.on('error', error => console.error('Хранилище сессий MongoDB:', error.message));
app.use(session({
  secret: process.env.SESSION_SECRET || 'CDPR-worlds-local-learning-session-secret-2026',
  cookie: {maxAge:60*1000, httpOnly:true, sameSite:'lax'},
  resave:false, saveUninitialized:true,
  store:app.locals.sessionStore
}));
app.use(function(req,res,next) {
  req.session.counter = (req.session.counter || 0) + 1;
  res.locals.counter = req.session.counter;
  next();
});
app.use(require('./middlewares/createMenu'));
app.use(require('./middlewares/createPlayer'));
app.use('/games', require('./routes/games'));
app.use('/', indexRouter);
app.use(function(req, res, next) { next(createError(404)); });
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', { title: 'CD PROJEKT RED — Ошибка', status: err.status || 500 });
});
module.exports = app;
