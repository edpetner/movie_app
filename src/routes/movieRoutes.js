var express = require('express');
var movieRouter = express.Router();

var router = function(){
  var movieService = require('../services/movieService');
  var movieController = require('../controllers/movieController')(movieService);

  movieRouter.use(movieController.middleware);

  movieRouter.route('/list/discover/:target/')
    .get(movieController.getDiscoverList);
  movieRouter.route('/list/:storeType/:target')
    .get(movieController.getTargetList);
  // For retriving any details, on any store
  movieRouter.route('/:store/:target')
    .get(movieController.getDetails);
  return movieRouter;
};

module.exports = router;
