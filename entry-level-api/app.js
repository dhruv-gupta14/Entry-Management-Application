
// Load all required js modules.

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors = require('cors');
var app = express();
var mongoose = require('mongoose');

require('dotenv').config(); // Reading the ENV values
var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};

// for CORS errors, request can be get from all
app.use(cors(corsOption));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(fileUpload());
app.use(logger('dev'));

// set the post data limit to 50mb
app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img/tags/', express.static(path.join(__dirname, 'public/images/tags/')));

mongoose.set('useCreateIndex', true);

// Read the SRV mongodb string from the mongodb cluster
let uri = 'mongodb+srv://dhruv:QU0jAEB92Pa9uE4E@entry-system-2ov0u.mongodb.net/testdb?retryWrites=true&w=majority';

// Connect from mongoose for url
mongoose.connect(uri, { useNewUrlParser: true })
  .then(() => {
     console.log('Succesfully  Connected to the Mongodb Database  at URL :', uri)
   })
  .catch((e) => { console.log(e) });


// Set the initial incoming routes 
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// set the node jS default port.
// on product server we can use proxy to hide the port and serve without the port.
let port = 5000;
app.listen(port, () => {
  console.log('Server is up and running on port number ' + port);
});
module.exports = app;