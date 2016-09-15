var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');

var app = express();
var port = process.env.PORT || 3000;

//middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('index', null);
});

app.get('/about', function(req, res){
  res.render('single-post', null);
});

app.listen(port, function(err9){
  console.log('running server on port' + port);
});
