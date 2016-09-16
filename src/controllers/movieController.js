var loadLocalStore = require('../helpers/localStoreHelper')();
var url = require('url');
var movieController = function(movieService){

  var middleware = function(req, res, next){

    next();
  };


  // ----------------------------------------
  // Retrieves Lists of Movies/TV/Persons
  // return data in JSON (no local store)
  // ----------------------------------------
  var getTargetList = function(req, res){
    var store = req.params.storeType;
    var target = req.params.target;
    var queries = url.parse(req.url, true).query;
    movieService().getTargetList({
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
      console.log(formattedQueries);
    });
    movieService().getDiscoverList({
      ref: 'discover',
      target: target,
      sub: '',
      filters: formattedQueries
    },
    function(err, results){
      if (err){
        res.redirect('/');
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
            getDetails({
              ref: store,
              target: target,
              sub: '',
              filters: targetFilters
            }, function(err, result){
              loadLocalStore.createLocalStore(store, result,
                function(err, result){
                  if (err){
                    res.redirect('/');
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
    getDetails: getDetails
  };

};

module.exports = movieController;
