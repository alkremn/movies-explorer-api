const Movie = require('../models/movie');

const {
  SERVER_ERROR,
  INVALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  FORBIDDEN_ERROR,
} = require('../error_codes');

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({})
    .sort('-createdAt')
    .then((movies) => res.send({ data: movies }))
    .catch(() => {
      const error = new Error('Internal Server error');
      error.statusCode = SERVER_ERROR;
      next(error);
    });
};
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'VaidationError' || err.name === 'MongoError') {
        const error = new Error(err.message);
        error.statusCode = INVALID_DATA_ERROR;
        next(error);
      }
    });
};
module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        const error = new Error('Movie not found');
        error.statusCode = NOT_FOUND_ERROR;
        throw error;
      }
      if (movie.owner.toString() !== req.user._id) {
        const error = new Error('Forbidden');
        error.statusCode = FORBIDDEN_ERROR;
        throw error;
      }

      return Movie.deleteOne(movie)
        .then(() => {
          res.end();
        })
        .catch((err) => next(err));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new Error('Invalid id');
        error.statusCode = INVALID_DATA_ERROR;
        throw error;
      } else if (!err.statusCode) {
        const error = new Error(err.message);
        error.statusCode = SERVER_ERROR;
        throw error;
      }
      next(err);
    });
};
