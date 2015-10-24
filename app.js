/*
    Express app.js 
*/


/* Register Posts Schema + Comments Schema with the global *mongoose* object after require()ing,
   it can now be used to interact with the NEWS db anywhere else *mongoose* db object is imported 

  NOTE: If you run into this error:

     throw new mongoose.Error.MissingSchemaError(name);
            ^
      MissingSchemaError: Schema hasn't been registered for model "Post".
        Use mongoose.model(name, schema) at Mongoose.model

  - The schemas need to be registered before "var routes = require('./routes/index');"
  
    http://stackoverflow.com/questions/20832126/missingschemaerror-schema-hasnt-been-registered-for-model-user
*/

var mongoose = require('mongoose');
var passport = require('passport');                     // Wire in authentication
require('./models/Posts');
require('./models/Comments'); 
require('./models/Users');
require('./config/passport');

mongoose.connect('mongodb://localhost/news');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// initialize Passport authentication 
app.use(passport.initialize());

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images/', 'favicon.ico')));

app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
