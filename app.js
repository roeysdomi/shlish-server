var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var montest = require('./routes/mongotest');
var jobs = require('./models/Jobs');
var chrome=require('./routes/pup');
const bodyParser = require("body-parser");

var app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const db = require('./config/key').mongoURI;
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
  mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});


  app.post("/", (req, res, next) => {
     console.log("postttt");
     console.log(req.body.name);
    montest.job(req.body.name,req.body.company,req.body.details).
    then(f=>res.status(200).json(f)).
    catch(g=>res.status(400).json(g))
});

 app.get("/",(req,res,next)=>
 {
       console.log("thisis shitttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt");
       montest.showtusers().then(f=>  res.status(200).json(f) )

 })
 app.use(expressLayouts);
 app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', require('./routes/index.js'));

// catch 404 and forward to error handler-
app.use(function(req, res, next) {
  next(createError(404));
});
app.listen(4000, console.log(`Server running on  4000`));
// error handler-----
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
