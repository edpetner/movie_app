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

  var getTargetDetails = function(params, callback){
    apiQueryGenerator(params, function(err, target){
      if (err){
        callback(true, null);
      } else {
        if (params.ref === 'movie' || params.ref === 'tv'){
          params.sub = '/credits';
        } else {
          params.sub = '/combined_credits';
        }
        apiQueryGenerator(params, function(err, credits){
          if (err) {
            callback(true, null);
          } else {
            // console.log('held up at credits');
            callback(false, target, credits);
          }
        });
      }
    });
  };
  // var getPerson = function(params, callback){
  //   apiQueryGenerator(params, function(err, person){
  //     if (err){
  //       callback(true, null);
  //     } else {
  //       if (params.ref === 'movie'){
  //         params.sub = '/credits';
  //       } else {
  //         params.sub = '/combined/credits';
  //       }
  //       apiQueryGenerator(params, function(err, credits){
  //         if (err) {
  //           callback(true, null);
  //         } else {
  //           callback(false, person, credits);
  //         }
  //       });
  //     }
  //   });
  // };


  return {
    // apiQueryGenerator: apiQueryGenerator,
    getTargetDetails: getTargetDetails
  };
};

module.exports = movieDBService;
