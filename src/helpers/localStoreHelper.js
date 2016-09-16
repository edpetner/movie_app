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
          } else {
            callback(false, result);
          }
        });

    });
  };

  var createLocalStore = function(store, target, credits, callback){
    var targetObject;
    // create array's to store Directors, Producers, Screen Writers, Sound, Director of Photography
    target.tMDBID = target.id;
    if (store === 'movie' || store === 'tv'){
      targetObject = formatObjectHelpers.formatMedia(target, credits);
    } else if (store === 'person'){
      targetObject = formatObjectHelpers.formatPerson(target, credits);
    } else {
      return;
    }
    // after formatting objects, store into Mongo Collection
    mongodb.connect(process.env.MONGO_URL, function(err, db){
      var collection = db.collection(store);
      collection.insertOne(targetObject, function(err, results){
        db.close();
        callback(null, targetObject);
      });
    });

  };

  return {
    checkLocalStore: checkLocalStore,
    createLocalStore: createLocalStore
  };
};

module.exports = localStoreHelper;
