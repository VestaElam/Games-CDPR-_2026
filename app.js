var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const { mongoUrl } = require('./config/database');
mongoose.set('bufferCommands', false);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.locals.ready = mongoose.connect(mongoUrl, {serverSelectionTimeoutMS:5000});
app.engine('ejs', require('ejs-locals'));
app.locals.isHome = false;
app.locals.gameMenu = require('./public/javascripts/games');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/games', require('./routes/games'));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(function(req, res, next) { next(createError(404)); });
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', { title: 'CD PROJEKT RED — Ошибка', status: err.status || 500 });
});
module.exports = app;
