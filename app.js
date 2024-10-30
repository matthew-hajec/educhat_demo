var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var Session = require('./models/session');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

// Set up the database
var sequelize = require('./models/index');
sequelize.sync();


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  // Skip authentication for the auth route
  if (req.path === '/auth') {
    return next();
  }

  // Check if a session ID is present
  if (!req.cookies.sessionID) {
    res.redirect('/auth');
  }

  // Check if the session ID is valid
  const sessionID = req.cookies.sessionID;

  const session = await Session.findOne({
    where: {
      sessionID
    }
  });

  if (!session) {
    res.redirect('/auth');
  }

  next();
});

app.use('/', indexRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
