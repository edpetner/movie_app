var loadLocalStore = require('../helpers/localStoreHelper')();
var url = require('url');
var movieController = function(movieService){

  var middleware = function(req, res, next){

    next();
  };

  var loadMovies = function(req, res){
    var filters = {
      'append_to_response': 'credits,videos,keywords,images',
      'append_to_response': 'credits,videos,keywords,external_ids,images',
      'append_to_response': 'combined_credits,images,external_ids'
    };
    // for (var i = 1; i < 50; i++){
      //note
      var counter = 48907;
      var endCount = 100000;
      var missCounter = 0;
      // var target = i;
      var loadDatabase = setInterval(function(){
        if (counter > endCount || missCounter > 500){
          console.log('Last ID entered,', counter);
          clearInterval(loadDatabase);
        }
        var target = counter;
        loadLocalStore.checkLocalStore('movie', {'tMDBID': target},
          function(err, result){
            if (err){
              movieService().
                apiQueryGenerator({
                  ref: 'movie',
                  target: target,
                  sub: '',
                  filters: {'append_to_response': 'credits,videos,keywords,images'}
                }, function(err, result){
                  if (!err){
                    missCounter = 0;
                    loadLocalStore.createLocalStore('movie', result,
                      function(err, result){
                        console.log('Movie stored: ', result.title, counter);
                      });
                  } else {
                    missCounter++;
                    console.log('No entry for ID:', counter, ' - Misscount @:', missCounter);
                  }
                });
            } else {
              missCounter = 0;
              console.log(result.title, 'has already been loaded. ID:', counter);
            }
          });
          counter += 1;
      }, 400);
      loadDatabase;
      console.log('Task Completed, last id =', counter);
      res.status(200).send('Success!');
    // }
  };
  // ----------------------------------------
  // Retrieves Lists of Movies/TV/Persons
  // return data in JSON (no local store)
  // ----------------------------------------
  var getTargetList = function(req, res){
    var store = req.params.storeType;
    var target = req.params.target;
    var queries = url.parse(req.url, true).query;
    movieService().apiQueryGenerator({
      ref: store,
      target: target,
      sub: '',
      filters: ''
    }, function(err, results){
      if (err){
        res.redirect('/');
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(results));
      }
    });
  };

  // ----------------------------------------
  // Retrieves Lists from Discover
  // return data in JSON (no local store)
  // ----------------------------------------
  var getDiscoverList = function(req, res){
    var target = req.params.target;
    var rawQueries = url.parse(req.url, true).query;
    var formattedQueries = '';
    Object.keys(rawQueries).forEach(function(key,index) {
      formattedQueries += key + '=' + rawQueries[key] + '&';
    });
    movieService().apiQueryGenerator({
      ref: 'discover',
      target: target,
      sub: '',
      filters: rawQueries
    },
    function(err, results){
      if (err){
        res.status(404).send('Not Found');
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(results));
      }
    });
  };


  // ----------------------------------------
  // Retrieves Details for Movie/Person/TV
  // return data in JSON (stores locally)
  // ----------------------------------------
  var getDetails = function(req, res){
    var store = req.params.store;
    var target = req.params.target;
    var filters = {
      'movie': 'append_to_response=credits,videos,keywords,images&',
      'tv': 'append_to_response=credits,videos,keywords,external_ids,images&',
      'person': 'append_to_response=combined_credits,images,external_ids&'
    };
    //note
    var targetFilters = filters[store];
    loadLocalStore.checkLocalStore(store, {'tMDBID': parseInt(target)},
      function(err, result){
        if (err){
          movieService().
            apiQueryGenerator({
              ref: store,
              target: target,
              sub: '',
              filters: targetFilters
            }, function(err, result){
              loadLocalStore.createLocalStore(store, result,
                function(err, result){
                  if (err){
                    res.status(404).send('Not Found');
                  } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(result));
                  }
                });
            });
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(result));
        }
      });
  };

  return {
    middleware: middleware,
    getTargetList: getTargetList,
    getDiscoverList: getDiscoverList,
    getDetails: getDetails,
    loadMovies: loadMovies
  };

};

module.exports = movieController;
