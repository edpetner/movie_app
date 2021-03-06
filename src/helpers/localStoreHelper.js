var mongodb = require('mongodb').MongoClient;

// import functions to format data for DB
var formatObjectHelpers = require('./formatObjectHelpers');

var localStoreHelper = function(){

  var checkLocalStore = function(store, search, callback){
    // console.log(process.env);
    mongodb.connect(process.env.MONGO_URL, function(err, db){
      var collection = db.collection(store);
      collection.findOne(search,
        function(err, result){
          if (result === null){
            callback(true, false);
            db.close();
          } else {
            callback(false, result);
            db.close();
          }
        });

    });
  };

  var createLocalStore = function(store, target, callback){
    var data = {};
    data.tMDBID = target.id;
    // create array's to store Directors, Producers, Screen Writers, Sound, Director of Photography
    target.tMDBID = target.id;
    if (store === 'movie' || store === 'tv'){
      data = formatObjectHelpers.formatMedia(target);
    } else if (store === 'person'){
      data = formatObjectHelpers.formatPerson(target);
    } else {
      return;
    }
    // after formatting objects, store into Mongo Collection
    mongodb.connect(process.env.MONGO_URL, function(err, db){
      var collection = db.collection(store);
      collection.insertOne(data, function(err, results){
        db.close();
        callback(null, data);
      });
    });

  };

  return {
    checkLocalStore: checkLocalStore,
    createLocalStore: createLocalStore
  };
};

module.exports = localStoreHelper;
