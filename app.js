var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');

var app = express();
var port = process.env.PORT || 3000;

var movieRouter = require('./src/routes/movieRoutes')();

//middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use('/api', movieRouter);

app.listen(port, function(err9){
  console.log('running server on port' + port);
});
