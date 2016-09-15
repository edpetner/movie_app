var express = require('express');
var movieRouter = express.Router();

var router = function(){
  var movieService = require('../services/tMDBService');
  var movieController = require('../controllers/movieController')(movieService);

  movieRouter.use(movieController.middleware);
  movieRouter.router('/')
    .get(movieController.getMovieIndex);
  movieRouter.router('/genreIndex')
    .get(movieController.getGenreIndex);
  movieRouter.router('/byGenre')
    .get(movieController.getMoviesByGenre);
  movieRouter.router('/byPerson')
    .get(movieController.getMoviesByPerson);
  movieRouter.router('/byId')
    .get(movieController.getMovieById);
  return movieRouter;
};

module.exports = router;
