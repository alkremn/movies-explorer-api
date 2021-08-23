const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const auth = require('../middlewares/auth');

const { login, createUser } = require('../controllers/users');
const { notFound } = require('../middlewares/errors');

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
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser,
);

router.use(auth, notFound);

module.exports = router;
