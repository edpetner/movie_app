var http = require('http');
var url = require('url');
var movieDBService = function(){

  var host = 'api.themoviedb.org';

  // -------------------------------------------
  // All tMDB Queries go through this function
  // -------------------------------------------
  var apiQueryGenerator = function(params, callback){
    params.filters.api_key = process.env.MDB_SECRET;
    var apiPath = url.format({
      pathname: '/3/' + params.ref + '/' + params.target + params.sub,
      query: params.filters
    });
    // console.log(params.filters);
    var options = {
      host: host,
      path: apiPath
    };
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



  return {
    apiQueryGenerator: apiQueryGenerator
  };
};

module.exports = movieDBService;
