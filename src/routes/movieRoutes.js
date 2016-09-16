var express = require('express');
var movieRouter = express.Router();

var router = function(){
  var movieService = require('../services/movieService');
  var movieController = require('../controllers/movieController')(movieService);

  movieRouter.use(movieController.middleware);

  // For retriving any details, on any store
  movieRouter.route('/:storeType/:targetId')
    .get(movieController.getTargetDetails);
  return movieRouter;
};

module.exports = router;
