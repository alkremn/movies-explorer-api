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
      if (!movie) {
        console.log(movie);
        const error = new Error('Internal Server error');
        error.statusCode = SERVER_ERROR;
        throw error;
      }
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'VaidationError') {
        const error = new Error(err.message);
        error.statusCode = INVALID_DATA_ERROR;
        next(error);
      } else {
        console.log(err);
        const error = new Error('Internal Server error');
        error.statusCode = SERVER_ERROR;
        next(error);
      }
    });
};
module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((card) => {
      if (!card) {
        const error = new Error('Card not found');
        error.statusCode = NOT_FOUND_ERROR;
        throw error;
      }
      if (card.owner.toString() !== req.user._id) {
        const error = new Error('Forbidden');
        error.statusCode = FORBIDDEN_ERROR;
        throw error;
      }

      Movie.deleteOne(card)
        .then(() => {
          res.end();
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            const error = new Error('Invalid id');
            error.statusCode = INVALID_DATA_ERROR;
            throw error;
          } else {
            const error = new Error(err.message);
            error.statusCode = SERVER_ERROR;
            throw error;
          }
        });
    })
    .catch((err) => next(err));
};
