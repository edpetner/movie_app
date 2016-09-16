var http = require('http');

var movieDBService = function(){

  var host = 'api.themoviedb.org';

  // -------------------------------------------
  // All tMDB Queries go through this function
  // -------------------------------------------
  var apiQueryGenerator = function(params, callback){
    // TODO Refactor to destructure object cleaner
    var ref = params.ref;
    var target = params.target;
    var sub = params.sub;
    var filters = params.filters;
    var options = {
      host: host,
      path: '/3/' + ref + '/' + target + sub + '?' + filters + process.env.MDB_SECRET
    };
    console.log(options.path);
    var localCallback = function(response){
      var str = '';
      response.on('data', function(chunk){
        str += chunk;
      });
      response.on('end', function(){
        var parsedStr = JSON.parse(str);
        if (parsedStr.status_code){
          callback(true, null);
        } else {
          callback(false, parsedStr);
        }
      });
    };
    http.request(options, localCallback).end();
  };

  var getTargetList = function(params, callback){
    apiQueryGenerator(params, function(err, results){
      if (err){
        callback(true, null);
      } else {
        callback(false, results);
      }
    });
  };

  var getDiscoverList = function(params, callback){
    apiQueryGenerator(params, function(err, results){
      if (err){
        callback(true, null);
      } else {
        callback(false, results);
      }
    });
  };

  var getDetails = function(params, callback){
    apiQueryGenerator(params, function(err, data){
      if (err){
        console.log(data);
        callback(true, null);
      } else {
        callback(false, data);
      }
    });

  };

  // var getTargetDetails = function(params, callback){
  //   apiQueryGenerator(params, function(err, target){
  //     if (err){
  //       callback(true, null);
  //     } else {
  //       if (params.ref === 'movie' || params.ref === 'tv'){
  //         params.sub = '/credits';
  //       } else {
  //         params.sub = '/combined_credits';
  //       }
  //       apiQueryGenerator(params, function(err, credits){
  //         if (err) {
  //           callback(true, null);
  //         } else {
  //           // console.log('held up at credits');
  //           callback(false, target, credits);
  //         }
  //       });
  //     }
  //   });
  // };



  return {
    // apiQueryGenerator: apiQueryGenerator,
    getDetails: getDetails,
    getTargetList: getTargetList,
    getDiscoverList: getDiscoverList
  };
};

module.exports = movieDBService;
