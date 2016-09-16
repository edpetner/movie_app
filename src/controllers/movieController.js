var loadLocalStore = require('../helpers/localStoreHelper')();

var movieController = function(movieService){

  var middleware = function(req, res, next){

    next();
  };

  // ----------------------------------------
  // Retrieves Details for Movie/Person/TV
  // return data in JSON
  // ----------------------------------------
  var getTargetDetails = function(req,res){
    var store = req.params.storeType;
    loadLocalStore.checkLocalStore(store, {'tMDBID': parseInt(req.params.targetId)},
      function(err, result){
        if (err){
          movieService()
            .getTargetDetails({ref: store,
                        target: req.params.targetId,
                        sub: '',
                        filters: ''},
                        function(err, target, credits){
                          if (err){
                            res.redirect('/');
                          } else {
                            loadLocalStore.createLocalStore(store, target, credits,
                            function(err, result){
                              if (err){
                                res.redirect('/');
                              } else {
                                console.log('Success: Data injected from API');
                                res.setHeader('Content-Type', 'application/json');
                                res.send(JSON.stringify(result));
                              }
                            });
                          }
                        });
        } else {
          console.log('Success: Data retrieved from MongoDB');
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(result));
        }
      });
  };

  return {
    middleware: middleware,
    getTargetDetails: getTargetDetails
  };

};

module.exports = movieController;
