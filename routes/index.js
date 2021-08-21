const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const { login, createUser } = require('../controllers/users');

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.post(
  '/signin',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string(),
    }),
  }),
  createUser,
);

module.exports = router;
