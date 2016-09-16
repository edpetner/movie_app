var mongodb = require('mongodb').MongoClient;
var http = require('http');
var envs = require('./envvar');

var host = 'api.themoviedb.org';

var loadGenres = function(target, callback){
  var options = {
    host: host,
    path: '/3/genre/'+target+'/list?' + envs.MDB_SECRET
  };
  var onCompletion = function(response){
    var str = '';
    response.on('data', function(chunk){
      console.log('chunk received');
      str += chunk;
    });
    response.on('end', function(){
      callback(false, JSON.parse(str));
    });
  };
  http.request(options, onCompletion).end();

};

(function(){
  loadGenres('tv', function(err, result){
    mongodb.connect(envs.MONGO_URL, function(err, db){
      var collection = db.collection('tv_genres');
      collection.insertMany(result.genres, function(err, data){
        db.close();
        console.log('TV Genres Loaded', data);
      });
    });
  });
  loadGenres('movie', function(err, result){
    mongodb.connect(envs.MONGO_URL, function(err, db){
      var collection = db.collection('movie_genres');
      collection.insertMany(result.genres, function(err, data){
        db.close();
        console.log('Movie Genres Loaded', data);
      });
    });
  });
});//();
