const router = require('express').Router();
const { celebrate, Segments, Joi } = require('celebrate');
const validator = require('validator');
const auth = require('../middlewares/auth');

const {
  getAllMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', auth, getAllMovies);
router.post(
  '/',
  auth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message('Invalid Avatar link');
        }),

      trailer: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message('Invalid Trailer link');
        }),
      thumbnail: Joi.string().custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Invalid Tumbnail link');
      }),
      movieId: Joi.required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie
);
router.delete(
  '/:movieId',
  auth,
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteMovie
);

module.exports = router;
